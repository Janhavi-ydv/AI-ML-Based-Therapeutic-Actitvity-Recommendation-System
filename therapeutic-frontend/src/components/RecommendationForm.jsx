import { useState } from 'react';
import { getRecommendation } from '../services/api';

// ── Field configuration ──────────────────────────────────────────────────────

const FIELDS = [
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    placeholder: 'e.g. 34',
    min: 1,
    max: 120,
    colSpan: 1,
  },
  {
    id: 'gender',
    label: 'Gender',
    type: 'select',
    options: ['Male', 'Female', 'Other'],
    colSpan: 1,
  },
  {
    id: 'bmi',
    label: 'BMI',
    type: 'number',
    placeholder: 'e.g. 22.5',
    step: '0.1',
    min: 10,
    max: 60,
    colSpan: 1,
  },
  {
    id: 'stressLevel',
    label: 'Stress Level',
    type: 'select',
    options: ['1 – Low', '2 – Moderate', '3 – High', '4 – Severe'],
    optionValues: ['1', '2', '3', '4'],
    colSpan: 1,
  },
  {
  id: 'smokingStatus',
  label: 'Smoking Status',
  type: 'select',
  options: ['Yes', 'No'],
},
  {
    id: 'alcoholConsumption',
    label: 'Alcohol Consumption',
    type: 'select',
   options: ['None', 'Occasional', 'Regular'],
    colSpan: 1,
  },
 {
  id: 'exerciseFrequency',
  label: 'Exercise Frequency',
  type: 'select',
  options: ['Never', 'Rare', 'Moderate', 'Regular'],
},
  {
    id: 'chronicCondition',
    label: 'Chronic Condition',
    type: 'select',
    options: ['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'Arthritis', 'Asthma', 'Other'],
    colSpan: 1,
  },
  {
    id: 'anxietySymptoms',
    label: 'Anxiety Symptoms',
    type: 'select',
    options: ['Yes', 'No'],
    colSpan: 1,
  },
  {
    id: 'sleepDisturbance',
    label: 'Sleep Disturbance',
    type: 'select',
    options: ['Yes', 'No'],
    colSpan: 1,
  },
];

const initialForm = {
  age: '',
  gender: '',
  bmi: '',
  stressLevel: '',
  smokingStatus: '',
  alcoholConsumption: '',
  exerciseFrequency: '',
  chronicCondition: '',
  anxietySymptoms: '',
  sleepDisturbance: '',
};

// ── Icons ────────────────────────────────────────────────────────────────────

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.249 2.249 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
  </svg>
);

const RunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// ── Sub-components ────────────────────────────────────────────────────────────

function FormField({ field, value, onChange }) {
  const baseInput =
    'w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-body text-stone-800 ' +
    'placeholder-stone-400 focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200 ' +
    'transition-all duration-200 hover:border-stone-300';

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-stone-500 font-body">
        {field.label}
      </label>

      {field.type === 'number' ? (
        <input
          type="number"
          id={field.id}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step || '1'}
          className={baseInput}
          required
        />
      ) : (
        <select
          id={field.id}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`${baseInput} appearance-none cursor-pointer`}
          required
        >
          <option value="" disabled>Select…</option>
          {field.options.map((opt, i) => (
            <option
              key={opt}
              value={field.optionValues ? field.optionValues[i] : opt}
            >
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function ResultCard({ icon, label, value, delay }) {
  return (
    <div
      className="flex-1 min-w-0 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm"
      style={{ animation: `fadeUp 0.55s ease ${delay}s both` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
          {icon}
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-stone-400 font-body">
          {label}
        </span>
      </div>
      <p className="font-display text-xl text-stone-800 leading-snug">{value}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function RecommendationForm() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (id, value) => {
    setForm((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Build payload — convert numeric strings to numbers
    const payload = {
      ...form,
      age: Number(form.age),
      bmi: parseFloat(form.bmi),
      stressLevel: Number(form.stressLevel),
    };

    try {
      const data = await getRecommendation(payload);
      setResult(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to reach the recommendation service. Please ensure the backend is running on port 8080.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-100 font-body">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #c5d8c6 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, #e2ebe2 0%, transparent 50%)`,
        }}
      />

      {/* Header */}
      <header className="relative border-b border-stone-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage-600 flex items-center justify-center text-white">
              <HeartIcon />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-stone-800 leading-none">
                Therapeutic Activity
              </h1>
              <p className="text-xs text-stone-400 tracking-wide mt-0.5 font-body">
                Recommendation System
              </p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400 font-mono bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse-soft inline-block" />
            AI-ML Powered
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <div className="mb-10 text-center" style={{ animation: 'fadeUp 0.5s ease both' }}>
          <h2 className="font-display text-3xl sm:text-4xl text-stone-800 mb-3">
            Your Personalised <em className="text-sage-600 not-italic">Wellness Plan</em>
          </h2>
          <p className="text-stone-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Enter your health profile below. Our model will recommend a targeted
            exercise and a meditation practice tailored to your needs.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="bg-white/80 backdrop-blur-xs border border-stone-200 rounded-3xl shadow-sm p-6 sm:p-8 mb-8"
          style={{ animation: 'fadeUp 0.55s ease 0.1s both' }}
        >
          <div className="flex items-center gap-2 mb-8">
            <RunIcon />
            <h3 className="font-display text-lg text-stone-700">Health Profile</h3>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FIELDS.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={form[field.id]}
                  onChange={handleChange}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-stone-400 hover:text-stone-600 transition-colors duration-200 font-medium underline underline-offset-2"
              >
                Clear form
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2.5 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-300 
                           text-white font-semibold text-sm px-8 py-3.5 rounded-2xl 
                           transition-all duration-200 shadow-md hover:shadow-lg 
                           hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed
                           disabled:shadow-none disabled:translate-y-0"
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    <span>Analysing…</span>
                  </>
                ) : (
                  <>
                    <HeartIcon />
                    <span>Get Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error state */}
        {error && (
          <div
            className="mb-8 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4"
            style={{ animation: 'fadeIn 0.35s ease both' }}
          >
            <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-700 mb-0.5">Request Failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ animation: 'fadeUp 0.45s ease both' }}>
            <div className="flex items-center gap-2 mb-5">
              <LeafIcon />
              <h3 className="font-display text-xl text-stone-700">Your Recommendations</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ResultCard
                icon={<RunIcon />}
                label="Recommended Exercise"
                value={result.exerciseRecommendation || '—'}
                delay={0.05}
              />
              <ResultCard
                icon={<LeafIcon />}
                label="Recommended Meditation"
                value={result.meditationRecommendation || '—'}
                delay={0.15}
              />
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-xs text-stone-400 text-center leading-relaxed max-w-lg mx-auto">
              These recommendations are generated by a machine learning model and are
              intended for informational purposes only. Always consult a qualified
              healthcare professional before starting a new exercise or wellness programme.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-stone-200 mt-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-400">
            Therapeutic Activity Recommendation System &mdash; AI/ML Backend
          </p>
          <p className="text-xs text-stone-300 font-mono">
            POST http://localhost:8080/api/recommendation
          </p>
        </div>
      </footer>
    </div>
  );
}
