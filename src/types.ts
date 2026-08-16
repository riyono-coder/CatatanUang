export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string; // YYYY-MM-DD
  description: string;
  createdAt: number;
}

export interface CategoryBudget {
  categoryId: string;
  monthlyLimit: number;
}

export interface MonthSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
}

export type ViewTab = 'ringkasan' | 'transaksi' | 'grafik' | 'anggaran';
