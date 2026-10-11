import { CheckCircle, Play, Pause, PlusCircle, SkipForward, Users } from 'lucide-react';
import { ScheduledMission } from '../../../core/domain/adventure.types';

interface MissionHUDProps {
  mission: ScheduledMission;
  stageIndex: number;
  totalStages: number;
  secondsRemaining: number;
  totalSecondsElapsed: number;
  isPaused: boolean;
  onComplete(): void;
  onPauseResume(): void;
  onExtend(minutes: number): void;
  onSkip(): void;
}

export function MissionHUD({
  mission,
  stageIndex,
  totalStages,
  secondsRemaining,
  totalSecondsElapsed,
  isPaused,
  onComplete,
  onPauseResume,
  onExtend,
  onSkip,
}: MissionHUDProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-5 shadow-2xl">
        {/* Stage Progress Header */}
        <div className="flex justify-between items-center text-xs text-stone-400 font-medium">
          <span className="uppercase tracking-wider font-bold text-nature-400">
            Stage {stageIndex + 1} of {totalStages} · {mission.phase}
          </span>
          <span>Total Elapsed: {formatTime(totalSecondsElapsed)}</span>
        </div>

        {/* Mission Title & Brief */}
        <div>
          <h2 className="text-2xl font-black text-white leading-tight tracking-tight">
            {mission.mission.title}
          </h2>
          <p className="text-sm text-stone-300 mt-1 leading-relaxed">
            {mission.mission.brief}
          </p>
        </div>

        {/* Big Outdoor Countdown Clock */}
        <div
          className={`py-6 px-4 rounded-2xl border text-center transition-all ${
            isPaused
              ? 'bg-amber-950/20 border-amber-600/40 text-amber-300'
              : secondsRemaining <= 60
              ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              : 'bg-stone-800/40 border-stone-700/80 text-white'
          }`}
        >
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight">
            {formatTime(secondsRemaining)}
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-75">
            {isPaused ? 'PAUSED FOR REGROUP' : 'TIME REMAINING IN STAGE'}
          </div>
        </div>

        {/* Cooperative Hook Callout */}
        <div className="p-3.5 bg-nature-950/30 border border-nature-600/40 rounded-xl space-y-1">
          <div className="text-xs font-bold text-nature-300 flex items-center gap-1.5 uppercase tracking-wide">
            <Users className="w-3.5 h-3.5" /> Cooperative Mechanic
          </div>
          <p className="text-xs text-stone-200 leading-relaxed font-medium">
            {mission.mission.cooperativeHook}
          </p>
        </div>

        {/* Instructions Checklist */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Stage Actions</h3>
          <ul className="space-y-1.5 text-xs text-stone-300">
            {mission.mission.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-stone-800/40 p-2.5 rounded-lg border border-stone-800">
                <span className="w-4 h-4 rounded-full bg-stone-700 text-stone-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assigned Multiplayer Roles */}
        {mission.assignedRoles.length > 0 && (
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Player Roles</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {mission.assignedRoles.map((a, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-stone-800/60 border border-stone-700/60">
                  <div className="font-bold text-adventure-sky">
                    Player {a.participantNumber}: {a.role.title}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{a.role.duty}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mission Controls */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={onComplete}
            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Mission Complete! Next Stage
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onPauseResume}
              className="py-2.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              type="button"
              onClick={() => onExtend(2)}
              className="py-2.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-nature-400" />
              +2 Min
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="py-2.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
