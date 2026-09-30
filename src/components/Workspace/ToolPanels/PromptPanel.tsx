import React, { useState } from 'react';
import {
  Wand2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Camera,
  Layers,
  Sun,
  Palette,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { PromptGenData, PromptStyle } from '../../../types';
import { useToast } from '../../Toast';

interface PromptPanelProps {
  data: PromptGenData | null;
  isLoading: boolean;
  onGenerate: (style: PromptStyle) => void;
  hasImage: boolean;
}

export const PromptPanel: React.FC<PromptPanelProps> = ({
  data,
  isLoading,
  onGenerate,
  hasImage,
}) => {
  const { toast } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle>('photorealistic');
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const copyText = (text: string, type: 'master' | 'negative') => {
    navigator.clipboard.writeText(text);
    if (type === 'master') {
      setCopiedMaster(true);
      toast('Master prompt copied to clipboard!', 'success');
      setTimeout(() => setCopiedMaster(false), 2000);
    } else {
      setCopiedNegative(true);
      toast('Negative prompt copied!', 'success');
      setTimeout(() => setCopiedNegative(false), 2000);
    }
  };

  const styles: Array<{ id: PromptStyle; label: string }> = [
    { id: 'photorealistic', label: 'Photorealistic' },
    { id: 'cinematic', label: 'Cinematic 35mm' },
    { id: 'minimalist', label: 'Commercial Studio' },
    { id: 'editorial', label: 'Vogue Editorial' },
    { id: 'anime', label: 'Anime / Manga' },
    { id: 'digital_art', label: 'Digital Concept Art' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header with Style selector and Regenerate */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white">AI Prompt Generator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Reverse-engineers complete prompts for Midjourney, FLUX, and Imagen 3.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Style Dropdown */}
          <div className="relative">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as PromptStyle)}
              disabled={isLoading}
              className="appearance-none bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {styles.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#12141f] text-white">
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => onGenerate(selectedStyle)}
            disabled={isLoading || !hasImage}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{data ? 'Regenerate' : 'Generate Prompt'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse space-y-3">
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-20 bg-white/5 rounded w-full" />
            <div className="h-8 bg-white/10 rounded w-1/3" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white/[0.03] animate-pulse h-28" />
            <div className="p-4 rounded-xl bg-white/[0.03] animate-pulse h-28" />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !data && (
        <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Wand2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">Ready to Reverse-Engineer Prompt</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Choose your desired style emphasis above and click &quot;Generate Prompt&quot; to deconstruct this image into a production-ready AI prompt.
          </p>
        </div>
      )}

      {/* Populated Result */}
      {!isLoading && data && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Master Prompt Card */}
          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-[#121422] to-[#0e1019] relative space-y-3 shadow-xl shadow-indigo-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Ready-To-Paste Master Prompt
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyText(data.masterPrompt, 'master')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all active:scale-[0.97]"
                >
                  {copiedMaster ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMaster ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] text-xs sm:text-sm text-slate-100 font-mono leading-relaxed select-all">
              {data.masterPrompt}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
              <span className="bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">
                Aspect: {data.technicalParams.aspectRatio || '--ar 16:9'}
              </span>
              <span className="bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">
                Engine: {data.technicalParams.version || 'Midjourney v6.1'}
              </span>
              <span className="bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">
                Stylize: {data.technicalParams.stylize || '--s 250'}
              </span>
            </div>
          </div>

          {/* Structured Deconstruction Grid */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Deconstructed Prompt Elements</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                  Subject & Characters
                </span>
                <p className="text-slate-200 leading-relaxed">{data.breakdown.subject}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                  Environment & Scenery
                </span>
                <p className="text-slate-200 leading-relaxed">{data.breakdown.environment}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                  Composition & Framing
                </span>
                <p className="text-slate-200 leading-relaxed">{data.breakdown.composition}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Lighting & Volumetrics
                </span>
                <p className="text-slate-200 leading-relaxed">{data.breakdown.lighting}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <Camera className="w-3 h-3" />
                  <span>Camera & Optics</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{data.breakdown.camera}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  <Palette className="w-3 h-3" />
                  <span>Colors & Grading</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{data.breakdown.colors}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block">
                  Style & Aesthetic
                </span>
                <p className="text-slate-200 leading-relaxed">{data.breakdown.style}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Fine Textures & Details
                </span>
                <p className="text-slate-200 leading-relaxed">{data.breakdown.details}</p>
              </div>
            </div>
          </div>

          {/* Negative Prompt */}
          {data.negativePrompt && (
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                  Negative Prompt Recommendation
                </div>
                <div className="text-xs text-slate-300 font-mono truncate max-w-lg">
                  {data.negativePrompt}
                </div>
              </div>
              <button
                onClick={() => copyText(data.negativePrompt, 'negative')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors shrink-0"
              >
                {copiedNegative ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNegative ? 'Copied' : 'Copy Negative'}</span>
              </button>
            </div>
          )}

          {/* Prompt Variations */}
          {data.variations && data.variations.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Alternative Variations
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.variations.map((v, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/60 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white mb-1">{v.name}</div>
                      <div className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-3">
                        {v.prompt}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(v.prompt);
                        toast(`Copied ${v.name}!`, 'success');
                      }}
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 self-start transition-colors pt-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Variation</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
