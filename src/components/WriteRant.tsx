import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRants } from "../context/RantContext";
import { type RantFont, type RantPalette } from "../types/rant";

// ── Design tokens ──────────────────────────────────────────────────────────────
export const PALETTE_CONFIG: Record<RantPalette, {
  label: string;
  bg: string;
  text: string;
  accent: string;
  border: string;
  preset?: boolean;
}> = {
  parchment:      { label: "Parchment",    bg: "#fdf6e3", text: "#5c4a2a", accent: "#c8a96e", border: "#e8d9b5" },
  dusk:           { label: "Dusk",         bg: "#eceaf4", text: "#3d3557", accent: "#9b8ec4", border: "#d5d0ec" },
  fog:            { label: "Fog",          bg: "#eef2f5", text: "#2e3f4f", accent: "#7a9fb5", border: "#ccdae4" },
  blush:          { label: "Blush",        bg: "#fdf0f3", text: "#6b2d3e", accent: "#d48a9a", border: "#f0cdd4" },
  charcoal:       { label: "Charcoal",     bg: "#1e1e22", text: "#d4d0c8", accent: "#7a7570", border: "#3a3a40" },
  sage:           { label: "Sage",         bg: "#f0f4ee", text: "#2e4030", accent: "#7a9e7e", border: "#c4d9c4" },
  "preset-letter":{ label: "Aged Letter",  bg: "#f5ead0", text: "#3d2b1f", accent: "#8b5e3c", border: "#c9a87c", preset: true },
  "preset-night": { label: "Night Journal",bg: "#0d1117", text: "#c9d1d9", accent: "#58a6ff", border: "#21262d", preset: true },
  "preset-retro": { label: "Retro Paper",  bg: "#f2e8d0", text: "#1a1a1a", accent: "#c0392b", border: "#aaa", preset: true },
};

export const FONT_CONFIG: Record<RantFont, { label: string; className: string }> = {
  gloria:  { label: "Gloria Hallelujah", className: "gloria-hallelujah-regular" },
  patrick: { label: "Patrick Hand",      className: "patrick-hand-regular" },
  nanum:   { label: "Nanum Pen",         className: "nanum-pen-script-regular" },
  serif:   { label: "Serif",             className: "font-serif" },
  mono:    { label: "Monospace",         className: "font-mono" },
};

