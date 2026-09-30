import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Set payload limits for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Google GenAI initialization with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Resilient helper to call Gemini with retry and fallback on temporary high demand
async function callGeminiVision(
  ai: GoogleGenAI,
  model: string,
  imagePart: any,
  textPrompt: string,
  responseMimeType = 'application/json'
) {
  const tryCall = async (targetModel: string) => {
    return await ai.models.generateContent({
      model: targetModel,
      contents: { parts: [imagePart, { text: textPrompt }] },
      config: {
        responseMimeType,
      },
    });
  };

  try {
    return await tryCall(model);
  } catch (error: any) {
    const errorStr = error?.message || String(error);
    const isUnavailable =
      errorStr.includes('503') ||
      errorStr.includes('high demand') ||
      errorStr.includes('UNAVAILABLE') ||
      errorStr.includes('RESOURCE_EXHAUSTED');

    if (isUnavailable) {
      // Small pause and retry with gemini-flash-latest or gemini-3.8-flash
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const fallbackModel = model === 'gemini-3.8-flash' ? 'gemini-flash-latest' : 'gemini-3.8-flash';
      try {
        return await tryCall(fallbackModel);
      } catch (fallbackError: any) {
        throw new Error(
          'Gemini AI is currently experiencing high global demand. Please retry in a few seconds.'
        );
      }
    }

    try {
      const parsed = JSON.parse(error.message);
      if (parsed.error?.message) {
        throw new Error(parsed.error.message);
      }
    } catch {
      // not JSON
    }
    throw error;
  }
}

// Health and configuration check
app.get('/api/status', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    configured: hasKey,
    defaultModel: 'gemini-3.8-flash',
    supportedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  });
});

// Uzbek voiceover TTS generator
app.post('/api/tts/intro', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, style, voice } = req.body;
    const spokenText =
      text ||
      'Men 13 yoshdaman. Men IT bilan shug‘ullanaman va avtomobillar haqida kontent yarataman. Texnologiya va mashinalar — mening eng katta qiziqishlarim!';

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: spokenText,
              speechMetadata: {
                style:
                  style ||
                  'Natural, energetic and clear 13-year-old Uzbek boy speaking modern conversational Uzbek with pride and enthusiasm.',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ ok: true, audioBase64: base64Audio, format: 'audio/wav' });
      return;
    }
    res.status(500).json({ error: 'No audio stream returned' });
  } catch (err: any) {
    console.error('TTS error:', err);
    res.status(500).json({ error: err?.message || 'TTS generation failed' });
  }
});

