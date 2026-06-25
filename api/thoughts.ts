import type { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../src/storage/db";
import { uploadImage } from "../src/storage/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow requests from your frontend origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  // ── GET /api/thoughts — load all polaroids for the wall ──────────────────
  if (req.method === "GET") {
    try {
      const rows = await sql`
        SELECT
          id,
          text,
          image_url   AS image,
          align_h     AS "alignH",
          align_v     AS "alignV",
          text_color  AS "textColor",
          text_size   AS "textSize",
          polaroid_size AS "polaroidSize",
          x, y, rotation,
          created_at  AS "createdAt"
        FROM thoughts
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    } catch (err) {
      console.error("GET /api/thoughts error:", err);
      return res.status(500).json({ error: "Failed to load thoughts" });
    }
  }

  // ── POST /api/thoughts — submit a new polaroid ───────────────────────────
  if (req.method === "POST") {
    try {
      const { text, image, alignH, alignV, textColor, textSize, polaroidSize } = req.body;

      if (!text?.trim()) {
        return res.status(400).json({ error: "Text is required" });
      }

      // Upload image to Supabase Storage (returns permanent URL)
      const imageUrl = await uploadImage(image, `thought-${Date.now()}.jpg`);

      // Random canvas position + rotation — generated server-side so all
      // visitors see the same layout
      const x        = Math.random() * 60 + 5;
      const y        = Math.random() * 55 + 5;
      const rotation = (Math.random() - 0.5) * 12;

      const [row] = await sql`
        INSERT INTO thoughts
          (text, image_url, align_h, align_v, text_color, text_size, polaroid_size, x, y, rotation)
        VALUES
          (${text.trim()}, ${imageUrl}, ${alignH}, ${alignV}, ${textColor}, ${textSize}, ${polaroidSize}, ${x}, ${y}, ${rotation})
        RETURNING
          id,
          text,
          image_url   AS image,
          align_h     AS "alignH",
          align_v     AS "alignV",
          text_color  AS "textColor",
          text_size   AS "textSize",
          polaroid_size AS "polaroidSize",
          x, y, rotation,
          created_at  AS "createdAt"
      `;

      return res.status(201).json(row);
    } catch (err) {
      console.error("POST /api/thoughts error:", err);
      return res.status(500).json({ error: "Failed to save thought" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
