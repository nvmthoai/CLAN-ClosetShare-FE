import { useState } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

interface SidebarFiltersProps {
  sizes: string[];
  onChangeSizes: (sizes: string[]) => void;
  priceMin?: number | null;
  priceMax?: number | null;
  onChangePrice?: (min: number | null, max: number | null) => void;
  className?: string;
  onClearAll?: () => void;
}

export default function SidebarFilters({
  sizes,
  onChangeSizes,
  priceMin,
  priceMax,
  onChangePrice,
  className,
  onClearAll,
}: SidebarFiltersProps) {
  const [open, setOpen] = useState<string | null>("size");

  const toggleSize = (s: string) => {
    if (sizes.includes(s)) {
      onChangeSizes(sizes.filter((v) => v !== s));
    } else {
      onChangeSizes([...sizes, s]);
    }
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const parsed = value === "" ? null : Number(value);
    if (Number.isNaN(parsed)) return;
    const newMin = type === "min" ? parsed : priceMin ?? null;
    const newMax = type === "max" ? parsed : priceMax ?? null;
    onChangePrice?.(newMin, newMax);
  };

  const sections: Section[] = [
    {
      id: "size",
      title: "Size",
      content: (
        <div className="grid grid-cols-3 gap-y-2 text-xs pt-2">
          {sizeOptions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={cn(
                "border rounded px-1.5 py-1 font-medium tracking-wide",
                sizes.includes(s)
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "hover:bg-purple-50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "price",
      title: "Price",
      content: (
        <div className="flex flex-col gap-2 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-20 rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={priceMin ?? ""}
              onChange={(e) => handlePriceChange("min", e.target.value)}
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder="Max"
              className="w-20 rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={priceMax ?? ""}
              onChange={(e) => handlePriceChange("max", e.target.value)}
            />
          </div>
          <p className="text-[11px] text-gray-500">
            Set a price range to narrow results
          </p>
        </div>
      ),
    },
    {
      id: "brand",
      title: "Brand",
      content: <div className="text-xs text-gray-400 py-2">(Coming soon)</div>,
    },
    {
      id: "designer",
      title: "Designer",
      content: <div className="text-xs text-gray-400 py-2">(Coming soon)</div>,
    },
    {
      id: "style",
      title: "Style",
      content: <div className="text-xs text-gray-400 py-2">(Coming soon)</div>,
    },
    {
      id: "location",
      title: "Location",
      content: <div className="text-xs text-gray-400 py-2">(Coming soon)</div>,
    },
    {
      id: "reviews",
      title: "Reviews",
      content: <div className="text-xs text-gray-400 py-2">(Coming soon)</div>,
    },
    {
      id: "condition",
      title: "Condition",
      content: <div className="text-xs text-gray-400 py-2">(Coming soon)</div>,
    },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700">
          Filters
        </h2>
        {(sizes.length > 0 || priceMin != null || priceMax != null) && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] text-purple-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      {sections.map((sec) => {
        const expanded = open === sec.id;
        return (
          <div
            key={sec.id}
            className="border rounded bg-white/70 backdrop-blur-sm"
          >
            <button
              onClick={() => setOpen(expanded ? null : sec.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-left text-[13px] font-medium hover:bg-gray-50"
            >
              <span>{sec.title}</span>
              <span className="text-xs text-gray-500">
                {expanded ? "▾" : "▸"}
              </span>
            </button>
            {expanded && (
              <div className="px-3 pb-3 bg-gray-50/80 border-t text-gray-700">
                {sec.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
