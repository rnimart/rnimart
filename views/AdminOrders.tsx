
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { LOGO_URL } from '../constants';

interface AdminOrdersProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, setOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id_pesanan === id ? { ...o, status: newStatus } : o));
  };

  const handlePaymentStatusChange = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id_pesanan === id ? { ...o, status_bayar: newStatus } : o));
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <style>{`
        @media print {
          @page {
            size: A5;
            margin: 5mm;
          }
          body * { visibility: hidden; }
          #packing-slip-content, #packing-slip-content * { visibility: visible; }
          #packing-slip-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 8px !important;
            border: 2px solid black !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <h1 className="text-3xl font-black text-slate-800 tracking-tight no-print">Laporan <span className="text-primary-950 underline decoration-accent-yellow">Penjualan</span></h1>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Rincian Produk</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5">Status Pesanan</th>
                <th className="px-6 py-5">Pembayaran</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {orders.map(o => (
                <tr key={o.id_pesanan} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-800">{o.id_pesanan}</span>
                    <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">{o.tanggal_order}</p>
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-700">{o.customer}</td>
                  <td className="px-6 py-6 max-w-xs">
                    <div className="space-y-2">
                      {o.detail_produk.map((item, idx) => (
                        <div key={idx} className="text-[11px] leading-tight">
                          <span className="font-bold text-slate-700 block">{item.nama} ({item.berat || '-'})</span>
                          <span className="text-slate-400 font-medium">Rp {item.harga.toLocaleString('id-ID')} x {item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6 font-black text-primary-950">Rp {o.total_harga.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-6">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id_pesanan, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-none cursor-pointer ${
                        o.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                        o.status === 'Dibatalkan' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </td>
                  <td className="px-6 py-6">
                    <select
                      value={o.status_bayar}
                      onChange={(e) => handlePaymentStatusChange(o.id_pesanan, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-none cursor-pointer ${
                        o.status_bayar === 'Sudah Bayar' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <option value="Belum Bayar">Belum Bayar</option>
                      <option value="Sudah Bayar">Sudah Bayar</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedOrder(o)}
                      className="p-2 bg-slate-100 hover:bg-primary-950 hover:text-white rounded-lg transition-all"
                      title="Preview & Print Packing Slip"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PREVIEW PACKING SLIP */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-300">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800">Preview Packing Slip (A5)</h2>
              <div className="flex gap-2">
                <button onClick={triggerPrint} className="bg-primary-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-primary-900 transition-all">Print Slip</button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-100 flex justify-center custom-scrollbar">
              <div id="packing-slip-content" className="w-full bg-white p-6 border-2 border-black font-mono text-[9px] leading-tight shadow-sm">
                <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <img src={LOGO_URL} alt="Logo" className="h-8 w-8 object-contain" />
                    <div>
                      <h2 className="text-sm font-black leading-none">RNI MART</h2>
                      <p className="text-[7px] font-bold uppercase tracking-tighter">Enterprise Digital Mall</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-black underline">PACKING SLIP</h3>
                    <p className="font-bold text-[10px]">{selectedOrder.id_pesanan}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="font-black uppercase text-[8px] mb-0.5">Penerima:</p>
                    <p className="font-black text-[10px]">{selectedOrder.customer}</p>
                    <p className="mt-0.5 leading-tight">{selectedOrder.alamat_kirim}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black uppercase text-[8px] mb-0.5">Logistik:</p>
                    <p className="font-bold">{selectedOrder.jenis_delivery}</p>
                    <div className={`mt-1 inline-block px-1.5 py-0.5 border border-black font-black uppercase text-[8px] ${selectedOrder.status_bayar === 'Sudah Bayar' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {selectedOrder.status_bayar}
                    </div>
                  </div>
                </div>

                <table className="w-full mb-3 border-collapse">
                  <thead>
                    <tr className="border-y-2 border-black bg-slate-100">
                      <th className="py-1 text-left px-1 uppercase font-black">Item</th>
                      <th className="py-1 text-center w-10 uppercase font-black">Qty</th>
                      <th className="py-1 text-right w-20 uppercase font-black">Harga</th>
                      <th className="py-1 text-right w-20 uppercase font-black">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {selectedOrder.detail_produk.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-1 px-1 font-bold">
                          {item.nama}
                          <span className="block text-[7px] text-slate-500 font-medium">({item.berat || '-'})</span>
                        </td>
                        <td className="py-1 px-1 text-center font-black">{item.qty}</td>
                        <td className="py-1 px-1 text-right">Rp {item.harga.toLocaleString('id-ID')}</td>
                        <td className="py-1 px-1 text-right font-black">Rp {(item.qty * item.harga).toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-black font-black">
                      <td colSpan={3} className="py-1.5 px-1 text-right uppercase text-[10px]">Total Pembayaran</td>
                      <td className="py-1.5 px-1 text-right text-[11px]">Rp {selectedOrder.total_harga.toLocaleString('id-ID')}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="mt-2 pt-2 border-t-2 border-dotted border-black flex justify-between items-end">
                  <div className="max-w-[200px]">
                    <p className="text-[7px] italic leading-tight">* Harap periksa kembali barang sebelum kurir berangkat.</p>
                    <p className="text-[7px] italic leading-tight">* Bukti terima yang sah untuk klaim kekurangan.</p>
                    <div className="mt-1 w-12 h-12 opacity-30">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${selectedOrder.id_pesanan}`} alt="QR" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-bold uppercase mb-6">Petugas Logistik</p>
                    <div className="w-20 border-b border-black mx-auto"></div>
                    <p className="text-[7px] mt-0.5">( {selectedOrder.tanggal_order} )</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
