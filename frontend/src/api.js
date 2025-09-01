const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';


export const api = {
token: null,
setToken(t) { this.token = t; localStorage.setItem('token', t); },
clearToken() { this.token = null; localStorage.removeItem('token'); },
getToken() {
if (this.token) return this.token;
const t = localStorage.getItem('token');
if (t) this.token = t;
return t;
},
async request(path, { method = 'GET', body, headers } = {}) {
const h = { 'Content-Type': 'application/json', ...(headers || {}) };
const token = this.getToken();
if (token) h['Authorization'] = `Bearer ${token}`;
const res = await fetch(`${BASE}${path}`, {
method, headers: h, body: body ? JSON.stringify(body) : undefined
});
let data = null;
try { data = await res.json(); } catch { data = null; }
if (!res.ok) {
const err = (data && (data.error || data.message)) || `HTTP ${res.status}`;
throw new Error(err);
}
return data;
}
};