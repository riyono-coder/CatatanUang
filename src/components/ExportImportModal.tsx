import React, { useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, RefreshCw, CheckCircle } from 'lucide-react';
import { Transaction, Category } from '../types';
import { exportToCSV } from '../utils/formatters';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
  onRestoreData: (importedTransactions: Transaction[]) => void;
  onResetSampleData: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  categories,
  onRestoreData,
  onResetSampleData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_keuangan_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMsg('File backup JSON berhasil diunduh!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleExportCSV = () => {
    exportToCSV(transactions, categories);
    setSuccessMsg('File laporan CSV berhasil diunduh!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onRestoreData(parsed);
          setSuccessMsg(`Berhasil memulihkan ${parsed.length} data transaksi!`);
          setTimeout(() => {
            setSuccessMsg(null);
            onClose();
          }, 1500);
        } else {
          alert('Format file JSON tidak valid. Pastikan file berisi daftar transaksi.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan format file benar.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cadangan & Ekspor Data</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Kelola atau pulihkan data keuangan Anda</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Ekspor Transaksi ke CSV (Backup Lokal)</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Unduh data transaksi untuk diakses di luar aplikasi</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors" />
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Unduh Backup JSON</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Simpan salinan cadangan lengkap data Anda</p>
              </div>
            </div>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Pulihkan dari Backup JSON</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Unggah file backup untuk mengembalikan data</p>
              </div>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Reset Sample Data */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin memuat ulang data contoh? Data saat ini akan diganti.')) {
                  onResetSampleData();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Muat Ulang Data Contoh (Reset)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
