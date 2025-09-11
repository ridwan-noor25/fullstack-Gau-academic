import React, { useState } from "react";

export default function Settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [dark, setDark] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Email notifications</span>
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Dark mode (local)</span>
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={dark}
            onChange={(e) => setDark(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
}
