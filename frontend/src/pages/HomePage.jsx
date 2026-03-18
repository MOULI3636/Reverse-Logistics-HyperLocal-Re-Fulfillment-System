import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  RefreshCw,
  Leaf,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ChevronRight,
  Package,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Users,
  Clock,
  TrendingDown,
  Warehouse,
  MapPinned,
  CheckCircle2,
  ArrowDownRight,
  Recycle,
  IndianRupee,
  Timer,
  Heart,
  BoxSelect,
} from "lucide-react";

/* ============================================================
   SCROLL ANIMATION HOOK
   ============================================================ */
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("anim-visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document
      .querySelectorAll(".anim-up, .anim-left, .anim-right, .anim-scale")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ============================================================
   COUNT-UP HOOK
   ============================================================ */
const useCountUp = (end, duration = 2000) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let s = 0;
          const step = end / (duration / 16);
          const t = setInterval(() => {
            s += step;
            if (s >= end) {
              setVal(end);
              clearInterval(t);
            } else setVal(Math.floor(s));
          }, 16);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return { val, ref };
};

/* ============================================================
   HOMEPAGE
   ============================================================ */
const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useScrollAnimation();

  const s1 = useCountUp(80, 2200);
  const s2 = useCountUp(68, 2200);
  const s3 = useCountUp(60, 2200);
  const s4 = useCountUp(97, 2200);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (p) => location.pathname === p;

  return (
    <div className="bg-[#fafbfc] min-h-screen text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* ─── Fonts & Animations ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { font-family: 'Poppins', system-ui, sans-serif; }

        .anim-up {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .anim-left {
          opacity: 0; transform: translateX(-50px);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .anim-right {
          opacity: 0; transform: translateX(50px);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .anim-scale {
          opacity: 0; transform: scale(0.9);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1);
        }
        .anim-visible {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-slow-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .float-slow { animation: float-slow 4s ease-in-out infinite; }
        .float-slow-d1 { animation: float-slow 4s ease-in-out 1.3s infinite; }
        .float-slow-d2 { animation: float-slow-2 3.5s ease-in-out 0.7s infinite; }
      `}</style>

      {/* Navbar has been moved to App.jsx */}

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[72px]">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-green-50" />
          <div className="absolute top-20 -left-40 w-[700px] h-[700px] bg-emerald-200/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-200/25 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-teal-200/20 rounded-full blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto w-full px-5 md:px-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-20 py-16 lg:py-0">
          {/* Left */}
          <div className="lg:w-[55%] flex flex-col text-center lg:text-left z-10 anim-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-widest text-emerald-700 uppercase bg-emerald-100/60 backdrop-blur-sm rounded-full w-fit mx-auto lg:mx-0 border border-emerald-200/60 shadow-sm">
              <Zap size={14} className="text-emerald-500" />
              HyperLocal Re-Fulfillment System
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4.25rem] font-black text-slate-900 mb-7 leading-[1.08] tracking-tight">
              Turn Returns Into
              <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500">
                  Instant Re-Deliveries
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 8C50 2 100 2 150 6C200 10 250 4 298 7"
                    stroke="url(#ug)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="ug" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#059669" />
                      <stop offset="1" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              Our smart system re-dispatches returned clothing from{" "}
              <span className="text-emerald-600 font-semibold">
                nearby local warehouses
              </span>{" "}
              to new buyers — cutting delivery time by 80% and logistics costs
              by 68%. No more long-distance return trips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Link to="/demo" className="no-underline">
                <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97] cursor-pointer border-none">
                  🚀 Run Demo Simulation
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link to="/login" className="no-underline">
                <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-base hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97] shadow-sm cursor-pointer border-none">
                  View Seller Panel
                  <ChevronRight size={18} />
                </button>
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-500"
                />
                <span>Zero Long-Distance Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-500"
                />
                <span>Local Warehouse Network</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-500"
                />
                <span>Real-Time Matching</span>
              </div>
            </div>
          </div>

          {/* Right — Hero Visual */}
          <div className="lg:w-[45%] flex justify-center relative z-10 anim-right" style={{ transitionDelay: "0.2s" }}>
            <div className="relative w-full max-w-[540px]">
              {/* Background card */}
              <div className="absolute inset-4 bg-gradient-to-tr from-emerald-100/80 to-green-50/80 rounded-[2.5rem] transform rotate-2 shadow-2xl shadow-emerald-200/40 border border-emerald-100/50" />

              {/* Main visual card */}
              <div className="relative bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white/80">
                {/* Illustration */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-100/50">
                  <svg
                    viewBox="0 0 400 280"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                  >
                    {/* Warehouse */}
                    <rect x="20" y="120" width="100" height="80" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                    <polygon points="20,120 70,85 120,120" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                    <rect x="50" y="155" width="30" height="45" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="70" y="112" textAnchor="middle" fill="#16a34a" fontSize="9" fontWeight="700" fontFamily="Poppins">ORIGIN WH</text>

                    {/* Old route (X'd out) */}
                    <path d="M 120 160 Q 200 60 280 140" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" opacity="0.3" fill="none" />
                    <text x="200" y="95" textAnchor="middle" fill="#ef4444" fontSize="20" opacity="0.5">✕</text>
                    <text x="200" y="80" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="600" opacity="0.5" fontFamily="Poppins">OLD ROUTE</text>

                    {/* Local WH */}
                    <rect x="150" y="180" width="80" height="50" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
                    <text x="190" y="202" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="700" fontFamily="Poppins">LOCAL WH</text>
                    <text x="190" y="222" textAnchor="middle" fontSize="14">🏭</text>

                    {/* New route arrow */}
                    <path d="M 120 180 L 150 195" stroke="#16a34a" strokeWidth="2.5" />
                    <path d="M 230 205 L 280 175" stroke="#16a34a" strokeWidth="2.5" />
                    <polygon points="275,170 285,175 275,180" fill="#16a34a" />

                    {/* Customer */}
                    <rect x="280" y="130" width="90" height="65" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                    <polygon points="280,130 325,95 370,130" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                    <rect x="305" y="155" width="25" height="40" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="325" y="122" textAnchor="middle" fill="#16a34a" fontSize="9" fontWeight="700" fontFamily="Poppins">CUSTOMER</text>

                    {/* Speed badge */}
                    <rect x="250" y="30" width="120" height="30" rx="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="310" y="50" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="700" fontFamily="Poppins">⚡ 80% Faster</text>

                    {/* Cost badge */}
                    <rect x="30" y="40" width="110" height="30" rx="15" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                    <text x="85" y="60" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="700" fontFamily="Poppins">💰 68% Cheaper</text>

                    {/* Pulse on local WH */}
                    <circle cx="190" cy="205" r="6" fill="#22c55e" opacity="0.6">
                      <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -left-6 top-1/4 bg-white rounded-2xl px-5 py-4 shadow-xl shadow-slate-200/60 border border-slate-100 float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Cost Saved
                    </p>
                    <p className="text-lg font-extrabold text-slate-900">68%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/3 bg-white rounded-2xl px-5 py-4 shadow-xl shadow-slate-200/60 border border-slate-100 float-slow-d1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Faster Delivery
                    </p>
                    <p className="text-lg font-extrabold text-slate-900">80%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-2 bottom-8 bg-white rounded-2xl px-5 py-4 shadow-xl shadow-slate-200/60 border border-slate-100 float-slow-d2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Less CO₂
                    </p>
                    <p className="text-lg font-extrabold text-slate-900">60%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROBLEM STATEMENT ═══════════════════ */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="anim-up text-center mb-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
              The Problem We Solve
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-snug">
              In India, <span className="text-red-500">25-30%</span> of online fashion orders are returned. Traditional reverse logistics is{" "}
              <span className="text-red-500">slow, expensive & wasteful</span>.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              {
                icon: <Clock size={22} />,
                val: "5+ Days",
                label: "Avg return-to-resale time",
                color: "red",
              },
              {
                icon: <IndianRupee size={22} />,
                val: "₹250+",
                label: "Avg reverse shipping cost",
                color: "red",
              },
              {
                icon: <Warehouse size={22} />,
                val: "3x",
                label: "Warehouse congestion",
                color: "red",
              },
              {
                icon: <Globe size={22} />,
                val: "High",
                label: "Carbon footprint",
                color: "red",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-red-50/50 border border-red-100/60 anim-up"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-3">
                  {item.icon}
                </div>
                <p className="text-2xl font-extrabold text-red-600 mb-1">
                  {item.val}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SOLUTION / FEATURES ═══════════════════ */}
      <section className="py-24 lg:py-32 bg-[#fafbfc] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[100px] -z-0" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-100/20 rounded-full blur-[80px] -z-0" />

        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto anim-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-100/50 rounded-full border border-emerald-200/50">
              <Package size={14} />
              Our Solution
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Smart HyperLocal{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Re-Fulfillment
              </span>
            </h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Instead of shipping returns back to origin, our system
              intelligently reroutes them through nearby local warehouses to
              fulfill new orders faster and cheaper.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPinned size={28} />,
                gradient: "from-emerald-500 to-emerald-600",
                bg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                shadow: "shadow-emerald-500/10",
                title: "HyperLocal Dispatch",
                desc: "Returned products are redirected to the nearest local warehouse instead of traveling hundreds of kilometers back to the origin — enabling same-city re-delivery.",
              },
              {
                icon: <RefreshCw size={28} />,
                gradient: "from-green-500 to-green-600",
                bg: "bg-green-50",
                iconColor: "text-green-600",
                shadow: "shadow-green-500/10",
                title: "Smart Matching Engine",
                desc: "Our system automatically matches returned products with nearby pending orders of the same item, enabling instant re-fulfillment without warehouse delays.",
              },
              {
                icon: <Leaf size={28} />,
                gradient: "from-teal-500 to-teal-600",
                bg: "bg-teal-50",
                iconColor: "text-teal-600",
                shadow: "shadow-teal-500/10",
                title: "Sustainable Logistics",
                desc: "By eliminating long-distance return shipping, our system reduces carbon emissions by 60% per return — making e-commerce greener without extra effort.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`group relative bg-white border border-slate-200/60 p-10 rounded-3xl hover:shadow-2xl ${card.shadow} hover:-translate-y-2 transition-all duration-500 cursor-default anim-up`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div
                  className={`absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r ${card.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div
                  className={`w-14 h-14 ${card.bg} ${card.iconColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-[15px] leading-relaxed">
                  {card.desc}
                </p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Learn more <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                refObj: s1,
                unit: "%",
                label: "Delivery Time Saved",
                icon: <Timer size={20} />,
              },
              {
                refObj: s2,
                unit: "%",
                label: "Cost Reduction",
                icon: <BarChart3 size={20} />,
              },
              {
                refObj: s3,
                unit: "%",
                label: "Less CO₂ Emissions",
                icon: <Globe size={20} />,
              },
              {
                refObj: s4,
                unit: "%",
                label: "Match Success Rate",
                icon: <Shield size={20} />,
              },
            ].map((stat, i) => (
              <div key={i} className="text-center anim-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 text-emerald-400 mb-4 border border-white/10">
                  {stat.icon}
                </div>
                <p
                  ref={stat.refObj.ref}
                  className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
                >
                  {stat.refObj.val}
                  {stat.unit}
                </p>
                <p className="text-slate-400 font-medium text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-20 max-w-2xl mx-auto anim-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-100/50 rounded-full border border-emerald-200/50">
              <Shield size={14} />
              How It Works
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Four Steps to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Smarter Returns
              </span>
            </h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              A simple process that transforms costly return logistics into an
              efficient local re-fulfillment cycle.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200" />

            {[
              {
                step: "01",
                icon: <Package size={24} />,
                title: "Customer Returns Item",
                desc: "A buyer initiates a return for a clothing product. The system captures the request instantly.",
                color: "emerald",
              },
              {
                step: "02",
                icon: <MapPinned size={24} />,
                title: "Nearest Warehouse Found",
                desc: "Our engine locates the closest local warehouse with demand for the same product.",
                color: "green",
              },
              {
                step: "03",
                icon: <Truck size={24} />,
                title: "Local Re-Dispatch",
                desc: "Instead of going back to origin, the item is sent to a nearby buyer via local warehouse.",
                color: "teal",
              },
              {
                step: "04",
                icon: <CheckCircle2 size={24} />,
                title: "Delivered in Hours",
                desc: "The new customer receives the item in under 24 hours — not 5 days.",
                color: "emerald",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center relative anim-up"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div
                  className={`w-[72px] h-[72px] mx-auto bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center mb-6 relative z-10 border-4 border-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl`}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest mb-2 block">
                  Step {item.step}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BENEFITS GRID ═══════════════════ */}
      <section className="py-24 bg-[#fafbfc] relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-100/30 rounded-full blur-[100px] -z-0" />

        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto anim-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-100/50 rounded-full border border-emerald-200/50">
              <Heart size={14} />
              Why It Matters
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Benefits for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Everyone
              </span>
            </h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Every hour saved in reverse logistics creates a ripple effect —
              benefiting sellers, customers, and the environment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={24} />,
                title: "Speed",
                desc: "Re-delivery time drops from 5 days to under 24 hours through hyperlocal matching.",
                bg: "bg-amber-50",
                iconColor: "text-amber-600",
                border: "border-amber-100",
              },
              {
                icon: <IndianRupee size={24} />,
                title: "Cost Savings",
                desc: "Reverse logistics costs reduced by up to 68% — from ₹250 to just ₹80 per return.",
                bg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                border: "border-emerald-100",
              },
              {
                icon: <Leaf size={24} />,
                title: "Sustainability",
                desc: "60% lower carbon emissions by eliminating long-distance return shipping routes.",
                bg: "bg-teal-50",
                iconColor: "text-teal-600",
                border: "border-teal-100",
              },
              {
                icon: <BarChart3 size={24} />,
                title: "Better Margins",
                desc: "Sellers retain more profit per order with reduced shipping, handling & restocking costs.",
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
                border: "border-blue-100",
              },
              {
                icon: <Users size={24} />,
                title: "Customer Delight",
                desc: "Faster replacements mean happier customers and significantly higher repeat purchase rates.",
                bg: "bg-purple-50",
                iconColor: "text-purple-600",
                border: "border-purple-100",
              },
              {
                icon: <Warehouse size={24} />,
                title: "Less Congestion",
                desc: "Decentralized returns reduce origin warehouse overload and processing bottlenecks.",
                bg: "bg-rose-50",
                iconColor: "text-rose-600",
                border: "border-rose-100",
              },
            ].map((b, i) => (
              <div
                key={i}
                className={`group bg-white border border-slate-200/60 rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 anim-up`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div
                  className={`w-12 h-12 ${b.bg} ${b.iconColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border ${b.border}`}
                >
                  {b.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  {b.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ COMPARISON SECTION ═══════════════════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-16 max-w-2xl mx-auto anim-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-100/50 rounded-full border border-emerald-200/50">
              <Recycle size={14} />
              Before vs After
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Traditional vs{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                HyperLocal
              </span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional */}
            <div className="bg-red-50/50 border border-red-200/60 rounded-3xl p-8 anim-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-lg font-bold text-red-700">
                  Traditional Returns
                </h4>
              </div>
              <ul className="space-y-4">
                {[
                  { label: "Delivery Time", value: "5+ Days" },
                  { label: "Shipping Cost", value: "₹250+" },
                  { label: "Route", value: "Delhi → Bangalore → Delhi" },
                  { label: "Carbon Impact", value: "High emissions" },
                  { label: "Warehouse Load", value: "Congested" },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-red-100 last:border-0"
                  >
                    <span className="text-sm text-slate-600 font-medium">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* HyperLocal */}
            <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-3xl p-8 relative overflow-hidden anim-right" style={{ transitionDelay: "0.15s" }}>
              {/* Recommended badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                ✓ Recommended
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-emerald-700">
                  HyperLocal System
                </h4>
              </div>
              <ul className="space-y-4">
                {[
                  { label: "Delivery Time", value: "< 24 Hours" },
                  { label: "Shipping Cost", value: "₹80" },
                  { label: "Route", value: "Delhi WH → Delhi Customer" },
                  { label: "Carbon Impact", value: "60% less CO₂" },
                  { label: "Warehouse Load", value: "Decentralized" },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-emerald-100 last:border-0"
                  >
                    <span className="text-sm text-slate-600 font-medium">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ USE CASE SCENARIO ═══════════════════ */}
      <section className="py-24 bg-[#fafbfc]">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-16 max-w-2xl mx-auto anim-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-100/50 rounded-full border border-emerald-200/50">
              <BoxSelect size={14} />
              Real Example
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              See It in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Action
              </span>
            </h3>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-lg shadow-slate-100/50 anim-scale">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Scenario */}
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">
                  📦 Scenario: T-Shirt Return in Delhi
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      icon: "👤",
                      text: "Customer A in Delhi returns a blue T-shirt (wrong size)",
                    },
                    {
                      icon: "🔍",
                      text: "System finds Customer B in Delhi who ordered the same T-shirt",
                    },
                    {
                      icon: "🏭",
                      text: "Return goes to Delhi Local Warehouse (not Bangalore origin)",
                    },
                    {
                      icon: "🚚",
                      text: "QC check done, T-shirt dispatched to Customer B",
                    },
                    {
                      icon: "✅",
                      text: "Customer B receives it in 18 hours instead of 5 days",
                    },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="text-xl mt-0.5">{step.icon}</span>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100/60">
                <h5 className="text-base font-bold text-emerald-700 mb-6 flex items-center gap-2">
                  <Zap size={18} />
                  Results
                </h5>
                <div className="space-y-5">
                  {[
                    {
                      label: "Delivery Time",
                      old: "5 Days",
                      new: "18 Hours",
                    },
                    {
                      label: "Shipping Cost",
                      old: "₹250",
                      new: "₹80",
                    },
                    {
                      label: "Distance",
                      old: "2,200 km",
                      new: "15 km",
                    },
                    {
                      label: "CO₂ Emission",
                      old: "2.1 kg",
                      new: "0.3 kg",
                    },
                  ].map((r, i) => (
                    <div key={i}>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        {r.label}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-red-400 line-through">
                          {r.old}
                        </span>
                        <ArrowRight size={14} className="text-emerald-500" />
                        <span className="text-lg font-extrabold text-emerald-700">
                          {r.new}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-green-700 rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl shadow-emerald-600/20 anim-scale">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                Ready to Revolutionize Your Reverse Logistics?
              </h3>
              <p className="text-emerald-100 text-lg mb-10 font-medium leading-relaxed">
                Try our interactive demo to see how returned products get
                re-dispatched through the HyperLocal network in real time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/demo" className="no-underline">
                  <button className="group px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97] cursor-pointer border-none">
                    🚀 Launch Demo Simulation
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </Link>
                <Link to="/seller" className="no-underline">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-[0.97] cursor-pointer">
                    Explore Seller Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-16 pb-12">
          {/* Main Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <RefreshCw
                    className="text-white w-[18px] h-[18px]"
                    strokeWidth={2.5}
                  />
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Reverse<span className="text-emerald-400">Logistics</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
                Smart HyperLocal Re-Fulfillment System. Reducing delivery time,
                cost, and carbon footprint through intelligent local redispatch
                of returned products.
              </p>
              <div className="flex gap-3">
                {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:-translate-y-0.5 no-underline"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  { to: "/", label: "Home", target: "_self" },
                  { to: "/demo", label: "Demo Simulation", target: "_self" },
                  { to: "/seller", label: "Seller Panel", target: "_self" },
                  { to: "/admin", label: "Admin Panel", target: "_self" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      target={link.target}
                      className="text-sm text-slate-400 hover:text-white transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
                Resources
              </h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {[
                  "Documentation",
                  "API Reference",
                  "Case Studies",
                  "Research Paper",
                ].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
                Contact
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Mail size={12} className="text-emerald-400" />
                  </div>
                  <span className="text-slate-400">
                    support@reverselogistics.com
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Phone size={12} className="text-emerald-400" />
                  </div>
                  <span className="text-slate-400">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <MapPin size={12} className="text-emerald-400" />
                  </div>
                  <span className="text-slate-400">New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
            <p className="text-xs text-slate-500 font-medium">
              © 2025 ReverseLogistics. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">
                Terms
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All systems operational
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
