import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StoryWizard } from './components/StoryWizard';
import { ComicPreview } from './components/ComicPreview';
import { LayoutBuilderView } from './components/LayoutBuilderView';
import { ExportSuccessModal } from './components/ExportSuccessModal';
import { LibraryModal } from './components/LibraryModal';
import { ArtStyleId, ComicBook, ComicPanel, LayoutStyle, ToneId } from './types/comic';
import { exportComicToPdf, ExportResult } from './services/pdfExporter';
import { ART_STYLES } from './utils/comicStyles';

const STORAGE_KEY = 'comiccraft_saved_comics_v1';
const CURRENT_COMIC_KEY = 'comiccraft_current_comic_v1';

// Seed demo comic representing Scenario 1 (The Brave Fox) for immediate immersion
const DEMO_COMIC: ComicBook = {
  id: 'demo-fox-comic-001',
  title: 'THE BRAVE FOX & THE ENCHANTED GROVE',
  issue: 1,
  subtitle: 'Chapter 1: The Whispering Crystal',
  storyPrompt: 'A brave fox exploring an enchanted forest, discovering a magical crystal that awakens a gentle tree spirit.',
  characterName: 'Rusty the Fox',
  characterDetails: 'Energetic young red fox with a tattered green scout cape and glowing amber eyes',
  setting: 'Enchanted Whispering Forest with giant glowing bioluminescent mushrooms and ancient mossy stones',
  tone: 'dramatic',
  artStyle: 'anime-manga',
  layoutStyle: 'grid-4',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  panels: [
    {
      id: 'panel-demo-1',
      panelNumber: 1,
      title: 'Into the Emerald Depths',
      narration: 'Deep within the Whispering Woods, young Rusty stepped past the boundaries of the elder kingdom.',
      narrationPosition: 'top',
      visualDescription: 'Rusty the young red fox in a green explorer scarf standing on a mossy branch overlooking glowing purple mushrooms',
      cameraAngle: 'Wide panoramic establishing angle',
      imageUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=800&q=80',
      imagePrompt: 'anime style red fox exploring magical glowing mushroom forest',
      soundEffect: 'RUSTLE...',
      soundEffectPosition: { x: 75, y: 75 },
      dialogues: [
        {
          id: 'diag-demo-1-1',
          speaker: 'Rusty',
          text: 'The elders warned me not to come here... but the whispers are calling!',
          bubbleType: 'speech',
          position: { x: 12, y: 15 },
        },
      ],
    },
    {
      id: 'panel-demo-2',
      panelNumber: 2,
      title: 'The Luminous Discovery',
      narration: 'Resting atop an altar of roots pulsed an ancient crystal of celestial azure light.',
      narrationPosition: 'top',
      visualDescription: 'Close-up of Rusty with wide dilated eyes gazing in awe at a glowing blue floating crystal',
      cameraAngle: 'Dramatic low-angle close-up',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      imagePrompt: 'anime style close up of young red fox in awe of celestial glowing crystal',
      soundEffect: 'HUMMM...',
      soundEffectPosition: { x: 70, y: 70 },
      dialogues: [
        {
          id: 'diag-demo-2-1',
          speaker: 'Rusty',
          text: 'Is this... the Heart of the First Woods?!',
          bubbleType: 'thought',
          position: { x: 15, y: 15 },
        },
      ],
    },
    {
      id: 'panel-demo-3',
      panelNumber: 3,
      title: 'Awakening the Guardian',
      narration: 'With a gentle touch of his paw, the forest roared to life in a blinding wave of emerald energy.',
      narrationPosition: 'bottom',
      visualDescription: 'Explosion of golden and emerald magical light as the crystal unleashes energy swirling around the fox',
      cameraAngle: 'High-energy dynamic action tilt',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      imagePrompt: 'anime speedlines explosion of magical green and gold sparks around fox hero',
      soundEffect: 'WHOOSH!!',
      soundEffectPosition: { x: 80, y: 65 },
      dialogues: [
        {
          id: 'diag-demo-3-1',
          speaker: 'Forest Spirit',
          text: 'AT LAST! A PURE HEART HAS OPENED THE SEALS!',
          bubbleType: 'shout',
          position: { x: 10, y: 10 },
        },
      ],
    },
    {
      id: 'panel-demo-4',
      panelNumber: 4,
      title: 'A Guardian Reborn',
      narration: 'From a lone wanderer to the guardian of the grove, Rusty stepped forward into his destiny.',
      narrationPosition: 'bottom',
      visualDescription: 'Heroic silhouette of Rusty standing tall upon a sunlit cliff surrounded by flourishing green foliage',
      cameraAngle: 'Triumphant upward heroic angle',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      imagePrompt: 'heroic anime fox standing atop glowing sunlit cliff looking out over magical valley',
      soundEffect: 'SHINE!',
      soundEffectPosition: { x: 75, y: 75 },
      dialogues: [
        {
          id: 'diag-demo-4-1',
          speaker: 'Rusty',
          text: 'Together, we will protect this forest from the shadow realm!',
          bubbleType: 'speech',
          position: { x: 12, y: 18 },
        },
      ],
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'creator' | 'preview' | 'layout'>('preview');
  const [currentComic, setCurrentComic] = useState<ComicBook | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_COMIC_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load current comic from storage:', e);
    }
    return DEMO_COMIC;
  });

  const [savedComics, setSavedComics] = useState<ComicBook[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load saved comics from storage:', e);
    }
    return [DEMO_COMIC];
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportProgress, setExportProgress] = useState({ status: '', percent: 0 });
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Sync current comic to localStorage
  useEffect(() => {
    if (currentComic) {
      try {
        localStorage.setItem(CURRENT_COMIC_KEY, JSON.stringify(currentComic));
      } catch (e) {
        console.warn('Failed to save current comic to localStorage:', e);
      }
    }
  }, [currentComic]);

  // Sync library to localStorage
  const saveComicToLibrary = (comic: ComicBook) => {
    setSavedComics((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === comic.id);
      let updated: ComicBook[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = comic;
      } else {
        updated = [comic, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage quota exceeded:', e);
      }
      return updated;
    });
  };

  const handleDeleteComic = (id: string) => {
    const updated = savedComics.filter((c) => c.id !== id);
    setSavedComics(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage error on delete:', e);
    }
    if (currentComic?.id === id) {
      setCurrentComic(updated[0] || null);
      if (!updated[0]) setActiveTab('creator');
    }
  };

  /**
   * Scenario 1: Generate initial story script and illustrations
   */
  const handleGenerateComic = async (params: {
    storyPrompt: string;
    characterName: string;
    characterDetails: string;
    setting: string;
    tone: ToneId;
    artStyle: ArtStyleId;
    layoutStyle: LayoutStyle;
    panelCount: number;
  }) => {
    setIsGenerating(true);
    setGenerationStep('Scripting Storyboard with Gemini 3.8 Flash...');

    try {
      // Step 1: Call Gemini for storyboard and dialogue
      const storyRes = await fetch('/api/comic/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyPrompt: params.storyPrompt,
          characterName: params.characterName,
          characterDetails: params.characterDetails,
          setting: params.setting,
          tone: params.tone,
          artStyle: params.artStyle,
          panelCount: params.panelCount,
        }),
      });

      if (!storyRes.ok) {
        const errData = await storyRes.json();
        throw new Error(errData.error || 'Failed to generate comic story.');
      }

      const { data: storyData } = await storyRes.json();

      // Initialize ComicBook object
      const newComic: ComicBook = {
        id: `comic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: storyData.title,
        issue: storyData.issue || 1,
        subtitle: storyData.subtitle,
        storyPrompt: params.storyPrompt,
        characterName: params.characterName,
        characterDetails: params.characterDetails,
        setting: params.setting,
        tone: params.tone,
        artStyle: params.artStyle,
        layoutStyle: params.layoutStyle,
        panels: storyData.panels,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentComic(newComic);
      setActiveTab('preview');

      // Step 2: Progressively generate illustration for each panel
      for (let i = 0; i < newComic.panels.length; i++) {
        const panel = newComic.panels[i];
        setGenerationStep(`Illustrating Panel ${i + 1} of ${newComic.panels.length}...`);

        // Mark panel as generating
        setCurrentComic((prev) => {
          if (!prev) return prev;
          const updatedPanels = [...prev.panels];
          updatedPanels[i] = { ...updatedPanels[i], isGeneratingImage: true };
          return { ...prev, panels: updatedPanels };
        });

        try {
          const imgRes = await fetch('/api/comic/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visualDescription: panel.visualDescription,
              characterName: params.characterName,
              characterDetails: params.characterDetails,
              setting: params.setting,
              artStyle: params.artStyle,
              cameraAngle: panel.cameraAngle,
              panelNumber: panel.panelNumber,
              seed: Math.floor(Math.random() * 999999),
            }),
          });

          if (imgRes.ok) {
            const imgData = await imgRes.json();
            setCurrentComic((prev) => {
              if (!prev) return prev;
              const updatedPanels = [...prev.panels];
              updatedPanels[i] = {
                ...updatedPanels[i],
                imageUrl: imgData.imageUrl,
                isGeneratingImage: false,
              };
              const updatedComic = { ...prev, panels: updatedPanels };
              saveComicToLibrary(updatedComic);
              return updatedComic;
            });
          }
        } catch (imgErr) {
          console.error(`Failed to generate image for panel ${i + 1}:`, imgErr);
          setCurrentComic((prev) => {
            if (!prev) return prev;
            const updatedPanels = [...prev.panels];
            updatedPanels[i] = { ...updatedPanels[i], isGeneratingImage: false };
            return { ...prev, panels: updatedPanels };
          });
        }
      }

      setGenerationStep('Comic complete!');
    } catch (err: any) {
      console.error('Error in comic generation pipeline:', err);
      alert(`Generation Error: ${err.message || 'Please try again.'}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  /**
   * Scenario 2: Regenerate entire pipeline with new tone & art style (e.g. 'funny' + 'classic-comic')
   */
  const handleRegenerateEntirePipeline = async (newTone: ToneId, newArtStyle: ArtStyleId) => {
    if (!currentComic) return;
    await handleGenerateComic({
      storyPrompt: currentComic.storyPrompt,
      characterName: currentComic.characterName,
      characterDetails: currentComic.characterDetails,
      setting: currentComic.setting,
      tone: newTone,
      artStyle: newArtStyle,
      layoutStyle: currentComic.layoutStyle,
      panelCount: currentComic.panels.length,
    });
  };

  /**
   * Regenerate single panel illustration
   */
  const handleRegeneratePanelImage = async (panel: ComicPanel, customPrompt?: string) => {
    if (!currentComic) return;

    // Set panel generating state
    setCurrentComic((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        panels: prev.panels.map((p) =>
          p.id === panel.id ? { ...p, isGeneratingImage: true } : p
        ),
      };
    });

    try {
      const res = await fetch('/api/comic/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visualDescription: customPrompt || panel.visualDescription,
          characterName: currentComic.characterName,
          characterDetails: currentComic.characterDetails,
          setting: currentComic.setting,
          artStyle: currentComic.artStyle,
          cameraAngle: panel.cameraAngle,
          panelNumber: panel.panelNumber,
          seed: Math.floor(Math.random() * 999999),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentComic((prev) => {
          if (!prev) return prev;
          const updatedPanels = prev.panels.map((p) =>
            p.id === panel.id
              ? {
                  ...p,
                  imageUrl: data.imageUrl,
                  visualDescription: customPrompt || p.visualDescription,
                  isGeneratingImage: false,
                }
              : p
          );
          const updatedComic = { ...prev, panels: updatedPanels };
          saveComicToLibrary(updatedComic);
          return updatedComic;
        });
      }
    } catch (err) {
      console.error('Failed to regenerate panel image:', err);
    } finally {
      setCurrentComic((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.map((p) =>
            p.id === panel.id ? { ...p, isGeneratingImage: false } : p
          ),
        };
      });
    }
  };

  /**
   * Scenario 3: Call layout_builder and PDF exporter, compile file with timestamped name, show Export Success
   */
  const handleExportPdf = async () => {
    if (!currentComic) return;
    setIsExportingPdf(true);
    setExportProgress({ status: 'Starting PDF layout compilation...', percent: 5 });

    try {
      const result = await exportComicToPdf(currentComic, (status, percent) => {
        setExportProgress({ status, percent });
      });

      setExportResult(result);
    } catch (err: any) {
      console.error('Failed to export PDF:', err);
      alert(`PDF Compilation Error: ${err.message || 'Please check your connection and try again.'}`);
    } finally {
      setIsExportingPdf(false);
      setExportProgress({ status: '', percent: 0 });
    }
  };

  const handleResetNew = () => {
    setActiveTab('creator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2]">
      {/* Top Studio Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasComic={Boolean(currentComic)}
        onExportPdf={handleExportPdf}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onResetNew={handleResetNew}
        comicCount={savedComics.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'creator' && (
          <StoryWizard
            onGenerate={handleGenerateComic}
            isGenerating={isGenerating}
            generationStep={generationStep}
            initialValues={
              currentComic
                ? {
                    storyPrompt: currentComic.storyPrompt,
                    characterName: currentComic.characterName,
                    characterDetails: currentComic.characterDetails,
                    setting: currentComic.setting,
                    tone: currentComic.tone,
                    artStyle: currentComic.artStyle,
                    layoutStyle: currentComic.layoutStyle,
                    panelCount: currentComic.panels.length,
                  }
                : undefined
            }
          />
        )}

        {activeTab === 'preview' && currentComic && (
          <ComicPreview
            comic={currentComic}
            onUpdateComic={(updated) => {
              setCurrentComic(updated);
              saveComicToLibrary(updated);
            }}
            onRegenerateEntirePipeline={handleRegenerateEntirePipeline}
            onRegeneratePanelImage={handleRegeneratePanelImage}
            onExportPdf={handleExportPdf}
            isExportingPdf={isExportingPdf}
            exportProgress={exportProgress}
          />
        )}

        {activeTab === 'layout' && currentComic && (
          <LayoutBuilderView
            comic={currentComic}
            onUpdateComic={(updated) => {
              setCurrentComic(updated);
              saveComicToLibrary(updated);
            }}
            onExportPdf={handleExportPdf}
            isExportingPdf={isExportingPdf}
          />
        )}
      </main>

      {/* Scenario 3: Export Success Confirmation Modal */}
      {exportResult && currentComic && (
        <ExportSuccessModal
          exportResult={exportResult}
          comic={currentComic}
          onClose={() => setExportResult(null)}
          onGoToPreview={() => {
            setExportResult(null);
            setActiveTab('preview');
          }}
          onCreateNew={() => {
            setExportResult(null);
            setActiveTab('creator');
          }}
        />
      )}

      {/* Library of Saved Comics */}
      {isLibraryOpen && (
        <LibraryModal
          comics={savedComics}
          onSelectComic={(comic) => {
            setCurrentComic(comic);
            setActiveTab('preview');
          }}
          onDeleteComic={handleDeleteComic}
          onClose={() => setIsLibraryOpen(false)}
          onCreateNew={() => {
            setIsLibraryOpen(false);
            setActiveTab('creator');
          }}
        />
      )}
    </div>
  );
}
