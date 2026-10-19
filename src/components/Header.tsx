import { useState } from "react";
import { Gamepad2, Scale, Search, Tag, Home, X, Heart, Dices } from "lucide-react";
import { cn } from "../utils/cn";

export type ViewName = "home" | "category" | "search" | "sales" | "compare" | "wishlist";

interface HeaderProps {
  active: ViewName;
  compareCount: number;
  wishlistCount: number;
  onNavigate: (view: ViewName) => void;
  onSearch: (term: string) => void;
  onOpenRoulette?: () => void;
  initialTerm?: string;
}

export default function Header({ 
  active, 
  compareCount, 
  wishlistCount,
  onNavigate, 
  onSearch, 
  onOpenRoulette,
  initialTerm 
}: HeaderProps) {
  const [term, setTerm] = useState(initialTerm ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim()) onSearch(term.trim());
  }

  const navItems: { id: ViewName; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "home", label: "Accueil", icon: <Home className="h-4 w-4" /> },
    { id: "sales", label: "Soldes en direct", icon: <Tag className="h-4 w-4" /> },
    { id: "wishlist", label: "Favoris", icon: <Heart className="h-4 w-4" />, badge: wishlistCount },
    { id: "compare", label: "Comparateur", icon: <Scale className="h-4 w-4" />, badge: compareCount },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f1722]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f1722]/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-6">
        
        {/* TITRE + BY ZIAD */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition hover:opacity-95"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-900/50 transition-transform group-hover:scale-105">
            <Gamepad2 className="h-5 w-5 text-white" />
          </span>
          <div className="flex items-center gap-2">
            <span>
              Steam<span className="text-sky-400">Finder</span>
            </span>
            <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-400 shadow-sm transition group-hover:border-sky-400/60 group-hover:bg-sky-500/20">
              by ziad
            </span>
          </div>
        </button>

        {/* BARRE DE RECHERCHE */}
        <form onSubmit={submit} className="order-last w-full sm:order-none sm:flex-1 sm:max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              type="text"
              placeholder="Rechercher un jeu (Cyberpunk, GTA, Elden Ring...)"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-9 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400/60 focus:bg-white/[0.08] focus:ring-1 focus:ring-sky-400/60"
            />
            {term && (
              <button
                type="button"
                onClick={() => setTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* ACTIONS & NAVIGATION */}
        <div className="flex items-center gap-2">
          
          {/* BOUTON ROULETTE */}
          {onOpenRoulette && (
            <button
              type="button"
              onClick={onOpenRoulette}
              className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-3 py-2 text-xs font-bold text-purple-300 shadow-sm transition hover:border-purple-400 hover:bg-purple-600/30 hover:text-white"
              title="Je ne sais pas à quoi jouer !"
            >
              <Dices className="h-3.5 w-3.5 text-pink-400" />
              <span className="hidden sm:inline">Roulette</span>
            </button>
          )}

          {/* LIENS DE NAVIGATION */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active === item.id 
                    ? "bg-sky-500/15 text-sky-300" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white shadow">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* BOUTON PAYPAL */}
          <a
            href="https://paypal.me/NatanBoncompain543"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-gradient-to-r from-amber-500/15 to-yellow-500/10 px-3 py-2 text-xs font-bold text-amber-300 shadow-sm transition hover:border-amber-400/80 hover:bg-amber-500/25 hover:text-amber-200"
            title="Soutenir via PayPal"
          >
            <Heart className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">PayPal</span>
          </a>
        </div>

      </div>
    </header>
  );
}