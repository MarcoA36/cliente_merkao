import type { Section } from "../adminTypes";

export function sectionTitle(section: Section) {
  return {
    orders: "Pedidos",
    products: "Catalogo de productos",
    promotions: "Promociones y combos",
    inventory: "Stock y precios",
    categories: "Categorias",
    brands: "Marcas"
  }[section];
}
