export type ArtStyleId = 
  | 'classic-comic'
  | 'anime-manga'
  | 'graphic-novel'
  | 'cartoon'
  | 'superhero'
  | 'vintage-pulp'
  | 'webtoon';

export interface ArtStyleOption {
  id: ArtStyleId;
  name: string;
  tagline: string;
  description: string;
  promptModifier: string;
  badgeColor: string;
  icon: string;
}

export type ToneId = 
  | 'funny'
  | 'dramatic'
  | 'action'
  | 'mystery'
  | 'whimsical'
  | 'scifi'
  | 'horror';

export interface ToneOption {
  id: ToneId;
  name: string;
  description: string;
  emoji: string;
}

export type BubbleType = 'speech' | 'thought' | 'shout' | 'whisper';

export interface DialogueBubble {
  id: string;
  speaker: string;
  text: string;
  bubbleType: BubbleType;
  position: { x: number; y: number }; // percentage 0 - 100
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  title: string;
  narration: string;
  narrationPosition: 'top' | 'bottom' | 'none';
  visualDescription: string;
  imagePrompt: string;
  imageUrl: string;
  cameraAngle: string;
  soundEffect?: string | null;
  soundEffectPosition?: { x: number; y: number };
  dialogues: DialogueBubble[];
  isGeneratingImage?: boolean;
}

export type LayoutStyle = 'strip-4' | 'grid-4' | 'graphic-6' | 'webtoon' | 'split-3';

export interface ComicBook {
  id: string;
  title: string;
  issue: number;
  subtitle?: string;
  storyPrompt: string;
  characterName: string;
  characterDetails: string;
  setting: string;
  tone: ToneId;
  artStyle: ArtStyleId;
  layoutStyle: LayoutStyle;
  panels: ComicPanel[];
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  exportHistory?: Array<{
    timestamp: string;
    filename: string;
    pageCount: number;
  }>;
}

export interface GenerateStoryRequest {
  storyPrompt: string;
  characterName: string;
  characterDetails?: string;
  setting: string;
  tone: ToneId;
  artStyle: ArtStyleId;
  panelCount?: number;
}

export interface GenerateImageRequest {
  panelNumber: number;
  visualDescription: string;
  characterName: string;
  characterDetails?: string;
  setting: string;
  artStyle: ArtStyleId;
  tone: ToneId;
  seed?: number;
}
