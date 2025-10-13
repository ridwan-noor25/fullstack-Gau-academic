
import React, { useEffect, useState } from "react";
import { studentListPublishedGrades } from "../../utils/studentApi";

function Th({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-50">
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}

export default function MyGrades() {
  const [groups, setGroups] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setErr("");
        setLoading(true);
        const items = await studentListPublishedGrades();
        if (on) setGroups(items);
      } catch (e) {
        if (on) setErr(e.message || "Failed to fetch grades.");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  function getLetterGrade(pct) {
    if (pct == null) return "—";
    if (pct >= 70) return "A";
    if (pct >= 60) return "B";
    if (pct >= 50) return "C";
    if (pct >= 40) return "D";
    return "Supp";
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">My Grades</h1>
        <p className="text-sm text-gray-600">Published assessments only.</p>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
          No published grades yet.
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <Th>Course Code</Th>
                  <Th>Course Title</Th>
                  <Th>Grade</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.map(({ unit, assessments }) => {
                  let totalScore = 0;
                  let totalMaxScore = 0;
                  let hasValidGrades = false;
                  
                  if (Array.isArray(assessments) && assessments.length > 0) {
                    assessments.forEach((a) => {
                      if (a?.score != null && a?.max_score != null) {
                        totalScore += Number(a.score);
                        totalMaxScore += Number(a.max_score);
                        hasValidGrades = true;
                      }
                    });
                  }
                  
                  // If no valid grades exist, show dash
                  let letter;
                  if (!hasValidGrades || totalMaxScore === 0) {
                    letter = "—";
                  } else {
                    const pct = (totalScore / totalMaxScore) * 100;
                    letter = getLetterGrade(pct);
                  }

                  return (
                    <tr key={unit?.id} className="hover:bg-gray-50">
                      <Td className="font-medium text-gray-900">{unit?.code}</Td>
                      <Td className="text-gray-900">{unit?.title}</Td>
                      <Td>
                        {letter === "—" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            —
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {letter}
                          </span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
