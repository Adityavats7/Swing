
/* ========= ENUMS & CONSTANT TYPES ========= */

/** Operational status of a store */
export type StoreOpenStatus = "OPEN" | "CLOSED" | "BUSY";

/** Inventory health indicator (normalized) */
export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

/** High‑level store category (extend as needed) */
export type StoreCategory =
  | "GROCERY"
  | "PHARMACY"
  | "MEAT"
  | "BAKERY"
  | "ELECTRONICS"
  | "GENERAL";

/** Marketing/operational tags shown as badges */
export type StoreServiceTag =
  | "FAST_DELIVERY"
  | "BEST_PRICE"
  | "TOP_RATED"
  | "ORGANIC"
  | "LOCAL_FAVORITE";

/* ========= VALUE OBJECTS ========= */

/** Geo location for distance/map work */
export type GeoLocation = {
  latitude: number;
  longitude: number;
};

/** Delivery information */
export type DeliveryInfo = {
  etaMins: number;          // minutes to deliver
  distanceKm: number;       // km from user
  deliveryFee?: number;     // INR
  freeDeliveryAbove?: number; // INR threshold for free delivery
};

/** Price preview for a highlighted/popular product */
export type FeaturedPrice = {
  price: number;            // INR
  mrp?: number;             // INR
  discountPercent?: number; // computed server-side ideally
};

/** Aggregate rating */
export type StoreRating = {
  average: number;          // 0..5
  totalRatings: number;     // count
};

/* ========= CORE ENTITY ========= */

export type Store = {
  /* Identity & routing */
  id: string;
  slug: string; // SEO-friendly segment: e.g. "freshkart-sector-43"

  /* Display */
  name: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;

  /* Classification */
  category: StoreCategory;
  tags?: StoreServiceTag[];

  /* Location */
  location: GeoLocation;

  /* Availability & inventory */
  openStatus: StoreOpenStatus;
  stockStatus: StockStatus;

  /* Delivery */
  delivery: DeliveryInfo;

  /* Price preview */
  featuredPrice?: FeaturedPrice;

  /* Rating */
  rating?: StoreRating;

  /* Operational flags */
  isVerified: boolean;
  isEnabled: boolean;

  /* Timestamps */
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

/* ========= LISTING / SEARCH CONTRACTS ========= */
/**
 * Sorting fields for store listings.
 * NOTE: "RELEVANCE" is a placeholder for future search scoring integration.
 */
export type StoreSortBy =
  | "RELEVANCE"
  | "DISTANCE"   // delivery.distanceKm ASC
  | "ETA"        // delivery.etaMins ASC
  | "RATING"     // rating.average DESC (by default)
  | "PRICE";     // featuredPrice.price ASC (fallback Infinity)

/** Sort direction for explicit control (default depends on field) */
export type SortDirection = "ASC" | "DESC";

/** Page-based pagination (simple & SSR friendly). Switch to cursor later if needed. */
export type PageParams = {
  page?: number;       // 1-based; default set by service/hook
  pageSize?: number;   // default set by service/hook (e.g., 12)
};

/**
 * Search/filter params accepted by listing endpoints.
 * NOTE: extend safely — adding optional fields is backwards compatible.
 */
export type StoreSearchParams = {
  query?: string;
  category?: StoreCategory;
  maxDistanceKm?: number;
  openOnly?: boolean;
  tags?: StoreServiceTag[];

  // Sorting (optional)
  sortBy?: StoreSortBy;
  sortDir?: SortDirection;
} & PageParams;

/** Paged response wrapper for listing UIs */
export type PagedStoresResponse = {
  stores: Store[];
  total: number;      // total matching items (ignoring page)
  page: number;       // 1-based
  pageSize: number;   // number per page
  hasMore: boolean;   // convenience flag for "Load more"
};

/* ========= LEGACY/COMPAT RESPONSE (kept temporarily) ========= */
/**
 * Legacy shape used earlier. Keep it while migrating code paths that still expect it.
 * You can remove this once all consumers switch to PagedStoresResponse.
 */
export type NearbyStoresResponse = {
  stores: Store[];
  total: number;
};

/* ========= UI-DERIVED TYPES ========= */
/**
 * Lightweight view for compact grids/cards.
 * Use to tighten prop contracts on feature UI components if you like.
 */
export type StoreCardView = Pick<
  Store,
  | "id"
  | "slug"
  | "name"
  | "category"
  | "openStatus"
  | "stockStatus"
  | "delivery"
  | "featuredPrice"
  | "rating"
  | "tags"
>;

/* ========= FUTURE ACTION TYPES (optional, for central state) ========= */
export type StoreAction =
  | { type: "VIEW_STORE"; storeId: string }
  | { type: "ADD_TO_CART"; storeId: string }
  | { type: "FAVORITE_STORE"; storeId: string };