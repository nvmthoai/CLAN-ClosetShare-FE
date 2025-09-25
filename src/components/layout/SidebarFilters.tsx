import { useState } from "react";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

// eslint-disable-next-line
export default function SidebarFilters() {
  const [open, setOpen] = useState<string | null>("size");
  const [sizes, setSizes] = useState<string[]>([]);

  const toggleSize = (s: string) => {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]
    );
  };

  const sections: Section[] = [
    {
      id: "size",
      title: "Size",
      content: (
        <div className="grid grid-cols-3 gap-y-2 text-xs pt-2">
          {sizeOptions.map((s) => (
            <label
              key={s}
              className="flex items-center gap-1 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                className="accent-purple-600"
                checked={sizes.includes(s)}
                onChange={() => toggleSize(s)}
              />
              {s}
            </label>
          ))}
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
    {
      id: "price",
      title: "Price",
      content: <div className="text-xs text-gray-400 py-2">(Coming soon)</div>,
    },
  ];

  return (
    <div className="space-y-2">
      {sections.map((sec) => {
        const expanded = open === sec.id;
        return (
          <div key={sec.id} className="border rounded">
            <button
              onClick={() => setOpen(expanded ? null : sec.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-gray-50"
            >
              {sec.title}
              <span className="text-xs">{expanded ? "▾" : "▸"}</span>
            </button>
            {expanded && (
              <div className="px-3 pb-3 bg-gray-50/60">{sec.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
