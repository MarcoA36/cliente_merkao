import type { Product, ProductInput } from "./types";

export type Section = "products" | "inventory" | "categories" | "brands" | "orders";

export type EditableProduct = Product | (ProductInput & { id?: string });

export type InventoryInput = {
  price?: number;
  promotionalPrice?: number | null;
  stock?: number;
};

export type CatalogInput = {
  name: string;
  slug?: string;
};
