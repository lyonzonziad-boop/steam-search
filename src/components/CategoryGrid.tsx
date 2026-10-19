import { CATEGORIES } from "../lib/categories";
import { cn } from "../utils/cn";

export default function CategoryGrid({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white sm:text-xl">Catégories populaires</h2>
        <span className="text-xs text-slate-400">{CATEGORIES.length} catégories</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "group flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-br p-5 text-center transition hover:-translate-y-0.5 hover:border-sky-400/40",
              cat.gradient
            )}
          >
            <span className="text-3xl transition group-hover:scale-110">{cat.emoji}</span>
            <span className="text-sm font-semibold text-slate-100">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
