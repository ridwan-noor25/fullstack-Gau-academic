
import React, { useState, useEffect } from "react";
import HodTranscript from "./HodTranscript";
import TranscriptNotification from "./TranscriptNotification";

const PAGE_SIZE = 10;

const HodTranscripts = () => {
  const [activeTab, setActiveTab] = useState("notifications"); // Start with notifications tab
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch students on mount
  useEffect(() => {
    fetch("/api/hod/students", { 
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('Fetch response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Students data received:', data);
        setStudents(data.items || []);
        setFilteredStudents(data.items || []);
      })
      .catch(err => {
        console.error('Error fetching students:', err);
      });
  }, []);

  // Filter students by search
  useEffect(() => {
    let filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.reg_number.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
    setPage(1);
  }, [search, students]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const pagedStudents = filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const yearOptions = ["1", "2", "3", "4"];
  const semesterOptions = ["1st", "2nd", "1st & 2nd"];

  // Fetch transcript for selected student
  const handleSelectStudent = (s) => {
    setLoading(true);
    setSelectedStudent(s);
    setTranscriptData(null);
    fetch(`/api/student/${s.id}/transcript`, { 
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setTranscriptData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching transcript:', err);
        setLoading(false);
      });
  };

  // Simple print function
  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <React.Fragment>
      {selectedStudent ? (
        <div className="w-full min-h-screen bg-gray-50 py-8 px-2 flex flex-col items-center print:bg-white print:p-0 print:m-0 print:min-h-0">
          <div className="w-full max-w-4xl print:max-w-none print:w-full">
            <button
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 print:hidden"
              onClick={() => setSelectedStudent(null)}
            >
              ← Back to Student List
            </button>
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="w-10 h-10 border-b-2 border-green-700 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <HodTranscript
                  student={transcriptData?.student || selectedStudent}
                  grades={transcriptData?.transcript || []}
                  meanGrade={transcriptData?.summary?.mean_grade || "-"}
                  summary={transcriptData?.summary || {}}
                  date={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                />
                <button
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 print:hidden"
                  onClick={handlePrintTranscript}
                >
                  Print Transcript
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-gray-50 py-8 px-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Transcript Management</h2>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "notifications"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  📧 Notify Students
                </button>
                <button
                  onClick={() => setActiveTab("print")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "print"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🖨️ Print Transcripts
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "notifications" ? (
            <div className="py-6">
              <TranscriptNotification />
            </div>
          ) : (
            <div>
              <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by name or reg number..."
                  className="border rounded px-3 py-2 w-full md:w-72"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select
                  className="border rounded px-3 py-2 w-full md:w-40"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select
                  className="border rounded px-3 py-2 w-full md:w-40"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-start w-full">
                <div className="w-full md:w-1/2 max-w-xl">
                  <ul className="divide-y border rounded bg-white">
                    {pagedStudents
                      .filter(s => (!year || String(s.year) === year) && (!semester || s.semester === semester))
                      .map((s) => (
                        <li key={s.reg_number} className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectStudent(s)}>
                          <span>
                            <span className="font-medium">{s.name}</span>
                            <span className="ml-2 text-xs text-gray-500">({s.reg_number})</span>
                          </span>
                          <button className="text-green-700 border border-green-700 px-3 py-1 rounded hover:bg-green-50 text-xs">View Transcript</button>
                        </li>
                      ))}
                  </ul>
                  {/* Pagination Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="px-3 py-1 rounded border text-xs disabled:opacity-50"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <span className="text-xs text-gray-600">
                      Page {page} of {totalPages || 1}
                    </span>
                    <button
                      className="px-3 py-1 rounded border text-xs disabled:opacity-50"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages || totalPages === 0}
                    >
                      Next
                    </button>
                  </div>
                </div>
                {/* Transcript Preview with Loading State */}
                <div className="w-full md:w-1/2 flex-1 flex justify-center">
                  <div className="text-gray-500 text-center mt-20">Select a student to view transcript</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default HodTranscripts;
