import { BarChart3, ClipboardList, ShieldAlert, SlidersHorizontal } from "lucide-react";
import { statusLabels } from "../constants";
import type { Order, Product } from "../types";
import * as ui from "../uiStyles";
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
  const activityBars = ["h-[46%]", "h-[56%]", "h-[42%]", "h-[68%]", "h-[84%]", "h-[58%]", "h-[52%]"];

  return (
    <aside className={ui.operationalRail} aria-label="Bajo stock y actividad">
      <section className={ui.railCard}>
        <div className={ui.railHeader}>
          <h3 className={ui.railHeaderTitle}>
            <ShieldAlert size={17} />
            Bajo Stock
          </h3>
          <span className={ui.alertBadge}>{lowStock.length} alerts</span>
        </div>
        <div className={ui.railList}>
          {lowStock.map((product) => (
            <article className={ui.stockItem} key={product.id}>
              <img className={ui.stockImage} src={product.imageUrl} alt="" />
              <div>
                <strong className={ui.stockName}>{product.name}</strong>
                <span className={ui.stockMeta}>{product.category.name}</span>
              </div>
              <b className={ui.stockCount}>{product.stock} ud.</b>
            </article>
          ))}
          {lowStock.length === 0 ? <p className={ui.railEmpty}>Sin alertas de inventario.</p> : null}
        </div>
        <button className={ui.replenishButton} onClick={onInventory}>
          Reabastecer Todo
        </button>
      </section>

      <section className={ui.railCard}>
        <div className={ui.railHeader}>
          <h3 className={ui.railHeaderTitle}>
            <BarChart3 size={17} />
            Actividad del Sitio
          </h3>
          <button className={ui.iconButton} aria-label="Opciones">
            <SlidersHorizontal size={15} />
          </button>
        </div>
        <div className={ui.activityChart} aria-hidden="true">
          {activityBars.map((heightClass, index) => (
            <span key={heightClass} className={ui.cn(index === 4 ? ui.activityBarActive : ui.activityBar, heightClass)} />
          ))}
        </div>
        <div className={ui.activityLabels}>
          <span>Lun</span>
          <span>Mar</span>
          <span>Mie</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sab</span>
          <span>Dom</span>
        </div>
      </section>

      <section className={ui.mobileOrdersCard}>
        <div className={ui.railHeader}>
          <h3 className={ui.railHeaderTitle}>
            <ClipboardList size={17} />
            Pedidos Recientes
          </h3>
        </div>
        <div className={ui.orderCards}>
          {latestOrders.map((order) => (
            <article className={ui.orderCard} key={order.id}>
              <div>
                <strong className={ui.tableStrong}>#{order.id.slice(-8)}</strong>
                <span className={ui.orderCardMeta}>{order.addressSnapshot.recipientName}</span>
              </div>
              <div>
                <strong className={ui.tableStrong}>${money(order.total)}</strong>
                <span className={ui.statusPill(order.status)}>{statusLabels[order.status]}</span>
              </div>
            </article>
          ))}
          {latestOrders.length === 0 ? <p className={ui.railEmpty}>Todavia no hay pedidos.</p> : null}
        </div>
      </section>
    </aside>
  );
}
