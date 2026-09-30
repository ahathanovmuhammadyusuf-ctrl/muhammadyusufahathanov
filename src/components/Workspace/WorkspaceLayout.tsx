import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { ImageStage } from './ImageStage';
import { OverviewPanel } from './ToolPanels/OverviewPanel';
import { AnalyzerPanel } from './ToolPanels/AnalyzerPanel';
import { PromptPanel } from './ToolPanels/PromptPanel';
import { CaptionPanel } from './ToolPanels/CaptionPanel';
import { OcrPanel } from './ToolPanels/OcrPanel';
import { ColorPanel } from './ToolPanels/ColorPanel';
import { IdeasPanel } from './ToolPanels/IdeasPanel';
import { AskAiPanel } from './ToolPanels/AskAiPanel';
import { HistoryPanel } from './ToolPanels/HistoryPanel';
import { SettingsPanel } from './ToolPanels/SettingsPanel';
import {
  ToolId,
  ImageAnalysisData,
  PromptGenData,
  CaptionGenData,
  OcrData,
  ColorAnalysisData,
  CreativeIdeasData,
  AskAiData,
  HistoryItem,
  SampleImage,
  CaptionTone,
  SocialPlatform,
  PromptStyle,
  UserSettings,
} from '../../types';
import {
  fileToBase64,
  urlToBase64,
  runGeminiAnalysis,
  getStoredHistory,
  saveHistoryItem,
  deleteStoredHistoryItem,
  clearStoredHistory,
  getStoredSettings,
  saveStoredSettings,
} from '../../services/api';
import { useToast } from '../Toast';
import { Menu, Sparkles, ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface WorkspaceLayoutProps {
  initialTool?: ToolId;
  initialSample?: SampleImage | null;
  onNavigateLanding: () => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  initialTool = 'overview',
  initialSample = null,
  onNavigateLanding,
}) => {
  const { toast } = useToast();

  // Navigation State
  const [activeTool, setActiveTool] = useState<ToolId>(initialTool);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Active Image State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rawBase64, setRawBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Tool Specific Generated State
  const [analysisData, setAnalysisData] = useState<ImageAnalysisData | null>(null);
  const [promptData, setPromptData] = useState<PromptGenData | null>(null);
  const [captionData, setCaptionData] = useState<CaptionGenData | null>(null);
  const [ocrData, setOcrData] = useState<OcrData | null>(null);
  const [colorData, setColorData] = useState<ColorAnalysisData | null>(null);
  const [ideasData, setIdeasData] = useState<CreativeIdeasData | null>(null);
  const [askAiData, setAskAiData] = useState<AskAiData | null>(null);

  // History & Settings
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [isAnalyzingColors, setIsAnalyzingColors] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Load history and settings on mount
  useEffect(() => {
    setHistoryItems(getStoredHistory());
    setSettings(getStoredSettings());
  }, []);

  // Update initial tool if prop changed
  useEffect(() => {
    if (initialTool) {
      setActiveTool(initialTool);
    }
  }, [initialTool]);

  // Load initial sample if requested from landing hero
  useEffect(() => {
    if (initialSample) {
      handleLoadSample(initialSample);
    }
  }, [initialSample]);

  // Process a loaded Image
  const processImageFile = async (file: File) => {
    try {
      const { base64, mimeType: detectedMime } = await fileToBase64(file);
      setImageSrc(base64);
      setRawBase64(base64);
      setMimeType(detectedMime);
      setImageName(file.name);

      const sizeKb = Math.round(file.size / 1024);
      setFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);

      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = base64;

      // Clear previous cache for new image
      setAnalysisData(null);
      setPromptData(null);
      setCaptionData(null);
      setOcrData(null);
      setColorData(null);
      setIdeasData(null);
      setAskAiData(null);

      toast('Image loaded into canvas successfully', 'success');

      // Auto-analyze if option enabled
      if (settings.autoAnalyzeOnUpload) {
        setTimeout(() => {
          handleRunAnalysis(base64, detectedMime);
        }, 300);
      }
    } catch (err: any) {
      toast(err?.message || 'Failed to read image file', 'error');
    }
  };

  const handleLoadSample = async (sample: SampleImage) => {
    try {
      const { base64, mimeType: detectedMime } = await urlToBase64(sample.url);
      setImageSrc(base64);
      setRawBase64(base64);
      setMimeType(detectedMime);
      setImageName(sample.title);
      setFileSize('1.2 MB');

      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = base64;

      setAnalysisData(null);
      setPromptData(null);
      setCaptionData(null);
      setOcrData(null);
      setColorData(null);
      setIdeasData(null);
      setAskAiData(null);

      toast(`Loaded preset: ${sample.title}`, 'success');

      // Trigger analysis automatically for seamless demo experience
      setTimeout(() => {
        handleRunAnalysis(base64, detectedMime);
      }, 300);
    } catch (err: any) {
      toast('Failed to load sample image', 'error');
    }
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
    setRawBase64(null);
    setMimeType(null);
    setImageName(null);
    setFileSize(null);
    setImageDimensions(null);
    setAnalysisData(null);
    setPromptData(null);
    setCaptionData(null);
    setOcrData(null);
    setColorData(null);
    setIdeasData(null);
    setAskAiData(null);
    setActiveTool('overview');
    toast('Image removed from canvas', 'info');
  };

  // 1. Trigger Full Image Analysis
  const handleRunAnalysis = async (customBase64?: string, customMime?: string) => {
    const base = customBase64 || rawBase64;
    const mime = customMime || mimeType;
    if (!base || !mime) {
      toast('Please upload an image first', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      const data: ImageAnalysisData = await runGeminiAnalysis(base, mime, 'analyze', {
        model: settings.model,
      });
      setAnalysisData(data);
      toast('Image analysis complete!', 'success');

      // Save to history
      const saved = saveHistoryItem({
        tool: 'analyzer',
        toolTitle: 'Image Analysis',
        imageThumbnail: base,
        summary: data.summary || 'Multimodal breakdown of objects, composition and lighting.',
        data,
      });
      setHistoryItems(getStoredHistory());
    } catch (err: any) {
      toast(err?.message || 'Failed to analyze image.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Trigger AI Prompt Generation
  const handleRunPromptGen = async (style: PromptStyle) => {
    if (!rawBase64 || !mimeType) {
      toast('Please upload an image first', 'error');
      return;
    }

    setIsGeneratingPrompt(true);
    try {
      const data: PromptGenData = await runGeminiAnalysis(rawBase64, mimeType, 'prompt', {
        promptStyle: style,
        model: settings.model,
      });
      setPromptData(data);
      toast('Master prompt reverse-engineered!', 'success');

      saveHistoryItem({
        tool: 'prompt',
        toolTitle: 'Prompt Decompiler',
        imageThumbnail: rawBase64,
        summary: data.masterPrompt.substring(0, 100) + '...',
        data,
      });
      setHistoryItems(getStoredHistory());
    } catch (err: any) {
      toast(err?.message || 'Failed to generate prompt.', 'error');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // 3. Trigger Caption Generation
  const handleRunCaptions = async (platform: SocialPlatform, tone: CaptionTone) => {
    if (!rawBase64 || !mimeType) {
      toast('Please upload an image first', 'error');
      return;
    }

    setIsGeneratingCaptions(true);
    try {
      const data: CaptionGenData = await runGeminiAnalysis(rawBase64, mimeType, 'caption', {
        platform,
        tone,
        model: settings.model,
      });
      setCaptionData(data);
      toast(`Generated 3 ${platform} captions!`, 'success');

      saveHistoryItem({
        tool: 'caption',
        toolTitle: `Captions (${platform})`,
        imageThumbnail: rawBase64,
        summary: `${data.captions?.[0]?.hookTitle || '3 Captions'}: ${data.captions?.[0]?.body.substring(0, 80)}...`,
        data,
      });
      setHistoryItems(getStoredHistory());
    } catch (err: any) {
      toast(err?.message || 'Failed to generate captions.', 'error');
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  // 4. Trigger OCR Extraction
  const handleRunOcr = async () => {
    if (!rawBase64 || !mimeType) {
      toast('Please upload an image first', 'error');
      return;
    }

    setIsExtractingOcr(true);
    try {
      const data: OcrData = await runGeminiAnalysis(rawBase64, mimeType, 'ocr', {
        model: settings.model,
      });
      setOcrData(data);
      toast(data.detected ? 'Text extracted from image!' : 'Scan finished: no text found', 'success');

      saveHistoryItem({
        tool: 'ocr',
        toolTitle: 'Text Extractor',
        imageThumbnail: rawBase64,
        summary: data.detected ? data.fullText.substring(0, 90) : 'No text detected',
        data,
      });
      setHistoryItems(getStoredHistory());
    } catch (err: any) {
      toast(err?.message || 'Failed to extract text.', 'error');
    } finally {
      setIsExtractingOcr(false);
    }
  };

  // 5. Trigger Color Analysis
  const handleRunColors = async () => {
    if (!rawBase64 || !mimeType) {
      toast('Please upload an image first', 'error');
      return;
    }

    setIsAnalyzingColors(true);
    try {
      const data: ColorAnalysisData = await runGeminiAnalysis(rawBase64, mimeType, 'colors', {
        model: settings.model,
      });
      setColorData(data);
      toast('Harmonic color palette analyzed!', 'success');

      saveHistoryItem({
        tool: 'colors',
        toolTitle: 'Color Palette',
        imageThumbnail: rawBase64,
        summary: data.dominantPalette.map((c) => c.name).slice(0, 4).join(', '),
        data,
      });
      setHistoryItems(getStoredHistory());
    } catch (err: any) {
      toast(err?.message || 'Failed to analyze colors.', 'error');
    } finally {
      setIsAnalyzingColors(false);
    }
  };

  // 6. Trigger Creative Ideas
  const handleRunIdeas = async () => {
    if (!rawBase64 || !mimeType) {
      toast('Please upload an image first', 'error');
      return;
    }

    setIsGeneratingIdeas(true);
    try {
      const data: CreativeIdeasData = await runGeminiAnalysis(rawBase64, mimeType, 'ideas', {
        model: settings.model,
      });
      setIdeasData(data);
      toast('6 commercial creative ideas generated!', 'success');

      saveHistoryItem({
        tool: 'ideas',
        toolTitle: 'Creative Ideas',
        imageThumbnail: rawBase64,
        summary: data.creativeCore || `${data.concepts?.length || 6} commercial concepts`,
        data,
      });
      setHistoryItems(getStoredHistory());
    } catch (err: any) {
      toast(err?.message || 'Failed to generate ideas.', 'error');
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  // 7. Trigger Custom Ask AI
  const handleAskAi = async (question: string) => {
    if (!rawBase64 || !mimeType) {
      toast('Please upload an image first', 'error');
      return;
    }

    setIsAskingAi(true);
    try {
      const data: AskAiData = await runGeminiAnalysis(rawBase64, mimeType, 'ask', {
        customQuestion: question,
        model: settings.model,
      });
      setAskAiData(data);
      toast('Answer received!', 'success');

      saveHistoryItem({
        tool: 'ask',
        toolTitle: 'Visual Q&A',
        imageThumbnail: rawBase64,
        summary: `Q: ${question.substring(0, 60)}...`,
        data,
      });
      setHistoryItems(getStoredHistory());
    } catch (err: any) {
      toast(err?.message || 'Failed to answer question.', 'error');
    } finally {
      setIsAskingAi(false);
    }
  };

  // Handle Opening an Item from History
  const handleOpenHistoryItem = (item: HistoryItem) => {
    if (item.imageThumbnail && !imageSrc) {
      setImageSrc(item.imageThumbnail);
      setRawBase64(item.imageThumbnail);
      setMimeType('image/jpeg');
      setImageName('History Snapshot');
    }

    if (item.tool === 'analyzer') setAnalysisData(item.data);
    if (item.tool === 'prompt') setPromptData(item.data);
    if (item.tool === 'caption') setCaptionData(item.data);
    if (item.tool === 'ocr') setOcrData(item.data);
    if (item.tool === 'colors') setColorData(item.data);
    if (item.tool === 'ideas') setIdeasData(item.data);
    if (item.tool === 'ask') setAskAiData(item.data);

    setActiveTool(item.tool);
    toast(`Loaded ${item.toolTitle} from history`, 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteStoredHistoryItem(id);
    setHistoryItems(updated);
  };

  const handleClearAllHistory = () => {
    clearStoredHistory();
    setHistoryItems([]);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const hasAnyActiveLoading =
    isAnalyzing ||
    isGeneratingPrompt ||
    isGeneratingCaptions ||
    isExtractingOcr ||
    isAnalyzingColors ||
    isGeneratingIdeas ||
    isAskingAi;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#08090e]">
      {/* Studio Context Bar for Mobile & Breadcrumbs */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-[#0d0e15] border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg bg-white/[0.05]"
            aria-label="Open Studio Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white capitalize">{activeTool}</span>
        </div>

        <button
          onClick={onNavigateLanding}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
      </div>

      {/* Main 3-Column Studio Layout: Left Sidebar, Center Stage, Right Tools Panel */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: Tool Navigation Sidebar */}
        <Sidebar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          hasImage={Boolean(imageSrc)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          imageThumbnail={imageSrc || undefined}
          imageName={imageName || undefined}
          historyCount={historyItems.length}
        />

        {/* Center: Image Stage / Viewport */}
        <section className="lg:flex-1 min-h-[380px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-white/[0.08] relative">
          <ImageStage
            imageSrc={imageSrc}
            imageName={imageName}
            imageDimensions={imageDimensions}
            fileSize={fileSize}
            mimeType={mimeType}
            onImageSelected={processImageFile}
            onSampleSelected={handleLoadSample}
            onRemoveImage={handleRemoveImage}
            isLoading={hasAnyActiveLoading}
          />
        </section>

        {/* Right: Active Tool Panel Viewport */}
        <section className="w-full lg:w-[480px] xl:w-[540px] shrink-0 bg-[#0e1018] p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {activeTool === 'overview' && (
            <OverviewPanel
              hasImage={Boolean(imageSrc)}
              onSelectTool={setActiveTool}
              analysisData={analysisData}
              onTriggerAnalysis={() => handleRunAnalysis()}
              isLoading={isAnalyzing}
            />
          )}

          {activeTool === 'analyzer' && (
            <AnalyzerPanel
              data={analysisData}
              isLoading={isAnalyzing}
              onAnalyze={() => handleRunAnalysis()}
              hasImage={Boolean(imageSrc)}
            />
          )}

          {activeTool === 'prompt' && (
            <PromptPanel
              data={promptData}
              isLoading={isGeneratingPrompt}
              onGenerate={handleRunPromptGen}
              hasImage={Boolean(imageSrc)}
            />
          )}

          {activeTool === 'caption' && (
            <CaptionPanel
              data={captionData}
              isLoading={isGeneratingCaptions}
              onGenerate={handleRunCaptions}
              hasImage={Boolean(imageSrc)}
            />
          )}

          {activeTool === 'ocr' && (
            <OcrPanel
              data={ocrData}
              isLoading={isExtractingOcr}
              onExtract={handleRunOcr}
              hasImage={Boolean(imageSrc)}
            />
          )}

          {activeTool === 'colors' && (
            <ColorPanel
              data={colorData}
              isLoading={isAnalyzingColors}
              onAnalyze={handleRunColors}
              hasImage={Boolean(imageSrc)}
            />
          )}

          {activeTool === 'ideas' && (
            <IdeasPanel
              data={ideasData}
              isLoading={isGeneratingIdeas}
              onGenerate={handleRunIdeas}
              hasImage={Boolean(imageSrc)}
            />
          )}

          {activeTool === 'ask' && (
            <AskAiPanel
              data={askAiData}
              isLoading={isAskingAi}
              onAsk={handleAskAi}
              hasImage={Boolean(imageSrc)}
            />
          )}

          {activeTool === 'history' && (
            <HistoryPanel
              historyItems={historyItems}
              onOpenItem={handleOpenHistoryItem}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
            />
          )}

          {activeTool === 'settings' && (
            <SettingsPanel
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onClearHistory={handleClearAllHistory}
              historyCount={historyItems.length}
            />
          )}
        </section>
      </div>
    </div>
  );
};
