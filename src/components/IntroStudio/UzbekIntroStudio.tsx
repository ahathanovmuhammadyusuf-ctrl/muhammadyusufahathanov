import React, { useState, useEffect, useRef } from 'react';
import { CinematicReelPlayer } from './CinematicReelPlayer';
import { StudioControls } from './StudioControls';
import { introAudio } from './AudioEngine';
import { useToast } from '../Toast';
import {
  Sparkles,
  ArrowLeft,
  Video,
  Layers,
  Wand2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface UzbekIntroStudioProps {
  onBack: () => void;
}

export const UzbekIntroStudio: React.FC<UzbekIntroStudioProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 12.0; // 12 seconds total dynamic reel duration

  const [phoneFrame, setPhoneFrame] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [sfxVolume, setSfxVolume] = useState(0.7);
  const [bgmVolume, setBgmVolume] = useState(0.4);
  const [isGeneratingTts, setIsGeneratingTts] = useState(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize voiceover audio file
  useEffect(() => {
    introAudio.setVoiceAudio('/src/assets/audio/uzbek_intro_voiceover.wav');
    return () => {
      introAudio.stopAll();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 60FPS Video playback ticker loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();

      const tick = (now: number) => {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= duration) {
            setIsPlaying(false);
            introAudio.stopAll();
            return duration;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(tick);
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration]);

  const handleTogglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
      introAudio.seekVoiceover(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = () => {
    setCurrentTime(0);
    introAudio.seekVoiceover(0);
    setIsPlaying(true);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    introAudio.seekVoiceover(Math.max(0, time - 2.8));
  };

  const handleRegenerateVoiceover = async (customText?: string) => {
    setIsGeneratingTts(true);
    try {
      const res = await fetch('/api/tts/intro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text:
            customText ||
            'Men 13 yoshdaman. Men IT bilan shug‘ullanaman va avtomobillar haqida kontent yarataman. Texnologiya va mashinalar — mening eng katta qiziqishlarim!',
          style:
            'A confident, energetic and natural 13-year-old Uzbek boy speaking natural Uzbek clearly and with pride.',
        }),
      });

      const data = await res.json();
      if (data.ok && data.audioBase64) {
        const audioUri = `data:audio/wav;base64,${data.audioBase64}`;
        introAudio.setVoiceAudio(audioUri);
        toast('Ovoz yangilandi: Gemini TTS audio muvaffaqiyatli yuklandi!', 'success');
      } else {
        throw new Error(data.error || 'TTS audio qaytarilmadi');
      }
    } catch (err: any) {
      toast(err?.message || 'TTS generatsiya xatosi', 'error');
    } finally {
      setIsGeneratingTts(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07080d] p-4 sm:p-6 flex flex-col">
      {/* Studio Header */}
      <div className="max-w-7xl mx-auto w-full mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
            title="Ortga qaytish"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                13 Yoshli IT + Avtoblogger // Kinematik Intro Video Studio
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              9:16 Ultra-modern texnologiya va avtomobil estetikasi · O&apos;zbek tilidagi tabiiy
              ovoz va 3D vizuallar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
            Instagram Reel 9:16
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            Gemini 3 Vision &amp; TTS
          </span>
        </div>
      </div>

      {/* Main 2-Column Studio Viewport */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 9:16 Vertical Instagram Reel Player */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <CinematicReelPlayer
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onTimeUpdate={setCurrentTime}
            currentTime={currentTime}
            duration={duration}
            voiceVolume={voiceVolume}
            sfxVolume={sfxVolume}
            bgmVolume={bgmVolume}
            phoneFrame={phoneFrame}
          />
        </div>

        {/* Right: Studio Controls, Audio Mixer & Storyboard */}
        <div className="lg:col-span-7 space-y-6">
          <StudioControls
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onReplay={handleReplay}
            onSeek={handleSeek}
            currentTime={currentTime}
            duration={duration}
            phoneFrame={phoneFrame}
            onTogglePhoneFrame={() => setPhoneFrame(!phoneFrame)}
            voiceVolume={voiceVolume}
            sfxVolume={sfxVolume}
            bgmVolume={bgmVolume}
            onVoiceVolumeChange={setVoiceVolume}
            onSfxVolumeChange={setSfxVolume}
            onBgmVolumeChange={setBgmVolume}
            onRegenerateVoiceover={handleRegenerateVoiceover}
            isGeneratingTts={isGeneratingTts}
          />
        </div>
      </div>
    </div>
  );
};
