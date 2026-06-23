import {
  BarChart3,
  BadgePercent,
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
import * as ui from "../uiStyles";
import { initials } from "../utils/format";
import { sectionDescription, sectionTitle } from "../utils/sections";
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
    <div className={ui.shell}>
      <header className={ui.mobileHeader}>
        <button className={ui.iconButton} aria-label="Abrir menu" onClick={() => setMobileNavOpen(true)}>
          <Menu size={19} />
        </button>
        <strong className={ui.mobileHeaderTitle}>Merkao Admin</strong>
        <div className={ui.mobileHeaderActions}>
          <button className={ui.iconButton} aria-label="Buscar">
            <Search size={17} />
          </button>
          <div className={ui.avatarBadge}>{initials(user.name)}</div>
        </div>
      </header>

      <button
        className={ui.cn(ui.drawerOverlayBase, mobileNavOpen ? ui.drawerOverlayOpen : ui.drawerOverlayClosed)}
        aria-label="Cerrar menu"
        onClick={() => setMobileNavOpen(false)}
      />

      <aside className={ui.cn(ui.sidebarBase, mobileNavOpen ? ui.sidebarOpen : ui.sidebarClosed)}>
        <div className={ui.brandBlock}>
          <div className={ui.brandMark}>
            <Boxes size={18} />
          </div>
          <div>
            <h1 className={ui.brandTitle}>Merkao Admin</h1>
            <p className={ui.brandSubtitle}>Operational CMS</p>
          </div>
          <button className={ui.cn(ui.iconButton, ui.drawerClose)} aria-label="Cerrar menu" onClick={() => setMobileNavOpen(false)}>
            <X size={17} />
          </button>
        </div>

        <nav className={ui.nav}>
          <NavButton icon={<ClipboardList />} active={section === "orders"} onClick={() => selectSection("orders")}>
            Pedidos
          </NavButton>
          <NavButton icon={<Boxes />} active={section === "products"} onClick={() => selectSection("products")}>
            Productos
          </NavButton>
          <NavButton icon={<BadgePercent />} active={section === "promotions"} onClick={() => selectSection("promotions")}>
            Promociones
          </NavButton>
          {/* <NavButton icon={<PackagePlus />} active={section === "inventory"} onClick={() => selectSection("inventory")}>
            Inventario
          </NavButton> */}
          <NavButton icon={<Layers3 />} active={section === "categories"} onClick={() => selectSection("categories")}>
            Categorias
          </NavButton>
          <NavButton icon={<Tags />} active={section === "brands"} onClick={() => selectSection("brands")}>
            Marcas
          </NavButton>
        </nav>

        <div className={ui.userBox}>
          <div className={ui.avatarBadgeLarge}>{initials(user.name)}</div>
          <div>
            <strong className={ui.userName}>{user.name}</strong>
            <span className={ui.userEmail}>{user.email}</span>
          </div>
          <button className={ui.ghostButton} onClick={onLogout}>
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </aside>

      <main className={ui.main}>
        <header className={ui.topbar}>
          <div className={ui.topSearch}>
            <Search size={17} />
            <input className={ui.searchInput} placeholder="Buscar pedidos, productos o clientes..." />
          </div>
          <div className={ui.topbarActions}>
            <button className={ui.cn(ui.iconButton, ui.notificationButton)} aria-label="Notificaciones">
              <Bell size={17} />
              <span className={ui.notificationDot} />
            </button>
            <button className={ui.profileButton}>
              Admin Profile
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <section className={ui.pageHeader}>
          <div>
            <h2 className={ui.pageTitle}>{sectionTitle(section)}</h2>
            <p className={ui.pageSubtitle}>{sectionDescription(section, user.name)}</p>
          </div>
          <div className={ui.pageActions}>
            <button className={ui.secondaryIconButton} aria-label="Calendario">
              <CalendarDays size={16} />
            </button>
            <button className={ui.secondaryIconButton} aria-label="Actualizar" onClick={onRefresh} disabled={loading}>
              <RefreshCw size={16} />
            </button>
            {/* <button className={ui.primaryButton} onClick={() => selectSection("products")}>
              <Plus size={16} />
              Nuevo Producto
            </button> */}
          </div>
        </section>

        {children}
      </main>

      <nav className={ui.bottomBar} aria-label="Navegacion principal">
        <button
          className={ui.cn(ui.bottomBarButton, section === "orders" && ui.bottomBarButtonActive)}
          onClick={() => selectSection("orders")}
        >
          <ClipboardList size={19} />
          <span>Pedidos</span>
        </button>
        <button
          className={ui.cn(ui.bottomBarButton, section === "products" && ui.bottomBarButtonActive)}
          onClick={() => selectSection("products")}
        >
          <Boxes size={19} />
          <span>Productos</span>
        </button>
        <button
          className={ui.cn(ui.bottomBarButton, section === "promotions" && ui.bottomBarButtonActive)}
          onClick={() => selectSection("promotions")}
        >
          <BadgePercent size={19} />
          <span>Promos</span>
        </button>
        {/* <button
          className={ui.cn(
            ui.bottomBarButton,
            (section === "inventory" || section === "categories" || section === "brands") && ui.bottomBarButtonActive
          )}
          onClick={() => selectSection("inventory")}
        >
          <BarChart3 size={19} />
          <span>Gestion</span>
        </button> */}
      </nav>
    </div>
  );
}
