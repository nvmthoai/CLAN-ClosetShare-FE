import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Plus, Trash2, Check } from "lucide-react";

interface VariantForm {
  name: string;
  type: string;
  stock: number;
  price: number;
  imageFiles: File[]; // Changed from images: string[] to imageFiles: File[]
  selectedPropIds: string[]; // Changed to array for multiple selection
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
  const [searchTerm, setSearchTerm] = useState("");

  const togglePropSelection = (propId: string) => {
    const currentIds = variant.selectedPropIds || [];
    if (currentIds.includes(propId)) {
      updateVariant(index, "selectedPropIds", currentIds.filter((id) => id !== propId));
    } else {
      updateVariant(index, "selectedPropIds", [...currentIds, propId]);
    }
  };

  const filteredFilters = filters.map((filter) => ({
    ...filter,
    props: filter.props?.filter((p: any) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((filter) => filter.props && filter.props.length > 0);

  return (
    <Card className="border-2 border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all bg-white">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Biến thể #{index + 1}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Tên biến thể *
          </label>
          <Input
            value={variant.name}
            onChange={(e: any) => updateVariant(index, "name", e.target.value)}
            placeholder="VD: Size M, Màu đỏ"
            className="border-2 border-gray-200 rounded-lg focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Giá (VNĐ) *
          </label>
          <Input
            type="number"
            min="0"
            value={variant.price}
            onChange={(e: any) =>
              updateVariant(index, "price", Number(e.target.value) || 0)
            }
            placeholder="0"
            className="border-2 border-gray-200 rounded-lg focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Số lượng tồn kho *
          </label>
          <Input
            type="number"
            min="0"
            value={variant.stock}
            onChange={(e: any) =>
              updateVariant(index, "stock", Number(e.target.value) || 0)
            }
            placeholder="0"
            className="border-2 border-gray-200 rounded-lg focus:border-blue-500"
          />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-gray-900">Filter Props</label>
          <span className="text-xs text-gray-500">
            {variant.selectedPropIds?.length || 0} đã chọn
          </span>
        </div>

        {/* Selected props display - Show at top */}
        {variant.selectedPropIds && variant.selectedPropIds.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">Đã chọn:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {variant.selectedPropIds.map((propId) => {
                const prop = filters
                  .flatMap((f) => f.props || [])
                  .find((p: any) => p.id === propId);
                if (!prop) return null;
                return (
                  <Badge
                    key={propId}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>{prop.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newIds = variant.selectedPropIds.filter((id) => id !== propId);
                        updateVariant(index, "selectedPropIds", newIds);
                      }}
                      className="hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm filter props..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2 border-gray-200 rounded-lg focus:border-blue-500"
          />
        </div>

        {/* Filter groups - Show filter name as section header */}
        {filteredFilters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Không tìm thấy filter props nào</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {filteredFilters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                {/* Filter group header */}
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-bold text-gray-800">{filter.name}</h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {filter.props?.length || 0}
                  </span>
                </div>
                
                {/* Props grid - Small cards with checkboxes */}
                {filter.props && filter.props.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {filter.props.map((prop: any) => {
                      const isSelected = variant.selectedPropIds?.includes(prop.id);
                      return (
                        <label
                          key={prop.id}
                          className={`
                            relative flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                            min-h-[80px] group
                            ${
                              isSelected
                                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md"
                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm"
                            }
                          `}
                        >
                          {/* Checkbox in top-right corner */}
                          <div className="absolute top-2 right-2">
                            <div
                              className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-600"
                                    : "border-gray-300 bg-white group-hover:border-blue-400"
                                }
                              `}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          
                          {/* Prop name */}
                          <span
                            className={`
                              text-xs text-center font-medium mt-2 px-1
                              ${
                                isSelected
                                  ? "text-blue-900 font-semibold"
                                  : "text-gray-700"
                              }
                            `}
                          >
                            {prop.name}
                          </span>
                          
                          {/* Hidden checkbox for form submission */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePropSelection(prop.id)}
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => openNewPropModal(index)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="w-4 h-4" />
            Tạo thuộc tính mới
          </button>
          <button
            type="button"
            onClick={() => removeVariant(index)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Hình ảnh biến thể
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleVariantImageUpload(index, e)}
            className="hidden"
            id={`variant-images-${index}`}
          />
          <label
            htmlFor={`variant-images-${index}`}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              Click để chọn hình ảnh
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG, GIF tối đa 10MB
            </span>
          </label>
        </div>
        {variant.imageFiles && variant.imageFiles.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {variant.imageFiles.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`var-${index}-${i}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeVariantImage(index, i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
