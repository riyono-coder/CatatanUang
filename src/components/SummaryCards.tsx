import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  monthLabel: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpense,
  netBalance,
  savingsRate,
  monthLabel,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Pemasukan Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Pemasukan</span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {formatRupiah(totalIncome)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          {monthLabel}
        </p>
      </div>

      {/* Pengeluaran Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Pengeluaran</span>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {formatRupiah(totalExpense)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500"></span>
          {monthLabel}
        </p>
      </div>

      {/* Saldo Bersih Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Saldo Bersih</span>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${netBalance >= 0 ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className={`text-2xl font-bold tracking-tight ${netBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
          {formatRupiah(netBalance)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
          {netBalance >= 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Surplus bulan ini
            </span>
          ) : (
            <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Defisit bulan ini
            </span>
          )}
        </p>
      </div>

      {/* Rasio Tabungan Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rasio Tabungan</span>
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {savingsRate.toFixed(1)}%
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              savingsRate >= 20 ? 'bg-teal-500' : savingsRate > 0 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
