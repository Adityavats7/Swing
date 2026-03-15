import type {
  Store,
  StoreSearchParams,
  PagedStoresResponse,
  StoreSortBy,
  SortDirection,
} from "./types/types";

const BASE_STORES: Store[] = [
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
    delivery: { etaMins: 24, distanceKm: 1.2, deliveryFee: 20, freeDeliveryAbove: 199 },
    featuredPrice: { price: 129, mrp: 149, discountPercent: 13 },
    rating: { average: 4.5, totalRatings: 234 },
    isVerified: true,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    delivery: { etaMins: 22, distanceKm: 0.9, deliveryFee: 0 },
    featuredPrice: { price: 79, mrp: 99, discountPercent: 20 },
    rating: { average: 4.2, totalRatings: 112 },
    isVerified: true,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    delivery: { etaMins: 30, distanceKm: 2.0, deliveryFee: 30 },
    featuredPrice: { price: 59 },
    rating: { average: 3.9, totalRatings: 56 },
    isVerified: false,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function buildMock(count: number): Store[] {
  const out: Store[] = [];
  for (let i = 0; i < count; i++) {
    const base = BASE_STORES[i % BASE_STORES.length];
    const idx = i + 1;
    const vary = (n: number, d: number) => Math.max(0, n + ((idx % 5) - 2) * d);
    const varyPos = (n: number, d: number) => n + ((idx % 7) - 3) * d;
    const price = base.featuredPrice?.price ?? 100;
    const mrp = base.featuredPrice?.mrp ?? price + 20;
    const avg = base.rating?.average ?? 4;
    const ratings = base.rating?.totalRatings ?? 50;
    const open = idx % 9 !== 0;
    const stock: Store["stockStatus"] = idx % 11 === 0 ? "OUT_OF_STOCK" : idx % 6 === 0 ? "LOW_STOCK" : "IN_STOCK";
    out.push({
      ...base,
      id: `s${idx}`,
      slug: `${base.slug}-${idx}`,
      name: `${base.name} #${idx}`,
      openStatus: open ? "OPEN" : "CLOSED",
      stockStatus: stock,
      delivery: {
        etaMins: Math.round(vary(base.delivery.etaMins, 2)),
        distanceKm: Number(vary(base.delivery.distanceKm, 0.15).toFixed(2)),
        deliveryFee: base.delivery.deliveryFee,
        freeDeliveryAbove: base.delivery.freeDeliveryAbove
      },
      featuredPrice: { price: Math.round(vary(price, 3)), mrp: Math.round(vary(mrp, 5)) },
      rating: { average: Number(vary(avg, 0.1).toFixed(1)), totalRatings: ratings + (idx % 13) * 3 },
      location: { latitude: varyPos(base.location.latitude, 0.001), longitude: varyPos(base.location.longitude, 0.001) },
      updatedAt: new Date().toISOString()
    });
  }
  return out;
}

const MOCK_COUNT = Number(process.env.NEXT_PUBLIC_MOCK_STORE_COUNT ?? "30");
const MOCK_STORES: Store[] = buildMock(MOCK_COUNT);

function getSortKey(store: Store, sortBy: StoreSortBy): number {
  switch (sortBy) {
    case "DISTANCE":
      return store.delivery.distanceKm ?? Number.POSITIVE_INFINITY;
    case "ETA":
      return store.delivery.etaMins ?? Number.POSITIVE_INFINITY;
    case "RATING":
      return typeof store.rating?.average === "number" ? store.rating.average : Number.NEGATIVE_INFINITY;
    case "PRICE":
      return typeof store.featuredPrice?.price === "number" ? store.featuredPrice.price : Number.POSITIVE_INFINITY;
    case "RELEVANCE":
    default:
      return 0;
  }
}

function sortStores(stores: Store[], sortBy?: StoreSortBy, sortDir?: SortDirection): Store[] {
  if (!sortBy || sortBy === "RELEVANCE") return stores;
  const dir = sortDir ?? (sortBy === "RATING" ? "DESC" : "ASC");
  const sorted = [...stores].sort((a, b) => {
    const ka = getSortKey(a, sortBy);
    const kb = getSortKey(b, sortBy);
    if (ka === kb) return 0;
    return ka < kb ? -1 : 1;
  });
  if (dir === "DESC") sorted.reverse();
  return sorted;
}

function applySearchFilters(stores: Store[], params?: StoreSearchParams): Store[] {
  if (!params) return stores;
  let result = [...stores];
  if (params.query) {
    const q = params.query.toLowerCase();
    result = result.filter((s) => s.name.toLowerCase().includes(q));
  }
  if (params.category) {
    result = result.filter((s) => s.category === params.category);
  }
  if (params.openOnly) {
    result = result.filter((s) => s.openStatus === "OPEN");
  }
  if (params.maxDistanceKm != null) {
  result = result.filter((s) => s.delivery.distanceKm <= params.maxDistanceKm);
}
  if (params.tags?.length) {
    result = result.filter((s) => params.tags!.every((t) => s.tags?.includes(t)));
  }
  return result;
}

export async function getNearbyStores(params?: StoreSearchParams): Promise<PagedStoresResponse> {
  await new Promise((res) => setTimeout(res, 200));
  const filtered = applySearchFilters(MOCK_STORES, params);
  const sorted = sortStores(filtered, params?.sortBy, params?.sortDir);
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.max(1, params?.pageSize ?? 12);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = sorted.slice(start, end);
  return { stores: items, total: filtered.length, page, pageSize, hasMore: end < filtered.length };
}