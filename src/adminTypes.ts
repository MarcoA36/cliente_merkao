import type { Product, ProductInput } from "./types";

export type Section = "orders" | "products" | "promotions" | "inventory" | "categories" | "brands";

export type EditableProduct = Product | (ProductInput & { id?: string });

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
};

export type PageParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type InventoryInput = {
  price?: number;
  stock?: number;
  reason?: string;
};

export type InventoryMovementType = "IN" | "OUT" | "ADJUSTMENT" | "RESERVED" | "RELEASED";

export type InventoryMovement = {
  id: string;
  productId: string;
  type: InventoryMovementType;
  quantity: number;
  reason: string;
  orderId: string | null;
  changedByUserId: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    stock: number;
    brand: {
      id: string;
      name: string;
    };
  };
  changedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type CatalogInput = {
  name: string;
  slug?: string;
  imageUrl?: string;
  departmentId?: string;
};

export type Department = {
  id: string;
  name: string;
  slug: string;
  _count?: { categories: number };
};

export type QuantityPriceRange = {
  id: string;
  from: number;
  to: number | null;
  price: number;
};

export type PromotionPriority = "featured" | "normal" | "secondary";

export type PromotionDraft = {
  id: string;
  name: string;
  productIds: string[];
  products?: Array<{
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }>;
  startsAt: string;
  endsAt: string;
  promotionalPrice: number;
  promotionalStock: number;
  active: boolean;
  priority: PromotionPriority;
};
