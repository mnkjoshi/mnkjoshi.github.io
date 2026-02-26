/**
 * Cloudinary unsigned upload helper.
 * Uses the free-tier Upload API — no server or SDK needed.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a File/Blob to Cloudinary.
 * @param {File} file - The image file to upload.
 * @param {string} [folder="portfolio"] - Optional Cloudinary folder.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export async function uploadImage(file, folder = "mnkjoshi") {
  console.log("Cloudinary Config:", { CLOUD_NAME, UPLOAD_PRESET, UPLOAD_URL });
  
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET);
  body.append("folder", folder);

  const res = await fetch(UPLOAD_URL, { method: "POST", body });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}
