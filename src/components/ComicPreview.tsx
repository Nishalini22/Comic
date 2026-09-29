import React, { useState } from 'react';
import { Download, RefreshCw, Edit3, Sparkles, Eye, Layout, Sliders, Maximize2, Share2, Layers } from 'lucide-react';
import { ArtStyleId, ComicBook, ComicPanel, LayoutStyle, ToneId } from '../types/comic';
import { ART_STYLES, TONES } from '../utils/comicStyles';
import { SpeechBubble } from './SpeechBubble';
import { SoundEffectBadge } from './SoundEffectBadge';
import { PanelEditorModal } from './PanelEditorModal';

interface ComicPreviewProps {
  comic: ComicBook;
  onUpdateComic: (updated: ComicBook) => void;
  onRegenerateEntirePipeline: (tone: ToneId, artStyle: ArtStyleId) => Promise<void>;
  onRegeneratePanelImage: (panel: ComicPanel, customPrompt?: string) => Promise<void>;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  exportProgress: { status: string; percent: number };
}

export const ComicPreview: React.FC<ComicPreviewProps> = ({
  comic,
  onUpdateComic,
  onRegenerateEntirePipeline,
  onRegeneratePanelImage,
  onExportPdf,
  isExportingPdf,
  exportProgress,
}) => {
  const [selectedPanel, setSelectedPanel] = useState<ComicPanel | null>(null);
  const [isIteratingToneModal, setIsIteratingToneModal] = useState(false);
  const [iterTone, setIterTone] = useState<ToneId>(comic.tone);
  const [iterArtStyle, setIterArtStyle] = useState<ArtStyleId>(comic.artStyle);
  const [isIteratingLoading, setIsIteratingLoading] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);

  const styleObj = ART_STYLES.find((s) => s.id === comic.artStyle) || ART_STYLES[0];
  const toneObj = TONES.find((t) => t.id === comic.tone) || TONES[0];

  const handleLayoutChange = (newLayout: LayoutStyle) => {
    onUpdateComic({
      ...comic,
      layoutStyle: newLayout,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSavePanel = (updatedPanel: ComicPanel) => {
    const updatedPanels = comic.panels.map((p) =>
      p.id === updatedPanel.id ? updatedPanel : p
    );
    onUpdateComic({
      ...comic,
      panels: updatedPanels,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleApplyIteration = async () => {
    setIsIteratingLoading(true);
    try {
      await onRegenerateEntirePipeline(iterTone, iterArtStyle);
      setIsIteratingToneModal(false);
    } finally {
      setIsIteratingLoading(false);
    }
  };

  // Determine grid container classes based on layoutStyle
  let gridClasses = 'grid grid-cols-1 md:grid-cols-2 gap-5';
  if (comic.layoutStyle === 'strip-4') {
    gridClasses = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4';
  } else if (comic.layoutStyle === 'graphic-6') {
    gridClasses = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5';
  } else if (comic.layoutStyle === 'webtoon') {
    gridClasses = 'flex flex-col gap-6 max-w-2xl mx-auto';
  }

  return (
    <div className={`max-w-6xl mx-auto py-6 px-4 ${fullscreenMode ? 'fixed inset-0 z-50 bg-stone-900 p-6 overflow-y-auto max-w-none' : ''}`}>
      {/* Comic Header Bar */}
      <div className={`bg-white p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] mb-6 ${fullscreenMode ? 'bg-stone-100' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-red-600 text-white font-bangers text-sm px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                ISSUE #{comic.issue || 1}
              </span>
              <span className="bg-yellow-300 text-black font-bangers text-sm px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                {styleObj.name.toUpperCase()}
              </span>
              <span className="bg-amber-100 text-stone-800 text-xs font-bold font-comic px-2 py-0.5 rounded border border-stone-300">
                Tone: {toneObj.emoji} {toneObj.name}
              </span>
            </div>

            <h1 className="font-bangers text-3xl sm:text-5xl text-black tracking-wide leading-none">
              {comic.title.toUpperCase()}
            </h1>
            {comic.subtitle && (
              <p className="font-comic italic text-sm text-stone-600 mt-1">
                "{comic.subtitle}"
              </p>
            )}
            <p className="text-xs text-stone-500 font-comic mt-1">
              Protagonist: <strong>{comic.characterName}</strong> | Setting: <em>{comic.setting}</em>
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Scenario 2 Quick Tone & Art Iteration Button */}
            <button
              onClick={() => {
                setIterTone(comic.tone);
                setIterArtStyle(comic.artStyle);
                setIsIteratingToneModal(true);
              }}
              className="px-3.5 py-2 bg-amber-200 hover:bg-yellow-300 text-black font-bangers text-base tracking-wide rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-transform active:scale-95"
              title="Change tone and art style, then regenerate"
            >
              <Sliders className="w-4 h-4 text-red-600" />
              <span>ITERATE TONE & STYLE</span>
            </button>

            {/* Layout switch */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border-2 border-black">
              {(['grid-4', 'strip-4', 'graphic-6', 'webtoon'] as LayoutStyle[]).map((lay) => (
                <button
                  key={lay}
                  onClick={() => handleLayoutChange(lay)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                    comic.layoutStyle === lay
                      ? 'bg-yellow-400 text-black border border-black shadow-[1px_1px_0px_#000]'
                      : 'text-stone-600 hover:text-black'
                  }`}
                  title={`Switch to ${lay} layout`}
                >
                  {lay === 'grid-4' && '2x2 Grid'}
                  {lay === 'strip-4' && 'Strip'}
                  {lay === 'graphic-6' && '6-Page'}
                  {lay === 'webtoon' && 'Webtoon'}
                </button>
              ))}
            </div>

            {/* Export PDF Button (Scenario 3) */}
            <button
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bangers text-lg tracking-wider rounded-xl border-3 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 transition-transform active:scale-95 ${
                isExportingPdf ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isExportingPdf ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>COMPILING PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>EXPORT PDF</span>
                </>
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setFullscreenMode(!fullscreenMode)}
              className="p-2 text-stone-700 hover:text-black bg-stone-100 hover:bg-stone-200 rounded-xl border-2 border-black transition-colors"
              title="Toggle Fullscreen Reading View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Export progress banner if active */}
        {isExportingPdf && (
          <div className="mt-4 bg-yellow-100 p-3 rounded-xl border-2 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold font-comic text-stone-900">
                {exportProgress.status || 'Compiling high-resolution comic PDF...'}
              </span>
            </div>
            <span className="font-bangers text-base text-red-600">
              {exportProgress.percent}%
            </span>
          </div>
        )}
      </div>

      {/* Comic Page Board */}
      <div className="bg-[#faf6ee] p-5 sm:p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] comic-halftone">
        {/* Comic Strip / Grid Container */}
        <div className={gridClasses}>
          {comic.panels.map((panel, idx) => (
            <div
              key={panel.id}
              className="group relative bg-white rounded-2xl border-4 border-black shadow-[5px_5px_0px_#000] overflow-hidden flex flex-col transition-all hover:shadow-[7px_7px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
            >
              {/* Panel Top Bar: Number & Title & Actions */}
              <div className="bg-stone-100 px-3 py-1.5 border-b-3 border-black flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white font-bangers text-xs px-2 py-0.5 rounded border border-black">
                    PANEL {panel.panelNumber}
                  </span>
                  <span className="font-bangers text-sm text-stone-800 truncate max-w-[180px]">
                    {panel.title}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRegeneratePanelImage(panel)}
                    disabled={panel.isGeneratingImage}
                    className="p-1 text-stone-600 hover:text-black hover:bg-stone-200 rounded transition-colors"
                    title="Regenerate this panel's image"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${panel.isGeneratingImage ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => setSelectedPanel(panel)}
                    className="px-2 py-0.5 text-xs font-bold font-comic bg-yellow-300 hover:bg-yellow-400 text-black rounded border border-black flex items-center gap-1 shadow-[1px_1px_0px_#000]"
                    title="Edit panel narration & dialogue"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Narration caption at top if position === 'top' */}
              {panel.narration && panel.narrationPosition === 'top' && (
                <div
                  onClick={() => setSelectedPanel(panel)}
                  className="bg-yellow-200 hover:bg-yellow-300 px-3 py-1.5 border-b-2 border-black text-xs font-comic font-medium italic text-stone-900 cursor-pointer shadow-inner transition-colors"
                  title="Click to edit narration"
                >
                  "{panel.narration}"
                </div>
              )}

              {/* Panel Illustration Box */}
              <div className="relative aspect-square w-full bg-stone-200 overflow-hidden flex items-center justify-center">
                {panel.imageUrl ? (
                  <img
                    src={panel.imageUrl}
                    alt={panel.visualDescription}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-stone-500">
                    <Sparkles className="w-8 h-8 text-yellow-500 animate-bounce mb-2" />
                    <span className="font-bangers text-lg text-black">GENERATING ART...</span>
                    <span className="text-xs font-comic max-w-xs mt-1 text-stone-600">
                      {panel.cameraAngle} shot
                    </span>
                  </div>
                )}

                {/* Loading overlay for individual panel */}
                {panel.isGeneratingImage && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-20">
                    <RefreshCw className="w-8 h-8 animate-spin text-yellow-300" />
                    <span className="font-bangers text-lg tracking-wider text-yellow-300">
                      DRAWING ILLUSTRATION...
                    </span>
                  </div>
                )}

                {/* Overlaid Speech Bubbles */}
                <div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between z-10">
                  <div className="space-y-2 pointer-events-auto">
                    {panel.dialogues && panel.dialogues.slice(0, 2).map((diag) => (
                      <SpeechBubble
                        key={diag.id}
                        dialogue={diag}
                        isEditable
                        onEdit={() => setSelectedPanel(panel)}
                      />
                    ))}
                  </div>

                  {/* Sound Effect callout sticker */}
                  {panel.soundEffect && (
                    <div className="self-end pointer-events-auto mt-auto">
                      <SoundEffectBadge
                        effect={panel.soundEffect}
                        onClick={() => setSelectedPanel(panel)}
                      />
                    </div>
                  )}
                </div>

                {/* Camera Angle Tag */}
                <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/30 uppercase tracking-wider select-none z-10">
                  {panel.cameraAngle}
                </div>
              </div>

              {/* Narration caption at bottom if position === 'bottom' */}
              {panel.narration && panel.narrationPosition === 'bottom' && (
                <div
                  onClick={() => setSelectedPanel(panel)}
                  className="bg-yellow-200 hover:bg-yellow-300 px-3 py-1.5 border-t-2 border-black text-xs font-comic font-medium italic text-stone-900 cursor-pointer shadow-inner transition-colors"
                  title="Click to edit narration"
                >
                  "{panel.narration}"
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Page Bar */}
        <div className="mt-8 pt-4 border-t-3 border-black flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-comic font-bold text-stone-600">
          <div>
            COMICCRAFT ISSUE #{comic.issue || 1} • {comic.title.toUpperCase()} • {comic.panels.length} PANELS
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onExportPdf}
              className="text-red-600 hover:text-red-700 underline flex items-center gap-1 font-bangers text-base"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD AS PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scenario 2: Iterate Tone & Art Style Modal */}
      {isIteratingToneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
            <div className="bg-yellow-400 p-4 border-b-3 border-black">
              <h2 className="font-bangers text-2xl text-black tracking-wide">
                REGENERATE PIPELINE WITH NEW MOOD
              </h2>
              <p className="text-xs font-comic text-stone-800">
                (Scenario 2): Customize the tone and art style, then regenerate the entire storyline, dialogue, and illustrations!
              </p>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-800 font-comic block mb-1.5">
                  Select New Tone:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setIterTone(t.id)}
                      className={`p-2 rounded-lg border-2 text-left transition-all ${
                        iterTone === t.id
                          ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_#000] font-bold'
                          : 'bg-stone-50 border-stone-300 hover:border-black'
                      }`}
                    >
                      <div className="text-lg">{t.emoji}</div>
                      <div className="text-xs font-comic font-bold">{t.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 font-comic block mb-1.5">
                  Select New Visual Art Style:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ART_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setIterArtStyle(s.id)}
                      className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                        iterArtStyle === s.id
                          ? 'bg-amber-200 border-black shadow-[2px_2px_0px_#000]'
                          : 'bg-stone-50 border-stone-300 hover:border-black'
                      }`}
                    >
                      <div className="font-bangers text-sm text-black">
                        {s.icon} {s.name}
                      </div>
                      <div className="text-[10px] text-stone-600 font-comic truncate">
                        {s.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-stone-100 p-4 border-t-3 border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsIteratingToneModal(false)}
                className="px-3 py-1.5 text-xs font-bold font-comic text-stone-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isIteratingLoading}
                onClick={handleApplyIteration}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bangers text-lg tracking-wider rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:scale-95 flex items-center gap-2"
              >
                {isIteratingLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>REGENERATING ALL...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>REGENERATE PIPELINE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel Editor Inspector Modal */}
      {selectedPanel && (
        <PanelEditorModal
          panel={selectedPanel}
          onClose={() => setSelectedPanel(null)}
          onSave={handleSavePanel}
          onRegenerateImage={onRegeneratePanelImage}
          isRegenerating={Boolean(selectedPanel.isGeneratingImage)}
        />
      )}
    </div>
  );
};
