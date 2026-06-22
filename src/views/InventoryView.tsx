import { History, Save, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { InventoryInput, InventoryMovement, InventoryMovementType, PaginationMeta } from "../adminTypes";
import { PaginationControls } from "../components/PaginationControls";
import type { Product } from "../types";
import * as ui from "../uiStyles";
import { money } from "../utils/format";

const movementLabels: Record<InventoryMovementType, string> = {
  IN: "Entrada",
  OUT: "Salida",
  ADJUSTMENT: "Ajuste",
  RESERVED: "Reservado",
  RELEASED: "Liberado"
};

export function InventoryView({
  movementPagination,
  movements,
  pagination,
  products,
  query,
  onMovementPageChange,
  onMovementPageSizeChange,
  onPageChange,
  onPageSizeChange,
  onQueryChange,
  onSave,
  onSelectProduct
}: {
  movementPagination: PaginationMeta;
  movements: InventoryMovement[];
  pagination: PaginationMeta;
  products: Product[];
  query: string;
  onMovementPageChange: (page: number) => void;
  onMovementPageSizeChange: (pageSize: number) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onQueryChange: (query: string) => void;
  onSave: (id: string, input: InventoryInput) => void;
  onSelectProduct: (productId: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, { price: string; stock: string; reason: string }>>({});
  const [selectedId, setSelectedId] = useState<string | null>(products[0]?.id ?? null);

  useEffect(() => {
    setDrafts((current) => {
      const nextDrafts: Record<string, { price: string; stock: string; reason: string }> = {};
      for (const product of products) {
        nextDrafts[product.id] = {
          price: String(product.price),
          stock: String(product.stock),
          reason: current[product.id]?.reason ?? ""
        };
      }
      return nextDrafts;
    });
  }, [products]);

  useEffect(() => {
    if (products.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !products.some((product) => product.id === selectedId)) {
      setSelectedId(products[0].id);
    }
  }, [products, selectedId]);

  useEffect(() => {
    if (selectedId) {
      onSelectProduct(selectedId);
    }
  }, [onSelectProduct, selectedId]);

  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0] ?? null;
  const selectedMovements = movements.filter((movement) => movement.productId === selectedProduct?.id);

  function updateDraft(id: string, field: "price" | "stock" | "reason", value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value
      }
    }));
  }

  function saveProduct(product: Product) {
    const draft = drafts[product.id];
    onSave(product.id, {
      price: Number(draft?.price),
      stock: Number(draft?.stock),
      reason: draft?.reason.trim() || undefined
    });
    updateDraft(product.id, "reason", "");
  }

  return (
    <section className={ui.workAreaSplit}>
      <div className={ui.workArea}>
        <div className={ui.toolbar}>
          <div>
            <h3 className={ui.toolbarMainTitle}>Inventario operativo</h3>
            <p className={ui.toolbarMainText}>{pagination.total} productos visibles</p>
          </div>
          <div className={ui.searchBox}>
            <Search size={16} />
            <input
              className={ui.searchInput}
              placeholder="Buscar producto o marca"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </div>
        </div>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Producto</th>
                <th className={ui.th}>Precio base</th>
                <th className={ui.th}>Stock</th>
                <th className={ui.th}>Motivo</th>
                <th className={ui.th}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const draft = drafts[product.id];
                return (
                  <tr key={product.id} className={selectedProduct?.id === product.id ? "bg-merkao-primarySoft/40" : ""}>
                    <td className={ui.td}>
                      <button className="border-0 bg-transparent p-0 text-left" onClick={() => setSelectedId(product.id)}>
                        <strong className={ui.tableStrong}>{product.name}</strong>
                        <span className={ui.subtle}>{product.brand.name}</span>
                      </button>
                    </td>
                    <td className={ui.td}>
                      <input
                        className={ui.compactInput}
                        value={draft?.price ?? ""}
                        onChange={(event) => updateDraft(product.id, "price", event.target.value)}
                      />
                    </td>
                    <td className={ui.td}>
                      <input
                        className={ui.compactInput}
                        value={draft?.stock ?? ""}
                        onChange={(event) => updateDraft(product.id, "stock", event.target.value)}
                      />
                    </td>
                    <td className={ui.td}>
                      <input
                        className={ui.fieldInput}
                        placeholder="Reposicion, ajuste, devolucion"
                        value={draft?.reason ?? ""}
                        onChange={(event) => updateDraft(product.id, "reason", event.target.value)}
                      />
                    </td>
                    <td className={ui.cn(ui.td, ui.actions)}>
                      <button className={ui.cn(ui.primaryButton, ui.smallButton)} onClick={() => saveProduct(product)}>
                        <Save size={15} />
                        Guardar
                      </button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className={ui.emptyCell}>
                    No hay productos para mostrar.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <PaginationControls
          from={pagination.from}
          page={pagination.page}
          pageSize={pagination.limit}
          to={pagination.to}
          totalItems={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>

      <aside className={ui.sidePanel}>
        <div className={ui.panelHeader}>
          <div>
            <h3 className={ui.panelTitle}>Historial</h3>
            <p className={ui.helperText}>{selectedProduct?.name ?? "Sin producto"}</p>
          </div>
          <History size={20} />
        </div>

        {selectedProduct ? (
          <div className={ui.listPanel}>
            <div className={ui.listRow}>
              <div>
                <strong className={ui.tableStrong}>{selectedProduct.brand.name}</strong>
                <span className={ui.subtle}>Stock actual</span>
              </div>
              <strong>{selectedProduct.stock}</strong>
            </div>
            <div className={ui.listRow}>
              <span>Precio base</span>
              <strong>${money(selectedProduct.price)}</strong>
            </div>
          </div>
        ) : null}

        <div className={ui.listPanel}>
          {selectedMovements.map((movement) => (
            <div className={ui.listRow} key={movement.id}>
              <div>
                <strong className={ui.tableStrong}>{movementLabels[movement.type]}</strong>
                <span className={ui.subtle}>{movement.reason}</span>
                <span className={ui.subtle}>{new Date(movement.createdAt).toLocaleString("es-AR")}</span>
                {movement.changedBy?.name ? <span className={ui.subtle}>{movement.changedBy.name}</span> : null}
              </div>
              <strong className={movement.quantity >= 0 ? "text-merkao-primary" : "text-merkao-danger"}>
                {movement.quantity > 0 ? "+" : ""}
                {movement.quantity}
              </strong>
            </div>
          ))}
          {selectedMovements.length === 0 ? <p className={ui.helperText}>Sin movimientos registrados.</p> : null}
        </div>
        {selectedProduct ? (
          <PaginationControls
            from={movementPagination.from}
            page={movementPagination.page}
            pageSize={movementPagination.limit}
            to={movementPagination.to}
            totalItems={movementPagination.total}
            totalPages={movementPagination.totalPages}
            onPageChange={onMovementPageChange}
            onPageSizeChange={onMovementPageSizeChange}
          />
        ) : null}
      </aside>
    </section>
  );
}
