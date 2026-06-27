import { useParams, useNavigate } from "react-router-dom";
import { useRants } from "../context/RantContext";
import { PALETTE_CONFIG, FONT_CONFIG } from "./WriteRant";

function RantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rants, loading } = useRants();

  const rant = rants.find((r) => r.id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="w-8 h-8 border-2 border-[#ccc] border-t-[#555] rounded-full animate-spin" />
      </div>
    );
  }

  if (!rant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f5] gap-4">
        <p className="gloria-hallelujah-regular text-[#999] text-lg">Rant not found.</p>
        <button onClick={() => navigate("/")} className="patrick-hand-regular text-[#555] underline text-sm">
          Go back home
        </button>
      </div>
    );
  }

  const p = PALETTE_CONFIG[rant.palette];
  const f = FONT_CONFIG[rant.font];
  
  // REMOVED: const isPreset = rant.palette.startsWith("preset-");

  const date = new Date(rant.createdAt);
  const timeAgo = () => {
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secs < 60)    return `${secs}s ago`;
    if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return date.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: p.bg }}>

      {/* Preset accent bars */}
      {rant.palette === "preset-night" && (
        <div style={{ height: "4px", background: "linear-gradient(90deg, #58a6ff, #bc8cff)", flexShrink: 0 }} />
      )}
      {rant.palette === "preset-retro" && (
        <div style={{ height: "6px", background: "#c0392b", flexShrink: 0 }} />
      )}

      {/* Back button */}
      <div className="px-6 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 transition-colors patrick-hand-regular text-base"
          style={{ color: p.accent }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Content */}
      <div
        className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 relative"
        style={{
          ...(rant.palette === "preset-letter" ? {
            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #d4c9b0 31px, #d4c9b0 32px)",
            backgroundPosition: "0 64px",
          } : {}),
        }}
      >
        {/* Letter margin line */}
        {rant.palette === "preset-letter" && (
          <div className="absolute left-16 top-0 bottom-0 w-px" style={{ background: "#d4836a", opacity: 0.4 }} />
        )}

        <div className={rant.palette === "preset-letter" ? "pl-8" : ""}>
          {/* Title */}
          <h1
            className={`${f.className} leading-tight mb-4`}
            style={{
              color: rant.palette === "preset-night" ? "#58a6ff" : p.text,
              fontSize: "clamp(22px, 5vw, 32px)",
              ...(rant.palette === "preset-retro" ? {
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: `3px solid ${p.accent}`,
                paddingBottom: "10px",
              } : {}),
            }}
          >
            {rant.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8" style={{ color: p.accent, opacity: 0.85 }}>
            <span className="flex items-center gap-1.5 patrick-hand-regular text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
              </svg>
              {date.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5 patrick-hand-regular text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              {timeAgo()}
            </span>
          </div>

          {/* Body text */}
          <p
            className={`${f.className} leading-loose whitespace-pre-wrap`}
            style={{
              color: p.text,
              fontSize: "clamp(14px, 2.5vw, 16px)",
              opacity: 0.92,
            }}
          >
            {rant.text}
          </p>
        </div>
      </div>

      {/* Footer stamp */}
      <div className="text-center py-6 opacity-30 select-none">
        <p className="patrick-hand-regular text-xs" style={{ color: p.text }}>
          museum of the unsaid thoughts
        </p>
      </div>
    </div>
  );
}

export default RantPage;