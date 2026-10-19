import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Retour en haut"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/40 bg-[#0f1722]/90 text-sky-400 shadow-xl shadow-black/50 backdrop-blur transition hover:-translate-y-1 hover:bg-sky-500 hover:text-white"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}