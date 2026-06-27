import type { VercelRequest, VercelResponse } from "@vercel/node";
import sql from "../src/storage/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    try {
      const rows = await sql`
        SELECT id, title, text, font, palette, created_at AS "createdAt"
        FROM rants ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    } catch (err) {
      console.error("GET /api/rants:", err);
      return res.status(500).json({ error: "Failed to load rants" });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, text, font, palette } = req.body;
      if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
      if (!text?.trim())  return res.status(400).json({ error: "Text is required" });
      if (text.length > 2000) return res.status(400).json({ error: "Text too long" });

      const [row] = await sql`
        INSERT INTO rants (title, text, font, palette)
        VALUES (${title.trim()}, ${text.trim()}, ${font ?? "gloria"}, ${palette ?? "parchment"})
        RETURNING id, title, text, font, palette, created_at AS "createdAt"
      `;
      return res.status(201).json(row);
    } catch (err) {
      console.error("POST /api/rants:", err);
      return res.status(500).json({ error: "Failed to save rant" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
