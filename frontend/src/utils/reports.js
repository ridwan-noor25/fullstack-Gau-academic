// src/utils/reports.js
export const LS_KEY = "gv_missing_reports";

// Light mapper from course code prefix -> department label
const DEPT_MAP = {
  MAT: "Mathematics",
  CHE: "Chemistry",
  EDU: "Education",
  PHY: "Physics",
  CSC: "Computer Science",
  ENG: "English",
};

export function deriveDept(courseStr = "") {
  // Extract the alpha prefix before first space or dash, e.g., "MAT 201 – Calculus II" -> "MAT"
  const m = (courseStr || "").trim().match(/^([A-Za-z]{3,})\b/);
  const prefix = m ? m[1].toUpperCase() : null;
  return prefix && DEPT_MAP[prefix] ? DEPT_MAP[prefix] : "Unknown";
}

export function loadReports() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY)) ?? [];
    // decorate derived fields (dept)
    return raw.map((r) => ({ ...r, dept: deriveDept(r.course) }));
  } catch {
    return [];
  }
}

export function saveReports(items) {
  // strip derived fields before save
  const clean = items.map(({ dept, ...rest }) => rest);
  localStorage.setItem(LS_KEY, JSON.stringify(clean));
}

export function updateReport(id, updater) {
  const list = loadReports();
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return list;
  const current = list[idx];
  const next = typeof updater === "function" ? updater(current) : { ...current, ...updater };
  const updated = [...list.slice(0, idx), next, ...list.slice(idx + 1)];
  saveReports(updated);
  return loadReports();
}

export function deleteReport(id) {
  const list = loadReports().filter((x) => x.id !== id);
  saveReports(list);
  return loadReports();
}
