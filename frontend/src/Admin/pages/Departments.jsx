import React, { useEffect, useState } from "react";
import { api } from "../../api";
import RequireAuth from "../../components/RequireAuth";
import { ArrowPathIcon, PlusCircleIcon, AcademicCapIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

function DepartmentsInner() {
  const [items, setItems] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [departmentType, setDepartmentType] = useState("overall"); // overall, education_science, education_arts
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setErr("");
      const [departmentsData, schoolsData] = await Promise.all([
        api.request("/departments"),
        api.request("/auth/schools") // Updated path
      ]);
      setItems(Array.isArray(departmentsData) ? departmentsData : []);
      setSchools(Array.isArray(schoolsData) ? schoolsData : []);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Helper to determine if multiple HODs are supported for the selected school
  const supportsMultipleHODs = () => {
    const school = schools.find(s => s.id === parseInt(selectedSchool));
    return school && school.code === "EASS"; // Education, Arts & Social Sciences
  };

  // Reset department type when school changes
  useEffect(() => {
    if (selectedSchool && !supportsMultipleHODs()) {
      setDepartmentType("overall");
    }
  }, [selectedSchool]);

  async function create(e) {
    e.preventDefault();
    setErr("");
    
    if (!selectedSchool) {
      setErr("Please select a school");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare department data (removed program_id)
      const departmentData = { 
        name, 
        code,
        school_id: parseInt(selectedSchool),
        department_type: departmentType
      };

      const d = await api.request("/departments", {
        method: "POST",
        body: departmentData,
      });
      
      setItems((prev) => [...prev, d]);
      
      // Reset form
      setName("");
      setCode("");
      setSelectedSchool("");
      setDepartmentType("overall");
      
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-green-900">Departments & Schools</h1>
            <p className="text-sm text-gray-600">
              Create departments with school and program associations.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {err}
          </div>
        )}

        {/* Create form */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <PlusCircleIcon className="h-5 w-5 text-green-700" />
            Create Department
          </h2>

          <form onSubmit={create} className="space-y-6">
            {/* School Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BuildingOfficeIcon className="inline w-4 h-4 mr-1" />
                School *
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 bg-white p-3 shadow-sm focus:border-green-600 focus:ring-green-600 text-base"
              >
                <option value="">Select a school...</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name} ({school.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Department Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department Type *</label>
              {supportsMultipleHODs() ? (
                <select
                  value={departmentType}
                  onChange={(e) => setDepartmentType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white p-2.5 shadow-sm focus:border-green-600 focus:ring-green-600"
                  required
                >
                  <option value="overall">Overall HOD</option>
                  <option value="education_science">Education Science HOD</option>
                  <option value="education_arts">Education Arts HOD</option>
                </select>
              ) : (
                <div className="w-full rounded-md border border-gray-200 bg-gray-50 p-2.5 text-gray-600">
                  Overall HOD (default for this school)
                </div>
              )}
            </div>

            {/* Department Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
                <input
                  placeholder="e.g. Computer Science Department"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white p-2.5 shadow-sm focus:border-green-600 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Code *</label>
                <input
                  placeholder="e.g. COMP"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white p-2.5 shadow-sm focus:border-green-600 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-medium text-white shadow-sm ring-1 ring-green-700/70 transition hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed min-w-[120px]"
              >
                {submitting ? "Creating..." : "Create Department"}
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced Departments List */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Departments</h2>
            <p className="text-sm text-gray-600">Departments organized by school and program</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
            </div>
          ) : items.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No departments yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first department.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>#</Th>
                    <Th>Department</Th>
                    <Th>School</Th>
                    <Th>HOD Type</Th>
                    <Th>HOD Assigned</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {items.map((dept, i) => {
                    const school = schools.find(s => s.id === dept.school_id);
                    return (
                      <tr key={dept.id || `${dept.name}-${i}`} className="hover:bg-gray-50">
                        <Td className="w-16 text-gray-500">{i + 1}</Td>
                        <Td>
                          <div>
                            <div className="font-medium text-gray-900">{dept.name}</div>
                            <div className="text-sm text-gray-500">{dept.code}</div>
                          </div>
                        </Td>
                        <Td>
                          {school ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">{school.name}</div>
                              <div className="text-xs text-gray-500">{school.code}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </Td>
                        <Td>
                          {dept.department_type ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              dept.department_type === 'overall' ? 'bg-green-100 text-green-800' :
                              dept.department_type === 'education_science' ? 'bg-blue-100 text-blue-800' :
                              dept.department_type === 'education_arts' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {dept.department_type === 'overall' ? 'Overall HOD' :
                               dept.department_type === 'education_science' ? 'Education Science HOD' :
                               dept.department_type === 'education_arts' ? 'Education Arts HOD' :
                               dept.department_type}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </Td>
                        <Td>
                          {dept.hod_user_id ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Assigned
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Not Assigned
                            </span>
                          )}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}

export default function Departments() {
  return (
    <RequireAuth roles={["admin"]}>
      <DepartmentsInner />
    </RequireAuth>
  );
}
