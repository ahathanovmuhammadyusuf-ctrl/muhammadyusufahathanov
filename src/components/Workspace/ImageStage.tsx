import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Info,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../../data/samples';
import { SampleImage } from '../../types';

interface ImageStageProps {
  imageSrc: string | null;
  imageName: string | null;
  imageDimensions: { width: number; height: number } | null;
  fileSize: string | null;
  mimeType: string | null;
  onImageSelected: (file: File) => void;
  onSampleSelected: (sample: SampleImage) => void;
  onRemoveImage: () => void;
  isLoading: boolean;
}

export const ImageStage: React.FC<ImageStageProps> = ({
  imageSrc,
  imageName,
  imageDimensions,
  fileSize,
  mimeType,
  onImageSelected,
  onSampleSelected,
  onRemoveImage,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);

  const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  const validateAndHandleFile = (file: File) => {
    setDropError(null);
    if (!supportedTypes.includes(file.type)) {
      setDropError('Unsupported file type. Please upload a PNG, JPG, JPEG, or WEBP image.');
      return;
    }
    // Limit to 50MB
    if (file.size > 50 * 1024 * 1024) {
      setDropError('File is too large. Maximum supported image size is 50MB.');
      return;
    }
    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndHandleFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0c13] p-4 sm:p-6 overflow-y-auto">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Main View Area */}
      {!imageSrc ? (
        <div className="flex-1 flex flex-col justify-center items-center max-w-xl mx-auto w-full my-auto space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerUpload}
            className={`w-full p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center group ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10 shadow-2xl shadow-purple-500/20 scale-[1.01]'
                : 'border-white/[0.12] bg-[#12141f]/70 hover:bg-[#161826]/90 hover:border-purple-500/40'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-200 mb-5">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              Drop your image here, or{' '}
              <span className="text-purple-400 group-hover:text-purple-300 underline underline-offset-4">
                browse files
              </span>
            </h3>

            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Supports high-resolution PNG, JPG, JPEG, and WEBP formats up to 50MB.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06]">
              <span>PNG</span>
              <span>·</span>
              <span>JPG</span>
              <span>·</span>
              <span>WEBP</span>
              <span>·</span>
              <span>Direct Paste (Ctrl+V)</span>
            </div>
          </div>

          {/* Error notice if validation fails */}
          {dropError && (
            <div className="w-full p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{dropError}</span>
            </div>
          )}

          {/* Quick preset sample cards */}
          <div className="w-full pt-4">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Don&apos;t have an image? Try a showcase preset:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSampleSelected(sample)}
                  className="group p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-purple-500/30 text-left transition-all duration-150 flex items-center gap-3 active:scale-[0.98]"
                >
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="w-12 h-12 rounded-lg object-cover border border-white/10 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                      {sample.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{sample.category}</div>
                    <div className="text-[10px] text-purple-400/90 font-mono mt-0.5">Load Sample →</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Mode */
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-[#12141f]/80 backdrop-blur-md p-3 rounded-xl border border-white/[0.08]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-white truncate block">
                  {imageName || 'Uploaded Image'}
                </span>
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                  {imageDimensions && (
                    <span>
                      {imageDimensions.width} × {imageDimensions.height} px
                    </span>
                  )}
                  {fileSize && (
                    <>
                      <span>·</span>
                      <span>{fileSize}</span>
                    </>
                  )}
                  {mimeType && (
                    <>
                      <span>·</span>
                      <span className="uppercase">{mimeType.replace('image/', '')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerUpload}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors"
                title="Replace with another image"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replace</span>
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onRemoveImage}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
                title="Remove image from canvas"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>

          {/* Central Image Viewport */}
          <div className="flex-1 relative rounded-2xl border border-white/[0.08] bg-[#07080d] overflow-hidden flex items-center justify-center p-2 group">
            <img
              src={imageSrc}
              alt="Active Canvas Preview"
              className="max-h-[62vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
              referrerPolicy="no-referrer"
            />

            {isLoading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 animate-in fade-in duration-150">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <Sparkles className="w-5 h-5 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-white">Gemini 3 Vision Synthesizing...</div>
                  <div className="text-[11px] text-purple-300">Extracting visual features & semantics</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Modal View */}
      {isFullscreen && imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="text-xs font-bold text-white font-mono">{imageName}</span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={imageSrc}
              alt="Fullscreen inspect"
              className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
