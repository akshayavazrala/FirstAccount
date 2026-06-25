import { useState, useEffect, useRef } from "react";

// ─── DUMMY DATA ────────────────────────────────────────────────────────────────
const SEGMENTS = [
  {
    id: 1, type: "Students", icon: "🎓", count: 1842, growth: "+12.4%",
    color: "from-violet-500 to-purple-600",
    customers: [
      { name: "Priya Sharma", age: 21, location: "Delhi", score: 87, product: "Student Savings", status: "Hot" },
      { name: "Arjun Mehta", age: 19, location: "Mumbai", score: 74, product: "Digital Wallet", status: "Warm" },
      { name: "Sneha Patel", age: 22, location: "Pune", score: 91, product: "Student Loan", status: "Hot" },
      { name: "Rohan Das", age: 20, location: "Kolkata", score: 65, product: "Zero-Fee Account", status: "Warm" },
    ]
  },
  {
    id: 2, type: "Gig Workers", icon: "🚀", count: 3241, growth: "+28.7%",
    color: "from-orange-500 to-amber-500",
    customers: [
      { name: "Vikram Singh", age: 28, location: "Bangalore", score: 82, product: "Flexi Credit", status: "Hot" },
      { name: "Anita Rao", age: 32, location: "Chennai", score: 79, product: "Instant Loan", status: "Warm" },
      { name: "Suresh Kumar", age: 26, location: "Hyderabad", score: 93, product: "Business Account", status: "Hot" },
      { name: "Preethi Nair", age: 30, location: "Kochi", score: 61, product: "UPI Pro", status: "Cold" },
    ]
  },
  {
    id: 3, type: "Salaried", icon: "💼", count: 5673, growth: "+8.1%",
    color: "from-blue-500 to-cyan-500",
    customers: [
      { name: "Rajesh Verma", age: 35, location: "Noida", score: 96, product: "Home Loan", status: "Hot" },
      { name: "Kavitha Iyer", age: 29, location: "Hyderabad", score: 88, product: "Mutual Funds", status: "Hot" },
      { name: "Amir Khan", age: 41, location: "Lucknow", score: 72, product: "Term Insurance", status: "Warm" },
      { name: "Deepa Bose", age: 33, location: "Kolkata", score: 84, product: "Fixed Deposit", status: "Warm" },
    ]
  },
  {
    id: 4, type: "Business", icon: "🏢", count: 2109, growth: "+19.3%",
    color: "from-emerald-500 to-teal-500",
    customers: [
      { name: "Rahul Enterprises", age: 45, location: "Surat", score: 94, product: "Business Loan", status: "Hot" },
      { name: "Sharma & Co.", age: 38, location: "Jaipur", score: 78, product: "Trade Finance", status: "Warm" },
      { name: "TechVentures Pvt", age: 42, location: "Bangalore", score: 89, product: "Working Capital", status: "Hot" },
      { name: "Patel Traders", age: 50, location: "Ahmedabad", score: 67, product: "OD Facility", status: "Cold" },
    ]
  },
];

const PRODUCTS = [
  {
    id: 1, name: "FirstAccount Premium Savings",
    type: "Savings Account", icon: "🏦",
    confidence: 94, interest: "6.5% p.a.",
    features: ["Zero balance requirement", "5x reward points", "Free NEFT/RTGS", "Dedicated RM"],
    tag: "Best Match", color: "from-teal-400 to-cyan-500"
  },
  {
    id: 2, name: "Smart Home Loan",
    type: "Secured Loan", icon: "🏠",
    confidence: 87, interest: "8.45% p.a.",
    features: ["Up to ₹5 Cr", "30-year tenure", "No prepayment charges", "Quick approval"],
    tag: "Popular", color: "from-blue-500 to-indigo-600"
  },
  {
    id: 3, name: "Flexi Personal Loan",
    type: "Unsecured Loan", icon: "💳",
    confidence: 79, interest: "10.99% p.a.",
    features: ["₹50K – ₹25 Lakh", "Instant disbursal", "No collateral", "24hr approval"],
    tag: "Quick Apply", color: "from-violet-500 to-purple-600"
  },
  {
    id: 4, name: "Wealth Builder MF",
    type: "Investment", icon: "📈",
    confidence: 71, interest: "Upto 18% CAGR",
    features: ["SIP from ₹500", "Tax-saving ELSS", "Expert curated", "Real-time tracking"],
    tag: "High Returns", color: "from-emerald-500 to-teal-600"
  },
];

