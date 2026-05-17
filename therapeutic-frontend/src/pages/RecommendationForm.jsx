import { useState } from "react"
import { getRecommendation } from "../services/api"
import {
  Activity, Brain, Loader2, Clock, Zap, FileText,
  ChevronDown, Heart, Sparkles, Flame, User, Scale,
  BarChart2, Cigarette, Wine, Dumbbell, Stethoscope,
  AlertCircle, Moon, ArrowRight, CheckCircle2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

/* ─── Field Label ────────────────────────────────────────────────── */
const Field = ({ icon: Icon, label, children }) => (
  <div className="flex flex-col gap-1.5 min-w-0">
    <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase select-none whitespace-nowrap">
      <Icon size={10} className="shrink-0" />
      {label}
    </label>
    {children}
  </div>
)

const base =
  "w-full px-3 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-100 " +
  "text-sm placeholder-slate-600 outline-none transition-all duration-150 " +
  "focus:border-teal-500/70 focus:ring-1 focus:ring-teal-500/30 hover:border-slate-600"

const Select = ({ children, ...props }) => (
  <div className="relative">
    <select {...props} className={base + " appearance-none cursor-pointer pr-8 [&>option]:bg-slate-900"}>
      {children}
    </select>
    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
  </div>
)

/* ─── Stress Slider ──────────────────────────────────────────────── */
const STRESS_LABELS = ["", "Calm", "", "", "Mild", "", "", "High", "", "", "Critical"]
const stressColor = (v) => v <= 3 ? "#2dd4bf" : v <= 6 ? "#f59e0b" : "#f43f5e"

const StressSlider = ({ value, onChange }) => {
  const color = stressColor(value)
  const pct = ((value - 1) / 9) * 100
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase select-none">
        <BarChart2 size={10} className="shrink-0" />
        Stress Level
      </label>
      <div className="space-y-1.5">
        <div className="relative h-1.5 rounded-full bg-slate-700/80 mt-1">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg,#2dd4bf,${color})` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-slate-900 shadow-lg transition-all duration-200"
            style={{ left: `calc(${pct}% - 7px)`, background: color }}
          />
          <input type="range" min="1" max="10" name="stressLevel"
            value={value} onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-slate-600">Calm</span>
          <span className="text-xs font-bold tabular-nums" style={{ color }}>
            {value}/10
            {STRESS_LABELS[value] && (
              <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider">· {STRESS_LABELS[value]}</span>
            )}
          </span>
          <span className="text-[9px] text-slate-600">Critical</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Result Card ────────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" } }),
}

const ResultCard = ({ icon: Icon, accent, title, children, index, fullWidth = false }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    className={`rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm overflow-hidden ${fullWidth ? "col-span-full" : ""}`}
  >
    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-slate-700/40 bg-slate-800/50">
      <div className={`p-1.5 rounded-md ${accent.iconBg}`}>
        <Icon size={13} className={accent.iconColor} />
      </div>
      <span className="text-[11px] font-semibold text-slate-300 tracking-wide uppercase">{title}</span>
    </div>
    <div className="px-4 py-3.5">{children}</div>
  </motion.div>
)

/* ─── Main Component ─────────────────────────────────────────────── */
export default function RecommendationForm() {
  const [form, setForm] = useState({
    age: "", gender: "Male", bmi: "", stressLevel: 3,
    smokingStatus: "No", alcoholConsumption: "Occasional",
    exerciseFrequency: "Rare", chronicCondition: "None",
    anxietySymptoms: "No", sleepDisturbance: "No",
  })
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await getRecommendation(form)
      setResult(data)
      localStorage.setItem("lastResult", JSON.stringify(data))
    } catch {
      setError("Could not reach the server. Please check your connection.")
    }
    setLoading(false)
  }

  const INTENSITY_COLOR = {
    low: "text-emerald-400", Low: "text-emerald-400",
    moderate: "text-amber-400", Moderate: "text-amber-400",
    high: "text-rose-400", High: "text-rose-400",
  }
  const INTENSITY_BAR = {
    low: "w-1/3 bg-emerald-400", Low: "w-1/3 bg-emerald-400",
    moderate: "w-2/3 bg-amber-400", Moderate: "w-2/3 bg-amber-400",
    high: "w-full bg-rose-400", High: "w-full bg-rose-400",
  }

  return (
    <div className="min-h-screen bg-[#080d1a] text-white font-sans antialiased">

      {/* ── Background ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(45,212,191,0.9) 1px,transparent 1px),linear-gradient(90deg,rgba(45,212,191,0.9) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="absolute -top-60 -left-60 w-[500px] h-[500px] rounded-full bg-teal-600/8 blur-[120px]" />
        <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] rounded-full bg-violet-700/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-teal-900/10 blur-[80px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 pb-20">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full border border-teal-500/25 bg-teal-500/8 text-teal-400 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            AI Health Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-2.5">
            <span className="text-slate-100">Therapeutic</span>{" "}
            <span className="bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">Advisor</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Personalized exercise & meditation recommendations based on your health profile.
          </p>
        </motion.div>

        {/* ══ FORM PANEL ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden mb-6"
        >
          {/* Panel header bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/50 bg-slate-800/40">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.9)] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.22em] text-slate-400 uppercase">Health Profile</span>
            </div>
            <span className="text-[10px] text-slate-600 italic">All fields optional</span>
          </div>

          <div className="p-5 space-y-4">

            {/* ── Row 1: Biometrics (4 columns) ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
              <Field icon={User} label="Age">
                <input name="age" type="number" placeholder="e.g. 28"
                  value={form.age} onChange={handleChange} className={base} />
              </Field>
              <Field icon={Heart} label="Gender">
                <Select name="gender" value={form.gender} onChange={handleChange}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </Select>
              </Field>
              <Field icon={Scale} label="BMI">
                <input name="bmi" type="number" placeholder="e.g. 22.5"
                  value={form.bmi} onChange={handleChange} className={base} />
              </Field>
              <StressSlider value={form.stressLevel} onChange={handleChange} />
            </div>

            {/* ── Divider: Lifestyle ── */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-slate-700/50" />
              <span className="text-[9px] font-bold tracking-[0.22em] text-slate-600 uppercase">Lifestyle</span>
              <div className="flex-1 h-px bg-slate-700/50" />
            </div>

            {/* ── Row 2: Lifestyle (3 columns) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field icon={Cigarette} label="Smoking">
                <Select name="smokingStatus" value={form.smokingStatus} onChange={handleChange}>
                  <option value="No">Non-smoker</option>
                  <option value="Yes">Smoker</option>
                  <option value="Former">Former</option>
                </Select>
              </Field>
              <Field icon={Wine} label="Alcohol">
                <Select name="alcoholConsumption" value={form.alcoholConsumption} onChange={handleChange}>
                  <option value="None">None</option>
                  <option value="Occasional">Occasional</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </Select>
              </Field>
              <Field icon={Dumbbell} label="Exercise Frequency">
                <Select name="exerciseFrequency" value={form.exerciseFrequency} onChange={handleChange}>
                  <option value="Never">Never</option>
                  <option value="Rare">Rarely (1×/week)</option>
                  <option value="Moderate">Moderate (3×/week)</option>
                  <option value="Regular">Regular (5+×/week)</option>
                </Select>
              </Field>
            </div>

            {/* ── Divider: Medical ── */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-slate-700/50" />
              <span className="text-[9px] font-bold tracking-[0.22em] text-slate-600 uppercase">Medical</span>
              <div className="flex-1 h-px bg-slate-700/50" />
            </div>

            {/* ── Row 3: Medical (3 columns) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field icon={Stethoscope} label="Chronic Condition">
                <Select name="chronicCondition" value={form.chronicCondition} onChange={handleChange}>
                  <option value="None">None</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Hypertension">Hypertension</option>
                  <option value="Asthma">Asthma</option>
                  <option value="Heart Disease">Heart Disease</option>
                </Select>
              </Field>
              <Field icon={AlertCircle} label="Anxiety Symptoms">
                <Select name="anxietySymptoms" value={form.anxietySymptoms} onChange={handleChange}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </Select>
              </Field>
              <Field icon={Moon} label="Sleep Issues">
                <Select name="sleepDisturbance" value={form.sleepDisturbance} onChange={handleChange}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </Select>
              </Field>
            </div>

            {/* ── Actions ── */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="group flex-1 py-3 rounded-xl font-bold text-sm tracking-wide
                  bg-gradient-to-r from-teal-500 to-teal-400 text-slate-900
                  hover:from-teal-400 hover:to-cyan-300
                  shadow-[0_4px_24px_rgba(45,212,191,0.25)]
                  hover:shadow-[0_4px_32px_rgba(45,212,191,0.45)]
                  transition-all duration-200 hover:scale-[1.012] active:scale-[0.985]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" />Analyzing…</>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Get Recommendation
                    <ArrowRight size={14} className="opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  </>
                )}
              </button>
              <button onClick={() => navigate("/dashboard")}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-slate-600 text-slate-300 text-sm font-medium transition-all duration-150">
                Dashboard
              </button>
              <button onClick={() => navigate("/tracker")}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-slate-600 text-slate-300 text-sm font-medium transition-all duration-150">
                Tracker
              </button>
            </div>

          </div>
        </motion.div>

        {/* ══ RESULTS SECTION ════════════════════════════════════════ */}
        <AnimatePresence mode="wait">

          {/* Empty state */}
          {!loading && !result && !error && (
            <motion.div key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4 text-center"
            >
              <div className="w-14 h-14 rounded-2xl border border-teal-500/20 bg-teal-500/5 flex items-center justify-center">
                <Heart size={22} className="text-teal-500/35" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Your health plan will appear here</p>
                <p className="text-slate-700 text-xs mt-1">Fill out the form above and hit "Get Recommendation"</p>
              </div>
              <div className="flex gap-3 text-slate-800 mt-1">
                {[Activity, Brain, Zap, Clock].map((Icon, i) => <Icon key={i} size={14} />)}
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-5"
            >
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border border-teal-500/15 animate-ping" />
                <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-teal-400 animate-spin" />
                <Sparkles size={18} className="absolute inset-0 m-auto text-teal-400" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 text-sm font-semibold">Analyzing your profile…</p>
                <p className="text-slate-600 text-xs mt-0.5">Generating personalized recommendations</p>
              </div>
              <div className="w-40 h-0.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 to-violet-400 rounded-full"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div key="error"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-14 gap-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl border border-rose-500/20 bg-rose-500/8 flex items-center justify-center">
                <AlertCircle size={20} className="text-rose-400" />
              </div>
              <div>
                <p className="text-rose-300 font-semibold text-sm">{error}</p>
                <button onClick={handleSubmit}
                  className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2">
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {result && !loading && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Results header */}
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-4"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 text-[10px] font-bold tracking-[0.18em] uppercase">
                  <CheckCircle2 size={10} />
                  Analysis Complete
                </span>
                <p className="text-slate-700 text-[10px] hidden sm:block">
                  AI-generated — not a substitute for professional medical advice
                </p>
              </motion.div>

              {/* ── Row 1: Exercise + Meditation (2 col) ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <ResultCard index={0}
                  icon={Activity} title="Exercise Recommendation"
                  accent={{ iconBg: "bg-teal-500/15", iconColor: "text-teal-400" }}
                >
                  <p className="text-slate-400 text-sm leading-relaxed">{result.exerciseRecommendation}</p>
                </ResultCard>

                <ResultCard index={1}
                  icon={Brain} title="Meditation Recommendation"
                  accent={{ iconBg: "bg-violet-500/15", iconColor: "text-violet-400" }}
                >
                  <p className="text-slate-400 text-sm leading-relaxed">{result.meditationRecommendation}</p>
                </ResultCard>
              </div>

              {/* ── Row 2: Intensity + Duration + Profile Summary (3 col) ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">

                <ResultCard index={2}
                  icon={Flame} title="Intensity Level"
                  accent={{ iconBg: "bg-amber-500/15", iconColor: "text-amber-400" }}
                >
                  <div className="flex flex-col gap-2">
                    <span className={`text-2xl font-black ${INTENSITY_COLOR[result.intensityLevel] ?? "text-slate-300"}`}>
                      {result.intensityLevel}
                    </span>
                    <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${INTENSITY_BAR[result.intensityLevel] ?? "w-2/3 bg-amber-400"}`} />
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {result.intensityLevel?.toLowerCase() === "low" && "Gentle pace — ideal for recovery"}
                      {result.intensityLevel?.toLowerCase() === "moderate" && "Balanced effort — steady progress"}
                      {result.intensityLevel?.toLowerCase() === "high" && "Challenging — push your limits"}
                    </p>
                  </div>
                </ResultCard>

                <ResultCard index={3}
                  icon={Clock} title="Session Duration"
                  accent={{ iconBg: "bg-sky-500/15", iconColor: "text-sky-400" }}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-2xl font-black text-slate-200">{result.sessionDuration}</span>
                    <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                      <div className="h-full w-1/2 rounded-full bg-sky-400/70" />
                    </div>
                    <p className="text-slate-600 text-[11px]">Recommended per session</p>
                  </div>
                </ResultCard>

                <ResultCard index={4}
                  icon={Zap} title="Profile Summary"
                  accent={{ iconBg: "bg-rose-500/15", iconColor: "text-rose-400" }}
                >
                  <div className="space-y-2">
                    {[
                      { label: "Age", value: form.age || "—" },
                      { label: "BMI", value: form.bmi || "—" },
                      { label: "Stress", value: `${form.stressLevel}/10` },
                      { label: "Condition", value: form.chronicCondition },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center border-b border-slate-700/30 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wide font-semibold">{label}</span>
                        <span className="text-[11px] font-semibold text-slate-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>

              {/* ── Row 3: Additional Notes full width ── */}
              <ResultCard index={5}
                icon={FileText} title="Additional Notes & Guidance"
                accent={{ iconBg: "bg-blue-500/15", iconColor: "text-blue-400" }}
                fullWidth
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  {result.additionalNotes
                    ? result.additionalNotes.split(". ").filter(Boolean).map((s, i) => {
                        const isKey = /avoid|important|note|caution|warning|consult|doctor|ensure|recommend/i.test(s)
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className={`mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full ${isKey ? "bg-teal-400" : "bg-slate-700"}`} />
                            <span className={`text-[12px] leading-relaxed ${isKey ? "text-teal-300/90 font-medium" : "text-slate-500"}`}>
                              {s}.
                            </span>
                          </div>
                        )
                      })
                    : <p className="text-slate-600 text-sm col-span-full">No additional notes.</p>}
                </div>
              </ResultCard>

              {/* Mobile disclaimer */}
              <p className="text-center text-slate-700 text-[10px] pt-4 sm:hidden">
                AI-generated — not a substitute for professional medical advice
              </p>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
