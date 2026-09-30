import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Instagram,
  Linkedin,
  Twitter,
  Video,
  Hash,
} from 'lucide-react';
import { CaptionGenData, CaptionTone, SocialPlatform } from '../../../types';
import { useToast } from '../../Toast';

interface CaptionPanelProps {
  data: CaptionGenData | null;
  isLoading: boolean;
  onGenerate: (platform: SocialPlatform, tone: CaptionTone) => void;
  hasImage: boolean;
}

export const CaptionPanel: React.FC<CaptionPanelProps> = ({
  data,
  isLoading,
  onGenerate,
  hasImage,
}) => {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [selectedTone, setSelectedTone] = useState<CaptionTone>('luxury');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const platforms: Array<{ id: SocialPlatform; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'tiktok', label: 'TikTok', icon: Video },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'twitter', label: 'X / Twitter', icon: Twitter },
  ];

  const tones: Array<{ id: CaptionTone; label: string }> = [
    { id: 'luxury', label: 'Luxury' },
    { id: 'professional', label: 'Professional' },
    { id: 'viral', label: 'Viral Hook' },
    { id: 'minimal', label: 'Minimalist' },
    { id: 'funny', label: 'Humor & Wit' },
    { id: 'emotional', label: 'Emotional Story' },
  ];

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast('Caption copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="space-y-4 pb-4 border-b border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-pink-400" />
              <h3 className="text-base font-bold text-white">Social Caption Suite</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Generates 3 distinct viral caption variations optimized for each network.
            </p>
          </div>

          <button
            onClick={() => onGenerate(selectedPlatform, selectedTone)}
            disabled={isLoading || !hasImage}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Writing Captions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{data ? 'Regenerate 3 Captions' : 'Generate Captions'}</span>
              </>
            )}
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Target Platform
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {platforms.map((p) => {
              const Icon = p.icon;
              const active = selectedPlatform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                    active
                      ? 'bg-pink-500/20 border-pink-500/40 text-pink-200 shadow-sm'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone Selector Tabs */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Tone of Voice
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tones.map((t) => {
              const active = selectedTone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTone(t.id)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-white text-slate-900 font-semibold shadow-sm'
                      : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse space-y-3"
            >
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-14 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !data && (
        <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
            <Share2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">Generate High-Engagement Social Copy</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Select your platform and voice tone above, then click &quot;Generate Captions&quot; to see 3 copy angles with CTAs and hashtags.
          </p>
        </div>
      )}

      {/* Populated 3 Captions */}
      {!isLoading && data && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing 3 variations for{' '}
              <strong className="text-white capitalize">{data.platform}</strong> in{' '}
              <strong className="text-pink-300 capitalize">{data.tone}</strong> voice
            </span>
          </div>

          <div className="space-y-4">
            {data.captions.map((item, index) => {
              const fullFormatted = `${item.body}\n\n${item.callToAction}\n\n${item.hashtags.join(' ')}`;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id || index}
                  className="rounded-2xl border border-white/[0.08] bg-[#11131c]/80 hover:bg-[#141622] p-5 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-bold flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-white tracking-tight">
                        {item.hookTitle}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(item.id, fullFormatted)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all active:scale-[0.97] ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08]'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied!' : 'Copy Caption'}</span>
                    </button>
                  </div>

                  {/* Body copy */}
                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/[0.04]">
                    {item.body}
                  </div>

                  {/* Call to action & hashtags */}
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-pink-300 font-medium">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">CTA:</span>
                      <span>{item.callToAction}</span>
                    </div>

                    {item.hashtags && item.hashtags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Hash className="w-3 h-3 text-slate-400" />
                        {item.hashtags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(tag);
                              toast(`Copied ${tag}!`, 'success');
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
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
