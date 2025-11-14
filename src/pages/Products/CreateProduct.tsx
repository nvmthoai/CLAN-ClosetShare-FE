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
  images: string[];
  selectedPropId?: string | null;
};

export default function CreateProduct(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateProductInShopPayload>({
    name: "",
    description: "",
    type: "",
    images: [],
    variants: [],
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
      { name: "", type: "size", stock: 0, price: 0, images: [], selectedPropId: null },
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
        updateVariant(newPropVariantIndex, "selectedPropId", created.id);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setFormData((p) => ({ ...p, images: [...(p.images || []), ...newImages] }));
  };

  const removeImage = (index: number) =>
    setFormData((p) => ({ ...p, images: p.images?.filter((_, i) => i !== index) || [] }));

  const handleVariantImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, images: [...(v.images || []), ...newImages] } : v)));
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) =>
    setVariants((v) => v.map((item, i) => (i === variantIndex ? { ...item, images: item.images.filter((_, j) => j !== imageIndex) } : item)));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedPropIds = variants.map((v) => v.selectedPropId).filter(Boolean) as string[];
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

      const payload: any = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        images: formData.images,
      };
      if (filter_props.length) payload.filter_props = filter_props;

      const createResp = await productApi.createProductInShop(payload as any);
      const created = createResp?.data || createResp;
      const productId = created?.id || created?.data?.id;
      if (!productId) throw new Error("No product id returned");

      for (const v of variants) {
        try {
          await productApi.createVariant(productId, {
            name: v.name,
            price: v.price,
            stock: v.stock,
            filter_prop_id: v.selectedPropId ?? undefined,
          } as any);
        } catch (inner) {
          // ignore
        }
      }

      toast.success("Sản phẩm đã được tạo");
      queryClient.invalidateQueries(["products"] as any);
      navigate("/products");
    } catch (err) {
      toast.error("Tạo sản phẩm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tạo sản phẩm</h1>

        <form onSubmit={handleSubmit}>
          <ProductBasic formData={formData} onChange={handleInputChange} onImageUpload={handleImageUpload} removeImage={removeImage} />

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

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Hủy</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">{isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}</button>
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
  images: string[];
  selectedPropId?: string | null;
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateProductInShopPayload>({
    name: "",
    description: "",
    type: "",
    images: [],
    variants: [],
  });
  const [variants, setVariants] = useState<VariantForm[]>([
    {
      name: "",
      type: "size",
      stock: 0,
      price: 0,
      images: [],
      selectedPropId: null,
    },
  ]);
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
        const fs =
          (res?.data?.filters as Filter[]) || (res?.filters as Filter[]) || [];
        if (mounted) setFilters(fs || []);
      })
      .catch((err) => console.error("Failed to load filters", err));
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
      {
        name: "",
        type: "size",
        stock: 0,
        price: 0,
        images: [],
        selectedPropId: null,
      },
    ]);
  const removeVariant = (index: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: keyof VariantForm, value: any) =>
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );

  const openNewPropModal = (variantIndex: number) => {
    setNewPropVariantIndex(variantIndex);
    const suggested = filters.find((f) =>
      f.name?.toLowerCase().includes(variants[variantIndex].type)
    );
    setNewPropFilterId(suggested?.id || (filters[0]?.id ?? null));
    setNewPropName(variants[variantIndex].name || "");
    setShowNewPropModal(true);
  };

  const handleCreateNewProp = async () => {
    if (!newPropName) return toast.warn("Tên thuộc tính trống");
    if (!newPropFilterId) return toast.warn("Chưa chọn nhóm filter");
    setModalCreating(true);
    try {
      await filterApi.createFilterProps(newPropFilterId, [newPropName]);
      const refreshed = await filterApi.getAll();
      const fs =
        (refreshed?.data?.filters as Filter[]) ||
        (refreshed?.filters as Filter[]) ||
        [];
      setFilters(fs || []);
      const created = fs
        .flatMap((f) => f.props || [])
        .find((p: any) => p.name === newPropName);
      if (created && created.id && typeof newPropVariantIndex === "number")
        updateVariant(newPropVariantIndex, "selectedPropId", created.id);
      setShowNewPropModal(false);
      setNewPropName("");
      setNewPropFilterId(null);
      setNewPropVariantIndex(null);
      toast.success("Tạo thuộc tính thành công");
    } catch (err) {
      console.error(err);
      toast.error("Tạo thuộc tính thất bại");
    } finally {
      setModalCreating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setFormData((p) => ({ ...p, images: [...(p.images || []), ...newImages] }));
  };

  const removeImage = (index: number) =>
    setFormData((p) => ({
      ...p,
      images: p.images?.filter((_, i) => i !== index) || [],
    }));

  const handleVariantImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, images: [...(v.images || []), ...newImages] } : v
      )
    );
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) =>
    setVariants((v) =>
      v.map((item, i) =>
        i === variantIndex
          ? { ...item, images: item.images.filter((_, j) => j !== imageIndex) }
          : item
      )
    );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedPropIds = variants
        .map((v) => v.selectedPropId)
        .filter(Boolean) as string[];
      let filter_props: string[] = Array.from(new Set(selectedPropIds));

      if (filter_props.length === 0) {
        const propIdSet = new Set<string>();
        for (const v of variants) {
          let found: any = undefined;
          for (const f of filters) {
            if (!f.props) continue;
            const p = f.props.find(
              (pp: any) => pp.name?.toLowerCase() === v.name?.toLowerCase()
            );
            if (p) {
              found = p;
              break;
            }
          }
          if (!found) {
            const fMatch = filters.find((ff: any) =>
              ff.name?.toLowerCase().includes(v.type?.toLowerCase())
            );
            if (fMatch && fMatch.props && fMatch.props.length > 0) {
              const p2 = fMatch.props.find(
                (pp: any) =>
                  v.name &&
                  pp.name?.toLowerCase().includes(v.name.toLowerCase())
              );
              found = p2 || fMatch.props[0];
            }
          }
          if (found && found.id) propIdSet.add(found.id);
        }
        filter_props = Array.from(propIdSet);
      }

      const payload: any = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        images: formData.images,
      };
      if (filter_props.length) payload.filter_props = filter_props;

      const createResp = await productApi.createProductInShop(payload as any);
      const created = createResp?.data || createResp;
      const productId = created?.id || created?.data?.id;
      if (!productId) throw new Error("No product id returned");

      for (const v of variants) {
        try {
          await productApi.createVariant(productId, {
            name: v.name,
            price: v.price,
            stock: v.stock,
            filter_prop_id: v.selectedPropId ?? undefined,
          } as any);
        } catch (inner) {
          console.warn("Failed to create variant", inner);
        }
      }

      toast.success("Sản phẩm đã được tạo");
      queryClient.invalidateQueries(["products"]);
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Tạo sản phẩm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tạo sản phẩm</h1>

        <form onSubmit={handleSubmit}>
          <ProductBasic
            formData={formData}
            onChange={handleInputChange}
            onImageUpload={handleImageUpload}
            removeImage={removeImage}
          />

          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Variants</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Thêm
                </button>
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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
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
  images: string[];
  selectedPropId?: string | null;
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateProductInShopPayload>({
    name: "",
    description: "",
    type: "",
    images: [],
    variants: [],
  });
  const [variants, setVariants] = useState<VariantForm[]>([
    {
      name: "",
      type: "size",
      stock: 0,
      price: 0,
      images: [],
      selectedPropId: null,
    },
  ]);
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
        const fs =
          (res?.data?.filters as Filter[]) || (res?.filters as Filter[]) || [];
        if (mounted) setFilters(fs || []);
      })
      .catch((err) => console.error("Failed to load filters", err));
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
      {
        name: "",
        type: "size",
        stock: 0,
        price: 0,
        images: [],
        selectedPropId: null,
      },
    ]);
  const removeVariant = (index: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: keyof VariantForm, value: any) =>
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );

  const openNewPropModal = (variantIndex: number) => {
    setNewPropVariantIndex(variantIndex);
    const suggested = filters.find((f) =>
      f.name?.toLowerCase().includes(variants[variantIndex].type)
    );
    setNewPropFilterId(suggested?.id || (filters[0]?.id ?? null));
    setNewPropName(variants[variantIndex].name || "");
    setShowNewPropModal(true);
  };

  const handleCreateNewProp = async () => {
    if (!newPropName) return toast.warn("Tên thuộc tính trống");
    if (!newPropFilterId) return toast.warn("Chưa chọn nhóm filter");
    setModalCreating(true);
    try {
      await filterApi.createFilterProps(newPropFilterId, [newPropName]);
      const refreshed = await filterApi.getAll();
      const fs =
        (refreshed?.data?.filters as Filter[]) ||
        (refreshed?.filters as Filter[]) ||
        [];
      setFilters(fs || []);
      const created = fs
        .flatMap((f) => f.props || [])
        .find((p: any) => p.name === newPropName);
      if (created && created.id && typeof newPropVariantIndex === "number")
        updateVariant(newPropVariantIndex, "selectedPropId", created.id);
      setShowNewPropModal(false);
      setNewPropName("");
      setNewPropFilterId(null);
      setNewPropVariantIndex(null);
      toast.success("Tạo thuộc tính thành công");
    } catch (err) {
      console.error(err);
      toast.error("Tạo thuộc tính thất bại");
    } finally {
      setModalCreating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setFormData((p) => ({ ...p, images: [...(p.images || []), ...newImages] }));
  };

  const removeImage = (index: number) =>
    setFormData((p) => ({
      ...p,
      images: p.images?.filter((_, i) => i !== index) || [],
    }));

  const handleVariantImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, images: [...(v.images || []), ...newImages] } : v
      )
    );
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) =>
    setVariants((v) =>
      v.map((item, i) =>
        i === variantIndex
          ? { ...item, images: item.images.filter((_, j) => j !== imageIndex) }
          : item
      )
    );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedPropIds = variants
        .map((v) => v.selectedPropId)
        .filter(Boolean) as string[];
      let filter_props: string[] = Array.from(new Set(selectedPropIds));

      if (filter_props.length === 0) {
        const propIdSet = new Set<string>();
        for (const v of variants) {
          let found: any = undefined;
          for (const f of filters) {
            if (!f.props) continue;
            const p = f.props.find(
              (pp: any) => pp.name?.toLowerCase() === v.name?.toLowerCase()
            );
            if (p) {
              found = p;
              break;
            }
          }
          if (!found) {
            const fMatch = filters.find((ff: any) =>
              ff.name?.toLowerCase().includes(v.type?.toLowerCase())
            );
            if (fMatch && fMatch.props && fMatch.props.length > 0) {
              const p2 = fMatch.props.find(
                (pp: any) =>
                  v.name &&
                  pp.name?.toLowerCase().includes(v.name.toLowerCase())
              );
              found = p2 || fMatch.props[0];
            }
          }
          if (found && found.id) propIdSet.add(found.id);
        }
        filter_props = Array.from(propIdSet);
      }

      const payload: any = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        images: formData.images,
      };
      if (filter_props.length) payload.filter_props = filter_props;

      const createResp = await productApi.createProductInShop(payload as any);
      const created = createResp?.data || createResp;
      const productId = created?.id || created?.data?.id;
      if (!productId) throw new Error("No product id returned");

      for (const v of variants) {
        try {
          await productApi.createVariant(productId, {
            name: v.name,
            price: v.price,
            stock: v.stock,
            filter_prop_id: v.selectedPropId ?? undefined,
          } as any);
        } catch (inner) {
          console.warn("Failed to create variant", inner);
        }
      }

      toast.success("Sản phẩm đã được tạo");
      queryClient.invalidateQueries(["products"]);
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Tạo sản phẩm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tạo sản phẩm</h1>

        <form onSubmit={handleSubmit}>
          <ProductBasic
            formData={formData}
            onChange={handleInputChange}
            onImageUpload={handleImageUpload}
            removeImage={removeImage}
          />

          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Variants</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Thêm
                </button>
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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { filterApi } from "@/apis/filter.api";
import { productApi } from "@/apis/product.api";
import type { Filter } from "@/models/Filter";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CreateProductInShopPayload } from "@/models/Product";
import { toast } from "react-toastify";

