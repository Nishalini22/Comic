import React from 'react';
import { DialogueBubble } from '../types/comic';

interface SpeechBubbleProps {
  dialogue: DialogueBubble;
  onEdit?: () => void;
  isEditable?: boolean;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ dialogue, onEdit, isEditable }) => {
  const { speaker, text, bubbleType } = dialogue;

  // Visual variants for comic bubbles
  let bubbleClasses = 'bg-white text-stone-900 border-2 border-black shadow-[2px_2px_0px_#000]';
  let tailClasses = '';

  switch (bubbleType) {
    case 'thought':
      bubbleClasses = 'bg-white text-stone-900 border-2 border-stone-800 rounded-2xl shadow-[2px_2px_0px_#000]';
      break;
    case 'shout':
      bubbleClasses = 'bg-yellow-200 text-stone-900 border-2 border-red-600 font-bold shadow-[3px_3px_0px_#dc2626] uppercase tracking-wide';
      break;
    case 'whisper':
      bubbleClasses = 'bg-stone-50 text-stone-600 border-2 border-dashed border-stone-500 rounded-xl italic';
      break;
    case 'speech':
    default:
      bubbleClasses = 'bg-white text-stone-900 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]';
      break;
  }

  return (
    <div
      onClick={onEdit}
      className={`relative max-w-[85%] px-3 py-1.5 transition-transform ${bubbleClasses} ${
        isEditable ? 'cursor-pointer hover:scale-105 hover:border-amber-500' : ''
      }`}
      title={isEditable ? 'Click to edit dialogue' : undefined}
    >
      {/* Speaker label */}
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-[10px] font-bold font-comic tracking-wider text-red-600 uppercase bg-stone-100 px-1 rounded border border-stone-300">
          {speaker}
        </span>
        {bubbleType === 'thought' && <span className="text-[9px] text-stone-400">💭 thought</span>}
        {bubbleType === 'shout' && <span className="text-[9px] text-red-600 font-bold">⚡ shout</span>}
      </div>

      {/* Spoken content in comic font */}
      <p className="text-xs sm:text-sm font-comic leading-tight font-medium select-none">
        {bubbleType === 'thought' ? `(${text})` : `"${text}"`}
      </p>

      {/* Bubble pointer tail for speech */}
      {bubbleType === 'speech' && (
        <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black">
          <div className="absolute -top-[9px] -left-[5px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white" />
        </div>
      )}

      {/* Little circles for thought bubble */}
      {bubbleType === 'thought' && (
        <div className="absolute -bottom-2.5 left-4 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-white border border-black" />
          <div className="w-1.5 h-1.5 rounded-full bg-white border border-black mt-1" />
        </div>
      )}
    </div>
  );
};
