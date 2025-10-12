import React from "react";

const HodTranscript = ({ student, grades, meanGrade, summary, date }) => {
  return (
    <div className="transcript-container bg-white max-w-4xl mx-auto my-10 p-8 border border-gray-300 shadow-md">
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
        <p><span className="font-semibold">Year of Study:</span> {student?.year_of_study} &nbsp;&nbsp; <span className="font-semibold">Semester:</span> {student?.semester}</p>
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
            {grades.map((gradeItem, i) => {
              // Handle both array format [code, title, units, grade] and object format {code, title, credits, grade}
              const code = Array.isArray(gradeItem) ? gradeItem[0] : gradeItem.code;
              const title = Array.isArray(gradeItem) ? gradeItem[1] : gradeItem.title;
              const units = Array.isArray(gradeItem) ? gradeItem[2] : gradeItem.credits;
              const grade = Array.isArray(gradeItem) ? gradeItem[3] : gradeItem.grade;
              
              return (
                <tr key={i}>
                  <td className="border px-2 py-1">{code}</td>
                  <td className="border px-2 py-1">{title}</td>
                  <td className="border px-2 py-1 text-center">{units}</td>
                  <td className="border px-2 py-1 text-center">{grade}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-semibold">
              <td className="border px-2 py-1 text-center" colSpan={2}>MEAN GRADE</td>
              <td className="border px-2 py-1 text-center" colSpan={2}>{meanGrade}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Summary */}
      <div className="mt-6 text-sm text-gray-700">
        <p><span className="font-semibold">Total Number of Courses Taken:</span> {summary?.total_courses || grades.length}</p>
        <p><span className="font-semibold">Total Number of Units:</span> {summary?.total_credits || '—'}</p>
        <p><span className="font-semibold">GPA:</span> {summary?.gpa || '—'}</p>
        <p><span className="font-semibold">Overall Grade:</span> {summary?.mean_grade || meanGrade}</p>
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
          <p><span className="font-semibold">Note:</span> A Semester is a period of 16 weeks</p>
          <p className="pl-8">A Unit is equivalent to 1 of contact hour per week</p>
          <p className="pl-8">This transcript is subject to approval by Senate</p>
        </div>
        {/* Signature and Date Section */}
        <div className="mt-8 flex flex-row justify-between items-end w-full">
          {/* Left: Signature dash and DEAN, SEASS */}
          <div className="flex flex-col items-start">
            <div className="border-t border-gray-700 w-40 mb-1" />
            <span className="text-sm font-semibold">DEAN, SEASS</span>
          </div>
          {/* Right: Date dash and DATE label */}
          <div className="flex flex-col items-end">
            <div className="border-t border-gray-700 w-32 mb-1" />
            <span className="text-sm font-semibold">DATE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodTranscript;
