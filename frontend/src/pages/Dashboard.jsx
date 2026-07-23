import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useVehicles } from "../context/VehicleContext";
import { useToast } from "../context/ToastContext";
import VehicleCard from "../components/VehicleCard";
import SearchFilterBar from "../components/SearchFilterBar";
import VehicleFormModal from "../components/VehicleFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

// ── Spinner 
const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    <p className="text-slate-400 text-sm font-medium">Loading vehicles…</p>
  </div>
);

// ── Stats card 
const StatCard = ({ label, value, color }) => {
  const colors = {
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-red-50 text-red-600 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <div className={`rounded-2xl border px-5 py-4 ${colors[color]}`}>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs font-semibold mt-0.5 opacity-80">{label}</p>
    </div>
  );
};

// ── Plus icon 
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

// ── Dashboard 
function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    vehicles, isLoading, error,
    fetchVehicles, searchVehicles,
    addVehicle, editVehicle, removeVehicle, purchaseVehicle, restockVehicle,
  } = useVehicles();
  const { addToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [purchasingId, setPurchasingId] = useState(null);
  const [restockingId, setRestockingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  // ── Fetch vehicles for everyone 
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // ── Handlers 
  const handleSearch = useCallback((params) => searchVehicles(params), [searchVehicles]);
  const handleClear = useCallback(() => fetchVehicles(), [fetchVehicles]);

  const handlePurchase = async (id) => {
    setPurchasingId(id);
    try {
      await purchaseVehicle(id);
      addToast("Purchase successful! Enjoy your new vehicle. 🎉", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Purchase failed", "error");
    } finally {
      setPurchasingId(null);
    }
  };

  const handleRestock = async (id, quantity) => {
    setRestockingId(id);
    try {
      await restockVehicle(id, quantity);
      addToast(`Restocked successfully! (+${quantity} units) 📦`, "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Restock failed", "error");
    } finally {
      setRestockingId(null);
    }
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingVehicle) {
        await editVehicle(editingVehicle._id, data);
        addToast("Vehicle updated successfully!", "success");
      } else {
        await addVehicle(data);
        addToast("Vehicle added to inventory!", "success");
      }
      setShowForm(false);
      setEditingVehicle(null);
    } catch (err) {
      addToast(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await removeVehicle(deletingVehicle._id);
      addToast(`${deletingVehicle.make} ${deletingVehicle.model} removed.`, "success");
      setDeletingVehicle(null);
    } catch (err) {
      addToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = {
    total: vehicles.length,
    inStock: vehicles.filter((v) => v.quantity > 0).length,
    outOfStock: vehicles.filter((v) => v.quantity === 0).length,
    categories: new Set(vehicles.map((v) => v.category)).size,
  };

  // ── Auth loading (session restore) ──────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Vehicle Inventory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAuthenticated ? (
              <>
                Welcome back, <span className="font-semibold text-violet-600">{user?.name}</span>
              </>
            ) : (
              "Browse our latest inventory and purchase vehicles instantly."
            )}
          </p>
        </div>

        {/* Admin: Add vehicle */}
        {isAdmin && (
          <button
            onClick={() => { setEditingVehicle(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white font-bold text-sm rounded-2xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 whitespace-nowrap"
          >
            <PlusIcon />
            Add Vehicle
          </button>
        )}
      </div>

      {/* ── Stats bar ── */}
      {vehicles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total Vehicles" value={stats.total} color="violet" />
          <StatCard label="In Stock" value={stats.inStock} color="emerald" />
          <StatCard label="Out of Stock" value={stats.outOfStock} color="red" />
          <StatCard label="Categories" value={stats.categories} color="blue" />
        </div>
      )}

      {/* ── Search & Filter ── */}
      <SearchFilterBar onSearch={handleSearch} onClear={handleClear} />

      {/* ── Loading ── */}
      {isLoading && <Spinner />}

      {/* ── Error ── */}
      {error && !isLoading && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-slate-600 font-medium mb-4">{error}</p>
          <button
            onClick={fetchVehicles}
            className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-2xl hover:bg-violet-700 transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !error && vehicles.length === 0 && (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No vehicles found</h3>
          <p className="text-slate-400 text-sm">
            {isAdmin ? "Add your first vehicle using the button above." : "Try adjusting your search or filters."}
          </p>
        </div>
      )}

      {/* ── Vehicle grid ── */}
      {!isLoading && vehicles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle, idx) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              animIndex={idx}
              onPurchase={handlePurchase}
              onEdit={(v) => { setEditingVehicle(v); setShowForm(true); }}
              onDelete={setDeletingVehicle}
              onRestock={handleRestock}
              isPurchasing={purchasingId === vehicle._id}
              isRestocking={restockingId === vehicle._id}
            />
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <VehicleFormModal
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditingVehicle(null); }}
          isLoading={formLoading}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deletingVehicle && (
        <DeleteConfirmModal
          vehicle={deletingVehicle}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingVehicle(null)}
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
}

export default Dashboard;
