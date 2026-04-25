import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Palette } from "lucide-react";

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
        <div className="px-6 py-6">
          <p className="font-display text-h4 text-eco-white">EcoRuta</p>
          <p className="mt-1 font-sans text-caption text-eco-sage/90">Admin territorial</p>
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

          <NavLink
            to="/design-system"
            className={({ isActive }) =>
              `mt-2 flex w-full items-center gap-3 rounded-eco-md px-3 py-3 text-left font-sans text-body font-medium transition duration-eco-fast ${
                isActive
                  ? "border-l-[3px] border-eco-yellow bg-eco-teal text-eco-white"
                  : "border-l-[3px] border-transparent text-eco-sage hover:bg-white/[0.06]"
              }`
            }
          >
            <Palette className="h-5 w-5 shrink-0" aria-hidden />
            Design system
          </NavLink>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-header shrink-0 items-center justify-between border-b border-eco-gray-200 bg-eco-white px-4 shadow-eco-sm md:px-8">
          <nav className="font-sans text-body-sm text-eco-gray-700" aria-label="Migas de pan">
            <NavLink to="/" className="text-eco-gray-500 hover:text-eco-teal">
              Dashboard
            </NavLink>
            <span className="mx-2 text-eco-gray-300">›</span>
            <span className="font-medium text-eco-navy">{breadcrumb}</span>
          </nav>
          <div className="flex items-center gap-3">
            <NavLink
              to="/design-system"
              className="hidden rounded-eco-md border border-eco-gray-200 px-3 py-2 font-sans text-caption font-medium text-eco-teal hover:bg-eco-gray-50 sm:inline-block"
            >
              Ver design system
            </NavLink>
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
