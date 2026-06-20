import { Edit3, Filter, PackagePlus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import type { EditableProduct } from "../adminTypes";
import { ProductDrawer } from "../components/ProductDrawer";
import { emptyProduct } from "../constants";
import type { Brand, Category, Product, ProductInput } from "../types";
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
    <section className="workArea">
      <div className="toolbar">
        <div className="toolbarMain">
          <h3>Productos publicados</h3>
          <p>{filtered.length} resultados en catalogo</p>
        </div>
        <div className="toolbarActions">
          <div className="searchBox">
            <Search size={16} />
            <input placeholder="Filtrar por ID o producto..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <button className="secondaryButton">
            <Filter size={15} />
            Filtros
          </button>
          <button className="primaryButton" onClick={() => setEditing(blankProduct(categories, brands))}>
            <PackagePlus size={16} />
            Nuevo producto
          </button>
        </div>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Promo</th>
              <th>Stock</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="productCell">
                    <img src={product.imageUrl} alt="" />
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.owner.name}</span>
                    </div>
                  </div>
                </td>
                <td>{product.category.name}</td>
                <td>{product.brand.name}</td>
                <td>${money(product.price)}</td>
                <td>{product.promotionalPrice ? `$${money(product.promotionalPrice)}` : "-"}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={product.isActive ? "pill ok" : "pill muted"}>
                    {product.isActive ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className="actions">
                  <button className="iconButton" title="Editar" onClick={() => setEditing(product)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="iconButton danger" title="Desactivar" onClick={() => onDelete(product.id)}>
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
