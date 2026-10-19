import { Flame, Percent, Sparkles, Trophy, Coins, Compass } from "lucide-react";

export default function GamerToolsBar({
  onSelectCategory,
  onNavigateSales,
  onOpenRoulette,
}: {
  onSelectCategory: (id: string) => void;
  onNavigateSales: () => void;
  onOpenRoulette: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        
        <button
          type="button"
          onClick={onOpenRoulette}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-purple-500/40 bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-3.5 py-2 text-xs font-bold text-purple-300 shadow-sm transition hover:border-purple-400 hover:bg-purple-600/30 hover:text-white"
        >
          <Compass className="h-3.5 w-3.5 text-pink-400" />
          <span>🎲 Trouver un jeu au hasard</span>
        </button>

        <button
          type="button"
          onClick={onNavigateSales}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 transition hover:border-amber-400/60 hover:bg-amber-500/20"
        >
          <Percent className="h-3.5 w-3.5" />
          <span>Grosses Promos (-70% et +)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory("f2p")}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 transition hover:border-emerald-400/60 hover:bg-emerald-500/20"
        >
          <Coins className="h-3.5 w-3.5" />
          <span>100% Jeux Gratuits</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory("open-world")}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-3.5 py-2 text-xs font-bold text-sky-300 transition hover:border-sky-400/60 hover:bg-sky-500/20"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Mondes Ouverts Immenses</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory("souls-like")}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300 transition hover:border-rose-400/60 hover:bg-rose-500/20"
        >
          <Trophy className="h-3.5 w-3.5" />
          <span>Défis Hardcore & Boss</span>
        </button>

      </div>
    </div>
  );
}