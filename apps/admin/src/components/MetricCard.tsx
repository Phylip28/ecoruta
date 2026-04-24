type MetricCardProps = {
  label: string;
  value: string;
  tone?: "normal" | "warning" | "danger";
};

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  normal: "from-eco-moss to-eco-fern",
  warning: "from-amber-500 to-orange-600",
  danger: "from-rose-600 to-red-700",
};

export function MetricCard({ label, value, tone = "normal" }: MetricCardProps) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-200">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div
        className={`mt-3 rounded-xl bg-gradient-to-r px-3 py-2 text-2xl font-semibold text-white ${toneClasses[tone]}`}
      >
        {value}
      </div>
    </article>
  );
}
