import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export const LandingTestimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Elena Rostova',
      role: 'Creative Director',
      company: 'Aetheric Brand Studios',
      avatar: 'ER',
      quote:
        'PixelMind AI reduced our campaign moodboarding phase from 4 days to under 45 minutes. The Prompt Generator reverse-engineers lighting and lens specs with uncanny accuracy, allowing us to keep consistent art direction across global photo shoots.',
      metrics: '85% faster visual concepting',
    },
    {
      name: 'Marcus Vance',
      role: 'Lead Prompt Engineer & Visual Artist',
      company: 'Synthetica Media',
      avatar: 'MV',
      quote:
        'The level of detail in the prompt decompiler is unmatched. It doesn’t just guess keywords; it dissects volumetric lighting, camera rigs, and aesthetic eras. Being able to extract dominant hex palettes and copy them with one click speeds up our Figma handover immensely.',
      metrics: '1,400+ production prompts generated',
    },
    {
      name: 'Sophie Tanaka',
      role: 'Head of Growth Marketing',
      company: 'Veloce Commerce',
      avatar: 'ST',
      quote:
        'Generating distinct platform-tailored copy for 60+ weekly product images used to take our copywriting team 12 hours. With PixelMind’s Caption Suite and tone controls, we maintain luxury brand consistency while increasing organic reach by 42%.',
      metrics: '+42% social engagement lift',
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-300">
            <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            Verified Creative Impact
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Trusted by creators and studios.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            See how top creative agencies, e-commerce brands, and prompt engineers use PixelMind AI every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-white/[0.08] bg-[#11131c]/70 p-7 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic mb-6">
                  &quot;{r.quote}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-xs text-white">
                    {r.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{r.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {r.role} · {r.company}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-purple-300 text-right">
                  {r.metrics}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Architecture banner */}
        <div id="capabilities" className="mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Enterprise AI Architecture & Zero-Retention Security
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Server-side Gemini 3 execution keeps your API keys safe from the browser. Image buffers are processed in memory and never indexed or used for training.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Gemini 3.8 Flash Active
          </div>
        </div>
      </div>
    </section>
  );
};
