import { Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { EditableProduct } from "../adminTypes";
import type { Brand, Category, ProductInput } from "../types";

export function ProductDrawer({
  brands,
  categories,
  product,
  onClose,
  onSubmit
}: {
  brands: Brand[];
  categories: Category[];
  product: EditableProduct;
  onClose: () => void;
  onSubmit: (input: ProductInput) => void;
}) {
  const [draft, setDraft] = useState<ProductInput>({
    name: product.name,
    description: product.description,
    price: product.price,
    promotionalPrice: product.promotionalPrice ?? null,
    stock: product.stock,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    brandId: product.brandId
  });

  function setField<Key extends keyof ProductInput>(field: Key, value: ProductInput[Key]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit(draft);
  }

  return (
    <form className="drawer" onSubmit={submit}>
      <div className="panelHeader">
        <h3>{"id" in product && product.id ? "Editar producto" : "Nuevo producto"}</h3>
        <button type="button" className="iconButton" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <label>
        Nombre
        <input value={draft.name} onChange={(event) => setField("name", event.target.value)} required />
      </label>
      <label>
        Descripcion
        <textarea
          value={draft.description}
          onChange={(event) => setField("description", event.target.value)}
          required
        />
      </label>
      <div className="fieldGrid">
        <label>
          Precio base
          <input
            type="number"
            value={draft.price}
            onChange={(event) => setField("price", Number(event.target.value))}
            required
          />
        </label>
        <label>
          Precio promo
          <input
            type="number"
            value={draft.promotionalPrice ?? ""}
            onChange={(event) => setField("promotionalPrice", event.target.value ? Number(event.target.value) : null)}
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            value={draft.stock}
            onChange={(event) => setField("stock", Number(event.target.value))}
            required
          />
        </label>
      </div>
      <label>
        URL de imagen
        <input value={draft.imageUrl} onChange={(event) => setField("imageUrl", event.target.value)} required />
      </label>
      <div className="fieldGrid">
        <label>
          Categoria
          <select value={draft.categoryId} onChange={(event) => setField("categoryId", event.target.value)} required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Marca
          <select value={draft.brandId} onChange={(event) => setField("brandId", event.target.value)} required>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="primaryButton">
        <Save size={16} />
        Guardar
      </button>
    </form>
  );
}
