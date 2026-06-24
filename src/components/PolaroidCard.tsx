import { type Thought, type TextAlignH, type TextAlignV } from "../types/thought";

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

function PolaroidCard({ thought, preview = false }: PolaroidCardProps) {
  const size = preview ? "w-62 h-80" : "w-44 md:w-52";
  const alignH = thought.alignH ?? "center";
  const alignV = thought.alignV ?? "bottom";

  return (
    <div
      className={`${size} bg-white shadow-xl flex flex-col`}
      style={{
        transform: preview ? "none" : `rotate(${thought.rotation}deg)`,
        padding: "10px 10px 36px 10px",
        boxShadow: "2px 4px 16px rgba(0,0,0,0.18)",
      }}
    >
      {/* Photo area — text overlays the image */}
      <div className="w-full aspect-square overflow-hidden bg-gray-100 relative">
        <img
          src={thought.image}
          alt="polaroid"
          className="w-full h-full object-cover"
        />

        {/* Text overlay */}
        {thought.text && (
          <div
            className={`absolute inset-0 flex flex-col px-2 py-2 ${vJustifyClass[alignV]} ${hAlignClass[alignH]}`}
          >
            <p
              className="gloria-hallelujah-regular leading-snug"
              style={{
                fontSize: preview ? "9px" : "8px",
                color: "#fff",
                textShadow: "0 1px 4px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)",
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {thought.text}
            </p>
          </div>
        )}
      </div>

      {/* Keep the white strip clean — no text here anymore */}
    </div>
  );
}

export default PolaroidCard;