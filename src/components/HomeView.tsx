import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import Hero from "./Hero";
import CategoryGrid from "./CategoryGrid";
import GameGrid, { type GridGame } from "./GameGrid";
import { useAsync } from "../hooks/useAsync";
import { getSpecials, getTopSellers, type FeaturedItem } from "../lib/steamApi";
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
  compare,
}: {
  onOpen: (appid: number) => void;
  onSelectCategory: (id: string) => void;
  onSearch: (term: string) => void;
  onNavigateSales: () => void;
  compare: ReturnType<typeof useCompare>;
}) {
  const { data: specials, loading: loadingSpecials } = useAsync(() => getSpecials(), [], []);
  const { data: topSellers, loading: loadingTop } = useAsync(() => getTopSellers(), [], []);

  const specialGames = useMemo(() => toGrid(specials), [specials]);
  const topGames = useMemo(() => toGrid(topSellers), [topSellers]);

  return (
    <div>
      <Hero onSearch={onSearch} />
      <CategoryGrid onSelect={onSelectCategory} />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white sm:text-xl">🔥 Soldes en ce moment</h2>
          <button
            type="button"
            onClick={onNavigateSales}
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            Voir toutes les offres <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <GameGrid games={specialGames} loading={loadingSpecials} onOpen={onOpen} compare={compare} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white sm:text-xl">📈 Meilleures ventes</h2>
          <button
            type="button"
            onClick={onNavigateSales}
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            Tout voir <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <GameGrid games={topGames} loading={loadingTop} onOpen={onOpen} compare={compare} />
      </section>
    </div>
  );
}
