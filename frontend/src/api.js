const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001/api";

export const api = {
  token: null,

  setToken(t) {
    this.token = t;
    localStorage.setItem("token", t);
  },

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  },

  getToken() {
    if (this.token) return this.token;
    const t = localStorage.getItem("token");
    if (t) this.token = t;
    return t;
  },

  async request(path, { method = "GET", body, headers } = {}) {
    const h = { "Content-Type": "application/json", ...(headers || {}) };
    const token = this.getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: h,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      // 🔴 Build an Axios-style error object
      const error = new Error(
        (data && (data.error || data.message)) || `HTTP ${res.status}`
      );
      error.response = {
        status: res.status,
        data,
      };
      throw error;
    }

    return data;
  },

  // ✅ Shorthand methods
  get(path, opts) {
    return this.request(path, { ...opts, method: "GET" });
  },
  post(path, body, opts) {
    return this.request(path, { ...opts, method: "POST", body });
  },
  put(path, body, opts) {
    return this.request(path, { ...opts, method: "PUT", body });
  },
  delete(path, opts) {
    return this.request(path, { ...opts, method: "DELETE" });
  },
};
