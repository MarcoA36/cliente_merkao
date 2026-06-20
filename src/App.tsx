import { useEffect, useState } from "react";
import * as api from "./api";
import type { Department, PromotionDraft, Section } from "./adminTypes";
import { AdminLayout } from "./components/AdminLayout";
import { DashboardSummary } from "./components/DashboardSummary";
import { LoginScreen } from "./components/LoginScreen";
import { OperationalRail } from "./components/OperationalRail";
import { SESSION_KEY, nextStatus } from "./constants";
import type { Brand, Category, Order, Product, User } from "./types";
import * as ui from "./uiStyles";
import { CatalogView } from "./views/CatalogView";
import { InventoryView } from "./views/InventoryView";
import { OrdersView } from "./views/OrdersView";
import { ProductsView } from "./views/ProductsView";
import { PromotionsView } from "./views/PromotionsView";

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<Section>("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [promotions, setPromotions] = useState<PromotionDraft[]>([]);
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
      const [categoryResponse, brandResponse, productResponse, orderResponse, departmentResponse, promotionResponse] = await Promise.all([
        api.listCategories(nextToken),
        api.listBrands(nextToken),
        api.listProducts(nextToken),
        api.listOrders(nextToken, includeArchived),
        api.listDepartments(nextToken),
        api.listPromotions(nextToken)
      ]);
      setCategories(categoryResponse.categories);
      setBrands(brandResponse.brands);
      setProducts(productResponse.products);
      setOrders(orderResponse.orders);
      setDepartments(departmentResponse.departments);
      setPromotions(promotionResponse.promotions);
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
    setDepartments([]);
    setPromotions([]);
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

      {notice ? <div className={ui.cn(ui.pageNotice, ui.noticeSuccess)}>{notice}</div> : null}
      {error ? <div className={ui.cn(ui.pageNotice, ui.noticeError)}>{error}</div> : null}

      <div className={ui.dashboardGrid}>
        <div className={ui.dashboardPrimary}>
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

          {section === "promotions" ? (
            <PromotionsView
              products={products}
              promotions={promotions}
              onCreate={(input) => run(() => api.createPromotion(token, input).then(noop), "Promocion creada")}
              onUpdate={(id, input) => run(() => api.updatePromotion(token, id, input).then(noop), "Promocion actualizada")}
              onDelete={(id) => run(() => api.deletePromotion(token, id), "Promocion eliminada")}
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
              kind="categories"
              title="Categorias"
              items={categories}
              departments={departments}
              onCreateDepartment={(input) => run(() => api.createDepartment(token, input).then(noop), "Rubro creado")}
              onUpdateDepartment={(id, input) => run(() => api.updateDepartment(token, id, input).then(noop), "Rubro actualizado")}
              onDeleteDepartment={(id) => run(() => api.deleteDepartment(token, id), "Rubro eliminado")}
              onCreate={(input) => run(() => api.createCategory(token, input).then(noop), "Categoria creada")}
              onUpdate={(id, input) => run(() => api.updateCategory(token, id, input).then(noop), "Categoria actualizada")}
              onDelete={(id) => run(() => api.deleteCategory(token, id), "Categoria eliminada")}
            />
          ) : null}

          {section === "brands" ? (
            <CatalogView
              kind="brands"
              title="Marcas"
              items={brands}
              departments={departments}
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
