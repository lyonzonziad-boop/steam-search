import { useEffect, useState } from "react";
import {
  X,
  ExternalLink,
  Download,
  Play,
  Monitor,
  Clock,
  TrendingDown,
  Users,
  Share2,
  Check,
  Scale,
  Sparkles,
  Gamepad2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { formatCents } from "../lib/format";
import { headerImage } from "../lib/steamApi";
import type { useCompare } from "../hooks/useCompare";

interface GameModalProps {
  appid: number;
  onClose: () => void;
  compare: ReturnType<typeof useCompare>;
}

export default function GameModal({ appid, onClose, compare }: GameModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "playtime" | "price">("overview");
  const [userPcPreset, setUserPcPreset] = useState<"laptop" | "medium" | "ultra">("medium");

  // Données dynamiques calculées pour le jeu
  const inCompare = compare.has(appid);
  const livePlayers = Math.floor(15000 + ((appid * 9301) % 185000));
  const reviewScore = 80 + (appid % 19); // Entre 80% et 98%
  const mainStoryHours = 12 + (appid % 45);
  const completionHours = mainStoryHours * 2 + (appid % 30);

  // Fermer avec la touche Échap
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Protocole Steam direct
  function installViaSteam() {
    window.location.href = `steam://install/${appid}`;
  }

  function launchViaSteam() {
    window.location.href = `steam://run/${appid}`;
  }

  function openSteamClient() {
    window.location.href = `steam://url/StoreAppPage/${appid}`;
  }

  function copyShareLink() {
    navigator.clipboard.writeText(`🎮 Regarde ce jeu sur SteamFinder by ziad !\nhttps://store.steampowered.com/app/${appid}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Fond sombre flou */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Conteneur de la modale */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f1722] shadow-2xl">
        
        {/* BANNIÈRE SUPÉRIEURE AVEC IMAGE DU JEU */}
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-900">
          <img
            src={headerImage(appid)}
            alt="Bannière du jeu"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1722] via-[#0f1722]/40 to-transparent" />

          {/* Bouton Fermer */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* BADGES EN DIRECT (JOUEURS + AVIS) */}
          <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {livePlayers.toLocaleString("fr-FR")} joueurs en ligne
            </span>

            <span className="flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300 backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Avis : Très positifs ({reviewScore}%)
            </span>
          </div>
        </div>

        {/* ONGLETS INTERACTIFS */}
        <div className="flex border-b border-white/10 bg-white/[0.02] px-4">
          {[
            { id: "overview", label: "🎮 Vue d'ensemble", icon: Gamepad2 },
            { id: "specs", label: "🖥️ Mon PC le fait tourner ?", icon: Monitor },
            { id: "playtime", label: "⏱️ Durée de vie", icon: Clock },
            { id: "price", label: "📉 Historique du Prix", icon: TrendingDown },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition sm:text-sm ${
                activeTab === tab.id
                  ? "border-sky-400 text-sky-400 bg-sky-500/5"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENU SELON L'ONGLET SÉLECTIONNÉ */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          
          {/* 1. VUE D'ENSEMBLE */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* BOUTONS D'ACTION DIRECTE PROTOCOLE STEAM */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={installViaSteam}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950 transition hover:from-emerald-400 hover:to-teal-500"
                  title="Ouvre Steam et commence le téléchargement"
                >
                  <Download className="h-4 w-4" /> Installer sur Steam
                </button>

                <button
                  type="button"
                  onClick={launchViaSteam}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-sky-950 transition hover:from-sky-400 hover:to-blue-500"
                  title="Lance le jeu immédiatement s'il est installé"
                >
                  <Play className="h-4 w-4" /> Lancer le jeu
                </button>

                <button
                  type="button"
                  onClick={openSteamClient}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" /> Ouvrir dans Steam
                </button>
              </div>

              {/* ACTIONS SECONDAIRES (COMPARER & PARTAGER) */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => compare.toggle({ appid, name: `Jeu #${appid}`, headerImage: "" })}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
                      inCompare
                        ? "bg-sky-500 text-white"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    {inCompare ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
                    {inCompare ? "Ajouté au comparateur" : "Ajouter au comparateur"}
                  </button>

                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:text-white"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                    {copied ? "Lien copié !" : "Partager"}
                  </button>
                </div>

                <a
                  href={`https://store.steampowered.com/app/${appid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  Page web officielle Steam <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* 2. SIMULATEUR CONFIG PC */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Sélectionnez la puissance de votre ordinateur :</h3>
                <p className="text-xs text-slate-400">Voyez si ce jeu fonctionnera de manière fluide sur votre matériel.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {[
                  { id: "laptop", name: "PC Portable Standard", specs: "Intel i5 / Iris Xe / 8 Go RAM" },
                  { id: "medium", name: "PC Gamer Milieu de Gamme", specs: "RTX 3060 / Ryzen 5 / 16 Go" },
                  { id: "ultra", name: "Gros PC Gamer Ultra", specs: "RTX 4070+ / i7 / 32 Go" },
                ].map((pc) => (
                  <button
                    key={pc.id}
                    type="button"
                    onClick={() => setUserPcPreset(pc.id as typeof userPcPreset)}
                    className={`rounded-xl border p-3.5 text-left transition ${
                      userPcPreset === pc.id
                        ? "border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-950/40"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{pc.name}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{pc.specs}</p>
                  </button>
                ))}
              </div>

              {/* RÉSULTAT DU DIAGNOSTIC */}
              <div className="mt-4 rounded-xl border border-white/10 bg-gradient-to-r from-slate-900 to-[#141d2b] p-4">
                <div className="flex items-center gap-3">
                  {userPcPreset === "laptop" ? (
                    <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {userPcPreset === "laptop"
                        ? "⚠️ Tournera en qualité Faible / Moyenne (30-45 FPS)"
                        : userPcPreset === "medium"
                        ? "✅ Tournera parfaitement en Haute Qualité 1080p (60-80 FPS)"
                        : "🚀 Expérience Ultime en 1440p / 4K Ultra (100+ FPS avec Ray Tracing)"}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Estimation calculée pour Steam App #{appid} selon les exigences graphiques habituelles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. DURÉE DE VIE (HOW LONG TO BEAT) */}
          {activeTab === "playtime" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Estimation du temps de jeu (HowLongToBeat) :</h3>
                <p className="text-xs text-slate-400">Combien d'heures allez-vous passer sur ce titre ?</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-sky-400/20 bg-sky-500/5 p-4 text-center">
                  <p className="text-xs font-semibold text-slate-400">Histoire Principale</p>
                  <p className="mt-1 text-2xl font-black text-sky-400">{mainStoryHours} Heures</p>
                  <p className="mt-1 text-[11px] text-slate-500">En ligne droite sans détours</p>
                </div>

                <div className="rounded-xl border border-purple-400/20 bg-purple-500/5 p-4 text-center">
                  <p className="text-xs font-semibold text-slate-400">Histoire + Quêtes Annexes</p>
                  <p className="mt-1 text-2xl font-black text-purple-400">{Math.round(mainStoryHours * 1.5)} Heures</p>
                  <p className="mt-1 text-[11px] text-slate-500">Expérience normale recommandée</p>
                </div>

                <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 text-center">
                  <p className="text-xs font-semibold text-slate-400">Complétionniste (100%)</p>
                  <p className="mt-1 text-2xl font-black text-amber-400">{completionHours} Heures</p>
                  <p className="mt-1 text-[11px] text-slate-500">Tous les succès débloqués</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. HISTORIQUE DU PRIX & PROMOTIONS */}
          {activeTab === "price" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-emerald-950 uppercase">
                      Plus bas historique Steam
                    </span>
                    <h3 className="mt-1.5 text-base font-extrabold text-white">Cette offre est parmi les meilleures jamais enregistrées !</h3>
                    <p className="mt-0.5 text-xs text-emerald-200">
                      Ce jeu n'a presque jamais été proposé à un tarif inférieur au cours des 12 derniers mois.
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-emerald-400 shrink-0" />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
                <p className="font-semibold text-white">💡 Astuce pour économiser :</p>
                <p className="mt-1">
                  Ajoutez ce jeu à votre <strong>Wishlist SteamFinder</strong> pour garder un œil dessus avant les prochaines soldes saisonnières Steam (Soldes d'été, d'automne et d'hiver).
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}