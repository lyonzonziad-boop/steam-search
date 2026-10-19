import { useMemo } from "react";
import { useAsync } from "../hooks/useAsync";
import { searchGames } from "../lib/steamApi";
import GameGrid, { type GridGame } from "./GameGrid";
import type { useCompare } from "../hooks/useCompare";

export default function SearchView({
  term,
  onOpen,
  compare,
}: {
  term: string;
  onOpen: (appid: number) => void;
  compare: ReturnType<typeof useCompare>;
}) {
  const { data, loading, error } = useAsync(() => searchGames(term), [term], []);

  const games: GridGame[] = useMemo(
    () =>
      data.map((item) => ({
        appid: item.id,
        name: item.name,
        finalPrice: item.price?.final,
        initialPrice: item.price?.initial,
        discount: item.price?.discount_percent,
        currency: item.price?.currency ?? "EUR",
        isFree: !item.price,
      })),
    [data]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
        Résultats pour « <span className="text-sky-400">{term}</span> »
      </h2>
      <GameGrid
        games={games}
        loading={loading}
        error={error}
        onOpen={onOpen}
        compare={compare}
        emptyMessage="Aucun jeu ne correspond à cette recherche."
      />
    </section>
  );
}
