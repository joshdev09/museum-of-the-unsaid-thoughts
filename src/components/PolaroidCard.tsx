import { useState, useRef, useEffect, useCallback } from "react";
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

// ── Draggable Modal ────────────────────────────────────────────────────────────
function PolaroidModal({ thought, onClose }: { thought: Thought; onClose: () => void }) {
  const modalRef   = useRef<HTMLDivElement>(null);
  const dragState  = useRef({ dragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
  const [pos,       setPos      ] = useState({ x: 0, y: 0 });
  const [rotation,  setRotation ] = useState(0);
  const [flipped,   setFlipped  ] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const alignH    = thought.alignH    ?? "center";
  const alignV    = thought.alignV    ?? "bottom";
  const textColor = thought.textColor ?? "#ffffff";
  const isDark    = ["#000000","#1a1a1a","#333333"].includes(textColor);
  const textShadow = isDark
    ? "0 1px 3px rgba(255,255,255,0.8)"
    : "0 1px 4px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)";

  // ── Pointer drag (mouse + touch) ──────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      dragging: true,
      startX: e.clientX - pos.x,
      startY: e.clientY - pos.y,
      offsetX: pos.x,
      offsetY: pos.y,
    };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    setPos({
      x: e.clientX - dragState.current.startX,
      y: e.clientY - dragState.current.startY,
    });
  };

  const onPointerUp = () => { dragState.current.dragging = false; setIsDragging(false); };

  // ── Keyboard: Escape closes, arrow keys nudge ─────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft")  setPos(p => ({ ...p, x: p.x - 10 }));
    if (e.key === "ArrowRight") setPos(p => ({ ...p, x: p.x + 10 }));
    if (e.key === "ArrowUp")    setPos(p => ({ ...p, y: p.y - 10 }));
    if (e.key === "ArrowDown")  setPos(p => ({ ...p, y: p.y + 10 }));
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const modalFontSize = "13px";

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", touchAction: "none" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Draggable polaroid */}
      <div
        ref={modalRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative select-none"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`,
          cursor: isDragging ? "grabbing" : "grab",
          transition: isDragging ? "none" : "transform 0.15s ease",
          touchAction: "none",
          width: "min(80vw, 380px)",
        }}
      >
        {/* Polaroid frame */}
        <div
          className="bg-white w-full"
          style={{
            padding: "14px 14px 56px 14px",
            boxShadow: "4px 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {/* Photo */}
          <div
            className="w-full relative overflow-hidden"
            style={{ aspectRatio: "1/1" }}
          >
            <img
              src={thought.image}
              alt="polaroid"
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Text overlay */}
            {thought.text && !flipped && (
              <div
                className={`absolute inset-0 flex flex-col px-3 py-3 ${vJustifyClass[alignV]} ${hAlignClass[alignH]}`}
              >
                <p
                  className="gloria-hallelujah-regular leading-relaxed"
                  style={{ fontSize: modalFontSize, color: textColor, textShadow, wordBreak: "break-word", maxWidth: "100%" }}
                >
                  {thought.text}
                </p>
              </div>
            )}
          </div>

          {/* White strip — date */}
          <div className="flex items-end justify-between pt-2 px-1">
            <p className="patrick-hand-regular text-[#aaa] text-xs">
              {new Date(thought.createdAt).toLocaleDateString("en-PH", {
                month: "short", day: "numeric", year: "numeric"
              })}
            </p>
            <p className="patrick-hand-regular text-[#ccc] text-[10px] italic">
              museum of the unsaid
            </p>
          </div>
        </div>

        {/* ── Controls bar ── */}
        <div
          className="flex items-center justify-between mt-4 px-1 gap-3"
          style={{ touchAction: "manipulation" }}
          data-no-drag
        >
          {/* Rotate left */}
          <button
            data-no-drag
            onClick={() => setRotation(r => r - 15)}
            className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 text-white flex items-center justify-center transition-colors"
            title="Rotate left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"/>
            </svg>
          </button>

          {/* Reset position */}
          <button
            data-no-drag
            onClick={() => { setPos({ x: 0, y: 0 }); setRotation(0); }}
            className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 text-white flex items-center justify-center transition-colors"
            title="Reset position"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
          </button>

          {/* Rotate right */}
          <button
            data-no-drag
            onClick={() => setRotation(r => r + 15)}
            className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 text-white flex items-center justify-center transition-colors"
            title="Rotate right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"/>
            </svg>
          </button>

          {/* Close */}
          <button
            data-no-drag
            onClick={onClose}
            className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 text-white flex items-center justify-center transition-colors"
            title="Close (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Drag hint */}
        <p className="text-center text-white/40 text-xs patrick-hand-regular mt-3 pointer-events-none select-none">
          {isTouchDevice ? "drag to move" : "drag to move · arrow keys to nudge"}
        </p>
      </div>
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
        className={`${wrapClass} bg-white shadow-xl flex flex-col ${!preview ? "cursor-pointer" : ""}`}
        style={{
          transform: preview ? "none" : `rotate(${thought.rotation}deg)`,
          padding: "10px 10px 36px 10px",
          boxShadow: "2px 4px 16px rgba(0,0,0,0.18)",
        }}
        onClick={() => !preview && setModalOpen(true)}
        role={!preview ? "button" : undefined}
        tabIndex={!preview ? 0 : undefined}
        onKeyDown={(e) => { if (!preview && e.key === "Enter") setModalOpen(true); }}
        title={!preview ? "Click to inspect" : undefined}
      >
        <div className="w-full aspect-square overflow-hidden bg-gray-100 relative">
          <img
            src={thought.image}
            alt="polaroid"
            className="w-full h-full object-cover"
          />
          {thought.text && (
            <div
              className={`absolute inset-0 flex flex-col px-2 py-2 ${vJustifyClass[alignV]} ${hAlignClass[alignH]}`}
            >
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