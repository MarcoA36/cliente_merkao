import type { Section } from "../adminTypes";

export function sectionTitle(section: Section) {
  return {
    products: "Catalogo de productos",
    inventory: "Stock y precios",
    categories: "Categorias",
    brands: "Marcas",
    orders: "Pedidos"
  }[section];
}
