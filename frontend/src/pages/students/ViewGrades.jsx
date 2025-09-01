import React, { useEffect, useState } from "react";


function ViewGrades() {
  const [regNo] = useState("E101/11869/23");
  const [year] = useState("2023-2024");

  const [data, setData] = useState(null);
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    setPending(true);
    setErr("");
    fetchTranscript({ regNo, year })
      .then((json) => alive && setData(json))
      .catch((e) => alive && setErr(e.message || "Failed to load transcript"))
      .finally(() => alive && setPending(false));
    return () => {
      alive = false;
    };
  }, [regNo, year]);

  // 🔎 Visible debug strip so you don't need DevTools
  const debugUrl = buildTranscriptUrl(regNo, year);

  return (
    <>
      <div className="mx-auto max-w-4xl mt-4 mb-2 text-xs p-2 border bg-yellow-50">
        <div><b>API_BASE:</b> {API_BASE}</div>
        <div><b>Request URL:</b> {debugUrl}</div>
        {err && <div className="text-red-600"><b>Error:</b> {String(err)}</div>}
      </div>

      {pending && (
        <div className="max-w-4xl mx-auto my-10 p-8 text-center text-gray-600">
          Loading transcript…
        </div>
      )}

      {!pending && err && (
        <div className="max-w-4xl mx-auto my-10 p-8 text-center text-red-600">
          {err}
        </div>
      )}

      {!pending && !err && data && (
        <div className="bg-white max-w-4xl mx-auto my-10 p-8 border border-gray-300 shadow-md">
          {/* … keep your existing transcript UI exactly as before … */}
        </div>
      )}
    </>
  );
}

export default ViewGrades;
