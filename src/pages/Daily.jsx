import { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PageHeader from '../components/common/PageHeader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';
import StatCard from '../components/common/StatCard.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { inr, prettyDate, sum, thisMonth } from '../utils.js';

export default function Daily() {
  const { entries } = useFinance();
  const { settings } = useSettings();
  const [month, setMonth] = useState(thisMonth());
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);

  const monthEntries = entries.filter((e) => e.date.startsWith(month));
  const totalIncome = sum(monthEntries.filter((e) => e.type === 'income'));
  const totalExpense = sum(monthEntries.filter((e) => e.type === 'expense'));
  const totalSavings = sum(monthEntries.filter((e) => e.type === 'saving'));
  const netBalance = totalIncome - totalExpense - totalSavings;

  const days = [...new Set(monthEntries.map((e) => e.date))].sort().reverse();
  const safePage = Math.min(page, Math.max(0, Math.ceil(days.length / rpp) - 1));
  const visibleDays = days.slice(safePage * rpp, safePage * rpp + rpp);

  return (
    <>
      <PageHeader title="Day by day" subtitle="Income, spending and savings for each date" month={month} onMonth={setMonth} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard label="Total income" value={inr(totalIncome)} color="#0E9F6E" icon={<span className="font-extrabold">₹</span>} />
        <StatCard label="Total expenses" value={inr(totalExpense)} color="#E5484D" icon={<span className="font-extrabold">₹</span>} />
        <StatCard label="Total savings" value={inr(totalSavings)} color="#3B82F6" icon={<span className="font-extrabold">₹</span>} />
        <StatCard label="Net balance" value={inr(netBalance)} color={netBalance >= 0 ? '#3454D1' : '#E5484D'} icon={<span className="font-extrabold">±</span>} />
      </div>

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
        <TableContainer sx={{ width: '100%', overflowX: 'auto', minHeight: days.length === 0 ? 320 : 'auto' }}>
          <Table size={settings.compactRows ? 'small' : 'medium'} sx={{ minWidth: 640, width: '100%' }}>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ width: '24%', minWidth: 150, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                  Date
                </TableCell>
                <TableCell align="right" sx={{ width: '19%', minWidth: 120, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                  Income
                </TableCell>
                <TableCell align="right" sx={{ width: '19%', minWidth: 120, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                  Expense
                </TableCell>
                <TableCell align="right" sx={{ width: '19%', minWidth: 120, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                  Savings
                </TableCell>
                <TableCell align="right" sx={{ width: '19%', minWidth: 120, py: 2, fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
                  Net
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleDays.map((d) => {
                const day = entries.filter((e) => e.date === d);
                const i = sum(day.filter((e) => e.type === 'income'));
                const x = sum(day.filter((e) => e.type === 'expense'));
                const s = sum(day.filter((e) => e.type === 'saving'));
                const net = i - x - s;
                return (
                  <TableRow key={d} hover sx={{ transition: 'background-color 0.15s ease' }}>
                    <TableCell sx={{ py: settings.compactRows ? 1.2 : 2, whiteSpace: 'nowrap', fontWeight: 600, color: '#334155' }}>
                      {prettyDate(d)}
                    </TableCell>
                    <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, color: '#0E9F6E', fontWeight: 700, fontSize: '0.95rem' }}>
                      {i ? inr(i) : '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, color: '#E5484D', fontWeight: 700, fontSize: '0.95rem' }}>
                      {x ? inr(x) : '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, color: '#3B82F6', fontWeight: 700, fontSize: '0.95rem' }}>
                      {s ? inr(s) : '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, fontWeight: 800, color: net >= 0 ? '#18233F' : '#E5484D', fontSize: '0.95rem' }}>
                      {inr(net)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {days.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ borderBottom: 0, py: 6 }}>
                    <EmptyState title="No activity this month" text="Add income or expenses to see them here." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {days.length > 0 && (
          <Pagination count={days.length} page={safePage} rowsPerPage={rpp} onPage={setPage} onRows={setRpp} />
        )}
      </Paper>
    </>
  );
}
