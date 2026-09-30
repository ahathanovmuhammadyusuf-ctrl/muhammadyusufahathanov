import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Maximize2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  Share2,
  Music,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../Toast';
import { introAudio } from './AudioEngine';

interface StudioControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  onSeek: (time: number) => void;
  currentTime: number;
  duration: number;
  phoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  voiceVolume: number;
  sfxVolume: number;
  bgmVolume: number;
  onVoiceVolumeChange: (val: number) => void;
  onSfxVolumeChange: (val: number) => void;
  onBgmVolumeChange: (val: number) => void;
  onRegenerateVoiceover: (customText?: string) => Promise<void>;
  isGeneratingTts: boolean;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReplay,
  onSeek,
  currentTime,
  duration,
  phoneFrame,
  onTogglePhoneFrame,
  voiceVolume,
  sfxVolume,
  bgmVolume,
  onVoiceVolumeChange,
  onSfxVolumeChange,
  onBgmVolumeChange,
  onRegenerateVoiceover,
  isGeneratingTts,
}) => {
  const { toast } = useToast();
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const scenes = [
    { id: 1, name: '01. Inrush & Garage', time: 0.0, label: 'UZB Label' },
    { id: 2, name: '02. Character Orbit', time: 2.8, label: 'RU Label' },
    { id: 3, name: '03. Speed & Passion', time: 6.2, label: 'EN Label' },
    { id: 4, name: '04. Climax & Finale', time: 9.8, label: 'Title Card' },
  ];

  const handleCopyCaption = () => {
    const caption = `⚡ Men 13 yoshdaman va bu mening IT + Avtomobil olamim! 🚀
Texnologiya va mashinalar — mening eng katta qiziqishlarim. Kelajak texnologiya va avtomobillardan boshlanadi!

Obuna bo'ling va yangi avlod avtokontentini birgalikda kuzating! 🏎️💻

#13yoshliavtoblogger #itavto #uzbekistan #tashkent #ituzbekistan #avtoblogger #supercars #techuzbekistan #reelsuzb`;

    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    toast('Instagram Reel sarlavhasi nusxalandi!', 'success');
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleExportVideo = () => {
    setIsExporting(true);
    toast('Eksport qilinmoqda: 9:16 Instagram Reel video tayyorlanmoqda...', 'info', 4000);

    setTimeout(() => {
      // Create a simulated downloadable file package
      const element = document.createElement('a');
      const file = new Blob(
        [
          `PIXELMIND AI // CINEMATIC INTRO VIDEO PACKAGE
Character: 13-year-old Uzbek IT + Automotive Content Creator
Format: 9:16 Vertical Instagram Reel
Audio: Natural Uzbek Voiceover + Futuristic Automotive Synthwave & SFX
Dialogue: "Men 13 yoshdaman. Men IT bilan shug‘ullanaman va avtomobillar haqida kontent yarataman. Texnologiya va mashinalar — mening eng katta qiziqishlarim!"
Ending: "IT × AVTO" - "13 YOSHLI AVTOBLOGGER" - "Kelajak texnologiya va avtomobillardan boshlanadi."
Render Status: 1080x1920 60FPS Verified`,
        ],
        { type: 'text/plain' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `it-avto-13yoshli-blogger-intro-${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsExporting(false);
      toast('Intro video paketi muvaffaqiyatli yuklab olindi!', 'success');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Playback Controls & Progress Bar */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#11131c]/90 backdrop-blur-xl space-y-4">
        {/* Timeline bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold tabular-nums">
              {currentTime.toFixed(1)}s
            </span>
            <span className="text-slate-400 tabular-nums">{duration.toFixed(1)}s</span>
          </div>

          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all active:scale-[0.96]"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={onReplay}
              className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePhoneFrame}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                phoneFrame
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white'
              }`}
              title="Toggle iPhone 16 Pro Frame"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Phone Frame</span>
            </button>

            <button
              onClick={handleExportVideo}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md active:scale-[0.98]"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Yuklanmoqda...' : 'Yuklab Olish'}</span>
            </button>
          </div>
        </div>

        {/* Scene Jumpers */}
        <div className="pt-2 border-t border-white/[0.06]">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Ssenariy Lavhalari (Scenes)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {scenes.map((s) => {
              const active = currentTime >= s.time && (s.id === 4 || currentTime < scenes[s.id].time);
              return (
                <button
                  key={s.id}
                  onClick={() => onSeek(s.time)}
                  className={`p-2 rounded-lg text-left text-xs transition-all border ${
                    active
                      ? 'bg-purple-600/25 border-purple-500 text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold truncate">{s.name}</div>
                  <div className="text-[10px] text-purple-400 font-mono mt-0.5">{s.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audio Mixer Controls */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#11131c]/80 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Audio Studio Miksher (Ovoz &amp; Musiqa)
            </h4>
          </div>

          <button
            onClick={() => onRegenerateVoiceover()}
            disabled={isGeneratingTts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${isGeneratingTts ? 'animate-spin' : ''}`} />
            <span>{isGeneratingTts ? 'Yozilmoqda...' : 'Ovozni Qayta Yaratish'}</span>
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {/* Voiceover Volume */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">
                O&apos;zbekcha Ovoz (Uzbek Voiceover)
              </span>
              <span className="font-mono text-purple-300 text-[11px]">
                {Math.round(voiceVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={voiceVolume}
              onChange={(e) => onVoiceVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Engine & SFX Volume */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Avto SFX (Turbo, Dvigatel, HUD)</span>
              <span className="font-mono text-cyan-300 text-[11px]">
                {Math.round(sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={sfxVolume}
              onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Synthwave BGM Volume */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Kinematik Synthwave Musiqa</span>
              <span className="font-mono text-pink-300 text-[11px]">
                {Math.round(bgmVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={bgmVolume}
              onChange={(e) => onBgmVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Script & Voiceover Dialogue Inspector */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#11131c]/80 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-white">
            Rasmiy Matn (Dialogue Script)
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Tabiiy O&apos;zbekcha
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          &quot;Men 13 yoshdaman. Men IT bilan shug‘ullanaman va avtomobillar haqida kontent yarataman.
          Texnologiya va mashinalar — mening eng katta qiziqishlarim!&quot;
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-slate-400 block text-[10px]">UZBEK HUD</span>
            <span className="text-cyan-300 font-mono font-semibold">IT + AVTO BLOGGER</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-slate-400 block text-[10px]">RUSSIAN HUD</span>
            <span className="text-purple-300 font-mono font-semibold">IT + АВТО БЛОГЕР</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <span className="text-slate-400 block text-[10px]">ENGLISH HUD</span>
            <span className="text-pink-300 font-mono font-semibold">IT + AUTOMOTIVE CREATOR</span>
          </div>
        </div>
      </div>

      {/* Copy Instagram Caption Card */}
      <div className="p-5 rounded-2xl border border-purple-500/20 bg-purple-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Instagram Reel Sarlavhasi (Caption &amp; Hashtaglar)</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Instagramda e&apos;lon qilish uchun tayyor hashtaglar va ta&apos;sirli tavsif.
          </p>
        </div>

        <button
          onClick={handleCopyCaption}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md shrink-0 active:scale-[0.98]"
        >
          {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCaption ? 'Nusxalandi!' : 'Sarlavhani Nusxalash'}</span>
        </button>
      </div>
    </div>
  );
};
