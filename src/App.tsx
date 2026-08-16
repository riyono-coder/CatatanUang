import React, { useState, useEffect } from 'react';
import { Transaction, CategoryBudget, ViewTab } from './types';
import { DEFAULT_CATEGORIES, INITIAL_BUDGETS } from './data/defaultCategories';
import { getSampleTransactions } from './data/sampleTransactions';
import {
  getCurrentYearMonthKey,
  getAvailableMonths,
  getMonthYearLabel,
} from './utils/formatters';

import { auth, db, googleProvider } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { FinancialInsights } from './components/FinancialInsights';
import { TransactionList } from './components/TransactionList';
import { ChartsSection } from './components/ChartsSection';
import { TransactionFormModal } from './components/TransactionFormModal';
import { BudgetModal } from './components/BudgetModal';
import { ExportImportModal } from './components/ExportImportModal';
import { Wallet, LogIn, LogOut, Sun, Moon } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 1. Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 2. Budgets State
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);

  // 3. UI Navigation State
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonthKey());
  const [activeTab, setActiveTab] = useState<ViewTab>('ringkasan');

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore Data
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      return;
    }

    // Transactions listener
    const txQuery = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribeTx = onSnapshot(txQuery, (snapshot) => {
      const txData: Transaction[] = [];
      snapshot.forEach((doc) => {
        txData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(txData);
    });

    // Budgets listener
    const budgetQuery = query(collection(db, 'budgets'), where('userId', '==', user.uid));
    const unsubscribeBudget = onSnapshot(budgetQuery, (snapshot) => {
      const budgetData: CategoryBudget[] = [];
      snapshot.forEach((doc) => {
        budgetData.push(doc.data() as CategoryBudget);
      });
      // Merge with initial if empty
      if (budgetData.length === 0) {
        const init = Object.entries(INITIAL_BUDGETS).map(([catId, limit]) => ({
          categoryId: catId,
          monthlyLimit: limit,
        }));
        setBudgets(init);
      } else {
        setBudgets(budgetData);
      }
    });

    return () => {
      unsubscribeTx();
      unsubscribeBudget();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Error signing in:', error);
      alert('Gagal masuk (login). Jika Anda sedang melihat pratinjau (preview), silakan buka aplikasi ini di tab baru terlebih dahulu untuk login dengan akun Google.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Wallet className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Catatan Keuangan</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Masuk untuk mengelola dan mencadangkan data keuangan Anda secara aman di cloud.</p>
          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" /> Lanjutkan dengan Google
          </button>
        </div>
      </div>
    );
  }

  // Derived Months
  const availableMonths = getAvailableMonths(transactions);

  // Summary Math for Selected Month
  const currentMonthTxs = transactions.filter((t) => t.date.startsWith(selectedMonth));
  
  let totalIncome = 0;
  let totalExpense = 0;

  currentMonthTxs.forEach((t) => {
    if (t.type === 'pemasukan') totalIncome += t.amount;
    if (t.type === 'pengeluaran') totalExpense += t.amount;
  });

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

  // Transaction Actions
  const handleSaveTransaction = async (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (!user) return;
    try {
      if (id) {
        await updateDoc(doc(db, 'transactions', id), txData as any);
      } else {
        await addDoc(collection(db, 'transactions'), {
          ...txData,
          userId: user.uid,
          createdAt: Date.now(),
        });
      }
    } catch (e) {
      console.error('Error saving transaction: ', e);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan transaksi ini?')) {
      try {
        await deleteDoc(doc(db, 'transactions', id));
      } catch (e) {
        console.error('Error deleting transaction: ', e);
      }
    }
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const handleOpenNewTxModal = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  const handleSaveBudgets = async (updatedBudgets: CategoryBudget[]) => {
    if (!user) return;
    try {
      for (const b of updatedBudgets) {
        const budgetDocId = `${user.uid}_${b.categoryId}`;
        await setDoc(doc(db, 'budgets', budgetDocId), {
          userId: user.uid,
          categoryId: b.categoryId,
          monthlyLimit: b.monthlyLimit,
        });
      }
      setBudgets(updatedBudgets);
    } catch (e) {
      console.error('Error saving budgets: ', e);
    }
  };

  const handleRestoreData = async (importedTransactions: Transaction[]) => {
    if (!user) return;
    if (confirm('Apakah Anda yakin ingin mengimpor data ini ke cloud?')) {
      for (const tx of importedTransactions) {
        await addDoc(collection(db, 'transactions'), {
          type: tx.type,
          amount: tx.amount,
          categoryId: tx.categoryId,
          date: tx.date,
          description: tx.description,
          createdAt: tx.createdAt || Date.now(),
          userId: user.uid,
        });
      }
    }
  };

  const handleResetSampleData = async () => {
    if (!user) return;
    const samples = getSampleTransactions();
    for (const tx of samples) {
      await addDoc(collection(db, 'transactions'), {
        type: tx.type,
        amount: tx.amount,
        categoryId: tx.categoryId,
        date: tx.date,
        description: tx.description,
        createdAt: tx.createdAt || Date.now(),
        userId: user.uid,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-200">
      {/* Auth Control in top right corner (just above Navbar or integrated) */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-2 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{user.email}</span>
          <button 
            onClick={handleLogout}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar
          </button>
        </div>
      </div>

      {/* Header / Navbar */}
      <Navbar
        selectedMonth={selectedMonth}
        onChangeMonth={setSelectedMonth}
        availableMonths={availableMonths}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenTransactionModal={handleOpenNewTxModal}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Ringkasan View */}
        {activeTab === 'ringkasan' && (
          <div>
            <SummaryCards
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              netBalance={netBalance}
              savingsRate={savingsRate}
              monthLabel={getMonthYearLabel(selectedMonth)}
            />
            <FinancialInsights
              transactions={transactions}
              categories={DEFAULT_CATEGORIES}
              budgets={budgets}
              selectedMonth={selectedMonth}
            />
            <ChartsSection
              transactions={transactions}
              categories={DEFAULT_CATEGORIES}
              budgets={budgets}
              selectedMonth={selectedMonth}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />
            <TransactionList
              transactions={transactions}
              categories={DEFAULT_CATEGORIES}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onAddNew={handleOpenNewTxModal}
              selectedMonth={selectedMonth}
            />
          </div>
        )}

        {/* Transaksi View */}
        {activeTab === 'transaksi' && (
          <div>
            <TransactionList
              transactions={transactions}
              categories={DEFAULT_CATEGORIES}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onAddNew={handleOpenNewTxModal}
              selectedMonth={selectedMonth}
            />
          </div>
        )}

        {/* Grafik View */}
        {activeTab === 'grafik' && (
          <div>
            <ChartsSection
              transactions={transactions}
              categories={DEFAULT_CATEGORIES}
              budgets={budgets}
              selectedMonth={selectedMonth}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />
          </div>
        )}

        {/* Anggaran View */}
        {activeTab === 'anggaran' && (
          <div>
            <SummaryCards
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              netBalance={netBalance}
              savingsRate={savingsRate}
              monthLabel={getMonthYearLabel(selectedMonth)}
            />
            <ChartsSection
              transactions={transactions}
              categories={DEFAULT_CATEGORIES}
              budgets={budgets}
              selectedMonth={selectedMonth}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <TransactionFormModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={DEFAULT_CATEGORIES}
        editingTransaction={editingTx}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        categories={DEFAULT_CATEGORIES}
        budgets={budgets}
        onSaveBudgets={handleSaveBudgets}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={transactions}
        categories={DEFAULT_CATEGORIES}
        onRestoreData={handleRestoreData}
        onResetSampleData={handleResetSampleData}
      />
    </div>
  );
}

