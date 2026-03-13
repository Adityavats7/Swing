

/* ---------------------------------
 * ENUMS & CONSTANT TYPES
 * --------------------------------- */

/**
 * Store operational status
 */
export type StoreOpenStatus = "OPEN" | "CLOSED" | "BUSY";

/**
 * Inventory health indicator
 */
export type StockStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";

/**
 * Store category/type
 * (extendable later)
 */
export type StoreCategory =
  | "GROCERY"
  | "PHARMACY"
  | "MEAT"
  | "BAKERY"
  | "ELECTRONICS"
  | "GENERAL";

/**
 * Store service capabilities
 */
export type StoreServiceTag =
  | "FAST_DELIVERY"
  | "BEST_PRICE"
  | "TOP_RATED"
  | "ORGANIC"
  | "LOCAL_FAVORITE";

/* ---------------------------------
 * VALUE OBJECTS
 * --------------------------------- */

/**
 * Geo location (for distance, maps, clustering)
 */
export type GeoLocation = {
  latitude: number;
  longitude: number;
};

/**
 * Delivery information
 */
export type DeliveryInfo = {
  etaMins: number;
  distanceKm: number;
  deliveryFee?: number;
  freeDeliveryAbove?: number;
};

/**
 * Price preview for a highlighted product
 */
export type FeaturedPrice = {
  price: number;
  mrp?: number;
  discountPercent?: number;
};

/**
 * Store rating summary
 */
export type StoreRating = {
  average: number;     // e.g. 4.5
  totalRatings: number;
};

/* ---------------------------------
 * CORE STORE ENTITY
 * --------------------------------- */

export type Store = {
  /* Identity */
  id: string;
  slug: string; // SEO & routing friendly (e.g. freshkart-sector-43)

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

  /* Availability */
  openStatus: StoreOpenStatus;
  stockStatus: StockStatus;

  /* Delivery */
  delivery: DeliveryInfo;

  /* Pricing Preview */
  featuredPrice?: FeaturedPrice;

  /* Ratings */
  rating?: StoreRating;

  /* Operational */
  isVerified: boolean;
  isEnabled: boolean;

  /* Timestamps */
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

/* ---------------------------------
 * API RESPONSE TYPES
 * --------------------------------- */

/**
 * Response for nearby stores API
 */
export type NearbyStoresResponse = {
  stores: Store[];
  total: number;
};

/**
 * Query parameters for store search
 */
export type StoreSearchParams = {
  query?: string;
  category?: StoreCategory;
  maxDistanceKm?: number;
  openOnly?: boolean;
  tags?: StoreServiceTag[];
};

/* ---------------------------------
 * UI‑FRIENDLY DERIVED TYPES
 * --------------------------------- */

/**
 * Lightweight store card view
 * (useful for lists, grids)
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

/* ---------------------------------
 * ACTION TYPES (FOR FUTURE STATE MGMT)
 * --------------------------------- */

export type StoreAction =
  | { type: "VIEW_STORE"; storeId: string }
  | { type: "ADD_TO_CART"; storeId: string }
  | { type: "FAVORITE_STORE"; storeId: string };
