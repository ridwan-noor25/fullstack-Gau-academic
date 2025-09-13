// src/components/lecturer/Layout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Modal from "./Modal";

export default function LecturerLayout({ children, onQuickAddSubmit }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Topbar onQuickAdd={() => setOpen(true)} />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <Sidebar />
        <main className="w-full">
          {children}
        </main>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Quick Add"
        actions={
          <>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onQuickAddSubmit && onQuickAddSubmit();
                setOpen(false);
              }}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
            >
              Save
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          <label className="text-sm">
            <div className="mb-1 text-gray-600">Type</div>
            <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
              <option>Assessment</option>
              <option>Announcement</option>
              <option>Course</option>
            </select>
          </label>
          <label className="text-sm">
            <div className="mb-1 text-gray-600">Title</div>
            <input className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
          </label>
          <label className="text-sm">
            <div className="mb-1 text-gray-600">Details</div>
            <textarea rows="4" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
          </label>
        </div>
      </Modal>
    </div>
  );
}
