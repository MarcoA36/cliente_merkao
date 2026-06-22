import { Archive, Ban, Download, Search } from "lucide-react";
import { useState } from "react";
import type { PaginationMeta } from "../adminTypes";
import { PaginationControls } from "../components/PaginationControls";
import { nextStatus, statusLabels } from "../constants";
import type { Order, OrderStatus } from "../types";
import * as ui from "../uiStyles";
import { money } from "../utils/format";

const statusOptions: Array<"ALL" | OrderStatus> = ["ALL", "PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED", "CANCELLED"];

export function OrdersView({
  date,
  includeArchived,
  orders,
  pagination,
  query,
  status,
  onDateChange,
  onPageChange,
  onPageSizeChange,
  onQueryChange,
  onStatusChange,
  onToggleArchived,
  onChangeStatus,
  onVoucher
}: {
  date: string;
  includeArchived: boolean;
  orders: Order[];
  pagination: PaginationMeta;
  query: string;
  status: "ALL" | OrderStatus;
  onDateChange: (date: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: "ALL" | OrderStatus) => void;
  onToggleArchived: (value: boolean) => void;
  onChangeStatus: (order: Order, status: OrderStatus, notes?: string) => void;
  onVoucher: (order: Order) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(orders[0]?.id ?? null);
  const [notes, setNotes] = useState("");

  const selectedOrder = orders.find((order) => order.id === selectedId) ?? orders[0] ?? null;
  const canCancel = selectedOrder?.status === "PENDING" || selectedOrder?.status === "PREPARING";
  const next = selectedOrder ? nextStatus[selectedOrder.status] : undefined;

  function changeStatus(order: Order, nextOrderStatus: OrderStatus) {
    onChangeStatus(order, nextOrderStatus, notes.trim() || undefined);
    setNotes("");
  }

  return (
    <section className={ui.workAreaSplit}>
      <div className={ui.workArea}>
        <div className={ui.toolbar}>
          <div>
            <h3 className={ui.toolbarMainTitle}>Pedidos recientes</h3>
            <p className={ui.toolbarMainText}>{pagination.total} pedidos visibles</p>
          </div>
          <div className={ui.toolbarActions}>
            <div className={ui.searchBox}>
              <Search size={16} />
              <input
                className={ui.searchInput}
                placeholder="Buscar pedido, cliente o producto"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
              />
            </div>
            <select
              className={ui.fieldInput}
              value={status}
              onChange={(event) => onStatusChange(event.target.value as "ALL" | OrderStatus)}
            >
              <option value="ALL">Todos</option>
              {statusOptions
                .filter((option) => option !== "ALL")
                .map((option) => (
                  <option key={option} value={option}>
                    {statusLabels[option]}
                  </option>
                ))}
            </select>
            <input
              className={ui.fieldInput}
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
            />
            <label className={ui.checkLabel}>
              <input
                className={ui.checkbox}
                type="checkbox"
                checked={includeArchived}
                onChange={(event) => onToggleArchived(event.target.checked)}
              />
              Archivados
            </label>
          </div>
        </div>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Pedido</th>
                <th className={ui.th}>Envio</th>
                <th className={ui.th}>Items</th>
                <th className={ui.th}>Total</th>
                <th className={ui.th}>Estado</th>
                <th className={ui.th}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={selectedOrder?.id === order.id ? "bg-merkao-primarySoft/40" : ""}>
                  <td className={ui.td}>
                    <button className="border-0 bg-transparent p-0 text-left" onClick={() => setSelectedId(order.id)}>
                      <strong className={ui.tableStrong}>#{order.id.slice(-8)}</strong>
                      <span className={ui.subtle}>{formatDate(order.createdAt)}</span>
                    </button>
                  </td>
                  <td className={ui.td}>
                    <strong className={ui.tableStrong}>{order.addressSnapshot.recipientName}</strong>
                    <span className={ui.subtle}>
                      {order.addressSnapshot.street}, {order.addressSnapshot.city}
                    </span>
                  </td>
                  <td className={ui.td}>
                    {order.items.slice(0, 2).map((item) => (
                      <span key={item.id} className={ui.lineItem}>
                        {item.quantity} x {item.productName}
                      </span>
                    ))}
                    {order.items.length > 2 ? <span className={ui.subtle}>+{order.items.length - 2} mas</span> : null}
                  </td>
                  <td className={ui.td}>${money(order.total)}</td>
                  <td className={ui.td}>
                    <span className={ui.statusPill(order.status)}>{statusLabels[order.status]}</span>
                  </td>
                  <td className={ui.cn(ui.td, ui.actionsWide)}>
                    <button className={ui.cn(ui.secondaryButton, ui.smallButton)} onClick={() => onVoucher(order)}>
                      <Download size={15} />
                      Voucher
                    </button>
                    {nextStatus[order.status] ? (
                      <button className={ui.cn(ui.primaryButton, ui.smallButton)} onClick={() => changeStatus(order, nextStatus[order.status]!)}>
                        <Archive size={15} />
                        {statusLabels[nextStatus[order.status]!]}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className={ui.emptyCell}>
                    No hay pedidos para mostrar.
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
        {selectedOrder ? (
          <>
            <div className={ui.panelHeader}>
              <div>
                <h3 className={ui.panelTitle}>#{selectedOrder.id.slice(-8)}</h3>
                <p className={ui.helperText}>{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <span className={ui.statusPill(selectedOrder.status)}>{statusLabels[selectedOrder.status]}</span>
            </div>

            <div className={ui.listPanel}>
              <strong className={ui.tableStrong}>{selectedOrder.addressSnapshot.recipientName}</strong>
              <span className={ui.subtle}>{selectedOrder.addressSnapshot.phone}</span>
              <span className={ui.subtle}>
                {selectedOrder.addressSnapshot.street}, {selectedOrder.addressSnapshot.city}, {selectedOrder.addressSnapshot.province}
              </span>
            </div>

            <div className={ui.listPanel}>
              {selectedOrder.items.map((item) => (
                <div className={ui.listRow} key={item.id}>
                  <div>
                    <strong className={ui.tableStrong}>{item.productName}</strong>
                    <span className={ui.subtle}>
                      {item.quantity} x ${money(item.unitPrice)}
                    </span>
                  </div>
                  <strong>${money(item.lineTotal)}</strong>
                </div>
              ))}
              <div className={ui.listRow}>
                <strong>Total</strong>
                <strong>${money(selectedOrder.total)}</strong>
              </div>
            </div>

            {selectedOrder.promotionUsages?.length ? (
              <div className={ui.listPanel}>
                {selectedOrder.promotionUsages.map((usage) => (
                  <div className={ui.listRow} key={usage.id}>
                    <div>
                      <strong className={ui.tableStrong}>{usage.promotionName}</strong>
                      <span className={ui.subtle}>{usage.quantity} usos</span>
                    </div>
                    <span>${money(usage.promotionalPrice)}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className={ui.listPanel}>
              {(selectedOrder.statusHistory?.length ? selectedOrder.statusHistory : fallbackHistory(selectedOrder)).map((entry) => (
                <div className={ui.timelineItem} key={entry.id}>
                  <span className={ui.timelineDot} />
                  <div>
                    <strong className={ui.tableStrong}>{statusLabels[entry.status]}</strong>
                    <span className={ui.subtle}>{formatDate(entry.createdAt)}</span>
                    {entry.changedBy?.name ? <span className={ui.subtle}>{entry.changedBy.name}</span> : null}
                    {entry.notes ? <p className={ui.helperText}>{entry.notes}</p> : null}
                  </div>
                </div>
              ))}
            </div>

            <label className={ui.fieldLabel}>
              Observacion
              <textarea className={ui.fieldTextarea} value={notes} onChange={(event) => setNotes(event.target.value)} />
            </label>

            <div className={ui.actionsWide}>
              <button className={ui.cn(ui.secondaryButton, ui.smallButton)} onClick={() => onVoucher(selectedOrder)}>
                <Download size={15} />
                Voucher
              </button>
              {canCancel ? (
                <button className={ui.cn(ui.secondaryButton, ui.smallButton)} onClick={() => changeStatus(selectedOrder, "CANCELLED")}>
                  <Ban size={15} />
                  Cancelar
                </button>
              ) : null}
              {next ? (
                <button className={ui.cn(ui.primaryButton, ui.smallButton)} onClick={() => changeStatus(selectedOrder, next)}>
                  <Archive size={15} />
                  {statusLabels[next]}
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <p className={ui.helperText}>Sin pedido seleccionado.</p>
        )}
      </aside>
    </section>
  );
}

function fallbackHistory(order: Order) {
  return [
    {
      id: `${order.id}-current`,
      orderId: order.id,
      status: order.status,
      notes: null,
      createdAt: order.updatedAt,
      changedBy: null
    }
  ];
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-AR");
}
