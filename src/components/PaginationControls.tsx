import { ChevronLeft, ChevronRight } from "lucide-react";
import * as ui from "../uiStyles";
import { pageSizeOptions } from "../utils/pagination";

export function PaginationControls({
  from,
  page,
  pageSize,
  to,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange
}: {
  from: number;
  page: number;
  pageSize: number;
  to: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  return (
    <div className={ui.paginationBar}>
      <span className={ui.paginationText}>
        {from}-{to} de {totalItems}
      </span>
      <label className={ui.paginationSizeLabel}>
        Filas
        <select className={ui.paginationSelect} value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <div className={ui.paginationActions}>
        <button className={ui.secondaryIconButton} aria-label="Pagina anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={16} />
        </button>
        <span className={ui.paginationText}>
          {page} / {totalPages}
        </span>
        <button
          className={ui.secondaryIconButton}
          aria-label="Pagina siguiente"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
