import { Archive, Download } from "lucide-react";
import { nextStatus, statusLabels } from "../constants";
import type { Order } from "../types";
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
    <section className="workArea">
      <div className="toolbar">
        <label className="checkLabel">
          <input
            type="checkbox"
            checked={includeArchived}
            onChange={(event) => onToggleArchived(event.target.checked)}
          />
          Incluir entregados archivados
        </label>
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Envio</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>#{order.id.slice(-8)}</strong>
                  <span className="subtle">{new Date(order.createdAt).toLocaleString("es-AR")}</span>
                </td>
                <td>
                  <strong>{order.addressSnapshot.recipientName}</strong>
                  <span className="subtle">
                    {order.addressSnapshot.street}, {order.addressSnapshot.city}
                  </span>
                </td>
                <td>
                  {order.items.slice(0, 2).map((item) => (
                    <span key={item.id} className="lineItem">
                      {item.quantity} x {item.productName}
                    </span>
                  ))}
                </td>
                <td>${money(order.total)}</td>
                <td>
                  <span className={`pill status-${order.status.toLowerCase()}`}>{statusLabels[order.status]}</span>
                </td>
                <td className="actions wide">
                  <button className="secondaryButton small" onClick={() => onVoucher(order)}>
                    <Download size={15} />
                    Voucher
                  </button>
                  {nextStatus[order.status] ? (
                    <button className="primaryButton small" onClick={() => onAdvance(order)}>
                      <Archive size={15} />
                      {statusLabels[nextStatus[order.status]!]}
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="emptyCell">
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
