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

// Canvas sizes (wall display)
const sizeClass: Record<PolaroidSize, string> = {
  sm: "w-32 md:w-36",
  md: "w-44 md:w-52",
  lg: "w-56 md:w-64",
};

// Base font sizes per polaroid size — textSize multiplies on top of these
const baseFontPx: Record<PolaroidSize, number> = {
  sm: 7,
  md: 8,
  lg: 10,
};

// Multipliers for each text size option
const textSizeMultiplier: Record<TextSize, number> = {
  xs: 0.75,
  sm: 1,
  md: 1.4,
  lg: 1.85,
};

function PolaroidCard({ thought, preview = false }: PolaroidCardProps) {
  const alignH       = thought.alignH       ?? "center";
  const alignV       = thought.alignV       ?? "bottom";
  const textColor    = thought.textColor    ?? "#ffffff";
  const polaroidSize = thought.polaroidSize ?? "md";
  const textSize     = thought.textSize     ?? "sm";

  // Preview scales with the chosen polaroid size
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

  const wrapClass  = preview ? previewSizeClass[polaroidSize] : sizeClass[polaroidSize];
  const basePx     = preview ? previewBasePx[polaroidSize] : baseFontPx[polaroidSize];
  const fontSize   = `${(basePx * textSizeMultiplier[textSize]).toFixed(1)}px`;

  // Dark text needs a light shadow and vice-versa
  const isDark = textColor === "#000000" || textColor === "#1a1a1a" || textColor === "#333333";
  const textShadow = isDark
    ? "0 1px 3px rgba(255,255,255,0.8), 0 0 2px rgba(255,255,255,0.6)"
    : "0 1px 4px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)";

  return (
    <div
      className={`${wrapClass} bg-white shadow-xl flex flex-col`}
      style={{
        transform: preview ? "none" : `rotate(${thought.rotation}deg)`,
        padding: "10px 10px 36px 10px",
        boxShadow: "2px 4px 16px rgba(0,0,0,0.18)",
      }}
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
              style={{
                fontSize,
                color: textColor,
                textShadow,
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {thought.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PolaroidCard;