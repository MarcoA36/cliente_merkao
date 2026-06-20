import { BarChart3, ClipboardList, ShieldAlert, SlidersHorizontal } from "lucide-react";
import { statusLabels } from "../constants";
import type { Order, Product } from "../types";
import { money } from "../utils/format";

export function OperationalRail({
  onInventory,
  orders,
  products
}: {
  onInventory: () => void;
  orders: Order[];
  products: Product[];
}) {
  const lowStock = [...products].sort((first, second) => first.stock - second.stock).slice(0, 5);
  const latestOrders = orders.slice(0, 3);
  const activityBars = [46, 56, 42, 68, 84, 58, 52];

  return (
    <aside className="operationalRail" aria-label="Bajo stock y actividad">
      <section className="railCard">
        <div className="railHeader">
          <h3>
            <ShieldAlert size={17} />
            Bajo Stock
          </h3>
          <span className="alertBadge">{lowStock.length} alerts</span>
        </div>
        <div className="railList">
          {lowStock.map((product) => (
            <article className="stockItem" key={product.id}>
              <img src={product.imageUrl} alt="" />
              <div>
                <strong>{product.name}</strong>
                <span>{product.category.name}</span>
              </div>
              <b>{product.stock} ud.</b>
            </article>
          ))}
          {lowStock.length === 0 ? <p className="railEmpty">Sin alertas de inventario.</p> : null}
        </div>
        <button className="replenishButton" onClick={onInventory}>
          Reabastecer Todo
        </button>
      </section>

      <section className="railCard">
        <div className="railHeader">
          <h3>
            <BarChart3 size={17} />
            Actividad del Sitio
          </h3>
          <button className="iconButton" aria-label="Opciones">
            <SlidersHorizontal size={15} />
          </button>
        </div>
        <div className="activityChart" aria-hidden="true">
          {activityBars.map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="activityLabels">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mie</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sab</span>
          <span>Dom</span>
        </div>
      </section>

      <section className="railCard mobileOrdersCard">
        <div className="railHeader">
          <h3>
            <ClipboardList size={17} />
            Pedidos Recientes
          </h3>
        </div>
        <div className="orderCards">
          {latestOrders.map((order) => (
            <article className="orderCard" key={order.id}>
              <div>
                <strong>#{order.id.slice(-8)}</strong>
                <span>{order.addressSnapshot.recipientName}</span>
              </div>
              <div>
                <strong>${money(order.total)}</strong>
                <span className={`pill status-${order.status.toLowerCase()}`}>{statusLabels[order.status]}</span>
              </div>
            </article>
          ))}
          {latestOrders.length === 0 ? <p className="railEmpty">Todavia no hay pedidos.</p> : null}
        </div>
      </section>
    </aside>
  );
}
