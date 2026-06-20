import { Edit3, Filter, PackagePlus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import type { EditableProduct } from "../adminTypes";
import { ProductDrawer } from "../components/ProductDrawer";
import { emptyProduct } from "../constants";
import type { Brand, Category, Product, ProductInput } from "../types";
import * as ui from "../uiStyles";
import { money } from "../utils/format";

export function ProductsView({
  brands,
  categories,
  products,
  onCreate,
  onUpdate,
  onDelete
}: {
  brands: Brand[];
  categories: Category[];
  products: Product[];
  onCreate: (input: ProductInput) => void;
  onUpdate: (id: string, input: ProductInput) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<EditableProduct | null>(null);
  const [query, setQuery] = useState("");
  const filtered = products.filter((product) =>
    `${product.name} ${product.category.name} ${product.brand.name}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className={ui.workArea}>
      <div className={ui.toolbar}>
        <div>
          <h3 className={ui.toolbarMainTitle}>Productos publicados</h3>
          <p className={ui.toolbarMainText}>{filtered.length} resultados en catalogo</p>
        </div>
        <div className={ui.toolbarActions}>
          <div className={ui.searchBox}>
            <Search size={16} />
            <input
              className={ui.searchInput}
              placeholder="Filtrar por ID o producto..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button className={ui.secondaryButton}>
            <Filter size={15} />
            Filtros
          </button>
          <button className={ui.primaryButton} onClick={() => setEditing(blankProduct(categories, brands))}>
            <PackagePlus size={16} />
            Nuevo producto
          </button>
        </div>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th className={ui.th}>Producto</th>
              <th className={ui.th}>Categoria</th>
              <th className={ui.th}>Marca</th>
              <th className={ui.th}>Precio</th>
              <th className={ui.th}>Precio por cantidad</th>
              <th className={ui.th}>Stock</th>
              <th className={ui.th}>Estado</th>
              <th className={ui.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td className={ui.td}>
                  <div className={ui.productCell}>
                    <img className={ui.productImage} src={product.imageUrl} alt="" />
                    <div>
                      <strong className={ui.tableStrong}>{product.name}</strong>
                      <span className={ui.subtle}>{product.owner.name}</span>
                    </div>
                  </div>
                </td>
                <td className={ui.td}>{product.category.name}</td>
                <td className={ui.td}>{product.brand.name}</td>
                <td className={ui.td}>${money(product.price)}</td>
                <td className={ui.td}>
                  {product.quantityPrices?.length ? `${product.quantityPrices.length} rangos` : <span className={ui.subtle}>Configurable al editar</span>}
                </td>
                <td className={ui.td}>{product.stock}</td>
                <td className={ui.td}>
                  <span className={product.isActive ? ui.pillOk : ui.pillMuted}>
                    {product.isActive ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className={ui.cn(ui.td, ui.actions)}>
                  <button className={ui.iconButton} title="Editar" onClick={() => setEditing(product)}>
                    <Edit3 size={16} />
                  </button>
                  <button className={ui.dangerIconButton} title="Desactivar" onClick={() => onDelete(product.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing ? (
        <ProductDrawer
          brands={brands}
          categories={categories}
          product={editing}
          onClose={() => setEditing(null)}
          onSubmit={(input) => {
            if (editing.id) {
              onUpdate(editing.id, input);
            } else {
              onCreate(input);
            }
            setEditing(null);
          }}
        />
      ) : null}
    </section>
  );
}

function blankProduct(categories: Category[], brands: Brand[]) {
  return {
    ...emptyProduct,
    categoryId: categories[0]?.id ?? "",
    brandId: brands[0]?.id ?? ""
  };
}
