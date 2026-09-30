import React from 'react';
import { Sparkles, ArrowRight, LayoutDashboard, Home, Video, Play } from 'lucide-react';

interface NavbarProps {
  currentView: 'intro-reel' | 'studio' | 'landing';
  onNavigate: (view: 'intro-reel' | 'studio' | 'landing') => void;
  onOpenSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSection }) => {
  const handleNavClick = (sectionId: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    if (onOpenSection) onOpenSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#090a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => onNavigate('intro-reel')}
          className="text-left group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            PixelMind AI
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('intro-reel')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'intro-reel' ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>13-Yoshli Intro Reel</span>
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'studio' ? 'text-purple-400 font-bold' : 'hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Creative Image Studio</span>
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Workflow
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {currentView !== 'intro-reel' ? (
            <button
              onClick={() => onNavigate('intro-reel')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 rounded-lg hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all duration-200 active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Intro Video</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('studio')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
              <span>Open Image Studio</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
