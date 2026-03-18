import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (p) => location.pathname === p;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home", target: "_self" },
    { to: "/demo", label: "Demo Page", target: "_self" },
  ];

  if (user) {
    if (user.role === 'admin') navLinks.push({ to: "/admin", label: "Admin Panel", target: "_self" });
    if (user.role === 'seller') navLinks.push({ to: "/seller", label: "Seller Panel", target: "_self" });
    if (user.role === 'customer') navLinks.push({ to: "/shop", label: "Shop", target: "_self" });
  } else {
    navLinks.push({ to: "/login", label: "Login", target: "_self" });
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
        ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-b border-slate-200/60"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group no-underline">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
            <RefreshCw
              className="text-white w-[18px] h-[18px]"
              strokeWidth={2.5}
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Reverse<span className="text-emerald-600">Logistics</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-500">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              target={link.target}
              className={`px-4 py-2 rounded-lg transition-all no-underline ${isActive(link.to)
                ? "text-emerald-700 bg-emerald-50 font-semibold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg transition-all no-underline text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold border-none bg-transparent cursor-pointer flex items-center gap-1"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/demo"
            target="_blank"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all no-underline"
          >
            Run Simulation
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-5 pb-6 pt-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              target={link.target}
              onClick={() => setMobileOpen(false)}
              className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors no-underline ${isActive(link.to)
                ? "text-emerald-700 bg-emerald-50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="block w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors no-underline text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer"
            >
              Logout
            </button>
          )}
          <Link
            to="/demo"
            target="_blank"
            onClick={() => setMobileOpen(false)}
            className="block w-full mt-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-lg shadow-emerald-600/20 text-center no-underline"
          >
            🚀 Run Simulation
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;