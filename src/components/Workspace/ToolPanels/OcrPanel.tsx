import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Download,
  Check,
  RefreshCw,
  Sparkles,
  Type,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { OcrData } from '../../../types';
import { useToast } from '../../Toast';

interface OcrPanelProps {
  data: OcrData | null;
  isLoading: boolean;
  onExtract: () => void;
  hasImage: boolean;
}

export const OcrPanel: React.FC<OcrPanelProps> = ({
  data,
  isLoading,
  onExtract,
  hasImage,
}) => {
  const { toast } = useToast();
  const [editableText, setEditableText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.fullText) {
      setEditableText(data.fullText);
    } else {
      setEditableText('');
    }
  }, [data]);

  const handleCopy = () => {
    if (!editableText) return;
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    toast('Text copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!editableText) return;
    const blob = new Blob([editableText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pixelmind-extracted-text-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast('Downloaded extracted text as .txt!', 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Neural OCR Text Extractor</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Extracts visible typography, packaging text, brand logos, and signage.
          </p>
        </div>

        <button
          onClick={onExtract}
          disabled={isLoading || !hasImage}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-md transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning Text...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data ? 'Re-Scan Text' : 'Extract Text'}</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse space-y-3">
            <div className="h-4 bg-white/10 rounded w-1/4" />
            <div className="h-32 bg-white/5 rounded w-full" />
            <div className="h-8 bg-white/10 rounded w-1/3" />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !data && (
        <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">No Text Extracted Yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Click &quot;Extract Text&quot; to run Gemini computer vision OCR on this image. You can edit the text and download it as a .txt file.
          </p>
        </div>
      )}

      {/* Populated OCR View */}
      {!isLoading && data && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Status Pill */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              data.detected
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {data.detected ? (
                <FileCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-semibold">
                {data.detected ? 'Text Detected in Image' : 'No Prominent Text Detected'}
              </span>
            </div>
            {data.language && (
              <span className="text-[11px] font-mono opacity-80">
                Language: {data.language}
              </span>
            )}
          </div>

          {/* Context summary */}
          {data.contextSummary && (
            <p className="text-xs text-slate-300 leading-relaxed italic bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
              &quot;{data.contextSummary}&quot;
            </p>
          )}

          {/* Editable Text Area with Copy & Download */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-400" />
                <span>Editable Extracted Content</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!editableText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-all active:scale-[0.97]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  disabled={!editableText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all active:scale-[0.97]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              placeholder="Extracted text will appear here..."
              className="w-full rounded-xl bg-black/50 border border-white/[0.1] p-4 text-xs sm:text-sm text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-emerald-500/50 resize-y"
            />
          </div>

          {/* Detected Elements breakdown */}
          {data.items && data.items.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Identified Text Segments ({data.items.length})
              </div>
              <div className="space-y-2">
                {data.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="text-white font-mono font-medium">&quot;{item.text}&quot;</div>
                      <div className="text-[11px] text-slate-400">
                        {item.location} · {item.style}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                      {item.confidence} Confidence
                    </span>
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
