import React from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { CreateProductInShopPayload } from "@/models/Product";

interface Props {
  formData: CreateProductInShopPayload;
  onChange: (field: keyof CreateProductInShopPayload, value: any) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export default function ProductBasic({
  formData,
  onChange,
  onImageUpload,
  removeImage,
}: Props) {
  return (
    <Card className="p-4 mb-4">
      <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
      <Input
        value={formData.name}
        onChange={(e: any) => onChange("name", e.target.value)}
      />

      <label className="block text-sm font-medium mt-3 mb-1">Mô tả</label>
      <textarea
        value={formData.description}
        onChange={(e) => onChange("description", e.target.value)}
        className="w-full p-2 border rounded"
      />

      <label className="block text-sm font-medium mt-3 mb-1">Loại</label>
      <input
        value={formData.type}
        onChange={(e) => onChange("type", e.target.value)}
        className="w-full p-2 border rounded"
      />

      <label className="block text-sm font-medium mt-3 mb-1">Hình ảnh</label>
      <input type="file" multiple accept="image/*" onChange={onImageUpload} />
      {formData.images?.length ? (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {formData.images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt={`img-${i}`}
                className="w-full h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6"
              >
                x
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
