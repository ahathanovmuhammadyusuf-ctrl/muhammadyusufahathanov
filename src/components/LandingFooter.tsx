import React from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';

interface LandingFooterProps {
  onOpenStudio: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenStudio }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#07080c] py-12 md:py-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">PixelMind AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The creative studio for deep image understanding, reverse prompt engineering, and visual intelligence.
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              Engineered with Google Gemini 3
            </div>
          </div>

          {/* Column 1: Studio Features */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Studio Tools
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onOpenStudio} className="hover:text-white transition-colors">
                  Multimodal Analyzer
                </button>
              </li>
              <li>
                <button onClick={onOpenStudio} className="hover:text-white transition-colors">
                  Prompt Decompiler
                </button>
              </li>
              <li>
                <button onClick={onOpenStudio} className="hover:text-white transition-colors">
                  Social Caption Suite
                </button>
              </li>
              <li>
                <button onClick={onOpenStudio} className="hover:text-white transition-colors">
                  OCR Text Extractor
                </button>
              </li>
              <li>
                <button onClick={onOpenStudio} className="hover:text-white transition-colors">
                  Palette Intelligence
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Supported Models */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Vision Models
            </div>
            <ul className="space-y-2 text-slate-400 font-mono text-[11px]">
              <li className="flex items-center gap-1.5 text-purple-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                gemini-3.8-flash (Default)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                gemini-3.1-pro-preview
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                Midjourney v6.1 Syntax
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                FLUX / SDXL Parameters
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Action */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Get Started
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No account required. Drag any image into the canvas to supercharge it with AI.
            </p>
            <button
              onClick={onOpenStudio}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors w-full"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Studio Workspace
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-400 text-xs">
            © {new Date().getFullYear()} PixelMind AI. Built for Google AI Studio.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
