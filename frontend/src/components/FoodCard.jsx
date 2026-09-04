import { Link } from "react-router-dom";
import Badge from "./Badge";

const CATEGORY_ICON = {
  "Rice & Curry": "🍛",
  "Bakery & Bread": "🍞",
  "Pastries & Desserts": "🍰",
  Produce: "🥕",
  "Dairy & Beverages": "🥛",
  Other: "🍽️",
};

export default function FoodCard({ listing }) {
  const isClaimed = listing.status === "claimed";
  const icon = CATEGORY_ICON[listing.category] || "🍽️";

  return (
    <div className="ticket flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl leading-snug">
          <span className="mr-1.5" aria-hidden="true">{icon}</span>
          {listing.foodName}
        </h3>
        {listing.price === "free" ? (
          <Badge variant="free">FREE</Badge>
        ) : (
          <Badge variant="discounted">{listing.discountLabel}</Badge>
        )}
      </div>

      <p className="mt-1 text-sm text-ink-soft">{listing.businessName}</p>

      <p className="mt-3 text-sm text-ink-soft leading-relaxed">{listing.description}</p>

      <div className="mt-4 space-y-1 text-sm">
        <p>
          <span aria-hidden="true">📍</span> {listing.location}
        </p>
        <p>
          <span aria-hidden="true">⏰</span> Pickup before {listing.pickupDeadline}
        </p>
        <p className="font-semibold">
          {isClaimed ? "Fully claimed" : `${listing.quantityAvailable} ${listing.unit} available`}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-dashed border-ink/15">
        {isClaimed ? (
          <span className="block w-full text-center py-2.5 text-sm font-semibold text-ink-soft bg-ink/5">
            No longer available
          </span>
        ) : (
          <Link
            to={`/claim/${listing.id}`}
            className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
          >
            Claim food
          </Link>
        )}
      </div>
    </div>
  );
}
