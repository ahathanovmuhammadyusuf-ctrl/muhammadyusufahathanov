import React, { useState } from 'react';
import { ArrowRight, Play, Wand2, Palette, FileText, Share2, Eye, Sparkles } from 'lucide-react';
import { SAMPLE_IMAGES, HERO_STUDIO_IMAGE } from '../data/samples';
import { SampleImage } from '../types';

interface LandingHeroProps {
  onOpenStudio: () => void;
  onSelectSample: (sample: SampleImage) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenStudio, onSelectSample }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'colors' | 'captions' | 'analysis'>('prompt');

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-pink-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">
              Powered by Google Gemini 3 Multimodal Vision
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
            Your Image.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              Supercharged by AI.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Understand, analyze and create with the power of Gemini AI. Reverse-engineer prompts, extract text, curate color palettes, and generate viral captions in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={onOpenStudio}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-xl hover:opacity-95 shadow-xl shadow-purple-600/25 active:scale-[0.98] transition-all duration-200"
            >
              <span>Try PixelMind</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectSample(SAMPLE_IMAGES[0])}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] rounded-xl backdrop-blur-md active:scale-[0.98] transition-all duration-200"
            >
              <Play className="w-4 h-4 text-purple-400 fill-purple-400/20" />
              <span>See Demo Studio</span>
            </button>
          </div>
        </div>

        {/* Interactive Studio Preview Showcase */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/[0.12] bg-[#11131c]/90 backdrop-blur-2xl shadow-2xl shadow-purple-950/40 overflow-hidden">
            {/* Window header */}
            <div className="px-4 py-3 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                  pixelmind-studio // gemini-multimodal-vision
                </span>
              </div>

              {/* Interactive Inspector Tabs */}
              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06]">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'prompt' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Prompt
                </button>
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'colors' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Colors
                </button>
                <button
                  onClick={() => setActiveTab('captions')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'captions' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Captions
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'analysis' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Analysis
                </button>
              </div>
            </div>

            {/* Showcase Visual Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
              {/* Left: Hero Image Preview */}
              <div className="lg:col-span-7 relative group overflow-hidden bg-black/40 min-h-[260px] sm:min-h-[340px]">
                <img
                  src={HERO_STUDIO_IMAGE}
                  alt="PixelMind AI Creative Studio Visualizer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-purple-300 font-semibold">Active Session:</span> Prism Dispersion Studio
                  </div>
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-mono tabular-nums text-slate-300">
                    2400 × 1350 · 24-bit
                  </div>
                </div>
              </div>

              {/* Right: Live Interactive Output Inspector */}
              <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-950/60 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/[0.08]">
                {activeTab === 'prompt' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider">
                        <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Reverse-Engineered Prompt</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Midjourney v6.1 ready
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-200 font-mono leading-relaxed max-h-44 overflow-y-auto">
                      &quot;A futuristic minimalist creative studio canvas with glowing holographic optical prism refracting sharp light beams into electric violet, neon indigo, and soft rose amber gradients across an obsidian slate surface, shot on Hasselblad H6D-100c, 8k commercial editorial --ar 16:9 --style raw&quot;
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] text-slate-400 font-medium">Deconstructed Parameters:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                          <span className="text-slate-500 block text-[10px]">Lighting</span>
                          <span className="text-slate-200 font-medium">Prismatic Refraction</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                          <span className="text-slate-500 block text-[10px]">Aesthetic</span>
                          <span className="text-slate-200 font-medium">Obsidian Studio Noir</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'colors' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-pink-300 uppercase tracking-wider">
                        <Palette className="w-3.5 h-3.5 text-pink-400" />
                        <span>Extracted Color Palette</span>
                      </div>
                      <span className="text-[11px] text-slate-400">5 Harmonic Swatches</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: 'Obsidian Void', hex: '#0B0C12', pct: '48%', role: 'Dominant Background' },
                        { name: 'Electric Violet', hex: '#8B5CF6', pct: '24%', role: 'Prism Core' },
                        { name: 'Neon Indigo', hex: '#6366F1', pct: '14%', role: 'Refraction Beam' },
                        { name: 'Rose Sunset', hex: '#EC4899', pct: '9%', role: 'Highlight Accent' },
                        { name: 'Amber Glow', hex: '#F59E0B', pct: '5%', role: 'Specular Flare' },
                      ].map((c) => (
                        <div
                          key={c.hex}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                              style={{ backgroundColor: c.hex }}
                            />
                            <div>
                              <div className="text-xs font-medium text-white">{c.name}</div>
                              <div className="text-[10px] text-slate-400">{c.role}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-xs text-purple-300 tabular-nums">{c.hex}</span>
                            <span className="text-[10px] text-slate-500 block tabular-nums">{c.pct}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'captions' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                        <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Social Copy Engine</span>
                      </div>
                      <span className="text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Instagram · Luxury
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-200 leading-relaxed">
                      &quot;Light doesn&apos;t just illuminate; it bends reality when focused through the right medium. Inside our newest creative exploration, where deep obsidian meets pure spectral violet. Which wavelength speaks to your design philosophy? 🔮✨&quot;
                      <div className="mt-2 text-purple-300 text-[11px] font-medium">
                        #CreativeStudio #DesignInspiration #VisualAlchemy #GenerativeArt #LuxuryDesign
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
                      <span>Tone Match: High Luxury (98%)</span>
                      <span className="text-[11px] text-purple-400">182 characters</span>
                    </div>
                  </div>
                )}

                {activeTab === 'analysis' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Computer Vision Insights</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Multi-Layer Verified
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">Primary Composition</span>
                        <span className="text-slate-200">Centered diagonal dynamic tension with triangular refraction rays.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">Atmosphere & Mood</span>
                        <span className="text-slate-200">High-end contemporary design lab, contemplative, avant-garde.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">Best Commercial Fit</span>
                        <span className="text-slate-200">SaaS Hero backdrop, premium hardware packaging, high-tech marketing.</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Try with your own photo or a sample
                  </span>
                  <button
                    onClick={onOpenStudio}
                    className="text-xs font-medium text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector Bar */}
        <div id="showcase" className="mt-14 max-w-4xl mx-auto">
          <div className="text-center mb-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or pick an instant sample to analyze immediately
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-purple-500/30 text-left transition-all duration-200 flex items-center gap-3 active:scale-[0.98]"
              >
                <img
                  src={sample.url}
                  alt={sample.title}
                  className="w-14 h-14 rounded-lg object-cover border border-white/10 group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{sample.category}</div>
                  <div className="text-[10px] text-purple-400/90 mt-0.5">Click to analyze →</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
