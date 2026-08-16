import { Transaction, Category } from '../types';

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatShortRupiah = (value: number): string => {
  if (Math.abs(value) >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}Jt`;
  }
  if (Math.abs(value) >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)}Rb`;
  }
  return `Rp ${value}`;
};

export const formatTanggalIndo = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getMonthYearLabel = (yearMonthKey: string): string => {
  // yearMonthKey: YYYY-MM
  const [year, month] = yearMonthKey.split('-');
  if (!year || !month) return yearMonthKey;
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getCurrentYearMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getAvailableMonths = (transactions: Transaction[]): string[] => {
  const set = new Set<string>();
  set.add(getCurrentYearMonthKey());

  transactions.forEach((tx) => {
    if (tx.date && tx.date.length >= 7) {
      set.add(tx.date.substring(0, 7));
    }
  });

  return Array.from(set).sort().reverse();
};

export const exportToCSV = (transactions: Transaction[], categories: Category[]): void => {
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  const headers = ['ID', 'Jenis', 'Kategori', 'Jumlah (Rp)', 'Tanggal', 'Keterangan'];
  const rows = transactions.map((t) => [
    t.id,
    t.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
    catMap.get(t.categoryId) || t.categoryId,
    t.amount,
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `catatan_keuangan_${getCurrentYearMonthKey()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