const CHAT_INIT = [
  { role: "bot", text: "Hello! I'm Arya, your FirstAccount AI Banking Assistant. I can help you find the perfect banking products, check eligibility, and guide you through our services. How can I assist you today?" },
  { role: "user", text: "What are the best savings account options for a salaried employee?" },
  { role: "bot", text: "Great question! For salaried employees, I recommend our **FirstAccount Premium Savings** account — offering 6.5% p.a. interest, zero balance requirement, and a dedicated relationship manager. You'd also get 5x reward points on all transactions. Shall I check your eligibility right now?" },
  { role: "user", text: "Yes, please check my eligibility." },
  { role: "bot", text: "Based on your profile — monthly salary ₹85,000, 3+ years employment history, CIBIL score 742 — you are **pre-approved** for our Premium Savings account. ✅\n\nWould you like me to initiate the application? It takes less than 5 minutes!" },
];

const SUGGESTIONS = [
  "What loans am I eligible for?",
  "Compare FD interest rates",
  "How to improve my CIBIL score?",
  "Best credit cards for me",
];

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const LEADS_DATA = [320, 410, 390, 520, 480, 610, 580, 720, 690, 810, 780, 940];
const CONV_DATA =  [22, 28, 25, 31, 29, 35, 33, 38, 36, 41, 39, 44];

// ─── UTILITIES ─────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Hot:  "bg-red-100 text-red-700 border border-red-200",
  Warm: "bg-amber-100 text-amber-700 border border-amber-200",
  Cold: "bg-sky-100 text-sky-700 border border-sky-200",
};
const ScoreBadge = ({ score }) => {
  const color = score >= 85 ? "text-emerald-500" : score >= 70 ? "text-amber-500" : "text-rose-500";
  return <span className={`font-bold text-lg ${color}`}>{score}</span>;
};

// ─── MINI CHART ────────────────────────────────────────────────────────────────
const LineChart = ({ data, color = "#00C9A7", height = 60 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 280;
    const y = height - ((v - min) / (max - min)) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 280 ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <polygon fill={`url(#g${color.replace("#","")})`} points={`0,${height} ${pts} 280,${height}`} />
    </svg>
  );
};

// ─── BAR CHART ─────────────────────────────────────────────────────────────────
const BarChart = ({ data, labels, color = "#00C9A7" }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-32 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t transition-all duration-500"
            style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.85 }}
          />
          <span className="text-[9px] text-slate-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── DONUT CHART ───────────────────────────────────────────────────────────────
const DonutChart = () => {
  const slices = [
    { pct: 44, color: "#00C9A7", label: "Salaried" },
    { pct: 25, color: "#6366f1", label: "Gig" },
    { pct: 18, color: "#f59e0b", label: "Students" },
    { pct: 13, color: "#10b981", label: "Business" },
  ];
  let cum = 0;
  const paths = slices.map(s => {
    const start = cum / 100 * 2 * Math.PI - Math.PI / 2;
    cum += s.pct;
    const end = cum / 100 * 2 * Math.PI - Math.PI / 2;
    const x1 = 50 + 40 * Math.cos(start), y1 = 50 + 40 * Math.sin(start);
    const x2 = 50 + 40 * Math.cos(end), y2 = 50 + 40 * Math.sin(end);
    const large = s.pct > 50 ? 1 : 0;
    return { d: `M50,50 L${x1},${y1} A40,40 0 ${large},1 ${x2},${y2} Z`, color: s.color, ...s };
  });
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-28 h-28 flex-shrink-0">
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
        <circle cx="50" cy="50" r="22" fill="#0F1E38" />
        <text x="50" y="54" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Leads</text>
      </svg>
      <div className="space-y-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-slate-300">{s.label}</span>
            <span className="text-xs font-semibold text-white ml-auto">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── NAV ───────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "⬡" },
  { id: "login", label: "Login", icon: "🔐" },
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "segments", label: "Segments", icon: "◈" },
  { id: "chat", label: "AI Assistant", icon: "◎" },
  { id: "products", label: "Products", icon: "❖" },
];

