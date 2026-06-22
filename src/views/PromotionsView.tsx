import { BadgePercent, Edit3, PackagePlus, Power, Save, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { PaginationMeta, PromotionDraft, PromotionPriority } from "../adminTypes";
import { PaginationControls } from "../components/PaginationControls";
import type { Product } from "../types";
import * as ui from "../uiStyles";
import { money } from "../utils/format";

const priorityLabels: Record<PromotionPriority, string> = {
  featured: "Destacada",
  normal: "Normal",
  secondary: "Secundaria"
};

const emptyPromotion: PromotionDraft = {
  id: "",
  name: "",
  productIds: [],
  startsAt: "",
  endsAt: "",
  promotionalPrice: 0,
  promotionalStock: 20,
  active: true,
  priority: "normal"
};

export function PromotionsView({
  kindFilter,
  pagination,
  products,
  promotions,
  onKindFilterChange,
  onPageChange,
  onPageSizeChange,
  onCreate,
  onUpdate,
  onToggleStatus,
  onDelete
}: {
  kindFilter: "all" | "individual" | "combo";
  pagination: PaginationMeta;
  products: Product[];
  promotions: PromotionDraft[];
  onKindFilterChange: (kind: "all" | "individual" | "combo") => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onCreate: (input: PromotionDraft) => void;
  onUpdate: (id: string, input: PromotionDraft) => void;
  onToggleStatus: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<PromotionDraft | null>(null);
  const [draft, setDraft] = useState<PromotionDraft>(emptyPromotion);

  function beginEdit(promotion?: PromotionDraft) {
    setEditing(promotion ?? emptyPromotion);
    setDraft(promotion ?? { ...emptyPromotion, id: `promotion-${Date.now()}` });
  }

  function save(event: FormEvent) {
    event.preventDefault();

    if (editing?.id) {
      onUpdate(editing.id, draft);
    } else {
      onCreate(draft);
    }
    setEditing(null);
    setDraft(emptyPromotion);
  }

  function toggleProduct(productId: string) {
    setDraft((current) => ({
      ...current,
      productIds: current.productIds.includes(productId)
        ? current.productIds.filter((id) => id !== productId)
        : [...current.productIds, productId]
    }));
  }

  function productNames(promotion: PromotionDraft) {
    if (promotion.products?.length) {
      return promotion.products.map((product) => product.name).join(" + ");
    }

    return promotion.productIds
      .map((id) => products.find((product) => product.id === id)?.name)
      .filter(Boolean)
      .join(" + ");
  }

  return (
    <section className={ui.workAreaSplit}>
      <div>
        <div className={ui.toolbar}>
          <div>
            <h3 className={ui.toolbarMainTitle}>Promociones y combos</h3>
            <p className={ui.toolbarMainText}>{pagination.total} promociones visibles</p>
          </div>
          <div className={ui.toolbarActions}>
            <select
              className={ui.fieldInput}
              value={kindFilter}
              onChange={(event) => onKindFilterChange(event.target.value as typeof kindFilter)}
            >
              <option value="all">Todas</option>
              <option value="individual">Individuales</option>
              <option value="combo">Combos</option>
            </select>
            <button className={ui.primaryButton} onClick={() => beginEdit()}>
              <PackagePlus size={16} />
              Nueva promocion
            </button>
          </div>
        </div>

        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Promocion</th>
                <th className={ui.th}>Productos</th>
                <th className={ui.th}>Vigencia</th>
                <th className={ui.th}>Precio</th>
                <th className={ui.th}>Stock</th>
                <th className={ui.th}>Visibilidad</th>
                <th className={ui.th}>Estado</th>
                <th className={ui.th}></th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td className={ui.td}>
                    <strong className={ui.tableStrong}>{promotion.name}</strong>
                    <span className={ui.subtle}>{promotion.productIds.length > 1 ? "Combo" : "Individual"}</span>
                  </td>
                  <td className={ui.td}>{productNames(promotion) || "-"}</td>
                  <td className={ui.td}>
                    <strong className={ui.tableStrong}>{promotion.startsAt || "Sin inicio"}</strong>
                    <span className={ui.subtle}>{promotion.endsAt || "Sin fin"}</span>
                  </td>
                  <td className={ui.td}>${money(promotion.promotionalPrice)}</td>
                  <td className={ui.td}>{promotion.promotionalStock}</td>
                  <td className={ui.td}>
                    <span className={ui.pillSecondary}>{priorityLabels[promotion.priority]}</span>
                  </td>
                  <td className={ui.td}>
                    <span className={promotion.active ? ui.pillOk : ui.pillMuted}>{promotion.active ? "Activa" : "Inactiva"}</span>
                  </td>
                  <td className={ui.cn(ui.td, ui.actions)}>
                    <button
                      className={ui.iconButton}
                      title={promotion.active ? "Desactivar" : "Activar"}
                      onClick={() => onToggleStatus(promotion.id, !promotion.active)}
                    >
                      <Power size={16} />
                    </button>
                    <button className={ui.iconButton} title="Editar" onClick={() => beginEdit(promotion)}>
                      <Edit3 size={16} />
                    </button>
                    <button className={ui.dangerIconButton} title="Eliminar" onClick={() => onDelete(promotion.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {promotions.length === 0 ? (
                <tr>
                  <td className={ui.emptyCell} colSpan={8}>
                    Todavia no hay promociones configuradas.
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

      {editing ? (
        <form className={ui.sidePanel} onSubmit={save}>
          <div>
            <h3 className={ui.panelTitle}>{editing.id ? "Editar promocion" : "Nueva promocion"}</h3>
            <p className={ui.helperText}>Selecciona uno o varios productos para crear promos individuales o combos.</p>
          </div>
          <label className={ui.fieldLabel}>
            Nombre
            <input className={ui.fieldInput} value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <div className={ui.promoProductList}>
            {products.map((product) => (
              <label className={ui.checkLabel} key={product.id}>
                <input className={ui.checkbox} type="checkbox" checked={draft.productIds.includes(product.id)} onChange={() => toggleProduct(product.id)} />
                {product.name}
              </label>
            ))}
          </div>
          <div className={ui.fieldGrid}>
            <label className={ui.fieldLabel}>
              Fecha desde
              <input className={ui.fieldInput} type="date" value={draft.startsAt} onChange={(event) => setDraft((current) => ({ ...current, startsAt: event.target.value }))} />
            </label>
            <label className={ui.fieldLabel}>
              Fecha hasta
              <input className={ui.fieldInput} type="date" value={draft.endsAt} onChange={(event) => setDraft((current) => ({ ...current, endsAt: event.target.value }))} />
            </label>
          </div>
          <div className={ui.fieldGrid}>
            <label className={ui.fieldLabel}>
              Precio promocional
              <input className={ui.fieldInput} type="number" value={draft.promotionalPrice} onChange={(event) => setDraft((current) => ({ ...current, promotionalPrice: Number(event.target.value) }))} required />
            </label>
            <label className={ui.fieldLabel}>
              Stock promocional
              <input className={ui.fieldInput} type="number" value={draft.promotionalStock} onChange={(event) => setDraft((current) => ({ ...current, promotionalStock: Number(event.target.value) }))} required />
            </label>
          </div>
          <label className={ui.fieldLabel}>
            Visibilidad
            <select className={ui.fieldInput} value={draft.priority} onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value as PromotionPriority }))}>
              <option value="featured">Destacada</option>
              <option value="normal">Normal</option>
              <option value="secondary">Secundaria</option>
            </select>
          </label>
          <label className={ui.checkLabel}>
            <input className={ui.checkbox} type="checkbox" checked={draft.active} onChange={(event) => setDraft((current) => ({ ...current, active: event.target.checked }))} />
            Promocion activa
          </label>
          <button className={ui.primaryButton} disabled={draft.productIds.length === 0}>
            <Save size={16} />
            Guardar promocion
          </button>
        </form>
      ) : (
        <aside className={ui.sidePanel}>
          <BadgePercent size={22} />
          <h3 className={ui.panelTitle}>Promos separadas del producto</h3>
          <p className={ui.helperText}>
            Las promociones se configuran aparte y pueden usar uno o varios productos, tal como pide el nuevo flujo del CMS.
          </p>
        </aside>
      )}
    </section>
  );
}
