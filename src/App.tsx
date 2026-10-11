import { useState, useRef } from 'react';
import { AdventureConfig } from './core/domain/adventure.types';
import { generateAdventure } from './core/generator';
import { AIOrchestrator } from './core/ai';
import { useAdventureRuntime } from './ui/hooks/useAdventureRuntime';
import { Header } from './ui/components/common/Header';
import { SetupScreen } from './ui/components/setup/SetupScreen';
import { AdventureBriefing } from './ui/components/preview/AdventureBriefing';
import { MissionHUD } from './ui/components/runner/MissionHUD';
import { IntermissionScreen } from './ui/components/runner/IntermissionScreen';
import { DebriefScreen } from './ui/components/debrief/DebriefScreen';

export default function App() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const orchestratorRef = useRef<AIOrchestrator>(new AIOrchestrator());

  const {
    state,
    loadAdventure,
    startAdventure,
    togglePause,
    completeCurrentMission,
    skipCurrentMission,
    extendTime,
    proceedFromIntermission,
    reset,
    toggleMute,
  } = useAdventureRuntime();

  const handleGenerate = async (config: AdventureConfig, locationContext?: string) => {
    setIsGenerating(true);
    try {
      if (config.useAI) {
        const adventure = await orchestratorRef.current.synthesizeAdventure(
          config,
          locationContext,
          'in-browser-open-weight'
        );
        loadAdventure(adventure);
      } else {
        const adventure = generateAdventure(config);
        loadAdventure(adventure);
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const activeMission =
    state.adventure && state.adventure.missions[state.currentMissionIndex];

  const nextMission =
    state.adventure && state.currentMissionIndex + 1 < state.adventure.missions.length
      ? state.adventure.missions[state.currentMissionIndex + 1]
      : undefined;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-nature-500 selection:text-white">
      <Header
        isMuted={state.isMuted}
        canReset={state.status !== 'idle'}
        onToggleMute={toggleMute}
        onReset={reset}
      />

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {state.status === 'idle' && (
          <SetupScreen onGenerate={handleGenerate} isGenerating={isGenerating} />
        )}

        {state.status === 'briefing' && state.adventure && (
          <AdventureBriefing
            adventure={state.adventure}
            onStart={startAdventure}
            onBack={reset}
          />
        )}

        {(state.status === 'active' || state.status === 'paused') && activeMission && (
          <MissionHUD
            mission={activeMission}
            stageIndex={state.currentMissionIndex}
            totalStages={state.adventure?.missions.length || 0}
            secondsRemaining={state.secondsRemainingInMission}
            totalSecondsElapsed={state.totalSecondsElapsed}
            isPaused={state.status === 'paused'}
            onComplete={() => completeCurrentMission()}
            onPauseResume={togglePause}
            onExtend={extendTime}
            onSkip={skipCurrentMission}
          />
        )}

        {state.status === 'intermission' && (
          <IntermissionScreen
            currentStageIndex={state.currentMissionIndex}
            nextMission={nextMission}
            onProceed={proceedFromIntermission}
          />
        )}

        {state.status === 'completed' && (
          <DebriefScreen state={state} onRestart={reset} />
        )}
      </main>

      <footer className="border-t border-stone-800 py-3 text-center text-xs text-stone-500">
        Hacktoberfest 2026 Open-Source AI Challenge · Built with Open Weights & Clean Architecture
      </footer>
    </div>
  );
}
