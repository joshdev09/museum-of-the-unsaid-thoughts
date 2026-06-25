export type TextAlignH = "left" | "center" | "right";
export type TextAlignV = "top" | "middle" | "bottom";
export type PolaroidSize = "sm" | "md" | "lg";
export type TextSize = "xs" | "sm" | "md" | "lg";

export interface Thought {
  id: string;
  text: string;
  image: string;
  createdAt: Date;
  x: number;
  y: number;
  rotation: number;
  alignH: TextAlignH;
  alignV: TextAlignV;
  textColor: string;     
  polaroidSize: PolaroidSize;
  textSize: TextSize;
}