interface VariantForm {
  name: string;
  type: string;
  stock: number;
  price: number;
  images: string[];
  selectedPropId?: string | null;
}

export default function CreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useQueryClient } from "@tanstack/react-query";
  import { filterApi } from "@/apis/filter.api";
  import { productApi } from "@/apis/product.api";
  import type { Filter } from "@/models/Filter";
  import Layout from "@/components/layout/Layout";
  import { Card } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import type { CreateProductInShopPayload } from "@/models/Product";
  import { toast } from "react-toastify";

  interface VariantForm {
    name: string;
    type: string;
    stock: number;
    price: number;
    images: string[];
    selectedPropId?: string | null;
  }

  export default function CreateProduct() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<CreateProductInShopPayload>({
      name: "",
      description: "",
      type: "",
      images: [],
      variants: [],
    });

    const [variants, setVariants] = useState<VariantForm[]>([
      {
        name: "",
        type: "size",
        stock: 0,
        price: 0,
        images: [],
        selectedPropId: null,
      },
    ]);
    const [filters, setFilters] = useState<Filter[]>([]);

    const [showNewPropModal, setShowNewPropModal] = useState(false);
    const [newPropName, setNewPropName] = useState("");
    const [newPropFilterId, setNewPropFilterId] = useState<string | null>(null);
    const [newPropVariantIndex, setNewPropVariantIndex] = useState<
      number | null
    >(null);
    const [modalCreating, setModalCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      let mounted = true;
      filterApi
        .getAll()
        .then((res) => {
          const fs =
            (res?.data?.filters as Filter[]) ||
            (res?.filters as Filter[]) ||
            [];
          if (mounted) setFilters(fs || []);
        })
        .catch((err) => console.error("Failed to load filters", err));
      return () => {
        mounted = false;
      };
    }, []);

    const handleInputChange = (
      field: keyof CreateProductInShopPayload,
      value: any
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addVariant = () =>
      setVariants((prev) => [
        ...prev,
        {
          name: "",
          type: "size",
          stock: 0,
          price: 0,
          images: [],
          selectedPropId: null,
        },
      ]);
    const removeVariant = (index: number) =>
      setVariants((prev) => prev.filter((_, i) => i !== index));
    const updateVariant = (
      index: number,
      field: keyof VariantForm,
      value: any
    ) => {
      setVariants((prev) =>
        prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
      );
    };

    const openNewPropModal = (variantIndex: number) => {
      setNewPropVariantIndex(variantIndex);
      const suggested = filters.find((f) =>
        f.name?.toLowerCase().includes(variants[variantIndex].type)
      );
      setNewPropFilterId(suggested?.id || (filters[0]?.id ?? null));
      setNewPropName(variants[variantIndex].name || "");
      setShowNewPropModal(true);
    };

    const handleCreateNewProp = async () => {
      if (!newPropName) return toast.warn("Tên thuộc tính trống");
      if (!newPropFilterId) return toast.warn("Chưa chọn nhóm filter");
      setModalCreating(true);
      try {
        await filterApi.createFilterProps(newPropFilterId, [newPropName]);
        const refreshed = await filterApi.getAll();
        const fs =
          (refreshed?.data?.filters as Filter[]) ||
          (refreshed?.filters as Filter[]) ||
          [];
        setFilters(fs || []);

        let createdId: string | undefined;
        for (const f of fs) {
          const p = f.props?.find((pp: any) => pp.name === newPropName);
          if (p) {
            createdId = p.id;
            break;
          }
        }

        if (typeof newPropVariantIndex === "number" && createdId) {
          updateVariant(newPropVariantIndex, "selectedPropId", createdId);
        }

        setShowNewPropModal(false);
        setNewPropName("");
        setNewPropFilterId(null);
        setNewPropVariantIndex(null);
        toast.success("Tạo thuộc tính thành công");
      } catch (err) {
        console.error(err);
        toast.error("Tạo thuộc tính thất bại");
      } finally {
        setModalCreating(false);
      }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
      e?.preventDefault();
      setIsSubmitting(true);
      try {
        const selectedPropIds = variants
          .map((v) => v.selectedPropId)
          .filter(Boolean) as string[];
        let filter_props: string[] = Array.from(new Set(selectedPropIds));

        if (filter_props.length === 0) {
          const propIdSet = new Set<string>();
          for (const v of variants) {
            let found: any = undefined;
            for (const f of filters) {
              if (!f.props) continue;
              const p = f.props.find(
                (pp: any) => pp.name?.toLowerCase() === v.name?.toLowerCase()
              );
              if (p) {
                found = p;
                break;
              }
            }
            if (!found) {
              const fMatch = filters.find((ff: any) =>
                ff.name?.toLowerCase().includes(v.type?.toLowerCase())
              );
              if (fMatch && fMatch.props && fMatch.props.length > 0) {
                const p2 = fMatch.props.find(
                  (pp: any) =>
                    v.name &&
                    pp.name?.toLowerCase().includes(v.name.toLowerCase())
                );
                found = p2 || fMatch.props[0];
              }
            }
            if (found && found.id) propIdSet.add(found.id);
          }
          filter_props = Array.from(propIdSet);
        }

        const payload: any = {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          images: formData.images,
        };
        if (filter_props.length) payload.filter_props = filter_props;

        const createResp = await productApi.createProductInShop(payload as any);
        const created = createResp?.data || createResp;
        const productId = created?.id || created?.data?.id;
        if (!productId) throw new Error("No product id returned");

        for (const v of variants) {
          try {
            await productApi.createVariant(productId, {
              name: v.name,
              price: v.price,
              stock: v.stock,
              filter_prop_id: v.selectedPropId ?? undefined,
            } as any);
          } catch (inner) {
            console.warn("Failed to create variant", inner);
          }
        }

        toast.success("Sản phẩm đã được tạo");
        queryClient.invalidateQueries(["products"]);
        navigate("/products");
      } catch (err) {
        console.error(err);
        toast.error("Tạo sản phẩm thất bại");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
      setFormData((p) => ({
        ...p,
        images: [...(p.images || []), ...newImages],
      }));
    };

    const removeImage = (index: number) => {
      setFormData((p) => ({
        ...p,
        images: p.images?.filter((_, i) => i !== index) || [],
      }));
    };

    const handleVariantImageUpload = (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = e.target.files;
      if (!files) return;
      const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
      setVariants((prev) =>
        prev.map((v, i) =>
          i === index
            ? { ...v, images: [...(v.images || []), ...newImages] }
            : v
        )
      );
    };

    const removeVariantImage = (variantIndex: number, imageIndex: number) => {
      setVariants((v) =>
        v.map((item, i) =>
          i === variantIndex
            ? {
                ...item,
                images: item.images.filter((_, j) => j !== imageIndex),
              }
            : item
        )
      );
    };

    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Tạo sản phẩm</h1>

          <form onSubmit={handleSubmit}>
            <Card className="p-4 mb-4">
              <label className="block text-sm font-medium mb-1">
                Tên sản phẩm
              </label>
              <Input
                value={formData.name}
                onChange={(e: any) => handleInputChange("name", e.target.value)}
              />

              <label className="block text-sm font-medium mt-3 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full p-2 border rounded"
              />

              <label className="block text-sm font-medium mt-3 mb-1">
                Hình ảnh
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
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

            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">Variants</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="border p-3 rounded">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-sm">Tên</label>
                        <Input
                          value={v.name}
                          onChange={(e: any) =>
                            updateVariant(idx, "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm">Giá</label>
                        <Input
                          type="number"
                          value={v.price}
                          onChange={(e: any) =>
                            updateVariant(idx, "price", Number(e.target.value))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm">Kho</label>
                        <Input
                          type="number"
                          value={v.stock}
                          onChange={(e: any) =>
                            updateVariant(idx, "stock", Number(e.target.value))
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-sm block mb-1">
                        Map to Filter Prop
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={v.selectedPropId ?? ""}
                          onChange={(e) =>
                            updateVariant(
                              idx,
                              "selectedPropId",
                              e.target.value || null
                            )
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
                          onClick={() => openNewPropModal(idx)}
                          className="px-3 py-1 border rounded"
                        >
                          Tạo thuộc tính
                        </button>
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
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
                        onChange={(e) => handleVariantImageUpload(idx, e)}
                      />
                      {v.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                          {v.images.map((img, i) => (
                            <div key={i} className="relative">
                              <img
                                src={img}
                                alt={`var-${idx}-${i}`}
                                className="w-full h-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantImage(idx, i)}
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
                ))}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
                </button>
              </div>
            </Card>
          </form>

          {showNewPropModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-md bg-white rounded p-4">
                <h3 className="font-semibold mb-2">Tạo thuộc tính lọc mới</h3>
                <div className="mb-2">
                  <label className="text-sm block mb-1">Chọn nhóm filter</label>
                  <select
                    value={newPropFilterId ?? ""}
                    onChange={(e) => setNewPropFilterId(e.target.value || null)}
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
                    value={newPropName}
                    onChange={(e: any) => setNewPropName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowNewPropModal(false)}
                    className="px-3 py-1 border rounded"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateNewProp}
                    disabled={modalCreating || !newPropName || !newPropFilterId}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    {modalCreating ? "Đang tạo..." : "Tạo"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  const handleVariantImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, images: [...(v.images || []), ...newImages] } : v
      )
    );
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    setVariants((v) =>
      v.map((item, i) =>
        i === variantIndex
          ? { ...item, images: item.images.filter((_, j) => j !== imageIndex) }
          : item
      )
    );
  };

  // handleCreateNewProp defined above (keeps single implementation)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedPropIds = variants
        .map((v) => v.selectedPropId)
        .filter(Boolean) as string[];
      let filter_props: string[] = Array.from(new Set(selectedPropIds));

      if (filter_props.length === 0) {
        const propIdSet = new Set<string>();
        for (const v of variants) {
          let found: any = undefined;
          for (const f of filters) {
            if (!f.props) continue;
            const p = f.props.find(
              (pp: any) => pp.name?.toLowerCase() === v.name?.toLowerCase()
            );
            if (p) {
              found = p;
              break;
            }
          }
          if (!found) {
            const fMatch = filters.find((ff: any) =>
              ff.name?.toLowerCase().includes(v.type?.toLowerCase())
            );
            if (fMatch && fMatch.props && fMatch.props.length > 0) {
              const p2 = fMatch.props.find(
                (pp: any) =>
                  v.name &&
                  pp.name?.toLowerCase().includes(v.name.toLowerCase())
              );
              found = p2 || fMatch.props[0];
            }
          }
          if (found && found.id) propIdSet.add(found.id);
        }
        filter_props = Array.from(propIdSet);
      }

      const payload: any = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        images: formData.images,
      };
      if (filter_props.length) payload.filter_props = filter_props;

      const createResp = await productApi.createProductInShop(payload as any);
      const created = createResp?.data || createResp;
      const productId = created?.id || created?.data?.id;
      if (!productId) throw new Error("No product id returned");

      for (const v of variants) {
        try {
          await productApi.createVariant(productId, {
            name: v.name,
            price: v.price,
            stock: v.stock,
            filter_prop_id: v.selectedPropId ?? undefined,
          } as any);
        } catch (inner) {
          console.warn("Failed to create variant", inner);
        }
      }

      toast.success("Sản phẩm đã được tạo");
      queryClient.invalidateQueries(["products"]);
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Tạo sản phẩm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-3xl font-bold text-gray-900">
                  Tạo sản phẩm mới
                </h1>
                <p className="text-gray-600 mt-1">
                  Thêm sản phẩm mới vào shop của bạn
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="p-6 border-2 border-gray-100 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">
                  Thông tin cơ bản
                </h2>
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
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
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

            <Card className="p-6 border-2 border-gray-100 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">
                  Hình ảnh sản phẩm
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Upload hình ảnh
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
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

            <Card className="p-6 border-2 border-gray-100 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Biến thể sản phẩm
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-900 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 font-medium"
                >
                  <Plus className="w-4 h-4" /> Thêm biến thể
                </button>
              </div>

              <div className="space-y-6">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">
                        Biến thể {index + 1}
                      </h3>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Tên biến thể *
                        </label>
                        <Input
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(index, "name", e.target.value)
                          }
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
                          onChange={(e) =>
                            updateVariant(index, "type", e.target.value)
                          }
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
                          min={0}
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock",
                              parseInt(e.target.value) || 0
                            )
                          }
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
                          min={0}
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "price",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          required
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Map tới thuộc tính lọc (tùy chọn)
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={variant.selectedPropId || ""}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "selectedPropId",
                              e.target.value
                            )
                          }
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">(Tự động / Không map)</option>
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
                          onClick={() => {
                            const suggestedFilter =
                              filters.find((f) =>
                                f.name
                                  ?.toLowerCase()
                                  .includes(variant.type?.toLowerCase())
                              ) || filters[0];
                            if (!suggestedFilter) {
                              alert(
                                "Không có filter để thêm thuộc tính. Vui lòng tạo filter trước."
                              );
                              return;
                            }
                            setNewPropFilterId(suggestedFilter.id);
                            setNewPropName(variant.name || "");
                            setNewPropVariantIndex(index);
                            setShowNewPropModal(true);
                          }}
                          className="px-3 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm hover:bg-gray-50"
                        >
                          Thêm thuộc tính
                        </button>
                      </div>
                    </div>

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
                                onClick={() =>
                                  removeVariantImage(index, imageIndex)
                                }
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
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
              </button>
            </div>
          </form>

          {showNewPropModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-6">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Tạo thuộc tính lọc mới
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Chọn nhóm filter (nếu cần) và nhập tên thuộc tính.
                  </p>

                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nhóm filter
                  </label>
                  <select
                    value={newPropFilterId || ""}
                    onChange={(e) => setNewPropFilterId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4"
                  >
                    <option value="">-- Chọn nhóm --</option>
                    {filters.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>

                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tên thuộc tính
                  </label>
                  <Input
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    placeholder="VD: M, L, Đỏ"
                  />

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewPropModal(false);
                        setNewPropName("");
                        setNewPropFilterId(null);
                        setNewPropVariantIndex(null);
                      }}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      disabled={modalCreating}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateNewProp}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-200"
                      disabled={
                        modalCreating || !newPropName || !newPropFilterId
                      }
                    >
                      {modalCreating ? "Đang tạo..." : "Tạo thuộc tính"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
