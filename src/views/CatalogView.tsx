import { Edit3, ImagePlus, PackagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { CatalogInput, Department } from "../adminTypes";
import type { Brand, Category } from "../types";
import * as ui from "../uiStyles";

const maxCatalogImageBytes = 400 * 1024;

export function CatalogView({
  departments = [],
  kind,
  title,
  items,
  onCreateDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
  onCreate,
  onUpdate,
  onDelete
}: {
  departments?: Department[];
  kind: "brands" | "categories";
  title: string;
  items: Array<Category | Brand>;
  onCreateDepartment?: (input: { name: string; slug?: string }) => void;
  onUpdateDepartment?: (id: string, input: { name: string; slug?: string }) => void;
  onDeleteDepartment?: (id: string) => void;
  onCreate: (input: CatalogInput) => void;
  onUpdate: (id: string, input: CatalogInput) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<Category | Brand | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentName, setDepartmentName] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [imageError, setImageError] = useState("");
  const isCategories = kind === "categories";

  function beginEdit(item?: Category | Brand) {
    setEditing(item ?? { id: "", name: "", slug: "" });
    setName(item?.name ?? "");
    setSlug(item?.slug ?? "");
    setImageUrl(item?.imageUrl ?? "");
    setDepartmentId(item && "departmentId" in item ? item.departmentId ?? "" : "");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const input = { name, slug: slug || undefined, imageUrl: imageUrl || undefined, departmentId: departmentId || undefined };

    if (editing?.id) {
      onUpdate(editing.id, input);
    } else {
      onCreate(input);
    }
    setEditing(null);
    setName("");
    setSlug("");
    setImageUrl("");
    setDepartmentId("");
  }

  function uploadImage(file: File | undefined) {
    if (!file) return;
    setImageError("");
    if (!file.type.startsWith("image/")) {
      setImageError("Usa una imagen valida.");
      return;
    }
    if (file.size > maxCatalogImageBytes) {
      setImageError("La imagen debe pesar menos de 400 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function addDepartment() {
    const trimmedName = departmentName.trim();
    if (!trimmedName || !onCreateDepartment) return;

    if (editingDepartment) {
      onUpdateDepartment?.(editingDepartment.id, { name: trimmedName });
      setEditingDepartment(null);
    } else {
      onCreateDepartment({ name: trimmedName });
    }
    setDepartmentName("");
  }

  function deleteDepartment(id: string) {
    onDeleteDepartment?.(id);
  }

  function beginDepartmentEdit(department: Department) {
    setEditingDepartment(department);
    setDepartmentName(department.name);
  }

  return (
    <section className={isCategories && !editing ? ui.workAreaSplit : ui.workArea}>
      <div>
        <div className={ui.toolbar}>
          <h3 className={ui.toolbarMainTitle}>{title}</h3>
          <button className={ui.primaryButton} onClick={() => beginEdit()}>
            <PackagePlus size={16} />
            Nuevo
          </button>
        </div>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Imagen</th>
                <th className={ui.th}>Nombre</th>
                <th className={ui.th}>Slug</th>
                {isCategories ? <th className={ui.th}>Rubro</th> : null}
                <th className={ui.th}>Productos</th>
                <th className={ui.th}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const department = departments.find((entry) => entry.id === ("departmentId" in item ? item.departmentId : undefined));

                return (
                  <tr key={item.id}>
                    <td className={ui.td}>
                      {item.imageUrl ? <img className={ui.catalogImage} src={item.imageUrl} alt="" /> : "-"}
                    </td>
                    <td className={ui.td}>
                      <strong className={ui.tableStrong}>{item.name}</strong>
                    </td>
                    <td className={ui.td}>{item.slug}</td>
                    {isCategories ? <td className={ui.td}>{department?.name ?? "-"}</td> : null}
                    <td className={ui.td}>{item._count?.products ?? 0}</td>
                    <td className={ui.cn(ui.td, ui.actions)}>
                      <button className={ui.iconButton} title="Editar" onClick={() => beginEdit(item)}>
                        <Edit3 size={16} />
                      </button>
                      <button className={ui.dangerIconButton} title="Eliminar" onClick={() => onDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <>
        <button type="button" className={ui.modalOverlay} aria-label="Cerrar editor de catalogo" onClick={() => setEditing(null)} />
        <form className={ui.catalogModal} onSubmit={submit}>
          <div className={ui.panelHeader}>
            <h3 className={ui.panelTitle}>{editing.id ? "Editar" : "Nuevo"}</h3>
            <button type="button" className={ui.iconButton} onClick={() => setEditing(null)}>
              <X size={16} />
            </button>
          </div>
          <label className={ui.fieldLabel}>
            Nombre
            <input className={ui.fieldInput} value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className={ui.fieldLabel}>
            Slug
            <input className={ui.fieldInput} value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
          {isCategories ? (
            <label className={ui.fieldLabel}>
              Rubro / Departamento
              <select className={ui.fieldInput} value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}>
                <option value="">Sin rubro</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className={ui.fieldLabel}>
            URL de imagen
            <input className={ui.fieldInput} value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
          </label>
          <section className={ui.formSection}>
            <div className={ui.imageUploadRow}>
              {imageUrl ? <img className={ui.imagePreview} src={imageUrl} alt="" /> : null}
              <label className={ui.fieldLabel}>
                Subir imagen pequena
                <input className={ui.fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadImage(event.target.files?.[0])} />
              </label>
            </div>
            <p className={ui.helperText}>
              <ImagePlus size={13} className={ui.inlineIcon} /> PNG, JPG o WebP. Maximo 400 KB para mantener buen rendimiento en mobile.
            </p>
            {imageError ? <p className={ui.cn(ui.helperText, "font-bold text-merkao-danger")}>{imageError}</p> : null}
          </section>
          <div className={ui.modalActions}>
            <button type="button" className={ui.secondaryButton} onClick={() => setEditing(null)}>
              Cancelar
            </button>
            <button className={ui.primaryButton}>
              <Save size={16} />
              Guardar
            </button>
          </div>
        </form>
        </>
      ) : isCategories ? (
        <aside className={ui.sidePanel}>
          <div>
            <h3 className={ui.panelTitle}>Rubros / Departamentos</h3>
            <p className={ui.helperText}>Agrupa categorias como Bodega, Farmacia o Almacen.</p>
          </div>
          <div className={ui.imageUploadRow}>
            <input className={ui.fieldInput} placeholder="Nuevo rubro" value={departmentName} onChange={(event) => setDepartmentName(event.target.value)} />
            <button type="button" className={ui.secondaryIconButton} aria-label={editingDepartment ? "Guardar rubro" : "Agregar rubro"} onClick={addDepartment}>
              <Plus size={16} />
            </button>
          </div>
          <div className={ui.listPanel}>
            {departments.map((department) => (
              <div className={ui.listRow} key={department.id}>
                <div>
                  <strong className={ui.tableStrong}>{department.name}</strong>
                  <span className={ui.subtle}>{department.slug} - {department._count?.categories ?? 0} categorias</span>
                </div>
                <div className={ui.actions}>
                  <button type="button" className={ui.iconButton} aria-label="Editar rubro" onClick={() => beginDepartmentEdit(department)}>
                    <Edit3 size={15} />
                  </button>
                  <button type="button" className={ui.dangerIconButton} aria-label="Eliminar rubro" onClick={() => deleteDepartment(department.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      ) : null}
    </section>
  );
}
