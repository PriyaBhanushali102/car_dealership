import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterForm() {
  const navigate = useNavigate();
  const { registerUser, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await registerUser(formData);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8 bg-gradient-to-br from-[#F8F5FF] via-[#F3EEFF] to-[#EEE8FF]">
      <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-[0_20px_60px_rgba(124,58,237,0.12)]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-violet-950">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join your dealership dashboard in seconds.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-300 disabled:opacity-60"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-600 hover:text-violet-800"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterForm;