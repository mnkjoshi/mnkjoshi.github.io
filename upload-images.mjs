/**
 * upload-images.mjs
 *
 * Uploads project display images to Firebase Storage,
 * then updates each Firestore project doc with the download URL.
 *
 * Run:  node upload-images.mjs
 */

import { readFileSync } from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { config } from "dotenv";

config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Map: Firestore project id → local image filename
const IMAGE_MAP = {
  safetyvision: "SafetyVision.png",
  citiwatch: "CitiWatch.png",
  loopcar: "LoopCar.jpg",
  watchdog: "WatchDog.png",
  "gamee-lite": "GamEE.png",
  vitalisee: "VitaliSee.png",
  utilisee: "UtiliSee.png",
};

const DISPLAYS_DIR = "src/assets/displays";

async function uploadImages() {
  console.log("📸 Uploading project images to Firebase Storage...\n");

  for (const [projectId, filename] of Object.entries(IMAGE_MAP)) {
    const filePath = `${DISPLAYS_DIR}/${filename}`;
    const buffer = readFileSync(filePath);

    // Determine content type
    const ext = filename.split(".").pop().toLowerCase();
    const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";

    // Upload to Storage under displays/<filename>
    const storageRef = ref(storage, `displays/${filename}`);
    await uploadBytes(storageRef, buffer, { contentType });
    console.log(`  ✅ Uploaded: displays/${filename}`);

    // Get the public download URL
    const url = await getDownloadURL(storageRef);
    console.log(`     URL: ${url.slice(0, 80)}...`);

    // Update the Firestore project document
    await updateDoc(doc(db, "projects", projectId), { image: url });
    console.log(`     → Updated projects/${projectId}.image\n`);
  }

  console.log("✨ All images uploaded and Firestore updated!");
  process.exit(0);
}

uploadImages().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
