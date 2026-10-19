import { useState } from "react";
import Header, { type ViewName } from "./components/Header";
import HomeView from "./components/HomeView";
import CategoryView from "./components/CategoryView";
import SearchView from "./components/SearchView";
import SalesView from "./components/SalesView";
import CompareView from "./components/CompareView";
import WishlistView from "./components/WishlistView";
import GameModal from "./components/GameModal";
import RandomGameModal from "./components/RandomGameModal";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import { useCompare } from "./hooks/useCompare";
import { useWishlist } from "./hooks/useWishlist";

type AppView =
  | { name: "home" }
  | { name: "category"; categoryId: string }
  | { name: "search"; term: string }
  | { name: "sales" }
  | { name: "compare" }
  | { name: "wishlist" };

export default function App() {
  const [view, setView] = useState<AppView>({ name: "home" });
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const compare = useCompare();
  const { wishlist, toggleWishlist, isWishlisted, clearWishlist } = useWishlist();

  function navigate(name: ViewName) {
    if (name === "category") return;
    setView({ name } as AppView);
  }

  const activeNav: ViewName =
    view.name === "category" || view.name === "search" ? "home" : (view.name as ViewName);

  return (
    <div className="min-h-screen bg-[#0b0f16] text-slate-100">
      <Header
        active={activeNav}
        compareCount={compare.list.length}
        wishlistCount={wishlist.length}
        onNavigate={navigate}
        onSearch={(term) => setView({ name: "search", term })}
        onOpenRoulette={() => setIsRouletteOpen(true)}
        initialTerm={view.name === "search" ? view.term : ""}
      />

      <main>
        {view.name === "home" && (
          <HomeView
            onOpen={setSelectedAppId}
            onSelectCategory={(categoryId) => setView({ name: "category", categoryId })}
            onSearch={(term) => setView({ name: "search", term })}
            onNavigateSales={() => setView({ name: "sales" })}
            compare={compare}
          />
        )}

        {view.name === "category" && (
          <CategoryView
            categoryId={view.categoryId}
            onOpen={setSelectedAppId}
            compare={compare}
            onBack={() => setView({ name: "home" })}
          />
        )}

        {view.name === "search" && <SearchView term={view.term} onOpen={setSelectedAppId} compare={compare} />}

        {view.name === "sales" && <SalesView onOpen={setSelectedAppId} compare={compare} />}

        {view.name === "compare" && <CompareView compare={compare} onOpen={setSelectedAppId} />}

        {view.name === "wishlist" && (
          <WishlistView
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onClearWishlist={clearWishlist}
            onOpen={setSelectedAppId}
            compare={compare}
            onBack={() => setView({ name: "home" })}
          />
        )}
      </main>

      <Footer />
      <ScrollToTop />

      {selectedAppId !== null && (
        <GameModal appid={selectedAppId} onClose={() => setSelectedAppId(null)} compare={compare} />
      )}

      <RandomGameModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        onSelectGame={(appid) => {
          setIsRouletteOpen(false);
          setSelectedAppId(appid);
        }}
      />
    </div>
  );
}