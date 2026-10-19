import { proxyFetchJson } from "./proxyFetch";
import type { AppDetails, DeckCompat, ReviewSummary, SearchItem, SpyGame } from "./types";

const CC = "fr";
const LANG = "french";

export function headerImage(appid: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
}

export function capsuleImage(appid: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`;
}

export async function searchGames(term: string): Promise<SearchItem[]> {
  if (!term.trim()) return [];
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
    term
  )}&l=${LANG}&cc=${CC}`;
  const data = await proxyFetchJson<{ total: number; items: SearchItem[] }>(url, 2 * 60 * 1000);
  return data.items ?? [];
}

export async function getAppDetails(appid: number): Promise<AppDetails | null> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=${LANG}&cc=${CC}`;
  const data = await proxyFetchJson<Record<string, { success: boolean; data?: AppDetails }>>(
    url,
    60 * 60 * 1000
  );
  const entry = data[String(appid)];
  if (!entry || !entry.success || !entry.data) return null;
  return entry.data;
}

const DECK_LABELS: Record<number, string> = {
  0: "Inconnu",
  1: "Non pris en charge",
  2: "Jouable",
  3: "Vérifié",
};

export async function getDeckCompatibility(appid: number): Promise<DeckCompat> {
  try {
    const url = `https://store.steampowered.com/saleaction/ajaxgetdeckappcompatibilityreport?nAppID=${appid}&l=${LANG}`;
    const data = await proxyFetchJson<{
      success: number;
      results?: { resolved_category?: number };
    }>(url, 24 * 60 * 60 * 1000);
    const cat = data?.results?.resolved_category;
    if (cat === undefined || cat === null) return { category: -1, label: "Inconnu" };
    return { category: cat as 0 | 1 | 2 | 3, label: DECK_LABELS[cat] ?? "Inconnu" };
  } catch {
    return { category: -1, label: "Indisponible" };
  }
}

export async function getReviewSummary(appid: number): Promise<ReviewSummary | null> {
  try {
    const url = `https://store.steampowered.com/appreviews/${appid}?json=1&filter=summary&purchase_type=all&num_per_page=0&language=all&l=${LANG}`;
    const data = await proxyFetchJson<{ query_summary: ReviewSummary }>(url, 60 * 60 * 1000);
    return data.query_summary ?? null;
  } catch {
    return null;
  }
}

export interface FeaturedItem {
  id: number;
  name: string;
  discounted: boolean;
  discount_percent: number;
  original_price?: number;
  final_price: number;
  currency: string;
  header_image?: string;
}

export async function getSpecials(): Promise<FeaturedItem[]> {
  const url = `https://store.steampowered.com/api/featuredcategories?cc=${CC}&l=${LANG}`;
  const data = await proxyFetchJson<{ specials?: { items: FeaturedItem[] } }>(url, 5 * 60 * 1000);
  return data.specials?.items ?? [];
}

export async function getTopSellers(): Promise<FeaturedItem[]> {
  const url = `https://store.steampowered.com/api/featuredcategories?cc=${CC}&l=${LANG}`;
  const data = await proxyFetchJson<{ top_sellers?: { items: FeaturedItem[] } }>(url, 10 * 60 * 1000);
  return data.top_sellers?.items ?? [];
}

export async function getNewReleases(): Promise<FeaturedItem[]> {
  const url = `https://store.steampowered.com/api/featuredcategories?cc=${CC}&l=${LANG}`;
  const data = await proxyFetchJson<{ new_releases?: { items: FeaturedItem[] } }>(url, 10 * 60 * 1000);
  return data.new_releases?.items ?? [];
}

export async function getTop100In2Weeks(): Promise<SpyGame[]> {
  const url = `https://steamspy.com/api.php?request=top100in2weeks`;
  const data = await proxyFetchJson<Record<string, SpyGame>>(url, 30 * 60 * 1000);
  return Object.values(data).filter((g) => g && g.appid);
}

// Category browsing uses Steam's own storefront search endpoint (the same one
// store.steampowered.com/search/?tags=... loads). It returns an HTML
// fragment, which we parse in the browser with DOMParser — no extra
// dependency needed, and it is always in sync with the real store.
export type SortOption = "popular" | "price_asc" | "price_desc" | "top_rated" | "newest";

const SORT_MAP: Record<SortOption, string> = {
  popular: "_ASC",
  price_asc: "Price_ASC",
  price_desc: "Price_DESC",
  top_rated: "Reviews_DESC",
  newest: "Released_DESC",
};

export interface TagResultGame {
  appid: number;
  name: string;
  finalPrice?: number;
  initialPrice?: number;
  discount: number;
  isFree: boolean;
  platforms: { windows: boolean; mac: boolean; linux: boolean };
  releaseDate?: string;
}

export interface TagResults {
  games: TagResultGame[];
  total: number;
}

export async function searchByTag(
  tagId: number,
  opts: { sort?: SortOption; start?: number; count?: number } = {}
): Promise<TagResults> {
  const { sort = "popular", start = 0, count = 30 } = opts;
  const url = `https://store.steampowered.com/search/results/?query&start=${start}&count=${count}&dynamic_data=&sort_by=${SORT_MAP[sort]}&tags=${tagId}&category1=998&supportedlang=${LANG}&cc=${CC}&l=${LANG}&infinite=1`;
  const data = await proxyFetchJson<{ results_html: string; total_count: number }>(url, 10 * 60 * 1000);

  const doc = new DOMParser().parseFromString(data.results_html, "text/html");
  const rows = Array.from(doc.querySelectorAll<HTMLAnchorElement>("a.search_result_row"));

  const games: TagResultGame[] = rows
    .map((row) => {
      const appidRaw = row.getAttribute("data-ds-appid") ?? "";
      const appid = Number(appidRaw.split(",")[0]);
      const name = row.querySelector(".title")?.textContent?.trim() ?? "";

      const platforms = {
        windows: !!row.querySelector(".platform_img.win"),
        mac: !!row.querySelector(".platform_img.mac"),
        linux: !!row.querySelector(".platform_img.linux"),
      };

      const priceWrap = row.querySelector(".search_price_discount_combined");
      const finalAttr = priceWrap?.getAttribute("data-price-final");
      const finalPrice = finalAttr !== null && finalAttr !== undefined && finalAttr !== "" ? Number(finalAttr) : undefined;
      const discountBlock = row.querySelector(".discount_block");
      const discount = discountBlock ? Number(discountBlock.getAttribute("data-discount") || "0") : 0;
      const isFree = !!row.querySelector(".discount_final_price.free");
      const initialPrice =
        discount > 0 && finalPrice !== undefined ? Math.round(finalPrice / (1 - discount / 100)) : finalPrice;
      const releaseDate = row.querySelector(".search_released")?.textContent?.trim();

      return { appid, name, finalPrice, initialPrice, discount, isFree, platforms, releaseDate };
    })
    .filter((g) => g.appid && g.name);

  return { games, total: data.total_count ?? games.length };
}
