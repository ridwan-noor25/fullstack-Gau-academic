import React from "react";

export default function Profile() {
  const name = localStorage.getItem("name") || "Student";
  const email = localStorage.getItem("email") || "student@example.com";
  const reg = localStorage.getItem("reg_number") || "—";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-green-700 text-xl font-bold text-white">
            {name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-medium">{name}</div>
            <div className="text-sm text-gray-600">{email}</div>
            <div className="text-sm text-gray-600">Reg No: {reg}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
