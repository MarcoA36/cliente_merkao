import { ClipboardList, DollarSign, PackageCheck, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { Order, Product } from "../types";
import { money } from "../utils/format";

export function DashboardSummary({ products, orders }: { products: Product[]; orders: Order[] }) {
  const criticalStock = products.filter((product) => product.stock <= 5).length;
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const openRevenue = orders
    .filter((order) => order.status !== "DELIVERED" && order.status !== "CANCELLED")
    .reduce((sum, order) => sum + order.total, 0);
  const averageOrder = orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0;

  return (
    <section className="summaryGrid" aria-label="Resumen administrativo">
      <SummaryCard icon={<DollarSign />} label="Ventas abiertas" value={`$${money(openRevenue)}`} trend="+12%" tone="success" />
      <SummaryCard icon={<ClipboardList />} label="Pedidos pendientes" value={pendingOrders} trend="Atencion" tone="secondary" />
      <SummaryCard icon={<ShieldAlert />} label="Productos sin stock" value={criticalStock} trend="Critico" tone="danger" />
      <SummaryCard icon={<PackageCheck />} label="Ticket promedio" value={`$${money(averageOrder)}`} trend="+5.4%" tone="neutral" />
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  tone,
  trend,
  value
}: {
  icon: ReactNode;
  label: string;
  tone: "success" | "secondary" | "danger" | "neutral";
  trend: string;
  value: ReactNode;
}) {
  return (
    <article className={`summaryCard tone-${tone}`}>
      <div className="summaryTop">
        <span className="summaryIcon">{icon}</span>
        <span className="summaryTrend">{trend}</span>
      </div>
      <span className="summaryLabel">{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
