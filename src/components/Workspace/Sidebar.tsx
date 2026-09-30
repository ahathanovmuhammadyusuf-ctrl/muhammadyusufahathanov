import React from 'react';
import {
  LayoutDashboard,
  Eye,
  Wand2,
  Share2,
  FileText,
  Palette,
  Lightbulb,
  MessageSquare,
  History,
  Settings,
  Sparkles,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { ToolId } from '../../types';

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (tool: ToolId) => void;
  hasImage: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  imageThumbnail?: string;
  imageName?: string;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTool,
  onSelectTool,
  hasImage,
  mobileOpen,
  onCloseMobile,
  imageThumbnail,
  imageName,
  historyCount,
}) => {
  const navItems: Array<{
    id: ToolId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    requiresImage?: boolean;
  }> = [
    { id: 'overview', label: 'Studio Overview', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Image Analyzer', icon: Eye, requiresImage: true },
    { id: 'prompt', label: 'Prompt Generator', icon: Wand2, requiresImage: true },
    { id: 'caption', label: 'Caption Generator', icon: Share2, requiresImage: true },
    { id: 'ocr', label: 'Text Extractor', icon: FileText, requiresImage: true },
    { id: 'colors', label: 'Color Analyzer', icon: Palette, requiresImage: true },
    { id: 'ideas', label: 'Creative Ideas', icon: Lightbulb, requiresImage: true },
    { id: 'ask', label: 'Ask AI (Q&A)', icon: MessageSquare, requiresImage: true },
    { id: 'history', label: 'History', icon: History, badge: historyCount > 0 ? String(historyCount) : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: ToolId) => {
    onSelectTool(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0d0e15] border-r border-white/[0.08] w-64 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">PixelMind Studio</div>
            <div className="text-[10px] text-purple-400 font-mono">Gemini 3 Multimodal</div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Loaded Image Indicator Card */}
      {hasImage && (
        <div className="p-3 mx-3 mt-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2.5">
          {imageThumbnail ? (
            <img
              src={imageThumbnail}
              alt="Current"
              className="w-9 h-9 rounded-lg object-cover border border-purple-500/30 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-white truncate">
              {imageName || 'Active Photo'}
            </div>
            <div className="text-[10px] text-purple-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Ready for AI tools</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Item List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Studio Tools
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTool === item.id;
          const disabled = item.requiresImage && !hasImage;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md shadow-purple-950/40'
                  : disabled
                  ? 'text-slate-400 hover:text-slate-300 hover:bg-white/[0.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : disabled ? 'text-slate-400' : 'text-slate-400 group-hover:text-purple-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/[0.08] text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>API Connected</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">v3.8 Flash</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {content}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
