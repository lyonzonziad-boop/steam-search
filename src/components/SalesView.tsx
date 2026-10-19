import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getNewReleases, getSpecials, getTopSellers, type FeaturedItem } from "../lib/steamApi";
import { timeAgo } from "../lib/format";
import GameGrid, { type GridGame } from "./GameGrid";
import type { useCompare } from "../hooks/useCompare";

function toGrid(items: FeaturedItem[]): GridGame[] {
  return items.map((item) => {
    const hasDiscount = item.discount_percent > 0;
    const initial = hasDiscount ? Math.round(item.final_price / (1 - item.discount_percent / 100)) : item.final_price;
    return {
      appid: item.id,
      name: item.name,
      finalPrice: item.final_price,
      initialPrice: initial,
      discount: item.discount_percent,
      currency: item.currency || "EUR",
      isFree: item.final_price === 0 && !hasDiscount,
    };
  });
}

export default function SalesView({
  onOpen,
  compare,
}: {
  onOpen: (appid: number) => void;
  compare: ReturnType<typeof useCompare>;
}) {
  const [specials, setSpecials] = useState<GridGame[]>([]);
  const [topSellers, setTopSellers] = useState<GridGame[]>([]);
  const [newReleases, setNewReleases] = useState<GridGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getSpecials(), getTopSellers(), getNewReleases()])
      .then(([s, t, n]) => {
        setSpecials(toGrid(s));
        setTopSellers(toGrid(t));
        setNewReleases(toGrid(n));
        setLastUpdated(timeAgo());
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger les soldes."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">🔥 Soldes en direct</h2>
          {lastUpdated && <p className="mt-1 text-xs text-slate-400">Dernière mise à jour : {lastUpdated}</p>}
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Actualiser
        </button>
      </div>

      <GameGrid games={specials} loading={loading} error={error} onOpen={onOpen} compare={compare} />

      {(topSellers.length > 0 || loading) && (
        <div className="mt-12">
          <h3 className="mb-4 text-lg font-bold text-white">📈 Meilleures ventes</h3>
          <GameGrid games={topSellers} loading={loading} onOpen={onOpen} compare={compare} />
        </div>
      )}

      {(newReleases.length > 0 || loading) && (
        <div className="mt-12">
          <h3 className="mb-4 text-lg font-bold text-white">✨ Nouveautés</h3>
          <GameGrid games={newReleases} loading={loading} onOpen={onOpen} compare={compare} />
        </div>
      )}
    </section>
  );
}
