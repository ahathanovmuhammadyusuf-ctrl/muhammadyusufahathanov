export type ToolId = 
  | 'overview'
  | 'analyzer'
  | 'prompt'
  | 'caption'
  | 'ocr'
  | 'colors'
  | 'ideas'
  | 'ask'
  | 'history'
  | 'settings';

export type SocialPlatform = 'instagram' | 'tiktok' | 'linkedin' | 'twitter';
export type CaptionTone = 'professional' | 'funny' | 'minimal' | 'luxury' | 'viral' | 'emotional';
export type PromptStyle = 'photorealistic' | 'cinematic' | 'minimalist' | 'anime' | 'digital_art' | 'editorial';

export interface ImageAnalysisData {
  summary: string;
  objects: string[];
  people: {
    present: boolean;
    count: number;
    description: string;
  };
  environment: {
    setting: string;
    timeAndWeather: string;
    details: string;
  };
  mood: {
    primary: string;
    keywords: string[];
    narrative: string;
  };
  composition: {
    framing: string;
    focalPoint: string;
    depthOfField: string;
    perspective: string;
  };
  lighting: {
    type: string;
    quality: string;
    highlightsShadows: string;
  };
  style: {
    aesthetic: string;
    artisticInfluences: string;
    visualPurity: string;
  };
  colorPalette: {
    overview: string;
    dominantTones: string[];
    temperature: string;
  };
  useCases: Array<{
    domain: string;
    recommendation: string;
  }>;
}

export interface PromptGenData {
  masterPrompt: string;
  breakdown: {
    subject: string;
    environment: string;
    composition: string;
    lighting: string;
    camera: string;
    colors: string;
    style: string;
    details: string;
  };
  negativePrompt: string;
  technicalParams: {
    aspectRatio: string;
    stylize: string;
    version: string;
  };
  variations: Array<{
    name: string;
    prompt: string;
  }>;
}

export interface CaptionItem {
  id: number;
  hookTitle: string;
  body: string;
  callToAction: string;
  hashtags: string[];
}

export interface CaptionGenData {
  platform: SocialPlatform;
  tone: CaptionTone;
  captions: CaptionItem[];
}

export interface OcrItem {
  text: string;
  location: string;
  confidence: string;
  style: string;
}

export interface OcrData {
  detected: boolean;
  fullText: string;
  language: string;
  items: OcrItem[];
  contextSummary: string;
}

export interface AltTextData {
  conciseAlt: string;
  descriptiveAlt: string;
  socialAlt: string;
  keyFocalElements: string[];
  accessibilityScore: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  rgb: string;
  percentage: number;
  role: string;
  description: string;
}

export interface ColorAnalysisData {
  dominantPalette: ColorSwatch[];
  harmony: {
    type: string;
    description: string;
  };
  temperature: {
    tone: string;
    kelvinEstimate: string;
  };
  contrastRatio: string;
  stylingRecommendation: string;
}

export interface CreativeConcept {
  category: string;
  title: string;
  pitch: string;
  targetAudience: string;
  executionTip: string;
}

export interface CreativeIdeasData {
  creativeCore: string;
  concepts: CreativeConcept[];
}

export interface AskAiData {
  question: string;
  answer: string;
  keyObservations: string[];
  followUpSuggestions: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  tool: ToolId;
  toolTitle: string;
  imageThumbnail: string; // low-res thumbnail or data URI
  summary: string;
  data: any;
}

export interface SampleImage {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
  dimensions: string;
  aspectRatio: string;
}

export interface UserSettings {
  model: string;
  defaultTone: CaptionTone;
  defaultPromptStyle: PromptStyle;
  autoAnalyzeOnUpload: boolean;
}
