import type { HTMLAttributes } from "react";

type SkeletonBlockProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export function SkeletonBlock({ className = "", ...rest }: SkeletonBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-eco-md bg-eco-gray-200/90 ${className}`}
      style={{ animationDuration: "1.1s" }}
      {...rest}
    />
  );
}

export function MetricRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden>
      {["a", "b", "c", "d"].map((k) => (
        <div
          key={k}
          className="flex flex-col gap-3 rounded-eco-lg border border-eco-gray-100 bg-eco-white p-5 shadow-eco-sm"
        >
          <SkeletonBlock className="h-3 w-1/2" />
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-40 rounded-eco-lg border border-eco-gray-100 bg-eco-white p-4 shadow-eco-sm">
          <SkeletonBlock className="mb-3 h-3 w-2/3" />
          <SkeletonBlock className="h-2 w-full" />
          <SkeletonBlock className="mt-1 h-2 w-4/5" />
          <SkeletonBlock className="mt-6 h-8 w-24" />
        </div>
      ))}
    </div>
  );
}
