import React from 'react';
import { UploadCloud, Cpu, Layers, Sparkles } from 'lucide-react';

export const LandingWorkflow: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Ingest & Upload Image',
      desc: 'Drag & drop any PNG, JPG, JPEG, or WEBP asset up to 50MB. PixelMind instantly parses dimensions, aspect ratio, and metadata.',
      icon: UploadCloud,
    },
    {
      number: '02',
      title: 'Multimodal Vision Synthesis',
      desc: 'Google Gemini 3 multimodal vision decodes the visual semantics: subjects, chromatic balances, lighting vectors, and environmental mood.',
      icon: Cpu,
    },
    {
      number: '03',
      title: 'Extract & Create Instantly',
      desc: 'Export production-ready Midjourney prompts, platform-ready social captions, dominant HEX palettes, or complete creative strategy briefs.',
      icon: Layers,
    },
  ];

  return (
    <section id="workflow" className="py-20 md:py-28 border-t border-b border-white/[0.06] bg-black/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Seamless 3-Step Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            How PixelMind AI works.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminate tedious manual visual analysis. Go from raw imagery to actionable creative assets in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/[0.08] bg-[#11131c]/60 p-7 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Phase {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
