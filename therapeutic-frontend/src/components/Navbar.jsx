import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, LogOut, LayoutDashboard, Activity, ClipboardList, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";



export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: "/recommend", label: "Recommend", icon: <ClipboardList className="w-4 h-4" /> },
    { to: "/tracker", label: "Tracker", icon: <Activity className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-cyan-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Neura<span className="text-cyan-400">Pulse</span>
            </span>
          </Link>

          {/* Center nav (authenticated only) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-cyan-400/10 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center">
                    <span className="text-cyan-400 text-xs font-bold">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">{user?.fullName || "User"}</span>
                </div>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-cyan-400 hover:bg-cyan-300 text-gray-950 transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
// Add this at the very bottom of Navbar.jsx
export const BrandIcon = () => (
  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)]">
    <Zap className="w-4 h-4 text-cyan-400" />
  </div>
);
