// src/utils/lecturerApi.jsx
const API_BASE = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:5001").replace(/\/$/, "");
const BASE = `${API_BASE}/api/lecturer`;

const authHeaders = () => {
  const h = { Accept: "application/json", "Content-Type": "application/json" };
  const t = localStorage.getItem("token");
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
};

async function apiFetch(path, opts = {}) {
  const res = await fetch(path.startsWith("http") ? path : `${BASE}${path}`, {
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

/* ---------- Auth / Me ---------- */
export async function getLecturerMe() {
  const j = await apiFetch(`/me`);
  return j?.user || null;
}

/* ---------- Units ---------- */
export async function getMyUnits() {
  const j = await apiFetch(`/units`);
  return Array.isArray(j?.items) ? j.items : [];
}

export async function getUnitStudents(unitId, studyMode = null) {
  let url = `/units/${unitId}/students`;
  if (studyMode) {
    url += `?study_mode=${encodeURIComponent(studyMode)}`;
  }
  const j = await apiFetch(url);
  return Array.isArray(j?.items) ? j.items : [];
}

export async function getUnitAssessments(unitId) {
  const j = await apiFetch(`/units/${unitId}/assessments`);
  return Array.isArray(j?.items) ? j.items : [];
}

export async function createAssessment(unitId, payload) {
  const j = await apiFetch(`/units/${unitId}/assessments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return j?.data || null;
}

export async function updateAssessment(assessmentId, payload) {
  const j = await apiFetch(`/assessments/${assessmentId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return j?.data || null;
}

export async function deleteAssessment(assessmentId) {
  await apiFetch(`/assessments/${assessmentId}`, { method: "DELETE" });
  return true;
}

export async function publishUnitAssessments(unitId) {
  const j = await apiFetch(`/units/${unitId}/publish`, { method: "POST" });
  return j;
}

/* ---------- Grades ---------- */
export async function getUnitGrades(unitId) {
  const j = await apiFetch(`/units/${unitId}/grades`);
  return Array.isArray(j?.items) ? j.items : [];
}

export async function upsertGradesBulk(assessmentId, grades) {
  const j = await apiFetch(`/assessments/${assessmentId}/grades`, {
    method: "POST",
    body: JSON.stringify({ grades }),
  });
  return j;
}

export async function updateSingleGrade(gradeId, score) {
  const j = await apiFetch(`/grades/${gradeId}`, {
    method: "PATCH",
    body: JSON.stringify({ score }),
  });
  return j?.data || null;
}

/* ---------- Missing Reports ---------- */
export async function getMissingReports() {
  const j = await apiFetch(`/missing-reports`);
  return Array.isArray(j?.items) ? j.items : [];
}

export async function updateMissingReport(reportId, payload) {
  const j = await apiFetch(`/missing-reports/${reportId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return j?.data || null;
}
