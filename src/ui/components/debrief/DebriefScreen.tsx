import { Award, Sparkles, RotateCcw } from 'lucide-react';
import { RuntimeState } from '../../../core/domain/runtime.types';

interface DebriefScreenProps {
  state: RuntimeState;
  onRestart(): void;
}

export function DebriefScreen({ state, onRestart }: DebriefScreenProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const clearedCount = state.completedMissions.filter((m) => !m.skipped).length;
  const totalCount = state.completedMissions.length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-400">Adventure Completed!</span>
          <h2 className="text-3xl font-black text-white mt-1">You Touched Grass!</h2>
          <p className="text-sm text-stone-300 mt-1">
            You conquered the real world together and got off your phones.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 py-2 text-left">
          <div className="p-3 bg-stone-800/60 border border-stone-800 rounded-xl">
            <div className="text-xs text-stone-400 font-medium">Total Time Spent</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {formatTime(state.totalSecondsElapsed)}
            </div>
          </div>

          <div className="p-3 bg-stone-800/60 border border-stone-800 rounded-xl">
            <div className="text-xs text-stone-400 font-medium">Stages Cleared</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {clearedCount} / {totalCount}
            </div>
          </div>
        </div>

        {/* Memory Prompt Checklist */}
        <div className="text-left space-y-2 bg-stone-800/40 p-4 rounded-xl border border-stone-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-nature-400" /> Group Debrief Prompts
          </h3>
          <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
            <li>What was the funniest or most unexpected moment of this quest?</li>
            <li>Who made the most clutch contribution during the climax mission?</li>
            <li>Take a team victory photo holding your natural discoveries.</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="w-full py-3.5 px-6 bg-nature-500 hover:bg-nature-400 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-nature-500/20 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Plan Another Adventure
        </button>
      </div>
    </div>
  );
}
