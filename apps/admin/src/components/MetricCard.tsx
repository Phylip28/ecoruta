import type { ReactNode } from "react";

export type KPIAccent = "teal" | "lime" | "yellow" | "danger";

type MetricCardProps = {
  title: string;
  value: string;
  unit?: string;
  change?: number;
  accent: KPIAccent;
  icon: ReactNode;
};

const accentStyles: Record<
  KPIAccent,
  { border: string; iconWell: string; iconColor: string }
> = {
  teal: {
    border: "border-eco-teal",
    iconWell: "bg-[rgba(0,92,83,0.12)]",
    iconColor: "text-eco-teal",
  },
  lime: {
    border: "border-eco-lime",
    iconWell: "bg-[rgba(159,193,49,0.12)]",
    iconColor: "text-eco-lime",
  },
  yellow: {
    border: "border-eco-yellow",
    iconWell: "bg-[rgba(219,242,39,0.12)]",
    iconColor: "text-eco-yellow",
  },
  danger: {
    border: "border-eco-danger",
    iconWell: "bg-[rgba(217,79,61,0.12)]",
    iconColor: "text-eco-danger",
  },
};

export function MetricCard({ title, value, unit, change, accent, icon }: MetricCardProps) {
  const a = accentStyles[accent];
  const changePositive = change !== undefined && change >= 0;

  return (
    <article
      className={`rounded-eco-lg border-t-4 ${a.border} bg-eco-white p-6 shadow-eco-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-sans text-label uppercase tracking-wide text-eco-gray-700">{title}</p>
          <p className="mt-2 font-mono text-metric-xl text-eco-navy">
            {value}
            {unit ? <span className="ml-1 font-sans text-body text-eco-gray-500">{unit}</span> : null}
          </p>
          {change !== undefined ? (
            <p className="mt-1 font-sans text-caption text-eco-gray-500">
              <span className={changePositive ? "text-eco-success" : "text-eco-danger"}>
                {changePositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
              </span>{" "}
              vs periodo anterior
            </p>
          ) : (
            <p className="mt-1 font-sans text-caption text-eco-gray-500">Periodo actual</p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-eco-md ${a.iconWell}`}
          aria-hidden
        >
          <span className={`[&>svg]:h-6 [&>svg]:w-6 ${a.iconColor}`}>{icon}</span>
        </div>
      </div>
    </article>
  );
}
