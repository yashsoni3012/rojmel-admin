import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Layout from './components/common/Layout.jsx';
import PageSkeleton from './components/common/PageSkeleton.jsx';
import { CATEGORIES } from './utils.js';

// Lazy-loaded page modules for code splitting and fast initial page load
const Login = lazy(() => import('./pages/Login.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Daily = lazy(() => import('./pages/Daily.jsx'));
const EntryPage = lazy(() => import('./pages/EntryPage.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Subscription = lazy(() => import('./pages/Subscription.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="daily" element={<Daily />} />
            <Route
              path="income"
              element={
                <EntryPage
                  title="Income"
                  subtitle="Monthly salary and extra income"
                  type="income"
                  categories={CATEGORIES.income}
                  accent="#0E9F6E"
                />
              }
            />
            <Route
              path="expenses"
              element={
                <EntryPage
                  title="Expenses"
                  subtitle="Food, petrol and every extra expense"
                  type="expense"
                  categories={CATEGORIES.expense}
                  accent="#E5484D"
                />
              }
            />
            <Route
              path="petrol"
              element={
                <EntryPage
                  title="Petrol"
                  subtitle="Date wise petrol log"
                  type="expense"
                  categories={CATEGORIES.expense}
                  fixedCategory="Petrol"
                  accent="#F59E0B"
                />
              }
            />
            <Route
              path="savings"
              element={
                <EntryPage
                  title="Savings"
                  subtitle="Money you set aside"
                  type="saving"
                  categories={CATEGORIES.saving}
                  accent="#3B82F6"
                />
              }
            />
            <Route path="subscription" element={<Subscription />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
