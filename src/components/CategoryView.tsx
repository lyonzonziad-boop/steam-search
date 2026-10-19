import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Sparkles, Heart } from "lucide-react";
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

type FilterType = "all" | "discount" | "under10" | "free";

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
  const [currentId, setCurrentId] = useState(categoryId);
  const category = CATEGORIES.find((c) => c.id === currentId) ?? CATEGORIES[0];

  const [sort, setSort] = useState<SortOption>("popular");
  const [filter, setFilter] = useState<FilterType>("all");
  const [localSearch, setLocalSearch] = useState("");
  const [games, setGames] = useState<TagResultGame[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIX BUG DOUBLONS : ref pour toujours avoir le nombre réel de jeux chargés
  const gamesCountRef = useRef(0);
  gamesCountRef.current = games.length;

  const load = useCallback(
    (reset: boolean) => {
      const start = reset ? 0 : gamesCountRef.current;

      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      searchByTag(category.tagId, { sort, start, count: PAGE_SIZE })
        .then((res) => {
          setTotal(res.total);
          setGames((prev) => {
            if (reset) return res.games;

            // Déduplication stricte par ID de jeu Steam
            const existingIds = new Set(prev.map((g) => g.appid));
            const uniqueNewGames = res.games.filter((g) => !existingIds.has(g.appid));
            return [...prev, ...uniqueNewGames];
          });
        })
        .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger cette catégorie."))
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    },
    [category.tagId, sort]
  );

  // Recharger quand la catégorie ou le tri change
  useEffect(() => {
    gamesCountRef.current = 0;
    setGames([]);
    load(true);
  }, [category.tagId, sort, load]);

  // Filtres en direct
  const filteredGames = useMemo(() => {
    let result = games;

    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      result = result.filter((g) => g.name.toLowerCase().includes(q));
    }

    if (filter === "discount") {
      result = result.filter((g) => g.discount > 0);
    } else if (filter === "under10") {
      result = result.filter((g) => g.finalPrice <= 1000); // 10,00 €
    } else if (filter === "free") {
      result = result.filter((g) => g.isFree || g.finalPrice === 0);
    }

    return result;
  }, [games, filter, localSearch]);

  const gridGames = useMemo(() => toGrid(filteredGames), [filteredGames]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* RETOUR + BADGES & PAYPAL */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            <Sparkles className="h-3.5 w-3.5" /> SteamFinder by ziad
          </span>

          <a
            href="https://paypal.me/NatanBoncompain543"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 transition hover:border-amber-400/60 hover:bg-amber-500/20"
          >
            <Heart className="h-3 w-3 fill-amber-400 text-amber-400" /> Soutenir le projet
          </a>
        </div>
      </div>

      {/* BANNIÈRE CATÉGORIE ACTIVE */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-950/40 via-[#0f1722] to-slate-900/60 p-6 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-black text-white sm:text-3xl">
              <span className="text-3xl sm:text-4xl">{category.emoji}</span> {category.label}
            </h1>
            {category.description && (
              <p className="mt-1 text-sm text-slate-400">{category.description}</p>
            )}
            {total > 0 && (
              <p className="mt-2 text-xs font-medium text-sky-400">
                {total.toLocaleString("fr-FR")} jeux disponibles au total
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-white/15 bg-[#141d2b] px-3.5 py-2 text-sm font-medium text-white shadow-inner outline-none transition focus:border-sky-400"
            >
              <option value="popular">🔥 Les plus populaires</option>
              <option value="top_rated">⭐ Mieux notés</option>
              <option value="newest">🆕 Nouveautés</option>
              <option value="price_asc">🏷️ Prix croissant</option>
              <option value="price_desc">💎 Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* LISTE DÉFILANTE DES CATÉGORIES (SCROLLBAR NETTOYÉE) */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Changer de catégorie en un clic :
          </p>
          <div 
  className="flex gap-2 overflow-x-auto pb-2" 
  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCurrentId(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  currentId === c.id
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FILTRES RAPIDES */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === "all" ? "bg-white text-slate-900 shadow" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            Tous ({games.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("discount")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === "discount" ? "bg-emerald-500 text-white shadow" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            🔥 En promo
          </button>
          <button
            type="button"
            onClick={() => setFilter("under10")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === "under10" ? "bg-sky-500 text-white shadow" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            🪙 Moins de 10 €
          </button>
          <button
            type="button"
            onClick={() => setFilter("free")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === "free" ? "bg-purple-500 text-white shadow" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            🎁 100% Gratuits
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filtrer ces jeux..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* GRILLE DE JEUX */}
      <GameGrid games={gridGames} loading={loading} error={error} onOpen={onOpen} compare={compare} />

      {/* CHARGER PLUS DE JEUX (DIFFÉRENTS CETTE FOIS !) */}
      {!loading && !error && games.length < total && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => load(false)}
            disabled={loadingMore}
            className="rounded-xl border border-sky-400/30 bg-sky-500/10 px-6 py-2.5 text-sm font-semibold text-sky-300 shadow-lg shadow-sky-950/50 transition hover:bg-sky-500 hover:text-white disabled:opacity-50"
          >
            {loadingMore ? "Chargement des jeux suivants…" : `Charger plus de jeux (${games.length} affichés / ${total})`}
          </button>
        </div>
      )}
    </section>
  );
}