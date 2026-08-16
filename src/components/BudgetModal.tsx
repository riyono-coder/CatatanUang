import React, { useState } from 'react';
import { X, Save, Target } from 'lucide-react';
import { Category, CategoryBudget } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  budgets: CategoryBudget[];
  onSaveBudgets: (updatedBudgets: CategoryBudget[]) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  categories,
  budgets,
  onSaveBudgets,
}) => {
  const expenseCategories = categories.filter((c) => c.type === 'pengeluaran');
  
  const budgetMap = new Map<string, number>(budgets.map((b) => [b.categoryId, b.monthlyLimit]));

  const [limits, setLimits] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    expenseCategories.forEach((c) => {
      initial[c.id] = (budgetMap.get(c.id) || 0).toString();
    });
    return initial;
  });

  if (!isOpen) return null;

  const handleLimitChange = (catId: string, val: string) => {
    setLimits((prev) => ({ ...prev, [catId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CategoryBudget[] = Object.entries(limits).map(([catId, valStr]) => ({
      categoryId: catId,
      monthlyLimit: parseFloat(String(valStr)) || 0,
    }));
    onSaveBudgets(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Atur Batas Anggaran Bulanan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tetapkan batas pengeluaran maksimum per kategori</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {expenseCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CategoryIcon name={cat.icon} color={cat.color} className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{cat.name}</span>
              </div>
              <div className="relative w-36 shrink-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={limits[cat.id] ?? ''}
                  onChange={(e) => handleLimitChange(cat.id, e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ))}

          <div className="pt-4 sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan Anggaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
