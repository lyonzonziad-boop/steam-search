import { useEffect, useState } from "react";
import { Loader2, Scale, Trash2, X } from "lucide-react";
import { getAppDetails, getDeckCompatibility, getReviewSummary, headerImage } from "../lib/steamApi";
import type { AppDetails, DeckCompat, ReviewSummary } from "../lib/types";
import DeckBadge from "./DeckBadge";
import type { useCompare } from "../hooks/useCompare";

interface Entry {
  details: AppDetails | null;
  deck: DeckCompat | null;
  review: ReviewSummary | null;
  loading: boolean;
}

export default function CompareView({
  compare,
  onOpen,
}: {
  compare: ReturnType<typeof useCompare>;
  onOpen: (appid: number) => void;
}) {
  const [entries, setEntries] = useState<Record<number, Entry>>({});

  useEffect(() => {
    compare.list.forEach((stub) => {
      if (entries[stub.appid]) return;
      setEntries((prev) => ({ ...prev, [stub.appid]: { details: null, deck: null, review: null, loading: true } }));
      Promise.all([getAppDetails(stub.appid), getDeckCompatibility(stub.appid), getReviewSummary(stub.appid)]).then(
        ([details, deck, review]) => {
          setEntries((prev) => ({ ...prev, [stub.appid]: { details, deck, review, loading: false } }));
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compare.list]);

  if (compare.list.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Scale className="mx-auto mb-4 h-10 w-10 text-slate-600" />
        <h2 className="text-xl font-bold text-white">Votre comparateur est vide</h2>
        <p className="mt-2 text-sm text-slate-400">
          Ajoutez jusqu'à {compare.max} jeux depuis la recherche, les catégories ou une fiche jeu pour les comparer
          côte à côte (prix, notes, plateformes, compatibilité Steam Deck…).
        </p>
      </section>
    );
  }

  const rows: { label: string; render: (e: Entry | undefined) => React.ReactNode }[] = [
    {
      label: "Prix",
      render: (e) =>
        e?.details?.is_free
          ? "Gratuit"
          : e?.details?.price_overview?.final_formatted ?? (e?.loading ? "…" : "—"),
    },
    {
      label: "Réduction",
      render: (e) =>
        e?.details?.price_overview?.discount_percent ? `-${e.details.price_overview.discount_percent}%` : "—",
    },
    {
      label: "Note des joueurs",
      render: (e) => (e?.review && e.review.total_reviews > 0 ? e.review.review_score_desc : "—"),
    },
    {
      label: "Metacritic",
      render: (e) => (e?.details?.metacritic ? e.details.metacritic.score : "—"),
    },
    {
      label: "Steam Deck",
      render: (e) => <DeckBadge deck={e?.deck} />,
    },
    {
      label: "Plateformes",
      render: (e) =>
        [e?.details?.platforms?.windows && "Windows", e?.details?.platforms?.mac && "Mac", e?.details?.platforms?.linux && "Linux"]
          .filter(Boolean)
          .join(", ") || "—",
    },
    {
      label: "Genres",
      render: (e) => e?.details?.genres?.map((g) => g.description).join(", ") || "—",
    },
    {
      label: "Date de sortie",
      render: (e) => e?.details?.release_date?.date || "—",
    },
    {
      label: "Développeur",
      render: (e) => e?.details?.developers?.join(", ") || "—",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Comparateur de jeux</h2>
        <button
          type="button"
          onClick={compare.clear}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
        >
          <Trash2 className="h-4 w-4" /> Tout retirer
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-white/5">
              <th className="w-40 p-3 text-left text-slate-400">Jeu</th>
              {compare.list.map((stub) => (
                <th key={stub.appid} className="p-3 align-top">
                  <div className="relative">
                    <button
                      onClick={() => compare.remove(stub.appid)}
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-rose-500"
                      title="Retirer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => onOpen(stub.appid)} className="block w-full text-left">
                      <img
                        src={headerImage(stub.appid)}
                        alt={stub.name}
                        className="mb-2 aspect-[460/215] w-full rounded object-cover"
                      />
                      <span className="line-clamp-2 text-xs font-semibold text-white">{stub.name}</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-white/10 odd:bg-white/[0.02]">
                <td className="p-3 font-medium text-slate-400">{row.label}</td>
                {compare.list.map((stub) => {
                  const entry = entries[stub.appid];
                  return (
                    <td key={stub.appid} className="p-3 text-slate-200">
                      {entry?.loading && !entry.details ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                      ) : (
                        row.render(entry)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
