import { useState, useEffect, useRef } from "react";
import { X, Dices, ArrowRight, RotateCw, Trophy, Flame, Sparkles } from "lucide-react";
import { headerImage, searchByTag } from "../lib/steamApi";
import { CATEGORIES } from "../lib/categories";

interface RouletteGame {
  appid: number;
  name: string;
  category: string;
  price: string;
  tag: string;
}

// Pool de base étendu (+70 jeux cultes immédiats)
const BASE_GAMES: RouletteGame[] = [
  // ACTION & RPG
  { appid: 1245620, name: "Elden Ring", category: "action", price: "59,99 €", tag: "GOTY Masterpiece" },
  { appid: 1091500, name: "Cyberpunk 2077", category: "action", price: "59,99 €", tag: "Monde Ouvert Futuriste" },
  { appid: 1086940, name: "Baldur's Gate 3", category: "action", price: "59,99 €", tag: "RPG Légendaire" },
  { appid: 292030, name: "The Witcher 3: Wild Hunt", category: "action", price: "29,99 €", tag: "Aventure Culte" },
  { appid: 2358720, name: "Black Myth: Wukong", category: "action", price: "59,99 €", tag: "Action Mythologique" },
  { appid: 553850, name: "HELLDIVERS™ 2", category: "action", price: "39,99 €", tag: "Co-op Galactique" },
  { appid: 271590, name: "Grand Theft Auto V", category: "action", price: "29,99 €", tag: "Incontournable" },
  { appid: 1174180, name: "Red Dead Redemption 2", category: "action", price: "59,99 €", tag: "Western Épique" },
  { appid: 1593500, name: "God of War", category: "action", price: "49,99 €", tag: "Action Nordique" },
  { appid: 814380, name: "Sekiro: Shadows Die Twice", category: "action", price: "59,99 €", tag: "Hardcore & Ninjas" },
  { appid: 1888930, name: "Armored Core VI", category: "action", price: "59,99 €", tag: "Mechas Frénétiques" },
  { appid: 2124490, name: "SILENT HILL 2", category: "action", price: "69,99 €", tag: "Horreur Psychologique" },
  { appid: 1238810, name: "Battlefield™ V", category: "action", price: "49,99 €", tag: "Guerre Totale" },
  { appid: 1238840, name: "Battlefield 2042", category: "action", price: "59,99 €", tag: "Guerre Moderne" },
  { appid: 2050650, name: "Resident Evil 4 Remake", category: "action", price: "39,99 €", tag: "Survie Horrifique" },
  { appid: 1196590, name: "Resident Evil Village", category: "action", price: "39,99 €", tag: "Château & Monstres" },
  { appid: 1326470, name: "Sons Of The Forest", category: "action", price: "28,99 €", tag: "Survie Cauchemardesque" },

  // SURVIE & MULTIJOUEUR
  { appid: 1966720, name: "Lethal Company", category: "survival", price: "9,75 €", tag: "Co-op & Frissons" },
  { appid: 264710, name: "Subnautica", category: "survival", price: "29,99 €", tag: "Abysses Océaniques" },
  { appid: 739630, name: "Phasmophobia", category: "survival", price: "19,50 €", tag: "Chasse aux Fantômes" },
  { appid: 108600, name: "Project Zomboid", category: "survival", price: "19,50 €", tag: "Survie Zombie Réaliste" },
  { appid: 252490, name: "Rust", category: "survival", price: "39,99 €", tag: "Survie PVP Brutale" },
  { appid: 892970, name: "Valheim", category: "survival", price: "19,99 €", tag: "Vikings & Artisanat" },
  { appid: 1623730, name: "Palworld", category: "survival", price: "28,99 €", tag: "Monstres & Armes" },
  { appid: 221100, name: "DayZ", category: "survival", price: "47,99 €", tag: "Survie Apocalypse" },
  { appid: 346110, name: "ARK: Survival Evolved", category: "survival", price: "14,99 €", tag: "Dinosaures" },
  { appid: 548430, name: "Deep Rock Galactic", category: "survival", price: "29,99 €", tag: "Nains & Forage Spatial" },
  { appid: 648800, name: "Raft", category: "survival", price: "19,99 €", tag: "Océan & Requins" },
  { appid: 962130, name: "Grounded", category: "survival", price: "39,99 €", tag: "Jardin & Insectes Géants" },
  { appid: 1203630, name: "Enshrouded", category: "survival", price: "29,99 €", tag: "Action RPG Survie" },

  // INDÉS & PÉPITES
  { appid: 1145360, name: "Hades", category: "indie", price: "24,50 €", tag: "Rogue-like Divin" },
  { appid: 367520, name: "Hollow Knight", category: "indie", price: "14,79 €", tag: "Metroidvania Magistral" },
  { appid: 2379780, name: "Balatro", category: "indie", price: "13,99 €", tag: "Poker Rogue-like Génial" },
  { appid: 413150, name: "Stardew Valley", category: "indie", price: "13,99 €", tag: "Ferme Paisible" },
  { appid: 588630, name: "Dead Cells", category: "indie", price: "24,99 €", tag: "Rogue-lite Frénétique" },
  { appid: 1794680, name: "Vampire Survivors", category: "indie", price: "4,99 €", tag: "Addiction Pure" },
  { appid: 1868140, name: "DAVE THE DIVER", category: "indie", price: "19,99 €", tag: "Plongée & Sushis" },
  { appid: 105600, name: "Terraria", category: "indie", price: "9,99 €", tag: "Aventure 2D Infinie" },
  { appid: 242760, name: "The Forest", category: "indie", price: "16,79 €", tag: "Survie & Mystère" },
  { appid: 646570, name: "Slay the Spire", category: "indie", price: "22,99 €", tag: "Deckbuilder Tactique" },
  { appid: 1158310, name: "Crusader Kings III", category: "indie", price: "49,99 €", tag: "Dynasties Médiévales" },
  { appid: 1240440, name: "Halo Infinite", category: "indie", price: "Gratuit", tag: "Spartans & Arène" },
  { appid: 268910, name: "Cuphead", category: "indie", price: "19,99 €", tag: "Animation Rétro Difficile" },
  { appid: 504230, name: "Celeste", category: "indie", price: "19,50 €", tag: "Plateforme Précision" },
  { appid: 730, name: "Counter-Strike 2", category: "free", price: "Gratuit", tag: "FPS N°1 Mondial" },
  { appid: 570, name: "Dota 2", category: "free", price: "Gratuit", tag: "MOBA Valve" },
  { appid: 1172470, name: "Apex Legends", category: "free", price: "Gratuit", tag: "Battle Royale" },
  { appid: 230410, name: "Warframe", category: "free", price: "Gratuit", tag: "Ninjas Cybernétiques" },
  { appid: 1938090, name: "Call of Duty: Warzone", category: "free", price: "Gratuit", tag: "Battle Royale Tactique" },
  { appid: 440, name: "Team Fortress 2", category: "free", price: "Gratuit", tag: "FPS Multijoueur Culte" },
  { appid: 1063730, name: "New World: Aeternum", category: "action", price: "59,99 €", tag: "MMORPG Aventure" },
  { appid: 227300, name: "Euro Truck Simulator 2", category: "indie", price: "19,99 €", tag: "Voyage & Camions" },
  { appid: 255710, name: "Cities: Skylines", category: "indie", price: "27,99 €", tag: "Gestion Urbaine" },
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
  const [filter, setFilter] = useState<string>("all");
  const [gamesPool, setGamesPool] = useState<RouletteGame[]>(BASE_GAMES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState<RouletteGame | null>(null);
  const [displayGame, setDisplayGame] = useState<RouletteGame>(BASE_GAMES[0]);

  // Historique des derniers jeux vus pour ne JAMAIS répéter le même jeu
  const historyRef = useRef<number[]>([]);

  // Charge dynamiquement des centaines de nouveaux jeux réels depuis Steam
  useEffect(() => {
    if (!isOpen) return;

    let targetTagId = 19; // Action par défaut
    if (filter === "survival") targetTagId = 1662;
    else if (filter === "indie") targetTagId = 492;
    else if (filter === "free") targetTagId = 113;
    else if (filter === "rpg") targetTagId = 122;

    // Décalage aléatoire pour piocher dans des pages différentes du catalogue Steam
    const randomStart = Math.floor(Math.random() * 80);

    searchByTag(targetTagId, { sort: "popular", start: randomStart, count: 40 })
      .then((res) => {
        if (res.games && res.games.length > 0) {
          const fetchedGames: RouletteGame[] = res.games.map((g) => ({
            appid: g.appid,
            name: g.name,
            category: filter,
            price: g.isFree ? "Gratuit" : (g.finalPrice / 100).toFixed(2) + " €",
            tag: "Pépite Steam",
          }));

          // Fusionne avec le pool de base pour avoir un choix immense
          setGamesPool((prev) => {
            const ids = new Set(prev.map((x) => x.appid));
            const newOnes = fetchedGames.filter((x) => !ids.has(x.appid));
            return [...prev, ...newOnes];
          });
        }
      })
      .catch(() => {});
  }, [isOpen, filter]);

  // Filtre les jeux actuels
  const activePool = gamesPool.filter((g) => (filter === "all" ? true : g.category === filter));

  function spinRoulette() {
    if (isSpinning || activePool.length === 0) return;
    setIsSpinning(true);
    setSelectedGame(null);

    let counter = 0;
    const totalSpins = 28 + Math.floor(Math.random() * 10);
    let speed = 50;

    function step() {
      counter++;
      
      // Choisit un jeu aléatoire
      const randomItem = activePool[Math.floor(Math.random() * activePool.length)];
      setDisplayGame(randomItem);

      if (counter < totalSpins) {
        if (counter > totalSpins - 10) speed += 35;
        else if (counter > totalSpins - 4) speed += 80;
        setTimeout(step, speed);
      } else {
        // Sélection finale en évitant les doublons récents
        const availableCandidates = activePool.filter((g) => !historyRef.current.includes(g.appid));
        const finalWinner = (availableCandidates.length > 0 ? availableCandidates : activePool)[
          Math.floor(Math.random() * (availableCandidates.length > 0 ? availableCandidates.length : activePool.length))
        ];

        // Mémorise dans l'historique anti-répétition (garde les 15 derniers)
        historyRef.current = [finalWinner.appid, ...historyRef.current.slice(0, 15)];

        setDisplayGame(finalWinner);
        setSelectedGame(finalWinner);
        setIsSpinning(false);
      }
    }

    step();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={!isSpinning ? onClose : undefined} />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0f1722] p-6 shadow-2xl shadow-purple-950/60">
        
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-purple-500/30">
              <Dices className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-white sm:text-xl">
                La Roulette du Joueur
              </h2>
              <p className="text-xs text-purple-300">
                SteamFinder by ziad • <span className="font-bold text-emerald-400">{activePool.length}</span> jeux en rotation
              </p>
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

        {/* FILTRES CATÉGORIES */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "🎲 Tout le catalogue" },
            { id: "action", label: "⚔️ Action & RPG" },
            { id: "survival", label: "🧟 Survie & Co-op" },
            { id: "indie", label: "💎 Pépites Indés" },
            { id: "free", label: "🎁 100% Gratuits" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              disabled={isSpinning}
              onClick={() => { setFilter(cat.id); setSelectedGame(null); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                filter === cat.id ? "bg-purple-600 text-white shadow" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* CADRE CASINO ROULETTE */}
        <div className="relative mt-6 overflow-hidden rounded-xl border-2 border-purple-500/40 bg-slate-900/90 shadow-inner">
          <div className="relative aspect-[460/215] w-full overflow-hidden bg-slate-950">
            <img
              src={headerImage(displayGame.appid)}
              alt={displayGame.name}
              className={`h-full w-full object-cover transition duration-150 ${
                isSpinning ? "scale-105 blur-[1px]" : "scale-100 blur-0"
              }`}
            />

            {isSpinning && (
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-transparent to-pink-600/30 animate-pulse" />
            )}

            {selectedGame && (
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500 px-3 py-1 text-xs font-bold text-amber-950 shadow-lg">
                <Trophy className="h-3.5 w-3.5" /> Gagnant sélectionné !
              </div>
            )}

            <div className="absolute bottom-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-white backdrop-blur">
              {displayGame.price}
            </div>
          </div>

          <div className="p-4 text-center">
            <h3 className="text-base font-extrabold text-white sm:text-lg">
              {displayGame.name}
            </h3>
            <span className="mt-1 inline-block text-xs font-medium text-purple-400">
              {displayGame.tag}
            </span>
          </div>
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={spinRoulette}
            disabled={isSpinning}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/50 transition hover:opacity-90 disabled:opacity-50"
          >
            {isSpinning ? (
              <><RotateCw className="h-4 w-4 animate-spin" /> Tirage en cours…</>
            ) : selectedGame ? (
              <><Dices className="h-4 w-4" /> Relancer la roulette</>
            ) : (
              <><Flame className="h-4 w-4" /> Faire tourner la roulette !</>
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