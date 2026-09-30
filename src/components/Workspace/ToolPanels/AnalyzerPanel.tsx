import React, { useState } from 'react';
import {
  Eye,
  Sparkles,
  Users,
  Compass,
  Smile,
  Layers,
  Sun,
  Palette,
  Briefcase,
  Copy,
  Check,
  RefreshCw,
  Box,
} from 'lucide-react';
import { ImageAnalysisData } from '../../../types';
import { useToast } from '../../Toast';

interface AnalyzerPanelProps {
  data: ImageAnalysisData | null;
  isLoading: boolean;
  onAnalyze: () => void;
  hasImage: boolean;
}

export const AnalyzerPanel: React.FC<AnalyzerPanelProps> = ({
  data,
  isLoading,
  onAnalyze,
  hasImage,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    if (!data) return;
    const report = `PixelMind AI Analysis:
Summary: ${data.summary}
Objects: ${data.objects.join(', ')}
Mood: ${data.mood.primary} (${data.mood.keywords.join(', ')})
Composition: ${data.composition.framing}, ${data.composition.focalPoint}
Lighting: ${data.lighting.type} (${data.lighting.quality})
Style: ${data.style.aesthetic}
Primary Use Cases: ${data.useCases.map((u) => `${u.domain}: ${u.recommendation}`).join('\n')}`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    toast('Analysis report copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header and Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-white">Multimodal Image Analyzer</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive computer vision breakdown powered by Gemini 3.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {data && (
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
          )}

          <button
            onClick={onAnalyze}
            disabled={isLoading || !hasImage}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{data ? 'Re-Analyze Image' : 'Analyze Image'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-5/6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse h-28 space-y-2"
              >
                <div className="h-3 bg-white/10 rounded w-1/3" />
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !data && (
        <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Eye className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">No Analysis Generated Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Click &quot;Analyze Image&quot; to inspect all detected objects, environmental lighting, compositional framing, mood keywords, and commercial applications.
          </p>
        </div>
      )}

      {/* Populated Analysis Grid */}
      {!isLoading && data && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-[#131522] to-[#10121d]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Executive Visual Summary
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {data.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Objects Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Box className="w-4 h-4 text-purple-400" />
                <span>Prominent Objects Identified</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.objects.map((obj, i) => (
                  <span
                    key={i}
                    className="text-xs text-slate-200 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]"
                  >
                    {obj}
                  </span>
                ))}
              </div>
            </div>

            {/* People & Subjects Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>People & Human Subjects</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-300">
                  {data.people.present ? `${data.people.count} Detected` : 'None'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {data.people.description}
              </p>
            </div>

            {/* Environment & Scenery Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Environment & Setting</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="text-slate-200 font-medium">{data.environment.setting}</div>
                <div className="text-slate-400">{data.environment.timeAndWeather}</div>
                <div className="text-[11px] text-slate-400 pt-1">{data.environment.details}</div>
              </div>
            </div>

            {/* Mood & Atmosphere Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Smile className="w-4 h-4 text-pink-400" />
                  <span>Mood & Atmosphere</span>
                </div>
                <span className="text-xs font-bold text-pink-300">{data.mood.primary}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{data.mood.narrative}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {data.mood.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-pink-200 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Composition & Framing Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Composition & Framing</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-[10px] text-slate-400 block">Framing</span>
                  <span className="text-slate-200">{data.composition.framing}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-[10px] text-slate-400 block">Depth of Field</span>
                  <span className="text-slate-200">{data.composition.depthOfField}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-300 font-medium">Focal Point:</span>{' '}
                {data.composition.focalPoint}
              </div>
            </div>

            {/* Lighting & Shadows Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Lighting & Shadows</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="text-slate-200 font-medium">{data.lighting.type}</div>
                <div className="text-slate-400">{data.lighting.quality}</div>
                <div className="text-[11px] text-slate-400 pt-1">
                  {data.lighting.highlightsShadows}
                </div>
              </div>
            </div>

            {/* Visual Style & Influences Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Palette className="w-4 h-4 text-violet-400" />
                <span>Visual Style & Influences</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="text-purple-300 font-semibold">{data.style.aesthetic}</div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Resembles:</span>{' '}
                  {data.style.artisticInfluences}
                </div>
                <div className="text-[11px] text-slate-400">{data.style.visualPurity}</div>
              </div>
            </div>

            {/* Color Palette Overview Card */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Palette className="w-4 h-4 text-rose-400" />
                  <span>Color Balance</span>
                </div>
                <span className="text-[11px] text-slate-400">{data.colorPalette.temperature}</span>
              </div>
              <p className="text-xs text-slate-300">{data.colorPalette.overview}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.colorPalette.dominantTones.map((tone, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
                  >
                    {tone}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Commercial Use Cases Card */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#11131c]/90 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Recommended Commercial & Creative Deployments</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.useCases.map((uc, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-xs font-semibold text-emerald-300 mb-1">{uc.domain}</div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    {uc.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
