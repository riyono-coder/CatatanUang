import { Transaction } from '../types';

export const getSampleTransactions = (): Transaction[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // Create previous month string
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = String(prevMonthDate.getMonth() + 1).padStart(2, '0');

  return [
    // Current Month Transactions
    {
      id: 'tx-1',
      type: 'pemasukan',
      amount: 8500000,
      categoryId: 'gaji',
      date: `${year}-${month}-01`,
      description: 'Gaji Bulanan Perusahaan',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    },
    {
      id: 'tx-2',
      type: 'pemasukan',
      amount: 1200000,
      categoryId: 'freelance',
      date: `${year}-${month}-05`,
      description: 'Projek Design Website Client',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    },
    {
      id: 'tx-3',
      type: 'pengeluaran',
      amount: 2000000,
      categoryId: 'tempat_tinggal',
      date: `${year}-${month}-02`,
      description: 'Bayar Kontrakan Bulanan',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
    },
    {
      id: 'tx-4',
      type: 'pengeluaran',
      amount: 450000,
      categoryId: 'tagihan',
      date: `${year}-${month}-03`,
      description: 'Listrik PLN & Tagihan WiFi Indihome',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
    {
      id: 'tx-5',
      type: 'pengeluaran',
      amount: 650000,
      categoryId: 'belanja',
      date: `${year}-${month}-04`,
      description: 'Belanja Bulanan Supermarket',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    },
    {
      id: 'tx-6',
      type: 'pengeluaran',
      amount: 185000,
      categoryId: 'makanan',
      date: `${year}-${month}-06`,
      description: 'Makan Malam Restoran Bersama Keluarga',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    },
    {
      id: 'tx-7',
      type: 'pengeluaran',
      amount: 250000,
      categoryId: 'transportasi',
      date: `${year}-${month}-07`,
      description: 'Isi Bensin Mobil & Top up Flazz',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    },
    {
      id: 'tx-8',
      type: 'pengeluaran',
      amount: 120000,
      categoryId: 'hiburan',
      date: `${year}-${month}-08`,
      description: 'Tiket Bioskop XXI & Popcorn',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: 'tx-9',
      type: 'pengeluaran',
      amount: 320000,
      categoryId: 'makanan',
      date: `${year}-${month}-09`,
      description: 'Stock Kopi & Makanan Mingguan GoFood',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: 'tx-10',
      type: 'pemasukan',
      amount: 500000,
      categoryId: 'investasi',
      date: `${year}-${month}-10`,
      description: 'Dividen Reksa Dana & Saham',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    },

    // Previous Month Transactions
    {
      id: 'tx-prev-1',
      type: 'pemasukan',
      amount: 8500000,
      categoryId: 'gaji',
      date: `${prevYear}-${prevMonth}-01`,
      description: 'Gaji Bulanan Perusahaan',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
    },
    {
      id: 'tx-prev-2',
      type: 'pengeluaran',
      amount: 2000000,
      categoryId: 'tempat_tinggal',
      date: `${prevYear}-${prevMonth}-02`,
      description: 'Bayar Kontrakan Bulanan',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 39,
    },
    {
      id: 'tx-prev-3',
      type: 'pengeluaran',
      amount: 1800000,
      categoryId: 'makanan',
      date: `${prevYear}-${prevMonth}-15`,
      description: 'Akumulasi Makanan Bulan Lalu',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    },
    {
      id: 'tx-prev-4',
      type: 'pengeluaran',
      amount: 750000,
      categoryId: 'transportasi',
      date: `${prevYear}-${prevMonth}-18`,
      description: 'Biaya Transportasi Bulan Lalu',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
    },
  ];
};
