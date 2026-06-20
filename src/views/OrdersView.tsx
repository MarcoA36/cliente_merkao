import { Archive, Download } from "lucide-react";
import { nextStatus, statusLabels } from "../constants";
import type { Order } from "../types";
import * as ui from "../uiStyles";
import { money } from "../utils/format";

export function OrdersView({
  includeArchived,
  orders,
  onToggleArchived,
  onAdvance,
  onVoucher
}: {
  includeArchived: boolean;
  orders: Order[];
  onToggleArchived: (value: boolean) => void;
  onAdvance: (order: Order) => void;
  onVoucher: (order: Order) => void;
}) {
  return (
    <section className={ui.workArea}>
      <div className={ui.toolbar}>
        <label className={ui.checkLabel}>
          <input
            className={ui.checkbox}
            type="checkbox"
            checked={includeArchived}
            onChange={(event) => onToggleArchived(event.target.checked)}
          />
          Incluir entregados archivados
        </label>
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
              <tr key={order.id}>
                <td className={ui.td}>
                  <strong className={ui.tableStrong}>#{order.id.slice(-8)}</strong>
                  <span className={ui.subtle}>{new Date(order.createdAt).toLocaleString("es-AR")}</span>
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
                    <button className={ui.cn(ui.primaryButton, ui.smallButton)} onClick={() => onAdvance(order)}>
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
    </section>
  );
}
