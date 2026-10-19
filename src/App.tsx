import { useState } from "react";
import Header, { type ViewName } from "./components/Header";
import HomeView from "./components/HomeView";
import CategoryView from "./components/CategoryView";
import SearchView from "./components/SearchView";
import SalesView from "./components/SalesView";
import CompareView from "./components/CompareView";
import GameModal from "./components/GameModal";
import Footer from "./components/Footer";
import { useCompare } from "./hooks/useCompare";

type AppView =
  | { name: "home" }
  | { name: "category"; categoryId: string }
  | { name: "search"; term: string }
  | { name: "sales" }
  | { name: "compare" };

export default function App() {
  const [view, setView] = useState<AppView>({ name: "home" });
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const compare = useCompare();

  function navigate(name: ViewName) {
    if (name === "category") return; // handled via category selection
    setView({ name } as AppView);
  }

  const activeNav: ViewName =
    view.name === "category" || view.name === "search" ? "home" : (view.name as ViewName);

  return (
    <div className="min-h-screen bg-[#0b0f16] text-slate-100">
      <Header
        active={activeNav}
        compareCount={compare.list.length}
        onNavigate={navigate}
        onSearch={(term) => setView({ name: "search", term })}
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
      </main>

      <Footer />

      {selectedAppId !== null && (
        <GameModal appid={selectedAppId} onClose={() => setSelectedAppId(null)} compare={compare} />
      )}
    </div>
  );
}
