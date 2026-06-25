import { useState, useEffect, useCallback } from "react";
import { type Thought, type TextAlignH, type TextAlignV, type PolaroidSize, type TextSize } from "../types/thought";

interface PolaroidCardProps {
  thought: Thought;
  preview?: boolean;
}

const hAlignClass: Record<TextAlignH, string> = {
  left:   "items-start text-left",
  center: "items-center text-center",
  right:  "items-end text-right",
};

const vJustifyClass: Record<TextAlignV, string> = {
  top:    "justify-start",
  middle: "justify-center",
  bottom: "justify-end",
};

const sizeClass: Record<PolaroidSize, string> = {
  sm: "w-32 md:w-36",
  md: "w-44 md:w-52",
  lg: "w-56 md:w-64",
};

const baseFontPx: Record<PolaroidSize, number> = {
  sm: 7,
  md: 8,
  lg: 10,
};

const textSizeMultiplier: Record<TextSize, number> = {
  xs: 0.75,
  sm: 1,
  md: 1.4,
  lg: 1.85,
};

// ── 3D Inspectable Modal ───────────────────────────────────────────────────────
function PolaroidModal({ thought, onClose }: { thought: Thought; onClose: () => void }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const alignH    = thought.alignH    ?? "center";
  const alignV    = thought.alignV    ?? "bottom";
  const textColor = thought.textColor ?? "#ffffff";
  const isDark    = ["#000000","#1a1a1a","#333333"].includes(textColor);
  const textShadow = isDark
    ? "0 1px 3px rgba(255,255,255,0.8)"
    : "0 1px 4px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)";

  // ── 3D Rotation Interaction ───────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent dragging if they click the close button
    if ((e.target as HTMLElement).closest("button")) return;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    // Track Y infinitely for full spinning, clamp X to prevent flipping upside down over the top
    const newRotateY = rotation.y + dx * 0.5;
    const newRotateX = Math.max(-35, Math.min(35, rotation.x - dy * 0.5));

    setRotation({ x: newRotateX, y: newRotateY });
    setDragStart({ x: e.clientX, y: e.clientY }); // Reset start to make it continuous delta
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);

    // Snap to the nearest face (front or back) when released
    const currentY = rotation.y;
    const normalizedY = currentY % 360;
    let targetY = currentY - normalizedY; // base 360 block

    if (normalizedY > 90 && normalizedY <= 270) targetY += 180;
    else if (normalizedY < -90 && normalizedY >= -270) targetY -= 180;
    else if (normalizedY > 270) targetY += 360;
    else if (normalizedY < -270) targetY -= 360;

    setRotation({ x: 0, y: targetY }); // Snaps back to exactly 0 or 180
  };

  // ── Keyboard Support ──────────────────────────────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", touchAction: "none" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Absolute Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 active:bg-white/40 text-white flex items-center justify-center transition-colors z-50 backdrop-blur-md"
        title="Close (Esc)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>
      </button>

      {/* 3D Scene Wrapper */}
      <div
        className="relative w-[min(85vw,380px)] cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: "1200px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* The Rotating Card */}
        <div
          className="w-full relative"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            // No transition while dragging for instant response; smooth transition when snapping back
            transition: isDragging ? "none" : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* ── FRONT FACE ── */}
          <div
            className="bg-white w-full relative"
            style={{
              backfaceVisibility: "hidden",
              padding: "14px 14px 56px 14px",
              boxShadow: isDragging ? "0 35px 60px -15px rgba(0, 0, 0, 0.8)" : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <div className="w-full relative overflow-hidden bg-gray-100" style={{ aspectRatio: "1/1" }}>
              <img
                src={thought.image}
                alt="polaroid"
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
              {thought.text && (
                <div className={`absolute inset-0 flex flex-col px-3 py-3 ${vJustifyClass[alignV]} ${hAlignClass[alignH]}`}>
                  <p
                    className="gloria-hallelujah-regular leading-relaxed pointer-events-none"
                    style={{ fontSize: "14px", color: textColor, textShadow, wordBreak: "break-word", maxWidth: "100%" }}
                  >
                    {thought.text}
                  </p>
                </div>
              )}
            </div>
            {/* Signature */}
            <div className="flex items-end justify-end pt-2 px-1">
              <p className="patrick-hand-regular text-[#ccc] text-[10px] italic">museum of the unsaid</p>
            </div>
          </div>

          {/* ── BACK FACE ── */}
          <div
            className="absolute inset-0 bg-[#f4f4f4] flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              padding: "14px",
              boxShadow: isDragging ? "0 35px 60px -15px rgba(0, 0, 0, 0.8)" : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <div className="w-full h-full border-2 border-gray-200/60 bg-[#ececec] flex flex-col items-center justify-center p-6 gap-4">
              <p className="patrick-hand-regular text-gray-500/80 text-xl uppercase tracking-widest border-b border-gray-300 pb-2 mb-2">
                Memory Captured
              </p>
              <p className="patrick-hand-regular text-gray-700 text-3xl">
                {new Date(thought.createdAt).toLocaleDateString("en-PH", {
                  month: "long", day: "numeric", year: "numeric"
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Hint */}
      <p className="absolute bottom-12 text-center text-white/50 tracking-widest uppercase text-xs md:text-sm font-bold pointer-events-none drop-shadow-md">
        {isTouchDevice ? "[ drag to inspect ]" : "[ click & drag to inspect ]"}
      </p>
    </div>
  );
}

// ── PolaroidCard ───────────────────────────────────────────────────────────────
function PolaroidCard({ thought, preview = false }: PolaroidCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const alignH       = thought.alignH       ?? "center";
  const alignV       = thought.alignV       ?? "bottom";
  const textColor    = thought.textColor    ?? "#ffffff";
  const polaroidSize = thought.polaroidSize ?? "md";
  const textSize     = thought.textSize     ?? "sm";

  const previewSizeClass: Record<PolaroidSize, string> = {
    sm: "w-36",
    md: "w-56",
    lg: "w-72",
  };
  const previewBasePx: Record<PolaroidSize, number> = {
    sm: 7,
    md: 9,
    lg: 11,
  };

  const wrapClass = preview ? previewSizeClass[polaroidSize] : sizeClass[polaroidSize];
  const basePx    = preview ? previewBasePx[polaroidSize] : baseFontPx[polaroidSize];
  const fontSize  = `${(basePx * textSizeMultiplier[textSize]).toFixed(1)}px`;

  const isDark = ["#000000","#1a1a1a","#333333"].includes(textColor);
  const textShadow = isDark
    ? "0 1px 3px rgba(255,255,255,0.8), 0 0 2px rgba(255,255,255,0.6)"
    : "0 1px 4px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)";

  return (
    <>
      <div
        className={`${wrapClass} bg-white shadow-xl flex flex-col ${!preview ? "cursor-pointer hover:scale-105 hover:-translate-y-2 transition-all duration-300" : ""}`}
        style={{
          transform: preview ? "none" : `rotate(${thought.rotation}deg)`,
          padding: "10px 10px 36px 10px",
          boxShadow: "2px 4px 16px rgba(0,0,0,0.18)",
        }}
        onClick={() => !preview && setModalOpen(true)}
      >
        <div className="w-full aspect-square overflow-hidden bg-gray-100 relative">
          <img src={thought.image} alt="polaroid" className="w-full h-full object-cover" />
          {thought.text && (
            <div className={`absolute inset-0 flex flex-col px-2 py-2 ${vJustifyClass[alignV]} ${hAlignClass[alignH]}`}>
              <p
                className="gloria-hallelujah-regular leading-snug"
                style={{ fontSize, color: textColor, textShadow, maxWidth: "100%", wordBreak: "break-word" }}
              >
                {thought.text}
              </p>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <PolaroidModal thought={thought} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

export default PolaroidCard;