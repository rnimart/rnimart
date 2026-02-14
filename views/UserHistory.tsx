
import React, { useState } from 'react';
import { Order, User } from '../types';
import { ADMIN_WA_NUMBER, LOGO_URL } from '../constants';

interface UserHistoryProps {
  orders: Order[];
  user: User;
}

const UserHistory: React.FC<UserHistoryProps> = ({ orders, user }) => {
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);
  const myOrders = orders.filter(o => o.customer === user.nama);

  const handleConfirmPayment = (order: Order) => {
    const message = `Halo Admin RNI,\nSaya ingin konfirmasi pembayaran untuk pesanan:\n\n*ID Pesanan:* ${order.id_pesanan}\n*Total:* Rp ${order.total_harga.toLocaleString('id-ID')}\n*Metode:* ${order.metode_bayar}\n\nMohon bantuannya untuk memproses pesanan saya. Terima kasih.`;
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <style>{`
        @media print {
          @page {
            size: A5;
            margin: 10mm;
          }
          body * { visibility: hidden; }
          #invoice-print-content, #invoice-print-content * { visibility: visible; }
          #invoice-print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            border: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between no-print">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pesanan <span className="text-primary-950 underline decoration-accent-yellow">Saya</span></h1>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-right">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">ID MEMBER</span>
           <span className="text-sm font-bold text-slate-700">{user.username}</span>
        </div>
      </div>

      <div className="space-y-6 no-print">
        {myOrders.map(o => (
          <div key={o.id_pesanan} className="bg-white rounded-[40px] p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col gap-6 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 px-4 py-2 rounded-2xl border border-primary-100 text-center">
                  <span className="text-xs font-black text-primary-950 block">{o.id_pesanan}</span>
                  <p className="text-[10px] font-bold text-slate-400">{o.tanggal_order}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    o.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                    o.status === 'Dibatalkan' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {o.status}
                  </span>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    o.status_bayar === 'Sudah Bayar' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {o.status_bayar}
                  </span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Belanja</p>
                <p className="text-2xl font-black text-primary-950">Rp {o.total_harga.toLocaleString('id-ID')}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {o.detail_produk.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
                  <div>
                    <p className="text-sm font-bold text-slate-700">{item.nama}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{item.berat || 'SATUAN'}</p>
                    <p className="text-[10px] font-medium text-slate-400">{item.qty} x Rp {item.harga.toLocaleString('id-ID')}</p>
                  </div>
                  <p className="text-sm font-black text-slate-600">Rp {(item.qty * item.harga).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
              <div className="flex gap-4">
                <div className="text-xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Metode</span>
                  <span className="font-bold text-slate-600">{o.metode_bayar}</span>
                </div>
                <div className="text-xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pengiriman</span>
                  <span className="font-bold text-slate-600">{o.jenis_delivery}</span>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                {o.status_bayar === 'Belum Bayar' && o.status !== 'Dibatalkan' && (
                  <button 
                    onClick={() => handleConfirmPayment(o)}
                    className="flex-1 sm:flex-none bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest"
                  >
                    Konfirmasi Bayar
                  </button>
                )}
                <button 
                  onClick={() => setPreviewOrder(o)}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-[10px] shadow-lg transition-all uppercase tracking-widest ${
                    o.status_bayar === 'Sudah Bayar' 
                    ? 'bg-primary-950 text-white hover:bg-primary-900' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Lihat Invoice
                </button>
              </div>
            </div>
          </div>
        ))}

        {myOrders.length === 0 && (
          <div className="bg-white rounded-[48px] p-20 text-center text-slate-400 shadow-sm border border-slate-100">
             <div className="text-7xl mb-4">📦</div>
             <p className="text-xl font-black text-slate-800 uppercase tracking-tight">Belum Ada Transaksi</p>
          </div>
        )}
      </div>

      {/* MODAL PREVIEW INVOICE */}
      {previewOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setPreviewOrder(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-300">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800">Preview Invoice</h2>
              <div className="flex gap-2">
                <button 
                  onClick={triggerPrint}
                  className="bg-primary-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-primary-900 transition-all"
                >
                  Cetak Sekarang
                </button>
                <button onClick={() => setPreviewOrder(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
              <div id="invoice-print-content" className="p-4 border-2 border-slate-100 rounded-3xl">
                <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-slate-100">
                  <div className="flex items-center gap-4">
                    <img src={LOGO_URL} alt="Logo" className="h-12 w-12" />
                    <div>
                      <h1 className="text-xl font-black text-primary-950 uppercase tracking-tight">RNI MART</h1>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Digital Mall</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">INVOICE</h2>
                    <p className="text-xs font-bold text-slate-400">{previewOrder.id_pesanan}</p>
                    {previewOrder.status_bayar === 'Sudah Bayar' && (
                      <div className="mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase inline-block tracking-widest">LUNAS</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kepada:</p>
                    <p className="font-black text-slate-800">{user.nama}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{previewOrder.alamat_kirim}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detail Transaksi:</p>
                    <p className="text-xs font-bold text-slate-500">{previewOrder.tanggal_order}</p>
                    <p className="text-xs font-bold text-slate-500">Metode: {previewOrder.metode_bayar}</p>
                    <p className="text-xs font-bold text-slate-500">Kirim: {previewOrder.jenis_delivery}</p>
                  </div>
                </div>

                <table className="w-full mb-8 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y-2 border-slate-100">
                      <th className="py-3 px-2 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                      <th className="py-3 px-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-12">Qty</th>
                      <th className="py-3 px-2 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Harga</th>
                      <th className="py-3 px-2 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewOrder.detail_produk.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-2 font-bold text-slate-700 text-[11px] leading-tight">
                          {item.nama}
                          <span className="block text-[9px] text-slate-400 font-medium">({item.berat || '-'})</span>
                        </td>
                        <td className="py-3 px-2 text-center text-[11px] font-black">{item.qty}</td>
                        <td className="py-3 px-2 text-right text-[11px]">Rp {item.harga.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-2 text-right text-[11px] font-black text-slate-800">Rp {(item.qty * item.harga).toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200">
                      <td colSpan={3} className="py-4 px-2 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bayar</td>
                      <td className="py-4 px-2 text-right text-lg font-black text-primary-950">Rp {previewOrder.total_harga.toLocaleString('id-ID')}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="flex justify-between items-end pt-8 border-t border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${previewOrder.id_pesanan}`} className="w-16 h-16 opacity-30" alt="QR" />
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-8 tracking-widest">Manajemen RNI Mart</p>
                    <p className="font-black text-slate-800 text-sm">Valid Digital Document</p>
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

export default UserHistory;
