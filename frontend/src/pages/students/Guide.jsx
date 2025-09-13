// filepath: src/pages/Guide.jsx
import React, { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

// GAU brand tokens
const BRAND = {
  primary: "#006F3D",
  primaryDark: "#004D2A",
  accent: "#C9A227",
  text: "#0E2A1E",
  line: "#E7ECE9",
};

const cn = (...a) => a.filter(Boolean).join(" ");

function ButtonLink({ to, href, children, variant = "solid", size = "md", onClick }) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl select-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900/10",
    size === "sm" && "px-3 py-1.5 text-sm",
    size === "md" && "px-4 py-2 text-sm",
    size === "lg" && "px-5 py-2.5 text-base"
  );
  const cls = cn(base, variant === "solid" ? "text-white shadow hover:shadow-md" : "border bg-white hover:bg-zinc-50");
  const style = variant === "solid"
    ? { background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)` }
    : { borderColor: BRAND.line };
  const common = { className: cls, style, onClick };
  if (to) return <RouterLink to={to} {...common}>{children}</RouterLink>;
  return <a href={href} {...common}>{children}</a>;
}

function Card({ children, className = "" }) {
  return (
    <div className={cn("rounded-2xl border bg-white p-5 shadow-sm", className)} style={{ borderColor: BRAND.line }}>
      {children}
    </div>
  );
}

/* ------------------ segmented gradient ribbon (distinct look) ------------------ */
function SegmentedRibbon() {
  return (
    <svg viewBox="0 0 100 36" className="w-full h-36">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={BRAND.primary} />
          <stop offset="50%" stopColor={BRAND.accent} />
          <stop offset="100%" stopColor={BRAND.primaryDark} />
        </linearGradient>
      </defs>
      {/* base glow line */}
      <path d="M 8 26 C 30 6, 70 34, 92 26" fill="none" stroke="url(#grad)" strokeWidth="4" strokeLinecap="round" opacity="0.18" />
      {/* segmented overlay */}
      <path d="M 8 26 C 30 6, 70 34, 92 26" fill="none" stroke="url(#grad)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="14 10" />

      {/* diamond markers (distinct from circles) */}
      {[
        { x: 12, y: 26, n: 1 },
        { x: 50, y: 16, n: 2 },
        { x: 88, y: 26, n: 3 },
      ].map(({ x, y, n }) => (
        <g key={n} transform={`translate(${x},${y})`}>
          <rect x={-6} y={-6} width={12} height={12} rx={2} transform="rotate(45)" fill="#fff" stroke={BRAND.primary} strokeWidth="1.4" />
          <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="700" fill={BRAND.primaryDark}>
            {n}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------ page ------------------ */
export default function Guide() {
  const updated = useMemo(() => new Date().toLocaleDateString(undefined,{year:"numeric", month:"short", day:"2-digit"}), []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <header className="border-b" style={{borderColor:BRAND.line}}>
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" style={{color:BRAND.text}}>Your path in GradeView</h1>
          <p className="mt-2 text-[15px] md:text-base text-zinc-700">From sign-in to results — fast, precise, accountable.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* ribbon with diamond numbers */}
        <SegmentedRibbon />

        {/* steps */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card>
            <h3 className="text-lg font-semibold" style={{color:BRAND.text}}>1. Sign in</h3>
            <p className="mt-1 text-sm text-zinc-600">Use your GAU email, then land in your workspace (Student / Lecturer / Department).</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold" style={{color:BRAND.text}}>2. Do your task</h3>
            <p className="mt-1 text-sm text-zinc-600">Students report Missing Marks; Lecturers update Gradebook; Departments review & approve.</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold" style={{color:BRAND.text}}>3. Track & export</h3>
            <p className="mt-1 text-sm text-zinc-600">Follow status to resolution and export term reports when needed.</p>
          </Card>
        </div>

        {/* actions (no print) */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-zinc-600">Updated {updated}</div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink to="/login" variant="solid" size="lg">Start now</ButtonLink>
            <ButtonLink to="/student" variant="outline">Student</ButtonLink>
            <ButtonLink to="/lecturer" variant="outline">Lecturer</ButtonLink>
            <ButtonLink to="/department" variant="outline">Department</ButtonLink>
          </div>
        </div>
      </main>
    </div>
  );
}
