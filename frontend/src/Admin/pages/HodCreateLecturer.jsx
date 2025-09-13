import React, { useState } from "react";
import { api } from '../../api';
import RequireAuth from "../../components/RequireAuth";

function HodCreateLecturerInner() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      const res = await api.request("/hod/lecturers", {
        method: "POST",
        body: { name, email, password },
      });
      setMsg(`Lecturer created: ${res.user.name} <${res.user.email}>`);
      setName("");
      setEmail("");
      setPassword("");
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 480 }}>
      <h3>Create Lecturer (HoD)</h3>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit">Create Lecturer</button>
      </form>
    </div>
  );
}

export default function HodCreateLecturer() {
  return (
    <RequireAuth roles={["hod"]}>
      <HodCreateLecturerInner />
    </RequireAuth>
  );
}
