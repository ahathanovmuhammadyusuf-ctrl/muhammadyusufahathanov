import React, { useState } from 'react';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { UzbekIntroStudio } from './components/IntroStudio/UzbekIntroStudio';
import { LandingHero } from './components/LandingHero';
import { LandingFeatures } from './components/LandingFeatures';
import { LandingWorkflow } from './components/LandingWorkflow';
import { LandingTestimonials } from './components/LandingTestimonials';
import { LandingFooter } from './components/LandingFooter';
import { WorkspaceLayout } from './components/Workspace/WorkspaceLayout';
import { SampleImage, ToolId } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'intro-reel' | 'studio' | 'landing'>('intro-reel');
  const [selectedToolForStudio, setSelectedToolForStudio] = useState<ToolId>('overview');
  const [selectedSampleForStudio, setSelectedSampleForStudio] = useState<SampleImage | null>(null);

  const handleOpenStudio = (toolId: ToolId = 'overview') => {
    setSelectedToolForStudio(toolId);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSample = (sample: SampleImage) => {
    setSelectedSampleForStudio(sample);
    setSelectedToolForStudio('overview');
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <main className="flex-1">
          {currentView === 'intro-reel' && (
            <UzbekIntroStudio onBack={() => setCurrentView('landing')} />
          )}

          {currentView === 'studio' && (
            <WorkspaceLayout
              initialTool={selectedToolForStudio}
              initialSample={selectedSampleForStudio}
              onNavigateLanding={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentView === 'landing' && (
            <div className="animate-in fade-in duration-200">
              <LandingHero
                onOpenStudio={() => handleOpenStudio('overview')}
                onSelectSample={handleSelectSample}
              />
              <LandingFeatures onSelectFeature={(toolId) => handleOpenStudio(toolId)} />
              <LandingWorkflow />
              <LandingTestimonials />
              <LandingFooter onOpenStudio={() => handleOpenStudio('overview')} />
            </div>
          )}
        </main>
      </div>
    </ToastProvider>
  );
}
