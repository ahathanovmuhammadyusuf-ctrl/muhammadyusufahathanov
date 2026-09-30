import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Smartphone,
  Gauge,
  Sparkles,
  Zap,
  Activity,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
} from 'lucide-react';
import { introAudio } from './AudioEngine';

interface CinematicReelPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onTimeUpdate: (time: number) => void;
  currentTime: number;
  duration: number;
  voiceVolume: number;
  sfxVolume: number;
  bgmVolume: number;
  phoneFrame: boolean;
}

export const CinematicReelPlayer: React.FC<CinematicReelPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  onTimeUpdate,
  currentTime,
  duration,
  voiceVolume,
  sfxVolume,
  bgmVolume,
  phoneFrame,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speedometerKmh, setSpeedometerKmh] = useState(0);

  // Active scene calculation
  // Scene 1: 0.0s - 2.8s
  // Scene 2: 2.8s - 6.2s
  // Scene 3: 6.2s - 9.8s
  // Scene 4: 9.8s - 12.0s
  const currentScene =
    currentTime < 2.8 ? 1 : currentTime < 6.2 ? 2 : currentTime < 9.8 ? 3 : 4;

  // Sync Audio Engine on playback state and scene transitions
  useEffect(() => {
    introAudio.setVolumes(voiceVolume, sfxVolume, bgmVolume);
  }, [voiceVolume, sfxVolume, bgmVolume]);

  useEffect(() => {
    if (isPlaying) {
      introAudio.startSynthwaveBgm();
      if (currentTime === 0) {
        introAudio.playSubBassDrop();
        introAudio.playWhoosh();
        setTimeout(() => {
          introAudio.playVoiceover(voiceVolume);
        }, 2800);
      }
    } else {
      introAudio.pauseVoiceover();
      introAudio.stopSynthwaveBgm();
    }
  }, [isPlaying]);

  // Handle scene-specific audio cues
  useEffect(() => {
    if (!isPlaying) return;

    if (currentTime >= 2.7 && currentTime <= 2.9) {
      introAudio.playHudBeep();
      introAudio.seekVoiceover(0);
      introAudio.playVoiceover(voiceVolume);
    }
    if (currentTime >= 6.1 && currentTime <= 6.3) {
      introAudio.playEngineRev();
      introAudio.playHudBeep();
    }
    if (currentTime >= 9.7 && currentTime <= 9.9) {
      introAudio.playSubBassDrop();
      introAudio.playWhoosh();
    }
  }, [currentTime, isPlaying, voiceVolume]);

  // Speedometer dynamic calculation in Scene 3
  useEffect(() => {
    if (currentScene === 3) {
      const progress = (currentTime - 6.2) / 3.6; // 0 to 1
      const calculatedSpeed = Math.min(240, Math.floor(progress * 240));
      setSpeedometerKmh(calculatedSpeed);
    } else if (currentScene > 3) {
      setSpeedometerKmh(240);
    } else {
      setSpeedometerKmh(Math.floor(currentTime * 20));
    }
  }, [currentTime, currentScene]);

  // Asset paths
  const heroImage = '/src/assets/images/uzbek_teen_it_car_hero_1790740290565.jpg';
  const garageImage = '/src/assets/images/futuristic_garage_supercar_1790740308960.jpg';
  const techPoseImage = '/src/assets/images/uzbek_teen_blogger_tech_1790740326818.jpg';

  return (
    <div className="flex items-center justify-center w-full py-4 select-none">
      <div
        className={`relative transition-all duration-300 ${
          phoneFrame
            ? 'p-3 bg-[#181a26] rounded-[48px] border-[5px] border-[#2d3148] shadow-2xl shadow-purple-950/50'
            : 'rounded-2xl overflow-hidden shadow-2xl shadow-black/80'
        }`}
      >
        {/* Dynamic iPhone Notch if phone frame is on */}
        {phoneFrame && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#151722] mr-3" />
            <span className="w-2 h-2 rounded-full bg-[#0a1832]" />
          </div>
        )}

        {/* 9:16 Vertical Screen Viewport */}
        <div
          ref={containerRef}
          onClick={onTogglePlay}
          className="relative w-[320px] sm:w-[350px] md:w-[380px] h-[570px] sm:h-[620px] md:h-[675px] bg-black overflow-hidden rounded-[36px] cursor-pointer group"
          style={{ aspectRatio: '9/16' }}
        >
          {/* =========================================================================
              SCENE 1: (0.0s - 2.8s) The Hyper-Speed Inrush into Futuristic Garage
             ========================================================================= */}
          {currentScene === 1 && (
            <div className="absolute inset-0 animate-in fade-in zoom-in-110 duration-300">
              <img
                src={garageImage}
                alt="Futuristic Neon Studio"
                className="w-full h-full object-cover transition-transform duration-1000 scale-110 group-hover:scale-115"
                style={{
                  transform: `scale(${1.15 + currentTime * 0.12}) translateY(${
                    currentTime * 4
                  }px)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

              {/* Holographic Speed Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_60%)] pointer-events-none" />

              {/* Rushing Grid Overlay */}
              <div
                className="absolute inset-0 opacity-40 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.2)_50%,transparent_100%)] pointer-events-none"
                style={{ transform: `translateY(${((currentTime * 300) % 200) - 100}px)` }}
              />

              {/* Holographic Label 1: UZBEK — "IT + AVTO BLOGGER" */}
              <div className="absolute top-16 left-5 right-5 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-cyan-400/40 shadow-lg shadow-cyan-500/20 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-xs font-bold tracking-wider text-cyan-300">
                    UZB // IT + AVTO BLOGGER
                  </span>
                </div>
              </div>

              {/* Inrush Title Teaser */}
              <div className="absolute bottom-24 left-6 right-6 z-20 space-y-2">
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>INITIALIZING AUTOMOTIVE ENGINE...</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none uppercase">
                  Yangi Avlod <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                    Texnologiyasi
                  </span>
                </h2>
              </div>
            </div>
          )}

          {/* =========================================================================
              SCENE 2: (2.8s - 6.2s) Confident 13-Year-Old Uzbek Boy + Orbit Camera
             ========================================================================= */}
          {currentScene === 2 && (
            <div className="absolute inset-0 animate-in fade-in duration-400">
              {/* Character Layer with Smooth Orbit Tilt */}
              <img
                src={heroImage}
                alt="13-Year-Old Uzbek IT + Avto Blogger"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(1.04) rotate(${(currentTime - 2.8) * 0.9 - 1.5}deg) translateX(${
                    Math.sin((currentTime - 2.8) * 1.5) * 6
                  }px)`,
                  transition: 'transform 0.1s ease-out',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

              {/* Holographic Label 2: RUSSIAN — "IT + АВТО БЛОГЕР" */}
              <div className="absolute top-16 right-5 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-purple-500/40 shadow-lg shadow-purple-500/20">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="font-mono text-xs font-bold tracking-wider text-purple-300">
                    RU // IT + АВТО БЛОГЕР
                  </span>
                </div>
              </div>

              {/* Floating Holographic Blueprint Widget */}
              <div className="absolute top-36 left-4 z-20 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 max-w-[150px]">
                <div className="text-[9px] font-mono text-cyan-400 font-semibold mb-1 flex items-center justify-between">
                  <span>HYPERCAR_v4</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="h-10 border border-cyan-500/20 rounded bg-cyan-950/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-x-0 h-0.5 bg-cyan-400 animate-bounce" />
                  <span className="text-[8px] font-mono text-slate-400">AERODYNAMICS: 0.21Cd</span>
                </div>
              </div>

              {/* Subtitles: Uzbek spoken dialogue part 1 */}
              <div className="absolute bottom-20 left-4 right-4 z-30">
                <div className="p-3.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-semibold">
                      O&apos;ZBEK TILI · TABIIY OVOZ
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-snug tracking-tight">
                    &quot;Men 13 yoshdaman. Men IT bilan shug‘ullanaman...&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SCENE 3: (6.2s - 9.8s) Dynamic Speed, Circuit Lines & Passion
             ========================================================================= */}
          {currentScene === 3 && (
            <div className="absolute inset-0 animate-in fade-in duration-300">
              <img
                src={techPoseImage}
                alt="Uzbek Teen Automotive Tech Creator"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${1.06 + (currentTime - 6.2) * 0.03}) translateY(${
                    Math.sin(currentTime * 8) * 2
                  }px)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

              {/* Holographic Label 3: ENGLISH — "IT + AUTOMOTIVE CREATOR" */}
              <div className="absolute top-16 left-5 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-pink-500/40 shadow-lg shadow-pink-500/20">
                  <Zap className="w-3 h-3 text-pink-400" />
                  <span className="font-mono text-xs font-bold tracking-wider text-pink-300">
                    EN // IT + AUTOMOTIVE CREATOR
                  </span>
                </div>
              </div>

              {/* Dynamic Futuristic Speedometer HUD Display */}
              <div className="absolute top-28 right-4 z-20 p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-cyan-400/30 text-right space-y-1 shadow-xl">
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-end gap-1">
                  <Gauge className="w-3 h-3 text-cyan-400" />
                  <span>DIGITAL SPEED</span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums tracking-tighter">
                  {speedometerKmh}
                  <span className="text-xs font-normal text-cyan-400 ml-1">KM/H</span>
                </div>
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden ml-auto">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-75"
                    style={{ width: `${(speedometerKmh / 240) * 100}%` }}
                  />
                </div>
                <div className="text-[8px] font-mono text-emerald-400">GEAR: D7 · BOOST 1.8 BAR</div>
              </div>

              {/* Subtitles: Uzbek spoken dialogue part 2 */}
              <div className="absolute bottom-20 left-4 right-4 z-30">
                <div className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-cyan-500/30 shadow-2xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-semibold">
                      KONTENT &amp; ISHQIBOZLIK
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-snug tracking-tight">
                    &quot;...va avtomobillar haqida kontent yarataman. Texnologiya va mashinalar —
                    mening eng katta qiziqishlarim!&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SCENE 4: (9.8s - 12.0s) Dramatic Zoom-out & Finale Title Sequence
             ========================================================================= */}
          {currentScene === 4 && (
            <div className="absolute inset-0 animate-in zoom-in-95 duration-500">
              <img
                src={heroImage}
                alt="13 Yoshli Avtoblogger Finale"
                className="w-full h-full object-cover filter brightness-75 contrast-110"
                style={{
                  transform: `scale(${1.0 - (currentTime - 9.8) * 0.03})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />

              {/* Center Cinematic Title Card */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-[11px] font-mono font-bold text-purple-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>OFFICIAL INTRO</span>
                </div>

                {/* Main Powerful Title: "IT × AVTO" */}
                <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white uppercase drop-shadow-[0_0_35px_rgba(168,85,247,0.8)]">
                  IT{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                    ×
                  </span>{' '}
                  AVTO
                </h1>

                {/* Subtitle: "13 YOSHLI AVTOBLOGGER" */}
                <div className="text-base sm:text-lg font-extrabold tracking-widest text-slate-100 uppercase border-y border-white/20 py-1.5 w-full">
                  13 YOSHLI AVTOBLOGGER
                </div>

                {/* Final Quote Motto */}
                <p className="text-xs sm:text-sm text-cyan-200/90 font-medium italic max-w-xs leading-relaxed pt-2">
                  &quot;Kelajak texnologiya va avtomobillardan boshlanadi.&quot;
                </p>

                {/* Follow & Subscribe CTA Badge */}
                <div className="pt-3">
                  <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-600/40 animate-bounce">
                    Obuna bo‘ling ⚡ Follow
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              INSTAGRAM REEL OVERLAY UI (Simulates genuine viral Instagram Reel)
             ========================================================================= */}
          {/* Right Action Stack: Like, Comment, Share, Audio */}
          <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-4 text-white">
            <div className="flex flex-col items-center gap-1 group/btn">
              <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-rose-600/80 transition-colors">
                <Heart className="w-4 h-4 text-white group-hover/btn:fill-rose-500" />
              </div>
              <span className="text-[10px] font-bold font-mono">14.2K</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-bold font-mono">382</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-bold font-mono">1.8K</span>
            </div>

            <div className="w-8 h-8 rounded-full border-2 border-white/40 overflow-hidden bg-black animate-spin duration-3000">
              <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-cyan-400" />
            </div>
          </div>

          {/* Top Reel Navigation Bar */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between text-xs text-white/90">
            <span className="font-extrabold tracking-tight">Reels</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono text-slate-300">9:16 HD</span>
            </div>
          </div>

          {/* Bottom Audio Ticker */}
          <div className="absolute bottom-4 left-4 right-16 z-30 flex items-center gap-2 text-[10px] text-slate-300 truncate">
            <Music className="w-3 h-3 text-cyan-400 shrink-0 animate-pulse" />
            <span className="truncate">
              13 Yoshli Avtoblogger · Asl ovoz (Original Uzbek Voiceover)
            </span>
          </div>

          {/* Scrubbing timeline indicator on bottom edge */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-40">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Center Play/Pause indicator on hover or pause */}
          {!isPlaying && (
            <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl pl-1 animate-pulse">
                <Play className="w-7 h-7 fill-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
