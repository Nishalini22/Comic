import React from 'react';
import { X, BookOpen, Trash2, Calendar, FileText, Plus, Sparkles } from 'lucide-react';
import { ComicBook } from '../types/comic';
import { ART_STYLES } from '../utils/comicStyles';

interface LibraryModalProps {
  comics: ComicBook[];
  onSelectComic: (comic: ComicBook) => void;
  onDeleteComic: (id: string) => void;
  onClose: () => void;
  onCreateNew: () => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  comics,
  onSelectComic,
  onDeleteComic,
  onClose,
  onCreateNew,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-yellow-400 p-4 border-b-3 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-black" />
            <h2 className="font-bangers text-2xl text-black tracking-wide">
              SAVED COMIC LIBRARY
            </h2>
            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold">
              {comics.length} {comics.length === 1 ? 'Book' : 'Books'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 border-2 border-black transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">
          {comics.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-3">
              <Sparkles className="w-12 h-12 mx-auto text-yellow-500" />
              <p className="font-bangers text-xl text-black">NO SAVED COMICS YET</p>
              <p className="text-xs font-comic max-w-sm mx-auto">
                Generate your first comic using the Story Creator and it will automatically save to your library.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onCreateNew();
                }}
                className="mt-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bangers text-base rounded-xl border-2 border-black shadow-[2px_2px_0px_#000]"
              >
                Create Comic Now
              </button>
            </div>
          ) : (
            comics.map((comic) => {
              const styleObj = ART_STYLES.find((s) => s.id === comic.artStyle) || ART_STYLES[0];
              const dateStr = new Date(comic.updatedAt || comic.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const previewThumb = comic.panels[0]?.imageUrl;

              return (
                <div
                  key={comic.id}
                  className="p-4 bg-stone-50 hover:bg-amber-50 rounded-xl border-2 border-black flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 bg-stone-200 rounded-lg border-2 border-black overflow-hidden flex-shrink-0">
                      {previewThumb ? (
                        <img
                          src={previewThumb}
                          alt={comic.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bangers text-stone-400">
                          CC
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bangers text-base sm:text-lg text-black truncate">
                          {comic.title.toUpperCase()}
                        </span>
                        <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded">
                          #{comic.issue || 1}
                        </span>
                      </div>
                      <p className="text-xs font-comic text-stone-600 line-clamp-1">
                        Hero: <strong>{comic.characterName}</strong> • {styleObj.name} • {comic.tone}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-comic mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>
                        <span>•</span>
                        <span>{comic.panels.length} Panels</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        onSelectComic(comic);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bangers text-sm rounded-lg border border-black shadow-[1px_1px_0px_#000] transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => onDeleteComic(comic.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Comic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-100 p-4 border-t-3 border-black flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onCreateNew();
            }}
            className="flex items-center gap-1.5 text-xs font-bold font-comic text-stone-900 hover:text-red-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Start Fresh Comic</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold font-comic bg-stone-200 hover:bg-stone-300 rounded-lg border border-black transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
