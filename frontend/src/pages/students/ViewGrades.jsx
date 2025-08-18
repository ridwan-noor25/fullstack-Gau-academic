import React from "react";

function ViewGrades () {
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
            <p>
              <span className="font-semibold underline">Website:</span>{" "}
              www.gau.ac.ke
            </p>
            <p>
              <span className="font-semibold underline">Email:</span>{" "}
              deenschoolofeducation.gau@gmail.com
            </p>
            <p>
              <span className="font-semibold underline">Tel:</span> 0724961404
            </p>
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
        <p>
          <span className="font-semibold">Name:</span> RIDWAN NOOR MOHAMED
        </p>
        <p>
          <span className="font-semibold">Reg. No:</span> E101/11869/23
        </p>
        <p>
          <span className="font-semibold">Degree Programme:</span> BACHELOR OF
          EDUCATION (SCIENCE)
        </p>
        <p>
          <span className="font-semibold">Academic Year:</span> 2023/2024
        </p>
        <p>
          <span className="font-semibold">Year of Study:</span> 1 &nbsp;&nbsp;
          <span className="font-semibold">Semester:</span> 1st & 2nd
        </p>
      </div>

      {/* Grades Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full table-auto border border-gray-400 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Course Code</th>
              <th className="border px-2 py-1">
                Descriptive Title of Course
              </th>
              <th className="border px-2 py-1">Units</th>
              <th className="border px-2 py-1">Grade</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["GCC 111", "Communication Skills", 3, "B"],
              ["GCC 112", "Intro to Computers & Computing", 3, "B"],
              ["EDC 112", "Philosophy of Education", 3, "A"],
              ["GCC 121", "Library & Information Literacy", 3, "A"],
              ["GCC 122", "Quantitative Techniques", 3, "A"],
              ["PSY 121", "General Ed. Psychology", 3, "B"],
              ["MAT 111", "Basic Mathematics", 3, "B"],
              ["STA 111", "Probability & Stats I", 3, "A"],
              ["MAT 121", "Differential Calculus", 3, "C"],
              ["MAT 122", "Analytical Geometry", 3, "B"],
              ["CHE 111", "Fundamentals of Chemistry", 3, "B"],
              ["CHE 112", "Analytical Chemistry", 3, "A"],
              ["CHE 121", "Physical Chemistry I", 3, "B"],
              ["CHE 122", "Organic Chemistry I", 3, "A"],
            ].map(([code, title, units, grade], i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{code}</td>
                <td className="border px-2 py-1">{title}</td>
                <td className="border px-2 py-1 text-center">{units}</td>
                <td className="border px-2 py-1 text-center">{grade}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td
                className="border px-2 py-1 text-center"
                colSpan={2}
              >
                MEAN GRADE
              </td>
              <td
                className="border px-2 py-1 text-center"
                colSpan={2}
              >
                B
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 text-sm text-gray-700">
        <p>
          <span className="font-semibold">
            Total Number of Courses Taken:
          </span>{" "}
          14
        </p>
        <p>
          <span className="font-semibold">Total Number of Units:</span> 42
        </p>
        <p>
          <span className="font-semibold">Result:</span> PASS — PROCEEDED TO
          2ND YEAR OF STUDY
        </p>
      </div>

      {/* Footer Notes */}
      <div className="mt-8 text-xs text-gray-600 border-t pt-4">
        <div className="flex flex-col sm:flex-row justify-between">
          {/* Left: Key to Grading System */}
          <div className="sm:w-1/2">
            <p className="font-semibold underline">KEY TO GRADING SYSTEM:</p>
            <ul className="list-disc list-inside">
              <li>70% – 100%: A (Excellent)</li>
              <li>60% – 69%: B (Good)</li>
              <li>50% – 59%: C (Average)</li>
              <li>40% – 49%: D (Pass)</li>
              <li>Below 40%: E (Fail)</li>
            </ul>
          </div>

          {/* Right: Explanation of Courses */}
          <div className="sm:w-1/2 sm:pl-8 mt-6 sm:mt-0">
            <p className="font-semibold underline">EXPLANATION OF COURSES:</p>
            <ul className="list-disc list-inside">
              <li>100–600: Undergraduate Courses</li>
              <li>700–900: Post-graduate Courses</li>
            </ul>
            <p className="pt-2 font-semibold">OTHER KEYS:</p>
            <p>* Pass after Supplementary Examination</p>
          </div>
        </div>

        {/* Note Section */}
        <div className="mt-6 space-y-1">
          <p>
            <span className="font-semibold">Note:</span> A Semester is a
            period of 16 weeks
          </p>
          <p className="pl-8">
            A Unit is equivalent to 1 of contact hour per week
          </p>
          <p className="pl-8">
            This transcript is subject to approval by Senate
          </p>
        </div>

        {/* Date */}
        <div className="mt-6 text-right">
          <p className="text-sm font-semibold">
            DATE:{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewGrades;
