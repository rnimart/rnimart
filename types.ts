
export type Role = 'Admin' | 'Customer';

export interface User {
  nama: string;
  username: string;
  role: Role;
  wa: string;
  email?: string;
  alamat?: string;
  password?: string;
}

export type ProductType = 'satuan' | 'paket';

export interface Product {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  url_foto: string;
  berat?: string;
  kategori?: string;
  type: ProductType;
}

export type OrderStatus = 'Pending' | 'Selesai' | 'Dibatalkan';

export interface OrderItem {
  nama: string;
  qty: number;
  harga: number;
  berat?: string;
}

export interface Order {
  id_pesanan: string;
  customer: string;
  detail_produk: OrderItem[];
  total_harga: number;
  metode_bayar: string;
  jenis_delivery: string;
  tanggal_order: string;
  status: OrderStatus;
  alamat_kirim: string;
  status_bayar: string;
}

export interface AdminStats {
  totalOmzet: number;
  totalOrders: number;
  pendingCount: number;
  selesaiCount: number;
  topProducts: { nama: string; qty: number }[];
  topCustomers: { nama: string; total: number }[];
}
