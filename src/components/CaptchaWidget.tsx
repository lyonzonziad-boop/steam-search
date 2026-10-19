import { useState, useEffect } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

export default function CaptchaWidget({ onVerify }: { onVerify: (isValid: boolean) => void }) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput("");
    setIsSuccess(false);
    onVerify(false);
  }

  useEffect(() => {
    generateCaptcha();
  }, []);

  function handleInput(val: string) {
    const clean = val.toUpperCase().trim();
    setUserInput(clean);
    if (clean === captchaText) {
      setIsSuccess(true);
      onVerify(true);
    } else {
      setIsSuccess(false);
      onVerify(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <ShieldCheck className="h-3.5 w-3.5 text-sky-400" /> Vérification anti-robot
        </span>
        <button
          type="button"
          onClick={generateCaptcha}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
        >
          <RefreshCw className="h-3 w-3" /> Changer
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Code de sécurité stylisé avec bruit visuel */}
        <div className="flex h-10 select-none items-center justify-center rounded-lg border border-sky-500/30 bg-gradient-to-r from-slate-900 to-sky-950 px-4 font-mono text-lg font-black tracking-widest text-sky-300 shadow-inner">
          {captchaText.split("").map((ch, idx) => (
            <span
              key={idx}
              style={{
                display: "inline-block",
                transform: `rotate(${((idx % 2 === 0 ? 1 : -1) * 8)}deg)`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Champ de saisie utilisateur */}
        <input
          type="text"
          maxLength={5}
          value={userInput}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Recopiez ici"
          className={`w-full rounded-lg border py-2 px-3 text-center text-xs font-bold uppercase tracking-wider outline-none transition ${
            isSuccess
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
              : "border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-sky-400"
          }`}
        />
      </div>
      {isSuccess && <p className="mt-1 text-[11px] font-semibold text-emerald-400">✓ Captcha validé</p>}
    </div>
  );
}