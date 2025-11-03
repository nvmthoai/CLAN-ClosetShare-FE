import { fetcher } from "./fetcher";

export type CreateOrderItem = {
  variant_id: string;
  quantity: number;
};

export type CreateOrderPayload = {
  receiver_name: string;
  phone_number: string;
  address: string;
  province_id: number;
  ward_id: number;
  type: string; // e.g. SALE
  payment_method: "BANK_TRANSFER" | "COD";
  items: CreateOrderItem[]; // note: backend screenshot shows 'item', normalize to 'items'
};

export const orderApi = {
  create: (payload: CreateOrderPayload) => {
    // Don't send both 'items' and 'item' to avoid conflicts
    // Remove 'items' and only send 'item' if backend expects it
    const { items, ...rest } = payload;
    return fetcher.post("/orders", {
      ...rest,
      item: items, // Backend expects 'item' not 'items'
    });
  },
};
