import { useState } from "react";
import { X, Mail, Lock, User, CheckCircle2, AlertCircle, ArrowRight, KeyRound } from "lucide-react";
import CaptchaWidget from "./CaptchaWidget";
import type { useAuth } from "../hooks/useAuth";

export default function AuthModal({
  isOpen,
  onClose,
  auth,
}: {
  isOpen: boolean;
  onClose: () => void;
  auth: ReturnType<typeof useAuth>;
}) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"form" | "verify">("form");

  // Formulaire
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [captchaPassed, setCaptchaPassed] = useState(false);

  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!captchaPassed) {
      setError("Veuillez valider le code de sécurité Captcha.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const res = auth.register(username, email, password);
    if (!res.success) {
      setError(res.error || "Erreur lors de l'inscription.");
    } else {
      setSimulatedCode(res.code || null);
      setStep("verify");
    }
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = auth.verifyEmailCode(email, verificationCode);
    if (!res.success) {
      setError(res.error || "Code invalide.");
    } else {
      onClose();
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = auth.login(email, password);
    if (!res.success) {
      setError(res.error || "Erreur de connexion.");
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1722] p-6 shadow-2xl">
        
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            {step === "verify" ? "Vérification de l'email" : tab === "login" ? "Connexion" : "Créer un compte"}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ÉTAPE DE VÉRIFICATION EMAIL */}
        {step === "verify" ? (
          <form onSubmit={handleVerify} className="mt-5 space-y-4">
            {simulatedCode && (
              <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-3.5 text-xs text-sky-200">
                <p className="font-semibold text-white">📨 Code envoyé à {email} :</p>
                <p className="mt-1 font-mono text-base font-bold text-sky-400">{simulatedCode}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">(Recopiez ce code pour finaliser l'inscription)</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300">Code secret reçu :</label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Ex: 584920"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 font-mono text-sm tracking-widest text-white outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-950 transition hover:from-sky-400 hover:to-blue-500"
            >
              <CheckCircle2 className="h-4 w-4" /> Valider mon compte
            </button>
          </form>
        ) : (
          /* FORMULAIRE NORMAL */
          <div>
            {/* ONGLETS CONNEXION / INSCRIPTION */}
            <div className="mt-4 flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => { setTab("login"); setError(null); }}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  tab === "login" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => { setTab("register"); setError(null); }}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  tab === "register" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Créer un compte
              </button>
            </div>

            <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="mt-4 space-y-3.5">
              {tab === "register" && (
                <div>
                  <label className="text-xs font-semibold text-slate-300">Pseudo :</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: GhostRider"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-sky-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300">Adresse email :</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Mot de passe :</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* CAPTCHA ANTI-BOT SUR L'INSCRIPTION */}
              {tab === "register" && <CaptchaWidget onVerify={setCaptchaPassed} />}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-950 transition hover:from-sky-400 hover:to-blue-500"
              >
                {tab === "login" ? "Se connecter" : "Continuer"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}