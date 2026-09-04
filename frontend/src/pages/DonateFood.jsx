import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFood } from "../context/FoodContext";
import { CATEGORIES } from "../data/mockData";

const initialForm = {
  businessName: "",
  foodName: "",
  category: "",
  quantity: "",
  unit: "portions",
  location: "",
  pickupDeadline: "",
  price: "free",
  discountLabel: "",
  description: "",
};

const inputClass =
  "w-full border bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf";

export default function DonateFood() {
  const { currentUser, isAuthenticated } = useAuth();
  const { addListing } = useFood();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    businessName: currentUser?.businessName || currentUser?.name || "",
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [posted, setPosted] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const listing = await addListing({
        ...form,
        donorId: currentUser?.id || null,
      });
      setPosted(listing);
      setForm({
        ...initialForm,
        businessName: currentUser?.businessName || currentUser?.name || "",
      });
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  }

  // Gatekeeper: Only logged-in users can post surplus food
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <div className="ticket p-8 sm:p-10">
          <p className="text-4xl" aria-hidden="true">🍱</p>
          <span className="mt-4 inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf-deep bg-leaf-light">
            Food Donor Registration Required
          </span>
          <h1 className="mt-3 font-display text-3xl">Sign in to donate food</h1>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-md mx-auto">
            To ensure food quality, safety, and traceability for our community, only registered
            accounts can post surplus food donations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/login?redirect=/donate"
              className="px-6 py-3 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
            >
              Sign In / Register as Donor
            </Link>
            <Link
              to="/"
              className="px-6 py-3 text-sm font-semibold border border-ink/20 hover:border-ink/40 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (posted) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center">
        <div className="ticket p-8 sm:p-10">
          <p className="text-4xl" aria-hidden="true">✅</p>
          <h1 className="mt-4 font-display text-3xl">Food posted successfully!</h1>
          <p className="mt-2 text-ink-soft">
            "{posted.foodName}" is now live and visible to people searching nearby.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/my-donations"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep"
            >
              Manage in My Donations
            </Link>
            <Link
              to="/find"
              className="px-5 py-2.5 text-sm font-semibold border border-ink/20 hover:border-ink/40"
            >
              View all listings
            </Link>
            <button
              type="button"
              onClick={() => setPosted(null)}
              className="px-5 py-2.5 text-sm font-semibold text-ink-soft hover:text-ink"
            >
              + Post another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-leaf-deep">
            Post Surplus
          </span>
          <h1 className="font-display text-4xl mt-1">Post surplus food</h1>
        </div>
        <Link
          to="/my-donations"
          className="text-xs font-semibold text-leaf-deep hover:underline"
        >
          View past donations →
        </Link>
      </div>
      <p className="mt-3 text-ink-soft">
        Tell us what you have left, and where and when it can be picked up.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
        <Field label="Business / Provider name" error={errors.businessName}>
          <input
            type="text"
            value={form.businessName}
            onChange={set("businessName")}
            className={inputClass + fieldBorder(errors.businessName)}
            placeholder="e.g. ABC Restaurant"
          />
        </Field>

        <Field label="Food name" error={errors.foodName}>
          <input
            type="text"
            value={form.foodName}
            onChange={set("foodName")}
            className={inputClass + fieldBorder(errors.foodName)}
            placeholder="e.g. Rice & Curry"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Food category" error={errors.category}>
            <select value={form.category} onChange={set("category")} className={inputClass + fieldBorder(errors.category)}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Unit">
            <select value={form.unit} onChange={set("unit")} className={inputClass + " border-ink/15"}>
              <option value="portions">Portions</option>
              <option value="items">Items</option>
              <option value="kg">Kilograms</option>
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Quantity" error={errors.quantity}>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={set("quantity")}
              className={inputClass + fieldBorder(errors.quantity)}
              placeholder="e.g. 15"
            />
          </Field>

          <Field label="Pickup deadline" error={errors.pickupDeadline}>
            <input
              type="text"
              value={form.pickupDeadline}
              onChange={set("pickupDeadline")}
              className={inputClass + fieldBorder(errors.pickupDeadline)}
              placeholder="e.g. 8:00 PM"
            />
          </Field>
        </div>

        <Field label="Location" error={errors.location}>
          <input
            type="text"
            value={form.location}
            onChange={set("location")}
            className={inputClass + fieldBorder(errors.location)}
            placeholder="e.g. Negombo"
          />
        </Field>

        <Field label="Price">
          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="price" checked={form.price === "free"} onChange={() => setForm((f) => ({ ...f, price: "free" }))} />
              Free
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="price" checked={form.price === "discounted"} onChange={() => setForm((f) => ({ ...f, price: "discounted" }))} />
              Discounted
            </label>
          </div>
        </Field>

        {form.price === "discounted" && (
          <Field label="Discount label" error={errors.discountLabel}>
            <input
              type="text"
              value={form.discountLabel}
              onChange={set("discountLabel")}
              className={inputClass + fieldBorder(errors.discountLabel)}
              placeholder="e.g. 50% OFF"
            />
          </Field>
        )}

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={4}
            className={inputClass + " border-ink/15"}
            placeholder="Anything a claimer should know — ingredients, packaging, allergens…"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post food"}
        </button>
      </form>
    </div>
  );
}

function fieldBorder(error) {
  return error ? " border-clay" : " border-ink/15";
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-clay-deep">⚠️ {error}</p>}
    </div>
  );
}
