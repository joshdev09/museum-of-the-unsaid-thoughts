import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BUCKET = "polaroid-images";
const MAX_DIMENSION = 1200; // px — enough for a polaroid, keeps file small
const QUALITY = 0.82;       // jpeg quality

/**
 * Compress an image File/Blob via canvas before uploading.
 * Keeps aspect ratio, caps longest side at MAX_DIMENSION.
 */
function compressImage(file: File | Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: w, naturalHeight: h } = img;
      const scale = Math.min(1, MAX_DIMENSION / Math.max(w, h));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error("Canvas toBlob failed")),
        "image/jpeg",
        QUALITY
      );
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

/**
 * Upload an image directly from the browser to Supabase Storage.
 * Accepts: File (user upload) or base64 data URI string (default images are URLs, skipped).
 * Returns the permanent public URL.
 */
export async function uploadImageToStorage(
  imageData: string | File | Blob
): Promise<string> {
  // Default images are already plain URLs — no upload needed
  if (typeof imageData === "string" && !imageData.startsWith("data:")) {
    return imageData;
  }

  let sourceBlob: Blob;

  if (typeof imageData === "string") {
    // base64 data URI → Blob
    const [meta, b64] = imageData.split(",");
    const mime = meta.match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    sourceBlob = new Blob([bytes], { type: mime });
  } else {
    sourceBlob = imageData;
  }

  // Compress before upload — this is what kills the 4.5MB Vercel limit
  const compressed = await compressImage(sourceBlob);

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, { contentType: "image/jpeg", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}