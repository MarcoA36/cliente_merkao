import { useEffect, useState } from "react";
import * as api from "./api";
import type { Section } from "./adminTypes";
import { AdminLayout } from "./components/AdminLayout";
import { DashboardSummary } from "./components/DashboardSummary";
import { LoginScreen } from "./components/LoginScreen";
import { OperationalRail } from "./components/OperationalRail";
import { SESSION_KEY, nextStatus } from "./constants";
import type { Brand, Category, Order, Product, User } from "./types";
import { CatalogView } from "./views/CatalogView";
import { InventoryView } from "./views/InventoryView";
import { OrdersView } from "./views/OrdersView";
import { ProductsView } from "./views/ProductsView";

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<Section>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return;

    const session = JSON.parse(stored) as { token: string; user: User };
    setToken(session.token);
    setUser(session.user);
  }, []);

  useEffect(() => {
    if (token) {
      void loadAll(token);
    }
  }, [token, includeArchived]);

  async function loadAll(nextToken = token) {
    if (!nextToken) return;

    setLoading(true);
    setError("");
    try {
      const [categoryResponse, brandResponse, productResponse, orderResponse] = await Promise.all([
        api.listCategories(nextToken),
        api.listBrands(nextToken),
        api.listProducts(nextToken),
        api.listOrders(nextToken, includeArchived)
      ]);
      setCategories(categoryResponse.categories);
      setBrands(brandResponse.brands);
      setProducts(productResponse.products);
      setOrders(orderResponse.orders);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el CMS.");
    } finally {
      setLoading(false);
    }
  }

  function persistSession(nextToken: string, nextUser: User) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
    setToken(nextToken);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setToken(null);
    setUser(null);
    setProducts([]);
    setCategories([]);
    setBrands([]);
    setOrders([]);
  }

  async function run(action: () => Promise<void>, success: string) {
    if (!token) return;

    setError("");
    setNotice("");
    try {
      await action();
      setNotice(success);
      await loadAll(token);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "No se pudo completar.");
    }
  }

  if (!token || !user) {
    return <LoginScreen onLogin={persistSession} />;
  }

  return (
    <AdminLayout
      loading={loading}
      onLogout={logout}
      onRefresh={() => void loadAll()}
      onSelectSection={setSection}
      section={section}
      user={user}
    >
      <DashboardSummary products={products} orders={orders} />

      {notice ? <div className="notice success">{notice}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      <div className="dashboardGrid">
        <div className="dashboardPrimary">
          {section === "products" ? (
            <ProductsView
              brands={brands}
              categories={categories}
              products={products}
              onCreate={(input) => run(() => api.createProduct(token, input).then(noop), "Producto creado")}
              onUpdate={(id, input) => run(() => api.updateProduct(token, id, input).then(noop), "Producto actualizado")}
              onDelete={(id) => run(() => api.deleteProduct(token, id), "Producto desactivado")}
            />
          ) : null}

          {section === "inventory" ? (
            <InventoryView
              products={products}
              onSave={(id, input) => run(() => api.updateInventory(token, id, input).then(noop), "Inventario actualizado")}
            />
          ) : null}

          {section === "categories" ? (
            <CatalogView
              title="Categorias"
              items={categories}
              onCreate={(input) => run(() => api.createCategory(token, input).then(noop), "Categoria creada")}
              onUpdate={(id, input) => run(() => api.updateCategory(token, id, input).then(noop), "Categoria actualizada")}
              onDelete={(id) => run(() => api.deleteCategory(token, id), "Categoria eliminada")}
            />
          ) : null}

          {section === "brands" ? (
            <CatalogView
              title="Marcas"
              items={brands}
              onCreate={(input) => run(() => api.createBrand(token, input).then(noop), "Marca creada")}
              onUpdate={(id, input) => run(() => api.updateBrand(token, id, input).then(noop), "Marca actualizada")}
              onDelete={(id) => run(() => api.deleteBrand(token, id), "Marca eliminada")}
            />
          ) : null}

          {section === "orders" ? (
            <OrdersView
              includeArchived={includeArchived}
              orders={orders}
              onToggleArchived={setIncludeArchived}
              onAdvance={(order) => {
                const status = nextStatus[order.status];
                if (!status) return;
                return run(() => api.updateOrderStatus(token, order.id, status).then(noop), "Estado actualizado");
              }}
              onVoucher={(order) => run(() => api.openVoucher(token, order.id), "Voucher abierto")}
            />
          ) : null}
        </div>
        <OperationalRail products={products} orders={orders} onInventory={() => setSection("inventory")} />
      </div>
    </AdminLayout>
  );
}

function noop() {}
