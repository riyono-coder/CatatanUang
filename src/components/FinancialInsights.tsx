import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Transaction, Category, CategoryBudget } from '../types';
import { formatRupiah, getMonthYearLabel } from '../utils/formatters';

interface FinancialInsightsProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: CategoryBudget[];
  selectedMonth: string;
}

export const FinancialInsights: React.FC<FinancialInsightsProps> = ({
  transactions,
  categories,
  budgets,
  selectedMonth,
}) => {
  const monthTxs = transactions.filter((t) => t.date.startsWith(selectedMonth));
  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  let totalIncome = 0;
  let totalExpense = 0;
  const expenseByCat: Record<string, number> = {};

  monthTxs.forEach((t) => {
    if (t.type === 'pemasukan') totalIncome += t.amount;
    if (t.type === 'pengeluaran') {
      totalExpense += t.amount;
      expenseByCat[t.categoryId] = (expenseByCat[t.categoryId] || 0) + t.amount;
    }
  });

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netBalance) / totalIncome) * 100 : 0;

  // Find top expense category
  let topCatId = '';
  let topCatAmount = 0;
  Object.entries(expenseByCat).forEach(([catId, amt]) => {
    if (amt > topCatAmount) {
      topCatAmount = amt;
      topCatId = catId;
    }
  });

  const topCategory = categoryMap.get(topCatId);
  const topCatPercent = totalExpense > 0 ? Math.round((topCatAmount / totalExpense) * 100) : 0;

  // Budget warnings
  const budgetMap = new Map<string, number>(budgets.map((b) => [b.categoryId, b.monthlyLimit]));
  const overBudgetCatNames: string[] = [];
  Object.entries(expenseByCat).forEach(([catId, amt]) => {
    const limit = budgetMap.get(catId) || 0;
    if (limit > 0 && amt > limit) {
      const cat = categoryMap.get(catId);
      if (cat) overBudgetCatNames.push(cat.name);
    }
  });

  if (monthTxs.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-lg mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Analisis & Tips Keuangan Pintar</h3>
          <p className="text-[11px] text-slate-300">{getMonthYearLabel(selectedMonth)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {/* Insight 1: Status Tabungan */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-1.5">
            {savingsRate >= 20 ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : savingsRate > 0 ? (
              <TrendingUp className="w-4 h-4 text-amber-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-xs font-bold text-white">
              {savingsRate >= 20
                ? 'Rasio Tabungan Sehat'
                : savingsRate > 0
                ? 'Perlu Ditingkatkan'
                : 'Defisit Anggaran'}
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {savingsRate >= 20
              ? `Luar biasa! Anda menyisihkan ${savingsRate.toFixed(1)}% dari pemasukan bulan ini (Saran ideal: 20%).`
              : savingsRate > 0
              ? `Anda menyisihkan ${savingsRate.toFixed(1)}% pemasukan. Coba tekan pengeluaran sekunder agar mencapai 20%.`
              : `Pengeluaran melebihi pemasukan sebesar ${formatRupiah(Math.abs(netBalance))}. Evaluasi kembali prioritas Anda.`}
          </p>
        </div>

        {/* Insight 2: Kategori Terbesar */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-300" />
            <span className="text-xs font-bold text-white">Pengeluaran Utama</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {topCategory ? (
              <>
                Pos terbesar adalah <strong className="text-amber-300">{topCategory.name}</strong> ({topCatPercent}% dari total pengeluaran, senilai {formatRupiah(topCatAmount)}).
              </>
            ) : (
              'Belum ada pengeluaran signifikan bulan ini.'
            )}
          </p>
        </div>

        {/* Insight 3: Batas Anggaran */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-2 mb-1.5">
            {overBudgetCatNames.length > 0 ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-xs font-bold text-white">Status Anggaran</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {overBudgetCatNames.length > 0 ? (
              <>
                Kategori yang melebihi batas: <strong className="text-rose-300">{overBudgetCatNames.join(', ')}</strong>. Coba kendalikan pengeluaran di pos ini.
              </>
            ) : (
              'Seluruh kategori pengeluaran Anda masih aman berada di dalam batas anggaran yang ditentukan.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
