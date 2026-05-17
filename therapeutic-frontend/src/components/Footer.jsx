import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="border-t border-white/8 backdrop-blur-xl"
      style={{ backgroundColor: '#565d68' }}
    >
      <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* ── Brand Icon ── */}
        <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.1)]">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>

        {/* ── Disclaimer ── */}
        <p className="text-white/20 text-xs text-center">
          © {new Date().getFullYear()} NeuraPulse &nbsp;·&nbsp; AI content is not
          medical advice. Always consult a professional.
        </p>

        {/* ── Links ── */}
        <div className="flex gap-2">
          {["GitHub", "X (Twitter)", "Email"].map((s) => (
            <button
              key={s}
              className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/30
                         hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
            >
              {s}
            </button>
          ))}
        </div>

      </div>
    </footer>
  );
}