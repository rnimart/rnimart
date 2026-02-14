
import { Product, User, Order, AdminStats } from './types';

const INITIAL_PRODUCTS: Product[] = [
  { id: 'P1', nama: 'Beras RNI Premium', deskripsi: 'Beras pulen kualitas super asli petani pilihan.', harga: 75000, stok: 50, url_foto: 'https://picsum.photos/seed/rice/400/300', berat: '5kg', kategori: 'Sembako', type: 'satuan' },
  { id: 'P2', nama: 'Minyak Goreng SunCo', deskripsi: 'Minyak bening tanpa kolesterol.', harga: 38000, stok: 30, url_foto: 'https://picsum.photos/seed/oil/400/300', berat: '2L', kategori: 'Sembako', type: 'satuan' },
  { id: 'P3', nama: 'Indomie Goreng (Karton)', deskripsi: 'Paket hemat satu karton isi 40 pcs.', harga: 115000, stok: 15, url_foto: 'https://picsum.photos/seed/noodle/400/300', berat: 'Karton', kategori: 'Makanan', type: 'satuan' },
  { id: 'P4', nama: 'Paket Sembako Berkah', deskripsi: 'Isi: Beras 5kg, Minyak 1L, Gula 1kg.', harga: 125000, stok: 10, url_foto: 'https://picsum.photos/seed/bundle/400/300', type: 'paket', kategori: 'Paket Hemat' }
];

const INITIAL_CATEGORIES = [
  "Sembako",
  "Makanan",
  "Minuman",
  "Kebutuhan Rumah",
  "Paket Hemat"
];

const INITIAL_USERS: (User & { password?: string })[] = [
  {
    nama: 'Super Administrator',
    username: 'superadmin',
    password: '123',
    role: 'Admin',
    wa: '6285282863008',
    alamat: 'Kantor Pusat RNI Mart Corporate',
    email: 'admin@rnimart.com'
  },
  {
    nama: 'Budi Santoso',
    username: 'budi01',
    password: '123',
    role: 'Customer',
    wa: '628123456789',
    alamat: 'Jl. Merdeka No. 10, Jakarta Pusat',
    email: 'budi@mail.com'
  }
];

export const getStoreData = () => {
  const users = JSON.parse(localStorage.getItem('rni_users') || '[]');
  const products = JSON.parse(localStorage.getItem('rni_products') || JSON.stringify(INITIAL_PRODUCTS));
  const orders = JSON.parse(localStorage.getItem('rni_orders') || '[]');
  const categories = JSON.parse(localStorage.getItem('rni_categories') || JSON.stringify(INITIAL_CATEGORIES));
  
  if (users.length === 0) {
    localStorage.setItem('rni_users', JSON.stringify(INITIAL_USERS));
    return { users: INITIAL_USERS, products, orders, categories };
  }
  
  return { users, products, orders, categories };
};

export const saveProducts = (products: Product[]) => localStorage.setItem('rni_products', JSON.stringify(products));
export const saveOrders = (orders: Order[]) => localStorage.setItem('rni_orders', JSON.stringify(orders));
export const saveUsers = (users: User[]) => localStorage.setItem('rni_users', JSON.stringify(users));
export const saveCategories = (categories: string[]) => localStorage.setItem('rni_categories', JSON.stringify(categories));

export const calculateStats = (orders: Order[]): AdminStats => {
  let omzet = 0;
  let pending = 0;
  let selesai = 0;
  const productSales: Record<string, number> = {};
  const customerSpending: Record<string, number> = {};

  orders.forEach(o => {
    if (o.status === 'Selesai') {
      omzet += o.total_harga;
      selesai++;
      customerSpending[o.customer] = (customerSpending[o.customer] || 0) + o.total_harga;
      o.detail_produk.forEach(item => {
        productSales[item.nama] = (productSales[item.nama] || 0) + item.qty;
      });
    } else if (o.status === 'Pending') {
      pending++;
    }
  });

  const topProducts = Object.entries(productSales)
    .map(([nama, qty]) => ({ nama, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const topCustomers = Object.entries(customerSpending)
    .map(([nama, total]) => ({ nama, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return {
    totalOmzet: omzet,
    totalOrders: orders.length,
    pendingCount: pending,
    selesaiCount: selesai,
    topProducts,
    topCustomers
  };
};
