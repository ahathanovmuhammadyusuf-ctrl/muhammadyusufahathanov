import React, { useState } from 'react';
import {
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Megaphone,
  Share2,
  Image as ImageIcon,
  Camera,
  Layout,
  Palette,
} from 'lucide-react';
import { CreativeIdeasData } from '../../../types';
import { useToast } from '../../Toast';

interface IdeasPanelProps {
  data: CreativeIdeasData | null;
  isLoading: boolean;
  onGenerate: () => void;
  hasImage: boolean;
}

export const IdeasPanel: React.FC<IdeasPanelProps> = ({
  data,
  isLoading,
  onGenerate,
  hasImage,
}) => {
  const { toast } = useToast();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('ad') || category.toLowerCase().includes('campaign')) {
      return Megaphone;
    }
    if (category.toLowerCase().includes('social') || category.toLowerCase().includes('reels')) {
      return Share2;
    }
    if (category.toLowerCase().includes('thumbnail')) {
      return ImageIcon;
    }
    if (category.toLowerCase().includes('product') || category.toLowerCase().includes('staging')) {
      return Camera;
    }
    if (category.toLowerCase().includes('design') || category.toLowerCase().includes('ui')) {
      return Layout;
    }
    return Palette;
  };

  const handleCopyConcept = (index: number, concept: any) => {
    const text = `${concept.title} (${concept.category})\n\nPitch: ${concept.pitch}\nTarget Audience: ${concept.targetAudience}\nExecution Tip: ${concept.executionTip}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    toast('Creative concept copied to clipboard!', 'success');
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-bold text-white">Commercial Creative Ideas</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-generated advertising campaigns, social content formats, and staging improvements.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading || !hasImage}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-md transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Generating Concepts...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data ? 'Regenerate Concepts' : 'Generate Creative Ideas'}</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] animate-pulse h-28 space-y-2">
              <div className="h-3 bg-white/10 rounded w-1/3" />
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-4/5" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !data && (
        <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">No Creative Concepts Generated</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Click &quot;Generate Creative Ideas&quot; to brainstorm ad campaigns, thumbnail hacks, staging upgrades, and derivative art directions.
          </p>
        </div>
      )}

      {/* Populated Ideas */}
      {!isLoading && data && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Creative Core Anchor */}
          {data.creativeCore && (
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 text-xs text-rose-200 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Creative Core Hook:</span>
                <span>{data.creativeCore}</span>
              </div>
            </div>
          )}

          {/* 6 Actionable Concept Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.concepts.map((concept, idx) => {
              const Icon = getCategoryIcon(concept.category);
              const isCopied = copiedIdx === idx;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-white/[0.08] bg-[#11131c]/80 hover:bg-[#141624] flex flex-col justify-between transition-all space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        <Icon className="w-3 h-3" />
                        <span>{concept.category}</span>
                      </div>

                      <button
                        onClick={() => handleCopyConcept(idx, concept)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/[0.05] transition-colors"
                        title="Copy this concept"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5">
                      {concept.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {concept.pitch}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/[0.05] text-[11px]">
                    <div className="text-slate-400">
                      <strong className="text-slate-300">Audience:</strong> {concept.targetAudience}
                    </div>
                    <div className="text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                      <strong className="text-purple-200">Execution Tip:</strong>{' '}
                      {concept.executionTip}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
