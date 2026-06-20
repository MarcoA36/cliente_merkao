import type { Product, ProductInput } from "./types";

export type Section = "orders" | "products" | "promotions" | "inventory" | "categories" | "brands";

export type EditableProduct = Product | (ProductInput & { id?: string });

export type InventoryInput = {
  price?: number;
  promotionalPrice?: number | null;
  stock?: number;
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
