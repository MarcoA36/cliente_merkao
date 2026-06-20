import type {
  AuthResponse,
  Brand,
  Category,
  Order,
  OrderStatus,
  Product,
  ProductInput
} from "./types";
import type { CatalogInput, Department, PromotionDraft } from "./adminTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function request<T>(path: string, token: string | null, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, payload.message ?? "Request failed");
  }

  return payload as T;
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", null, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function listCategories(token: string) {
  return request<{ categories: Category[] }>("/admin/categories", token);
}

export function createCategory(token: string, input: CatalogInput) {
  return request<{ category: Category }>("/admin/categories", token, {
    method: "POST",
    body: JSON.stringify(catalogPayload(input))
  });
}

export function updateCategory(token: string, id: string, input: CatalogInput) {
  return request<{ category: Category }>(`/admin/categories/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(catalogPayload(input))
  });
}

export function deleteCategory(token: string, id: string) {
  return request<void>(`/admin/categories/${id}`, token, { method: "DELETE" });
}

export function listDepartments(token: string) {
  return request<{ departments: Department[] }>("/admin/departments", token);
}

export function createDepartment(token: string, input: { name: string; slug?: string }) {
  return request<{ department: Department }>("/admin/departments", token, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateDepartment(token: string, id: string, input: { name: string; slug?: string }) {
  return request<{ department: Department }>(`/admin/departments/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export function deleteDepartment(token: string, id: string) {
  return request<void>(`/admin/departments/${id}`, token, { method: "DELETE" });
}

export function listBrands(token: string) {
  return request<{ brands: Brand[] }>("/admin/brands", token);
}

export function createBrand(token: string, input: CatalogInput) {
  return request<{ brand: Brand }>("/admin/brands", token, {
    method: "POST",
    body: JSON.stringify(catalogPayload(input))
  });
}

export function updateBrand(token: string, id: string, input: CatalogInput) {
  return request<{ brand: Brand }>(`/admin/brands/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(catalogPayload(input))
  });
}

export function deleteBrand(token: string, id: string) {
  return request<void>(`/admin/brands/${id}`, token, { method: "DELETE" });
}

export function listProducts(token: string) {
  return request<{ products: Product[] }>("/admin/products", token);
}

export function createProduct(token: string, input: ProductInput) {
  return request<{ product: Product }>("/admin/products", token, {
    method: "POST",
    body: JSON.stringify(productPayload(input))
  });
}

export function updateProduct(token: string, id: string, input: ProductInput) {
  return request<{ product: Product }>(`/admin/products/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(productPayload(input))
  });
}

export function updateInventory(
  token: string,
  id: string,
  input: { price?: number; promotionalPrice?: number | null; stock?: number }
) {
  return request<{ product: Product }>(`/admin/products/${id}/inventory`, token, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export function deleteProduct(token: string, id: string) {
  return request<void>(`/admin/products/${id}`, token, { method: "DELETE" });
}

export function listPromotions(token: string) {
  return request<{ promotions: PromotionDraft[] }>("/admin/promotions", token);
}

export function createPromotion(token: string, input: PromotionDraft) {
  return request<{ promotion: PromotionDraft }>("/admin/promotions", token, {
    method: "POST",
    body: JSON.stringify(promotionPayload(input))
  });
}

export function updatePromotion(token: string, id: string, input: PromotionDraft) {
  return request<{ promotion: PromotionDraft }>(`/admin/promotions/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(promotionPayload(input))
  });
}

export function deletePromotion(token: string, id: string) {
  return request<void>(`/admin/promotions/${id}`, token, { method: "DELETE" });
}

export function listOrders(token: string, includeArchived: boolean) {
  const suffix = includeArchived ? "?includeArchived=true" : "";
  return request<{ orders: Order[] }>(`/admin/orders${suffix}`, token);
}

export function updateOrderStatus(token: string, id: string, status: OrderStatus) {
  return request<{ order: Order }>(`/admin/orders/${id}/status`, token, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export async function openVoucher(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/voucher`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new ApiError(response.status, "No se pudo abrir el voucher");
  }

  const html = await response.text();
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function catalogPayload(input: CatalogInput) {
  return {
    name: input.name,
    slug: input.slug,
    imageUrl: input.imageUrl,
    departmentId: input.departmentId
  };
}

function productPayload(input: ProductInput) {
  return {
    name: input.name,
    description: input.description,
    price: input.price,
    promotionalPrice: input.promotionalPrice ?? null,
    quantityPrices: input.quantityPrices ?? [],
    stock: input.stock,
    imageUrl: input.imageUrl,
    categoryId: input.categoryId,
    brandId: input.brandId
  };
}

function promotionPayload(input: PromotionDraft) {
  return {
    name: input.name,
    productIds: input.productIds,
    startsAt: input.startsAt || null,
    endsAt: input.endsAt || null,
    promotionalPrice: input.promotionalPrice,
    promotionalStock: input.promotionalStock,
    active: input.active,
    priority: input.priority
  };
}
