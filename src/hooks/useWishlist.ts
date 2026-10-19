import { useState, useEffect } from "react";
import type { GridGame } from "../components/GameGrid";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<GridGame[]>(() => {
    try {
      const saved = localStorage.getItem("steamfinder_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("steamfinder_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const toggleWishlist = (game: GridGame) => {
    setWishlist((prev) => {
      const exists = prev.some((g) => g.appid === game.appid);
      if (exists) {
        return prev.filter((g) => g.appid !== game.appid);
      } else {
        return [...prev, game];
      }
    });
  };

  const isWishlisted = (appid: number) => wishlist.some((g) => g.appid === appid);
  const clearWishlist = () => setWishlist([]);

  return { wishlist, toggleWishlist, isWishlisted, clearWishlist };
}