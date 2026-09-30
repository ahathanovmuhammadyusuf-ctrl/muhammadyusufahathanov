import React from 'react';
import {
  Eye,
  Wand2,
  Share2,
  FileText,
  Palette,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ToolId, ImageAnalysisData } from '../../../types';

interface OverviewPanelProps {
  hasImage: boolean;
  onSelectTool: (tool: ToolId) => void;
  analysisData: ImageAnalysisData | null;
  onTriggerAnalysis: () => void;
  isLoading: boolean;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  hasImage,
  onSelectTool,
  analysisData,
  onTriggerAnalysis,
  isLoading,
}) => {
  const tools = [
    {
      id: 'analyzer' as ToolId,
      name: 'Image Analyzer',
      desc: 'Objects, mood, lighting, framing, & aesthetic classification',
      icon: Eye,
      color: 'text-purple-400',
      bg: 'from-purple-500/10 to-indigo-500/5',
    },
    {
      id: 'prompt' as ToolId,
      name: 'Prompt Generator',
      desc: 'Reverse-engineer Midjourney, FLUX, and SDXL prompts',
      icon: Wand2,
      color: 'text-indigo-400',
      bg: 'from-indigo-500/10 to-blue-500/5',
    },
    {
      id: 'caption' as ToolId,
      name: 'Caption Generator',
      desc: 'Platform-optimized viral captions across 6 tones',
      icon: Share2,
      color: 'text-pink-400',
      bg: 'from-pink-500/10 to-purple-500/5',
    },
    {
      id: 'ocr' as ToolId,
      name: 'Text Extractor',
      desc: 'Detect, edit, copy, and export typography as .txt',
      icon: FileText,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-teal-500/5',
    },
    {
      id: 'colors' as ToolId,
      name: 'Color Analyzer',
      desc: 'Dominant HEX & RGB swatches, harmony, and temperature',
      icon: Palette,
      color: 'text-amber-400',
      bg: 'from-amber-500/10 to-orange-500/5',
    },
    {
      id: 'ideas' as ToolId,
      name: 'Creative Ideas',
      desc: 'Ad campaigns, social posts, thumbnail concepts, & UI ideas',
      icon: Lightbulb,
      color: 'text-rose-400',
      bg: 'from-rose-500/10 to-pink-500/5',
    },
    {
      id: 'ask' as ToolId,
      name: 'Ask AI (Custom Q&A)',
      desc: 'Ask any specific question about details or styling in this photo',
      icon: MessageSquare,
      color: 'text-cyan-400',
      bg: 'from-cyan-500/10 to-blue-500/5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-purple-950/30 via-[#11131e] to-[#0d0e15] p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            PixelMind AI Studio Hub
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Visual Intelligence & Creative Studio
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          {hasImage
            ? 'Your image is loaded into the canvas. Choose any AI tool below or run a full multimodal analysis.'
            : 'Upload an image on the left stage to unlock deep visual analysis, prompt reverse-engineering, and social caption generation.'}
        </p>

        {hasImage && !analysisData && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center gap-3">
            <button
              onClick={onTriggerAnalysis}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Analyzing...' : 'Run Full Image Analysis'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              Parses objects, lighting, mood, and commercial use cases.
            </span>
          </div>
        )}
      </div>

      {/* Analysis Snapshot if available */}
      {analysisData && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Analysis Complete</span>
            </div>
            <button
              onClick={() => onSelectTool('analyzer')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {analysisData.summary}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {analysisData.objects.slice(0, 5).map((obj: string, i: number) => (
              <span
                key={i}
                className="text-[11px] text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
              >
                {obj}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tools Grid */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Available Tools
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                className="group p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/70 hover:bg-[#151825] text-left transition-all duration-200 hover:border-purple-500/30 flex flex-col justify-between active:scale-[0.99]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${t.bg} border border-white/10 flex items-center justify-center`}
                  >
                    <Icon className={`w-4 h-4 ${t.color}`} />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {t.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
