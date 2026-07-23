import { useState, useEffect, useCallback } from "react";

const CATEGORIES = ["Sedan", "SUV", "Hatchback", "Truck", "Coupe", "Convertible"];

const SearchIcon = () => (
  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

function SearchFilterBar({ onSearch, onClear }) {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const buildParams = useCallback(() => {
    const params = {};
    if (searchText.trim()) params.make = searchText.trim();
    if (category !== "All") params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    return params;
  }, [searchText, category, minPrice, maxPrice]);

  // Debounced auto-search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = buildParams();
      if (Object.keys(params).length > 0) {
        onSearch(params);
      } else {
        onClear();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText, category, minPrice, maxPrice]); // eslint-disable-line

  const handleClear = () => {
    setSearchText("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    onClear();
  };

  const hasFilters = searchText || category !== "All" || minPrice || maxPrice;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-8">
      <div className="flex flex-wrap gap-3 items-center">

        {/* Search input */}
        <div className="relative flex-1 min-w-[180px]">
          <SearchIcon />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by make…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-sm"
          />
        </div>

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-sm bg-white text-slate-700 min-w-[140px]"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Price range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min $"
            min="0"
            className="w-24 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-sm"
          />
          <span className="text-slate-400 text-sm">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max $"
            min="0"
            className="w-24 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-sm"
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={handleClear}
            className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all duration-200 whitespace-nowrap"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchFilterBar;
