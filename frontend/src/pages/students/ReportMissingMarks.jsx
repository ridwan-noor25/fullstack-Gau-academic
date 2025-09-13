import React, { useState } from "react";

function ReportMissingMarks () {
  const [formData, setFormData] = useState({
    fullName: "",
    regNumber: "",
    year: "",
    semester: "",
    courseCode: "",
    courseName: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Your report has been submitted successfully!");
    setFormData({
      fullName: "",
      regNumber: "",
      year: "",
      semester: "",
      courseCode: "",
      courseName: "",
      message: "",
    });
  };

  return (
    <section className="py-12 px-6 sm:px-12 md:px-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Report Missing Marks</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />

          {/* Reg Number */}
          <input
            type="text"
            name="regNumber"
            placeholder="Registration Number (e.g. SE001/2023)"
            value={formData.regNumber}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2"
          />

          {/* Year & Semester */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="year"
              placeholder="Year (e.g. 2)"
              value={formData.year}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="text"
              name="semester"
              placeholder="Semester (e.g. II)"
              value={formData.semester}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {/* Course Code & Name */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="courseCode"
              placeholder="Course Code (e.g. MAT 212)"
              value={formData.courseCode}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="text"
              name="courseName"
              placeholder="Course Title (e.g. Calculus II)"
              value={formData.courseName}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2"
            />
          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder="Explain the issue (e.g. I sat for this unit but grade is missing...)"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="border border-gray-300 rounded px-4 py-2"
          ></textarea>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            Submit Report
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReportMissingMarks;
