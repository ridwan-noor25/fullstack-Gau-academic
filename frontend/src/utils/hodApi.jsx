// // src/utils/hodApi.js
// const API_BASE = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000").replace(/\/$/, "");
// const BASE = `${API_BASE}/api/hod`;

// const authHeaders = () => {
//   const h = { Accept: "application/json", "Content-Type": "application/json" };
//   const t = localStorage.getItem("token");
//   if (t) h.Authorization = `Bearer ${t}`;
//   return h;
// };

// async function api(path, opts = {}) {
//   const res = await fetch(path.startsWith("http") ? path : `${BASE}${path}`, {
//     credentials: "include",
//     ...opts,
//     headers: { ...authHeaders(), ...(opts.headers || {}) },
//   });
//   // Handle non-OK
//   if (!res.ok) {
//     let msg = `${res.status} ${res.statusText}`;
//     try {
//       const j = await res.json();
//       msg = j?.error || j?.message || msg;
//     } catch {}
//     throw new Error(msg);
//   }
//   if (res.status === 204) return null;
//   try {
//     return await res.json();
//   } catch {
//     return null;
//   }
// }

// // Lecturers
// export async function hodListLecturers() {
//   const j = await api("/lecturers");
//   return Array.isArray(j?.items) ? j.items : [];
// }
// export async function hodCreateLecturer(payload) {
//   const j = await api("/lecturers", { method: "POST", body: JSON.stringify(payload) });
//   return j?.user || null;
// }
// export async function hodUpdateLecturer(id, payload) {
//   const j = await api(`/lecturers/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
//   return j?.user || null;
// }
// export async function hodDeleteLecturer(id) {
//   await api(`/lecturers/${id}`, { method: "DELETE" });
//   return true;
// }

// // Units
// export async function hodListUnits() {
//   const j = await api("/units");
//   return Array.isArray(j?.items) ? j.items : [];
// }

// // Publish
// export async function hodPublishUnit(unitId) {
//   return await api(`/publish/unit/${unitId}`, { method: "POST" });
// }
// export async function hodPublishAssessment(assId) {
//   return await api(`/publish/assessment/${assId}`, { method: "POST" });
// }



// src/utils/hodApi.js
const API_BASE = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000").replace(/\/$/, "");
const BASE = `${API_BASE}/api/hod`;

const authHeaders = () => {
  const h = { Accept: "application/json", "Content-Type": "application/json" };
  const tok = localStorage.getItem("token");
  if (tok) h.Authorization = `Bearer ${tok}`;
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

/* ---- Summary ---- */
export async function getHodSummary() {
  const j = await apiFetch(`/summary`);
  return j || {};
}

/* ---- Lecturers ---- */
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

/* ---- Units ---- */
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

/* ---- Assignments (explicit) ---- */
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