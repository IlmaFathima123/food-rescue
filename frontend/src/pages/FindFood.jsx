import { useMemo, useState } from "react";
import { useFood } from "../context/FoodContext";
import SearchFilterBar from "../components/SearchFilterBar";
import FoodCard from "../components/FoodCard";

const EMPTY_FILTERS = { search: "", location: "", category: "", price: "" };

export default function FindFood() {
  const { listings, loading } = useFood();
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return listings.filter((l) => {
      if (search) {
        const haystack = `${l.foodName} ${l.businessName}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (filters.location && l.location !== filters.location) return false;
      if (filters.category && l.category !== filters.category) return false;
      if (filters.price && l.price !== filters.price) return false;
      return true;
    });
  }, [listings, filters]);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-4xl">Find food</h1>
      <p className="mt-3 text-ink-soft max-w-lg">
        Browse surplus food currently listed by businesses near you.
      </p>

      <div className="mt-8">
        <SearchFilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {loading ? "Loading listings…" : `${filtered.length} listing${filtered.length === 1 ? "" : "s"} found`}
        </p>
        {(filters.search || filters.location || filters.category || filters.price) && (
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="text-sm font-semibold text-leaf-deep hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((listing) => (
          <FoodCard key={listing.id} listing={listing} />
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="mt-12 border border-dashed border-ink/20 px-6 py-16 text-center">
          <p className="font-display text-xl">No listings match those filters</p>
          <p className="mt-2 text-sm text-ink-soft">Try a different location, type or price, or check back later.</p>
        </div>
      )}
    </div>
  );
}
