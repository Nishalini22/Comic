import React from 'react';
import { BookOpen, Sparkles, Download, Layers, RotateCcw, FolderHeart, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'creator' | 'preview' | 'layout';
  setActiveTab: (tab: 'creator' | 'preview' | 'layout') => void;
  hasComic: boolean;
  onExportPdf: () => void;
  onOpenLibrary: () => void;
  onResetNew: () => void;
  comicCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasComic,
  onExportPdf,
  onOpenLibrary,
  onResetNew,
  comicCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-black shadow-[0_4px_0_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('creator')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-bangers text-2xl text-black group-hover:rotate-6 transition-transform">
              CC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bangers text-2xl sm:text-3xl tracking-wider text-black">
                  COMIC<span className="text-red-600">CRAFT</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest bg-yellow-300 text-black px-1.5 py-0.5 border border-black rounded shadow-[1px_1px_0px_#000]">
                  AI Studio
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden md:block">
                Gemini 3.8 Storyboard & Comic Illustration Engine
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]">
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'creator'
                ? 'bg-yellow-400 text-black border border-black shadow-[1px_1px_0px_#000]'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Story Creator</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            disabled={!hasComic}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              !hasComic
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : activeTab === 'preview'
                ? 'bg-yellow-400 text-black border border-black shadow-[1px_1px_0px_#000]'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Comic Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            disabled={!hasComic}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hidden sm:flex ${
              !hasComic
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : activeTab === 'layout'
                ? 'bg-yellow-400 text-black border border-black shadow-[1px_1px_0px_#000]'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Layout Binding</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {hasComic && (
            <button
              onClick={onExportPdf}
              className="hidden md:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bangers tracking-wider text-base px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
              title="Compile and Export Comic PDF"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT PDF</span>
            </button>
          )}

          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-stone-900 px-2.5 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
            title="View saved comics library"
          >
            <FolderHeart className="w-4 h-4 text-red-500" />
            <span className="hidden sm:inline">Library</span>
            {comicCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {comicCount}
              </span>
            )}
          </button>

          <button
            onClick={onResetNew}
            className="p-1.5 text-stone-600 hover:text-black hover:bg-stone-100 rounded-lg border border-transparent hover:border-black transition-colors"
            title="Start new comic"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
