import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import SectionHeading from "../components/SectionHeading";
import Loader from "../components/Loader";
import { useCollection } from "../hooks/useFirestore";
import {
  addDocument,
  updateDocument,
  deleteDocument,
} from "../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import { uploadImage } from "../utils/cloudinary";
import {
  FiUpload,
  FiCheck,
  FiCode,
  FiList,
  FiCopy,
  FiMenu,
  FiChevronUp,
  FiChevronDown,
  FiTrash2,
  FiEdit3,
} from "react-icons/fi";

// ─── Helper: Create URL-safe slug from title ───
function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, "-")   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "");   // Remove leading/trailing hyphens
}

// ─── Styles ───
const inputCls =
  "w-full bg-obsidian border border-white/[0.1] focus:border-cyber/60 rounded-lg px-3 py-2 text-xs outline-none transition-colors text-text_primary placeholder:text-text_muted/50";
const btnPrimary =
  "bg-cyber/90 text-obsidian font-fira font-semibold rounded-lg px-4 py-2 text-xs hover:bg-cyber transition-colors disabled:opacity-40";
const btnSecondary =
  "border border-white/[0.12] text-text_muted rounded-lg px-4 py-2 text-xs font-fira hover:border-cyber/40 hover:text-cyber transition-colors";

// ─── JSON Templates ───
const JSON_TEMPLATES = {
  projects: {
    title: "",
    tagline: "",
    description: "",
    image: "",
    stack: [{ logo: 0, title: "React" }],
    live: "",
    yt: "",
    github: "",
    featured: false,
  },
  hackathons: {
    name: "",
    date: "YYYY-MM-DD",
    description: "",
    placement: "",
    isWinner: false,
    featured: false,
    logo: "",
    projectLink: "/project/slug",
  },
};

// ──────────── Login Form ────────────
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-sm mx-auto mt-20">
        <SectionHeading title="Admin Login" />
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            required
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" className={btnPrimary}>
            Sign In
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

