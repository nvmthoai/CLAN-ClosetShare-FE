import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { productApi } from "@/apis/product.api";
import type { CreateProductInShopPayload } from "@/models/Product";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Upload,
  Save,
  X,
  Plus,
  Trash2,
  Package,
  DollarSign,
  Hash,
  Image as ImageIcon
} from "lucide-react";

interface VariantForm {
  name: string;
  type: string;
  stock: number;
  price: number;
  images: string[];
}

export default function CreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<CreateProductInShopPayload>({
    name: "",
    description: "",
    type: "",
    images: [],
    variants: []
  });
  
  const [variants, setVariants] = useState<VariantForm[]>([
    { name: "", type: "size", stock: 0, price: 0, images: [] }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (payload: CreateProductInShopPayload) => {
      // Mock create - in real app, this would call productApi.createProductInShop(payload)
      return Promise.resolve({ 
        data: { 
          id: Date.now().toString(), 
          ...payload, 
          status: "DRAFT",
          shop_id: "1"
        } 
      });
    },
    onSuccess: () => {
      toast.success("Tạo sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi tạo sản phẩm!");
    },
  });

  const handleInputChange = (field: keyof CreateProductInShopPayload, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { name: "", type: "size", stock: 0, price: 0, images: [] }]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantForm, value: any) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  const handleVariantImageUpload = (variantIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      updateVariant(variantIndex, "images", newImages);
    }
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    setVariants(prev => prev.map((variant, i) => 
      i === variantIndex 
        ? { ...variant, images: variant.images.filter((_, j) => j !== imageIndex) }
        : variant
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert variants to the correct format
      const formattedVariants = variants.map(variant => ({
        name: variant.name,
        type: variant.type,
        stock: variant.stock,
        status: "ACTIVE",
        imgs: variant.images,
        pricings: [{
          price: variant.price
        }]
      }));

      const payload: CreateProductInShopPayload = {
        ...formData,
        variants: formattedVariants
      };

      await createProductMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tạo sản phẩm mới</h1>
              <p className="text-gray-600 mt-1">
                Thêm sản phẩm mới vào shop của bạn
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả sản phẩm
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại sản phẩm *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Chọn loại sản phẩm</option>
                  <option value="Áo sơ mi">Áo sơ mi</option>
                  <option value="Quần jean">Quần jean</option>
                  <option value="Đầm">Đầm</option>
                  <option value="Áo khoác">Áo khoác</option>
                  <option value="Váy">Váy</option>
                  <option value="Quần short">Quần short</option>
                  <option value="Áo thun">Áo thun</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Product Images */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Hình ảnh sản phẩm</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload hình ảnh
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-images"
                  />
                  <label
                    htmlFor="product-images"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click để chọn hình ảnh hoặc kéo thả vào đây
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF tối đa 10MB
                    </span>
                  </label>
                </div>
              </div>
              
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Variants */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Biến thể sản phẩm</h2>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addVariant}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm biến thể
              </Button>
            </div>
            
            <div className="space-y-6">
              {variants.map((variant, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Biến thể {index + 1}</h3>
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên biến thể *
                      </label>
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                        placeholder="VD: Size M, Màu đỏ"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại biến thể
                      </label>
                      <select
                        value={variant.type}
                        onChange={(e) => updateVariant(index, "type", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="size">Kích thước</option>
                        <option value="color">Màu sắc</option>
                        <option value="style">Kiểu dáng</option>
                        <option value="material">Chất liệu</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng tồn kho *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá bán (VNĐ) *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Variant Images */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh biến thể
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
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
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Upload hình ảnh cho biến thể này
                        </span>
                      </label>
                    </div>
                    
                    {variant.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {variant.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative group">
                            <img
                              src={image}
                              alt={`Variant ${index + 1} - ${imageIndex + 1}`}
                              className="w-full h-16 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(index, imageIndex)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-2 h-2" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createProductMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting || createProductMutation.isPending ? "Đang tạo..." : "Tạo sản phẩm"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
