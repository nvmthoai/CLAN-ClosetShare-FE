import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { filterApi } from "@/apis/filter.api";
import { productApi } from "@/apis/product.api";
import type { Filter } from "@/models/Filter";
import Layout from "@/components/layout/Layout";
import ProductBasic from "./components/ProductBasic";
import VariantItem from "./components/VariantItem";
import NewPropModal from "./components/NewPropModal";
import { toast } from "react-toastify";
import type { CreateProductInShopPayload } from "@/models/Product";

type VariantForm = {
  name: string;
  type: string;
  stock: number;
  price: number;
  imageFiles: File[]; // Store actual File objects for upload
  selectedPropIds: string[]; // Changed to array for multiple selection
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateProductInShopPayload>({
    name: "",
    description: "",
    type: "SALE",
    filter_props: [],
  });

  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);

  const [showNewPropModal, setShowNewPropModal] = useState(false);
  const [newPropName, setNewPropName] = useState("");
  const [newPropFilterId, setNewPropFilterId] = useState<string | null>(null);
  const [newPropVariantIndex, setNewPropVariantIndex] = useState<number | null>(
    null
  );
  const [modalCreating, setModalCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    filterApi
      .getAll()
      .then((res) => {
        const fs = (res?.data?.filters as Filter[]) || [];
        if (mounted) setFilters(fs || []);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = (
    field: keyof CreateProductInShopPayload,
    value: any
  ) => setFormData((prev) => ({ ...prev, [field]: value }));

  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      { name: "", type: "size", stock: 0, price: 0, imageFiles: [], selectedPropIds: [] },
    ]);

  const removeVariant = (index: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  const updateVariant = (index: number, field: keyof VariantForm, value: any) =>
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));

  const openNewPropModal = (variantIndex: number) => {
    setNewPropVariantIndex(variantIndex);
    const suggested = filters.find((f) => f.name?.toLowerCase().includes((variants[variantIndex]?.type || "").toLowerCase()));
    setNewPropFilterId(suggested?.id ?? null);
    setNewPropName(variants[variantIndex]?.name || "");
    setShowNewPropModal(true);
  };

  const handleCreateNewProp = async () => {
    if (!newPropName || !newPropFilterId) return;
    setModalCreating(true);
    try {
      // API expects objects with name property
      await filterApi.createFilterProps(newPropFilterId, [{ name: newPropName }]);
      const refreshed = await filterApi.getAll();
      const fs = (refreshed?.data?.filters as Filter[]) || [];
      setFilters(fs || []);
      const created = fs.flatMap((f) => f.props || []).find((p: any) => p.name === newPropName);
      if (created?.id != null && typeof newPropVariantIndex === "number") {
        const variant = variants[newPropVariantIndex];
        const currentIds = variant.selectedPropIds || [];
        if (!currentIds.includes(created.id)) {
          updateVariant(newPropVariantIndex, "selectedPropIds", [...currentIds, created.id]);
        }
      }
      setShowNewPropModal(false);
      setNewPropName("");
      setNewPropFilterId(null);
      setNewPropVariantIndex(null);
      toast.success("Tạo thuộc tính thành công");
    } catch (err) {
      toast.error("Tạo thuộc tính thất bại");
    } finally {
      setModalCreating(false);
    }
  };

  const handleVariantImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, imageFiles: [...(v.imageFiles || []), ...newFiles] } : v)));
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) =>
    setVariants((v) => v.map((item, i) => (i === variantIndex ? { ...item, imageFiles: item.imageFiles.filter((_, j) => j !== imageIndex) } : item)));

  const handleSubmit = async (e?: React.FormEvent, createVariants: boolean = true) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      // Collect all selected prop IDs from all variants
      const selectedPropIds = variants.flatMap((v) => v.selectedPropIds || []).filter(Boolean) as string[];
      let filter_props: string[] = Array.from(new Set(selectedPropIds));

      if (filter_props.length === 0) {
        const propIdSet = new Set<string>();
        for (const v of variants) {
          let found: any = undefined;
          for (const f of filters) {
            if (!f.props) continue;
            const p = f.props.find((pp: any) => pp.name?.toLowerCase() === v.name?.toLowerCase());
            if (p) {
              found = p;
              break;
            }
          }
          if (!found) {
            const fMatch = filters.find((ff: any) => ff.name?.toLowerCase().includes(v.type?.toLowerCase()));
            if (fMatch && fMatch.props && fMatch.props.length > 0) {
              const p2 = fMatch.props.find((pp: any) => v.name && pp.name?.toLowerCase().includes(v.name.toLowerCase()));
              found = p2 || fMatch.props[0];
            }
          }
          if (found && found.id) propIdSet.add(found.id);
        }
        filter_props = Array.from(propIdSet);
      }

      // Validate required fields
      if (!formData.name || !formData.description || !formData.type) {
        toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
        return;
      }

      const payload: CreateProductInShopPayload = {
        name: formData.name,
        description: formData.description,
        type: formData.type as "SALE" | "RENT",
        filter_props: filter_props.length > 0 ? filter_props : [],
      };

      const createResp = await productApi.createProductInShop(payload);
      
      // Log full response for debugging
      console.log("Full create product response:", createResp);
      console.log("Response data:", createResp?.data);
      console.log("Response status:", createResp?.status);
      
      // Backend might return product in different formats
      // Try multiple ways to extract product ID
      let productId: string | undefined;
      
      if (createResp?.data) {
        // If data is an object with id
        if (typeof createResp.data === 'object' && createResp.data !== null) {
          productId = (createResp.data as any)?.id;
        }
        // If data is a string (JSON stringified)
        if (typeof createResp.data === 'string' && createResp.data.trim() !== '') {
          try {
            const parsed = JSON.parse(createResp.data);
            productId = parsed?.id;
          } catch (e) {
            // Not JSON, ignore
          }
        }
      }
      
      // Fallback: try direct response
      if (!productId && (createResp as any)?.id) {
        productId = (createResp as any).id;
      }
      
      if (!productId) {
        console.error("Could not extract product ID from response:", createResp);
        throw new Error("Không nhận được ID sản phẩm từ server. Vui lòng kiểm tra console để xem chi tiết.");
      }

      // Create variants with FormData (including images) - only if createVariants is true and there are variants
      let createdVariantsCount = 0;
      let failedVariantsCount = 0;

      if (createVariants && variants.length > 0) {
        for (const v of variants) {
          if (!v.name || !v.type || v.stock < 0 || v.price <= 0) {
            toast.warn(`Biến thể "${v.name || 'chưa đặt tên'}" thiếu thông tin, bỏ qua`);
            failedVariantsCount++;
            continue;
          }

          try {
            const formData = new FormData();
            formData.append("name", v.name);
            formData.append("type", v.type);
            formData.append("stock", v.stock.toString());
            formData.append("price", v.price.toString());
            
            // Append image files
            if (v.imageFiles && v.imageFiles.length > 0) {
              v.imageFiles.forEach((file) => {
                formData.append("images", file);
              });
            }

            await productApi.createVariant(productId, formData);
            createdVariantsCount++;
          } catch (inner) {
            console.error("Error creating variant:", inner);
            toast.warn(`Không thể tạo biến thể "${v.name}"`);
            failedVariantsCount++;
          }
        }
      }

      // Show success message and navigate
      if (!createVariants || variants.length === 0) {
        // Only create product, no variants
        toast.success("Sản phẩm đã được tạo thành công! Bạn có thể thêm biến thể sau.");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        navigate(`/products/edit/${productId}`);
      } else if (createdVariantsCount > 0) {
        // Created product with some variants
        if (failedVariantsCount > 0) {
          toast.success(`Sản phẩm đã được tạo với ${createdVariantsCount} biến thể. ${failedVariantsCount} biến thể thất bại.`);
        } else {
          toast.success(`Sản phẩm đã được tạo thành công với ${createdVariantsCount} biến thể!`);
        }
        queryClient.invalidateQueries({ queryKey: ["products"] });
        navigate("/products");
      } else {
        // Product created but no variants succeeded
        toast.warning("Sản phẩm đã được tạo nhưng không có biến thể nào được tạo thành công. Bạn có thể thêm biến thể sau.");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        navigate(`/products/edit/${productId}`);
      }
    } catch (err: any) {
      console.error("Error creating product:", err);
      const errorMessage = 
        err?.response?.data?.message || 
        err?.message || 
        "Tạo sản phẩm thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMessage);
      
      // Log full error for debugging
      if (err?.response) {
        console.error("API Error Response:", err.response.data);
        console.error("API Error Status:", err.response.status);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tạo sản phẩm</h1>

        <form onSubmit={handleSubmit}>
          <ProductBasic formData={formData} onChange={handleInputChange} />

          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Variants</h2>
              <div>
                <button type="button" onClick={addVariant} className="px-3 py-1 bg-green-600 text-white rounded">Thêm</button>
              </div>
            </div>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <VariantItem
                  key={idx}
                  variant={v}
                  index={idx}
                  filters={filters}
                  updateVariant={updateVariant}
                  removeVariant={removeVariant}
                  openNewPropModal={openNewPropModal}
                  handleVariantImageUpload={handleVariantImageUpload}
                  removeVariantImage={removeVariantImage}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang tạo..." : "Lưu sản phẩm"}
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang tạo..." : variants.length > 0 ? "Lưu và thêm biến thể" : "Lưu sản phẩm"}
            </button>
          </div>
        </form>

        <NewPropModal
          open={showNewPropModal}
          creating={modalCreating}
          filters={filters}
          selectedFilterId={newPropFilterId}
          propName={newPropName}
          setSelectedFilterId={setNewPropFilterId}
          setPropName={setNewPropName}
          onCreate={handleCreateNewProp}
          onClose={() => setShowNewPropModal(false)}
        />
      </div>
    </Layout>
  );
}
