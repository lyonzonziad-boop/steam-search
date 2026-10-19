import { useState } from "react";
import { Gamepad2, Scale, Search, Tag, Home, X, Heart, Dices, User, LogOut } from "lucide-react";
import { cn } from "../utils/cn";
import type { UserProfile } from "../hooks/useAuth";

export type ViewName = "home" | "category" | "search" | "sales" | "compare" | "wishlist";

interface HeaderProps {
  active: ViewName;
  compareCount: number;
  wishlistCount: number;
  onNavigate: (view: ViewName) => void;
  onSearch: (term: string) => void;
  onOpenRoulette?: () => void;
  onOpenAuth?: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  initialTerm?: string;
}

export default function Header({ 
  active, 
  compareCount, 
  wishlistCount,
  onNavigate, 
  onSearch, 
  onOpenRoulette,
  onOpenAuth,
  currentUser,
  onLogout,
  initialTerm 
}: HeaderProps) {
  const [term, setTerm] = useState(initialTerm ?? "");
  const [userDropdown, setUserDropdown] = useState(false);

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

          {/* ESPACE COMPTE UTILISATEUR */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1.5 pr-2.5 transition hover:bg-white/10"
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md font-bold text-white shadow"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate text-xs font-semibold text-slate-200">
                  {currentUser.username}
                </span>
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#141d2b] p-2 shadow-2xl z-50">
                  <div className="border-b border-white/10 p-2 text-left">
                    <p className="text-xs font-bold text-white truncate">{currentUser.username}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onNavigate("wishlist"); setUserDropdown(false); }}
                    className="flex w-full items-center gap-2 rounded-lg p-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    <Heart className="h-3.5 w-3.5 text-pink-400" /> Ma Wishlist
                  </button>
                  <button
                    type="button"
                    onClick={() => { onLogout(); setUserDropdown(false); }}
                    className="flex w-full items-center gap-2 rounded-lg p-2 text-xs text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-2 text-xs font-bold text-sky-400 transition hover:bg-sky-500 hover:text-white"
            >
              <User className="h-3.5 w-3.5" />
              <span>Connexion</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}