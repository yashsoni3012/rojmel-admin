export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
export const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD (local)
export const thisMonth = () => today().slice(0, 7);
export const sum = (list) => list.reduce((s, x) => s + Number(x.amount || 0), 0);
export const prettyDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' });

export const CATEGORIES = {
  income: ['Salary', 'Extra income', 'Other income'],
  expense: ['Food', 'Petrol', 'Extra expense', 'Bills', 'Travel', 'Shopping', 'Other'],
  saving: ['Savings deposit', 'Emergency fund', 'Investment'],
};

export const CAT_COLOR = {
  Salary: '#0E9F6E', 'Extra income': '#14B8A6', 'Other income': '#22C55E',
  Food: '#F97316', Petrol: '#F59E0B', 'Extra expense': '#E5484D', Bills: '#8B5CF6',
  Travel: '#06B6D4', Shopping: '#EC4899', Other: '#6B7592',
  'Savings deposit': '#3B82F6', 'Emergency fund': '#6366F1', Investment: '#0EA5E9',
};
