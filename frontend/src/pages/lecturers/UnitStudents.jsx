// src/pages/lecturers/UnitStudents.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUnitStudents, getUnitGrades } from "../../utils/lecturerApi";

/* ---------- helpers to normalize fields across API variations ---------- */

function pickFirst(obj, keys = []) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "" && String(v).trim() !== "_" && String(v).toLowerCase() !== "null" && String(v).toLowerCase() !== "undefined") {
      return String(v);
    }
  }

  return "";
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function cleanName(s) {
  if (!s) return "";
  // replace underscores with spaces, collapse spaces
  const spaced = s.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  // avoid showing emails as-is; if it's an email, use part before @
  if (/^[^@\s]+@[^@\s]+$/.test(spaced)) {
    return titleCase(spaced.split("@")[0].replace(/[._-]+/g, " "));
  }
  return titleCase(spaced);
}

function cleanRegNo(s) {
  if (!s) return "";
  let t = String(s).trim();
  // many backends store with underscores; prefer slash or dash
  if (t.includes("_")) t = t.replace(/_+/g, "/");
  // collapse spaces; uppercase for consistency
  t = t.replace(/\s+/g, " ").toUpperCase();
  // treat lone underscore/placeholder as empty

  if (t === "_" || t.toLowerCase() === "null" || t.toLowerCase() === "undefined") return "";
  return t;
}

export default function UnitStudents() {
  const { unitId } = useParams();
  const [items, setItems] = useState([]);
  const [grades, setGrades] = useState({}); // { student_id: { marks, grade } }
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const [studentsRes, gradesRes] = await Promise.all([
          getUnitStudents(unitId),
          getUnitGrades(unitId),
        ]);
        if (!on) return;
        // Debug output
        // eslint-disable-next-line no-console
        console.log("[UnitStudents] studentsRes", studentsRes);
        // eslint-disable-next-line no-console
        console.log("[UnitStudents] gradesRes", gradesRes);
        setItems(Array.isArray(studentsRes) ? studentsRes : []);
        // gradesRes: [{ assessment, grades: [{student_id, score, ...}] }]
        // Sum all published grades per student, scale to 100
        const studentScores = {};
        let totalMax = 0;
        // Find all assessments' max_score
        const assessments = (gradesRes || []).map((g) => g.assessment).filter(Boolean);
        totalMax = assessments.reduce((acc, a) => acc + (Number(a.max_score) || 0), 0);
        // For each student, sum their scores
        (gradesRes || []).forEach(({ assessment, grades }) => {
          if (!assessment || !Array.isArray(grades)) return;
          grades.forEach((g) => {
            if (!studentScores[g.student_id]) studentScores[g.student_id] = { score: 0 };
            studentScores[g.student_id].score += Number(g.score) || 0;
          });
        });
        // Compute marks and grade for each student
        const marksMap = {};
        Object.entries(studentScores).forEach(([sid, { score }]) => {
          const marks = totalMax > 0 ? (score * 100) / totalMax : 0;
          let grade = "—";
          if (marks >= 70) grade = "A";
          else if (marks >= 60) grade = "B";
          else if (marks >= 50) grade = "C";
          else if (marks >= 40) grade = "D";
          else if (marks >= 0) grade = "Supp";
          marksMap[sid] = { marks: Math.round(marks), grade };
        });
        setGrades(marksMap);
      } catch (e) {
        if (on) setErr(e.message || "Failed to load students");
      } finally {
        if (on) setLoading(false);
      }
    }
    load();
    return () => { on = false; };
  }, [unitId]);

  // Normalize to consistent display rows regardless of server shape
  // Helper to compute marks and grade (out of 100, missing as zero)

  const rows = useMemo(() => {
    return (items || []).map((it) => {
      // API may return enrollments with nested student, or flat student objects
      const s = it?.student ?? it;

      // Build name from multiple possible shapes
      const first = pickFirst(s, ["first_name", "firstname", "given_name", "firstName", "givenName"]);
      const last  = pickFirst(s, ["last_name", "lastname", "surname", "family_name", "lastName", "familyName"]);
      const fullFromParts = [first, last].filter(Boolean).join(" ");

      const rawName =
        fullFromParts ||
        pickFirst(s, ["full_name", "fullName", "display_name", "displayName", "name", "student_name", "studentName", "username", "user_name", "email"]);

      const name = cleanName(rawName) || "—";

      // Build reg no from many possible keys
      const rawReg =
        pickFirst(s, [
          "reg_number",
          "reg_no",
          "registration_number",
          "registrationNo",
          "regNumber",
          "regNo",
          "reg",
          "regno",
          "student_reg_no",
          "studentRegNo",
        ]);

      const reg = cleanRegNo(rawReg) || "—";

      // Choose a stable key
      const key = String(
        it?.id ??
        it?.enrollment_id ??
        s?.id ??
        `${name}-${reg}-${Math.random()}`
      );

      // Get marks and grade from grades map
      let marks = 0, grade = "—";
      if (grades && s.id && grades[s.id]) {
        marks = grades[s.id].marks;
        grade = grades[s.id].grade;
      }

      return { key, name, reg, marks, grade };
    });
  }, [items, grades]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Students — Unit #{unitId}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{rows.length} enrolled</span>
          <Link
            to={`/lecturer/units/${unitId}/assessments`}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Assessments
          </Link>
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Name</Th>
              <Th>Reg No</Th>
              <Th>Marks</Th>
              <Th>Grade</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 && (
              <tr>
                <td colSpan="4" className="px-5 py-6 text-center text-gray-500">
                  No students enrolled.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.key}>
                <Td className="font-medium">{r.name}</Td>
                <Td>{r.reg}</Td>
                <Td>{r.marks}</Td>
                <Td>{r.grade}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Th({ children }) {
  return (
    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-5 py-3 ${className}`}>{children}</td>;
}
