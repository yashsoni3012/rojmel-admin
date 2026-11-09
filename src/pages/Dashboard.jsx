import { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader.jsx';
import StatCard from '../components/common/StatCard.jsx';
import EntryTable from '../components/common/EntryTable.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { CAT_COLOR, inr, sum, thisMonth, today } from '../utils.js';
import IncomeIcon from '@mui/icons-material/SouthWestRounded';
import ExpenseIcon from '@mui/icons-material/NorthEastRounded';
import SavingsIcon from '@mui/icons-material/SavingsRounded';
import BalanceIcon from '@mui/icons-material/AccountBalanceRounded';

export default function Dashboard() {
  const { entries } = useFinance();
  const [month, setMonth] = useState(thisMonth());
  const m = entries.filter((e) => e.date.startsWith(month));
  const income = sum(m.filter((e) => e.type === 'income'));
  const expenses = m.filter((e) => e.type === 'expense');
  const expense = sum(expenses);
  const saved = sum(m.filter((e) => e.type === 'saving'));
  const balance = income - expense - saved;

  const byCat = Object.entries(expenses.reduce((a, e) => ({ ...a, [e.category]: (a[e.category] || 0) + e.amount }), {})).sort((a, b) => b[1] - a[1]);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toLocaleDateString('en-CA');
    return { key, label: d.toLocaleDateString('en-IN', { weekday: 'short' }), val: sum(entries.filter((e) => e.type === 'expense' && e.date === key)) };
  });
  const max = Math.max(...last7.map((d) => d.val), 1);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Where your money went this month" month={month} onMonth={setMonth} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Income" value={inr(income)} color="#0E9F6E" icon={<IncomeIcon />} />
        <StatCard label="Expenses" value={inr(expense)} color="#E5484D" icon={<ExpenseIcon />} />
        <StatCard label="Savings" value={inr(saved)} color="#3B82F6" icon={<SavingsIcon />} />
        <StatCard label="Left to spend" value={inr(balance)} color={balance >= 0 ? '#3454D1' : '#E5484D'} icon={<BalanceIcon />} hint="Income − expenses − savings" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Paper className="p-5">
          <Typography variant="h6" mb={2}>Spending by category</Typography>
          {byCat.length === 0 && <Typography color="text.secondary" variant="body2">No expenses this month.</Typography>}
          <div className="space-y-3">
            {byCat.map(([c, v]) => (
              <div key={c}>
                <div className="flex justify-between text-sm font-semibold mb-1"><span>{c}</span><span>{inr(v)}</span></div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full" style={{ width: `${(v / expense) * 100}%`, background: CAT_COLOR[c] || '#6B7592' }} />
                </div>
              </div>
            ))}
          </div>
        </Paper>

        <Paper className="p-5">
          <Typography variant="h6" mb={2}>Last 7 days spending</Typography>
          <div className="flex items-end gap-3 h-44">
            {last7.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[11px] font-semibold mb-1">{d.val ? inr(d.val) : ''}</span>
                <div className="w-full rounded-t-lg" style={{ height: `${(d.val / max) * 100}%`, minHeight: 4, background: d.key === today() ? '#3454D1' : '#C7D2F5' }} />
                <span className="text-xs text-slate-500 mt-1">{d.label}</span>
              </div>
            ))}
          </div>
        </Paper>
      </div>

      <Typography variant="h6" mb={2}>Recent entries</Typography>
      <EntryTable rows={[...m].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)} paginate={false} />
    </>
  );
}
