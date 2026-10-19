import { useMemo } from "react";
import { ArrowRight, Flame, TrendingUp, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Hero from "./Hero";
import CategoryGrid from "./CategoryGrid";
import GamerToolsBar from "./GamerToolsBar";
import GameGrid, { type GridGame } from "./GameGrid";
import { useAsync } from "../hooks/useAsync";
import { getSpecials, getTopSellers, type FeaturedItem } from "../lib/steamApi";
import { CATEGORIES } from "../lib/categories";
import type { useCompare } from "../hooks/useCompare";

function toGrid(items: FeaturedItem[]): GridGame[] {
  return items.slice(0, 5).map((item) => {
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

export default function HomeView({
  onOpen,
  onSelectCategory,
  onSearch,
  onNavigateSales,
  onOpenRoulette,
  compare,
}: {
  onOpen: (appid: number) => void;
  onSelectCategory: (id: string) => void;
  onSearch: (term: string) => void;
  onNavigateSales: () => void;
  onOpenRoulette?: () => void;
  compare: ReturnType<typeof useCompare>;
}) {
  const { data: specials, loading: loadingSpecials } = useAsync(() => getSpecials(), [], []);
  const { data: topSellers, loading: loadingTop } = useAsync(() => getTopSellers(), [], []);

  const specialGames = useMemo(() => toGrid(specials), [specials]);
  const topGames = useMemo(() => toGrid(topSellers), [topSellers]);

  return (
    <div>
      <Hero onSearch={onSearch} />

      {/* BARRE D'OUTILS GAMERS EN UN CLIC */}
      {onOpenRoulette && (
        <GamerToolsBar
          onSelectCategory={onSelectCategory}
          onNavigateSales={onNavigateSales}
          onOpenRoulette={onOpenRoulette}
        />
      )}

      {/* DÉFILEMENT RAPIDE DES CATÉGORIES TENDANCES */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Genres populaires :
          </span>
          {CATEGORIES.slice(0, 12).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GRILLE COMPLÈTE DES CATÉGORIES */}
      <CategoryGrid onSelect={onSelectCategory} />

      {/* BANDEAU DES ATOUTS DU SITE */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Données Steam en Direct</p>
              <p className="text-xs text-slate-400">Prix officiels et réductions synchronisées</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Simulateur Config PC</p>
              <p className="text-xs text-slate-400">Vérifiez si vos jeux tournent sans ramer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">SteamFinder by ziad</p>
              <p className="text-xs text-slate-400">Votre compagnon gaming ultime</p>
            </div>
          </div>
        </div>
      </div>

      {/* SOLDES EN CE MOMENT */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white sm:text-xl">Soldes en ce moment</h2>
          </div>
          <button
            type="button"
            onClick={onNavigateSales}
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 transition hover:text-sky-300"
          >
            Voir toutes les offres <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <GameGrid games={specialGames} loading={loadingSpecials} onOpen={onOpen} compare={compare} />
      </section>

      {/* MEILLEURES VENTES */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white sm:text-xl">Meilleures ventes mondiales</h2>
          </div>
          <button
            type="button"
            onClick={onNavigateSales}
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 transition hover:text-sky-300"
          >
            Tout voir <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <GameGrid games={topGames} loading={loadingTop} onOpen={onOpen} compare={compare} />
      </section>
    </div>
  );
}