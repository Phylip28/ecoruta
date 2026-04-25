import { NavLink, useNavigate } from "react-router-dom";

import type { DashboardNavId } from "../../pages/DashboardPage";
import { navItems } from "../../pages/DashboardPage";

type AdminNavListProps = {
  isDesignSystem: boolean;
  dashboardLooksActive: boolean;
  navActive: DashboardNavId;
  onNavigate: () => void;
  setNavActive: (id: DashboardNavId) => void;
};

export function AdminNavList({
  isDesignSystem,
  dashboardLooksActive,
  navActive,
  onNavigate,
  setNavActive,
}: AdminNavListProps) {
  const navigate = useNavigate();

  const afterNav = (fn: () => void) => {
    fn();
    onNavigate();
  };

  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.id === "dashboard") {
          return (
            <NavLink
              key={item.id}
              to="/"
              end
              onClick={() => afterNav(() => setNavActive("dashboard"))}
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
            onClick={() =>
              afterNav(() => {
                setNavActive(item.id);
                void navigate("/");
              })
            }
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
    </>
  );
}
