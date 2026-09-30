import React from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { HistoryItem } from '../../../types';
import { useToast } from '../../Toast';

interface HistoryPanelProps {
  historyItems: HistoryItem[];
  onOpenItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  historyItems,
  onOpenItem,
  onDeleteItem,
  onClearAll,
}) => {
  const { toast } = useToast();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteItem(id);
    toast('History item deleted', 'info');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your entire local studio history?')) {
      onClearAll();
      toast('History cleared', 'info');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-white">Analysis History</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Previous image analyses and prompts stored securely in your browser&apos;s local storage.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {historyItems.length === 0 && (
        <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">No Previous Analyses Stored</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            As you analyze images, reverse-engineer prompts, and generate captions, they will be automatically saved here for quick review.
          </p>
        </div>
      )}

      {/* History Items List */}
      {historyItems.length > 0 && (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenItem(item)}
              className="group p-3.5 rounded-xl border border-white/[0.08] bg-[#11131c]/80 hover:bg-[#151825] hover:border-purple-500/30 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Thumbnail */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                  {item.imageThumbnail ? (
                    <img
                      src={item.imageThumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Layers className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {item.toolTitle}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug truncate">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onOpenItem(item)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open</span>
                </button>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
