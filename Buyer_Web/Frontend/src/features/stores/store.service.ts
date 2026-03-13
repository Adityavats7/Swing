

import type {
  Store,
  StoreSearchParams,
  NearbyStoresResponse,
} from "./types/types";

/* ---------------------------------
 * MOCK DATA (TEMPORARY)
 * ---------------------------------
 * This simulates backend response.
 * Later this will be replaced by real API calls.
 */

const MOCK_STORES: Store[] = [
  {
    id: "s1",
    slug: "freshkart-sector-43",
    name: "FreshKart Sector 43",
    description: "Fresh groceries, dairy, and daily essentials",
    category: "GROCERY",
    tags: ["FAST_DELIVERY", "TOP_RATED"],
    location: { latitude: 28.4595, longitude: 77.0266 },
    openStatus: "OPEN",
    stockStatus: "IN_STOCK",
    delivery: {
      etaMins: 24,
      distanceKm: 1.2,
      deliveryFee: 20,
      freeDeliveryAbove: 199,
    },
    featuredPrice: { price: 129, mrp: 149, discountPercent: 13 },
    rating: { average: 4.5, totalRatings: 234 },
    isVerified: true,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s2",
    slug: "dailyneeds-sector-31",
    name: "DailyNeeds Sector 31",
    description: "Daily grocery and household items",
    category: "GENERAL",
    tags: ["BEST_PRICE"],
    location: { latitude: 28.4602, longitude: 77.0211 },
    openStatus: "OPEN",
    stockStatus: "LOW_STOCK",
    delivery: {
      etaMins: 22,
      distanceKm: 0.9,
      deliveryFee: 0,
    },
    featuredPrice: { price: 79, mrp: 99, discountPercent: 20 },
    rating: { average: 4.2, totalRatings: 112 },
    isVerified: true,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s3",
    slug: "apna-kirana-sector-46",
    name: "Apna Kirana Sector 46",
    description: "Local kirana store",
    category: "GENERAL",
    tags: ["LOCAL_FAVORITE"],
    location: { latitude: 28.4551, longitude: 77.0302 },
    openStatus: "CLOSED",
    stockStatus: "OUT_OF_STOCK",
    delivery: {
      etaMins: 30,
      distanceKm: 2.0,
      deliveryFee: 30,
    },
    featuredPrice: { price: 59 },
    rating: { average: 3.9, totalRatings: 56 },
    isVerified: false,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* ---------------------------------
 * UTILITY FUNCTIONS (PRIVATE)
 * --------------------------------- */

function applySearchFilters(
  stores: Store[],
  params?: StoreSearchParams
): Store[] {
  if (!params) return stores;

  let result = [...stores];

  if (params.query) {
    const q = params.query.toLowerCase();
    result = result.filter((s) =>
      s.name.toLowerCase().includes(q)
    );
  }

  if (params.category) {
    result = result.filter((s) => s.category === params.category);
  }

  if (params.openOnly) {
    result = result.filter((s) => s.openStatus === "OPEN");
  }

  if (params.maxDistanceKm !== undefined) {
    result = result.filter(
      (s) => s.delivery.distanceKm <= params.maxDistanceKm!
    );
  }

  if (params.tags?.length) {
    result = result.filter((s) =>
      params.tags!.every((t) => s.tags?.includes(t))
    );
  }

  return result;
}

/* ---------------------------------
 * PUBLIC SERVICE API
 * --------------------------------- */

/**
 * Get nearby stores
 * This is the ONLY function UI/hooks should call.
 */
export async function getNearbyStores(
  params?: StoreSearchParams
): Promise<NearbyStoresResponse> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 600));

  const filtered = applySearchFilters(MOCK_STORES, params);

  return {
    stores: filtered,
    total: filtered.length,
  };
}
