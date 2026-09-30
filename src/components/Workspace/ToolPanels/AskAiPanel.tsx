import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AskAiData } from '../../../types';

interface AskAiPanelProps {
  data: AskAiData | null;
  isLoading: boolean;
  onAsk: (question: string) => void;
  hasImage: boolean;
}

export const AskAiPanel: React.FC<AskAiPanelProps> = ({
  data,
  isLoading,
  onAsk,
  hasImage,
}) => {
  const [question, setQuestion] = useState('');

  const quickQuestions = [
    'What is the primary focal point and how is the viewer’s eye guided?',
    'How could I recreate this exact lighting setup in a real studio?',
    'What camera body, lens focal length, and aperture were likely used?',
    'What visual flaws or composition improvements would you suggest?',
    'How would you adapt this visual into a cohesive 3-part campaign?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || !hasImage) return;
    onAsk(question.trim());
  };

  const handleSelectQuick = (q: string) => {
    setQuestion(q);
    if (!isLoading && hasImage) {
      onAsk(q);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Ask AI (Visual Q&amp;A)</h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Ask Gemini any custom question about details, lighting, or artistic direction in this image.
        </p>
      </div>

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading || !hasImage}
            placeholder={
              hasImage
                ? "e.g., 'What time of day does this light simulate?' or 'What makes the contrast punchy?'"
                : 'Upload an image first to ask questions...'
            }
            className="w-full bg-[#11131c] border border-white/[0.1] rounded-xl px-4 py-3 pr-24 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading || !hasImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow transition-all active:scale-[0.96]"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ask</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuick(q)}
                disabled={isLoading || !hasImage}
                className="text-[11px] text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] rounded-lg px-2.5 py-1 text-left transition-colors active:scale-[0.98]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/5 rounded w-full" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
          <div className="h-3 bg-white/5 rounded w-3/4" />
        </div>
      )}

      {/* Answer View */}
      {!isLoading && data && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-[#11131e] to-[#0e1019] space-y-4 shadow-xl">
            {/* User Question Echo */}
            <div className="flex items-start gap-2.5 pb-3 border-b border-white/[0.06]">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                Q
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                {data.question}
              </span>
            </div>

            {/* AI Answer Content */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {data.answer}
            </div>

            {/* Key Observations */}
            {data.keyObservations && data.keyObservations.length > 0 && (
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Key Visual Observations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {data.keyObservations.map((obs, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-black/30 border border-white/[0.05] text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up suggestions */}
            {data.followUpSuggestions && data.followUpSuggestions.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Ask next:</span>
                {data.followUpSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectQuick(sug)}
                    className="text-[11px] text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1 transition-colors"
                  >
                    <span>{sug}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
