import { useState } from 'react';
import { Clock, Users, MapPin, Flame, BrainCircuit, Bot, Compass, Sparkles } from 'lucide-react';
import { AdventureConfig } from '../../../core/domain/adventure.types';
import { AdventureVibe, Environment, Intensity } from '../../../core/domain/mission.types';

const VIBES: Array<{ id: AdventureVibe; label: string; desc: string; icon: string }> = [
  { id: 'creative', label: 'Creative', desc: 'Craft nature crowns, silhouettes & legends', icon: '🎨' },
  { id: 'explorer', label: 'Explorer', desc: 'Solar navigation, high ground & secret cairns', icon: '🧭' },
  { id: 'detective', label: 'Detective', desc: 'Track anomalies, decode tree barks & forensics', icon: '🔍' },
  { id: 'active', label: 'Active', desc: 'Cadence relays, ridge traverses & monolith balance', icon: '⚡' },
  { id: 'social', label: 'Social', desc: 'Alter-egos, wonder exchanges & unanimous quests', icon: '🤝' },
];

interface SetupScreenProps {
  onGenerate(config: AdventureConfig, locationContext?: string): Promise<void>;
  isGenerating: boolean;
}

export function SetupScreen({ onGenerate, isGenerating }: SetupScreenProps) {
  const [totalMinutes, setTotalMinutes] = useState<number>(45);
  const [participantCount, setParticipantCount] = useState<number>(4);
  const [vibe, setVibe] = useState<AdventureVibe>('creative');
  const [intensity, setIntensity] = useState<Intensity>('chill');
  const [environment, setEnvironment] = useState<Environment>('park');
  const [useAI, setUseAI] = useState<boolean>(false);
  const [locationContext, setLocationContext] = useState<string>('Autumn City Park with Oak Trees');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(
      {
        totalMinutes,
        participantCount,
        vibe,
        intensity,
        environment,
        useAI,
      },
      useAI ? locationContext : undefined
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Assemble Your Adventure</h2>
        <p className="text-stone-400 text-sm">
          Get off screens and start exploring together. Fully dynamic & cooperative.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-5 shadow-xl">
        {/* Duration Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-stone-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-nature-400" />
              Available Time
            </label>
            <span className="text-sm font-bold text-nature-400 bg-nature-500/10 px-2.5 py-0.5 rounded-full border border-nature-500/20">
              {totalMinutes} minutes
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="90"
            step="5"
            value={totalMinutes}
            onChange={(e) => setTotalMinutes(Number(e.target.value))}
            className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-nature-500"
          />
          <div className="flex justify-between text-[11px] text-stone-500 mt-1">
            <span>15m Quick</span>
            <span>45m Standard</span>
            <span>90m Epic Expedition</span>
          </div>
        </div>

        {/* Group Size */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-stone-200 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-adventure-sky" />
              Adventurers Count
            </label>
            <span className="text-sm font-bold text-adventure-sky bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              {participantCount} people
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[2, 3, 4, 5, 6, 8].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setParticipantCount(count)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  participantCount === count
                    ? 'bg-adventure-sky/20 border-adventure-sky text-white'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:border-stone-600'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe Selection */}
        <div>
          <label className="block text-sm font-semibold text-stone-200 mb-2.5">
            Adventure Archetype (Vibe)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {VIBES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVibe(v.id)}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  vibe === v.id
                    ? 'bg-nature-500/15 border-nature-500 text-white shadow-sm'
                    : 'bg-stone-800/40 border-stone-800/80 text-stone-400 hover:border-stone-700 hover:text-stone-300'
                }`}
              >
                <span className="text-2xl">{v.icon}</span>
                <div>
                  <div className="font-semibold text-sm text-stone-200">{v.label}</div>
                  <div className="text-xs text-stone-400 mt-0.5 line-clamp-1">{v.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Environment & Intensity */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-500" /> Terrain
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as Environment)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-medium text-stone-200 focus:outline-none focus:border-nature-500"
            >
              <option value="park">Public Park / Green Space</option>
              <option value="outdoor">Wild Nature / Trail</option>
              <option value="urban">Urban Streets / Campus</option>
              <option value="any">Any Surroundings</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-stone-500" /> Intensity
            </label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as Intensity)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-medium text-stone-200 focus:outline-none focus:border-nature-500"
            >
              <option value="chill">Chill & Relaxed</option>
              <option value="standard">Standard Movement</option>
              <option value="high_energy">High Energy Active</option>
            </select>
          </div>
        </div>

        {/* Open-Source AI Generation Toggle */}
        <div className="pt-2 border-t border-stone-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-bold text-stone-200">Open-Source AI Synthesis</div>
                <div className="text-[11px] text-stone-400">Synthesize custom missions from scratch</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {useAI && (
            <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-3 space-y-2 animate-fade-in">
              <label className="block text-xs font-medium text-purple-300">
                Your Immediate Surroundings / Location Note:
              </label>
              <input
                type="text"
                value={locationContext}
                onChange={(e) => setLocationContext(e.target.value)}
                placeholder="e.g. Pine trees, gravel trail, nearby riverbank..."
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-purple-400"
              />
              <div className="text-[10px] text-purple-300/80 flex items-center gap-1">
                <Bot className="w-3 h-3" /> Uses local open-weight models (zero cloud fees & offline on trail).
              </div>
            </div>
          )}
        </div>

        {/* Action CTA */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-nature-500 to-emerald-600 hover:from-nature-400 hover:to-emerald-500 text-stone-950 font-bold rounded-xl shadow-lg shadow-nature-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Synthesizing Adventure Arc...
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              Generate Adventure ({totalMinutes}m · {participantCount}p)
            </>
          )}
        </button>
      </form>
    </div>
  );
}
