import { Edit3, PackagePlus, Save, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { CatalogInput } from "../adminTypes";
import type { Brand, Category } from "../types";

export function CatalogView({
  title,
  items,
  onCreate,
  onUpdate,
  onDelete
}: {
  title: string;
  items: Array<Category | Brand>;
  onCreate: (input: CatalogInput) => void;
  onUpdate: (id: string, input: CatalogInput) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<Category | Brand | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  function beginEdit(item?: Category | Brand) {
    setEditing(item ?? { id: "", name: "", slug: "" });
    setName(item?.name ?? "");
    setSlug(item?.slug ?? "");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (editing?.id) {
      onUpdate(editing.id, { name, slug: slug || undefined });
    } else {
      onCreate({ name, slug: slug || undefined });
    }
    setEditing(null);
    setName("");
    setSlug("");
  }

  return (
    <section className="workArea split">
      <div>
        <div className="toolbar">
          <h3>{title}</h3>
          <button className="primaryButton" onClick={() => beginEdit()}>
            <PackagePlus size={16} />
            Nuevo
          </button>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Slug</th>
                <th>Productos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>{item.slug}</td>
                  <td>{item._count?.products ?? 0}</td>
                  <td className="actions">
                    <button className="iconButton" title="Editar" onClick={() => beginEdit(item)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="iconButton danger" title="Eliminar" onClick={() => onDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <form className="sidePanel" onSubmit={submit}>
          <div className="panelHeader">
            <h3>{editing.id ? "Editar" : "Nuevo"}</h3>
            <button type="button" className="iconButton" onClick={() => setEditing(null)}>
              <X size={16} />
            </button>
          </div>
          <label>
            Nombre
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Slug
            <input value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
          <button className="primaryButton">
            <Save size={16} />
            Guardar
          </button>
        </form>
      ) : null}
    </section>
  );
}
