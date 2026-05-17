import { useLocation } from "react-router-dom";

/* Hidden on "/" — RecommendationForm renders its own title.
   Only shows contextual headings on /dashboard and /tracker.  */
const PAGE_META = {
  "/dashboard": { badge: "Results & Insights",  title: "Your Health",  accent: "Blueprint"    },
  "/tracker":   { badge: "Daily Progress",      title: "Track Your",   accent: "Health Goals" },
};

export default function Header() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname];

  if (!meta) return null;

  return (
    <div className="text-center pt-10 pb-4 px-4">
      <span
        className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 border"
        style={{
          color: "#22d3ee",
          background: "rgba(34,211,238,0.08)",
          borderColor: "rgba(34,211,238,0.2)",
        }}
      >
        ✦ {meta.badge}
      </span>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight">
        <span style={{
          background: "linear-gradient(to right,#fff,#a5f3fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {meta.title}{" "}
        </span>
        <span style={{
          background: "linear-gradient(to right,#22d3ee,#a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {meta.accent}
        </span>
      </h1>
    </div>
  );
}
