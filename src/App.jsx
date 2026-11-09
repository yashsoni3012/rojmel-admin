import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Layout from './components/common/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Daily from './pages/Daily.jsx';
import EntryPage from './pages/EntryPage.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';
import { CATEGORIES } from './utils.js';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="daily" element={<Daily />} />
          <Route path="income" element={<EntryPage title="Income" subtitle="Monthly salary and extra income" type="income" categories={CATEGORIES.income} accent="#0E9F6E" />} />
          <Route path="expenses" element={<EntryPage title="Expenses" subtitle="Food, petrol and every extra expense" type="expense" categories={CATEGORIES.expense} accent="#E5484D" />} />
          <Route path="petrol" element={<EntryPage title="Petrol" subtitle="Date wise petrol log" type="expense" categories={CATEGORIES.expense} fixedCategory="Petrol" accent="#F59E0B" />} />
          <Route path="savings" element={<EntryPage title="Savings" subtitle="Money you set aside" type="saving" categories={CATEGORIES.saving} accent="#3B82F6" />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
