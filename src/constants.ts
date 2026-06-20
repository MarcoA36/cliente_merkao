import type { OrderStatus, ProductInput } from "./types";

export const SESSION_KEY = "merkao.admin.session";

export const emptyProduct: ProductInput = {
  name: "",
  description: "",
  price: 0,
  promotionalPrice: null,
  stock: 0,
  imageUrl: "",
  categoryId: "",
  brandId: ""
};

export const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  PREPARING: "En preparacion",
  ON_THE_WAY: "En camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado"
};

export const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "PREPARING",
  PREPARING: "ON_THE_WAY",
  ON_THE_WAY: "DELIVERED"
};
