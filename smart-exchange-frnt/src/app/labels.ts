import { MatPaginatorIntl } from '@angular/material/paginator';

const spanishPaginatorIntl = new MatPaginatorIntl();

spanishPaginatorIntl.itemsPerPageLabel = 'Ítems por página:';
spanishPaginatorIntl.nextPageLabel = 'Siguiente página';
spanishPaginatorIntl.previousPageLabel = 'Página anterior';
spanishPaginatorIntl.firstPageLabel = 'Primera página';
spanishPaginatorIntl.lastPageLabel = 'Última página';
spanishPaginatorIntl.getRangeLabel = (page, pageSize, length) => {
  if (length === 0 || pageSize === 0) {
    return `0 de ${length}`;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function getSpanishPaginatorIntl() {
  return spanishPaginatorIntl;
}
