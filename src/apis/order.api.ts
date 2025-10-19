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
  create: (payload: CreateOrderPayload) =>
    fetcher.post("/orders", {
      ...payload,
      // adapt key if backend expects 'item'
      item: payload.items,
    }),
};
