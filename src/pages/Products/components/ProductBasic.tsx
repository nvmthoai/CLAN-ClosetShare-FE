import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { CreateProductInShopPayload } from "@/models/Product";

interface Props {
  formData: CreateProductInShopPayload;
  onChange: (field: keyof CreateProductInShopPayload, value: any) => void;
}

export default function ProductBasic({
  formData,
  onChange,
}: Props) {
  return (
    <Card className="p-4 mb-4">
      <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
      <Input
        value={formData.name}
        onChange={(e: any) => onChange("name", e.target.value)}
        required
      />

      <label className="block text-sm font-medium mt-3 mb-1">Mô tả *</label>
      <textarea
        value={formData.description}
        onChange={(e) => onChange("description", e.target.value)}
        className="w-full p-2 border rounded"
        required
        rows={4}
      />

      <label className="block text-sm font-medium mt-3 mb-1">Loại sản phẩm *</label>
      <select
        value={formData.type}
        onChange={(e) => onChange("type", e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="SALE">Bán</option>
        <option value="RENT">Thuê</option>
      </select>
    </Card>
  );
}
