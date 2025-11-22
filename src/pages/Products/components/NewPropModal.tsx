import { Input } from "@/components/ui/input";
import type { Filter } from "@/models/Filter";

interface Props {
  open: boolean;
  creating: boolean;
  filters: Filter[];
  selectedFilterId: string | null;
  propName: string;
  setSelectedFilterId: (id: string | null) => void;
  setPropName: (name: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

export default function NewPropModal({
  open,
  creating,
  filters,
  selectedFilterId,
  propName,
  setSelectedFilterId,
  setPropName,
  onCreate,
  onClose,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded p-4">
        <h3 className="font-semibold mb-2">Tạo thuộc tính lọc mới</h3>
        <div className="mb-2">
          <label className="text-sm block mb-1">Chọn nhóm filter</label>
          <select
            value={selectedFilterId ?? ""}
            onChange={(e) => setSelectedFilterId(e.target.value || null)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Chọn nhóm --</option>
            {filters.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="text-sm block mb-1">Tên thuộc tính</label>
          <Input
            value={propName}
            onChange={(e: any) => setPropName(e.target.value)}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onCreate}
            disabled={creating || !propName || !selectedFilterId}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            {creating ? "Đang tạo..." : "Tạo"}
          </button>
        </div>
      </div>
    </div>
  );
}
