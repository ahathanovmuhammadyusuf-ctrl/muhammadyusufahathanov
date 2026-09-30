import React, { useState } from 'react';
import {
  Palette,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Thermometer,
  Layers,
  Sparkle,
} from 'lucide-react';
import { ColorAnalysisData } from '../../../types';
import { useToast } from '../../Toast';

interface ColorPanelProps {
  data: ColorAnalysisData | null;
  isLoading: boolean;
  onAnalyze: () => void;
  hasImage: boolean;
}

export const ColorPanel: React.FC<ColorPanelProps> = ({
  data,
  isLoading,
  onAnalyze,
  hasImage,
}) => {
  const { toast } = useToast();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast(`Copied ${hex} to clipboard!`, 'success');
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopyAllHex = () => {
    if (!data) return;
    const hexList = data.dominantPalette.map((p) => `${p.name}: ${p.hex}`).join('\n');
    navigator.clipboard.writeText(hexList);
    toast('Copied full palette HEX codes!', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">Dominant Color Analyzer</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Extracts precise harmonic color swatches with HEX, RGB, and temperature metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {data && (
            <button
              onClick={handleCopyAllHex}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All HEX</span>
            </button>
          )}

          <button
            onClick={onAnalyze}
            disabled={isLoading || !hasImage}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting Palette...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{data ? 'Re-Analyze Colors' : 'Analyze Colors'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          <div className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !data && (
        <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Palette className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">No Color Palette Extracted Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Click &quot;Analyze Colors&quot; to inspect dominant pigments, HEX codes, RGB coordinates, harmony types, and lighting temperature.
          </p>
        </div>
      )}

      {/* Populated Palette Display */}
      {!isLoading && data && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Continuous Palette Spectrum Bar */}
          <div className="rounded-xl overflow-hidden h-12 flex shadow-xl border border-white/[0.1]">
            {data.dominantPalette.map((color, i) => (
              <div
                key={i}
                className="h-full relative group transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: color.hex,
                  width: `${Math.max(color.percentage, 12)}%`,
                }}
                onClick={() => handleCopyHex(color.hex)}
                title={`${color.name} (${color.hex}) - Click to copy`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-1 rounded">
                    {color.hex}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Swatch Cards */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Color Swatches &amp; Visual Roles ({data.dominantPalette.length})
            </div>

            <div className="space-y-2">
              {data.dominantPalette.map((color, i) => {
                const isCopied = copiedHex === color.hex;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-white/[0.08] bg-[#11131c]/80 hover:bg-[#141624] flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Swatch square */}
                      <div
                        className="w-11 h-11 rounded-lg border border-white/20 shadow-md shrink-0 transition-transform hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {color.name}
                          </span>
                          <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {color.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {color.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="font-mono text-xs font-bold text-slate-200 tabular-nums">
                          {color.hex}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 tabular-nums">
                          {color.rgb}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyHex(color.hex)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all active:scale-[0.97] ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08]'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy HEX'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Harmony & Temperature Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Color Harmony Type</span>
              </div>
              <div className="text-xs font-semibold text-purple-300">
                {data.harmony.type}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {data.harmony.description}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>Color Temperature</span>
              </div>
              <div className="text-xs font-semibold text-rose-300">
                {data.temperature.tone}{' '}
                <span className="font-mono text-[11px] text-slate-400 font-normal">
                  ({data.temperature.kelvinEstimate})
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Contrast Ratio: {data.contrastRatio}
              </p>
            </div>
          </div>

          {/* Styling Recommendation */}
          {data.stylingRecommendation && (
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white block mb-1">
                UI &amp; Brand Styling Recommendation:
              </span>
              {data.stylingRecommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
