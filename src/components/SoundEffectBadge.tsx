import React from 'react';

interface SoundEffectBadgeProps {
  effect: string;
  onClick?: () => void;
  className?: string;
}

export const SoundEffectBadge: React.FC<SoundEffectBadgeProps> = ({ effect, onClick, className = '' }) => {
  if (!effect) return null;

  return (
    <div
      onClick={onClick}
      className={`inline-block relative select-none transform rotate-[-6deg] hover:rotate-0 hover:scale-110 transition-all cursor-pointer ${className}`}
      title="Comic Sound Effect (Click to change)"
    >
      <div className="relative px-3 py-1 bg-yellow-300 text-red-600 font-bangers text-lg sm:text-2xl tracking-wider uppercase border-2 border-black shadow-[3px_3px_0px_#000] rounded-sm">
        {/* Background starburst glow */}
        <span className="relative z-10 drop-shadow-[1px_1px_0px_#fff]">
          {effect}
        </span>
      </div>
    </div>
  );
};
