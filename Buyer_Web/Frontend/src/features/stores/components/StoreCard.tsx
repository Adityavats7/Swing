import * as React from "react";

// Domain type
import type { Store } from "../types/types";

// Shared UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Price,
  StockPill,
  Button,
} from "@/shared_UI";

/**
 * StoreCard
 * --------------------------------
 * Feature-level UI component.
 *
 * Responsibilities:
 * - Display Store information
 * - Emit user actions
 *
 * Does NOT:
 * - Fetch data
 * - Manage global state
 * - Know routing or navigation
 */

export type StoreCardProps = {
  store: Store;

  // User interactions (delegated to page/controller)
  onViewStore?: (store: Store) => void;
  onQuickAdd?: (store: Store) => void;
};

export function StoreCard({
  store,
  onViewStore,
  onQuickAdd,
}: StoreCardProps) {
  const {
    name,
    description,
    openStatus,
    stockStatus,
    delivery,
    featuredPrice,
    rating,
    tags,
  } = store;

  const isOpen = openStatus === "OPEN";
  const canAdd = isOpen && stockStatus !== "OUT_OF_STOCK";

  return (
    <Card className="flex h-full flex-col">
      {/* HEADER */}
      <CardHeader className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle className="truncate">{name}</CardTitle>

          {description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        <Badge variant={isOpen ? "success" : "danger"}>
          {isOpen ? "Open" : "Closed"}
        </Badge>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="flex-1 space-y-3 text-sm text-gray-700">
        {/* Distance & ETA */}
        <div className="flex items-center gap-2 text-gray-600">
          <span>{delivery.distanceKm.toFixed(1)} km</span>
          <span>•</span>
          <span>ETA {delivery.etaMins} min</span>
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 text-amber-600">
            <span>⭐</span>
            <span className="font-medium">
              {rating.average.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({rating.totalRatings})
            </span>
          </div>
        )}

        {/* Featured price */}
        {featuredPrice && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Popular item:
            </span>
            <Price
              price={featuredPrice.price}
              mrp={featuredPrice.mrp}
            />
          </div>
        )}

        {/* Stock status */}
        <div>
          <StockPill
            stockQty={
              stockStatus === "OUT_OF_STOCK"
                ? 0
                : stockStatus === "LOW_STOCK"
                ? 3
                : 10
            }
          />
        </div>

        {/* Tags (optional) */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="info">
                {tag.replace("_", " ")}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="mt-auto flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => onViewStore?.(store)}
        >
          View
        </Button>

        <Button
          disabled={!canAdd}
          onClick={() => onQuickAdd?.(store)}
        >
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}