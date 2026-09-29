import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Printer, Share2, ArrowLeft, FileText, Sparkles, BookOpen, Layers } from 'lucide-react';
import { ExportResult } from '../services/pdfExporter';
import { ComicBook } from '../types/comic';
import { ART_STYLES } from '../utils/comicStyles';

interface ExportSuccessModalProps {
  exportResult: ExportResult;
  comic: ComicBook;
  onClose: () => void;
  onGoToPreview: () => void;
  onCreateNew: () => void;
}

export const ExportSuccessModal: React.FC<ExportSuccessModalProps> = ({
  exportResult,
  comic,
  onClose,
  onGoToPreview,
  onCreateNew,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#eab308', '#ef4444', '#3b82f6', '#10b981'],
    });
  }, []);

  const styleObj = ART_STYLES.find((s) => s.id === comic.artStyle) || ART_STYLES[0];
  const fileSizeMb = (exportResult.fileSizeBytes / (1024 * 1024)).toFixed(2);

  const handleDownloadAgain = () => {
    const link = document.createElement('a');
    link.href = exportResult.blobUrl;
    link.download = exportResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const [copied, setCopied] = React.useState(false);
  const handleShare = () => {
    const shareText = `Check out my comic "${comic.title}" starring ${comic.characterName}, crafted with ComicCraft AI! Art Style: ${styleObj.name}.`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden my-6 animate-in fade-in zoom-in duration-200">
        {/* Comic banner header */}
        <div className="bg-yellow-400 p-6 border-b-4 border-black text-center relative">
          <div className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full text-xs font-bangers tracking-wider uppercase mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>EXPORT SUCCESSFUL</span>
          </div>

          <h2 className="font-bangers text-3xl sm:text-4xl text-black tracking-wide drop-shadow-[1px_1px_0px_#fff]">
            YOUR COMIC BOOK IS READY!
          </h2>
          <p className="text-xs sm:text-sm font-comic text-stone-800 mt-1 max-w-md mx-auto">
            Layout binding and PDF generation completed. Your high-resolution comic has been compiled and saved.
          </p>
        </div>

        {/* File Details Card */}
        <div className="p-6 space-y-5">
          <div className="bg-amber-50 p-4 rounded-xl border-2 border-black space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-600 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 font-comic">
                  Compiled PDF Document
                </div>
                <div className="font-bangers text-xl text-black truncate tracking-wide">
                  {comic.title.toUpperCase()} (ISSUE #{comic.issue || 1})
                </div>
                <div className="font-mono text-xs text-stone-700 truncate bg-white px-2 py-1 rounded border border-stone-300 mt-1">
                  {exportResult.filename}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-200 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block font-comic">
                  Pages
                </span>
                <span className="font-bangers text-lg text-black">
                  {exportResult.pageCount} PAGES
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block font-comic">
                  Panels
                </span>
                <span className="font-bangers text-lg text-black">
                  {comic.panels.length} PANELS
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block font-comic">
                  File Size
                </span>
                <span className="font-bangers text-lg text-black">
                  {fileSizeMb} MB
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-comic font-bold">
            <span className="bg-yellow-200 text-black px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_#000]">
              Style: {styleObj.name}
            </span>
            <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md border border-stone-300">
              Tone: {comic.tone.toUpperCase()}
            </span>
            <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-md border border-red-300">
              Hero: {comic.characterName}
            </span>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleDownloadAgain}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bangers text-xl tracking-wider uppercase rounded-xl border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <Download className="w-5 h-5" />
              <span>DOWNLOAD PDF AGAIN</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 bg-white hover:bg-stone-50 text-black font-bangers text-base tracking-wide rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Printer className="w-4 h-4 text-stone-700" />
                <span>PRINT COMIC</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 bg-white hover:bg-stone-50 text-black font-bangers text-base tracking-wide rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Share2 className="w-4 h-4 text-stone-700" />
                <span>{copied ? 'COPIED TO CLIPBOARD!' : 'SHARE COMIC'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-stone-100 p-4 border-t-3 border-black flex items-center justify-between">
          <button
            onClick={onGoToPreview}
            className="flex items-center gap-1.5 text-xs font-bold font-comic text-stone-700 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Preview</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold font-comic bg-stone-200 hover:bg-stone-300 rounded-lg border border-black transition-colors"
            >
              Close
            </button>
            <button
              onClick={onCreateNew}
              className="px-4 py-1.5 text-xs font-bold font-bangers tracking-wider uppercase bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
            >
              Create Next Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
