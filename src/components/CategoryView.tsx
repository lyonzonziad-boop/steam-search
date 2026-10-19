import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { searchByTag, type SortOption, type TagResultGame } from "../lib/steamApi";
import { CATEGORIES } from "../lib/categories";
import GameGrid, { type GridGame } from "./GameGrid";
import type { useCompare } from "../hooks/useCompare";

const PAGE_SIZE = 30;

function toGrid(games: TagResultGame[]): GridGame[] {
  return games.map((g) => ({
    appid: g.appid,
    name: g.name,
    finalPrice: g.finalPrice,
    initialPrice: g.initialPrice,
    discount: g.discount,
    currency: "EUR",
    isFree: g.isFree,
    subtitle: g.releaseDate,
  }));
}

export default function CategoryView({
  categoryId,
  onOpen,
  compare,
  onBack,
}: {
  categoryId: string;
  onOpen: (appid: number) => void;
  compare: ReturnType<typeof useCompare>;
  onBack: () => void;
}) {
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const [sort, setSort] = useState<SortOption>("popular");
  const [games, setGames] = useState<TagResultGame[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    (reset: boolean) => {
      const start = reset ? 0 : games.length;
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }
      searchByTag(category.tagId, { sort, start, count: PAGE_SIZE })
        .then((res) => {
          setTotal(res.total);
          setGames((prev) => (reset ? res.games : [...prev, ...res.games]));
        })
        .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger cette catégorie."))
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category.tagId, sort]
  );

  useEffect(() => {
    setGames([]);
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.tagId, sort]);

  const gridGames = toGrid(games);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl">
            <span className="text-2xl">{category.emoji}</span> {category.label}
          </h2>
          {total > 0 && <p className="mt-1 text-xs text-slate-400">{total.toLocaleString("fr-FR")} jeux trouvés</p>}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-sky-400/60"
        >
          <option value="popular" className="bg-[#1b2838]">Les plus populaires</option>
          <option value="top_rated" className="bg-[#1b2838]">Mieux notés</option>
          <option value="newest" className="bg-[#1b2838]">Nouveautés</option>
          <option value="price_asc" className="bg-[#1b2838]">Prix croissant</option>
          <option value="price_desc" className="bg-[#1b2838]">Prix décroissant</option>
        </select>
      </div>

      <GameGrid games={gridGames} loading={loading} error={error} onOpen={onOpen} compare={compare} />

      {!loading && !error && games.length < total && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => load(false)}
            disabled={loadingMore}
            className="rounded-lg border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            {loadingMore ? "Chargement…" : "Charger plus de jeux"}
          </button>
        </div>
      )}
    </section>
  );
}