const Navbar = ({ page, setPage, sidebarOpen, setSidebarOpen }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5"
    style={{ background: "rgba(10,22,40,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>
        <span className="text-white font-black text-sm">FA</span>
      </div>
      <span className="text-white font-bold text-lg tracking-tight">FirstAccount <span style={{ color: "#00C9A7" }}>AI</span></span>
    </div>
    <div className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map(n => (
        <button key={n.id} onClick={() => setPage(n.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${page === n.id ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
          style={page === n.id ? { background: "rgba(0,201,167,0.15)", color: "#00C9A7" } : {}}>
          {n.label}
        </button>
      ))}
    </div>
    <button className="md:hidden text-white text-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
  </nav>
);

const MobileSidebar = ({ page, setPage, open, setOpen }) => (
  <>
    {open && <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)} />}
    <div className={`fixed top-0 right-0 h-full z-50 w-64 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      style={{ background: "#0A1628", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="p-6 space-y-2 mt-14">
        {NAV_ITEMS.map(n => (
          <button key={n.id} onClick={() => { setPage(n.id); setOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${page === n.id ? "text-white" : "text-slate-400"}`}
            style={page === n.id ? { background: "rgba(0,201,167,0.15)", color: "#00C9A7" } : {}}>
            <span className="mr-2">{n.icon}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  </>
);

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  const [pulse, setPulse] = useState(false);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 2000); return () => clearInterval(t); }, []);

  const features = [
    { icon: "🧠", title: "AI-Driven Lead Scoring", desc: "Machine learning models analyze 200+ behavioral signals to rank your highest-value prospects in real time." },
    { icon: "🎯", title: "Hyper-Personalization", desc: "Recommend the right banking product to the right customer at the right moment — with explainable AI confidence scores." },
    { icon: "📊", title: "Segment Intelligence", desc: "Auto-classify customers into Students, Gig Workers, Salaried, and Business segments with dynamic profiling." },
    { icon: "⚡", title: "Real-Time Alerts", desc: "Instant notifications when a lead hits a conversion threshold, so your team can act at the peak moment of intent." },
    { icon: "🔒", title: "Bank-Grade Security", desc: "End-to-end encryption, RBI-compliant data handling, and zero-knowledge architecture protect every data point." },
    { icon: "📱", title: "Omnichannel Reach", desc: "Engage customers across mobile, web, WhatsApp, and branch — all tracked in a single unified pipeline." },
  ];
  const stats = [
    { value: "₹2.4Cr", label: "Revenue Unlocked", sub: "Last 30 days" },
    { value: "12,865", label: "Leads Processed", sub: "This quarter" },
    { value: "41.3%", label: "Conversion Rate", sub: "↑ 8.2% MoM" },
    { value: "98.7%", label: "AI Accuracy", sub: "Validated model" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#06101F" }}>
      {/* Hero */}
      <div className="relative overflow-hidden pt-24 pb-20 px-6" style={{ background: "linear-gradient(160deg, #0A1628 0%, #06101F 60%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00C9A7, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute top-40 right-1/4 w-72 h-72 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #007CF0, transparent 70%)", filter: "blur(60px)" }} />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(0,201,167,0.12)", color: "#00C9A7", border: "1px solid rgba(0,201,167,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            The Future of<br />
            <span style={{ background: "linear-gradient(90deg,#00C9A7,#007CF0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Banking Intelligence
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            FirstAccount AI converts customer data into actionable intelligence — scoring leads, predicting needs, and recommending the perfect product before customers even ask.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setPage("dashboard")}
              className="px-8 py-4 rounded-xl font-bold text-base text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)", boxShadow: "0 8px 32px rgba(0,201,167,0.35)" }}>
              Open Dashboard →
            </button>
            <button onClick={() => setPage("chat")}
              className="px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}>
              Try AI Assistant
            </button>
          </div>
        </div>

        {/* Live stat card with pulse signature */}
        <div className="relative max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-5 text-center relative overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {i === 0 && (
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-1000 pointer-events-none ${pulse ? "opacity-100" : "opacity-0"}`}
                  style={{ background: "rgba(0,201,167,0.06)", border: "1px solid rgba(0,201,167,0.3)" }} />
              )}
              <div className="text-2xl font-black text-white mb-1" style={i === 0 ? { color: "#00C9A7" } : {}}>{s.value}</div>
              <div className="text-xs font-semibold text-slate-300 mb-0.5">{s.label}</div>
              <div className="text-[10px] text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Built for Modern Banking</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Everything your bank needs to turn data into revenue, leads into customers, and customers into advocates.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group cursor-default"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-base mb-2 group-hover:text-teal-400 transition-colors">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="rounded-3xl p-10 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(0,201,167,0.15) 0%, rgba(0,124,240,0.15) 100%)", border: "1px solid rgba(0,201,167,0.2)" }}>
          <h3 className="text-3xl font-black text-white mb-4">Ready to transform your bank?</h3>
          <p className="text-slate-400 mb-8">Join 12,000+ banking professionals using FirstAccount AI to grow faster.</p>
          <button onClick={() => setPage("login")}
            className="px-10 py-4 rounded-xl font-bold text-white text-base transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>
            Get Started — It's Free
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────────
const LoginPage = ({ setPage }) => {
  const [form, setForm] = useState({ email: "", pass: "", remember: false });
  const handle = (e) => { e.preventDefault(); setPage("dashboard"); };

  return (
    <div className="min-h-screen flex" style={{ background: "#06101F" }}>
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#0A1E3D 0%, #0A1628 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-1/2" style={{ background: "radial-gradient(ellipse at bottom left, rgba(0,201,167,0.1), transparent 70%)" }} />
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>
            <span className="text-white font-black">FA</span>
          </div>
          <span className="text-white font-bold text-xl">FirstAccount <span style={{ color: "#00C9A7" }}>AI</span></span>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">Intelligence that converts leads to loyal customers.</h2>
          <div className="space-y-4">
            {["AI Lead Scoring in real time", "₹2.4Cr unlocked last month", "98.7% prediction accuracy"].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,201,167,0.2)", border: "1px solid #00C9A7" }}>
                  <span style={{ color: "#00C9A7", fontSize: 10 }}>✓</span>
                </div>
                <span className="text-slate-300 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-xs relative">
          <span>🔒 RBI Compliant</span><span>·</span><span>256-bit SSL</span><span>·</span><span>ISO 27001</span>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>
              <span className="text-white font-black text-sm">FA</span>
            </div>
            <span className="text-white font-bold text-lg">FirstAccount AI</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-8">Sign in to your banking intelligence dashboard</p>

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email / Employee ID</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="rajesh.verma@sbi.co.in"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#00C9A7"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <input type="password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })}
                placeholder="••••••••••"
                className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#00C9A7"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} className="accent-teal-400" />
                <span className="text-xs text-slate-400">Remember for 30 days</span>
              </label>
              <button type="button" className="text-xs font-semibold" style={{ color: "#00C9A7" }}>Forgot password?</button>
            </div>
            <button type="submit" className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] hover:shadow-xl"
              style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)", boxShadow: "0 6px 24px rgba(0,201,167,0.3)" }}>
              Sign In to Dashboard
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-600">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["🏛️  Net Banking", "📱  OTP Login"].map((t, i) => (
              <button key={i} onClick={() => setPage("dashboard")}
                className="py-3 rounded-xl text-sm text-slate-300 font-medium transition-all hover:bg-white/10 hover:text-white"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {t}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-slate-600 mt-8">
            New to FirstAccount?{" "}
            <button className="font-semibold" style={{ color: "#00C9A7" }}>Request Access</button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
const Dashboard = ({ setPage }) => {
  const kpis = [
    { label: "Total Leads", value: "12,865", delta: "+18.4%", icon: "👥", color: "#00C9A7" },
    { label: "High Priority", value: "3,241", delta: "+24.1%", icon: "🔥", color: "#f59e0b" },
    { label: "Conversion Rate", value: "41.3%", delta: "+8.2%", icon: "📈", color: "#6366f1" },
    { label: "Revenue (MTD)", value: "₹84.2L", delta: "+12.7%", icon: "💰", color: "#10b981" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8" style={{ background: "#06101F" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Intelligence Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time lead & conversion analytics · Updated just now</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Live</span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((k, i) => (
            <div key={i} className="rounded-2xl p-5 transition-all hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{k.icon}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>{k.delta}</span>
              </div>
              <div className="text-2xl font-black text-white mb-1" style={{ color: k.color }}>{k.value}</div>
              <div className="text-xs text-slate-500">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Lead Trend */}
          <div className="lg:col-span-2 rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-base">Lead Volume Trend</h3>
                <p className="text-slate-500 text-xs">Monthly leads — FY 2024–25</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-lg text-teal-400" style={{ background: "rgba(0,201,167,0.1)" }}>+18.4% YoY</span>
            </div>
            <BarChart data={LEADS_DATA} labels={MONTHS} color="#00C9A7" />
          </div>

          {/* Donut */}
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-white font-bold text-base mb-1">Lead Segments</h3>
            <p className="text-slate-500 text-xs mb-5">Distribution by type</p>
            <DonutChart />
          </div>
        </div>

        {/* Conversion + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversion line */}
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-base">Conversion Rate (%)</h3>
                <p className="text-slate-500 text-xs">12-month rolling</p>
              </div>
              <span className="text-2xl font-black" style={{ color: "#6366f1" }}>41.3%</span>
            </div>
            <LineChart data={CONV_DATA} color="#6366f1" height={80} />
            <div className="flex justify-between mt-2">
              {MONTHS.map((m, i) => i % 3 === 0 && <span key={i} className="text-[10px] text-slate-600">{m}</span>)}
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-white font-bold text-base mb-4">Recent Lead Activity</h3>
            <div className="space-y-3">
              {[
                { name: "Rajesh Verma", action: "Score → 96 (Hot)", time: "2m ago", color: "#ef4444" },
                { name: "Kavitha Iyer", action: "Applied — Home Loan", time: "7m ago", color: "#10b981" },
                { name: "Suresh Kumar", action: "Segment: Gig → Biz", time: "14m ago", color: "#f59e0b" },
                { name: "Priya Sharma", action: "Chat initiated (AI)", time: "21m ago", color: "#6366f1" },
                { name: "Vikram Singh", action: "Score → 82 (Warm→Hot)", time: "35m ago", color: "#ef4444" },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `${a.color}30`, border: `1px solid ${a.color}50` }}>
                      {a.name[0]}
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold">{a.name}</div>
                      <div className="text-slate-500 text-xs">{a.action}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "View Segments", page: "segments", icon: "◈", color: "#00C9A7" },
            { label: "AI Assistant", page: "chat", icon: "◎", color: "#6366f1" },
            { label: "Product Reco", page: "products", icon: "❖", color: "#f59e0b" },
            { label: "Login Page", page: "login", icon: "🔐", color: "#10b981" },
          ].map((n, i) => (
            <button key={i} onClick={() => setPage(n.page)}
              className="py-4 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${n.color}30` }}>
              <span className="mr-2">{n.icon}</span>{n.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── SEGMENTS PAGE ─────────────────────────────────────────────────────────────
const SegmentsPage = () => {
  const [active, setActive] = useState(0);
  const seg = SEGMENTS[active];

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8" style={{ background: "#06101F" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-white">Customer Segments</h1>
          <p className="text-slate-500 text-sm mt-1">AI-classified leads by profile type with real-time scoring</p>
        </div>

        {/* Segment tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {SEGMENTS.map((s, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`p-5 rounded-2xl text-left transition-all duration-200 ${active === i ? "scale-[1.02]" : "hover:scale-[1.01]"}`}
              style={{
                background: active === i ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                border: active === i ? "1px solid rgba(0,201,167,0.4)" : "1px solid rgba(255,255,255,0.07)"
              }}>
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-white font-bold text-sm mb-1">{s.type}</div>
              <div className="text-2xl font-black mb-1" style={{ color: "#00C9A7" }}>{s.count.toLocaleString()}</div>
              <div className="text-xs text-emerald-400 font-semibold">{s.growth} MoM</div>
            </button>
          ))}
        </div>

        {/* Segment header */}
        <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-r ${seg.color} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 80% 50%, white, transparent)" }} />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm font-semibold mb-1">{seg.icon} {seg.type}</div>
              <div className="text-white font-black text-3xl">{seg.count.toLocaleString()} Leads</div>
              <div className="text-white/80 text-sm mt-1">Growth: <strong>{seg.growth}</strong> month-over-month</div>
            </div>
            <div className="text-right">
              <div className="text-white/70 text-xs mb-1">Avg. Lead Score</div>
              <div className="text-white font-black text-4xl">82</div>
            </div>
          </div>
        </div>

        {/* Customer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {seg.customers.map((c, i) => (
            <div key={i} className="rounded-2xl p-6 transition-all hover:scale-[1.01]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base"
                    style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{c.name}</div>
                    <div className="text-slate-500 text-xs">{c.location} · Age {c.age}</div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status]}`}>{c.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Recommended Product</div>
                  <div className="text-white text-sm font-semibold">{c.product}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">Lead Score</div>
                  <ScoreBadge score={c.score} />
                  <span className="text-slate-600 text-xs">/100</span>
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.score}%`, background: c.score >= 85 ? "#10b981" : c.score >= 70 ? "#f59e0b" : "#ef4444" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CHAT PAGE ─────────────────────────────────────────────────────────────────
const ChatPage = () => {
  const [messages, setMessages] = useState(CHAT_INIT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text) => {
    const t = text || input.trim();
    if (!t) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: t }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        role: "bot",
        text: "Thank you for your question! Based on your profile and transaction history, I've identified the best-fit products for you. Your current CIBIL score of 742 qualifies you for our premium offerings. Would you like me to walk you through the top 3 recommendations?"
      }]);
    }, 1800);
  };

  const formatMsg = (text) => text.split("**").map((t, i) =>
    i % 2 === 1 ? <strong key={i} className="font-bold text-white">{t}</strong> : <span key={i}>{t}</span>
  );

  return (
    <div className="min-h-screen pt-20 pb-6 px-4 md:px-8 flex flex-col" style={{ background: "#06101F" }}>
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="rounded-2xl p-5 mb-4 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>🤖</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2"
              style={{ borderColor: "#06101F" }} />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold">Arya — AI Banking Assistant</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              Online · Avg. response 1.2s
            </div>
          </div>
          <div className="text-xs text-slate-500 text-right">
            <div>Powered by</div>
            <div className="text-slate-400 font-semibold">FirstAccount AI</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1" style={{ maxHeight: "55vh", minHeight: "300px" }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role === "bot" && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>🤖</div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "text-white rounded-tr-sm"
                  : "text-slate-200 rounded-tl-sm"
              }`}
                style={m.role === "user"
                  ? { background: "linear-gradient(135deg,#00C9A7,#007CF0)" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {formatMsg(m.text)}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>🤖</div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "#00C9A7", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested */}
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105"
              style={{ background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.25)", color: "#00C9A7" }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about loans, savings, investments..."
            className="flex-1 px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <button onClick={() => send()}
            className="px-5 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)", minWidth: 52 }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PRODUCTS PAGE ─────────────────────────────────────────────────────────────
const ProductsPage = () => {
  const [applied, setApplied] = useState({});

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8" style={{ background: "#06101F" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-white">AI Product Recommendations</h1>
          <p className="text-slate-500 text-sm mt-1">Personalized for Rajesh Verma · Last updated 2 min ago</p>
        </div>

        {/* Customer Profile Card */}
        <div className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(0,124,240,0.15), rgba(0,201,167,0.1))", border: "1px solid rgba(0,201,167,0.2)" }}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#00C9A7,#007CF0)" }}>RV</div>
              <div>
                <div className="text-white font-black text-xl">Rajesh Verma</div>
                <div className="text-slate-400 text-sm">Senior Software Engineer · Noida, UP</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>Salaried ✓</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(0,201,167,0.12)", color: "#00C9A7", border: "1px solid rgba(0,201,167,0.25)" }}>Premium Tier</span>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Monthly Salary", value: "₹85,000" },
                { label: "CIBIL Score", value: "742", highlight: true },
                { label: "Existing Products", value: "3" },
                { label: "Lead Score", value: "96/100", highlight: true },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className={`text-lg font-black ${s.highlight ? "text-teal-400" : "text-white"}`}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((p, i) => (
            <div key={i} className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Product banner */}
              <div className={`bg-gradient-to-r ${p.color} p-5 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <div className="text-white font-black text-base">{p.name}</div>
                    <div className="text-white/70 text-xs">{p.type}</div>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">{p.tag}</span>
              </div>

              <div className="p-5">
                {/* Confidence score */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">AI Confidence</span>
                  <span className="text-lg font-black" style={{ color: "#00C9A7" }}>{p.confidence}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 mb-4 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${p.confidence}%`, background: "linear-gradient(90deg,#00C9A7,#007CF0)" }} />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm">Interest / Returns</span>
                  <span className="text-white font-bold">{p.interest}</span>
                </div>

                <div className="space-y-2 mb-5">
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <span style={{ color: "#00C9A7" }} className="text-xs">✓</span>
                      <span className="text-slate-400 text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setApplied(a => ({ ...a, [p.id]: true }))}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${applied[p.id] ? "" : "hover:scale-[1.02]"}`}
                  style={applied[p.id]
                    ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", cursor: "default" }
                    : { background: "linear-gradient(135deg,#00C9A7,#007CF0)", color: "white" }}>
                  {applied[p.id] ? "✓ Application Submitted" : `Apply for ${p.name.split(" ").slice(0, 2).join(" ")}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PAGES = { home: HomePage, login: LoginPage, dashboard: Dashboard, segments: SegmentsPage, chat: ChatPage, products: ProductsPage };
  const Page = PAGES[page] || HomePage;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#06101F" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
      `}</style>
      <Navbar page={page} setPage={setPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileSidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />
      <Page setPage={setPage} />
    </div>
  );
}