// ── Rant preview card (used in both preview panel + wall) ─────────────────────
export function RantPreviewCard({
  title, text, font, palette, createdAt, compact = false,
  onRead,
}: {
  title: string; text: string; font: RantFont; palette: RantPalette;
  createdAt?: Date; compact?: boolean; onRead?: () => void;
}) {
  const p = PALETTE_CONFIG[palette];
  const f = FONT_CONFIG[font];
  const isPreset = palette.startsWith("preset-");

  // Time-ago helper
  const timeAgo = (date: Date) => {
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secs < 60)   return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400)return `${Math.floor(secs / 3600)}h ago`;
    return date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col relative"
      style={{
        background: p.bg,
        border: `1.5px solid ${p.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        // Preset-specific decorations
        ...(palette === "preset-letter" ? {
          backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #d4c9b0 27px, #d4c9b0 28px)",
          backgroundPosition: "0 40px",
        } : {}),
        ...(palette === "preset-retro" ? {
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' x='0' y='0' fill='%23000' opacity='0.04'/%3E%3C/svg%3E\")",
        } : {}),
      }}
    >
      {/* Preset: night journal glow line */}
      {palette === "preset-night" && (
        <div style={{ height: "3px", background: "linear-gradient(90deg, #58a6ff, #bc8cff)" }} />
      )}
      {/* Preset: retro red top bar */}
      {palette === "preset-retro" && (
        <div style={{ height: "4px", background: "#c0392b" }} />
      )}
      {/* Preset: aged letter margin line */}
      {palette === "preset-letter" && (
        <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background: "#d4836a", opacity: 0.4 }} />
      )}

      <div className={`p-4 flex flex-col gap-2 flex-1 ${palette === "preset-letter" ? "pl-10" : ""}`}>
        {/* Title */}
        <h2
          className={`${f.className} font-semibold leading-tight`}
          style={{
            color: p.text,
            fontSize: compact ? "15px" : "17px",
            ...(palette === "preset-retro" ? { textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${p.accent}`, paddingBottom: "6px" } : {}),
            ...(palette === "preset-night" ? { color: "#58a6ff" } : {}),
          }}
        >
          {title || "Untitled"}
        </h2>

        {/* Subheader: date + time icon */}
        {createdAt && (
          <div className="flex items-center gap-3" style={{ color: p.accent, opacity: 0.8 }}>
            <span className="flex items-center gap-1" style={{ fontSize: "11px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
              </svg>
              {createdAt.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1" style={{ fontSize: "11px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              {timeAgo(createdAt)}
            </span>
          </div>
        )}

        {/* Text with fade */}
        <div className="relative flex-1" style={{ minHeight: compact ? "72px" : "96px", maxHeight: compact ? "96px" : "128px", overflow: "hidden" }}>
          <p
            className={`${f.className} leading-relaxed`}
            style={{ color: p.text, fontSize: compact ? "12px" : "13px", opacity: 0.9 }}
          >
            {text || "Your rant will appear here..."}
          </p>
          {/* Fade overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
            style={{ background: `linear-gradient(transparent, ${p.bg})` }}
          />
        </div>

        {/* Read pill */}
        {onRead && (
          <div className="flex justify-end mt-1">
            <button
              onClick={onRead}
              className="px-3 py-1 rounded-full text-xs transition-all cursor-pointer"
              style={{
                background: p.accent,
                color: palette === "charcoal" || palette === "preset-night" ? "#fff" : p.bg,
                fontSize: "11px",
                fontFamily: "inherit",
                border: "none",
                touchAction: "manipulation",
              }}
            >
              Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── WriteRant page ─────────────────────────────────────────────────────────────
const MAX_WORDS = 2000;

function WriteRant() {
  const navigate = useNavigate();
  const { addRant } = useRants();

  const [title,      setTitle     ] = useState("");
  const [text,       setText      ] = useState("");
  const [font,       setFont      ] = useState<RantFont>("gloria");
  const [palette,    setPalette   ] = useState<RantPalette>("parchment");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted ] = useState(false);
  const [error,      setError     ] = useState<string | null>(null);

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const overLimit = wordCount > MAX_WORDS;

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim() || overLimit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await addRant({ title: title.trim(), text: text.trim(), font, palette });
      setSubmitted(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const normalPalettes = (Object.keys(PALETTE_CONFIG) as RantPalette[]).filter(k => !PALETTE_CONFIG[k].preset);
  const presetPalettes = (Object.keys(PALETTE_CONFIG) as RantPalette[]).filter(k => PALETTE_CONFIG[k].preset);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-[#e0d8cc]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#555] hover:text-[#333] transition-colors patrick-hand-regular text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <h2 className="mx-auto patrick-hand-regular text-2xl text-[#333]">Write a Rant</h2>
      </header>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">

        {/* LEFT — Live Preview */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-[#f0ebe3] py-10 px-8 gap-4 border-b md:border-b-0 md:border-r border-[#e0d8cc]">
          <p className="gloria-hallelujah-regular text-[#888] text-xs uppercase tracking-widest mb-2">Preview</p>
          <div className="w-full max-w-sm">
            <RantPreviewCard
              title={title}
              text={text}
              font={font}
              palette={palette}
              createdAt={new Date()}
              onRead={() => {}}
            />
          </div>
          <p className="patrick-hand-regular text-[#aaa] text-sm mt-2 text-center">
            This is how your rant will look on the wall
          </p>
        </div>

        {/* RIGHT — Editor */}
        <div className="w-full md:w-1/2 flex flex-col justify-start px-8 py-6 gap-5 overflow-y-auto">

          {/* Title */}
          <div>
            <label className="patrick-hand-regular text-[#555] text-sm block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              placeholder="Give your rant a title..."
              className="w-full border border-[#ccc] rounded-lg px-4 py-2 patrick-hand-regular text-[#333] text-sm focus:outline-none focus:border-[#555] bg-white placeholder:text-[#bbb]"
            />
          </div>

          {/* Text */}
          <div>
            <label className="patrick-hand-regular text-[#555] text-sm block mb-1">Your rant</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder="Let it all out..."
              className="w-full border border-[#ccc] rounded-lg px-4 py-2 patrick-hand-regular text-[#333] text-sm resize-none focus:outline-none focus:border-[#555] bg-white placeholder:text-[#bbb]"
            />
            <p className={`text-right text-xs mt-0.5 patrick-hand-regular ${overLimit ? "text-red-400" : "text-[#bbb]"}`}>
              {wordCount} / {MAX_WORDS} words
            </p>
          </div>

          {/* Color palettes */}
          <div>
            <label className="patrick-hand-regular text-[#555] text-sm block mb-2">Color</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {normalPalettes.map((key) => {
                const p = PALETTE_CONFIG[key];
                return (
                  <button
                    key={key}
                    title={p.label}
                    onClick={() => setPalette(key)}
                    className="w-8 h-8 rounded-full border-2 transition-all cursor-pointer"
                    style={{
                      background: p.bg,
                      borderColor: palette === key ? p.text : p.border,
                      boxShadow: palette === key ? `0 0 0 2px ${p.accent}` : "none",
                      transform: palette === key ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                );
              })}
            </div>
            {/* Pre-designed */}
            <p className="patrick-hand-regular text-[#aaa] text-xs mb-2 mt-1">Pre-designed</p>
            <div className="flex flex-wrap gap-2">
              {presetPalettes.map((key) => {
                const p = PALETTE_CONFIG[key];
                return (
                  <button
                    key={key}
                    onClick={() => setPalette(key)}
                    className="px-3 py-1.5 rounded-lg text-xs patrick-hand-regular border-2 transition-all cursor-pointer"
                    style={{
                      background: p.bg,
                      color: p.text,
                      borderColor: palette === key ? p.accent : p.border,
                      boxShadow: palette === key ? `0 0 0 2px ${p.accent}` : "none",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font */}
          <div>
            <label className="patrick-hand-regular text-[#555] text-sm block mb-2">Font</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(FONT_CONFIG) as RantFont[]).map((key) => {
                const f = FONT_CONFIG[key];
                return (
                  <button
                    key={key}
                    onClick={() => setFont(key)}
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm transition-all cursor-pointer ${f.className} ${
                      font === key
                        ? "border-[#333] bg-[#333] text-white"
                        : "border-[#ccc] bg-white text-[#555] hover:border-[#888]"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error + Submit */}
          {error && <p className="text-red-400 text-xs patrick-hand-regular text-center">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !text.trim() || overLimit || submitted || submitting}
            className={`w-full py-2.5 rounded-full patrick-hand-regular text-base transition-all duration-300 ${
              submitted   ? "bg-green-500 text-white"
              : submitting ? "bg-[#888] text-white cursor-wait"
              : title.trim() && text.trim() && !overLimit
              ? "bg-[#333] text-white hover:bg-[#555] cursor-pointer"
              : "bg-[#ddd] text-[#aaa] cursor-not-allowed"
            }`}
          >
            {submitted ? "✓ Posted to the wall" : submitting ? "Posting..." : "Post to the wall"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WriteRant;
