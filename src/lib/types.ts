export interface SearchItem {
  id: number;
  name: string;
  tiny_image?: string;
  price?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
  };
  platforms?: { windows: boolean; mac: boolean; linux: boolean };
}

export interface SpyGame {
  appid: number;
  name: string;
  developer?: string;
  publisher?: string;
  score_rank?: string;
  owners?: string;
  price?: string; // cents as string
  initialprice?: string;
  discount?: string;
  ccu?: number;
  genre?: string;
}

export interface AppDetails {
  type: string;
  name: string;
  steam_appid: number;
  is_free: boolean;
  detailed_description: string;
  short_description: string;
  header_image: string;
  website?: string;
  developers?: string[];
  publishers?: string[];
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  };
  platforms: { windows: boolean; mac: boolean; linux: boolean };
  categories?: { id: number; description: string }[];
  genres?: { id: string; description: string }[];
  screenshots?: { id: number; path_thumbnail: string; path_full: string }[];
  release_date?: { coming_soon: boolean; date: string };
  metacritic?: { score: number; url: string };
  recommendations?: { total: number };
}

export type DeckCategory = 0 | 1 | 2 | 3 | -1;

export interface DeckCompat {
  category: DeckCategory;
  label: string;
}

export interface ReviewSummary {
  review_score: number;
  review_score_desc: string;
  total_positive: number;
  total_negative: number;
  total_reviews: number;
}

export interface GameSummary {
  appid: number;
  name: string;
  headerImage: string;
  price?: number | null;
  initialPrice?: number | null;
  discount?: number;
  owners?: string;
  ccu?: number;
}

export interface CompareEntry {
  appid: number;
  name: string;
  headerImage: string;
  details?: AppDetails | null;
  deck?: DeckCompat | null;
  review?: ReviewSummary | null;
  loading: boolean;
}
