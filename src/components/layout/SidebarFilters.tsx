import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { filterApi } from "@/apis/filter.api";
import type { Filter, FilterProp } from "@/models/Filter";
import { ChevronDown, ChevronRight, X } from "lucide-react";

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
      title: "Giá",
      content: (
        <div className="flex flex-col gap-3 pt-2 text-sm">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Tối thiểu"
              className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={priceMin ?? ""}
              onChange={(e) => handlePriceChange("min", e.target.value)}
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder="Tối đa"
              className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={priceMax ?? ""}
              onChange={(e) => handlePriceChange("max", e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">
            Đặt khoảng giá để lọc kết quả
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
                    "border rounded-xl px-2 py-1.5 font-medium tracking-wide transition-all duration-200",
                    active
                      ? "bg-gray-900 text-white border-gray-900 shadow-md hover:bg-blue-500 hover:border-blue-500"
                      : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
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
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-base font-bold tracking-wide text-gray-900">
          Bộ lọc{" "}
          {isLoading && <span className="text-xs ml-1 text-gray-500">Đang tải…</span>}
        </h2>
        {(selectedPropIds.length > 0 ||
          priceMin != null ||
          priceMax != null) && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-gray-600 hover:text-blue-500 transition-colors font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Xóa
          </button>
        )}
      </div>
      
      {sections.map((sec) => {
        const expanded = open === sec.id;
        return (
          <div
            key={sec.id}
            className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpen(expanded ? null : sec.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-blue-50/50 transition-colors"
            >
              <span>{sec.title}</span>
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
            {expanded && (
              <div className="px-4 pb-4 bg-gray-50/50 border-t border-gray-100">
                {sec.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
