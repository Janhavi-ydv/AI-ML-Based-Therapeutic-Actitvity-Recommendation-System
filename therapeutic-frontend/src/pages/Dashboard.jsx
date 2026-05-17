import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Brain, Flame, Droplets, Moon, Trophy,
  TrendingUp, Plus, Minus, RotateCcw, Zap, Target,
  CheckCircle2, Circle, Star, Award, ChevronUp, ChevronDown,
  BarChart2, Heart, Wind, Dumbbell, Clock, Mail, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ── Add this auth-aware enhancement block at the TOP of your existing Dashboard ──
// This file ONLY adds the user info section + logout; your existing dashboard
// content (charts, recommendation widgets, etc.) should be kept below.

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── AUTH HEADER SECTION (new) ──────────────────────────────────────────────
  const AuthHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-900/60 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-5 mb-6 shadow-[0_0_40px_rgba(34,211,238,0.06)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
          <span className="text-cyan-400 text-lg font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-base">{user?.fullName || "User"}</h2>
            <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-2 py-0.5 rounded-full font-mono">
              {user?.role || "USER"}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3 text-gray-500" />
            <p className="text-gray-400 text-sm">{user?.email || "—"}</p>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-gray-700 hover:border-red-500/30 transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </motion.button>
    </motion.div>
  );

  // ── QUICK STATS (new enhancement) ─────────────────────────────────────────
  const stats = [
    { label: "Sessions", value: "12", icon: <Activity className="w-5 h-5 text-cyan-400" />, delta: "+3 this week" },
    { label: "AI Insights", value: "48", icon: <Brain className="w-5 h-5 text-purple-400" />, delta: "+12 today" },
    { label: "Wellness Score", value: "87%", icon: <Heart className="w-5 h-5 text-pink-400" />, delta: "+5% this month" },
  ];

  const StatsRow = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.4 }}
          className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 hover:border-cyan-400/20 rounded-xl p-4 transition-all duration-300 shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-gray-800/80 flex items-center justify-center">
              {s.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{s.value}</p>
          <p className="text-gray-400 text-sm mt-0.5">{s.label}</p>
          <p className="text-xs text-cyan-400/70 mt-1">{s.delta}</p>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── NEW: Auth header + user info ── */}
        <AuthHeader />

        {/* ── NEW: Quick stats ── */}
        <StatsRow />

        {/* ──────────────────────────────────────────────────────────────────
            YOUR EXISTING DASHBOARD CONTENT GOES BELOW THIS LINE
            All your original charts, AI recommendation widgets, and other
            dashboard components remain untouched here.
        ────────────────────────────────────────────────────────────────── */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/40 border border-gray-700/40 rounded-2xl p-6 text-center"
        >
          <p className="text-gray-500 text-sm font-mono">
            [ Your existing dashboard widgets render here ]
          </p>
        </motion.div>
      </div>
    </div>
  );
}
