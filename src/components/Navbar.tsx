import React from 'react';
import {
  Wallet,
  Plus,
  Download,
  Target,
  Calendar,
  BarChart2,
  List,
  LayoutDashboard,
} from 'lucide-react';
import { ViewTab } from '../types';
import { getMonthYearLabel } from '../utils/formatters';

interface NavbarProps {
  selectedMonth: string;
  onChangeMonth: (monthKey: string) => void;
  availableMonths: string[];
  activeTab: ViewTab;
  onChangeTab: (tab: ViewTab) => void;
  onOpenTransactionModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedMonth,
  onChangeMonth,
  availableMonths,
  activeTab,
  onChangeTab,
  onOpenTransactionModal,
  onOpenBudgetModal,
  onOpenExportModal,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                Catatan Keuangan
              </h1>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Kelola Pengeluaran & Pemasukan</span>
            </div>
          </div>

          {/* Month Selector & Quick Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Month Dropdown */}
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => onChangeMonth(e.target.value)}
                  className="bg-transparent border-none outline-none cursor-pointer pr-1 font-semibold text-slate-900 dark:text-slate-200 dark:bg-slate-800"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {getMonthYearLabel(m)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={onOpenBudgetModal}
              title="Atur Batas Anggaran Kategori"
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs font-medium flex items-center gap-1.5"
            >
              <Target className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Anggaran</span>
            </button>

            <button
              onClick={onOpenExportModal}
              title="Ekspor & Backup Data"
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs font-medium flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Ekspor/Backup</span>
            </button>

            <button
              onClick={onOpenTransactionModal}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400 dark:text-emerald-300" />
              <span>Tambah Transaksi</span>
            </button>
          </div>
        </div>

        {/* Mobile Month Selector & Add Button row */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <select
              value={selectedMonth}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-xs text-slate-900 dark:text-slate-200 dark:bg-slate-800"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {getMonthYearLabel(m)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenExportModal}
              className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300"
              title="Ekspor"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenTransactionModal}
              className="px-3 py-1.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-300" /> Catat
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800 md:border-none">
          <button
            onClick={() => onChangeTab('ringkasan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'ringkasan'
                ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Ringkasan Utama
          </button>

          <button
            onClick={() => onChangeTab('transaksi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'transaksi'
                ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <List className="w-4 h-4" /> Daftar Transaksi
          </button>

          <button
            onClick={() => onChangeTab('grafik')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'grafik'
                ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Grafik & Analisis
          </button>

          <button
            onClick={() => onChangeTab('anggaran')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'anggaran'
                ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Target className="w-4 h-4" /> Batas Anggaran
          </button>
        </div>
      </div>
    </header>
  );
};
