import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, ArrowUpRight, ArrowDownRight, Plus, Calendar } from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  selectedMonth: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onEdit,
  onDelete,
  onAddNew,
  selectedMonth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'semua' | TransactionType>('semua');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('semua');

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  // Filter logic
  const filtered = transactions.filter((tx) => {
    // Month filter
    if (selectedMonth && !tx.date.startsWith(selectedMonth)) {
      return false;
    }
    // Type filter
    if (typeFilter !== 'semua' && tx.type !== typeFilter) {
      return false;
    }
    // Category filter
    if (selectedCategoryId !== 'semua' && tx.categoryId !== selectedCategoryId) {
      return false;
    }
    // Search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const cat = categoryMap.get(tx.categoryId);
      const catName = cat ? cat.name.toLowerCase() : '';
      const desc = tx.description.toLowerCase();
      return desc.includes(term) || catName.includes(term);
    }
    return true;
  });

  // Sort by date descending
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 mb-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Daftar Transaksi</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {sorted.length} item
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Riwayat pencatatan keuangan Anda</p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors self-start md:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" /> Catat Transaksi
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi / catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['semua', 'pemasukan', 'pengeluaran'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                typeFilter === t
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t === 'semua' ? 'Semua' : t === 'pemasukan' ? 'Masuk' : 'Keluar'}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 appearance-none cursor-pointer"
          >
            <option value="semua">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type === 'pemasukan' ? '+' : '-'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction Items */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tidak ada transaksi ditemukan</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || typeFilter !== 'semua' || selectedCategoryId !== 'semua'
              ? 'Coba sesuaikan filter atau kata kunci pencarian Anda.'
              : 'Belum ada catatan untuk bulan ini. Klik tombol di bawah untuk menambah transaksi.'}
          </p>
          <button
            onClick={onAddNew}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" /> Tambah Transaksi Pertama
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sorted.map((tx) => {
            const cat = categoryMap.get(tx.categoryId);
            const isIncome = tx.type === 'pemasukan';

            return (
              <div
                key={tx.id}
                className="py-3.5 px-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-xl transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Category Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: `${cat?.color || '#64748B'}20` }}
                  >
                    <CategoryIcon
                      name={cat?.icon || 'CircleDot'}
                      color={cat?.color || '#94A3B8'}
                      className="w-5 h-5"
                    />
                  </div>

                  {/* Title & Category & Date */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{tx.description}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {cat?.name || 'Lainnya'}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{formatTanggalIndo(tx.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold flex items-center justify-end gap-0.5 ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                      )}
                      <span>
                        {isIncome ? '+' : '-'} {formatRupiah(tx.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tx)}
                      title="Edit Transaksi"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      title="Hapus Transaksi"
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
