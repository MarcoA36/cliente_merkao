import { useEffect, useState } from "react";
import * as api from "./api";
import type { Department, InventoryMovement, PaginationMeta, PromotionDraft, Section } from "./adminTypes";
import { AdminLayout } from "./components/AdminLayout";
import { DashboardSummary } from "./components/DashboardSummary";
import { LoginScreen } from "./components/LoginScreen";
import { OperationalRail } from "./components/OperationalRail";
import { SESSION_KEY } from "./constants";
import type { Brand, Category, Order, OrderStatus, Product, User } from "./types";
import * as ui from "./uiStyles";
import { CatalogView } from "./views/CatalogView";
import { InventoryView } from "./views/InventoryView";
import { OrdersView } from "./views/OrdersView";
import { ProductsView } from "./views/ProductsView";
import { PromotionsView } from "./views/PromotionsView";

const emptyPagination: PaginationMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
  from: 0,
  to: 0
};

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<Section>("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryProducts, setInventoryProducts] = useState<Product[]>([]);
  const [promotionProductOptions, setPromotionProductOptions] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>([]);
  const [promotions, setPromotions] = useState<PromotionDraft[]>([]);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [productParams, setProductParams] = useState({ page: 1, limit: 20, search: "" });
  const [inventoryParams, setInventoryParams] = useState({ page: 1, limit: 20, search: "" });
  const [orderParams, setOrderParams] = useState<{
    page: number;
    limit: number;
    search: string;
    status: "ALL" | OrderStatus;
    date: string;
  }>({ page: 1, limit: 25, search: "", status: "ALL", date: "" });
  const [promotionParams, setPromotionParams] = useState<{ page: number; limit: number; kind: "all" | "individual" | "combo" }>({
    page: 1,
    limit: 20,
    kind: "all"
  });
  const [movementParams, setMovementParams] = useState<{ page: number; limit: number; productId?: string }>({ page: 1, limit: 20 });
  const [productPagination, setProductPagination] = useState<PaginationMeta>(emptyPagination);
  const [inventoryPagination, setInventoryPagination] = useState<PaginationMeta>(emptyPagination);
  const [orderPagination, setOrderPagination] = useState<PaginationMeta>({ ...emptyPagination, limit: 25 });
  const [promotionPagination, setPromotionPagination] = useState<PaginationMeta>(emptyPagination);
  const [movementPagination, setMovementPagination] = useState<PaginationMeta>(emptyPagination);
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
  }, [token, includeArchived, productParams, inventoryParams, orderParams, promotionParams, movementParams]);

  async function loadAll(nextToken = token) {
    if (!nextToken) return;

    setLoading(true);
    setError("");
    try {
      const [
        categoryResponse,
        brandResponse,
        productResponse,
        inventoryProductResponse,
        orderResponse,
        departmentResponse,
        promotionResponse,
        movementResponse,
        promotionProductResponse
      ] = await Promise.all([
        api.listCategories(nextToken),
        api.listBrands(nextToken),
        api.listProducts(nextToken, productParams),
        api.listProducts(nextToken, inventoryParams),
        api.listOrders(nextToken, { ...orderParams, includeArchived }),
        api.listDepartments(nextToken),
        api.listPromotions(nextToken, promotionParams),
        api.listInventoryMovements(nextToken, movementParams),
        api.listProducts(nextToken, { page: 1, limit: 100 })
      ]);
      setCategories(categoryResponse.categories);
      setBrands(brandResponse.brands);
      setProducts(productResponse.products);
      setInventoryProducts(inventoryProductResponse.products);
      setOrders(orderResponse.orders);
      setDepartments(departmentResponse.departments);
      setPromotions(promotionResponse.promotions);
      setInventoryMovements(movementResponse.movements);
      setPromotionProductOptions(promotionProductResponse.products);
      setProductPagination(productResponse.pagination);
      setInventoryPagination(inventoryProductResponse.pagination);
      setOrderPagination(orderResponse.pagination);
      setPromotionPagination(promotionResponse.pagination);
      setMovementPagination(movementResponse.pagination);
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
    setInventoryProducts([]);
    setPromotionProductOptions([]);
    setCategories([]);
    setBrands([]);
    setOrders([]);
    setDepartments([]);
    setPromotions([]);
    setInventoryMovements([]);
    setProductPagination(emptyPagination);
    setInventoryPagination(emptyPagination);
    setOrderPagination({ ...emptyPagination, limit: 25 });
    setPromotionPagination(emptyPagination);
    setMovementPagination(emptyPagination);
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
              pagination={productPagination}
              products={products}
              query={productParams.search}
              onCreate={(input) => run(() => api.createProduct(token, input).then(noop), "Producto creado")}
              onUpdate={(id, input) => run(() => api.updateProduct(token, id, input).then(noop), "Producto actualizado")}
              onDelete={(id) => run(() => api.deleteProduct(token, id), "Producto desactivado")}
              onPageChange={(page) => setProductParams((current) => ({ ...current, page }))}
              onPageSizeChange={(limit) => setProductParams((current) => ({ ...current, limit, page: 1 }))}
              onQueryChange={(search) => setProductParams((current) => ({ ...current, search, page: 1 }))}
            />
          ) : null}

          {section === "promotions" ? (
            <PromotionsView
              kindFilter={promotionParams.kind}
              pagination={promotionPagination}
              products={promotionProductOptions}
              promotions={promotions}
              onCreate={(input) => run(() => api.createPromotion(token, input).then(noop), "Promocion creada")}
              onUpdate={(id, input) => run(() => api.updatePromotion(token, id, input).then(noop), "Promocion actualizada")}
              onToggleStatus={(id, active) => run(() => api.updatePromotionStatus(token, id, active).then(noop), active ? "Promocion activada" : "Promocion desactivada")}
              onDelete={(id) => run(() => api.deletePromotion(token, id), "Promocion eliminada")}
              onKindFilterChange={(kind) => setPromotionParams((current) => ({ ...current, kind, page: 1 }))}
              onPageChange={(page) => setPromotionParams((current) => ({ ...current, page }))}
              onPageSizeChange={(limit) => setPromotionParams((current) => ({ ...current, limit, page: 1 }))}
            />
          ) : null}

          {section === "inventory" ? (
            <InventoryView
              movementPagination={movementPagination}
              movements={inventoryMovements}
              pagination={inventoryPagination}
              products={inventoryProducts}
              query={inventoryParams.search}
              onSave={(id, input) => run(() => api.updateInventory(token, id, input).then(noop), "Inventario actualizado")}
              onMovementPageChange={(page) => setMovementParams((current) => ({ ...current, page }))}
              onMovementPageSizeChange={(limit) => setMovementParams((current) => ({ ...current, limit, page: 1 }))}
              onPageChange={(page) => setInventoryParams((current) => ({ ...current, page }))}
              onPageSizeChange={(limit) => setInventoryParams((current) => ({ ...current, limit, page: 1 }))}
              onQueryChange={(search) => setInventoryParams((current) => ({ ...current, search, page: 1 }))}
              onSelectProduct={(productId) =>
                setMovementParams((current) => (current.productId === productId ? current : { ...current, productId, page: 1 }))
              }
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
              pagination={orderPagination}
              query={orderParams.search}
              status={orderParams.status}
              date={orderParams.date}
              onToggleArchived={(value) => {
                setIncludeArchived(value);
                setOrderParams((current) => ({ ...current, page: 1 }));
              }}
              onChangeStatus={(order, status, notes) => run(() => api.updateOrderStatus(token, order.id, status, notes).then(noop), "Estado actualizado")}
              onDateChange={(date) => setOrderParams((current) => ({ ...current, date, page: 1 }))}
              onPageChange={(page) => setOrderParams((current) => ({ ...current, page }))}
              onPageSizeChange={(limit) => setOrderParams((current) => ({ ...current, limit, page: 1 }))}
              onQueryChange={(search) => setOrderParams((current) => ({ ...current, search, page: 1 }))}
              onStatusChange={(status) => setOrderParams((current) => ({ ...current, status, page: 1 }))}
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
