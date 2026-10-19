import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Monitor, Scale, Check, X, ThumbsUp } from "lucide-react";
import { getAppDetails, getDeckCompatibility, getReviewSummary, headerImage } from "../lib/steamApi";
import type { AppDetails, DeckCompat, ReviewSummary } from "../lib/types";
import DeckBadge from "./DeckBadge";
import { cn } from "../utils/cn";
import type { useCompare } from "../hooks/useCompare";

export default function GameModal({
  appid,
  onClose,
  compare,
}: {
  appid: number;
  onClose: () => void;
  compare: ReturnType<typeof useCompare>;
}) {
  const [details, setDetails] = useState<AppDetails | null>(null);
  const [deck, setDeck] = useState<DeckCompat | null>(null);
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeShot, setActiveShot] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setDetails(null);
    setDeck(null);
    setReview(null);
    setActiveShot(0);

    getAppDetails(appid)
      .then((d) => {
        if (cancelled) return;
        setDetails(d);
        if (!d) setError("Impossible de récupérer les informations de ce jeu.");
      })
      .catch(() => !cancelled && setError("Impossible de récupérer les informations de ce jeu."))
      .finally(() => !cancelled && setLoading(false));

    getDeckCompatibility(appid).then((d) => !cancelled && setDeck(d));
    getReviewSummary(appid).then((r) => !cancelled && setReview(r));

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [appid, onClose]);

  const inCompare = compare.has(appid);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#171d25] shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </button>

        {loading && (
          <div className="flex h-80 flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Chargement des informations…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-60 flex-col items-center justify-center gap-2 p-6 text-center text-rose-300">
            <p>{error}</p>
            <a
              href={`https://store.steampowered.com/app/${appid}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-sky-400 underline"
            >
              Voir sur Steam
            </a>
          </div>
        )}

        {!loading && details && (
          <div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-black">
              <img
                src={
                  details.screenshots && details.screenshots.length > 0
                    ? details.screenshots[activeShot]?.path_full
                    : headerImage(appid)
                }
                alt={details.name}
                className="h-full w-full object-cover"
              />
            </div>

            {details.screenshots && details.screenshots.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-4 py-3">
                {details.screenshots.slice(0, 8).map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveShot(i)}
                    className={cn(
                      "h-12 w-20 flex-shrink-0 overflow-hidden rounded border-2",
                      activeShot === i ? "border-sky-400" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={s.path_thumbnail} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">{details.name}</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {details.developers?.join(", ")} {details.release_date?.date ? `· ${details.release_date.date}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <DeckBadge deck={deck} />
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-300">{details.short_description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1">
                  <Monitor className="h-3.5 w-3.5" />
                  {[
                    details.platforms?.windows && "Windows",
                    details.platforms?.mac && "Mac",
                    details.platforms?.linux && "Linux",
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Non précisé"}
                </span>
                {details.metacritic && (
                  <span className="rounded bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-400">
                    Metacritic {details.metacritic.score}
                  </span>
                )}
                {review && review.total_reviews > 0 && (
                  <span className="inline-flex items-center gap-1 rounded bg-sky-500/15 px-2 py-1 text-sky-300">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {review.review_score_desc} ({review.total_reviews.toLocaleString("fr-FR")} avis)
                  </span>
                )}
                {details.genres?.slice(0, 3).map((g) => (
                  <span key={g.id} className="rounded bg-white/5 px-2 py-1">
                    {g.description}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                <div>
                  {details.is_free ? (
                    <span className="text-lg font-bold text-sky-400">Gratuit</span>
                  ) : details.price_overview ? (
                    <div className="flex items-center gap-2">
                      {details.price_overview.discount_percent > 0 && (
                        <>
                          <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-xs font-bold text-emerald-950">
                            -{details.price_overview.discount_percent}%
                          </span>
                          <span className="text-sm text-slate-500 line-through">
                            {details.price_overview.initial_formatted}
                          </span>
                        </>
                      )}
                      <span className="text-lg font-bold text-white">{details.price_overview.final_formatted}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Prix non disponible</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      compare.toggle({ appid: details.steam_appid, name: details.name, headerImage: headerImage(appid) })
                    }
                    disabled={compare.isFull && !inCompare}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition",
                      inCompare
                        ? "border-sky-400/60 bg-sky-500/20 text-sky-300"
                        : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10",
                      compare.isFull && !inCompare && "cursor-not-allowed opacity-40"
                    )}
                  >
                    {inCompare ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
                    {inCompare ? "Dans le comparateur" : "Comparer"}
                  </button>
                  <a
                    href={`https://store.steampowered.com/app/${appid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-400"
                  >
                    Voir sur Steam <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
