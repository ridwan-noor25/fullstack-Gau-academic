// src/mocks/devApi.js
export function setupDevApi() {
  const originalFetch = window.fetch.bind(window);

  // simple local store for dev data
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem("dev-api") || "{}");
    } catch {
      return {};
    }
  };
  const save = (s) => localStorage.setItem("dev-api", JSON.stringify(s));
  const state = load();

  // seed data if empty
  if (!state.missingMarks) state.missingMarks = [];
  if (!state.grades) {
    state.grades = [
      {
        reg: "GU/ED/1234/23",
        name: "Ali Hussein",
        course: "MAT 201",
        cat1: 12,
        cat2: 14,
        exam: 56,
      },
      {
        reg: "GU/ED/1260/23",
        name: "Fatuma Noor",
        course: "CHE 205",
        cat1: 10,
        cat2: 16,
        exam: 60,
      },
    ];
  }
  if (!state.users) {
    state.users = [
      { id: 1, name: "Test Student", email: "student@gau.ac.ke", role: "student", password: "password" },
      { id: 2, name: "Test Lecturer", email: "lecturer@gau.ac.ke", role: "lecturer", password: "password" },
    ];
  }
  save(state);

  function ok(data, init = {}) {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  }
  function created(data) {
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }
  function bad(msg = "Bad Request") {
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  function notFound(msg = "Not Found") {
    return new Response(JSON.stringify({ error: msg }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  window.fetch = async function devFetch(input, init = {}) {
    const req = new Request(input, init);
    const url = req.url || "";
    const method = (req.method || "GET").toUpperCase();

    // Intercept both absolute and relative URLs if they include /api/
    if (!url.includes("/api/")) {
      return originalFetch(input, init);
    }

    // Normalize path-only part for routing
    let path;
    try {
      const u = new URL(url, window.location.origin);
      path = u.pathname + (u.search || "");
    } catch {
      path = url;
    }

    // -------- AUTH (mock) --------
    if (path.startsWith("/api/auth/login") && method === "POST") {
      const body = await req.json().catch(() => ({}));
      const user = state.users.find((u) => u.email === body.email && u.password === body.password);
      if (!user) return bad("Invalid credentials");
      const res = { token: "dev-token", user: { id: user.id, name: user.name, email: user.email, role: user.role } };
      return ok(res);
    }

    if (path.startsWith("/api/auth/signup") && method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (!body.email || !body.password || !body.name) return bad("Missing fields");
      if (state.users.some((u) => u.email === body.email)) return bad("Email already exists");
      const id = Math.max(...state.users.map((u) => u.id)) + 1;
      const user = { id, name: body.name, email: body.email, role: body.role || "student", password: body.password };
      state.users.push(user);
      save(state);
      return created({ id: user.id, name: user.name, email: user.email, role: user.role });
    }

    if (path.startsWith("/api/auth/forgot") && method === "POST") {
      return ok({ message: "Password reset link sent (dev)" });
    }

    if (path.startsWith("/api/auth/reset") && method === "POST") {
      return ok({ message: "Password reset successful (dev)" });
    }

    // -------- GRADES --------
    if (path.startsWith("/api/grades") && method === "GET") {
      // supports /api/grades?reg=GU/ED/1234/23
      const u = new URL(path, window.location.origin);
      const reg = u.searchParams.get("reg");
      const data = reg ? state.grades.filter((g) => g.reg === reg) : state.grades;
      // compute totals/grades
      const withTotals = data.map((r) => {
        const total = (r.cat1 ?? 0) + (r.cat2 ?? 0) + (r.exam ?? 0);
        const grade = total >= 70 ? "A" : total >= 60 ? "B" : total >= 50 ? "C" : total >= 40 ? "D" : "E";
        return { ...r, total, grade };
      });
      return ok(withTotals);
    }

    // -------- MISSING MARKS --------
    if (path.startsWith("/api/missing-marks") && method === "GET") {
      return ok(state.missingMarks);
    }

    if (path.startsWith("/api/missing-marks") && method === "POST") {
      const body = await req.json().catch(() => ({}));
      const item = {
        id: "MM-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        student: body.student || "Unknown",
        reg: body.reg || "N/A",
        course: body.course || "N/A",
        assessment: body.assessment || "N/A",
        reason: body.reason || "",
        status: "Pending",
        submittedAt: new Date().toISOString().slice(0, 10),
      };
      state.missingMarks.unshift(item);
      save(state);
      return created(item);
    }

    if (path.startsWith("/api/missing-marks/") && method === "PATCH") {
      const id = path.split("/api/missing-marks/")[1];
      const body = await req.json().catch(() => ({}));
      const idx = state.missingMarks.findIndex((m) => m.id === id);
      if (idx === -1) return notFound("Request not found");
      state.missingMarks[idx] = { ...state.missingMarks[idx], ...body };
      save(state);
      return ok(state.missingMarks[idx]);
    }

    // -------- DEFAULT FALLBACK --------
    return notFound("Mock route not implemented: " + path);
  };
}
