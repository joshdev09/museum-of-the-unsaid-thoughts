export type TextAlignH = "left" | "center" | "right";
export type TextAlignV = "top" | "middle" | "bottom";

export interface Thought {
  id: string;
  text: string;
  image: string; // base64 or URL
  createdAt: Date;
  x: number; // position on canvas
  y: number;
  rotation: number; // slight random tilt for polaroid feel
  alignH: TextAlignH;
  alignV: TextAlignV;
}