import { Clock, Users, Layers, Shield, Play } from 'lucide-react';
import { Adventure } from '../../../core/domain/adventure.types';

interface AdventureBriefingProps {
  adventure: Adventure;
  onStart(): void;
  onBack(): void;
}

export function AdventureBriefing({ adventure, onStart, onBack }: AdventureBriefingProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-nature-500/10 text-nature-400 border border-nature-500/30">
            {adventure.generatedByAI ? 'AI Synthesized Adventure' : 'Curated Adventure Arc'}
          </span>
          <h2 className="text-2xl font-black text-white mt-2 leading-tight tracking-tight">
            {adventure.title}
          </h2>
          <p className="text-sm text-stone-300 mt-1 italic leading-relaxed">
            "{adventure.tagline}"
          </p>
        </div>

        <div className="flex items-center gap-4 py-2 border-y border-stone-800 text-xs text-stone-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-nature-400" />
            {adventure.totalEstimatedMinutes} minutes total
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-adventure-sky" />
            {adventure.config.participantCount} adventurers
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            {adventure.missions.length} stages
          </span>
        </div>

        {/* Mission Outline */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Quest Itinerary</h3>
          {adventure.missions.map((sm, index) => (
            <div
              key={sm.mission.id + index}
              className="p-3 rounded-xl bg-stone-800/50 border border-stone-800 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-nature-500/20 text-nature-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="text-sm font-bold text-stone-200 truncate">{sm.mission.title}</h4>
                  <span className="text-xs font-mono text-nature-400 shrink-0 font-semibold">
                    {sm.allocatedMinutes} min
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{sm.mission.brief}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-stone-800/40 border border-stone-800 rounded-xl text-xs text-stone-400 space-y-1">
          <div className="font-semibold text-stone-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-nature-400" /> Trail Agreement
          </div>
          <p>Phones stay in your pocket during missions. Sound and vibrations will guide your timing.</p>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl text-xs transition-colors"
          >
            Adjust Setup
          </button>
          <button
            type="button"
            onClick={onStart}
            className="flex-2 py-3 px-6 bg-nature-500 hover:bg-nature-400 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-nature-500/20 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            Launch Adventure
          </button>
        </div>
      </div>
    </div>
  );
}
