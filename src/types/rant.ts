export type RantFont = "gloria" | "patrick" | "nanum" | "serif" | "mono";
export type RantPalette =
  | "parchment"   // warm cream
  | "dusk"        // soft lavender-gray
  | "fog"         // cool mist
  | "blush"       // soft pink
  | "charcoal"    // dark moody
  | "sage"        // muted green
  | "preset-letter"   // pre-designed: aged letter
  | "preset-night"    // pre-designed: dark night journal
  | "preset-retro";   // pre-designed: retro newspaper

export interface Rant {
  id: string;
  title: string;
  text: string;
  font: RantFont;
  palette: RantPalette;
  createdAt: Date;
}
