import React from "react";
import { Input } from "@/components/ui/input";

interface VariantForm {
  name: string;
  type: string;
  stock: number;
  price: number;
  images: string[];
  selectedPropId?: string | null;
}

interface FilterProp {
  id: string;
  name: string;
}
interface Filter {
  id: string;
  name: string;
  props?: FilterProp[];
}

interface Props {
  variant: VariantForm;
  index: number;
  filters: Filter[];
  updateVariant: (index: number, field: keyof VariantForm, value: any) => void;
  removeVariant: (index: number) => void;
  openNewPropModal: (index: number) => void;
  handleVariantImageUpload: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  removeVariantImage: (variantIndex: number, imageIndex: number) => void;
}

export default function VariantItem({
  variant,
  index,
  filters,
  updateVariant,
  removeVariant,
  openNewPropModal,
  handleVariantImageUpload,
  removeVariantImage,
}: Props) {
  return (
    <div className="border p-3 rounded">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-sm">Tên</label>
          <Input
            value={variant.name}
            onChange={(e: any) => updateVariant(index, "name", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Giá</label>
          <Input
            type="number"
            value={variant.price}
            onChange={(e: any) =>
              updateVariant(index, "price", Number(e.target.value))
            }
          />
        </div>
        <div>
          <label className="text-sm">Kho</label>
          <Input
            type="number"
            value={variant.stock}
            onChange={(e: any) =>
              updateVariant(index, "stock", Number(e.target.value))
            }
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="text-sm block mb-1">Map to Filter Prop</label>
        <div className="flex gap-2">
          <select
            value={variant.selectedPropId ?? ""}
            onChange={(e) =>
              updateVariant(index, "selectedPropId", e.target.value || null)
            }
            className="flex-1 p-2 border rounded"
          >
            <option value="">-- Chưa chọn --</option>
            {filters.map((f) =>
              f.props && f.props.length > 0 ? (
                <optgroup key={f.id} label={f.name}>
                  {f.props.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ) : null
            )}
          </select>
          <button
            type="button"
            onClick={() => openNewPropModal(index)}
            className="px-3 py-1 border rounded"
          >
            Tạo thuộc tính
          </button>
          <button
            type="button"
            onClick={() => removeVariant(index)}
            className="px-3 py-1 border rounded"
          >
            Xóa
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Hình ảnh biến thể
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleVariantImageUpload(index, e)}
        />
        {variant.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {variant.images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  alt={`var-${index}-${i}`}
                  className="w-full h-16 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeVariantImage(index, i)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
