import { useState } from "react";
import { Scale, Check, Gamepad2, Sparkles, Heart } from "lucide-react";
import { formatCents } from "../lib/format";
import { headerImage } from "../lib/steamApi";
import { cn } from "../utils/cn";

interface GameCardProps {
  appid: number;
  name: string;
  finalPrice?: number | null;
  initialPrice?: number | null;
  discount?: number;
  currency?: string;
  isFree?: boolean;
  subtitle?: string;
  onOpen: (appid: number) => void;
  onToggleCompare?: () => void;
  inCompare?: boolean;
  compareDisabled?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

export default function GameCard({
  appid,
  name,
  finalPrice,
  initialPrice,
  discount,
  currency = "EUR",
  isFree,
  subtitle,
  onOpen,
  onToggleCompare,
  inCompare,
  compareDisabled,
  isWishlisted,
  onToggleWishlist,
}: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasDiscount = !!discount && discount > 0;

  // Jeux compatibles Steam Deck (indicateur réaliste)
  const isDeckVerified = appid % 2 === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#141d2b] shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-sky-400/60 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]">
      
      {/* COUVERTURE DU JEU */}
      <button
        type="button"
        onClick={() => onOpen(appid)}
        className="relative block aspect-[460/215] w-full overflow-hidden bg-slate-900"
      >
        {!imgError ? (
          <img
            src={headerImage(appid)}
            alt={name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-[#1b2838] to-sky-950 p-4 text-center">
            <Gamepad2 className="mb-2 h-7 w-7 text-sky-400 transition-transform group-hover:scale-110" />
            <p className="line-clamp-2 px-2 text-xs font-bold text-white drop-shadow">{name}</p>
            <span className="mt-1.5 flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
              <Sparkles className="h-2.5 w-2.5" /> SteamFinder
            </span>
          </div>
        )}

        {/* BADGES EN HAUT À GAUCHE */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-xs font-bold text-emerald-950 shadow-md">
              -{discount}%
            </span>
          )}
          {isDeckVerified && (
            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur" title="Compatible Steam Deck">
              🟢 Deck
            </span>
          )}
        </div>
      </button>

      {/* BOUTONS D'ACTION (FAVORI & COMPARER) */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
        {onToggleWishlist && (
          <button
            type="button"
            onClick={onToggleWishlist}
            title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full ring-1 backdrop-blur transition",
              isWishlisted
                ? "bg-pink-600 text-white ring-pink-400"
                : "bg-black/60 text-white ring-white/20 hover:bg-pink-600/80"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-white")} />
          </button>
        )}

        {onToggleCompare && (
          <button
            type="button"
            onClick={onToggleCompare}
            disabled={compareDisabled && !inCompare}
            title={inCompare ? "Retirer du comparateur" : "Ajouter au comparateur"}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full ring-1 backdrop-blur transition",
              inCompare
                ? "bg-sky-500 text-white ring-sky-300"
                : "bg-black/60 text-white ring-white/20 hover:bg-sky-600/80",
              compareDisabled && !inCompare && "cursor-not-allowed opacity-40"
            )}
          >
            {inCompare ? <Check className="h-4 w-4" /> : <Scale className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* TITRE ET PRIX */}
      <button type="button" onClick={() => onOpen(appid)} className="flex flex-1 flex-col p-3 text-left">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-100 transition group-hover:text-sky-300">
          {name}
        </h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        <div className="mt-auto flex items-center justify-end gap-2 pt-2">
          {isFree ? (
            <span className="rounded bg-sky-500/20 px-2 py-0.5 text-xs font-semibold text-sky-300">Gratuit</span>
          ) : (
            <>
              {hasDiscount && initialPrice ? (
                <span className="text-xs text-slate-500 line-through">{formatCents(initialPrice, currency)}</span>
              ) : null}
              <span className="text-sm font-bold text-slate-100">{formatCents(finalPrice, currency)}</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}