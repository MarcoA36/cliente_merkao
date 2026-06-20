export type User = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  departmentId?: string | null;
  department?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count?: { products: number };
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  _count?: { products: number };
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice: number | null;
  quantityPrices?: Array<{
    id: string;
    from: number;
    to: number | null;
    price: number;
  }>;
  effectivePrice: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  ownerId: string;
  categoryId: string;
  brandId: string;
  category: Category;
  brand: Brand;
  owner: {
    id: string;
    name: string;
    email?: string;
  };
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number | null;
  quantityPrices?: Array<{
    id: string;
    from: number;
    to: number | null;
    price: number;
  }>;
  stock: number;
  imageUrl: string;
  localImageName?: string;
  categoryId: string;
  brandId: string;
};

export type OrderStatus = "PENDING" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";

export type OrderItem = {
  id: string;
  productId: string | null;
  productName: string;
  brandName: string;
  categoryName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  userId: string;
  addressId: string | null;
  status: OrderStatus;
  subtotal: number;
  total: number;
  addressSnapshot: {
    label: string;
    recipientName: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
  };
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};
