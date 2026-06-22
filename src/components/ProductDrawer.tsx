import { ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { EditableProduct, QuantityPriceRange } from "../adminTypes";
import type { Brand, Category, ProductInput } from "../types";
import * as ui from "../uiStyles";

const maxImageBytes = 700 * 1024;

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
    quantityPrices: "quantityPrices" in product && product.quantityPrices?.length
      ? product.quantityPrices
      : [{ id: "range-1", from: 1, to: 5, price: product.price || 0 }],
    stock: product.stock,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    brandId: product.brandId
  });
  const [imageError, setImageError] = useState("");

  function setField<Key extends keyof ProductInput>(field: Key, value: ProductInput[Key]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function setRange(id: string, field: keyof Omit<QuantityPriceRange, "id">, value: number | null) {
    setDraft((current) => ({
      ...current,
      quantityPrices: (current.quantityPrices ?? []).map((range) => (range.id === id ? { ...range, [field]: value } : range))
    }));
  }

  function addRange() {
    setDraft((current) => ({
      ...current,
      quantityPrices: [
        ...(current.quantityPrices ?? []),
        {
          id: `range-${Date.now()}`,
          from: nextRangeStart(current.quantityPrices),
          to: null,
          price: current.price
        }
      ]
    }));
  }

  function removeRange(id: string) {
    setDraft((current) => ({
      ...current,
      quantityPrices:
        current.quantityPrices && current.quantityPrices.length > 1
          ? current.quantityPrices.filter((range) => range.id !== id)
          : current.quantityPrices
    }));
  }

  function uploadLocalImage(file: File | undefined) {
    if (!file) return;

    setImageError("");
    if (!file.type.startsWith("image/")) {
      setImageError("Usa una imagen valida.");
      return;
    }
    if (file.size > maxImageBytes) {
      setImageError("La imagen debe pesar menos de 700 KB para mobile.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setDraft((current) => ({ ...current, imageUrl: result, localImageName: file.name }));
      }
    };
    reader.readAsDataURL(file);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit(draft);
  }

  return (
    <>
      <button type="button" className={ui.modalOverlay} aria-label="Cerrar editor de producto" onClick={onClose} />
      <form className={ui.drawer} onSubmit={submit}>
      <div className={ui.panelHeader}>
        <h3 className={ui.panelTitle}>{"id" in product && product.id ? "Editar producto" : "Nuevo producto"}</h3>
        <button type="button" className={ui.iconButton} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <label className={ui.fieldLabel}>
        Nombre
        <input className={ui.fieldInput} value={draft.name} onChange={(event) => setField("name", event.target.value)} required />
      </label>
      <label className={ui.fieldLabel}>
        Descripcion
        <textarea
          className={ui.fieldTextarea}
          value={draft.description}
          onChange={(event) => setField("description", event.target.value)}
          required
        />
      </label>
      <div className={ui.fieldGrid}>
        <label className={ui.fieldLabel}>
          Precio base
          <input
            className={ui.fieldInput}
            type="number"
            value={draft.price}
            onChange={(event) => setField("price", Number(event.target.value))}
            required
          />
        </label>
        <label className={ui.fieldLabel}>
          Stock
          <input
            className={ui.fieldInput}
            type="number"
            value={draft.stock}
            onChange={(event) => setField("stock", Number(event.target.value))}
            required
          />
        </label>
      </div>
      <section className={ui.formSection}>
        <div className={ui.panelHeader}>
          <h4 className={ui.formSectionTitle}>Precio por cantidad</h4>
          <button type="button" className={ui.cn(ui.secondaryButton, ui.smallButton)} onClick={addRange}>
            <Plus size={14} />
            Agregar precio por cantidad
          </button>
        </div>
        {(draft.quantityPrices ?? []).map((range, index) => (
          <div className={ui.fieldGrid} key={range.id}>
            <label className={ui.fieldLabel}>
              Desde
              <input
                className={ui.fieldInput}
                min={1}
                type="number"
                value={range.from}
                onChange={(event) => setRange(range.id, "from", Number(event.target.value))}
              />
            </label>
            <label className={ui.fieldLabel}>
              Hasta
              <input
                className={ui.fieldInput}
                min={range.from}
                placeholder="Sin limite"
                type="number"
                value={range.to ?? ""}
                onChange={(event) => setRange(range.id, "to", event.target.value ? Number(event.target.value) : null)}
              />
            </label>
            <label className={ui.fieldLabel}>
              Precio
              <input
                className={ui.fieldInput}
                min={0}
                type="number"
                value={range.price}
                onChange={(event) => setRange(range.id, "price", Number(event.target.value))}
              />
            </label>
            <button
              type="button"
              className={ui.cn(ui.dangerIconButton, "self-end")}
              aria-label="Eliminar rango"
              onClick={() => removeRange(range.id)}
              disabled={index === 0 && (draft.quantityPrices?.length ?? 0) === 1}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <p className={ui.helperText}>Ejemplo: 1 a 5 unidades, 6 a 10 unidades, 11 o mas sin limite superior.</p>
      </section>
      <label className={ui.fieldLabel}>
        URL de imagen
        <input className={ui.fieldInput} value={draft.imageUrl} onChange={(event) => setField("imageUrl", event.target.value)} required />
      </label>
      <section className={ui.formSection}>
        <div className={ui.imageUploadRow}>
          {draft.imageUrl ? <img className={ui.imagePreview} src={draft.imageUrl} alt="" /> : null}
          <label className={ui.fieldLabel}>
            Subir imagen local
            <input className={ui.fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadLocalImage(event.target.files?.[0])} />
          </label>
        </div>
        <p className={ui.helperText}>
          <ImagePlus size={13} className={ui.inlineIcon} /> PNG, JPG o WebP. Maximo 700 KB para mantenerla liviana en mobile.
        </p>
        {imageError ? <p className={ui.cn(ui.helperText, "font-bold text-merkao-danger")}>{imageError}</p> : null}
      </section>
      <div className={ui.fieldGrid}>
        <label className={ui.fieldLabel}>
          Categoria
          <select className={ui.fieldInput} value={draft.categoryId} onChange={(event) => setField("categoryId", event.target.value)} required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.fieldLabel}>
          Marca
          <select className={ui.fieldInput} value={draft.brandId} onChange={(event) => setField("brandId", event.target.value)} required>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={ui.modalActions}>
        <button type="button" className={ui.secondaryButton} onClick={onClose}>
          Cancelar
        </button>
        <button className={ui.primaryButton}>
          <Save size={16} />
          Guardar
        </button>
      </div>
      </form>
    </>
  );
}

function nextRangeStart(ranges: QuantityPriceRange[] | undefined) {
  const lastRange = ranges?.[ranges.length - 1];
  return (lastRange?.to ?? lastRange?.from ?? 0) + 1;
}
