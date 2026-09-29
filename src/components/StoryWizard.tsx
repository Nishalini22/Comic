import React, { useState } from 'react';
import { Sparkles, Dices, Wand2, Palette, Smile, MapPin, User, Layout, ArrowRight } from 'lucide-react';
import { ArtStyleId, LayoutStyle, ToneId } from '../types/comic';
import { ART_STYLES, STORY_PRESETS, TONES } from '../utils/comicStyles';

interface StoryWizardProps {
  onGenerate: (data: {
    storyPrompt: string;
    characterName: string;
    characterDetails: string;
    setting: string;
    tone: ToneId;
    artStyle: ArtStyleId;
    layoutStyle: LayoutStyle;
    panelCount: number;
  }) => void;
  isGenerating: boolean;
  generationStep: string;
  initialValues?: {
    storyPrompt?: string;
    characterName?: string;
    characterDetails?: string;
    setting?: string;
    tone?: ToneId;
    artStyle?: ArtStyleId;
    layoutStyle?: LayoutStyle;
    panelCount?: number;
  };
}

export const StoryWizard: React.FC<StoryWizardProps> = ({
  onGenerate,
  isGenerating,
  generationStep,
  initialValues,
}) => {
  const [storyPrompt, setStoryPrompt] = useState(
    initialValues?.storyPrompt || 'A brave fox exploring an enchanted forest, searching for a legendary glowing blossom.'
  );
  const [characterName, setCharacterName] = useState(
    initialValues?.characterName || 'Rusty the Fox'
  );
  const [characterDetails, setCharacterDetails] = useState(
    initialValues?.characterDetails || 'Energetic young red fox with a little adventurer scarf and glowing amber eyes'
  );
  const [setting, setSetting] = useState(
    initialValues?.setting || 'Enchanted Whispering Forest with giant bioluminescent flora and magical misty groves'
  );
  const [tone, setTone] = useState<ToneId>(initialValues?.tone || 'dramatic');
  const [artStyle, setArtStyle] = useState<ArtStyleId>(initialValues?.artStyle || 'anime-manga');
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>(initialValues?.layoutStyle || 'grid-4');
  const [panelCount, setPanelCount] = useState<number>(initialValues?.panelCount || 4);

  const applyPreset = (preset: (typeof STORY_PRESETS)[0]) => {
    setStoryPrompt(preset.prompt);
    setCharacterName(preset.characterName);
    setCharacterDetails(preset.characterDetails);
    setSetting(preset.setting);
    setTone(preset.tone);
    setArtStyle(preset.artStyle);
    setLayoutStyle(preset.layoutStyle);
  };

  const handleRandomize = () => {
    const randomPreset = STORY_PRESETS[Math.floor(Math.random() * STORY_PRESETS.length)];
    applyPreset(randomPreset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyPrompt.trim() || !characterName.trim() || !setting.trim()) return;
    onGenerate({
      storyPrompt,
      characterName,
      characterDetails,
      setting,
      tone,
      artStyle,
      layoutStyle,
      panelCount,
    });
  };

  const selectedArtStyle = ART_STYLES.find((s) => s.id === artStyle) || ART_STYLES[0];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Hero Title Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-yellow-300 border-2 border-black px-4 py-1 rounded-full shadow-[2px_2px_0px_#000] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-red-600" />
          <span>Next-Gen AI Comic Book Studio</span>
        </div>
        <h1 className="font-bangers text-4xl sm:text-6xl tracking-wide text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
          CRAFT YOUR PERSONALIZED COMIC
        </h1>
        <p className="mt-2 text-stone-600 max-w-2xl mx-auto font-comic text-base sm:text-lg">
          Describe your vision, pick your protagonist, tune the mood and art style. ComicCraft will script, storyboard, and illustrate an original comic page with Google Gemini and comic diffusion.
        </p>
      </div>

      {/* Preset Inspirations Bar */}
      <div className="mb-8 bg-white p-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bangers text-lg text-black tracking-wide">
              ⚡ QUICK INSPIRATION PRESETS
            </span>
            <span className="text-xs text-stone-500 font-comic">(Click to auto-fill)</span>
          </div>
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-1.5 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-black px-2.5 py-1 rounded-lg border border-black shadow-[1px_1px_0px_#000] transition-colors"
          >
            <Dices className="w-3.5 h-3.5 text-red-600" />
            <span>Randomize</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {STORY_PRESETS.map((p) => {
            const isCurrent = storyPrompt === p.prompt;
            return (
              <button
                key={p.title}
                type="button"
                onClick={() => applyPreset(p)}
                className={`text-left p-2.5 rounded-xl border-2 transition-all ${
                  isCurrent
                    ? 'bg-yellow-200 border-black shadow-[2px_2px_0px_#000] scale-[1.02]'
                    : 'bg-stone-50 hover:bg-amber-50 border-stone-300 hover:border-black'
                }`}
              >
                <div className="font-bold font-comic text-xs text-black truncate mb-1">
                  {p.title}
                </div>
                <div className="text-[11px] text-stone-600 line-clamp-2 leading-tight">
                  {p.prompt}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-stone-500">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-stone-200">
                    {p.tone}
                  </span>
                  <span>•</span>
                  <span className="truncate">{p.artStyle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Story Idea Box */}
        <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <label className="font-bangers text-xl text-black flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-red-600" />
              <span>1. STORY PROMPT & CORE PREMISE</span>
            </label>
            <span className="text-xs text-stone-400 font-comic">Required</span>
          </div>
          <p className="text-xs text-stone-500 mb-2 font-comic">
            What happens in this comic issue? Describe the conflict, journey, joke, or adventure.
          </p>
          <textarea
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            rows={3}
            required
            placeholder="e.g. A brave fox exploring an enchanted forest, discovering a magical crystal that awakens a gentle forest spirit..."
            className="w-full p-3 rounded-xl border-2 border-black font-comic text-stone-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base resize-none shadow-[2px_2px_0px_rgba(0,0,0,0.05)]"
          />
        </div>

        {/* Character & Setting Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Protagonist Info */}
          <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
            <label className="font-bangers text-xl text-black flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-red-600" />
              <span>2. MAIN CHARACTER</span>
            </label>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-stone-700 font-comic">Character Name:</span>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  required
                  placeholder="e.g. Rusty the Fox"
                  className="w-full mt-1 p-2.5 rounded-lg border-2 border-black font-comic text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-700 font-comic">
                  Visual Appearance & Anchors:
                </span>
                <input
                  type="text"
                  value={characterDetails}
                  onChange={(e) => setCharacterDetails(e.target.value)}
                  placeholder="e.g. Red fur, green scout cape, goggles, energetic tail"
                  className="w-full mt-1 p-2.5 rounded-lg border-2 border-black font-comic text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <span className="text-[11px] text-stone-500 font-comic">
                  Helps AI maintain character consistency across panels.
                </span>
              </div>
            </div>
          </div>

          {/* Setting Info */}
          <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
            <label className="font-bangers text-xl text-black flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>3. SETTING & ENVIRONMENT</span>
            </label>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-stone-700 font-comic">World / Location:</span>
                <input
                  type="text"
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                  required
                  placeholder="e.g. Enchanted forest with giant glowing mushrooms"
                  className="w-full mt-1 p-2.5 rounded-lg border-2 border-black font-comic text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-stone-300">
                <span className="text-[11px] text-stone-700 font-comic block">
                  💡 <strong>Pro Tip:</strong> Specific lighting (e.g. "sunset glow", "neon rain", "dim lanterns") adds dramatic visual flair to every panel.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
          <label className="font-bangers text-xl text-black flex items-center gap-2 mb-2">
            <Smile className="w-5 h-5 text-red-600" />
            <span>4. NARRATIVE TONE & MOOD</span>
          </label>
          <p className="text-xs text-stone-500 mb-3 font-comic">
            Controls script style, dialogue humor, suspense level, and sound effects.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {TONES.map((t) => {
              const isSelected = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_#000] scale-105 font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-300 text-stone-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{t.emoji}</span>
                  <span className="text-xs font-comic font-bold leading-tight">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Art Style Selector */}
        <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <label className="font-bangers text-xl text-black flex items-center gap-2">
              <Palette className="w-5 h-5 text-red-600" />
              <span>5. VISUAL ART STYLE</span>
            </label>
            <span className="text-xs font-bold text-red-600 uppercase font-comic">
              Selected: {selectedArtStyle.name}
            </span>
          </div>
          <p className="text-xs text-stone-500 mb-3 font-comic">
            Powered by prompt-engineered Stable Diffusion & comic illustration models.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ART_STYLES.map((style) => {
              const isSelected = artStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setArtStyle(style.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'bg-amber-100 border-black shadow-[3px_3px_0px_#000] scale-[1.02]'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bangers text-lg text-black tracking-wide">
                      {style.icon} {style.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 font-comic leading-snug">
                    {style.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout & Panel Count */}
        <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000]">
          <label className="font-bangers text-xl text-black flex items-center gap-2 mb-2">
            <Layout className="w-5 h-5 text-red-600" />
            <span>6. LAYOUT & PANEL COUNT</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-stone-700 font-comic block mb-1.5">
                Panel Layout Format:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'grid-4' as const, label: '2x2 Comic Grid', desc: 'Classic graphic novel format' },
                  { id: 'strip-4' as const, label: '4-Panel Strip', desc: 'Newspaper strip layout' },
                  { id: 'graphic-6' as const, label: '6-Panel Graphic Page', desc: 'Epic multi-tier storytelling' },
                  { id: 'webtoon' as const, label: 'Webtoon Vertical', desc: 'Digital continuous scroll' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setLayoutStyle(l.id);
                      if (l.id === 'graphic-6') setPanelCount(6);
                      else if (l.id === 'strip-4' || l.id === 'grid-4') setPanelCount(4);
                    }}
                    className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                      layoutStyle === l.id
                        ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_#000]'
                        : 'bg-stone-50 border-stone-300'
                    }`}
                  >
                    <div className="text-xs font-bold font-comic text-black">{l.label}</div>
                    <div className="text-[10px] text-stone-500 font-comic">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-stone-700 font-comic block mb-1.5">
                Number of Panels:
              </span>
              <div className="flex items-center gap-2">
                {[3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPanelCount(num)}
                    className={`flex-1 py-3 rounded-lg border-2 font-bangers text-lg transition-all ${
                      panelCount === num
                        ? 'bg-red-600 text-white border-black shadow-[2px_2px_0px_#000]'
                        : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-black'
                    }`}
                  >
                    {num} PANELS
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-500 font-comic mt-2">
                Gemini will pace the story beat-by-beat across exactly {panelCount} panels.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full sm:w-auto min-w-[320px] py-4 px-8 rounded-2xl font-bangers text-2xl tracking-wider uppercase border-3 border-black transition-all ${
              isGenerating
                ? 'bg-yellow-300 text-black cursor-wait opacity-90'
                : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                <span>{generationStep || 'GENERATING COMIC STORY...'}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-red-600 animate-pulse" />
                <span>GENERATE COMIC STORY & ART</span>
                <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </button>
          <p className="text-xs text-stone-500 font-comic mt-2">
            Generates cohesive script, panel dialogues, speech bubbles, and AI comic illustrations.
          </p>
        </div>
      </form>
    </div>
  );
};
