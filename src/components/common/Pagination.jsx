import { TablePagination } from '@mui/material';

export default function Pagination({ count, page, rowsPerPage, onPage, onRows }) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
      onPageChange={(_, p) => onPage(p)}
      onRowsPerPageChange={(e) => {
        onRows(+e.target.value);
        onPage(0);
      }}
      sx={{
        borderTop: '1px solid #E2E8F0',
        '& .MuiTablePagination-toolbar': {
          flexWrap: 'wrap',
          px: { xs: 1, sm: 2 },
          py: 0.5,
          minHeight: 52,
          justifyContent: { xs: 'center', sm: 'flex-end' },
          gap: 0.5,
        },
        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
          fontSize: { xs: '0.78rem', sm: '0.85rem' },
          m: 0,
        },
        '& .MuiTablePagination-actions': {
          ml: { xs: 1, sm: 2 },
        },
      }}
    />
  );
}
