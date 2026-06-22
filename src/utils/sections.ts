import type { Section } from "../adminTypes";

export function sectionTitle(section: Section) {
  return {
    orders: "Pedidos",
    products: "Productos",
    promotions: "Promociones y combos",
    inventory: "Stock y precios",
    categories: "Categorias",
    brands: "Marcas"
  }[section];
}

export function sectionDescription(section: Section, userName: string) {
  return {
    orders: `Gestiona pedidos y vouchers. Sesion de ${userName}.`,
    products: "Administra catalogo, precios por cantidad y visibilidad.",
    promotions: "Configura promociones, combos y prioridad comercial.",
    inventory: "Actualiza stock y precios operativos de productos.",
    categories: "Organiza categorias y rubros del catalogo.",
    brands: "Mantiene marcas publicadas para la tienda."
  }[section];
}
