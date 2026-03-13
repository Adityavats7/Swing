import { NextResponse } from "next/server";

type Store = {
  id: string;
  name: string;
  distanceKm: number;
  etaMins: number;
  isOpen: boolean;
  featuredPrice?: { price: number; mrp?: number };
  stockQty: number;
};

const MOCK_STORES: Store[] = [
  { id: "s1", name: "FreshKart Sec-43", distanceKm: 1.2, etaMins: 24, isOpen: true,  featuredPrice: { price: 129, mrp: 149 }, stockQty: 12 },
  { id: "s2", name: "DailyNeeds Sec-31", distanceKm: 0.9, etaMins: 22, isOpen: true,  featuredPrice: { price: 79,  mrp: 99  }, stockQty: 3  },
  { id: "s3", name: "Apna Kirana Sec-46", distanceKm: 2.0, etaMins: 30, isOpen: false, featuredPrice: { price: 59,  mrp: 69  }, stockQty: 0  },
  { id: "s4", name: "GroceryHub Golf Course", distanceKm: 1.7, etaMins: 26, isOpen: true,  featuredPrice: { price: 199, mrp: 229 }, stockQty: 8  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const data = !q
    ? MOCK_STORES
    : MOCK_STORES.filter((s) => s.name.toLowerCase().includes(q));

  return NextResponse.json({ stores: data });
}