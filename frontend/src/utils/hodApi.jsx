// src/utils/hodApi.jsx
const API_BASE = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000").replace(/\/$/, "");
const BASE = `${API_BASE}/api/hod`;

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
    try {
      const j = await res.json();
      msg = j?.error || j?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/* ============ SUMMARY ============ */
export async function getHodSummary() {
  const j = await apiFetch(`/summary`);
  return j || {};
}

/* ============ LECTURERS ============ */
export async function listLecturers() {
  const j = await apiFetch(`/lecturers`);
  return Array.isArray(j?.items) ? j.items : [];
}
export async function createLecturer(payload) {
  const j = await apiFetch(`/lecturers`, { method: "POST", body: JSON.stringify(payload) });
  return j?.user || null;
}
export async function updateLecturer(id, payload) {
  const j = await apiFetch(`/lecturers/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  return j?.user || null;
}
export async function deleteLecturer(id) {
  await apiFetch(`/lecturers/${id}`, { method: "DELETE" });
  return true;
}

/* ============ UNITS ============ */
export async function listUnits() {
  const j = await apiFetch(`/units`);
  return Array.isArray(j?.items) ? j.items : [];
}
export async function createUnit(payload) {
  const j = await apiFetch(`/units`, { method: "POST", body: JSON.stringify(payload) });
  return j?.unit || null;
}
export async function updateUnit(id, payload) {
  const j = await apiFetch(`/units/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  return j?.unit || null;
}
export async function deleteUnit(id) {
  await apiFetch(`/units/${id}`, { method: "DELETE" });
  return true;
}
export async function assignLecturerToUnit(unitId, lecturerId) {
  const j = await apiFetch(`/units/${unitId}/assign`, {
    method: "POST",
    body: JSON.stringify({ lecturer_id: lecturerId }),
  });
  return j;
}
export async function removeLecturerFromUnit(unitId, lecturerId) {
  await apiFetch(`/units/${unitId}/assign/${lecturerId}`, { method: "DELETE" });
  return true;
}

/* ============ PUBLISH (HOD) ============ */
export async function hodPublishAssessment(assId, publish = true) {
  const j = await apiFetch(`/assessments/${assId}/publish`, {
    method: "POST",
    body: JSON.stringify({ publish }),
  });
  return j;
}
export async function hodPublishUnit(unitId, publish = true) {
  const j = await apiFetch(`/units/${unitId}/publish`, {
    method: "POST",
    body: JSON.stringify({ publish }),
  });
  return j;
}

/* ============ PROGRAMS ============ */
export async function listPrograms() {
  const j = await apiFetch(`/programs`);
  return Array.isArray(j?.items) ? j.items : [];
}
export async function createProgram(payload) {
  const j = await apiFetch(`/programs`, { method: "POST", body: JSON.stringify(payload) });
  return j?.program || null;
}
export async function updateProgram(id, payload) {
  const j = await apiFetch(`/programs/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
  return j?.program || null;
}
export async function deleteProgram(id) {
  await apiFetch(`/programs/${id}`, { method: "DELETE" });
  return true;
}

/* ============ CURRICULUM ============ */
export async function listCurriculum(programId) {
  const j = await apiFetch(`/programs/${programId}/curriculum`);
  return Array.isArray(j?.items) ? j.items : [];
}
export async function addCurriculumRow(programId, payload) {
  const j = await apiFetch(`/programs/${programId}/curriculum`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return j?.row || null;
}
export async function bulkUpsertCurriculum(programId, rows, replace = false) {
  const j = await apiFetch(`/programs/${programId}/curriculum/bulk`, {
    method: "POST",
    body: JSON.stringify({ rows, replace }),
  });
  return j;
}
export async function deleteCurriculumRow(programId, rowId) {
  await apiFetch(`/programs/${programId}/curriculum/${rowId}`, { method: "DELETE" });
  return true;
}

/* ============ Aliases (optional, for backward compat) ============ */
export const hodListLecturers = listLecturers;
export const hodListUnits = listUnits;
export const hodGetSummary = getHodSummary;
export const hodPublishUnitAssessments = hodPublishUnit;

export const hodListPrograms = listPrograms;
export const hodCreateProgram = createProgram;
export const hodUpdateProgram = updateProgram;
export const hodDeleteProgram = deleteProgram;

export const hodListCurriculum = listCurriculum;
export const hodAddCurriculumRow = addCurriculumRow;
export const hodBulkUpsertCurriculum = bulkUpsertCurriculum;
export const hodDeleteCurriculumRow = deleteCurriculumRow;
