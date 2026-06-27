import type { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../src/storage/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
  if (req.method === "OPTIONS") return res.status(204).end();

  // ── GET — load all polaroids ──────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const rows = await sql`
        SELECT
          id, text,
          image_url     AS image,
          align_h       AS "alignH",
          align_v       AS "alignV",
          text_color    AS "textColor",
          text_size     AS "textSize",
          polaroid_size AS "polaroidSize",
          x, y, rotation,
          created_at    AS "createdAt"
        FROM thoughts
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    } catch (err) {
      console.error("GET /api/thoughts:", err);
      return res.status(500).json({ error: "Failed to load thoughts" });
    }
  }

  // ── POST — save a new polaroid ────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const { text, image, alignH, alignV, textColor, textSize, polaroidSize } = req.body;

      if (!text?.trim())  return res.status(400).json({ error: "Text is required" });
      if (!image?.trim()) return res.status(400).json({ error: "Image URL is required" });

      const x        = Math.random() * 60 + 5;
      const y        = Math.random() * 55 + 5;
      const rotation = (Math.random() - 0.5) * 12;

      const [row] = await sql`
        INSERT INTO thoughts
          (text, image_url, align_h, align_v, text_color, text_size, polaroid_size, x, y, rotation)
        VALUES
          (${text.trim()}, ${image}, ${alignH ?? "center"}, ${alignV ?? "bottom"},
           ${textColor ?? "#ffffff"}, ${textSize ?? "sm"}, ${polaroidSize ?? "md"},
           ${x}, ${y}, ${rotation})
        RETURNING
          id, text,
          image_url     AS image,
          align_h       AS "alignH",
          align_v       AS "alignV",
          text_color    AS "textColor",
          text_size     AS "textSize",
          polaroid_size AS "polaroidSize",
          x, y, rotation,
          created_at    AS "createdAt"
      `;

      return res.status(201).json(row);
    } catch (err) {
      console.error("POST /api/thoughts:", err);
      return res.status(500).json({ error: "Failed to save thought" });
    }
  }

  // ── DELETE — remove a polaroid (admin only) ───────────────────────────
  if (req.method === "DELETE") {
    // Verify admin key from request header
    const adminKey = req.headers["x-admin-key"];
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID is required" });

    try {
      const result = await sql`
        DELETE FROM thoughts WHERE id = ${id}
        RETURNING id
      `;
      if (result.length === 0) {
        return res.status(404).json({ error: "Thought not found" });
      }
      return res.status(200).json({ deleted: id });
    } catch (err) {
      console.error("DELETE /api/thoughts:", err);
      return res.status(500).json({ error: "Failed to delete thought" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}