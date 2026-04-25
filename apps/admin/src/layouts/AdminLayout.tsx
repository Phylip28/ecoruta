import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { AdminNavList } from "../components/admin/AdminNavList";
import type { DashboardNavId } from "../pages/DashboardPage";
import { navItems } from "../pages/DashboardPage";

export function AdminLayout() {
  const location = useLocation();
  const [navActive, setNavActive] = useState<DashboardNavId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDesignSystem = location.pathname === "/design-system";
  const dashboardLooksActive = location.pathname === "/" && navActive === "dashboard";

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  const breadcrumb = isDesignSystem
    ? "Design system"
    : (navItems.find((n) => n.id === navActive)?.label ?? "Dashboard");

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  return (
    <div className="flex min-h-screen bg-eco-gray-50">
      <a
        href="#contenido-principal"
        className="sr-only z-[100] rounded-eco-sm bg-eco-navy px-eco-3 py-2 text-eco-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Ir al contenido
      </a>

      <aside className="hidden w-sidebar shrink-0 flex-col bg-eco-navy text-eco-sage lg:flex">
        <div className="px-4 pb-5 pt-6">
          <NavLink
            to="/"
            className="block w-full max-w-full rounded-eco-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-yellow/70"
            aria-label="EcoRuta, ir al inicio"
            end
          >
            <img
              src="/logo.png"
              width={400}
              height={160}
              className="h-32 w-full max-w-full object-contain object-left"
              alt="EcoRuta: Movilidad sostenible en Medellín"
              decoding="async"
            />
          </NavLink>
          <p className="mt-3 font-sans text-caption text-eco-sage/90">Panel administración territorial</p>
        </div>
        <div className="mx-6 h-px bg-eco-teal/40" />
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Principal">
          <AdminNavList
            isDesignSystem={isDesignSystem}
            dashboardLooksActive={dashboardLooksActive}
            navActive={navActive}
            setNavActive={setNavActive}
            onNavigate={() => undefined}
          />
        </nav>
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-eco-navy/60 backdrop-blur-sm transition-opacity duration-eco-normal lg:hidden ${
          mobileOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
        aria-hidden={!mobileOpen}
        onClick={closeMobile}
      />

      <div
        id="menu-movil-panel"
        className={`fixed left-0 top-0 z-50 flex h-full w-[min(20rem,92vw)] flex-col bg-eco-navy text-eco-sage shadow-eco-xl transition-transform duration-eco-slow ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        style={{ willChange: "transform" }}
      >
        <div className="flex items-center justify-between border-b border-eco-teal/30 px-4 py-3">
          <h2 id="mobile-menu-title" className="font-display text-h4 text-eco-white">
            Navegación
          </h2>
          <button
            type="button"
            onClick={closeMobile}
            className="inline-flex h-10 w-10 items-center justify-center rounded-eco-md text-eco-sage transition hover:bg-white/10"
            aria-label="Cerrar menú"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="border-b border-eco-teal/20 px-4 py-3">
          <img
            src="/logo.png"
            width={320}
            height={120}
            className="h-20 w-full max-w-full object-contain object-left"
            alt=""
            decoding="async"
          />
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4" aria-label="Móvil">
          <AdminNavList
            isDesignSystem={isDesignSystem}
            dashboardLooksActive={dashboardLooksActive}
            navActive={navActive}
            setNavActive={setNavActive}
            onNavigate={closeMobile}
          />
        </nav>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-header shrink-0 items-center justify-between gap-2 border-b border-eco-gray-200 bg-eco-white px-3 shadow-eco-sm sm:px-4 md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={toggleMobile}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-eco-md border border-eco-gray-200 bg-eco-white text-eco-navy shadow-eco-sm transition hover:border-eco-teal/30 hover:bg-eco-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-teal lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="menu-movil-panel"
            >
              <span className="sr-only">Abrir o cerrar el menú</span>
              <Menu className="h-5 w-5" />
            </button>
            <NavLink
              to="/"
              className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-teal/80 focus-visible:ring-offset-2 lg:hidden"
              aria-label="EcoRuta, ir al inicio"
              end
            >
              <img
                src="/logo.png"
                width={280}
                height={100}
                className="block h-10 w-auto max-w-[min(7.5rem,32vw)] object-contain"
                alt=""
                decoding="async"
              />
            </NavLink>
            <nav className="min-w-0 font-sans text-body-sm text-eco-gray-700" aria-label="Migas de pan">
              <NavLink to="/" className="text-eco-gray-500 hover:text-eco-teal">
                Dashboard
              </NavLink>
              <span className="mx-1.5 text-eco-gray-300 sm:mx-2" aria-hidden>
                ›
              </span>
              <span className="font-medium text-eco-navy">{breadcrumb}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden font-sans text-body-sm text-eco-gray-700 sm:inline">Administrador</span>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eco-teal font-display text-label text-eco-white"
              aria-hidden
            >
              A
            </span>
          </div>
        </header>

        <main
          id="contenido-principal"
          className="flex-1 overflow-auto scroll-smooth px-3 py-5 sm:px-4 md:px-8 md:py-8"
        >
          <Outlet context={{ navActive, setNavActive }} />
        </main>
      </div>
    </div>
  );
}
