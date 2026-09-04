import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFood } from "../context/FoodContext";

const inputClass =
  "w-full border bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf";

export default function ClaimFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { listings, loading, claimListing } = useFood();

  const listing = listings.find((l) => l.id === id);

  const [quantity, setQuantity] = useState(() => (listing ? Math.min(1, listing.quantityAvailable || 1) : 1));
  const [name, setName] = useState(() => currentUser?.name || "");
  const [phone, setPhone] = useState(() => currentUser?.phone || "");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [claim, setClaim] = useState(null);

  if (loading) {
    return <p className="max-w-2xl mx-auto px-5 py-16 text-ink-soft">Loading…</p>;
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-2xl">Listing not found</h1>
        <p className="mt-2 text-ink-soft">This food may have already been fully claimed or removed.</p>
        <Link to="/find" className="mt-6 inline-block text-sm font-semibold text-leaf-deep hover:underline">
          ← Back to Find Food
        </Link>
      </div>
    );
  }

  // Gatekeeper: Require login to claim food
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-5 py-16 text-center">
        <div className="ticket p-8 sm:p-10">
          <p className="text-4xl" aria-hidden="true">🔒</p>
          <span className="mt-3 inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-turmeric-deep bg-turmeric-light">
            Sign In Required to Claim
          </span>
          <h1 className="mt-3 font-display text-2xl">Sign in to reserve "{listing.foodName}"</h1>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            To prevent food waste and ensure pickup commitments are honored, reservations are
            reserved for signed-in members.
          </p>

          <div className="mt-5 p-4 bg-paper/60 border border-ink/10 text-left text-xs space-y-1.5">
            <p><span className="font-semibold">Provider:</span> {listing.businessName}</p>
            <p><span className="font-semibold">Available:</span> {listing.quantityAvailable} {listing.unit}</p>
            <p><span className="font-semibold">Pickup:</span> {listing.location} (before {listing.pickupDeadline})</p>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to={`/login?redirect=/claim/${listing.id}`}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
            >
              Sign In to Claim
            </Link>
            <Link
              to="/find"
              className="px-6 py-2.5 text-sm font-semibold border border-ink/20 hover:border-ink/40 transition-colors"
            >
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const result = await claimListing(listing.id, {
        quantity,
        name: name.trim() || currentUser.name,
        phone: phone.trim() || currentUser.phone,
        userId: currentUser?.id,
      });
      setClaim({ ...result, listing });
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  }

  if (claim) {
    return (
      <div className="max-w-lg mx-auto px-5 py-16">
        <div className="ticket p-8 text-center">
          <p className="text-4xl" aria-hidden="true">✅</p>
          <h1 className="mt-3 font-display text-2xl">Food successfully reserved!</h1>

          <dl className="mt-8 text-left space-y-4 border-t border-dashed border-ink/15 pt-6">
            <Row label="Reservation ID" value={claim.id} />
            <Row label="Food" value={listing.foodName} />
            <Row label="Quantity" value={`${claim.quantity} ${listing.unit}`} />
            <Row label="Pickup from" value={`${listing.businessName}, ${listing.location}`} />
            <Row label="Pickup before" value={listing.pickupDeadline} />
            <Row label="Reserved by" value={claim.name} />
          </dl>

          <div className="mt-8 flex justify-center gap-3">
            <Link to="/find" className="px-5 py-2.5 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep">
              Find more food
            </Link>
            <Link to="/" className="px-5 py-2.5 text-sm font-semibold border border-ink/20 hover:border-ink/40">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const maxQty = listing.quantityAvailable;

  return (
    <div className="max-w-xl mx-auto px-5 sm:px-8 py-12">
      <button onClick={() => navigate(-1)} type="button" className="text-sm font-semibold text-leaf-deep hover:underline">
        ← Back
      </button>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-3xl">{listing.foodName}</h1>
        <span className="text-xs bg-leaf-light text-leaf-deep px-2.5 py-1 font-semibold">
          Signed in as {currentUser.name}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-sm text-ink-soft">
        <p>{maxQty} {listing.unit} available</p>
        <p><span aria-hidden="true">📍</span> {listing.location}</p>
        <p><span aria-hidden="true">⏰</span> Pickup before {listing.pickupDeadline}</p>
        <p>Provider: <span className="font-semibold text-ink">{listing.businessName}</span></p>
      </div>

      <form onSubmit={handleConfirm} noValidate className="mt-8 space-y-5 border-t border-ink/10 pt-8">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Quantity to claim</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 border border-ink/20 text-lg leading-none hover:border-ink/40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              className="w-10 h-10 border border-ink/20 text-lg leading-none hover:border-ink/40"
              aria-label="Increase quantity"
            >
              +
            </button>
            <span className="text-sm text-ink-soft">of {maxQty} {listing.unit}</span>
          </div>
          {errors.quantity && <p className="mt-1.5 text-sm text-clay-deep">⚠️ {errors.quantity}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass + (errors.name ? " border-clay" : " border-ink/15")}
            placeholder="Your full name"
          />
          {errors.name && <p className="mt-1.5 text-sm text-clay-deep">⚠️ {errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Contact Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass + (errors.phone ? " border-clay" : " border-ink/15")}
            placeholder="07X XXX XXXX"
          />
          {errors.phone && <p className="mt-1.5 text-sm text-clay-deep">⚠️ {errors.phone}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting || maxQty === 0}
          className="w-full py-3 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors disabled:opacity-60"
        >
          {submitting ? "Confirming…" : "Confirm claim"}
        </button>
      </form>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}
