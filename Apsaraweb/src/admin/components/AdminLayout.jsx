import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag, Package, LayoutGrid, Users, Newspaper, LogOut, Menu, X, ExternalLink } from "lucide-react";
import { clearAdminToken } from "../api";

const NAV = [
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { to: "/admin/clients", label: "Clients & Reviews", icon: Users },
  { to: "/admin/blogs", label: "Blogs", icon: Newspaper },
];

const SidebarContent = ({ onLogout, onClose }) => (
  <>
    <div className="flex h-16 items-center justify-between gap-3 border-b border-white/10 px-5">
      <div className="flex min-w-0 items-center gap-3">
        <img src="/Namb.png" alt="Naamb" className="h-9 w-9 shrink-0 rounded-full bg-white/10 object-contain" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-white">Naamb</p>
          <p className="truncate text-xs text-[#E6B17E]">Admin Panel</p>
        </div>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-md p-1.5 text-stone-300 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>

    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-white/10 text-[#E6B17E]" : "text-stone-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>

    <div className="space-y-1 border-t border-white/10 p-3">
      <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-300 transition hover:bg-white/5 hover:text-white">
        <ExternalLink className="h-4 w-4" /> View website
      </a>
      <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-300 transition hover:bg-white/5 hover:text-white">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  </>
);

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = NAV.find((n) => pathname.startsWith(n.to));

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Naamb Admin";
    const onExpired = () => {
      toast.error("Session expired, please login again");
      navigate("/admin", { replace: true });
    };
    window.addEventListener("adminLogout", onExpired);
    return () => {
      document.title = previousTitle;
      window.removeEventListener("adminLogout", onExpired);
    };
  }, [navigate]);

  const logout = () => {
    clearAdminToken();
    toast.success("Logged out");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#310000] lg:flex">
        <SidebarContent onLogout={logout} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-stone-200 bg-white px-4 lg:hidden">
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="-ml-2 rounded-md p-2 text-stone-700 hover:bg-stone-100">
          <Menu className="h-5 w-5" />
        </button>
        <span className="truncate text-sm font-semibold">{current?.label || "Admin"}</span>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-[#310000] shadow-xl">
            <SidebarContent onLogout={logout} onClose={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
