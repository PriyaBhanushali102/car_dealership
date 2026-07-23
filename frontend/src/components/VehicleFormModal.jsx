import { useState, useEffect } from "react";

const CATEGORIES = ["Sedan", "SUV", "Hatchback", "Truck", "Coupe", "Convertible"];
const EMPTY_FORM = { make: "", model: "", category: "Sedan", price: "", quantity: "" };

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function VehicleFormModal({ vehicle, onSubmit, onClose, isLoading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEditing = !!vehicle;

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Pre-fill form when editing
  useEffect(() => {
    if (vehicle) {
      setForm({
        make: vehicle.make || "",
        model: vehicle.model || "",
        category: vehicle.category || "Sedan",
        price: vehicle.price ?? "",
        quantity: vehicle.quantity ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 outline-none transition-all text-sm text-slate-800 placeholder-slate-400";
  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="animate-fade-in-up relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditing ? "Update the vehicle details below" : "Fill in the vehicle details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <label className={labelCls}>Make</label>
              <input name="make" value={form.make} onChange={handleChange}
                placeholder="e.g. Toyota" required className={inputCls} />
            </div>
            {/* Model */}
            <div>
              <label className={labelCls}>Model</label>
              <input name="model" value={form.model} onChange={handleChange}
                placeholder="e.g. Camry" required className={inputCls} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className={inputCls + " bg-white"}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className={labelCls}>Price ($)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange}
                placeholder="28500" required min="0" className={inputCls} />
            </div>
            {/* Quantity */}
            <div>
              <label className={labelCls}>Quantity</label>
              <input name="quantity" type="number" value={form.quantity} onChange={handleChange}
                placeholder="10" required min="0" className={inputCls} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving…" : isEditing ? "Save Changes" : "Add Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VehicleFormModal;
