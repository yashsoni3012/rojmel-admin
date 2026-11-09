import { TablePagination } from '@mui/material';

export default function Pagination({ count, page, rowsPerPage, onPage, onRows }) {
  return (
    <TablePagination
      component="div" count={count} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[5, 10, 25]}
      onPageChange={(_, p) => onPage(p)}
      onRowsPerPageChange={(e) => { onRows(+e.target.value); onPage(0); }}
    />
  );
}
