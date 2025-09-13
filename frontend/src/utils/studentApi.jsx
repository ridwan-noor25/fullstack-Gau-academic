// src/utils/studentApi.jsx
const API_BASE = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000").replace(/\/$/, "");
const BASE = `${API_BASE}/api/student`;

const authHeaders = () => {
  const h = { Accept: "application/json", "Content-Type": "application/json" };
  const tok = localStorage.getItem("token");
  if (tok) h.Authorization = `Bearer ${tok}`;
  return h;
};

async function apiFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    ...opts,
    headers: { ...authHeaders(), ...(opts.headers || {}) },
  });

  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try { const j = await res.json(); msg = j?.error || j?.message || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  try { return await res.json(); } catch { return null; }
}

/* ===================== ENROLLMENTS ===================== */
export async function getMyEnrollments() {
  const j = await apiFetch(`/enrollments`);
  return Array.isArray(j?.items) ? j.items : [];
}
export async function enrollUnit(unitId) {
  const j = await apiFetch(`/enrollments`, {
    method: "POST",
    body: JSON.stringify({ unit_id: unitId }),
  });
  return j?.enrollment || null;
}
export async function dropEnrollmentById(enrollId) {
  await apiFetch(`/enrollments/${enrollId}`, { method: "DELETE" });
  return true;
}

/* ===================== AVAILABLE UNITS ===================== */
export async function getAvailableUnits({ yearLevel, semester } = {}) {
  const params = new URLSearchParams();
  if (yearLevel != null && String(yearLevel).trim() !== "") params.set("year_level", String(yearLevel));
  if (semester != null && String(semester).trim() !== "") params.set("semester", String(semester));
  const q = params.toString();
  const j = await apiFetch(`/units/available${q ? `?${q}` : ""}`);
  return Array.isArray(j?.items) ? j.items : [];
}

/* ===================== PUBLISHED GRADES ===================== */
export async function getMyGrades() {
  const j = await apiFetch(`/grades`);
  return Array.isArray(j?.items) ? j.items : [];
}

// legacy aliases used elsewhere
export const getMyGradesSafe = getMyGrades;
export const studentListPublishedGrades = getMyGrades;
export const studentGetEnrollments = getMyEnrollments;
export const studentGetAvailableUnits = getAvailableUnits;
