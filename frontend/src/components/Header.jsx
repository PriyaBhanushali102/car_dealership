import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CarLogo = () => (
  <svg className="w-7 h-7 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Left: Logo + Brand ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-violet-50 rounded-xl group-hover:bg-violet-100 transition-colors duration-200">
              <CarLogo />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Precision
              </span>
              <span className="text-xl font-extrabold text-violet-600 tracking-tight">
                Auto
              </span>
            </div>
          </Link>

          {/* ── Right: Auth section ── */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Role badge */}
                <span
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                    isAdmin
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-violet-50 text-violet-700 border-violet-200"
                  }`}
                >
                  <span>{isAdmin ? "👑" : "👤"}</span>
                  <span className="capitalize">{user?.role}</span>
                </span>

                {/* User name */}
                <span className="hidden md:block text-sm font-semibold text-slate-700">
                  {user?.name}
                </span>

                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-offset-2 ${
                    isAdmin
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 ring-amber-300"
                      : "bg-gradient-to-br from-violet-500 to-purple-600 ring-violet-300"
                  }`}
                >
                  {getInitials(user?.name)}
                </div>

                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  className="ml-1 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-violet-700 border border-violet-200 rounded-xl hover:bg-violet-50 transition-all duration-200"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all duration-200 shadow-md shadow-violet-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
