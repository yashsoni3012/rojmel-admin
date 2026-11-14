import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import PageHeader from '../components/common/PageHeader.jsx';
import StatCard from '../components/common/StatCard.jsx';
import EntryTable from '../components/common/EntryTable.jsx';
import EntryDialog from '../components/common/EntryDialog.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { CAT_COLOR, inr, sum, thisMonth } from '../utils.js';

export default function EntryPage({ title, subtitle, type, categories, fixedCategory, accent }) {
  const { entries, save, remove } = useFinance();
  const [month, setMonth] = useState(thisMonth());
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const { settings } = useSettings();
  const [dlg, setDlg] = useState({ open: false, item: null });
  const [del, setDel] = useState(null);

  // Month-filtered base entries for this module
  const monthModuleEntries = entries.filter(
    (e) => e.type === type && e.date.startsWith(month) && (!fixedCategory || e.category === fixedCategory)
  );

  // Filtered by Category and Search keyword (searching note, category, amount, date)
  const filteredRows = monthModuleEntries.filter((e) => {
    const matchesCategory = cat === 'All' || e.category === cat;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (e.note && e.note.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      String(e.amount).includes(q) ||
      (e.date && e.date.includes(q));
    return matchesCategory && matchesSearch;
  });

  // Rows sorted by latest date first by default
  const rows = [...filteredRows].sort((a, b) => b.date.localeCompare(a.date));

  const liters = rows.reduce((s, r) => s + Number(r.liters || 0), 0);

  return (
    <>
      {/* Top Header: Search bar replaces the redundant heading */}
      <PageHeader
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder={`Search ${title.toLowerCase()} (notes, amount, category)...`}
        month={month}
        onMonth={setMonth}
        accent={accent}
        onAdd={() => setDlg({ open: true, item: null })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-5">
        <StatCard
          label={`Total ${title.toLowerCase()}`}
          value={inr(sum(rows))}
          color={accent}
          icon={<span className="font-extrabold">₹</span>}
        />
        <StatCard
          label="Entries"
          value={rows.length}
          color={accent}
          icon={<span className="font-extrabold">#</span>}
        />
        {fixedCategory === 'Petrol' ? (
          <StatCard
            label="Litres filled"
            value={`${liters.toFixed(1)} L`}
            color={accent}
            icon={<span className="font-extrabold">L</span>}
            hint={liters ? `Avg ${inr(sum(rows) / liters)} / litre` : ''}
          />
        ) : (
          <StatCard
            label="Daily average"
            value={inr(sum(rows) / 30)}
            color={accent}
            icon={<span className="font-extrabold">~</span>}
            hint="Per day of a 30 day month"
          />
        )}
      </div>

      {/* Category Select Filtration Bar */}
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {/* Category Select Dropdown */}
          {!fixedCategory && (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
              <InputLabel id="category-filter-label" sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Category
              </InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={cat}
                label="Category"
                onChange={(e) => setCat(e.target.value)}
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
                <MenuItem value="All" sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                  All Categories ({monthModuleEntries.length})
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {categories.map((c) => {
                  const count = monthModuleEntries.filter((e) => e.category === c).length;
                  return (
                    <MenuItem
                      key={c}
                      value={c}
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.88rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box
                          sx={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            bgcolor: CAT_COLOR[c] || '#6B7592',
                            flexShrink: 0,
                          }}
                        />
                        <span>{c}</span>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                        {count}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}

          {/* Search chip if active */}
          {search && (
            <Chip
              size="small"
              label={`Filter: "${search}"`}
              onDelete={() => setSearch('')}
              sx={{
                bgcolor: 'rgba(23, 97, 182, 0.08)',
                color: '#1761B6',
                fontWeight: 600,
                fontSize: '0.78rem',
              }}
            />
          )}

          {/* Reset Filters button if any filter is active */}
          {(cat !== 'All' || search) && (
            <Button
              size="small"
              variant="text"
              onClick={() => {
                setCat('All');
                setSearch('');
              }}
              startIcon={<ClearRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: '#E5484D',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(229, 72, 77, 0.08)' },
              }}
            >
              Reset
            </Button>
          )}
        </Box>

        {/* Showing Entries Count Indicator */}
        <Typography
          variant="body2"
          sx={{
            color: '#64748B',
            fontWeight: 600,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
          }}
        >
          Showing <span style={{ color: '#18233F', fontWeight: 700 }}>{rows.length}</span> {rows.length === 1 ? 'entry' : 'entries'}
        </Typography>
      </Paper>

      <EntryTable
        rows={rows}
        amountColor={accent}
        onEdit={(item) => setDlg({ open: true, item })}
        onDelete={(id) => (settings.confirmDelete ? setDel(id) : remove(id))}
      />

      <ConfirmDialog
        open={!!del}
        danger
        title="Delete this entry?"
        text="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => remove(del)}
        onClose={() => setDel(null)}
      />

      <EntryDialog
        open={dlg.open}
        initial={dlg.item}
        type={type}
        categories={categories}
        fixedCategory={fixedCategory}
        onClose={() => setDlg({ open: false, item: null })}
        onSave={save}
      />
    </>
  );
}
