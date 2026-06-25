import { createClient } from "@supabase/supabase-js";

// Use the anon/public key — no auth needed, bucket is public
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const BUCKET = "polaroid-images";

/**
 * Uploads a base64 data URI or File to Supabase Storage.
 * Returns the permanent public URL.
 */
export async function uploadImage(
  imageData: string | File,
  fileName: string
): Promise<string> {
  let blob: Blob;

  if (typeof imageData === "string" && imageData.startsWith("data:")) {
    // Convert base64 data URI → Blob
    const [meta, b64] = imageData.split(",");
    const mime = meta.match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    blob = new Blob([bytes], { type: mime });
  } else if (typeof imageData === "string") {
    // Already a URL (default image) — return as-is, no upload needed
    return imageData;
  } else {
    blob = imageData;
  }

  const path = `${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type, upsert: false });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
