import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  dummyProjects,
  dummyHackathons,
  dummyBlogs,
  dummyExperiences,
  dummyLeadership,
} from "../data/dummy";
import { DISPLAY_MAP } from "../data/assetMap";

// Map collection names to dummy datasets
const DUMMY_MAP = {
  projects: dummyProjects,
  hackathons: dummyHackathons,
  blogs: dummyBlogs,
  experiences: dummyExperiences,
  leadership: dummyLeadership,
};

// Attach local display images to project docs fetched from Firestore
function enrichProjects(docs) {
  return docs.map((d) => ({
    ...d,
    image: d.image || DISPLAY_MAP[d.id] || null,
  }));
}

// ---------- Generic collection hook ----------
export function useCollection(collectionName, orderField = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // Call refetch() to re-run the query without a full page reload
  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    async function fetch() {
      try {
        const ref = collection(db, collectionName);
        const q = orderField
          ? query(ref, orderBy(orderField, "desc"))
          : ref;
        const snap = await getDocs(q);
        let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (!docs.length) docs = DUMMY_MAP[collectionName] || [];
        // Attach local images to project docs
        if (collectionName === "projects") docs = enrichProjects(docs);
        // Sort by order field so admin-defined ordering is respected everywhere
        docs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setData(docs);
      } catch (err) {
        console.warn(`Firestore unavailable for "${collectionName}", using dummy data.`);
        setData(DUMMY_MAP[collectionName] || []);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [collectionName, orderField, tick]);

  return { data, loading, refetch };
}

// ---------- Single document hook ----------
export function useDocument(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docId) return;
    async function fetch() {
      try {
        const snap = await getDoc(doc(db, collectionName, docId));
        if (snap.exists()) {
          const d = { id: snap.id, ...snap.data() };
          // Attach local image for projects
          if (collectionName === "projects") d.image = d.image || DISPLAY_MAP[d.id] || null;
          setData(d);
        } else {
          // Fall back to dummy data for single doc lookup
          const dummy = (DUMMY_MAP[collectionName] || []).find((d) => d.id === docId);
          if (dummy) setData(dummy);
        }
      } catch (err) {
        console.warn(`Firestore unavailable for "${collectionName}/${docId}", using dummy data.`);
        const dummy = (DUMMY_MAP[collectionName] || []).find((d) => d.id === docId);
        if (dummy) setData(dummy);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [collectionName, docId]);

  return { data, loading };
}

// ---------- CRUD helpers ----------
export async function addDocument(collectionName, data) {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateDocument(collectionName, docId, data) {
  return updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName, docId) {
  return deleteDoc(doc(db, collectionName, docId));
}
