import { CheckCircle2, CircleHelp, TriangleAlert, XCircle } from "lucide-react";
import { cn } from "../utils/cn";
import type { DeckCompat } from "../lib/types";

export default function DeckBadge({ deck, compact }: { deck: DeckCompat | null | undefined; compact?: boolean }) {
  if (!deck) return null;

  const config: Record<number, { icon: React.ReactNode; classes: string; label: string }> = {
    3: {
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      classes: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
      label: "Vérifié",
    },
    2: {
      icon: <TriangleAlert className="h-3.5 w-3.5" />,
      classes: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
      label: "Jouable",
    },
    1: {
      icon: <XCircle className="h-3.5 w-3.5" />,
      classes: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
      label: "Non pris en charge",
    },
    0: {
      icon: <CircleHelp className="h-3.5 w-3.5" />,
      classes: "bg-slate-500/15 text-slate-400 ring-slate-500/30",
      label: "Inconnu",
    },
  };

  const c = config[deck.category] ?? {
    icon: <CircleHelp className="h-3.5 w-3.5" />,
    classes: "bg-slate-500/15 text-slate-400 ring-slate-500/30",
    label: "Indisponible",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
        c.classes
      )}
      title={`Compatibilité Steam Deck : ${c.label}`}
    >
      {c.icon}
      {!compact && <span>Deck {c.label}</span>}
    </span>
  );
}
