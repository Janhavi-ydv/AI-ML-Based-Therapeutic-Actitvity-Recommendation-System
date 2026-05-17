import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Brain, Flame, Droplets, Moon, Trophy,
  TrendingUp, Plus, Minus, RotateCcw, Zap, Target,
  CheckCircle2, Circle, Star, Award, ChevronUp, ChevronDown,
  BarChart2, Heart, Wind, Dumbbell, Clock,
} from "lucide-react";

/* ─── helpers ────────────────────────────────────────── */
const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const diff = value - prev.current;
    const steps = 20;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(Math.round(prev.current + (diff * i) / steps));
      if (i >= steps) { clearInterval(id); prev.current = value; }
    }, 16);
    return () => clearInterval(id);
  }, [value]);
  return <span>{display}</span>;
};

/* ─── circular ring ──────────────────────────────────── */
const Ring = ({ pct, color, size = 96, stroke = 8, children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(pct), 200); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (anim / 100) * circ}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

/* ─── streak flame ───────────────────────────────────── */
const StreakFlame = ({ count }) => (
  <div className="flex items-center gap-1.5">
    {[...Array(Math.min(count, 7))].map((_, i) => (
      <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.06, type: "spring", stiffness: 300 }}>
        <Flame size={14} className={i < count ? "text-orange-400" : "text-white/10"} />
      </motion.div>
    ))}
    {count > 7 && <span className="text-xs text-orange-400 font-bold">+{count - 7}</span>}
  </div>
);

/* ─── badge ──────────────────────────────────────────── */
const Badge = ({ icon: Icon, label, earned }) => (
  <motion.div whileHover={{ scale: 1.06 }}
    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 cursor-default
      ${earned ? "bg-amber-400/10 border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
               : "bg-white/3 border-white/8 opacity-40 grayscale"}`}>
    <Icon size={20} className={earned ? "text-amber-400" : "text-white/30"} />
    <span className={`text-[10px] font-semibold text-center leading-tight ${earned ? "text-amber-300" : "text-white/30"}`}>{label}</span>
  </motion.div>
);

/* ─── activity row ───────────────────────────────────── */
const ACTIVITIES = [
  { key: "exercise", icon: Activity,  label: "Exercise",   color: "#22d3ee", glow: "rgba(34,211,238,.25)",  unit: "%" },
  { key: "water",    icon: Droplets,  label: "Hydration",  color: "#60a5fa", glow: "rgba(96,165,250,.25)",  unit: "%" },
  { key: "sleep",    icon: Moon,      label: "Sleep",      color: "#a78bfa", glow: "rgba(167,139,250,.25)", unit: "%" },
  { key: "mindful",  icon: Brain,     label: "Mindfulness",color: "#f472b6", glow: "rgba(244,114,182,.25)", unit: "%" },
  { key: "steps",    icon: TrendingUp,label: "Step Goal",  color: "#34d399", glow: "rgba(52,211,153,.25)",  unit: "%" },
  { key: "calories", icon: Flame,     label: "Calories",   color: "#fb923c", glow: "rgba(251,146,60,.25)",  unit: "%" },
];

/* ─── weekly bar chart ───────────────────────────────── */
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WeekBar = ({ values }) => (
  <div className="flex items-end gap-2 h-20">
    {DAYS.map((d, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-1">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${values[i]}%` }}
          transition={{ delay: i * 0.07, duration: 0.6, ease: "easeOut" }}
          className="w-full rounded-t-md"
          style={{ background: `linear-gradient(to top, #22d3ee, #6366f1)`, maxHeight: "100%", minHeight: 4 }}
        />
        <span className="text-[9px] text-white/30 font-medium">{d}</span>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════ */
