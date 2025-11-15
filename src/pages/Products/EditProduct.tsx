import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UpdateProductPayload } from "@/models/Product";
import { productApi } from "@/apis/product.api";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Upload,
  Save,
  X,
  Plus,
  Trash2,
  Package,
  Hash
} from "lucide-react";

interface VariantForm {
  id?: string;
  name: string;
  type: string;
  stock: number;
  price: number;
  images: string[]; // URLs from backend
  newImageFiles?: File[]; // New files to upload
  status: string;
}


export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<UpdateProductPayload>({
    name: "",
    description: "",
    type: "SALE",
  });
  
  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductById(id!),
    enabled: !!id,
    select: (res) => res.data,
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: (payload: UpdateProductPayload) => productApi.updateProduct(id!, payload),
    onSuccess: () => {
      toast.success("Cập nhật sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      navigate("/products");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm!";
      toast.error(message);
    },
  });

  // Initialize form data when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        type: product.type || "SALE",
      });

      // Convert variants to form format
      const formattedVariants: VariantForm[] = product.variants?.map(variant => ({
        id: variant.id,
        name: variant.name,
        type: variant.type,
        stock: variant.stock,
        price: variant.pricing?.price || 0,
        images: variant.images || [],
        status: "ACTIVE" // Backend only returns active variants
      })) || [];

      setVariants(formattedVariants);
    }
  }, [product]);

  const handleInputChange = (field: keyof UpdateProductPayload, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const addVariant = () => {
    setVariants(prev => [...prev, { 
      name: "", 
      type: "size", 
      stock: 0, 
      price: 0, 
      images: [],
      status: "ACTIVE"
    }]);
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
      const newFiles = Array.from(files);
      const variant = variants[variantIndex];
      updateVariant(variantIndex, "newImageFiles", [...(variant.newImageFiles || []), ...newFiles]);
    }
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number, isNew: boolean = false) => {
    setVariants(prev => prev.map((variant, i) => {
      if (i === variantIndex) {
        if (isNew && variant.newImageFiles) {
          return { ...variant, newImageFiles: variant.newImageFiles.filter((_, j) => j !== imageIndex) };
        } else {
          return { ...variant, images: variant.images.filter((_, j) => j !== imageIndex) };
        }
      }
      return variant;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update product basic info
      const payload: UpdateProductPayload = {
        name: formData.name,
        description: formData.description,
        type: formData.type as "SALE" | "RENT",
      };

      await updateProductMutation.mutateAsync(payload);

      // Update variants if needed (this would require separate API calls for each variant)
      // For now, we only update the product basic info
      // Variant updates should be done separately via variant update endpoints
      
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-600 mb-4 font-semibold">Không thể tải thông tin sản phẩm</div>
            <button
              onClick={() => navigate("/products")}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 font-medium"
            >
              Quay lại
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
              <p className="text-gray-600 mt-1">
                Cập nhật thông tin sản phẩm "{product.name}"
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên sản phẩm *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  required
                  className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mô tả sản phẩm
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Loại sản phẩm *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="SALE">Bán</option>
                  <option value="RENT">Thuê</option>
                </select>
              </div>
              
            </div>
          </Card>


          {/* Variants */}
          <Card className="p-6 border-2 border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">Biến thể sản phẩm</h2>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 font-medium"
              >
                <Plus className="w-4 h-4" />
                Thêm biến thể
              </button>
            </div>
            
            <div className="space-y-6">
              {variants.map((variant, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Biến thể {index + 1}</h3>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Tên biến thể *
                      </label>
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                        placeholder="VD: Size M, Màu đỏ"
                        required
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Loại biến thể
                      </label>
                      <select
                        value={variant.type}
                        onChange={(e) => updateVariant(index, "type", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="size">Kích thước</option>
                        <option value="color">Màu sắc</option>
                        <option value="style">Kiểu dáng</option>
                        <option value="material">Chất liệu</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Số lượng tồn kho *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        required
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Giá bán (VNĐ) *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        required
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Variant Images */}
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
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
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Upload hình ảnh cho biến thể này
                        </span>
                      </label>
                    </div>
                    
                    {(variant.images.length > 0 || variant.newImageFiles?.length) && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {/* Existing images from backend */}
                        {variant.images.map((image, imageIndex) => (
                          <div key={`existing-${imageIndex}`} className="relative group">
                            <img
                              src={image}
                              alt={`Variant ${index + 1} - ${imageIndex + 1}`}
                              className="w-full h-16 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(index, imageIndex, false)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-2 h-2" />
                            </button>
                          </div>
                        ))}
                        {/* New images to upload */}
                        {variant.newImageFiles?.map((file, imageIndex) => (
                          <div key={`new-${imageIndex}`} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New ${imageIndex + 1}`}
                              className="w-full h-16 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(index, imageIndex, true)}
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
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-6 py-2.5 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || updateProductMutation.isPending}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting || updateProductMutation.isPending ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </Layout>
  );
}
