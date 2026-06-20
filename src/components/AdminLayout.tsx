import {
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Layers3,
  LogOut,
  Menu,
  PackagePlus,
  Plus,
  RefreshCw,
  Search,
  Tags,
  X
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Section } from "../adminTypes";
import type { User } from "../types";
import { initials } from "../utils/format";
import { sectionTitle } from "../utils/sections";
import { NavButton } from "./NavButton";

export function AdminLayout({
  children,
  loading,
  onLogout,
  onRefresh,
  onSelectSection,
  section,
  user
}: {
  children: ReactNode;
  loading: boolean;
  onLogout: () => void;
  onRefresh: () => void;
  onSelectSection: (section: Section) => void;
  section: Section;
  user: User;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function selectSection(nextSection: Section) {
    onSelectSection(nextSection);
    setMobileNavOpen(false);
  }

  return (
    <div className="shell">
      <header className="mobileHeader">
        <button className="iconButton" aria-label="Abrir menu" onClick={() => setMobileNavOpen(true)}>
          <Menu size={19} />
        </button>
        <strong>MarketAdmin</strong>
        <div className="mobileHeaderActions">
          <button className="iconButton" aria-label="Buscar">
            <Search size={17} />
          </button>
          <div className="avatarBadge">{initials(user.name)}</div>
        </div>
      </header>

      <button
        className={mobileNavOpen ? "drawerOverlay open" : "drawerOverlay"}
        aria-label="Cerrar menu"
        onClick={() => setMobileNavOpen(false)}
      />

      <aside className={mobileNavOpen ? "sidebar open" : "sidebar"}>
        <div className="brandBlock">
          <div className="brandMark">
            <Boxes size={18} />
          </div>
          <div>
            <h1>MarketAdmin</h1>
            <p>Management Portal</p>
          </div>
          <button className="iconButton drawerClose" aria-label="Cerrar menu" onClick={() => setMobileNavOpen(false)}>
            <X size={17} />
          </button>
        </div>

        <nav className="nav">
          <NavButton icon={<Boxes />} active={section === "products"} onClick={() => selectSection("products")}>
            Productos
          </NavButton>
          <NavButton icon={<PackagePlus />} active={section === "inventory"} onClick={() => selectSection("inventory")}>
            Inventario
          </NavButton>
          <NavButton icon={<Layers3 />} active={section === "categories"} onClick={() => selectSection("categories")}>
            Categorias
          </NavButton>
          <NavButton icon={<Tags />} active={section === "brands"} onClick={() => selectSection("brands")}>
            Marcas
          </NavButton>
          <NavButton icon={<ClipboardList />} active={section === "orders"} onClick={() => selectSection("orders")}>
            Pedidos
          </NavButton>
        </nav>

        <div className="userBox">
          <div className="avatarBadge large">{initials(user.name)}</div>
          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button className="ghostButton" onClick={onLogout}>
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topSearch">
            <Search size={17} />
            <input placeholder="Buscar pedidos, productos o clientes..." />
          </div>
          <div className="topbarActions">
            <button className="iconButton notificationButton" aria-label="Notificaciones">
              <Bell size={17} />
              <span />
            </button>
            <button className="profileButton">
              Admin Profile
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <section className="pageHeader">
          <div>
            <h2>Panel de Control</h2>
            <p>
              Bienvenido de nuevo, {user.name}. Vista actual: {sectionTitle(section)}.
            </p>
          </div>
          <div className="pageActions">
            <button className="secondaryButton iconOnly" aria-label="Calendario">
              <CalendarDays size={16} />
            </button>
            <button className="secondaryButton iconOnly" aria-label="Actualizar" onClick={onRefresh} disabled={loading}>
              <RefreshCw size={16} />
            </button>
            <button className="primaryButton" onClick={() => selectSection("products")}>
              <Plus size={16} />
              Nuevo Producto
            </button>
          </div>
        </section>

        {children}
      </main>

      <nav className="bottomBar" aria-label="Navegacion principal">
        <button className={section === "products" ? "active" : ""} onClick={() => selectSection("products")}>
          <Boxes size={19} />
          <span>Home</span>
        </button>
        <button className={section === "inventory" ? "active" : ""} onClick={() => selectSection("inventory")}>
          <PackagePlus size={19} />
          <span>Stock</span>
        </button>
        <button className={section === "orders" ? "active" : ""} onClick={() => selectSection("orders")}>
          <ClipboardList size={19} />
          <span>Orders</span>
        </button>
        <button
          className={section === "categories" || section === "brands" ? "active" : ""}
          onClick={() => selectSection("categories")}
        >
          <BarChart3 size={19} />
          <span>Stats</span>
        </button>
      </nav>
    </div>
  );
}
