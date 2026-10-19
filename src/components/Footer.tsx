import { Heart, Coffee, ShieldCheck, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0c131c] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* BANNIÈRE SOUTIEN PAYPAL */}
        <div className="mb-10 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-slate-900 to-sky-950/40 p-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Coffee className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-white">Tu as trouvé ton jeu grâce à SteamFinder ?</h3>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Soutiens le développement du site et les futures mises à jour !
              </p>
            </div>
            <a
              href="https://paypal.me/NatanBoncompain543"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-yellow-400"
            >
              <Heart className="h-4 w-4 fill-slate-950" />
              Soutenir sur PayPal
            </a>
          </div>
        </div>

        {/* COPYRIGHT & CREDITS */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} SteamFinder • Conçu et développé <span className="font-semibold text-slate-300">by ziad</span></p>
          <p className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Données officielles Valve / Steam API
          </p>
        </div>

      </div>
    </footer>
  );
}