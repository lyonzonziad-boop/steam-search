import { useState, useEffect } from "react";
import { X, Dices, ArrowRight, RotateCw, Trophy, Flame } from "lucide-react";
import { headerImage } from "../lib/steamApi";

interface RouletteGame {
  appid: number;
  name: string;
  category: "all" | "action" | "survival" | "indie" | "free";
  price: string;
  tag: string;
}

const GAMES_POOL: RouletteGame[] = [
  { appid: 1245620, name: "Elden Ring", category: "action", price: "59,99 €", tag: "Chef-d'œuvre GOTY" },
  { appid: 1091500, name: "Cyberpunk 2077", category: "action", price: "59,99 €", tag: "Monde Ouvert Futuriste" },
  { appid: 1086940, name: "Baldur's Gate 3", category: "action", price: "59,99 €", tag: "RPG Légendaire" },
  { appid: 292030, name: "The Witcher 3: Wild Hunt", category: "action", price: "29,99 €", tag: "Aventure Culte" },
  { appid: 2358720, name: "Black Myth: Wukong", category: "action", price: "59,99 €", tag: "Action Mythologique" },
  { appid: 553850, name: "HELLDIVERS™ 2", category: "action", price: "39,99 €", tag: "Co-op & Démocratie" },
  { appid: 271590, name: "Grand Theft Auto V", category: "action", price: "29,99 €", tag: "Incontournable" },
  { appid: 1174180, name: "Red Dead Redemption 2", category: "action", price: "59,99 €", tag: "Western Épique" },
  { appid: 1966720, name: "Lethal Company", category: "survival", price: "9,75 €", tag: "Horreur & Fous Rires" },
  { appid: 264710, name: "Subnautica", category: "survival", price: "29,99 €", tag: "Exploration Océanique" },
  { appid: 739630, name: "Phasmophobia", category: "survival", price: "19,50 €", tag: "Chasse aux Fantômes" },
  { appid: 252490, name: "Rust", category: "survival", price: "39,99 €", tag: "Survie PVP Hardcore" },
  { appid: 1623730, name: "Palworld", category: "survival", price: "28,99 €", tag: "Créatures & Survie" },
  { appid: 1145360, name: "Hades", category: "indie", price: "24,50 €", tag: "Rogue-like Mythique" },
  { appid: 367520, name: "Hollow Knight", category: "indie", price: "14,79 €", tag: "Metroidvania Culte" },
  { appid: 2379780, name: "Balatro", category: "indie", price: "13,99 €", tag: "Poker Rogue-like Addictif" },
  { appid: 413150, name: "Stardew Valley", category: "indie", price: "13,99 €", tag: "Ferme & Détente" },
  { appid: 730, name: "Counter-Strike 2", category: "free", price: "Gratuit", tag: "FPS Compétitif" },
  { appid: 570, name: "Dota 2", category: "free", price: "Gratuit", tag: "MOBA Stratégique" },
  { appid: 1172470, name: "Apex Legends", category: "free", price: "Gratuit", tag: "Battle Royale Dynamique" },
];

export default function RandomGameModal({
  isOpen,
  onClose,
  onSelectGame,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (appid: number) => void;
}) {
  const [filter, setFilter] = useState<"all" | "action" | "survival" | "indie" | "free">("all");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState<RouletteGame | null>(null);
  const [displayGame, setDisplayGame] = useState<RouletteGame>(GAMES_POOL[0]);

  const currentPool = GAMES_POOL.filter((g) => (filter === "all" ? true : g.category === filter));

  useEffect(() => {
    if (isOpen) {
      setSelectedGame(null);
      setDisplayGame(currentPool[Math.floor(Math.random() * currentPool.length)]);
    }
  }, [isOpen, filter]);

  function spinRoulette() {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedGame(null);

    let counter = 0;
    const totalSpins = 25 + Math.floor(Math.random() * 8);
    let speed = 60;

    function step() {
      counter++;
      const randomItem = currentPool[Math.floor(Math.random() * currentPool.length)];
      setDisplayGame(randomItem);

      if (counter < totalSpins) {
        if (counter > totalSpins - 10) speed += 35;
        else if (counter > totalSpins - 5) speed += 70;
        setTimeout(step, speed);
      } else {
        setSelectedGame(randomItem);
        setIsSpinning(false);
      }
    }

    step();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={!isSpinning ? onClose : undefined} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0f1722] p-6 shadow-2xl shadow-purple-950/60">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
              <Dices className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white sm:text-xl">La Roulette du Joueur</h2>
              <p className="text-xs text-purple-300">SteamFinder by ziad • Le sort décide de ton jeu !</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSpinning}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "🎲 Tout" },
            { id: "action", label: "⚔️ Action" },
            { id: "survival", label: "🧟 Survie" },
            { id: "indie", label: "💎 Indés" },
            { id: "free", label: "🎁 Gratuits" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              disabled={isSpinning}
              onClick={() => setFilter(cat.id as typeof filter)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                filter === cat.id ? "bg-purple-600 text-white shadow" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative mt-6 overflow-hidden rounded-xl border-2 border-purple-500/40 bg-slate-900/90 shadow-inner">
          <div className="relative aspect-[460/215] w-full overflow-hidden">
            <img
              src={headerImage(displayGame.appid)}
              alt={displayGame.name}
              className={`h-full w-full object-cover transition duration-150 ${
                isSpinning ? "scale-105 blur-[1px]" : "scale-100 blur-0"
              }`}
            />
            {selectedGame && (
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/90 px-3 py-1 text-xs font-bold text-amber-950 shadow-lg">
                <Trophy className="h-3.5 w-3.5" /> Le sort a choisi !
              </div>
            )}
            <div className="absolute bottom-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-white backdrop-blur">
              {displayGame.price}
            </div>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-base font-extrabold text-white sm:text-lg">{displayGame.name}</h3>
            <span className="mt-1 inline-block text-xs font-medium text-purple-400">{displayGame.tag}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={spinRoulette}
            disabled={isSpinning}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/50 transition hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
          >
            {isSpinning ? (
              <><RotateCw className="h-4 w-4 animate-spin" /> Tirage en cours…</>
            ) : selectedGame ? (
              <><Dices className="h-4 w-4" /> Relancer la roulette</>
            ) : (
              <><Flame className="h-4 w-4" /> Lancer la roulette !</>
            )}
          </button>
          {selectedGame && (
            <button
              type="button"
              onClick={() => onSelectGame(selectedGame.appid)}
              className="flex items-center justify-center gap-2 rounded-xl border border-sky-400/50 bg-sky-500/20 px-5 py-3 text-sm font-bold text-sky-300 transition hover:bg-sky-500 hover:text-white"
            >
              Voir la fiche <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}