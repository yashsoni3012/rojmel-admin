import { useState } from 'react';
import { Chip } from '@mui/material';
import PageHeader from '../components/common/PageHeader.jsx';
import StatCard from '../components/common/StatCard.jsx';
import EntryTable from '../components/common/EntryTable.jsx';
import EntryDialog from '../components/common/EntryDialog.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { inr, sum, thisMonth } from '../utils.js';

export default function EntryPage({ title, subtitle, type, categories, fixedCategory, accent }) {
  const { entries, save, remove } = useFinance();
  const [month, setMonth] = useState(thisMonth());
  const [cat, setCat] = useState('All');
  const { settings } = useSettings();
  const [dlg, setDlg] = useState({ open: false, item: null });
  const [del, setDel] = useState(null);

  const rows = entries
    .filter((e) => e.type === type && e.date.startsWith(month) && (!fixedCategory || e.category === fixedCategory) && (cat === 'All' || e.category === cat))
    .sort((a, b) => b.date.localeCompare(a.date));
  const liters = rows.reduce((s, r) => s + Number(r.liters || 0), 0);

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} month={month} onMonth={setMonth} accent={accent} onAdd={() => setDlg({ open: true, item: null })} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatCard label={`Total ${title.toLowerCase()}`} value={inr(sum(rows))} color={accent} icon={<span className="font-extrabold">₹</span>} />
        <StatCard label="Entries" value={rows.length} color={accent} icon={<span className="font-extrabold">#</span>} />
        {fixedCategory === 'Petrol'
          ? <StatCard label="Litres filled" value={`${liters.toFixed(1)} L`} color={accent} icon={<span className="font-extrabold">L</span>} hint={liters ? `Avg ${inr(sum(rows) / liters)} / litre` : ''} />
          : <StatCard label="Daily average" value={inr(sum(rows) / 30)} color={accent} icon={<span className="font-extrabold">~</span>} hint="Per day of a 30 day month" />}
      </div>

      {!fixedCategory && (
        <div className="flex flex-wrap gap-2 mb-4">
          {['All', ...categories].map((c) => (
            <Chip key={c} label={c} onClick={() => setCat(c)} color={cat === c ? 'primary' : 'default'} variant={cat === c ? 'filled' : 'outlined'} sx={{ fontWeight: 600, background: cat === c ? undefined : '#fff' }} />
          ))}
        </div>
      )}

      <EntryTable rows={rows} amountColor={accent} onEdit={(item) => setDlg({ open: true, item })} onDelete={(id) => (settings.confirmDelete ? setDel(id) : remove(id))} />
      <ConfirmDialog open={!!del} danger title="Delete this entry?" text="This cannot be undone." confirmLabel="Delete" onConfirm={() => remove(del)} onClose={() => setDel(null)} />
      <EntryDialog open={dlg.open} initial={dlg.item} type={type} categories={categories} fixedCategory={fixedCategory} onClose={() => setDlg({ open: false, item: null })} onSave={save} />
    </>
  );
}
