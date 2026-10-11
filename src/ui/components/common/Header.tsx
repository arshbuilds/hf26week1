import { Compass, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  isMuted?: boolean;
  canReset: boolean;
  onToggleMute(): void;
  onReset(): void;
}

export function Header({ isMuted, canReset, onToggleMute, onReset }: HeaderProps) {
  return (
    <header className="border-b border-stone-800 bg-stone-900/80 backdrop-blur sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-nature-500/20 border border-nature-500/40 flex items-center justify-center text-nature-400">
          <Compass className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight leading-tight flex items-center gap-2">
            Adventure Generator
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-nature-500/10 text-nature-400 border border-nature-500/20">
              Touch Grass
            </span>
          </h1>
          <p className="text-xs text-stone-400">Real-world multiplayer cooperative quests</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {canReset && (
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title={isMuted ? 'Unmute audio cues' : 'Mute audio cues'}
            aria-label={isMuted ? 'Unmute audio cues' : 'Mute audio cues'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {canReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>
    </header>
  );
}
