import { CheckCircle, ArrowRight } from 'lucide-react';
import { ScheduledMission } from '../../../core/domain/adventure.types';

interface IntermissionScreenProps {
  currentStageIndex: number;
  nextMission?: ScheduledMission;
  onProceed(): void;
}

export function IntermissionScreen({
  currentStageIndex,
  nextMission,
  onProceed,
}: IntermissionScreenProps) {
  return (
    <div className="space-y-5 animate-fade-in text-center">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-nature-500/20 text-nature-400 border border-nature-500/30 mx-auto flex items-center justify-center">
          <CheckCircle className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-nature-400">Stage Cleared!</span>
          <h2 className="text-2xl font-black text-white mt-1">Take a 30-Second Breather</h2>
          <p className="text-sm text-stone-400 mt-1">
            Regroup with your team, drink some water, and get ready for the next objective.
          </p>
        </div>

        {nextMission && (
          <div className="p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/80 text-left">
            <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400">Coming Up Next</div>
            <div className="text-sm font-bold text-stone-100 mt-0.5">
              {nextMission.mission.title}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {nextMission.mission.brief}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onProceed}
          className="w-full py-3.5 px-6 bg-nature-500 hover:bg-nature-400 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-nature-500/20 flex items-center justify-center gap-2"
        >
          <span>We're Ready for Stage {currentStageIndex + 2}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
