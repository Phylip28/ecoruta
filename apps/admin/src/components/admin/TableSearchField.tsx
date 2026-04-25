import { Search } from "lucide-react";
import { useId } from "react";

type TableSearchFieldProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  "aria-label"?: string;
};

export function TableSearchField({ value, onChange, placeholder, "aria-label": ariaLabel }: TableSearchFieldProps) {
  const id = useId();
  return (
    <div className="relative w-full sm:max-w-sm">
      <label htmlFor={id} className="sr-only">
        {ariaLabel ?? placeholder}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-eco-gray-400"
        strokeWidth={2}
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-10 w-full rounded-eco-md border border-eco-gray-200 bg-eco-white pl-9 pr-3 font-sans text-body-sm text-eco-navy shadow-eco-sm transition placeholder:text-eco-gray-400 focus:border-eco-teal focus:outline-none focus:ring-2 focus:ring-eco-teal/20"
      />
    </div>
  );
}
