import { useState, useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useThoughts } from "../context/ThoughtsContext";
import PolaroidCard from "./PolaroidCard";
import { DEFAULT_IMAGES } from "../assets/defaultImages";
import { type Thought, type TextAlignH, type TextAlignV, type PolaroidSize, type TextSize } from "../types/thought";

// ── Alignment grid ────────────────────────────────────────────────────────────
type AlignPos = { h: TextAlignH; v: TextAlignV };
const ALIGN_CELLS: AlignPos[] = [
  { h: "left", v: "top" }, { h: "center", v: "top" }, { h: "right", v: "top" },
  { h: "left", v: "middle" }, { h: "center", v: "middle" }, { h: "right", v: "middle" },
  { h: "left", v: "bottom" }, { h: "center", v: "bottom" }, { h: "right", v: "bottom" },
];

function AlignGrid({ alignH, alignV, onChange }: {
  alignH: TextAlignH; alignV: TextAlignV;
  onChange: (h: TextAlignH, v: TextAlignV) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-0.75 w-19">
      {ALIGN_CELLS.map(({ h, v }) => {
        const active = h === alignH && v === alignV;
        return (
          <button
            key={`${h}-${v}`}
            onClick={() => onChange(h, v)}
            title={`${v} ${h}`}
            className={`w-6 h-6 rounded-sm border transition-all cursor-pointer ${
              active ? "bg-[#333] border-[#333]" : "bg-white border-[#ccc] hover:border-[#888] hover:bg-[#f0f0f0]"
            }`}
          />
        );
      })}
    </div>
  );
}

// ── Text colour swatches ──────────────────────────────────────────────────────
const TEXT_COLORS = [
  { hex: "#ffffff", label: "White" },
  { hex: "#000000", label: "Black" },
  { hex: "#fde68a", label: "Yellow" },
  { hex: "#fca5a5", label: "Pink" },
  { hex: "#6ee7b7", label: "Mint" },
  { hex: "#93c5fd", label: "Sky" },
  { hex: "#f97316", label: "Orange" },
  { hex: "#d8b4fe", label: "Lavender" },
];

function ColorSwatches({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-0.75 w-30">
      {TEXT_COLORS.map(({ hex, label }) => (
        <button
          key={hex}
          title={label}
          onClick={() => onChange(hex)}
          className="w-6 h-6 rounded-full border-2 transition-all cursor-pointer"
          style={{
            backgroundColor: hex,
            borderColor: value === hex ? "#333" : "#ccc",
            transform: value === hex ? "scale(1.2)" : "scale(1)",
            boxShadow: value === hex ? "0 0 0 1px #333" : "none",
          }}
        />
      ))}
    </div>
  );
}

// ── Polaroid size picker ──────────────────────────────────────────────────────
const SIZES: { value: PolaroidSize; label: string; icon: string }[] = [
  { value: "sm", label: "Small",  icon: "S" },
  { value: "md", label: "Medium", icon: "M" },
  { value: "lg", label: "Large",  icon: "L" },
];