// ──────────── CRUD Section ────────────
function CrudSection({
  title,
  collectionName,
  fields,
  requiredKeys = [],
  jsonEnabled = false,
}) {
  const { data, loading, refetch } = useCollection(collectionName);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState({});
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [copied, setCopied] = useState(false);

  // ─── Drag state ───
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  // ── Local data for optimistic updates ──
  const [localData, setLocalData] = useState(null);

  // Sync localData when server data changes
  useEffect(() => {
    setLocalData(null);
  }, [data]);

  // ── Sort data by order field ──
  const sorted = [...(localData ?? data)].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  function resetForm() {
    setForm({});
    setEditingId(null);
    setJsonText("");
    setJsonError("");
    setValidationErrors([]);
  }

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(key, file) {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const url = await uploadImage(file, collectionName);
      handleChange(key, url);
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  }

  function prepareData(source = form) {
    const prepared = {};
    fields.forEach((f) => {
      const val = source[f.key];
      if (f.type === "boolean") {
        prepared[f.key] = val === true || val === "true";
      } else if (f.type === "timestamp") {
        prepared[f.key] = val ? Timestamp.fromDate(new Date(val)) : null;
      } else if (f.type === "points") {
        prepared[f.key] =
          typeof val === "string"
            ? val.split(";").map((s) => s.trim()).filter(Boolean)
            : val || [];
      } else if (f.type === "array") {
        prepared[f.key] =
          typeof val === "string"
            ? val.split(",").map((s) => s.trim()).filter(Boolean)
            : val || [];
      } else if (f.type === "stack") {
        try {
          prepared[f.key] =
            typeof val === "string" ? JSON.parse(val) : val || [];
        } catch {
          prepared[f.key] = [];
        }
      } else if (f.type === "image") {
        prepared[f.key] = val || "";
      } else {
        prepared[f.key] = val ?? "";
      }
    });
    return prepared;
  }

  function validate(data) {
    const errors = [];
    requiredKeys.forEach((key) => {
      const val = data[key];
      if (!val || (typeof val === "string" && !val.trim()) || (Array.isArray(val) && val.length === 0)) {
        const field = fields.find((f) => f.key === key);
        errors.push(field?.label || key);
      }
    });
    return errors;
  }

  // ─── Parse JSON and convert to form ───
  function parseJsonToForm(text) {
    setJsonError("");
    try {
      const obj = JSON.parse(text);
      const formData = {};
      fields.forEach((f) => {
        let val = obj[f.key];
        if (val === undefined || val === null) {
          formData[f.key] = "";
          return;
        }
        if (f.type === "timestamp") {
          formData[f.key] = typeof val === "string" ? val.slice(0, 10) : "";
        } else if (f.type === "points") {
          formData[f.key] = Array.isArray(val) ? val.join("; ") : String(val);
        } else if (f.type === "array") {
          formData[f.key] = Array.isArray(val) ? val.join(", ") : String(val);
        } else if (f.type === "stack") {
          formData[f.key] = typeof val === "string" ? val : JSON.stringify(val);
        } else if (f.type === "boolean") {
          formData[f.key] = String(!!val);
        } else {
          formData[f.key] = String(val);
        }
      });
      // Auto-detect: if live/yt/github have content, ensure they're set
      setForm(formData);
      return true;
    } catch (err) {
      setJsonError("Invalid JSON: " + err.message);
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // If in JSON mode, parse first
    if (jsonMode && jsonText.trim()) {
      if (!parseJsonToForm(jsonText)) return;
    }

    setBusy(true);
    try {
      // Slight delay to let state settle after parseJsonToForm
      await new Promise((r) => setTimeout(r, 50));
      const prepared = prepareData(jsonMode && jsonText.trim() ? (() => {
        // Re-parse directly for immediate use
        const obj = JSON.parse(jsonText);
        const fd = {};
        fields.forEach((f) => {
          fd[f.key] = obj[f.key] ?? "";
        });
        return fd;
      })() : form);

      // Validate required fields
      const errors = validate(prepared);
      if (errors.length) {
        setValidationErrors(errors);
        setBusy(false);
        return;
      }
      setValidationErrors([]);

      // Set order for new items
      if (!editingId) {
        prepared.order = sorted.length;
      }

      if (editingId) {
        await updateDocument(collectionName, editingId, prepared);
      } else {
        // Generate custom ID from title/name field for projects and hackathons
        let customId = null;
        const titleField = prepared.title || prepared.name;
        if (titleField && collectionName === "projects") {
          customId = createSlug(titleField);
        } else if (titleField && collectionName === "hackathons") {
          // For hackathons, append year from date field
          const slug = createSlug(titleField);
          const year = prepared.date ? new Date(prepared.date.toDate()).getFullYear() : new Date().getFullYear();
          customId = `${slug}-${year}`;
        }
        await addDocument(collectionName, prepared, customId);
      }
      resetForm();
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    await deleteDocument(collectionName, id);
    refetch();
  }

  function startEdit(item) {
    setJsonMode(false);
    const formData = {};
    fields.forEach((f) => {
      let val = item[f.key];
      if (f.type === "timestamp" && val?.toDate) {
        val = val.toDate().toISOString().slice(0, 10);
      } else if (f.type === "timestamp" && typeof val === "string") {
        val = val.slice(0, 10);
      } else if (f.type === "points" && Array.isArray(val)) {
        val = val.join("; ");
      } else if (f.type === "array" && Array.isArray(val)) {
        val = val.join(", ");
      } else if (f.type === "stack") {
        val = JSON.stringify(val, null, 2);
      }
      formData[f.key] = val ?? "";
    });
    setForm(formData);
    setEditingId(item.id);
  }

  // ─── Copy JSON Template ───
  function copyTemplate() {
    const tpl = JSON_TEMPLATES[collectionName];
    if (!tpl) return;
    navigator.clipboard.writeText(JSON.stringify(tpl, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ─── Drag-and-drop reordering (optimistic) ───
  function applyNewOrder(reordered) {
    // Optimistic: update local state instantly
    const updated = reordered.map((item, i) => ({ ...item, order: i }));
    setLocalData(updated);
    // Persist to Firestore in background
    Promise.all(
      reordered.map((item, i) =>
        item.order !== i
          ? updateDocument(collectionName, item.id, { order: i })
          : null
      )
    ).catch((err) => {
      console.error("Order save failed:", err);
      refetch(); // revert to server state on error
    });
  }

  function handleDrop(targetIdx) {
    if (dragIdx === null || dragIdx === targetIdx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const reordered = [...sorted];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    setDragIdx(null);
    setOverIdx(null);
    applyNewOrder(reordered);
  }

  function moveItem(idx, direction) {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[idx], reordered[targetIdx]] = [reordered[targetIdx], reordered[idx]];
    applyNewOrder(reordered);
  }

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-fira text-sm font-semibold text-text_primary tracking-wider uppercase">
          {title}
          <span className="text-text_muted/60 ml-2 normal-case text-[11px]">
            {sorted.length} {sorted.length === 1 ? "item" : "items"}
          </span>
        </h3>
        {jsonEnabled && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setJsonMode((v) => !v);
                setJsonError("");
              }}
              className={`flex items-center gap-1.5 text-[11px] font-fira px-3 py-1.5 rounded-lg border transition-colors ${
                jsonMode
                  ? "border-cyber/40 text-cyber bg-cyber/5"
                  : "border-white/[0.08] text-text_muted hover:border-cyber/30"
              }`}
            >
              {jsonMode ? <FiList /> : <FiCode />}
              {jsonMode ? "Form" : "JSON"}
            </button>
            {jsonMode && (
              <button
                type="button"
                onClick={copyTemplate}
                className="flex items-center gap-1.5 text-[11px] font-fira px-3 py-1.5 rounded-lg border border-white/[0.08] text-text_muted hover:border-cyber/30 hover:text-cyber transition-colors"
              >
                <FiCopy />
                {copied ? "Copied!" : "Template"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
          <p className="text-red-400 text-xs font-fira font-semibold mb-1">
            Missing required fields:
          </p>
          <p className="text-red-400/80 text-xs">
            {validationErrors.join(", ")}
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 mb-5"
      >
        {jsonMode && jsonEnabled ? (
          /* ─── JSON Mode ─── */
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-text_muted/70 text-[11px] font-fira">
                Paste JSON below
              </label>
            </div>
            <textarea
              rows={12}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setJsonError("");
              }}
              placeholder={JSON.stringify(JSON_TEMPLATES[collectionName], null, 2)}
              className={`${inputCls} resize-y font-mono text-[11px] leading-relaxed ${
                jsonError ? "border-red-500/50" : ""
              }`}
            />
            {jsonError && (
              <p className="text-red-400 text-[11px] mt-1">{jsonError}</p>
            )}

            {/* Image upload in JSON mode */}
            {fields.some((f) => f.type === "image") && (
              <div className="mt-3 flex items-center gap-3">
                <label className="text-text_muted/70 text-[11px] font-fira">
                  Display Image:
                </label>
                <label className="flex items-center gap-2 bg-obsidian border border-white/[0.1] hover:border-cyber/40 rounded-lg px-3 py-1.5 text-xs cursor-pointer transition-colors">
                  {uploading.image ? (
                    <span className="text-text_muted text-[11px]">Uploading...</span>
                  ) : form.image ? (
                    <>
                      <FiCheck className="text-green-400 text-xs" />
                      <span className="text-green-400 text-[11px]">Uploaded</span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="text-text_muted text-xs" />
                      <span className="text-text_muted text-[11px]">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading((p) => ({ ...p, image: true }));
                      try {
                        const url = await uploadImage(file, collectionName);
                        handleChange("image", url);
                        // Also inject into JSON text
                        try {
                          const obj = jsonText.trim() ? JSON.parse(jsonText) : {};
                          obj.image = url;
                          setJsonText(JSON.stringify(obj, null, 2));
                        } catch {
                          /* ignore parse errors */
                        }
                      } catch (err) {
                        alert("Upload failed: " + err.message);
                      } finally {
                        setUploading((p) => ({ ...p, image: false }));
                      }
                    }}
                  />
                </label>
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    className="h-8 w-14 object-cover rounded border border-white/10"
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          /* ─── Normal Form Mode ─── */
          <div className="grid sm:grid-cols-2 gap-3">
            {fields.map((f) => {
              const isRequired = requiredKeys.includes(f.key);
              return (
                <div
                  key={f.key}
                  className={
                    f.type === "textarea" || f.type === "stack" || f.type === "markdown" || f.type === "points"
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <label className="flex items-center gap-1 text-text_muted/70 text-[11px] font-fira mb-1">
                    {f.label}
                    {isRequired && (
                      <span className="text-red-400 text-[10px]">*</span>
                    )}
                  </label>
                  {f.type === "markdown" ? (
                    <textarea
                      rows={20}
                      value={form[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      placeholder="Write your markdown here..."
                      className={`${inputCls} resize-y font-mono text-[12px] leading-relaxed min-h-[320px]`}
                      required={isRequired}
                    />
                  ) : f.type === "textarea" ? (
                    <textarea
                      rows={4}
                      value={form[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className={`${inputCls} resize-none`}
                      required={isRequired}
                    />
                  ) : f.type === "points" ? (
                    <textarea
                      rows={4}
                      value={form[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      placeholder="Separate bullet points with semicolons (;)"
                      className={`${inputCls} resize-y`}
                      required={isRequired}
                    />
                  ) : f.type === "stack" ? (
                    <textarea
                      rows={3}
                      value={form[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      placeholder='[{"logo":0,"title":"React"},{"logo":2,"title":"Python"}]'
                      className={`${inputCls} resize-none font-mono text-[11px]`}
                      required={isRequired}
                    />
                  ) : f.type === "boolean" ? (
                    <select
                      value={form[f.key] || "false"}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className={inputCls}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : f.type === "image" ? (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 bg-obsidian border border-white/[0.1] hover:border-cyber/40 rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors">
                        {uploading[f.key] ? (
                          <span className="text-text_muted text-[11px]">
                            Uploading...
                          </span>
                        ) : form[f.key] ? (
                          <>
                            <FiCheck className="text-green-400 text-xs" />
                            <span className="text-green-400 text-[11px]">
                              Uploaded
                            </span>
                          </>
                        ) : (
                          <>
                            <FiUpload className="text-text_muted text-xs" />
                            <span className="text-text_muted text-[11px]">
                              Choose image{isRequired ? " *" : ""}
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(f.key, e.target.files?.[0])
                          }
                        />
                      </label>
                      {form[f.key] && (
                        <img
                          src={form[f.key]}
                          alt="preview"
                          className="h-10 w-16 object-cover rounded border border-white/10"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type={f.type === "timestamp" ? "date" : "text"}
                      value={form[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className={inputCls}
                      required={isRequired}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Submit row */}
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className={btnSecondary}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ─── Item List (draggable) ─── */}
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-1.5">
          {sorted.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIdx(idx);
              }}
              onDragLeave={() => setOverIdx(null)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => {
                setDragIdx(null);
                setOverIdx(null);
              }}
              className={`flex items-center gap-2 bg-obsidian/60 border rounded-lg px-3 py-2.5 transition-all ${
                overIdx === idx && dragIdx !== idx
                  ? "border-cyber/50 bg-cyber/5"
                  : dragIdx === idx
                  ? "opacity-40 border-white/[0.08]"
                  : "border-white/[0.08]"
              }`}
            >
              {/* Drag handle */}
              <FiMenu className="text-text_muted/50 cursor-grab shrink-0" />

              {/* Image / Logo thumbnail */}
              {(item.image || item.logo) && (
                <img
                  src={item.image || item.logo}
                  alt=""
                  className="h-7 w-7 object-contain rounded border border-white/10 shrink-0"
                />
              )}

              {/* Name */}
              <span className="text-xs text-text_primary truncate flex-1">
                {item.title || item.name || item.role || item.id}
              </span>

              {/* Order badge */}
              <span className="text-text_muted/50 text-[10px] font-fira shrink-0">
                #{idx + 1}
              </span>

              {/* Move buttons */}
              <button
                type="button"
                onClick={() => moveItem(idx, -1)}
                disabled={idx === 0}
                className="text-text_muted/60 hover:text-cyber disabled:opacity-30 transition-colors"
                title="Move up"
              >
                <FiChevronUp className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(idx, 1)}
                disabled={idx === sorted.length - 1}
                className="text-text_muted/60 hover:text-cyber disabled:opacity-30 transition-colors"
                title="Move down"
              >
                <FiChevronDown className="text-xs" />
              </button>

              {/* Edit / Delete */}
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="text-cyber/60 hover:text-cyber transition-colors"
                title="Edit"
              >
                <FiEdit3 className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-red-400/50 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <FiTrash2 className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ──────────── Tab config ────────────
const TABS = [
  { key: "projects", label: "Projects" },
  { key: "hackathons", label: "Hackathons" },
  { key: "blogs", label: "Blog" },
  { key: "experiences", label: "Experience" },
  { key: "leadership", label: "Leadership" },
];

// ──────────── Admin Page ────────────
export default function Admin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("admin_active_tab") || "projects";
  });

  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  if (loading) return <Loader />;
  if (!user) return <LoginForm />;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <SectionHeading
          title="Admin"
          subtitle={user.email}
        />
        <button
          onClick={() => signOut(auth)}
          className="border border-red-400/40 text-red-400/70 rounded-lg px-3 py-1.5 text-[11px] font-fira hover:bg-red-400/10 hover:text-red-400 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-1 mb-8 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-fira font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-cyber/15 text-cyber border border-cyber/30"
                : "text-text_muted hover:text-text_primary border border-transparent hover:bg-white/[0.03]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Active Section ─── */}
      {activeTab === "projects" && (
        <CrudSection
          title="Projects"
          collectionName="projects"
          jsonEnabled
          requiredKeys={["title", "tagline", "description", "image", "stack"]}
          fields={[
            { key: "title", label: "Title", type: "text" },
            { key: "tagline", label: "Tagline", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "image", label: "Display Image", type: "image" },
            {
              key: "stack",
              label: "Stack (JSON array)",
              type: "stack",
            },
            { key: "live", label: "Live URL", type: "text" },
            { key: "yt", label: "YouTube URL", type: "text" },
            { key: "github", label: "GitHub URL", type: "text" },
            { key: "featured", label: "Featured", type: "boolean" },
          ]}
        />
      )}

      {activeTab === "hackathons" && (
        <CrudSection
          title="Hackathons"
          collectionName="hackathons"
          jsonEnabled
          fields={[
            { key: "name", label: "Name", type: "text" },
            { key: "date", label: "Date", type: "timestamp" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "placement", label: "Placement", type: "text" },
            { key: "isWinner", label: "Winner?", type: "boolean" },
            { key: "featured", label: "Featured", type: "boolean" },
            { key: "logo", label: "Logo URL", type: "text" },
            {
              key: "projectLink",
              label: "Project Link (e.g. /project/slug)",
              type: "text",
            },
          ]}
        />
      )}

      {activeTab === "blogs" && (
        <CrudSection
          title="Blog Posts"
          collectionName="blogs"
          fields={[
            { key: "title", label: "Title", type: "text" },
            { key: "date", label: "Date", type: "timestamp" },
            { key: "content", label: "Content (Markdown)", type: "markdown" },
            { key: "tags", label: "Tags (comma separated)", type: "array" },
          ]}
        />
      )}

      {activeTab === "experiences" && (
        <CrudSection
          title="Experiences"
          collectionName="experiences"
          fields={[
            { key: "role", label: "Role / Title", type: "text" },
            { key: "company", label: "Company", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "logo", label: "Company Logo URL (square)", type: "text" },
            {
              key: "startDate",
              label: "Start Date",
              type: "timestamp",
            },
            {
              key: "endDate",
              label: "End Date (blank = Present)",
              type: "timestamp",
            },
            {
              key: "descriptionPoints",
              label: "Bullet Points (period separated)",
              type: "points",
            },
            {
              key: "links",
              label: "Links (comma separated URLs)",
              type: "array",
            },
          ]}
        />
      )}

      {activeTab === "leadership" && (
        <CrudSection
          title="Leadership"
          collectionName="leadership"
          fields={[
            { key: "role", label: "Role / Title", type: "text" },
            { key: "company", label: "Organization", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "logo", label: "Org Logo URL (square)", type: "text" },
            {
              key: "startDate",
              label: "Start Date",
              type: "timestamp",
            },
            {
              key: "endDate",
              label: "End Date (blank = Present)",
              type: "timestamp",
            },
            {
              key: "descriptionPoints",
              label: "Bullet Points (period separated)",
              type: "points",
            },
            {
              key: "links",
              label: "Links (comma separated URLs)",
              type: "array",
            },
          ]}
        />
      )}
    </PageWrapper>
  );
}
