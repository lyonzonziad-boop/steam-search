export interface Category {
  id: string;
  label: string;
  tagId: number; // Official Steam store tag id, used with /search/results/?tags=
  emoji: string;
  gradient: string;
}

export const CATEGORIES: Category[] = [
  { id: "action", label: "Action", tagId: 19, emoji: "⚔️", gradient: "from-rose-500/30 to-rose-900/10" },
  { id: "adventure", label: "Aventure", tagId: 21, emoji: "🗺️", gradient: "from-amber-500/30 to-amber-900/10" },
  { id: "rpg", label: "RPG", tagId: 122, emoji: "🐉", gradient: "from-violet-500/30 to-violet-900/10" },
  { id: "strategy", label: "Stratégie", tagId: 9, emoji: "♟️", gradient: "from-blue-500/30 to-blue-900/10" },
  { id: "simulation", label: "Simulation", tagId: 599, emoji: "🏗️", gradient: "from-teal-500/30 to-teal-900/10" },
  { id: "indie", label: "Indépendant", tagId: 492, emoji: "🎨", gradient: "from-pink-500/30 to-pink-900/10" },
  { id: "racing", label: "Course", tagId: 699, emoji: "🏎️", gradient: "from-orange-500/30 to-orange-900/10" },
  { id: "sports", label: "Sport", tagId: 701, emoji: "🏅", gradient: "from-lime-500/30 to-lime-900/10" },
  { id: "mmo", label: "Multijoueur massif", tagId: 128, emoji: "🌐", gradient: "from-cyan-500/30 to-cyan-900/10" },
  { id: "f2p", label: "Free to Play", tagId: 113, emoji: "🆓", gradient: "from-emerald-500/30 to-emerald-900/10" },
];
