import React from 'react';
import { Eye, Wand2, Share2, FileText, Palette, Lightbulb, ArrowUpRight } from 'lucide-react';
import { ToolId } from '../types';

interface LandingFeaturesProps {
  onSelectFeature: (toolId: ToolId) => void;
}

export const LandingFeatures: React.FC<LandingFeaturesProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'analyzer' as ToolId,
      title: 'Neural Image Analyzer',
      tagline: 'Deep multimodal deconstruction',
      description:
        'Deconstructs objects, human subjects, lighting temperature, composition geometry, emotional tone, and photographic style with granular AI vision precision.',
      icon: Eye,
      accent: 'from-purple-500/20 to-indigo-500/5',
      iconColor: 'text-purple-400',
      badge: 'Multimodal Vision',
    },
    {
      id: 'prompt' as ToolId,
      title: 'AI Prompt Generator',
      tagline: 'Reverse-engineer any aesthetic',
      description:
        'Turns any reference photo into a master generation prompt for Midjourney, FLUX, and Imagen 3. Deconstructs camera gear, lighting setups, and negative prompts.',
      icon: Wand2,
      accent: 'from-indigo-500/20 to-blue-500/5',
      iconColor: 'text-indigo-400',
      badge: 'Midjourney & FLUX',
    },
    {
      id: 'caption' as ToolId,
      title: 'Social Caption Suite',
      tagline: 'Platform-optimized viral copy',
      description:
        'Generates 3 distinct caption angles tailored for Instagram, TikTok, LinkedIn, or X/Twitter. Select from 6 distinct voices ranging from Ultra-Luxury to Viral Humor.',
      icon: Share2,
      accent: 'from-pink-500/20 to-purple-500/5',
      iconColor: 'text-pink-400',
      badge: '4 Platforms · 6 Tones',
    },
    {
      id: 'ocr' as ToolId,
      title: 'Precision OCR Extractor',
      tagline: 'Text, signage & typography',
      description:
        'Detects and isolates readable text, brand logos, signage, and handwritten notes. Edit right inside the studio, copy to clipboard, or download directly as a .txt file.',
      icon: FileText,
      accent: 'from-emerald-500/20 to-teal-500/5',
      iconColor: 'text-emerald-400',
      badge: 'Instant .TXT Export',
    },
    {
      id: 'colors' as ToolId,
      title: 'Color Palette Intelligence',
      tagline: 'Harmonic swatches & metrics',
      description:
        'Extracts the dominant and accent color swatches with precise HEX, RGB, coverage percentages, color temperature, and color-wheel harmony classifications.',
      icon: Palette,
      accent: 'from-amber-500/20 to-orange-500/5',
      iconColor: 'text-amber-400',
      badge: '1-Click HEX Copy',
    },
    {
      id: 'ideas' as ToolId,
      title: 'Commercial Creative Ideas',
      tagline: 'Actionable campaign concepts',
      description:
        'Generates 6 commercial concepts: ad campaigns, short-form reels, high-CTR thumbnails, product photography upgrades, and brand identity applications.',
      icon: Lightbulb,
      accent: 'from-rose-500/20 to-purple-500/5',
      iconColor: 'text-rose-400',
      badge: 'Strategy & Campaigns',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            Core AI Studio Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Everything your visual workflow needs in one workspace.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From creative directors to content creators and prompt engineers, PixelMind AI unlocks unprecedented visual intelligence for every image.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative rounded-2xl border border-white/[0.08] bg-[#11131c]/70 hover:bg-[#151824]/90 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-950/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <div className="text-xs font-medium text-purple-400/90 mt-1 mb-3">
                    {feature.tagline}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => feature.id && onSelectFeature(feature.id)}
                    className="text-xs font-semibold text-slate-300 group-hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Launch in Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">Gemini 3 Vision</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
