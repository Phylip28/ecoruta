import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import type { DashboardNavId } from "../pages/DashboardPage";
import { navItems } from "../pages/DashboardPage";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [navActive, setNavActive] = useState<DashboardNavId>("dashboard");

  const isDesignSystem = location.pathname === "/design-system";
  const dashboardLooksActive = location.pathname === "/" && navActive === "dashboard";

  const breadcrumb = isDesignSystem
    ? "Design system"
    : (navItems.find((n) => n.id === navActive)?.label ?? "Dashboard");

  return (
    <div className="flex min-h-screen bg-eco-gray-50">
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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDashboardFirst = item.id === "dashboard";
            if (isDashboardFirst) {
              return (
                <NavLink
                  key={item.id}
                  to="/"
                  end
                  onClick={() => setNavActive("dashboard")}
                  className={() =>
                    `flex w-full items-center gap-3 rounded-eco-md px-3 py-3 text-left font-sans text-body font-medium transition duration-eco-fast ${
                      dashboardLooksActive
                        ? "border-l-[3px] border-eco-yellow bg-eco-teal text-eco-white"
                        : "border-l-[3px] border-transparent text-eco-sage hover:bg-white/[0.06]"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  {item.label}
                </NavLink>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setNavActive(item.id);
                  void navigate("/");
                }}
                className={`flex w-full items-center gap-3 rounded-eco-md px-3 py-3 text-left font-sans text-body font-medium transition duration-eco-fast ${
                  !isDesignSystem && navActive === item.id
                    ? "border-l-[3px] border-eco-yellow bg-eco-teal text-eco-white"
                    : "border-l-[3px] border-transparent text-eco-sage hover:bg-white/[0.06]"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-header shrink-0 items-center justify-between gap-3 border-b border-eco-gray-200 bg-eco-white px-4 shadow-eco-sm md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
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
                className="block h-11 w-auto max-w-[min(12rem,42vw)] object-contain"
                alt=""
                decoding="async"
              />
            </NavLink>
            <nav className="min-w-0 font-sans text-body-sm text-eco-gray-700" aria-label="Migas de pan">
              <NavLink to="/" className="text-eco-gray-500 hover:text-eco-teal">
                Dashboard
              </NavLink>
              <span className="mx-2 text-eco-gray-300">›</span>
              <span className="font-medium text-eco-navy">{breadcrumb}</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-sans text-body-sm text-eco-gray-700 md:inline">Administrador</span>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-eco-teal font-display text-label text-eco-white"
              aria-hidden
            >
              A
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-6 md:px-8 md:py-8">
          <Outlet context={{ navActive, setNavActive }} />
        </main>
      </div>
    </div>
  );
}
