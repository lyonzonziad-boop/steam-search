import { useState } from "react";
import { Gamepad2, Scale, Search, Tag, Home } from "lucide-react";
import { cn } from "../utils/cn";

export type ViewName = "home" | "category" | "search" | "sales" | "compare";

interface HeaderProps {
  active: ViewName;
  compareCount: number;
  onNavigate: (view: ViewName) => void;
  onSearch: (term: string) => void;
  initialTerm?: string;
}

export default function Header({ active, compareCount, onNavigate, onSearch, initialTerm }: HeaderProps) {
  const [term, setTerm] = useState(initialTerm ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim()) onSearch(term.trim());
  }

  const navItems: { id: ViewName; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Accueil", icon: <Home className="h-4 w-4" /> },
    { id: "sales", label: "Soldes en direct", icon: <Tag className="h-4 w-4" /> },
    { id: "compare", label: "Comparateur", icon: <Scale className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f1722]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f1722]/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-6">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-900/50">
            <Gamepad2 className="h-5 w-5 text-white" />
          </span>
          <span>
            Steam<span className="text-sky-400">Finder</span>
          </span>
        </button>

        <form onSubmit={submit} className="order-last w-full sm:order-none sm:flex-1 sm:max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              type="text"
              placeholder="Rechercher un jeu…"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/60"
            />
          </div>
        </form>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                active === item.id ? "bg-sky-500/15 text-sky-300" : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
              {item.id === "compare" && compareCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                  {compareCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
