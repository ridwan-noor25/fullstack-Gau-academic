// src/components/Transcript.jsx
import React, { useEffect, useState } from "react";

const Transcript = () => {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTranscript() {
      try {
        const res = await fetch("http://127.0.0.1:5001/api/student/1/transcript?year=1");
        const data = await res.json();
        setStudent(data.student);
        setGrades(data.transcript);
      } catch (err) {
        console.error("Error loading transcript:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTranscript();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading transcript...</p>;

  return (
    <div className="bg-white max-w-4xl mx-auto my-10 p-8 border border-gray-300 shadow-md">
      {/* Header */}
      <div className="text-center">
        <img
          src="/logoo.jpg"
          alt="Garissa University Logo"
          className="h-20 mx-auto mb-4"
        />
        <h1 className="text-xl font-bold uppercase text-gray-800">
          Garissa University
        </h1>
        <p className="text-sm text-gray-600 -mt-1">
          School of Education, Arts and Social Sciences
        </p>
        <p className="font-semibold text-gray-700 mt-1">OFFICE OF THE DEAN</p>

        {/* Contact Info */}
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <div className="text-left">
            <p><span className="font-semibold underline">Website:</span> www.gau.ac.ke</p>
            <p><span className="font-semibold underline">Email:</span> deenschoolofeducation.gau@gmail.com</p>
            <p><span className="font-semibold underline">Tel:</span> 0724961404</p>
          </div>
          <div className="text-right">
            <p>P.O. BOX 1801-70100</p>
            <p>GARISSA,</p>
            <p>KENYA</p>
          </div>
        </div>

        <p className="mt-4 font-semibold text-gray-700 underline">
          PROVISIONAL DEGREE ACADEMIC TRANSCRIPT
        </p>
      </div>

      {/* Student Info */}
      <div className="mt-6 text-sm text-gray-700">
        <p><span className="font-semibold">Name:</span> {student?.name}</p>
        <p><span className="font-semibold">Reg. No:</span> {student?.reg_number}</p>
        <p><span className="font-semibold">Degree Programme:</span> {student?.programme}</p>
        <p><span className="font-semibold">Academic Year:</span> {student?.academic_year}</p>
        <p>
          <span className="font-semibold">Year of Study:</span> {student?.year} &nbsp;&nbsp; 
          <span className="font-semibold">Semester:</span> {student?.semester}
        </p>
      </div>

      {/* Grades Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full table-auto border border-gray-400 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Course Code</th>
              <th className="border px-2 py-1">Descriptive Title of Course</th>
              <th className="border px-2 py-1">Units</th>
              <th className="border px-2 py-1">Grade</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{g.code}</td>
                <td className="border px-2 py-1">{g.title}</td>
                <td className="border px-2 py-1 text-center">{g.units}</td>
                <td className="border px-2 py-1 text-center">
                  {g.grade ? g.grade : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dean’s signature */}
      <div className="mt-10 text-right">
        <p className="text-sm font-semibold">__________________________</p>
        <p className="text-sm">Dean, School of Education</p>
      </div>
    </div>
  );
};

// Transcript page removed from student side as per new requirements.

// This file is intentionally left blank. Do not import.
