import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CATEGORY_CONFIG = {
  Sedan: {
    gradient: "from-violet-500 to-purple-600",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
  SUV: {
    gradient: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  Hatchback: {
    gradient: "from-amber-400 to-orange-500",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  Truck: {
    gradient: "from-orange-500 to-red-600",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  Coupe: {
    gradient: "from-blue-500 to-indigo-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  Convertible: {
    gradient: "from-rose-500 to-pink-600",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

const RestockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock, isPurchasing, isRestocking, animIndex = 0 }) {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";
  const config = CATEGORY_CONFIG[vehicle.category] || CATEGORY_CONFIG.Sedan;

  const isOutOfStock = vehicle.quantity === 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  const stockBadge = isOutOfStock
    ? { label: "Out of Stock", cls: "bg-red-100 text-red-600 border-red-200" }
    : isLowStock
    ? { label: `Only ${vehicle.quantity} left`, cls: "bg-amber-100 text-amber-700 border-amber-200" }
    : { label: `${vehicle.quantity} in stock`, cls: "bg-emerald-100 text-emerald-700 border-emerald-200" };

  // ── Restock inline state ──────────────────────────────────────────────────
  const [showRestock, setShowRestock] = useState(false);
  const [restockQty, setRestockQty] = useState(1);

  const handleRestockConfirm = async () => {
    if (restockQty < 1) return;
    await onRestock(vehicle._id, restockQty);
    setShowRestock(false);
    setRestockQty(1);
  };

  const increment = () => setRestockQty((q) => q + 1);
  const decrement = () => setRestockQty((q) => Math.max(1, q - 1));

  return (
    <div
  className="card-animate bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-6"
>
      

      {/* ── Card body ── */}
      <div className="p-5 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${config.badge}`}>
            {vehicle.category}
          </span>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${stockBadge.cls}`}>
            {stockBadge.label}
          </span>
        </div>

        {/* Make & Model */}
        <h3 className="text-lg font-extrabold text-slate-900 leading-tight mb-1">
          {vehicle.make} <span className="text-slate-600 font-semibold">{vehicle.model}</span>
        </h3>

        {/* Price */}
        <p className="text-2xl font-extrabold text-violet-600 mt-1 mb-4">
          ${vehicle.price.toLocaleString()}
        </p>

        {/* Purchase button */}
        <button
          onClick={() => isAuthenticated && !isOutOfStock && !isPurchasing && onPurchase(vehicle._id)}
          disabled={isOutOfStock || isPurchasing || !isAuthenticated}
          className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
            isOutOfStock || !isAuthenticated
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : isPurchasing
              ? "bg-violet-400 text-white cursor-wait"
              : "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 active:scale-95"
          }`}
        >
          {isPurchasing ? "Processing…" : !isAuthenticated ? "Login to Purchase" : isOutOfStock ? "Out of Stock" : "Purchase Now"}
        </button>
      </div>

      {isAdmin && (
        <div className="flex flex-col gap-3 pt-2">

          {/* Edit / Delete row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(vehicle); }}
              className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 py-3 text-violet-700 hover:bg-violet-100 transition text-sm font-semibold"
            >
              <EditIcon />
              Edit
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onDelete(vehicle); }}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-red-600 hover:bg-red-100 transition text-sm font-semibold"
            >
              <TrashIcon />
              Delete
            </button>
          </div>

          {/* Restock toggle button */}
          {!showRestock ? (
            <button
              onClick={() => setShowRestock(true)}
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-emerald-700 hover:bg-emerald-100 transition text-sm font-semibold"
            >
              <RestockIcon />
              Restock
            </button>
          ) : (
            /* Inline restock panel */
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-emerald-700 text-center tracking-wide uppercase">
                Add units to stock
              </p>

              {/* Quantity stepper */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={decrement}
                  disabled={restockQty <= 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-emerald-200 text-emerald-700 font-bold text-lg hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  −
                </button>
                <span className="w-12 text-center text-xl font-extrabold text-emerald-800 select-none">
                  {restockQty}
                </span>
                <button
                  onClick={increment}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-emerald-200 text-emerald-700 font-bold text-lg hover:bg-emerald-100 transition"
                >
                  +
                </button>
              </div>

              {/* Confirm / Cancel */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setShowRestock(false); setRestockQty(1); }}
                  className="py-2 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestockConfirm}
                  disabled={isRestocking}
                  className="py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-wait transition shadow-md shadow-emerald-200"
                >
                  {isRestocking ? "Saving…" : `Confirm +${restockQty}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VehicleCard;