export default function Tracker() {
  const [metrics, setMetrics] = useState({
    exercise: 60, water: 45, sleep: 75, mindful: 30, steps: 55, calories: 70,
  });
  const [streak, setStreak] = useState(4);
  const [weekData] = useState([65, 80, 45, 90, 60, 75, 55]);
  const [log, setLog] = useState([
    { text: "Morning run completed", time: "08:14 AM", icon: Activity,   color: "text-cyan-400"   },
    { text: "Drank 2L of water",     time: "11:30 AM", icon: Droplets,   color: "text-blue-400"   },
    { text: "Meditation session",    time: "01:00 PM", icon: Brain,      color: "text-violet-400" },
  ]);
  const [activeMetric, setActiveMetric] = useState("exercise");
  const [showConfetti, setShowConfetti] = useState(false);

  const overall = Math.round(Object.values(metrics).reduce((a, b) => a + b, 0) / ACTIVITIES.length);

  const adjust = (key, delta) => {
    setMetrics(prev => {
      const next = clamp(prev[key] + delta);
      if (next === 100 && prev[key] < 100) {
        setShowConfetti(true);
        const act = ACTIVITIES.find(a => a.key === key);
        setLog(l => [{ text: `${act.label} goal reached! 🎉`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), icon: Trophy, color: "text-amber-400" }, ...l.slice(0, 9)]);
        setTimeout(() => setShowConfetti(false), 2200);
        if (delta > 0) setStreak(s => s + 1);
      }
      return { ...prev, [key]: next };
    });
  };

  const reset = (key) => setMetrics(prev => ({ ...prev, [key]: 0 }));

  const resetAll = () => {
    setMetrics({ exercise: 0, water: 0, sleep: 0, mindful: 0, steps: 0, calories: 0 });
    setStreak(0);
    setLog([]);
  };

  const badges = [
    { icon: Zap,     label: "First Goal",   earned: overall >= 10  },
    { icon: Star,    label: "Half Way",      earned: overall >= 50  },
    { icon: Trophy,  label: "Champion",      earned: overall >= 100 },
    { icon: Flame,   label: "On Fire",       earned: streak >= 3    },
    { icon: Award,   label: "Consistent",    earned: streak >= 7    },
    { icon: Target,  label: "Perfect Day",   earned: overall === 100},
  ];

  const active = ACTIVITIES.find(a => a.key === activeMetric);

  /* ─── confetti dots ───────────── */
  const confettiColors = ["#22d3ee","#a78bfa","#f472b6","#34d399","#fbbf24","#60a5fa"];

  return (
    <div className="min-h-screen bg-[#070b14] text-white pb-16 overflow-x-hidden">

      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-700/6 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(34,211,238,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* confetti burst */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ background: confettiColors[i % confettiColors.length], left: `${20 + Math.random() * 60}%`, top: "40%" }}
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: -(80 + Math.random() * 200), x: (Math.random() - 0.5) * 300, opacity: 0, scale: 0, rotate: Math.random() * 360 }}
                transition={{ duration: 1.4 + Math.random() * 0.8, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* header */}
      <motion.header initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 backdrop-blur-2xl border-b border-white/8 bg-[#070b14]/70">
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-sm font-bold text-white/80 tracking-wide">Progress Tracker</span>
          </div>
          <StreakFlame count={streak} />
          <button onClick={resetAll}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-rose-400/30 hover:text-rose-400 text-white/50 transition-colors">
            <RotateCcw size={11} /> Reset All
          </button>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-6">

        {/* ── hero: overall + rings ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-cyan-400/6 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* overall ring */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <Ring pct={overall} color="#22d3ee" size={130} stroke={10}>
                <div className="text-center">
                  <p className="text-3xl font-black text-white tabular-nums">
                    <AnimatedNumber value={overall} />
                    <span className="text-lg text-white/40">%</span>
                  </p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">overall</p>
                </div>
              </Ring>
              <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
                <Flame size={11} className="text-amber-400" />
                <span className="text-xs text-amber-400 font-bold">{streak} day streak</span>
              </div>
            </div>

            {/* mini rings */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black mb-1">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">Daily</span>{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Health Goals</span>
              </h1>
              <p className="text-white/35 text-sm mb-5">Track, improve, and celebrate every step forward.</p>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {ACTIVITIES.map(act => (
                  <motion.button key={act.key}
                    onClick={() => setActiveMetric(act.key)}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200
                      ${activeMetric === act.key ? "border-white/20 bg-white/8" : "border-white/6 bg-white/3 hover:border-white/12"}`}>
                    <Ring pct={metrics[act.key]} color={act.color} size={46} stroke={4}>
                      <act.icon size={13} style={{ color: act.color }} />
                    </Ring>
                    <span className="text-[10px] text-white/40 font-medium">{act.label.split(" ")[0]}</span>
                    <span className="text-xs font-bold" style={{ color: act.color }}>
                      <AnimatedNumber value={metrics[act.key]} />%
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── active metric control ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeMetric}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle at 80% 50%, ${active.glow}, transparent 70%)` }} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
                  <active.icon size={24} style={{ color: active.color }} />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">{active.label}</p>
                  <p className="text-4xl font-black tabular-nums" style={{ color: active.color }}>
                    <AnimatedNumber value={metrics[activeMetric]} />
                    <span className="text-xl text-white/30">%</span>
                  </p>
                </div>
              </div>

              {/* progress bar */}
              <div className="flex-1 sm:max-w-xs">
                <div className="h-3 rounded-full bg-white/8 overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    animate={{ width: `${metrics[activeMetric]}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ background: `linear-gradient(to right, ${active.color}88, ${active.color})`, boxShadow: `0 0 12px ${active.glow}` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-white/20">0%</span>
                  <span className="text-[10px] text-white/20">100%</span>
                </div>
              </div>

              {/* controls */}
              <div className="flex items-center gap-2">
                {[
                  { label: "-10", delta: -10, icon: ChevronDown, cls: "border-white/10 text-white/50 hover:border-white/20" },
                  { label: "-5",  delta: -5,  icon: Minus,       cls: "border-white/10 text-white/50 hover:border-white/20" },
                  { label: "+5",  delta: 5,   icon: Plus,        cls: "border-cyan-400/30 text-cyan-400 hover:border-cyan-400/60 hover:shadow-[0_0_16px_rgba(34,211,238,0.2)]" },
                  { label: "+10", delta: 10,  icon: ChevronUp,   cls: "border-cyan-400/30 text-cyan-400 hover:border-cyan-400/60 hover:shadow-[0_0_16px_rgba(34,211,238,0.2)]" },
                ].map(({ label, delta, icon: Ico, cls }) => (
                  <motion.button key={label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => adjust(activeMetric, delta)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${cls}`}>
                    <Ico size={13} />
                  </motion.button>
                ))}
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => reset(activeMetric)}
                  className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-white/30 hover:text-rose-400 hover:border-rose-400/30 transition-all">
                  <RotateCcw size={12} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── grid: weekly + log + badges ── */}
        <div className="grid md:grid-cols-3 gap-5">

          {/* weekly chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-1 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-cyan-400" />
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">This Week</h3>
            </div>
            <WeekBar values={weekData} />
            <div className="mt-4 flex justify-between text-xs text-white/30">
              <span>Avg: {Math.round(weekData.reduce((a, b) => a + b, 0) / 7)}%</span>
              <span>Best: {Math.max(...weekData)}%</span>
            </div>
          </motion.div>

          {/* activity log */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-violet-400" />
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Activity Log</h3>
            </div>
            <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <AnimatePresence>
                {log.length === 0
                  ? <p className="text-white/20 text-sm text-center py-6">No activity yet. Start tracking!</p>
                  : log.map((entry, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-white/4 border border-white/6 rounded-xl px-3 py-2.5">
                      <entry.icon size={14} className={entry.color} />
                      <p className="text-sm text-white/65 flex-1">{entry.text}</p>
                      <span className="text-[10px] text-white/25 flex-shrink-0">{entry.time}</span>
                    </motion.div>
                  ))
                }
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── all metric bars ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={14} className="text-emerald-400" />
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">All Metrics Overview</h3>
          </div>
          <div className="space-y-3.5">
            {ACTIVITIES.map((act, i) => (
              <motion.div key={act.key}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="flex items-center gap-4 group cursor-pointer"
                onClick={() => setActiveMetric(act.key)}>
                <act.icon size={14} style={{ color: act.color }} className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="w-24 text-xs text-white/40 group-hover:text-white/70 transition-colors">{act.label}</span>
                <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    animate={{ width: `${metrics[act.key]}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ background: `linear-gradient(to right, ${act.color}66, ${act.color})` }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-bold" style={{ color: act.color }}>
                  <AnimatedNumber value={metrics[act.key]} />%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── badges ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={14} className="text-amber-400" />
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Achievements</h3>
            <span className="ml-auto text-xs text-white/25">{badges.filter(b => b.earned).length}/{badges.length} earned</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {badges.map((b, i) => <Badge key={i} {...b} />)}
          </div>
        </motion.div>

      </div>
    </div>
  );
}