import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Transaction, Category, CategoryBudget } from '../types';
import { formatRupiah, formatShortRupiah, getMonthYearLabel } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { PieChart as PieIcon, BarChart3, Target, AlertCircle } from 'lucide-react';

interface ChartsSectionProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: CategoryBudget[];
  selectedMonth: string;
  onOpenBudgetModal: () => void;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  transactions,
  categories,
  budgets,
  selectedMonth,
  onOpenBudgetModal,
}) => {
  const [activeTab, setActiveTab] = useState<'kategori' | 'tren' | 'anggaran'>('kategori');

  const monthTxs = transactions.filter((t) => t.date.startsWith(selectedMonth));
  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  // 1. Expense Breakdown by Category
  const expenseByCategory: Record<string, number> = {};
  let totalExpenseMonth = 0;

  monthTxs.forEach((tx) => {
    if (tx.type === 'pengeluaran') {
      expenseByCategory[tx.categoryId] = (expenseByCategory[tx.categoryId] || 0) + tx.amount;
      totalExpenseMonth += tx.amount;
    }
  });

  const pieData = Object.entries(expenseByCategory).map(([catId, amount]) => {
    const cat = categoryMap.get(catId);
    return {
      id: catId,
      name: cat ? cat.name : 'Lainnya',
      value: amount,
      color: cat ? cat.color : '#94A3B8',
      percentage: totalExpenseMonth > 0 ? ((amount / totalExpenseMonth) * 100).toFixed(1) : '0',
    };
  }).sort((a, b) => b.value - a.value);

  // 2. Income vs Expense Trend (Last 6 Months)
  const monthKeysSet = new Set<string>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthKeysSet.add(key);
  }

  const monthlyTrendData = Array.from(monthKeysSet).map((mKey) => {
    let income = 0;
    let expense = 0;
    transactions.forEach((tx) => {
      if (tx.date.startsWith(mKey)) {
        if (tx.type === 'pemasukan') income += tx.amount;
        if (tx.type === 'pengeluaran') expense += tx.amount;
      }
    });

    const [y, m] = mKey.split('-');
    const shortLabel = new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('id-ID', {
      month: 'short',
    });

    return {
      monthKey: mKey,
      label: shortLabel,
      Pemasukan: income,
      Pengeluaran: expense,
    };
  });

  // 3. Category Budget Analysis
  const budgetMap = new Map<string, number>(budgets.map((b) => [b.categoryId, b.monthlyLimit]));
  const expenseCategories = categories.filter((c) => c.type === 'pengeluaran');

  const budgetAnalysis = expenseCategories.map((cat) => {
    const spent = expenseByCategory[cat.id] || 0;
    const limit = budgetMap.get(cat.id) || 0;
    const percent = limit > 0 ? (spent / limit) * 100 : 0;
    return {
      category: cat,
      spent,
      limit,
      percent,
      isOver: limit > 0 && spent > limit,
    };
  }).filter((item) => item.limit > 0 || item.spent > 0);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-lg border border-slate-800">
          <p className="font-semibold">{data.name || data.payload?.label || data.payload?.name}</p>
          <p className="text-emerald-400 font-bold mt-0.5">{formatRupiah(data.value)}</p>
          {data.payload?.percentage && (
            <p className="text-slate-400 mt-0.5">{data.payload.percentage}% dari total pengeluaran</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Visualisasi & Laporan Grafik</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Analisis arus kas & pola pengeluaran Anda</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('kategori')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'kategori'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" /> Kategori
          </button>
          <button
            onClick={() => setActiveTab('tren')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'tren'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Tren 6 Bulan
          </button>
          <button
            onClick={() => setActiveTab('anggaran')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'anggaran'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Batas Anggaran
          </button>
        </div>
      </div>

      {/* Content for Kategori Tab */}
      {activeTab === 'kategori' && (
        <div>
          {pieData.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada pengeluaran yang dicatat di bulan ini untuk ditampilkan dalam grafik pie.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Pie Chart */}
              <div className="lg:col-span-6 h-64 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text in donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{formatShortRupiah(totalExpenseMonth)}</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="lg:col-span-6 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {pieData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{formatRupiah(item.value)}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content for Tren Tab */}
      {activeTab === 'tren' && (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
              <YAxis
                tickFormatter={(val) => formatShortRupiah(val)}
                tick={{ fontSize: 10, fill: '#64748B' }}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: any) => [formatRupiah(Number(value)), '']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                iconType="circle"
              />
              <Bar dataKey="Pemasukan" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Pengeluaran" fill="#F43F5E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Content for Anggaran Tab */}
      {activeTab === 'anggaran' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluasi konsumsi anggaran berdasarkan batas bulanan per kategori.
            </p>
            <button
              onClick={onOpenBudgetModal}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              + Atur Batas Anggaran
            </button>
          </div>

          {budgetAnalysis.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Belum ada batas anggaran yang diatur. Klik tombol "Atur Batas Anggaran" di atas untuk memulai.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetAnalysis.map(({ category, spent, limit, percent, isOver }) => (
                <div
                  key={category.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon name={category.icon} color={category.color} className="w-4 h-4" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{category.name}</span>
                    </div>
                    {isOver && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 text-[10px] font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Melebihi Batas
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Terpakai: <strong className="text-slate-900 dark:text-white">{formatRupiah(spent)}</strong></span>
                    <span>Batas: {limit > 0 ? formatRupiah(limit) : 'Belum diatur'}</span>
                  </div>

                  {/* Progress Bar */}
                  {limit > 0 && (
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent > 100 ? 'bg-rose-600' : percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