// Main multimodal handler
app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType, action, options = {} } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'No image data provided.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const validMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const safeMime = validMimes.includes(mimeType) ? mimeType : 'image/jpeg';

    let ai: GoogleGenAI;
    try {
      ai = getGeminiClient();
    } catch {
      res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in the environment.',
      });
      return;
    }

    const selectedModel = options.model || 'gemini-3.8-flash';

    const imagePart = {
      inlineData: {
        mimeType: safeMime,
        data: cleanBase64,
      },
    };

    if (action === 'analyze') {
      const prompt = `You are an elite creative director, visual artist, and computer vision specialist.
Analyze this uploaded image with high precision, aesthetic depth, and structured clarity.
Return a valid JSON object matching this schema:
{
  "summary": "Concise 2-sentence executive summary of the image.",
  "objects": ["List of prominent physical objects identified"],
  "people": {
    "present": boolean,
    "count": number,
    "description": "Details about individuals, expressions, postures, wardrobe, or state if present, or 'No people detected'."
  },
  "environment": {
    "setting": "Setting type (e.g. Urban street, Minimalist studio, Nature, Sci-fi interior)",
    "timeAndWeather": "Time of day, atmospheric condition, lighting context",
    "details": "Specific environmental textures and background nuances"
  },
  "mood": {
    "primary": "Single dominant emotional tone (e.g. Melancholic, Luxurious, Energetic, Ethereal)",
    "keywords": ["3-5 emotional or thematic keywords"],
    "narrative": "One sentence explaining why the viewer feels this mood"
  },
  "composition": {
    "framing": "e.g. Rule of thirds, centered symmetry, Dutch angle, wide panoramic, close-up macro",
    "focalPoint": "Exact focal point and how viewer gaze is guided",
    "depthOfField": "Shallow, deep, medium, with background blur details",
    "perspective": "Eye-level, low angle, bird's eye view, worm's eye view"
  },
  "lighting": {
    "type": "e.g. Natural diffused, Golden hour, High-key studio, Low-key chiaroscuro, Neon rim light",
    "quality": "Soft, harsh, cinematic, directional",
    "highlightsShadows": "Analysis of dynamic range, contrast, shadow roll-off"
  },
  "style": {
    "aesthetic": "Primary artistic/photographic aesthetic (e.g. Commercial luxury, Cyberpunk noir, Film grain editorial)",
    "artisticInfluences": "Photographers, cinematic directors, or artistic movements this resembles",
    "visualPurity": "Rating or commentary on minimalism vs complexity"
  },
  "colorPalette": {
    "overview": "Summary of color relationships",
    "dominantTones": ["Color 1", "Color 2", "Color 3"],
    "temperature": "Warm, Cool, or Balanced"
  },
  "useCases": [
    {
      "domain": "e.g. E-Commerce / Advertising / Editorial / Social / UI Design",
      "recommendation": "Concrete tactical way this image or aesthetic can be commercialized or deployed"
    }
  ]
}
Ensure the output is purely valid JSON without markdown fences.`;

      const response = await callGeminiVision(ai, selectedModel, imagePart, prompt);
      const parsed = JSON.parse(response.text || '{}');
      res.json({ action: 'analyze', data: parsed });
      return;
    }

    if (action === 'prompt') {
      const promptStyle = options.promptStyle || 'photorealistic';
      const prompt = `You are a world-class prompt engineer for generative AI models (Midjourney v6, Imagen 3, Stable Diffusion XL, FLUX).
Deconstruct this image completely and reverse-engineer the prompt that could recreate an image with this exact aesthetic, composition, subject, lighting, and detail fidelity.
Style emphasis requested: ${promptStyle}.

Return a valid JSON object matching this schema:
{
  "masterPrompt": "Full, ready-to-copy AI generation prompt combining subject, composition, lighting, camera gear, atmosphere, and styling into a single masterpiece prompt.",
  "breakdown": {
    "subject": "Detailed description of the core subject(s), pose, expression, clothing, materials",
    "environment": "Backdrop, atmosphere, scenery, textures, weather, era",
    "composition": "Framing, shot type (e.g. extreme close-up, medium portrait), golden ratio, leading lines",
    "lighting": "Light source, direction, rim lighting, specular highlights, color temperature",
    "camera": "Simulated camera body (e.g. Hasselblad H6D-100c, Leica M11), lens (e.g. 85mm f/1.2), shutter/aperture specs, ISO, film stock if applicable",
    "colors": "Color grading, palette tones, contrast curve, saturation level",
    "style": "Visual style tags (e.g. cinematic realism, editorial Vogue spread, hyper-detailed, octane render)",
    "details": "Micro-textures, reflections, dust particles, fabric weave, surface patina"
  },
  "negativePrompt": "Terms to exclude (e.g. oversaturated, distorted anatomy, cartoonish, low resolution, blurry)",
  "technicalParams": {
    "aspectRatio": "Suggested aspect ratio (e.g. --ar 16:9, --ar 4:5, --ar 1:1)",
    "stylize": "Suggested stylize / guidance scale",
    "version": "Midjourney v6.1 / Imagen 3 / SDXL compatible"
  },
  "variations": [
    {
      "name": "Cinematic Film Variation",
      "prompt": "Variant prompt tuned for 35mm film grain, anamorphic flare, and Kodak Portra tones"
    },
    {
      "name": "Minimalist Studio Variation",
      "prompt": "Variant prompt tuned for ultra-clean commercial studio catalog look"
    }
  ]
}
Ensure the output is purely valid JSON without markdown fences.`;

      const response = await callGeminiVision(ai, selectedModel, imagePart, prompt);
      const parsed = JSON.parse(response.text || '{}');
      res.json({ action: 'prompt', data: parsed });
      return;
    }

    if (action === 'caption') {
      const platform = options.platform || 'instagram';
      const tone = options.tone || 'luxury';
      const prompt = `You are an elite social media strategist and viral copywriter.
Generate 3 distinct, high-impact social media captions based on this image.
Target Platform: ${platform.toUpperCase()}
Desired Tone: ${tone.toUpperCase()}

Return a valid JSON object matching this schema:
{
  "platform": "${platform}",
  "tone": "${tone}",
  "captions": [
    {
      "id": 1,
      "hookTitle": "Short catchy angle name (e.g. 'The Provocative Hook' or 'Story-Driven Angle')",
      "body": "The full caption text formatted cleanly with line breaks, emojis if appropriate for platform, and compelling copy.",
      "callToAction": "Clear CTA (e.g. 'Drop a ⚡ if you agree', 'Link in bio to read the case study')",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    },
    {
      "id": 2,
      "hookTitle": "Second distinct angle name (e.g. 'Minimalist & Punchy')",
      "body": "Caption body...",
      "callToAction": "Clear CTA...",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    },
    {
      "id": 3,
      "hookTitle": "Third distinct angle name (e.g. 'Behind-The-Scenes / Insight')",
      "body": "Caption body...",
      "callToAction": "Clear CTA...",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    }
  ]
}
Ensure the output is purely valid JSON without markdown fences.`;

      const response = await callGeminiVision(ai, selectedModel, imagePart, prompt);
      const parsed = JSON.parse(response.text || '{}');
      res.json({ action: 'caption', data: parsed });
      return;
    }

    if (action === 'ocr') {
      const prompt = `Examine this image and extract ALL readable text, typography, inscriptions, labels, brand logos, numbers, barcodes, or handwriting.
Return a valid JSON object matching this schema:
{
  "detected": boolean (true if text was found, false otherwise),
  "fullText": "All extracted text joined coherently in read order, preserving line breaks",
  "language": "Detected language(s), e.g. English, Japanese, French, or 'None'",
  "items": [
    {
      "text": "Extracted string",
      "location": "Where on image (e.g. Top header, center packaging, lower left signboard)",
      "confidence": "High / Medium / Low",
      "style": "e.g. Bold sans-serif, Handwritten cursive, Neon sign typography, Embossed logo"
    }
  ],
  "contextSummary": "Brief note on what the text represents (e.g. 'Product ingredients list', 'Storefront signage', 'Editorial magazine title', 'No text found in this landscape')."
}
Ensure the output is purely valid JSON without markdown fences.`;

      const response = await callGeminiVision(ai, selectedModel, imagePart, prompt);
      const parsed = JSON.parse(response.text || '{}');
      res.json({ action: 'ocr', data: parsed });
      return;
    }

    if (action === 'alt_text') {
      const prompt = `You are a certified digital accessibility (WCAG 2.2 AAA) and SEO visual metadata expert.
Generate professional alt text and accessibility descriptions for this image.
Return a valid JSON object matching this schema:
{
  "conciseAlt": "Standard HTML alt attribute text: accurate, concise (under 125 characters), no 'picture of' or 'image of' prefixes, screen-reader optimized.",
  "descriptiveAlt": "Comprehensive description (2-4 sentences) detailing the main subject, setting, colors, textures, and emotional context for visually impaired users who want a rich understanding.",
  "socialAlt": "Optimized alt description for social platforms (Twitter, LinkedIn) emphasizing visual narrative and context.",
  "keyFocalElements": ["Subject 1", "Key background element", "Color/lighting tone"],
  "accessibilityScore": "High (Compliant with WCAG 1.1.1 Non-text Content)"
}
Ensure the output is purely valid JSON without markdown fences.`;

      const response = await callGeminiVision(ai, selectedModel, imagePart, prompt);
      const parsed = JSON.parse(response.text || '{}');
      res.json({ action: 'alt_text', data: parsed });
      return;
    }

    if (action === 'colors') {
      const prompt = `Perform a rigorous aesthetic color analysis on this image.
Identify 5 to 7 dominant and accent colors.
Return a valid JSON object matching this schema:
{
  "dominantPalette": [
    {
      "name": "Evocative color name (e.g. 'Obsidian Slate', 'Deep Cyber Violet', 'Warm Terracotta')",
      "hex": "#RRGGBB",
      "rgb": "rgb(R, G, B)",
      "percentage": number (estimated percentage coverage from 1 to 100),
      "role": "Dominant | Secondary | Accent | Highlight | Background",
      "description": "How this color operates visually in the composition"
    }
  ],
  "harmony": {
    "type": "Complementary / Analogous / Monochromatic / Triadic / Split-Complementary / Muted Neutral",
    "description": "Explanation of how these colors interact and balance"
  },
  "temperature": {
    "tone": "Warm | Cool | Balanced / Neutral",
    "kelvinEstimate": "e.g. ~3200K (Warm tungsten) or ~6500K (Cool daylight) or ~4500K (Neutral)"
  },
  "contrastRatio": "High / Medium / Subtle",
  "stylingRecommendation": "Advice on how a designer can use this palette in web UI or print collateral"
}
Ensure the output is purely valid JSON without markdown fences.`;

      const response = await callGeminiVision(ai, selectedModel, imagePart, prompt);
      const parsed = JSON.parse(response.text || '{}');
      res.json({ action: 'colors', data: parsed });
      return;
    }

    if (action === 'ideas') {
      const prompt = `You are a high-level creative strategist, agency director, and content producer.
Based on the visual world, mood, and subject of this image, generate 6 actionable, commercial, and creative concepts across diverse media formats.
Return a valid JSON object matching this schema:
{
  "creativeCore": "One sentence summarizing the creative hook or world suggested by this image.",
  "concepts": [
    {
      "category": "Commercial & Advertising Campaign",
      "title": "Campaign Concept Title",
      "pitch": "Detailed explanation of the campaign idea, visual hook, and messaging.",
      "targetAudience": "Who this appeals to",
      "executionTip": "Concrete step for execution (e.g. lighting setup, copy angle, media placement)"
    },
    {
      "category": "Social Media Series & Reels",
      "title": "Content Format Title",
      "pitch": "Detailed content series format or short-form video concept.",
      "targetAudience": "Who this appeals to",
      "executionTip": "Concrete production tip"
    },
    {
      "category": "Thumbnail & High-CTR Hook",
      "title": "Thumbnail Concept Title",
      "pitch": "How to crop or augment this visual for a high-converting YouTube or article thumbnail.",
      "targetAudience": "Who this appeals to",
      "executionTip": "Text overlay and crop recommendation"
    },
    {
      "category": "Product Photography & Staging Upgrade",
      "title": "Staging Improvement Title",
      "pitch": "How to elevate the production value, props, or physical staging.",
      "targetAudience": "Who this appeals to",
      "executionTip": "Lighting, props, or lens modification"
    },
    {
      "category": "Design & UI / Brand Identity",
      "title": "Brand Application Title",
      "pitch": "How this image's aesthetic translates into a website hero, app theme, or packaging design.",
      "targetAudience": "Who this appeals to",
      "executionTip": "UI palette and typography pairing"
    },
    {
      "category": "Spin-off & Derivative Art",
      "title": "Derivative Art Title",
      "pitch": "Creative derivative direction (e.g. surreal 3D animation, vintage Risograph print, album cover).",
      "targetAudience": "Who this appeals to",
      "executionTip": "Artistic technique or software pipeline"
    }
  ]
}
Ensure the output is purely valid JSON without markdown fences.`;

      const response = await callGeminiVision(ai, selectedModel, imagePart, prompt);
      const parsed = JSON.parse(response.text || '{}');
      res.json({ action: 'ideas', data: parsed });
      return;
    }

    if (action === 'ask') {
      const question = options.customQuestion || 'What are the most notable aesthetic characteristics of this image?';
      const prompt = `You are PixelMind AI, an elite visual intelligence engine and creative advisor.
The user is asking a specific question about the attached image:
"${question}"

Provide a thorough, highly insightful, articulate, and actionable answer.
Reference specific details in the image (composition, lighting, objects, styling, textures, colors).
Return a valid JSON object matching this schema:
{
  "question": "${question.replace(/"/g, '\\"')}",
  "answer": "Detailed, eloquently formatted markdown answer with bullet points or sections where appropriate.",
  "keyObservations": ["Observation 1", "Observation 2", "Observation 3"],
  "followUpSuggestions": ["Suggested relevant follow-up question 1", "Suggested relevant follow-up question 2"]
}
Ensure the output is purely valid JSON without markdown fences.`;

      const response = await callGeminiVision(ai, selectedModel, imagePart, prompt);
      const parsed = JSON.parse(response.text || '{}');
      res.json({ action: 'ask', data: parsed });
      return;
    }

    res.status(400).json({ error: `Unknown action '${action}'.` });
  } catch (error: any) {
    console.error('API Error in /api/analyze:', error);
    res.status(500).json({
      error: error?.message || 'An error occurred during Gemini image analysis.',
    });
  }
});

// Full-stack Vite / Express integration
const startServer = async () => {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PixelMind AI server running on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
