import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
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
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);

  const monthEntries = entries.filter((e) => e.date.startsWith(month));
  const totalIncome = sum(monthEntries.filter((e) => e.type === 'income'));
  const totalExpense = sum(monthEntries.filter((e) => e.type === 'expense'));
  const totalSavings = sum(monthEntries.filter((e) => e.type === 'saving'));
  const netBalance = totalIncome - totalExpense - totalSavings;

  // Group entries by date
  const allDays = [...new Set(monthEntries.map((e) => e.date))];

  // Daily aggregates map
  const dailyData = allDays.map((date) => {
    const dayEntries = monthEntries.filter((e) => e.date === date);
    const dayIncome = sum(dayEntries.filter((e) => e.type === 'income'));
    const dayExpense = sum(dayEntries.filter((e) => e.type === 'expense'));
    const daySavings = sum(dayEntries.filter((e) => e.type === 'saving'));
    const dayNet = dayIncome - dayExpense - daySavings;
    return { date, dayIncome, dayExpense, daySavings, dayNet, count: dayEntries.length };
  });

  // Filter days by activity and search
  const filteredDays = dailyData.filter((d) => {
    let matchesType = true;
    if (filterType === 'income') matchesType = d.dayIncome > 0;
    else if (filterType === 'expense') matchesType = d.dayExpense > 0;
    else if (filterType === 'saving') matchesType = d.daySavings > 0;
    else if (filterType === 'surplus') matchesType = d.dayNet > 0;
    else if (filterType === 'deficit') matchesType = d.dayNet < 0;

    const q = search.trim().toLowerCase();
    const formattedDate = prettyDate(d.date).toLowerCase();
    const matchesSearch =
      !q ||
      d.date.includes(q) ||
      formattedDate.includes(q) ||
      String(d.dayIncome).includes(q) ||
      String(d.dayExpense).includes(q) ||
      String(d.dayNet).includes(q);

    return matchesType && matchesSearch;
  });

  // Sorted days (latest date first by default)
  const sortedDays = [...filteredDays].sort((a, b) => b.date.localeCompare(a.date));

  const safePage = Math.min(page, Math.max(0, Math.ceil(sortedDays.length / rpp) - 1));
  const visibleDays = sortedDays.slice(safePage * rpp, safePage * rpp + rpp);

  return (
    <>
      {/* Search Bar replaces the redundant heading in Day by Day */}
      <PageHeader
        searchValue={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(0);
        }}
        searchPlaceholder="Search dates (e.g. 15, Nov) or amounts..."
        month={month}
        onMonth={setMonth}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard
          label="Total income"
          value={inr(totalIncome)}
          color="#0E9F6E"
          icon={<span className="font-extrabold">₹</span>}
        />
        <StatCard
          label="Total expenses"
          value={inr(totalExpense)}
          color="#E5484D"
          icon={<span className="font-extrabold">₹</span>}
        />
        <StatCard
          label="Total savings"
          value={inr(totalSavings)}
          color="#3B82F6"
          icon={<span className="font-extrabold">₹</span>}
        />
        <StatCard
          label="Net balance"
          value={inr(netBalance)}
          color={netBalance >= 0 ? '#1761B6' : '#E5484D'}
          icon={<span className="font-extrabold">±</span>}
        />
      </div>

      {/* Select Filtration Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.2 },
          mb: 3,
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Day Activity Select Filter */}
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
            <InputLabel id="daily-filter-label" sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Activity Filter
            </InputLabel>
            <Select
              labelId="daily-filter-label"
              id="daily-filter"
              value={filterType}
              label="Activity Filter"
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(0);
              }}
              startAdornment={
                <InputAdornment position="start" sx={{ pl: 0.5, mr: 0.5 }}>
                  <FilterListRoundedIcon sx={{ fontSize: 20, color: '#1761B6' }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: '10px',
                bgcolor: '#F8FAFC',
                fontWeight: 600,
                fontSize: '0.88rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1761B6' },
              }}
            >
              <MenuItem value="all" sx={{ fontSize: '0.88rem', fontWeight: 500 }}>
                All Recorded Days ({allDays.length})
              </MenuItem>
              <MenuItem value="income" sx={{ fontSize: '0.88rem', fontWeight: 500 }}>
                Days with Income
              </MenuItem>
              <MenuItem value="expense" sx={{ fontSize: '0.88rem', fontWeight: 500 }}>
                Days with Expenses
              </MenuItem>
              <MenuItem value="saving" sx={{ fontSize: '0.88rem', fontWeight: 500 }}>
                Days with Savings
              </MenuItem>
              <MenuItem value="surplus" sx={{ fontSize: '0.88rem', fontWeight: 500 }}>
                Net Surplus Days (+)
              </MenuItem>
              <MenuItem value="deficit" sx={{ fontSize: '0.88rem', fontWeight: 500 }}>
                Net Deficit Days (−)
              </MenuItem>
            </Select>
          </FormControl>

          {/* Search chip if active */}
          {search && (
            <Chip
              size="small"
              label={`Search: "${search}"`}
              onDelete={() => setSearch('')}
              sx={{
                bgcolor: 'rgba(23, 97, 182, 0.08)',
                color: '#1761B6',
                fontWeight: 600,
                fontSize: '0.78rem',
              }}
            />
          )}

          {/* Reset button if filter is active */}
          {(filterType !== 'all' || search) && (
            <Button
              size="small"
              variant="text"
              onClick={() => {
                setFilterType('all');
                setSearch('');
                setPage(0);
              }}
              startIcon={<ClearRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: '#E5484D',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'none',
              }}
            >
              Reset
            </Button>
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#64748B',
            fontWeight: 600,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
          }}
        >
          Showing <span style={{ color: '#18233F', fontWeight: 700 }}>{sortedDays.length}</span> {sortedDays.length === 1 ? 'day' : 'days'}
        </Typography>
      </Paper>

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
        <TableContainer sx={{ width: '100%', overflowX: 'auto', minHeight: sortedDays.length === 0 ? 320 : 'auto' }}>
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
                  Net balance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleDays.map((d) => (
                <TableRow
                  key={d.date}
                  hover
                  sx={{
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ py: settings.compactRows ? 1.2 : 2, fontWeight: 600, color: '#334155' }}>
                    {prettyDate(d.date)}
                  </TableCell>
                  <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, fontWeight: 700, color: '#0E9F6E' }}>
                    {d.dayIncome ? inr(d.dayIncome) : '—'}
                  </TableCell>
                  <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, fontWeight: 700, color: '#E5484D' }}>
                    {d.dayExpense ? inr(d.dayExpense) : '—'}
                  </TableCell>
                  <TableCell align="right" sx={{ py: settings.compactRows ? 1.2 : 2, fontWeight: 700, color: '#3B82F6' }}>
                    {d.daySavings ? inr(d.daySavings) : '—'}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      py: settings.compactRows ? 1.2 : 2,
                      fontWeight: 800,
                      color: d.dayNet >= 0 ? '#1761B6' : '#E5484D',
                    }}
                  >
                    {inr(d.dayNet)}
                  </TableCell>
                </TableRow>
              ))}

              {sortedDays.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <EmptyState
                      title="No entries matching filter"
                      text="Try selecting another activity filter, clearing search, or change the selected month."
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={sortedDays.length}
          page={safePage}
          rowsPerPage={rpp}
          onPage={setPage}
          onRows={(r) => {
            setRpp(r);
            setPage(0);
          }}
        />
      </Paper>
    </>
  );
}
