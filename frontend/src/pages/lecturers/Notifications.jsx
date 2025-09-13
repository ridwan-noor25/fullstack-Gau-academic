// src/pages/lecturers/Notifications.jsx
import React from "react";
import LecturerLayout from "../../components/lecturer/Layout";
import useLocalStorage from "../../hooks/useLocalStorage";

function Notifications() {
  const [store, setStore] = useLocalStorage("gau-lecturer", { notifications: [] });

  function markAllRead() {
    setStore((s) => ({
      ...s,
      notifications: (s.notifications || []).map((n) => ({ ...n, read: true })),
    }));
  }

  return (
    <LecturerLayout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <div className="text-sm text-gray-500">
            Updates from students and the system.
          </div>
        </div>
        <button
          onClick={markAllRead}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Mark all as read
        </button>
      </div>

      <ul className="space-y-3">
        {(store.notifications || []).map((n) => (
          <li
            key={n.id}
            className={`rounded-2xl border p-4 ${n.read ? "bg-white" : "bg-emerald-50 border-emerald-100"}`}
          >
            <div className="text-sm">
              <span className="font-medium">{n.title}</span>
              <span className="text-gray-500"> • {n.time}</span>
            </div>
            <div className="text-sm text-gray-700">{n.body}</div>
          </li>
        ))}
        {(store.notifications || []).length === 0 && (
          <li className="text-sm text-gray-500">No notifications.</li>
        )}
      </ul>
    </LecturerLayout>
  );
}
export default Notifications