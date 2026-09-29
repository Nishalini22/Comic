import React from 'react';
import { Layers, ArrowUpDown, MoveUp, MoveDown, Download, Check, Sparkles, Sliders } from 'lucide-react';
import { ComicBook, LayoutStyle } from '../types/comic';
import { buildComicLayout } from '../services/layoutBuilder';

interface LayoutBuilderViewProps {
  comic: ComicBook;
  onUpdateComic: (updated: ComicBook) => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export const LayoutBuilderView: React.FC<LayoutBuilderViewProps> = ({
  comic,
  onUpdateComic,
  onExportPdf,
  isExportingPdf,
}) => {
  const pageLayouts = buildComicLayout(comic);

  const handleMovePanel = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= comic.panels.length) return;

    const newPanels = [...comic.panels];
    const temp = newPanels[index];
    newPanels[index] = newPanels[targetIndex];
    newPanels[targetIndex] = temp;

    // Renumber panels
    const renumbered = newPanels.map((p, idx) => ({
      ...p,
      panelNumber: idx + 1,
    }));

    onUpdateComic({
      ...comic,
      panels: renumbered,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleLayoutChange = (layoutStyle: LayoutStyle) => {
    onUpdateComic({
      ...comic,
      layoutStyle,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000] mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-yellow-300 text-black px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border border-black mb-2">
              <Layers className="w-3.5 h-3.5 text-red-600" />
              <span>Layout Binding & Pagination Engine</span>
            </div>
            <h1 className="font-bangers text-3xl sm:text-4xl text-black tracking-wide">
              STRUCTURED COMIC LAYOUT BUILDER
            </h1>
            <p className="text-xs sm:text-sm font-comic text-stone-600 max-w-xl">
              Configure panel arrangement, gutter margins, pagination sequencing, and assembly bindings before compiling your PDF.
            </p>
          </div>

          <button
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bangers text-xl tracking-wider uppercase rounded-xl border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Download className="w-5 h-5" />
            <span>COMPILE & EXPORT PDF</span>
          </button>
        </div>
      </div>

      {/* Grid of Layout Options and Page Blueprint */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Layout Formats */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
            <h3 className="font-bangers text-xl text-black mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-600" />
              <span>PAGE TEMPLATES</span>
            </h3>

            <div className="space-y-2.5">
              {[
                { id: 'grid-4' as const, label: '2x2 Comic Grid', desc: 'Standard 4-panel balanced comic layout' },
                { id: 'strip-4' as const, label: '4-Panel Strip', desc: 'Linear sequential comic strip' },
                { id: 'graphic-6' as const, label: '6-Panel Graphic Novel', desc: '2 columns × 3 rows multi-tiered' },
                { id: 'webtoon' as const, label: 'Webtoon Vertical', desc: 'Seamless mobile scrolling feed' },
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleLayoutChange(template.id)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    comic.layoutStyle === template.id
                      ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_#000] font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-comic text-xs font-bold text-black">{template.label}</span>
                    {comic.layoutStyle === template.id && (
                      <Check className="w-4 h-4 text-black" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 font-comic mt-0.5">{template.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Panel Sequencing & Re-ordering */}
          <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
            <h3 className="font-bangers text-xl text-black mb-3 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-red-600" />
              <span>PANEL SEQUENCING</span>
            </h3>
            <p className="text-[11px] text-stone-500 font-comic mb-3">
              Re-order panels to adjust the story progression:
            </p>

            <div className="space-y-2">
              {comic.panels.map((panel, idx) => (
                <div
                  key={panel.id}
                  className="flex items-center justify-between p-2 bg-stone-50 rounded-lg border border-black text-xs font-comic font-medium"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded bg-black text-white font-bangers text-xs flex items-center justify-center flex-shrink-0">
                      {panel.panelNumber}
                    </span>
                    <span className="truncate max-w-[140px] text-stone-900 font-bold">
                      {panel.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMovePanel(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-stone-200 disabled:opacity-30"
                      title="Move Panel Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMovePanel(idx, 'down')}
                      disabled={idx === comic.panels.length - 1}
                      className="p-1 rounded hover:bg-stone-200 disabled:opacity-30"
                      title="Move Panel Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Pagination Preview Blueprint */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bangers text-xl text-black tracking-wide">
                DOCUMENT STRUCTURE BLUEPRINT (A4 FORMAT)
              </h3>
              <span className="text-xs font-bold text-stone-500 font-comic">
                Target: 1 Cover + {Math.ceil(comic.panels.length / 2)} Story Pages
              </span>
            </div>

            {/* Page 1: Cover Sheet blueprint */}
            <div className="mb-6 p-4 rounded-xl border-2 border-dashed border-stone-400 bg-amber-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase font-comic bg-yellow-300 px-2 py-0.5 rounded border border-black">
                  Page 1: Full-Color Cover Page
                </span>
                <span className="text-[11px] text-stone-500 font-comic">Cover Banner + Splash + Metadata</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-black text-center space-y-1">
                <div className="font-bangers text-lg text-red-600">COMICCRAFT PRESENTS</div>
                <div className="font-bangers text-2xl text-black">{comic.title.toUpperCase()}</div>
                <div className="text-xs font-comic text-stone-600">
                  Featuring {comic.characterName} • {comic.artStyle}
                </div>
              </div>
            </div>

            {/* Story Pages */}
            <div className="space-y-4">
              {pageLayouts.map((page, pIdx) => (
                <div
                  key={page.pageIndex}
                  className="p-4 rounded-xl border-2 border-black bg-stone-50 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                    <span className="text-xs font-bold font-comic text-stone-800">
                      Story Page {pIdx + 1} ({page.panels.length} Panels)
                    </span>
                    <span className="text-[11px] text-stone-500 font-comic">
                      Pagination: Inked Frames & Narration Boxes
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {page.panels.map(({ panel }) => (
                      <div
                        key={panel.id}
                        className="bg-white p-2.5 rounded-lg border-2 border-black flex gap-2 items-center"
                      >
                        <div className="w-12 h-12 rounded bg-stone-200 border border-black overflow-hidden flex-shrink-0">
                          {panel.imageUrl ? (
                            <img
                              src={panel.imageUrl}
                              alt={panel.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                              Art
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-red-600 font-comic">
                            Panel #{panel.panelNumber}
                          </div>
                          <div className="text-xs font-bold text-black truncate font-comic">
                            {panel.title}
                          </div>
                          <div className="text-[10px] text-stone-500 truncate font-comic">
                            {panel.narration || panel.visualDescription}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
