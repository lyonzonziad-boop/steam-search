import { ArrowLeft, Heart, Trash2, Sparkles, ExternalLink } from "lucide-react";
import GameCard from "./GameCard";
import type { GridGame } from "./GameGrid";
import { formatCents } from "../lib/format";
import type { useCompare } from "../hooks/useCompare";

export default function WishlistView({
  wishlist,
  onToggleWishlist,
  onClearWishlist,
  onOpen,
  compare,
  onBack,
}: {
  wishlist: GridGame[];
  onToggleWishlist: (g: GridGame) => void;
  onClearWishlist: () => void;
  onOpen: (appid: number) => void;
  compare: ReturnType<typeof useCompare>;
  onBack: () => void;
}) {
  const totalPrice = wishlist.reduce((acc, g) => acc + (g.finalPrice || 0), 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* RETOUR & INFOS */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </button>

        {wishlist.length > 0 && (
          <button
            type="button"
            onClick={onClearWishlist}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" /> Vider la liste
          </button>
        )}
      </div>

      {/* EN-TÊTE WISHLIST */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-r from-pink-950/40 via-[#0f1722] to-slate-900/60 p-6 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-black text-white sm:text-3xl">
              <Heart className="h-7 w-7 fill-pink-500 text-pink-500" /> Ma Liste de Souhaits
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {wishlist.length === 0
                ? "Aucun jeu sauvegardé pour le moment."
                : `${wishlist.length} jeu${wishlist.length > 1 ? "x" : ""} gardé${wishlist.length > 1 ? "s" : ""} de côté`}
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-right">
              <p className="text-xs text-slate-400">Valeur totale estimée</p>
              <p className="text-lg font-bold text-emerald-400">{formatCents(totalPrice, "EUR")}</p>
            </div>
          )}
        </div>
      </div>

      {/* CONTENU */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <Heart className="mb-3 h-12 w-12 text-slate-600" />
          <h3 className="text-lg font-bold text-white">Votre liste est vide</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            Cliquez sur le petit cœur présent sur les jeux pour les sauvegarder ici et suivre leurs prix !
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
          >
            Explorer le catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {wishlist.map((g) => (
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
              isWishlisted={true}
              onToggleWishlist={() => onToggleWishlist(g)}
              onToggleCompare={compare ? () => compare.toggle({ appid: g.appid, name: g.name, headerImage: "" }) : undefined}
              inCompare={compare?.has(g.appid)}
              compareDisabled={compare?.isFull}
            />
          ))}
        </div>
      )}
    </section>
  );
}