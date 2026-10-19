import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Hero({ onSearch }: { onSearch: (term: string) => void }) {
  const [term, setTerm] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim()) onSearch(term.trim());
  }

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1b2838] via-[#0f1722] to-[#0b0f16] px-4 py-16 text-center sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:repeating-linear-gradient(45deg,transparent,transparent_40px,rgba(102,192,244,0.08)_40px,rgba(102,192,244,0.08)_80px)]" />
      <div className="relative mx-auto max-w-3xl">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">
          <Sparkles className="h-3.5 w-3.5" />
          Moteur de recherche intelligent Steam &amp; Communauté
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Trouvez votre prochain jeu <span className="text-sky-400">sans effort</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
          Recherchez parmi les meilleurs jeux Steam, filtrez par catégorie, vérifiez la compatibilité Steam Deck,
          comparez les jeux et suivez les soldes en direct.
        </p>

        <form onSubmit={submit} className="mx-auto mt-8 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              type="text"
              placeholder="Ex : Counter-Strike, Hades, Baldur's Gate…"
              className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-400"
          >
            Rechercher
          </button>
        </form>
      </div>
    </section>
  );
}
