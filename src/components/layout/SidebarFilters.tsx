import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { filterApi } from "@/apis/filter.api";
import type { Filter, FilterProp } from "@/models/Filter";

interface SidebarFiltersProps {
  selectedPropIds: string[];
  // return both ids and useful meta to display chips outside
  onChangeSelectedProps: (
    ids: string[],
    meta: Array<{ id: string; name: string; filterName: string }>
  ) => void;
  priceMin?: number | null;
  priceMax?: number | null;
  onChangePrice?: (min: number | null, max: number | null) => void;
  className?: string;
  onClearAll?: () => void;
}

export default function SidebarFilters({
  selectedPropIds,
  onChangeSelectedProps,
  priceMin,
  priceMax,
  onChangePrice,
  className,
  onClearAll,
}: SidebarFiltersProps) {
  const [open, setOpen] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: () => filterApi.getAll(),
    select: (res) => res.data,
    refetchOnWindowFocus: false,
  });

  const filters = (data?.filters as Filter[] | undefined) || [];
  useEffect(() => {
    if (!open && filters.length) {
      setOpen(filters[0].id);
    }
  }, [filters, open]);
  // meta mapping for selected ids -> label/filter name, recompute when filters change
  const allProps = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; filterName: string }
    >();
    filters.forEach((f) => {
      f.props?.forEach((p) =>
        map.set(p.id, { id: p.id, name: p.name, filterName: f.name })
      );
    });
    return map;
  }, [filters]);

  const selectedMeta = useMemo(() => {
    return selectedPropIds
      .map((id) => allProps.get(id))
      .filter(Boolean) as Array<{
      id: string;
      name: string;
      filterName: string;
    }>;
  }, [selectedPropIds, allProps]);

  const toggleProp = (prop: FilterProp, filterName: string) => {
    const exists = selectedPropIds.includes(prop.id);
    const nextIds = exists
      ? selectedPropIds.filter((i) => i !== prop.id)
      : [...selectedPropIds, prop.id];
    const metaMap = new Map(selectedMeta.map((m) => [m.id, m] as const));
    if (exists) {
      metaMap.delete(prop.id);
    } else {
      metaMap.set(prop.id, { id: prop.id, name: prop.name, filterName });
    }
    onChangeSelectedProps(nextIds, Array.from(metaMap.values()));
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const parsed = value === "" ? null : Number(value);
    if (Number.isNaN(parsed)) return;
    const newMin = type === "min" ? parsed : priceMin ?? null;
    const newMax = type === "max" ? parsed : priceMax ?? null;
    onChangePrice?.(newMin, newMax);
  };

  const sections: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
  }> = [
    {
      id: "price",
      title: "Price",
      content: (
        <div className="flex flex-col gap-2 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-20 rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              value={priceMin ?? ""}
              onChange={(e) => handlePriceChange("min", e.target.value)}
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder="Max"
              className="w-20 rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
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
  ];

  // Prepend dynamic filter sections from API
  if (!isLoading && filters.length) {
    filters.forEach((f) => {
      sections.unshift({
        id: f.id,
        title: f.name,
        content: (
          <div className="grid grid-cols-3 gap-2 text-xs pt-2">
            {f.props?.map((p) => {
              const active = selectedPropIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProp(p, f.name)}
                  className={cn(
                    "border rounded px-1.5 py-1 font-medium tracking-wide",
                    active
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "hover:bg-primary/10"
                  )}
                  title={p.description || p.name}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        ),
      });
    });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700">
          Filters{" "}
          {isLoading && <span className="text-[10px] ml-1">Loading…</span>}
        </h2>
        {(selectedPropIds.length > 0 ||
          priceMin != null ||
          priceMax != null) && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] text-primary hover:underline"
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
              className="w-full flex items-center justify-between px-3 py-2 text-left text-[13px] font-medium hover:bg-primary/5"
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