function SizePicker({ value, onChange }: { value: PolaroidSize; onChange: (s: PolaroidSize) => void }) {
  return (
    <div className="flex gap-2">
      {SIZES.map(({ value: v, label, icon }) => (
        <button
          key={v}
          title={label}
          onClick={() => onChange(v)}
          className={`w-8 h-8 rounded border-2 patrick-hand-regular text-sm transition-all cursor-pointer ${
            value === v
              ? "bg-[#333] border-[#333] text-white"
              : "bg-white border-[#ccc] text-[#555] hover:border-[#888]"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

// ── Text size picker ──────────────────────────────────────────────────────────
const TEXT_SIZES: { value: TextSize; label: string; display: string }[] = [
  { value: "xs", label: "Extra small", display: "Aa" },
  { value: "sm", label: "Small",       display: "Aa" },
  { value: "md", label: "Medium",      display: "Aa" },
  { value: "lg", label: "Large",       display: "Aa" },
];

const textSizeStyle: Record<TextSize, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function TextSizePicker({ value, onChange }: { value: TextSize; onChange: (s: TextSize) => void }) {
  return (
    <div className="flex gap-2 items-end">
      {TEXT_SIZES.map(({ value: v, label, display }) => (
        <button
          key={v}
          title={label}
          onClick={() => onChange(v)}
          className={`rounded border-2 patrick-hand-regular transition-all cursor-pointer flex items-center justify-center ${textSizeStyle[v]} ${
            value === v
              ? "bg-[#333] border-[#333] text-white"
              : "bg-white border-[#ccc] text-[#555] hover:border-[#888]"
          }`}
          style={{ width: "2rem", height: "2rem" }}
        >
          {display}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function WriteThought() {
  const navigate = useNavigate();
  const { addThought } = useThoughts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_IMAGES[0].src);
  const [text,          setText         ] = useState("");
  const [alignH,        setAlignH       ] = useState<TextAlignH>("center");
  const [alignV,        setAlignV       ] = useState<TextAlignV>("bottom");
  const [textColor,     setTextColor    ] = useState("#ffffff");
  const [polaroidSize,  setPolaroidSize ] = useState<PolaroidSize>("md");
  const [textSize,      setTextSize     ] = useState<TextSize>("sm");
  const [submitted,     setSubmitted    ] = useState(false);
  const [submitting,    setSubmitting   ] = useState(false);
  const [submitError,   setSubmitError  ] = useState<string | null>(null);

  const previewThought: Thought = {
    id: "preview",
    text: text || "Your thought will appear here...",
    image: selectedImage,
    createdAt: new Date(),
    x: 0, y: 0, rotation: 0,
    alignH, alignV, textColor, polaroidSize, textSize,
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") setSelectedImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedImage(DEFAULT_IMAGES[0].src);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await addThought({ text: text.trim(), image: selectedImage, alignH, alignV, textColor, polaroidSize, textSize });
      setSubmitted(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const isCustomUpload = !DEFAULT_IMAGES.some((d) => d.src === selectedImage);

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
        <h2 className="mx-auto patrick-hand-regular text-2xl text-[#333]">Leave a thought</h2>
      </header>

      {/* Two-panel body */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">

        {/* LEFT — Preview */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-[#f0ebe3] py-10 px-6 gap-4 border-b md:border-b-0 md:border-r border-[#e0d8cc]">
          <p className="gloria-hallelujah-regular text-[#888] text-xs uppercase tracking-widest mb-2">Preview</p>
          <PolaroidCard thought={previewThought} preview />
          <p className="patrick-hand-regular text-[#aaa] text-sm mt-2 text-center">
            This is how your polaroid will look on the wall
          </p>
        </div>

        {/* RIGHT — Edit panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-6 gap-4 overflow-y-auto">

          {/* Choose a photo */}
          <div>
            <label className="patrick-hand-regular text-[#555] text-sm block mb-2">Choose a photo</label>
            <div className="grid grid-cols-3 gap-2 mb-3 max-h-52 overflow-y-auto pr-1">
              {DEFAULT_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.src)}
                  className={`aspect-square rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img.src
                      ? "border-[#333] scale-105 shadow-md"
                      : "border-transparent hover:border-[#999]"
                  }`}
                  title={img.label}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Upload row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-[#bbb] hover:border-[#888] transition-colors rounded-lg py-2 flex items-center justify-center gap-2 text-[#888] hover:text-[#555] patrick-hand-regular text-sm cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload your own photo
              </button>
              {isCustomUpload && (
                <button
                  onClick={handleRemovePhoto}
                  title="Remove uploaded photo"
                  className="border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg p-2 transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>

          {/* Your thought */}
          <div>
            <label className="patrick-hand-regular text-[#555] text-sm block mb-1">Your thought</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Write what you never got to say..."
              className="w-full border border-[#ccc] rounded-lg px-4 py-2 gloria-hallelujah-regular text-[#333] text-sm resize-none focus:outline-none focus:border-[#555] bg-white placeholder:text-[#bbb]"
            />
            <p className="text-right text-xs text-[#bbb] mt-0.5 patrick-hand-regular">{text.length} / 200</p>
          </div>

          {/* ── Controls row: position · colour · size ── */}
          <div className="flex flex-wrap gap-6 items-start">

            {/* Text position */}
            <div>
              <p className="patrick-hand-regular text-[#555] text-sm mb-2">Text position</p>
              <AlignGrid
                alignH={alignH}
                alignV={alignV}
                onChange={(h, v) => { setAlignH(h); setAlignV(v); }}
              />
              <p className="patrick-hand-regular text-[#bbb] text-xs mt-1 capitalize">{alignV} · {alignH}</p>
            </div>

            {/* Text colour */}
            <div>
              <p className="patrick-hand-regular text-[#555] text-sm mb-2">Text color</p>
              <ColorSwatches value={textColor} onChange={setTextColor} />
              <p className="patrick-hand-regular text-[#bbb] text-xs mt-1">{textColor}</p>
            </div>

            {/* Polaroid size */}
            <div>
              <p className="patrick-hand-regular text-[#555] text-sm mb-2">Polaroid size</p>
              <SizePicker value={polaroidSize} onChange={setPolaroidSize} />
              <p className="patrick-hand-regular text-[#bbb] text-xs mt-1 capitalize">
                {SIZES.find(s => s.value === polaroidSize)?.label}
              </p>
            </div>

            {/* Text size */}
            <div>
              <p className="patrick-hand-regular text-[#555] text-sm mb-2">Text size</p>
              <TextSizePicker value={textSize} onChange={setTextSize} />
              <p className="patrick-hand-regular text-[#bbb] text-xs mt-1 capitalize">
                {TEXT_SIZES.find(s => s.value === textSize)?.label}
              </p>
            </div>

          </div>

          {/* Submit */}
          {submitError && (
            <p className="text-red-400 text-xs patrick-hand-regular text-center">{submitError}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || submitted || submitting}
            className={`w-full py-2 rounded-full patrick-hand-regular text-base transition-all duration-300 ${
              submitted
                ? "bg-green-500 text-white"
                : submitting
                ? "bg-[#888] text-white cursor-wait"
                : text.trim()
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

export default WriteThought;