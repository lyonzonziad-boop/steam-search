import { Scale, Check } from "lucide-react";
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
}: GameCardProps) {
  const hasDiscount = !!discount && discount > 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1b2838] shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-sky-400/40 hover:shadow-sky-900/40">
      <button
        type="button"
        onClick={() => onOpen(appid)}
        className="relative block aspect-[460/215] w-full overflow-hidden bg-slate-900"
      >
        <img
          src={headerImage(appid)}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded bg-emerald-500 px-1.5 py-0.5 text-xs font-bold text-emerald-950">
            -{discount}%
          </span>
        )}
      </button>

      {onToggleCompare && (
        <button
          type="button"
          onClick={onToggleCompare}
          disabled={compareDisabled && !inCompare}
          title={inCompare ? "Retirer du comparateur" : "Ajouter au comparateur"}
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full ring-1 backdrop-blur transition",
            inCompare
              ? "bg-sky-500 text-white ring-sky-300"
              : "bg-black/50 text-white ring-white/20 hover:bg-sky-600/80",
            compareDisabled && !inCompare && "cursor-not-allowed opacity-40"
          )}
        >
          {inCompare ? <Check className="h-4 w-4" /> : <Scale className="h-3.5 w-3.5" />}
        </button>
      )}

      <button type="button" onClick={() => onOpen(appid)} className="flex flex-1 flex-col p-3 text-left">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-100">{name}</h3>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        <div className="mt-auto flex items-center justify-end gap-2 pt-2">
          {isFree ? (
            <span className="rounded bg-sky-500/20 px-2 py-1 text-xs font-semibold text-sky-300">Gratuit</span>
          ) : (
            <>
              {hasDiscount && initialPrice ? (
                <span className="text-xs text-slate-500 line-through">{formatCents(initialPrice, currency)}</span>
              ) : null}
              <span className="text-sm font-semibold text-slate-100">{formatCents(finalPrice, currency)}</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
