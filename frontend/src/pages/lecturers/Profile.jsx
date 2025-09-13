// src/pages/lecturers/Profile.jsx
import React, { useState } from "react";
import LecturerLayout from "../../components/lecturer/Layout";
import useLocalStorage from "../../hooks/useLocalStorage";

function Profile() {
  const [store, setStore] = useLocalStorage("gau-lecturer", {
    profile: {
      name: "Lecturer Name",
      email: "lecturer@gau.ac.ke",
      department: "School of Education",
      phone: "",
      office: "Block B, Room 203",
    },
  });
  const [p, setP] = useState(store.profile);

  function save() {
    setStore((s) => ({ ...s, profile: p }));
    alert("Saved");
  }

  return (
    <LecturerLayout>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Profile</h1>
        <div className="text-sm text-gray-500">Your account & department info.</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-semibold">Personal Details</h3>
          <div className="grid gap-3 text-sm">
            <input
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={p.name}
              onChange={(e) => setP({ ...p, name: e.target.value })}
              placeholder="Full name"
            />
            <input
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={p.email}
              onChange={(e) => setP({ ...p, email: e.target.value })}
              placeholder="Email"
            />
            <input
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={p.phone}
              onChange={(e) => setP({ ...p, phone: e.target.value })}
              placeholder="Phone"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-semibold">Work Details</h3>
          <div className="grid gap-3 text-sm">
            <input
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={p.department}
              onChange={(e) => setP({ ...p, department: e.target.value })}
              placeholder="Department"
            />
            <input
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={p.office}
              onChange={(e) => setP({ ...p, office: e.target.value })}
              placeholder="Office"
            />
          </div>
          <button
            onClick={save}
            className="mt-3 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </LecturerLayout>
  );
}
export default Profile