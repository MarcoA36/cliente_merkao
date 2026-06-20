import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import type { InventoryInput } from "../adminTypes";
import type { Product } from "../types";
import * as ui from "../uiStyles";

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
    <section className={ui.workArea}>
      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th className={ui.th}>Producto</th>
              <th className={ui.th}>Precio base</th>
              <th className={ui.th}>Precio por cantidad</th>
              <th className={ui.th}>Stock</th>
              <th className={ui.th}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const draft = drafts[product.id];
              return (
                <tr key={product.id}>
                  <td className={ui.td}>
                    <strong className={ui.tableStrong}>{product.name}</strong>
                    <span className={ui.subtle}>{product.brand.name}</span>
                  </td>
                  <td className={ui.td}>
                    <input
                      className={ui.compactInput}
                      value={draft?.price ?? ""}
                      onChange={(event) => updateDraft(product.id, "price", event.target.value)}
                    />
                  </td>
                  <td className={ui.td}>
                    <span className={ui.subtle}>Editar rangos desde producto</span>
                  </td>
                  <td className={ui.td}>
                    <input
                      className={ui.compactInput}
                      value={draft?.stock ?? ""}
                      onChange={(event) => updateDraft(product.id, "stock", event.target.value)}
                    />
                  </td>
                  <td className={ui.cn(ui.td, ui.actions)}>
                    <button
                      className={ui.cn(ui.primaryButton, ui.smallButton)}
                      onClick={() =>
                        onSave(product.id, {
                          price: Number(draft?.price),
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
