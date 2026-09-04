import { CATEGORIES, LOCATIONS } from "../data/mockData";

const selectClass =
  "w-full border border-ink/15 bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf";

export default function SearchFilterBar({ filters, onChange }) {
  const update = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="bg-white border border-ink/10 p-5 grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-4">
      <div>
        <label htmlFor="search" className="block text-xs font-semibold text-ink-soft mb-1.5">
          Search food
        </label>
        <input
          id="search"
          type="text"
          placeholder="Rice, bread, pastries…"
          value={filters.search}
          onChange={update("search")}
          className={selectClass}
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-xs font-semibold text-ink-soft mb-1.5">
          Location
        </label>
        <select id="location" value={filters.location} onChange={update("location")} className={selectClass}>
          <option value="">All locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-xs font-semibold text-ink-soft mb-1.5">
          Food type
        </label>
        <select id="category" value={filters.category} onChange={update("category")} className={selectClass}>
          <option value="">All types</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="price" className="block text-xs font-semibold text-ink-soft mb-1.5">
          Price
        </label>
        <select id="price" value={filters.price} onChange={update("price")} className={selectClass}>
          <option value="">All</option>
          <option value="free">Free</option>
          <option value="discounted">Discounted</option>
        </select>
      </div>
    </div>
  );
}
