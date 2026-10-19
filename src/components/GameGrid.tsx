import { Loader2, TriangleAlert } from "lucide-react";
import GameCard from "./GameCard";
import type { CompareStub } from "../hooks/useCompare";

export interface GridGame {
  appid: number;
  name: string;
  finalPrice?: number | null;
  initialPrice?: number | null;
  discount?: number;
  currency?: string;
  isFree?: boolean;
  subtitle?: string;
}

interface GameGridProps {
  games: GridGame[];
  loading?: boolean;
  error?: string | null;
  onOpen: (appid: number) => void;
  compare?: {
    has: (appid: number) => boolean;
    isFull: boolean;
    toggle: (g: CompareStub) => void;
  };
  emptyMessage?: string;
}

function Skeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-white/10 bg-[#1b2838]">
      <div className="aspect-[460/215] w-full bg-slate-700/40" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-slate-700/40" />
        <div className="h-3 w-1/2 rounded bg-slate-700/40" />
      </div>
    </div>
  );
}

export default function GameGrid({ games, loading, error, onOpen, compare, emptyMessage }: GameGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/5 p-8 text-center text-rose-300">
        <TriangleAlert className="h-6 w-6" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (loading && games.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (!loading && games.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">
        {emptyMessage ?? "Aucun jeu trouvé."}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {games.map((g) => (
          <GameCard
            key={g.appid}
            appid={g.appid}
            name={g.name}
            finalPrice={g.finalPrice}
            initialPrice={g.initialPrice}
            discount={g.discount}
            currency={g.currency}
            isFree={g.isFree}
            subtitle={g.subtitle}
            onOpen={onOpen}
            onToggleCompare={compare ? () => compare.toggle({ appid: g.appid, name: g.name, headerImage: "" }) : undefined}
            inCompare={compare?.has(g.appid)}
            compareDisabled={compare?.isFull}
          />
        ))}
      </div>
      {loading && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
        </div>
      )}
    </div>
  );
}
