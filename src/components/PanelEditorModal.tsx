import React, { useState } from 'react';
import { X, RefreshCw, Plus, Trash2, Volume2, MessageSquare, Image as ImageIcon, Camera } from 'lucide-react';
import { BubbleType, ComicPanel, DialogueBubble } from '../types/comic';

interface PanelEditorModalProps {
  panel: ComicPanel;
  onClose: () => void;
  onSave: (updatedPanel: ComicPanel) => void;
  onRegenerateImage: (panel: ComicPanel, customPrompt?: string) => Promise<void>;
  isRegenerating: boolean;
}

const COMMON_SFX = ['POW!', 'BAM!', 'SWOOSH!', 'WHAM!', 'ZAP!', 'CRASH!', 'BOOM!', 'GASP!', 'AARGH!', 'KLANG!'];

export const PanelEditorModal: React.FC<PanelEditorModalProps> = ({
  panel,
  onClose,
  onSave,
  onRegenerateImage,
  isRegenerating,
}) => {
  const [title, setTitle] = useState(panel.title);
  const [narration, setNarration] = useState(panel.narration);
  const [narrationPosition, setNarrationPosition] = useState(panel.narrationPosition);
  const [visualDescription, setVisualDescription] = useState(panel.visualDescription);
  const [cameraAngle, setCameraAngle] = useState(panel.cameraAngle);
  const [soundEffect, setSoundEffect] = useState(panel.soundEffect || '');
  const [dialogues, setDialogues] = useState<DialogueBubble[]>(panel.dialogues || []);
  const [promptTweak, setPromptTweak] = useState('');

  const handleAddDialogue = () => {
    const newBubble: DialogueBubble = {
      id: `diag-new-${Date.now()}`,
      speaker: 'Hero',
      text: 'New dialogue here...',
      bubbleType: 'speech',
      position: { x: 20, y: 30 },
    };
    setDialogues([...dialogues, newBubble]);
  };

  const handleUpdateDialogue = (index: number, field: keyof DialogueBubble, value: any) => {
    const updated = [...dialogues];
    updated[index] = { ...updated[index], [field]: value };
    setDialogues(updated);
  };

  const handleRemoveDialogue = (index: number) => {
    setDialogues(dialogues.filter((_, idx) => idx !== index));
  };

  const handleSaveAll = () => {
    onSave({
      ...panel,
      title,
      narration,
      narrationPosition,
      visualDescription,
      cameraAngle,
      soundEffect: soundEffect.trim() || null,
      dialogues,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-yellow-400 p-4 border-b-3 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 rounded font-bangers text-sm">
              PANEL #{panel.panelNumber}
            </span>
            <h2 className="font-bangers text-2xl text-black tracking-wide">
              PANEL STUDIO INSPECTOR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 border-2 border-black transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Panel Preview Image & Regenerate */}
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-stone-50 p-4 rounded-xl border-2 border-black">
            <div className="w-36 h-36 flex-shrink-0 bg-stone-200 rounded-lg border-2 border-black overflow-hidden relative">
              {panel.imageUrl ? (
                <img
                  src={panel.imageUrl}
                  alt={`Panel ${panel.panelNumber}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-comic">
                  No Image
                </div>
              )}
              {isRegenerating && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                  <RefreshCw className="w-6 h-6 animate-spin text-yellow-300" />
                  <span>Drawing...</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-bold text-stone-800 font-comic flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-red-600" />
                <span>Visual Description & Camera Angle:</span>
              </label>
              <textarea
                value={visualDescription}
                onChange={(e) => setVisualDescription(e.target.value)}
                rows={2}
                className="w-full p-2 text-xs font-comic rounded-lg border-2 border-black"
                placeholder="Visual prompt for illustration..."
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={cameraAngle}
                  onChange={(e) => setCameraAngle(e.target.value)}
                  placeholder="e.g. Dynamic Low Angle"
                  className="flex-1 p-2 text-xs font-comic rounded-lg border-2 border-black"
                />
                <button
                  type="button"
                  disabled={isRegenerating}
                  onClick={() => onRegenerateImage(panel, visualDescription)}
                  className="px-3 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bangers text-sm rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 whitespace-nowrap transition-transform active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate Art</span>
                </button>
              </div>
            </div>
          </div>

          {/* Narration Caption Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 font-comic flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Narration Box (Yellow Caption):</span>
              </label>
              <div className="flex items-center gap-1">
                {(['top', 'bottom', 'none'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setNarrationPosition(pos)}
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                      narrationPosition === pos
                        ? 'bg-yellow-300 border-black'
                        : 'bg-stone-100 border-stone-300 text-stone-600'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              rows={2}
              placeholder="e.g. As the mist cleared, Rusty caught sight of the shimmering ancient ruins..."
              className="w-full p-2.5 text-xs font-comic bg-amber-50 rounded-lg border-2 border-black focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          {/* Dialogues & Speech Bubbles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 font-comic flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Speech Bubbles ({dialogues.length}):</span>
              </label>
              <button
                type="button"
                onClick={handleAddDialogue}
                className="text-xs font-bold bg-stone-100 hover:bg-stone-200 text-black px-2 py-1 rounded border border-black flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bubble</span>
              </button>
            </div>

            {dialogues.map((diag, index) => (
              <div
                key={diag.id}
                className="p-3 bg-stone-50 rounded-xl border-2 border-stone-300 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={diag.speaker}
                    onChange={(e) => handleUpdateDialogue(index, 'speaker', e.target.value)}
                    placeholder="Speaker"
                    className="w-28 p-1.5 text-xs font-bold font-comic rounded border border-black bg-white"
                  />
                  <select
                    value={diag.bubbleType}
                    onChange={(e) =>
                      handleUpdateDialogue(index, 'bubbleType', e.target.value as BubbleType)
                    }
                    className="p-1.5 text-xs font-comic rounded border border-black bg-white"
                  >
                    <option value="speech">Speech Bubble</option>
                    <option value="thought">Thought Bubble</option>
                    <option value="shout">Shout / Yell</option>
                    <option value="whisper">Whisper</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveDialogue(index)}
                    className="ml-auto p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={diag.text}
                  onChange={(e) => handleUpdateDialogue(index, 'text', e.target.value)}
                  placeholder="Dialogue line..."
                  className="w-full p-2 text-xs font-comic rounded border border-black bg-white"
                />
              </div>
            ))}
          </div>

          {/* Sound Effect Sticker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 font-comic flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-red-600" />
              <span>Comic Sound Effect (SFX):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={soundEffect}
                onChange={(e) => setSoundEffect(e.target.value)}
                placeholder="e.g. POW! or BAM!"
                className="w-36 p-2 text-sm font-bangers rounded-lg border-2 border-black"
              />
              <div className="flex flex-wrap gap-1">
                {COMMON_SFX.map((sfx) => (
                  <button
                    key={sfx}
                    type="button"
                    onClick={() => setSoundEffect(sfx)}
                    className="text-[10px] font-bangers px-1.5 py-0.5 bg-yellow-200 hover:bg-yellow-300 border border-black rounded"
                  >
                    {sfx}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-stone-100 p-4 border-t-3 border-black flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-comic text-xs font-bold text-stone-700 hover:text-black rounded-lg border border-stone-300 hover:border-black transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bangers text-lg tracking-wide rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:scale-95 transition-transform"
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};
