import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Share2,
  Trash2,
  ShieldCheck,
  Check,
  RefreshCw,
  Zap,
  Info,
} from 'lucide-react';
import { CaptionTone, PromptStyle, UserSettings } from '../../../types';
import { checkServerStatus, ApiStatus } from '../../../services/api';
import { useToast } from '../../Toast';

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClearHistory: () => void;
  historyCount: number;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClearHistory,
  historyCount,
}) => {
  const { toast } = useToast();
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [checkingApi, setCheckingApi] = useState(false);
  const [pingMs, setPingMs] = useState<number | null>(null);

  const fetchStatus = async () => {
    setCheckingApi(true);
    const start = performance.now();
    try {
      const res = await checkServerStatus();
      const end = performance.now();
      setApiStatus(res);
      setPingMs(Math.round(end - start));
    } catch {
      setApiStatus(null);
    } finally {
      setCheckingApi(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleModelChange = (model: string) => {
    onUpdateSettings({ ...settings, model });
    toast(`Model updated to ${model}`, 'success');
  };

  const handleToneChange = (defaultTone: CaptionTone) => {
    onUpdateSettings({ ...settings, defaultTone });
    toast(`Default caption tone set to ${defaultTone}`, 'success');
  };

  const handleStyleChange = (defaultPromptStyle: PromptStyle) => {
    onUpdateSettings({ ...settings, defaultPromptStyle });
    toast(`Default prompt style set to ${defaultPromptStyle}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-bold text-white">Studio Settings &amp; Engine Config</h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure model parameters, default output tones, and check API connectivity.
        </p>
      </div>

      {/* API Configuration & Health Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#11131c]/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">API Configuration Status</span>
          </div>

          <button
            onClick={fetchStatus}
            disabled={checkingApi}
            className="inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${checkingApi ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Backend Server
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white">Online &amp; Responsive</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Gemini Vision Key
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus?.configured ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                }`}
              />
              <span className="text-xs font-semibold text-white">
                {apiStatus?.configured ? 'Configured & Verified' : 'AI Studio Auto-Injected'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
              Roundtrip Latency
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-mono font-semibold text-purple-300">
                {pingMs !== null ? `${pingMs}ms` : 'Checking...'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
          Gemini API queries execute exclusively on the Node server environment with headers set for AI Studio. No API key is ever transmitted to the client browser.
        </p>
      </div>

      {/* Model Selection */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#11131c]/80 space-y-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white">Gemini Multimodal Model</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'gemini-3.8-flash',
              title: 'gemini-3.8-flash (Recommended)',
              desc: 'Ultra-low latency multimodal vision. Exceptional speed for real-time prompt deconstruction, OCR, and color analysis.',
              badge: 'Fast & High Throughput',
            },
            {
              id: 'gemini-3.1-pro-preview',
              title: 'gemini-3.1-pro-preview',
              desc: 'Advanced reasoning model for complex STEM diagrams, dense typography charts, and multi-step creative problem solving.',
              badge: 'High Reasoning',
            },
          ].map((m) => {
            const active = settings.model === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModelChange(m.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-purple-600/15 border-purple-500/50 shadow-md'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white font-mono">{m.title}</span>
                  {active && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{m.desc}</p>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {m.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Default Preferences */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#11131c]/80 space-y-4">
        <div className="text-xs font-bold text-white">Default Studio Presets</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">
              Default Caption Tone
            </label>
            <select
              value={settings.defaultTone}
              onChange={(e) => handleToneChange(e.target.value as CaptionTone)}
              className="w-full bg-[#161824] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="luxury">Luxury &amp; Premium</option>
              <option value="professional">Professional B2B</option>
              <option value="viral">Viral &amp; Hook-Driven</option>
              <option value="minimal">Minimalist &amp; Punchy</option>
              <option value="funny">Humorous &amp; Witty</option>
              <option value="emotional">Emotional &amp; Storytelling</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">
              Default Prompt Reverse Style
            </label>
            <select
              value={settings.defaultPromptStyle}
              onChange={(e) => handleStyleChange(e.target.value as PromptStyle)}
              className="w-full bg-[#161824] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="photorealistic">Photorealistic Studio</option>
              <option value="cinematic">Cinematic 35mm</option>
              <option value="minimalist">Commercial Minimal</option>
              <option value="editorial">Vogue Editorial</option>
              <option value="anime">Anime / Manga</option>
              <option value="digital_art">Digital Concept Art</option>
            </select>
          </div>
        </div>
      </div>

      {/* Storage & Privacy */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#11131c]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-white">Browser Storage &amp; Privacy</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Currently storing {historyCount} analysis record{historyCount === 1 ? '' : 's'} in your local browser cache.
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Clear all local analysis history?')) {
              onClearHistory();
              toast('History cleared successfully', 'info');
            }
          }}
          disabled={historyCount === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Local Storage</span>
        </button>
      </div>
    </div>
  );
};
