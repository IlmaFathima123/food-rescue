import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFood } from "../context/FoodContext";
import Badge from "../components/Badge";
import { CATEGORIES } from "../data/mockData";

const inputClass =
  "w-full border bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf";

export default function MyDonations() {
  const { currentUser, isAuthenticated } = useAuth();
  const { listings, loading, updateListing, deleteListing } = useFood();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Edit modal state
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success message toast/banner
  const [feedback, setFeedback] = useState("");

  // Filter listings belonging to this donor:
  // Match either by donorId or matching businessName (case-insensitive)
  const myDonations = useMemo(() => {
    if (!currentUser) return [];
    const currentBiz = (currentUser.businessName || "").trim().toLowerCase();
    return listings.filter((l) => {
      const matchDonorId = l.donorId && l.donorId === currentUser.id;
      const matchBusiness = currentBiz && l.businessName?.trim().toLowerCase() === currentBiz;
      return matchDonorId || matchBusiness;
    });
  }, [listings, currentUser]);

  // Filtered by search & status
  const displayedDonations = useMemo(() => {
    return myDonations.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchFood = l.foodName.toLowerCase().includes(q);
        const matchDesc = (l.description || "").toLowerCase().includes(q);
        const matchLoc = l.location.toLowerCase().includes(q);
        return matchFood || matchDesc || matchLoc;
      }
      return true;
    });
  }, [myDonations, statusFilter, search]);

  // Overall donor metrics
  const totalPortions = myDonations.reduce((acc, l) => acc + (l.quantityTotal || 0), 0);
  const totalRescued = myDonations.reduce(
    (acc, l) => acc + ((l.quantityTotal || 0) - (l.quantityAvailable || 0)),
    0
  );
  const activeCount = myDonations.filter((l) => l.status === "available").length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <div className="ticket p-8">
          <p className="text-4xl" aria-hidden="true">🔒</p>
          <h1 className="mt-4 font-display text-2xl">Sign In to View Your Donations</h1>
          <p className="mt-2 text-ink-soft text-sm">
            Please log in with your donor account to view past donations, edit listings, and see pickup statuses.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/login?redirect=/my-donations"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/find"
              className="px-6 py-2.5 text-sm font-semibold border border-ink/20 hover:border-ink/40 transition-colors"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const openEdit = (listing) => {
    setEditingItem(listing);
    setEditForm({
      foodName: listing.foodName,
      category: listing.category,
      quantity: listing.quantityTotal,
      unit: listing.unit,
      location: listing.location,
      pickupDeadline: listing.pickupDeadline,
      price: listing.price,
      discountLabel: listing.discountLabel || "",
      description: listing.description || "",
    });
    setEditErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsUpdating(true);
    setEditErrors({});
    try {
      await updateListing(editingItem.id, editForm);
      setEditingItem(null);
      setFeedback(`"${editForm.foodName}" has been successfully updated.`);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      if (err.fieldErrors) {
        setEditErrors(err.fieldErrors);
      } else {
        setEditErrors({ general: err.message || "Failed to update listing." });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await deleteListing(deletingItem.id);
      const name = deletingItem.foodName;
      setDeletingItem(null);
      setFeedback(`"${name}" has been removed from listings.`);
      setTimeout(() => setFeedback(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to delete donation.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-leaf-deep">
            Donor Dashboard
          </span>
          <h1 className="font-display text-3xl sm:text-4xl mt-1">My Donations</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage your past and active surplus food posts for{" "}
            <span className="font-semibold text-ink">
              {currentUser.businessName || currentUser.name}
            </span>
          </p>
        </div>
        <Link
          to="/donate"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors shadow-sm self-start sm:self-auto"
        >
          + Post new food
        </Link>
      </div>

      {/* Notification Toast */}
      {feedback && (
        <div className="mt-6 p-3.5 bg-leaf-light border border-leaf/30 text-leaf-deep text-sm font-semibold flex items-center justify-between">
          <span>✅ {feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback("")}
            className="text-leaf-deep/70 hover:text-leaf-deep ml-3 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-ink/10">
          <p className="text-xs text-ink-soft uppercase font-semibold">Total Posts</p>
          <p className="font-display text-2xl sm:text-3xl text-ink mt-1">
            {myDonations.length}
          </p>
        </div>
        <div className="p-4 bg-white border border-ink/10">
          <p className="text-xs text-ink-soft uppercase font-semibold">Currently Active</p>
          <p className="font-display text-2xl sm:text-3xl text-leaf-deep mt-1">
            {activeCount}
          </p>
        </div>
        <div className="p-4 bg-white border border-ink/10">
          <p className="text-xs text-ink-soft uppercase font-semibold">Portions Claimed</p>
          <p className="font-display text-2xl sm:text-3xl text-turmeric-deep mt-1">
            {totalRescued}
          </p>
        </div>
        <div className="p-4 bg-white border border-ink/10">
          <p className="text-xs text-ink-soft uppercase font-semibold">Total Portions Offered</p>
          <p className="font-display text-2xl sm:text-3xl text-ink mt-1">
            {totalPortions}
          </p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
              statusFilter === "all"
                ? "bg-leaf text-white border-leaf"
                : "bg-white text-ink-soft border-ink/20 hover:border-ink/40"
            }`}
          >
            All ({myDonations.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("available")}
            className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
              statusFilter === "available"
                ? "bg-leaf text-white border-leaf"
                : "bg-white text-ink-soft border-ink/20 hover:border-ink/40"
            }`}
          >
            Available ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("claimed")}
            className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
              statusFilter === "claimed"
                ? "bg-leaf text-white border-leaf"
                : "bg-white text-ink-soft border-ink/20 hover:border-ink/40"
            }`}
          >
            Claimed ({myDonations.length - activeCount})
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search my donations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-ink/20 bg-white px-3 py-1.5 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf"
          />
        </div>
      </div>

      {/* Donations List */}
      {loading ? (
        <div className="py-16 text-center text-ink-soft text-sm">Loading your donations…</div>
      ) : displayedDonations.length === 0 ? (
        <div className="mt-8 p-12 text-center bg-white border border-ink/10">
          <p className="text-3xl mb-3" aria-hidden="true">🍲</p>
          <h3 className="font-display text-xl">No donations found</h3>
          <p className="mt-1 text-sm text-ink-soft max-w-md mx-auto">
            {myDonations.length === 0
              ? "You haven't posted any surplus food donations yet. Ready to share food and help your community?"
              : "No donations match your search filter."}
          </p>
          {myDonations.length === 0 && (
            <Link
              to="/donate"
              className="mt-5 inline-block px-5 py-2.5 text-sm font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors"
            >
              Post your first donation
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDonations.map((listing) => {
            const isClaimed = listing.status === "claimed";
            const claimedUnits = (listing.quantityTotal || 0) - (listing.quantityAvailable || 0);

            return (
              <div key={listing.id} className="ticket flex flex-col p-5 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                      {listing.category}
                    </span>
                    <h2 className="font-display text-xl leading-snug mt-0.5">
                      {listing.foodName}
                    </h2>
                  </div>
                  {listing.price === "free" ? (
                    <Badge variant="free">FREE</Badge>
                  ) : (
                    <Badge variant="discounted">{listing.discountLabel || "Discounted"}</Badge>
                  )}
                </div>

                <p className="mt-2 text-xs text-ink-soft line-clamp-2">
                  {listing.description || "No description provided."}
                </p>

                {/* Status and Quantities */}
                <div className="mt-4 pt-3 border-t border-ink/10 space-y-1.5 text-xs text-ink">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Status:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 text-[11px] uppercase ${
                        isClaimed
                          ? "bg-ink/10 text-ink-soft"
                          : "bg-leaf-light text-leaf-deep"
                      }`}
                    >
                      {isClaimed ? "Fully Claimed" : "Available"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Available:</span>
                    <span className="font-semibold">
                      {listing.quantityAvailable} of {listing.quantityTotal} {listing.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Claimed so far:</span>
                    <span className="font-semibold text-leaf-deep">
                      {claimedUnits} {listing.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Pickup before:</span>
                    <span className="font-semibold">{listing.pickupDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Location:</span>
                    <span className="font-semibold">{listing.location}</span>
                  </div>
                </div>

                {/* Actions: Edit & Delete */}
                <div className="mt-5 pt-3 border-t border-dashed border-ink/15 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(listing)}
                    className="flex-1 py-2 text-xs font-semibold text-ink border border-ink/20 hover:border-leaf hover:text-leaf-deep bg-paper/50 hover:bg-leaf-light/40 transition-colors flex items-center justify-center gap-1"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(listing)}
                    className="py-2 px-3 text-xs font-semibold text-clay-deep border border-clay/30 hover:bg-clay-light/60 transition-colors flex items-center justify-center gap-1"
                    title="Delete listing"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingItem && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-paper border border-ink/20 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <h2 className="font-display text-2xl">Edit Donation</h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-ink-soft hover:text-ink text-xl leading-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {editErrors.general && (
              <div className="mt-4 p-3 bg-clay-light text-clay-deep text-xs font-semibold">
                ⚠️ {editErrors.general}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Food Name</label>
                <input
                  type="text"
                  required
                  value={editForm.foodName}
                  onChange={(e) => setEditForm({ ...editForm, foodName: e.target.value })}
                  className={inputClass}
                />
                {editErrors.foodName && (
                  <p className="mt-1 text-xs text-clay-deep">⚠️ {editErrors.foodName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Unit</label>
                  <select
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className={inputClass}
                  >
                    <option value="portions">Portions</option>
                    <option value="items">Items</option>
                    <option value="kg">Kilograms</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Total Quantity
                    <span className="text-ink-soft font-normal ml-1">
                      (min {(editingItem.quantityTotal || 0) - (editingItem.quantityAvailable || 0)})
                    </span>
                  </label>
                  <input
                    type="number"
                    min={(editingItem.quantityTotal || 0) - (editingItem.quantityAvailable || 0)}
                    required
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                    className={inputClass}
                  />
                  {editErrors.quantity && (
                    <p className="mt-1 text-xs text-clay-deep">⚠️ {editErrors.quantity}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Pickup Deadline</label>
                  <input
                    type="text"
                    required
                    value={editForm.pickupDeadline}
                    onChange={(e) => setEditForm({ ...editForm, pickupDeadline: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. 8:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Price</label>
                <div className="flex gap-4 pt-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editPrice"
                      checked={editForm.price === "free"}
                      onChange={() => setEditForm({ ...editForm, price: "free" })}
                    />
                    Free
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="editPrice"
                      checked={editForm.price === "discounted"}
                      onChange={() => setEditForm({ ...editForm, price: "discounted" })}
                    />
                    Discounted
                  </label>
                </div>
              </div>

              {editForm.price === "discounted" && (
                <div>
                  <label className="block text-xs font-semibold mb-1">Discount Label</label>
                  <input
                    type="text"
                    value={editForm.discountLabel}
                    onChange={(e) => setEditForm({ ...editForm, discountLabel: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. 50% OFF"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className={inputClass}
                  placeholder="Details, allergens, freshness notes…"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold border border-ink/20 hover:border-ink/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 text-xs font-semibold text-white bg-leaf hover:bg-leaf-deep transition-colors disabled:opacity-60"
                >
                  {isUpdating ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-paper border border-ink/20 max-w-md w-full p-6 shadow-2xl">
            <h2 className="font-display text-xl text-clay-deep flex items-center gap-2">
              <span aria-hidden="true">⚠️</span> Delete Donation?
            </h2>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-ink">"{deletingItem.foodName}"</strong>?
              {((deletingItem.quantityTotal || 0) - (deletingItem.quantityAvailable || 0)) > 0 && (
                <span className="block mt-2 text-xs text-clay font-semibold">
                  Notice: {(deletingItem.quantityTotal || 0) - (deletingItem.quantityAvailable || 0)} {deletingItem.unit} have already been reserved by community members.
                </span>
              )}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 text-xs font-semibold border border-ink/20 hover:border-ink/40"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-clay hover:bg-clay-deep transition-colors disabled:opacity-60"
              >
                {isDeleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
