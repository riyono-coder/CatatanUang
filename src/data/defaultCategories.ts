import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Pengeluaran (Expenses)
  { id: 'makanan', name: 'Makanan & Minuman', type: 'pengeluaran', icon: 'Utensils', color: '#EF4444' },
  { id: 'transportasi', name: 'Transportasi & Bensin', type: 'pengeluaran', icon: 'Car', color: '#F97316' },
  { id: 'tagihan', name: 'Tagihan & Listrik/Air', type: 'pengeluaran', icon: 'Zap', color: '#EAB308' },
  { id: 'belanja', name: 'Belanja Kebutuhan', type: 'pengeluaran', icon: 'ShoppingBag', color: '#EC4899' },
  { id: 'hiburan', name: 'Hiburan & Hobi', type: 'pengeluaran', icon: 'Film', color: '#8B5CF6' },
  { id: 'kesehatan', name: 'Kesehatan & Obat', type: 'pengeluaran', icon: 'HeartPulse', color: '#10B981' },
  { id: 'pendidikan', name: 'Pendidikan & Kursus', type: 'pengeluaran', icon: 'GraduationCap', color: '#06B6D4' },
  { id: 'tempat_tinggal', name: 'Sewa / Rumah', type: 'pengeluaran', icon: 'Home', color: '#6366F1' },
  { id: 'lainnya_pengeluaran', name: 'Pengeluaran Lainnya', type: 'pengeluaran', icon: 'MoreHorizontal', color: '#64748B' },

  // Pemasukan (Income)
  { id: 'gaji', name: 'Gaji Utama', type: 'pemasukan', icon: 'Wallet', color: '#10B981' },
  { id: 'bonus', name: 'Bonus & Tunjangan', type: 'pemasukan', icon: 'Gift', color: '#059669' },
  { id: 'investasi', name: 'Hasil Investasi', type: 'pemasukan', icon: 'TrendingUp', color: '#0D9488' },
  { id: 'freelance', name: 'Freelance / Bisnis', type: 'pemasukan', icon: 'Briefcase', color: '#0284C7' },
  { id: 'lainnya_pemasukan', name: 'Pemasukan Lainnya', type: 'pemasukan', icon: 'PlusCircle', color: '#4F46E5' },
];

export const INITIAL_BUDGETS: Record<string, number> = {
  makanan: 2500000,
  transportasi: 800000,
  tagihan: 1200000,
  belanja: 1500000,
  hiburan: 600000,
  kesehatan: 500000,
  tempat_tinggal: 2000000,
};
