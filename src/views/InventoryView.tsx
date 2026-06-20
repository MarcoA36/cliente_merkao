import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import type { InventoryInput } from "../adminTypes";
import type { Product } from "../types";

export function InventoryView({ products, onSave }: { products: Product[]; onSave: (id: string, input: InventoryInput) => void }) {
  const [drafts, setDrafts] = useState<Record<string, { price: string; promotionalPrice: string; stock: string }>>({});

  useEffect(() => {
    const nextDrafts: Record<string, { price: string; promotionalPrice: string; stock: string }> = {};
    for (const product of products) {
      nextDrafts[product.id] = {
        price: String(product.price),
        promotionalPrice: product.promotionalPrice ? String(product.promotionalPrice) : "",
        stock: String(product.stock)
      };
    }
    setDrafts(nextDrafts);
  }, [products]);

  function updateDraft(id: string, field: "price" | "promotionalPrice" | "stock", value: string) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value
      }
    }));
  }

  return (
    <section className="workArea">
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio base</th>
              <th>Precio promocional</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const draft = drafts[product.id];
              return (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <span className="subtle">{product.brand.name}</span>
                  </td>
                  <td>
                    <input
                      className="compactInput"
                      value={draft?.price ?? ""}
                      onChange={(event) => updateDraft(product.id, "price", event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="compactInput"
                      value={draft?.promotionalPrice ?? ""}
                      onChange={(event) => updateDraft(product.id, "promotionalPrice", event.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="compactInput"
                      value={draft?.stock ?? ""}
                      onChange={(event) => updateDraft(product.id, "stock", event.target.value)}
                    />
                  </td>
                  <td className="actions">
                    <button
                      className="primaryButton small"
                      onClick={() =>
                        onSave(product.id, {
                          price: Number(draft?.price),
                          promotionalPrice: draft?.promotionalPrice ? Number(draft.promotionalPrice) : null,
                          stock: Number(draft?.stock)
                        })
                      }
                    >
                      <Save size={15} />
                      Guardar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
