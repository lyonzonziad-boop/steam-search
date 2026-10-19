export interface Category {
  id: string;
  label: string;
  emoji: string;
  tagId: number;
  description?: string;
}

export const CATEGORIES: Category[] = [
  { id: "action", label: "Action", emoji: "⚔️", tagId: 19, description: "Combats intenses et adrénaline" },
  { id: "rpg", label: "RPG & Aventure", emoji: "🛡️", tagId: 122, description: "Jeux de rôle et quêtes épiques" },
  { id: "open-world", label: "Monde Ouvert", emoji: "🌍", tagId: 1695, description: "Exploration libre et univers immenses" },
  { id: "fps", label: "FPS / Tir", emoji: "🎯", tagId: 1663, description: "Tir à la première personne et précision" },
  { id: "souls-like", label: "Souls-like", emoji: "💀", tagId: 29482, description: "Difficulté exigeante et boss impitoyables" },
  { id: "survival", label: "Survie", emoji: "🏕️", tagId: 1662, description: "Artisanat, ressources et danger permanent" },
  { id: "horror", label: "Horreur & Angoisse", emoji: "👻", tagId: 1667, description: "Frissons, survie et frayeurs" },
  { id: "coop", label: "Co-op & Multijoueur", emoji: "👥", tagId: 3843, description: "À jouer entre amis ou en ligne" },
  { id: "roguelike", label: "Rogue-like & Lite", emoji: "🔄", tagId: 1716, description: "Génération procédurale et rejouabilité infinie" },
  { id: "cyberpunk", label: "Cyberpunk & Futur", emoji: "🤖", tagId: 4115, description: "Néons, implants et univers dystopiques" },
  { id: "scifi", label: "Science-Fiction", emoji: "🚀", tagId: 3942, description: "Espace, technologies et galaxies lointaines" },
  { id: "strategy", label: "Stratégie", emoji: "🧠", tagId: 9, description: "Tactique militaire, gestion et réflexion" },
  { id: "simulation", label: "Simulation", emoji: "🚜", tagId: 599, description: "Vies virtuelles et simulateurs réalistes" },
  { id: "city-builder", label: "Gestion & Villes", emoji: "🏙️", tagId: 4328, description: "Construisez et gérez votre empire urbain" },
  { id: "indie", label: "Pépites Indés", emoji: "💎", tagId: 492, description: "Créations uniques de studios indépendants" },
  { id: "racing", label: "Course & Voitures", emoji: "🏎️", tagId: 699, description: "Vitesse, asphalte et simulation auto" },
  { id: "sports", label: "Sports", emoji: "⚽", tagId: 701, description: "Football, basket, sports extrêmes" },
  { id: "fighting", label: "Combat", emoji: "🥊", tagId: 1743, description: "Versus fighting, combos et arts martiaux" },
  { id: "metroidvania", label: "Metroidvania", emoji: "🗝️", tagId: 1628, description: "Exploration 2D, compétences et secrets" },
  { id: "platformer", label: "Plateforme", emoji: "🏃", tagId: 1625, description: "Sauts de précision et réflexes" },
  { id: "puzzle", label: "Énigmes & Casse-tête", emoji: "🧩", tagId: 1664, description: "Logique, réflexion et mystères" },
  { id: "story-rich", label: "Histoire Riche", emoji: "📖", tagId: 1742, description: "Scénarios captivants et narration poussée" },
  { id: "post-apo", label: "Post-Apocalyptique", emoji: "☣️", tagId: 3835, description: "Terres dévastées et survie radioactive" },
  { id: "anime", label: "Anime & Manga", emoji: "✨", tagId: 4085, description: "Styles artistiques japonais et visual novels" },
  { id: "hack-and-slash", label: "Hack & Slash", emoji: "⚔️", tagId: 1646, description: "Batailles de masse et combos dévastateurs" },
  { id: "zombies", label: "Zombies", emoji: "🧟", tagId: 1659, description: "Hordes de morts-vivants et apocalypse" },
  { id: "sandbox", label: "Bac à sable", emoji: "🧱", tagId: 3810, description: "Liberté totale de création et d'expérimentation" },
  { id: "tactical", label: "Tactique au tour par tour", emoji: "♟️", tagId: 1708, description: "Précision, positionnement et tactique" },
  { id: "casual", label: "Détente & Relaxant", emoji: "☕", tagId: 597, description: "Jeux calmes sans stress pour se poser" },
  { id: "f2p", label: "Free-to-Play (Gratuits)", emoji: "🎁", tagId: 113, description: "Jeux 100% gratuits à télécharger immédiatement" },
  { id: "vr", label: "Réalité Virtuelle (VR)", emoji: "🥽", tagId: 21978, description: "Immersion totale au casque VR" },
  { id: "point-and-click", label: "Point & Click", emoji: "🖱️", tagId: 1698, description: "Enquêtes interactives et classiques" },
];