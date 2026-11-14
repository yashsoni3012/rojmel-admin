import { createContext, useContext, useMemo, useState } from 'react';
import { storage } from '../services/storage.js';
import { useToast } from './ToastContext.jsx';

const Ctx = createContext(null);

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Starter Free',
    badge: 'Basic',
    description: 'Essential ledger tools for individual personal use.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Daily Income & Expense logging',
      'Basic Category tracking',
      'Local offline storage',
      'Standard calculations & statistics',
      'Single device access',
    ],
    popular: false,
    color: '#64748B',
  },
  {
    id: 'pro',
    name: 'Pro Ledger',
    badge: 'Most Popular',
    description: 'Advanced insights and analytics for professionals.',
    monthlyPrice: 299,
    yearlyPrice: 2499, // save ~30%
    features: [
      'Everything in Starter Free',
      'Unlimited entries across all modules',
      'Petrol & Mileage log calculator',
      'Savings & Investment tracking',
      'Detailed visual category analytics',
      'Excel & PDF monthly reports',
      'Priority 24/7 customer support',
    ],
    popular: true,
    color: '#1761B6',
  },
  {
    id: 'business',
    name: 'Business Elite',
    badge: 'Advanced',
    description: 'Comprehensive financial suite for businesses and shops.',
    monthlyPrice: 699,
    yearlyPrice: 5999, // save ~28%
    features: [
      'Everything in Pro Ledger',
      'Multi-account ledger management',
      'Automated monthly budgeting & alerts',
      'Vendor & client note tags',
      'Tax & GST summary calculation',
      'Automated cloud data backup',
      'Dedicated relationship manager',
    ],
    popular: false,
    color: '#0E9F6E',
  },
  {
    id: 'lifetime',
    name: 'Lifetime VIP',
    badge: 'Best Value',
    description: 'One-time investment for permanent unlimited access.',
    monthlyPrice: 4999,
    yearlyPrice: 4999,
    isLifetime: true,
    features: [
      'All current & upcoming Pro features',
      'Zero recurring subscription fees',
      'Permanent lifetime cloud backup',
      'VIP early access to all updates',
      'Direct developer assistance',
    ],
    popular: false,
    color: '#F59E0B',
  },
];

const DEFAULT_SUB = {
  id: 'pro',
  name: 'Pro Ledger',
  cycle: 'yearly',
  amount: 2499,
  status: 'active',
  startDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

const DEFAULT_HISTORY = [
  {
    invoiceId: 'ROJ-INV-2026-001',
    planId: DEFAULT_SUB.id,
    planName: DEFAULT_SUB.name,
    amount: DEFAULT_SUB.amount,
    cycle: DEFAULT_SUB.cycle,
    date: DEFAULT_SUB.startDate,
    expiryDate: DEFAULT_SUB.expiryDate,
    status: 'Active',
  },
];

export function SubscriptionProvider({ children }) {
  const toast = useToast();
  const [sub, setSub] = useState(() => {
    try {
      const saved = storage.get('subscription');
      if (saved && typeof saved === 'object' && saved.id) {
        return { ...DEFAULT_SUB, ...saved };
      }
    } catch (e) {
      console.warn('Error loading subscription state:', e);
    }
    return DEFAULT_SUB;
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = storage.get('subscription_history');
      if (Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
    } catch (e) {
      console.warn('Error loading subscription history:', e);
    }
    return DEFAULT_HISTORY;
  });

  // Calculate days left dynamically
  const daysLeft = useMemo(() => {
    if (!sub || sub.expiryDate === 'Lifetime' || sub.id === 'lifetime') return 'Lifetime';
    try {
      const exp = new Date(sub.expiryDate).getTime();
      const now = new Date().getTime();
      if (isNaN(exp)) return 'Lifetime';
      return Math.max(0, Math.ceil((exp - now) / (1000 * 60 * 60 * 24)));
    } catch {
      return '365';
    }
  }, [sub]);

  const value = useMemo(
    () => ({
      subscription: { ...DEFAULT_SUB, ...(sub || {}), daysLeft },
      plans: SUBSCRIPTION_PLANS,
      history: Array.isArray(history) ? history : DEFAULT_HISTORY,
      updatePlan: (planId, cycle = 'monthly') => {
        const target = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[0];
        const isLifetime = target.id === 'lifetime' || target.isLifetime;
        const now = new Date();
        const startDate = now.toISOString().split('T')[0];

        let expiryDate = 'Lifetime';
        if (!isLifetime && target.id !== 'free') {
          const expDate = new Date();
          if (cycle === 'yearly') {
            expDate.setFullYear(expDate.getFullYear() + 1);
          } else {
            expDate.setDate(expDate.getDate() + 30);
          }
          expiryDate = expDate.toISOString().split('T')[0];
        }

        const price = isLifetime
          ? target.monthlyPrice
          : cycle === 'yearly'
          ? target.yearlyPrice
          : target.monthlyPrice;

        const updated = {
          id: target.id,
          name: target.name,
          cycle: isLifetime ? 'lifetime' : cycle,
          amount: price,
          status: 'active',
          startDate,
          expiryDate,
        };

        const newInvoice = {
          invoiceId: `ROJ-INV-${Date.now().toString().slice(-6)}`,
          planId: target.id,
          planName: target.name,
          amount: price,
          cycle: updated.cycle,
          date: startDate,
          expiryDate,
          status: 'Active',
        };

        const currentHist = Array.isArray(history) ? history : DEFAULT_HISTORY;
        const newHistory = [newInvoice, ...currentHist];

        setSub(updated);
        setHistory(newHistory);
        storage.set('subscription', updated);
        storage.set('subscription_history', newHistory);

        toast?.success?.(`Plan updated to ${target.name}! Valid till ${expiryDate}`);
      },
    }),
    [sub, daysLeft, history, toast]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSubscription = () => useContext(Ctx);

