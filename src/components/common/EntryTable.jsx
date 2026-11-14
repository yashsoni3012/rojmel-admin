import { useState } from 'react';
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import EmptyState from './EmptyState.jsx';
import Pagination from './Pagination.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { CAT_COLOR, inr, prettyDate } from '../../utils.js';

export default function EntryTable({ rows, onEdit, onDelete, amountColor, paginate = true }) {
  const { settings } = useSettings();
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const safePage = Math.min(page, Math.max(0, Math.ceil(rows.length / rpp) - 1));
  const visible = paginate ? rows.slice(safePage * rpp, safePage * rpp + rpp) : rows;
  const actions = onEdit || onDelete;
  const colSpanCount = actions ? 5 : 4;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
      }}
    >
      <TableContainer sx={{ width: '100%', overflowX: 'auto', minHeight: rows.length === 0 ? 320 : 'auto' }}>
        <Table size={settings.compactRows ? 'small' : 'medium'} sx={{ minWidth: 640, width: '100%' }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ width: '16%', minWidth: 130, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                Date
              </TableCell>
              <TableCell sx={{ width: '18%', minWidth: 140, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                Category
              </TableCell>
              <TableCell sx={{ minWidth: 220, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                Note
              </TableCell>
              <TableCell align="right" sx={{ width: '18%', minWidth: 140, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                Amount
              </TableCell>
              {actions && (
                <TableCell align="right" sx={{ width: '12%', minWidth: 100, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((r) => (
              <TableRow
                key={r.id}
                hover
                sx={{
                  transition: 'background-color 0.15s ease',
                }}
              >
                <TableCell sx={{ py: settings.compactRows ? 1.2 : 2, whiteSpace: 'nowrap', fontWeight: 600, color: '#334155' }}>
                  {prettyDate(r.date)}
                </TableCell>
                <TableCell sx={{ py: settings.compactRows ? 1.2 : 2 }}>
                  <Chip
                    size="small"
                    label={r.category}
                    sx={{
                      background: (CAT_COLOR[r.category] || '#6B7592') + '18',
                      color: CAT_COLOR[r.category] || '#6B7592',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: `1px solid ${(CAT_COLOR[r.category] || '#6B7592')}30`,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: settings.compactRows ? 1.2 : 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1E293B' }}>
                    {r.note || '—'}
                  </Typography>
                  {r.category === 'Petrol' && (r.liters || r.km) && (
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                      {r.liters ? `${r.liters} L` : ''}{r.pricePerL ? ` @ ₹${r.pricePerL}` : ''}{r.km ? ` • ${r.km} km` : ''}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, fontWeight: 800, color: amountColor, fontSize: '0.95rem' }}>
                  {inr(r.amount)}
                </TableCell>
                {actions && (
                  <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, whiteSpace: 'nowrap' }}>
                    {onEdit && (
                      <Tooltip title="Edit entry">
                        <IconButton size="small" onClick={() => onEdit(r)} sx={{ color: '#64748B', '&:hover': { color: '#1761B6', bgcolor: 'rgba(23,97,182,0.08)' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Delete entry">
                        <IconButton size="small" onClick={() => onDelete(r.id)} sx={{ color: '#64748B', '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.08)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={colSpanCount} sx={{ borderBottom: 0, py: 6 }}>
                  <EmptyState title="No entries for this month" text="Use the Add entry button to record one." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {paginate && rows.length > 0 && <Pagination count={rows.length} page={safePage} rowsPerPage={rpp} onPage={setPage} onRows={setRpp} />}
    </Paper>
  );
}
