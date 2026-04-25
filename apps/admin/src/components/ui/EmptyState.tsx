import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-eco-2 rounded-eco-lg border border-dashed border-eco-gray-200 bg-gradient-to-b from-eco-white to-eco-gray-50 px-eco-6 py-eco-8 text-center"
      role="status"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,92,83,0.08)] text-eco-teal" aria-hidden>
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-h4 text-eco-navy">{title}</h3>
      <p className="max-w-md font-sans text-body-sm leading-relaxed text-eco-gray-600">{description}</p>
      {children ? <div className="mt-2 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}
