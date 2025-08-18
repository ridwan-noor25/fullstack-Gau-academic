// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 px-6 sm:px-12 md:px-20 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: GAU Info */}
        <div>
          <h4 className="text-xl font-bold mb-3">Garissa University</h4>
          <p>
            GAU-GradeView is an academic records portal designed for transparency and ease of
            access to student grades and academic progress.
          </p>
          <p className="mt-3 text-sm">
            © {new Date().getFullYear()} Garissa University. All rights reserved.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/view-grades" className="hover:underline">View Grades</Link></li>
            <li><Link to="/report-missing-marks" className="hover:underline">Report Missing Marks</Link></li>
            <li><Link to="/lecturers-portal" className="hover:underline">Lecturers' Portal</Link></li>
            <li><Link to="/guide" className="hover:underline">User Guide</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h4 className="text-xl font-bold mb-3">Contact Information</h4>
          <p>
            <span className="font-semibold">Website:</span>{" "}
            <a
              href="https://www.gau.ac.ke"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              www.gau.ac.ke
            </a>
          </p>
          <p><span className="font-semibold">Email:</span> gradeview@gau.ac.ke</p>
          <p><span className="font-semibold">Tel:</span> +254 724 961 404</p>
          <p><span className="font-semibold">Address:</span> P.O. BOX 1801-70100, Garissa, Kenya</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
