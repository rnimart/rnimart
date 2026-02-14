
import React, { useState } from 'react';
import { Product, Order, OrderItem, User } from '../types';
import { PAYMENT_METHODS, DELIVERY_TYPES, PLACEHOLDER_IMAGE, ADMIN_WA_NUMBER } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { product: Product; qty: number }[];
  onUpdateQty: (pid: string, delta: number) => void;
  onCheckout: (order: Order) => void;
  user: User | null;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart, onUpdateQty, onCheckout, user }) => {
  const [delivery, setDelivery] = useState(DELIVERY_TYPES[0].id);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].id);

  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.product.harga * item.qty), 0);

  const handleProcessOrder = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk checkout.");
      return;
    }

    const orderId = `RNI-${Date.now().toString().slice(-6)}`;
    const detailProduk: OrderItem[] = cart.map(item => ({
      nama: item.product.nama,
      qty: item.qty,
      harga: item.product.harga,
      berat: item.product.berat
    }));

    const newOrder: Order = {
      id_pesanan: orderId,
      customer: user.nama,
      detail_produk: detailProduk,
      total_harga: total,
      metode_bayar: payment,
      jenis_delivery: delivery,
      tanggal_order: new Date().toISOString().split('T')[0],
      status: 'Pending',
      alamat_kirim: user.alamat || '-',
      status_bayar: 'Belum Bayar'
    };

    onCheckout(newOrder);

    // WhatsApp Direct
    const message = `Halo Admin RNI,\nSaya *${user.nama}* konfirmasi ID *${orderId}*:\n${detailProduk.map(i => `- ${i.nama} (${i.berat || 'N/A'}) (x${i.qty})`).join('\n')}\n*Total: Rp ${total.toLocaleString('id-ID')}*`;
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <span className="bg-primary-950 p-2 rounded-xl text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </span>
            Troli Belanja
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-bold">Troli kosong melompong!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <img src={item.product.url_foto || PLACEHOLDER_IMAGE} className="w-16 h-16 object-contain bg-white rounded-2xl" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{item.product.nama}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{item.product.berat || 'SATUAN'}</p>
                  <p className="text-primary-800 font-black text-xs">Rp {item.product.harga.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full shadow-sm">
                  <button onClick={() => onUpdateQty(item.product.id, -1)} className="text-primary-800 font-black text-lg">-</button>
                  <span className="text-sm font-black w-6 text-center">{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.product.id, 1)} className="text-primary-800 font-black text-lg">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t space-y-6 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengiriman</label>
                <select 
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  {DELIVERY_TYPES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pembayaran</label>
                <select 
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  {PAYMENT_METHODS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
            </div>

            {payment === 'QRIS' && (
              <div className="p-4 bg-primary-50 rounded-3xl flex flex-col items-center border border-primary-100 animate-in zoom-in duration-300">
                <p className="text-[10px] font-black text-primary-900 uppercase tracking-widest mb-3">Scan QRIS Instan</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RNI_MART" className="w-32 h-32 border-4 border-white rounded-2xl shadow-lg mb-2" />
                <span className="font-bold text-primary-950 text-sm">RNI MART DIGITAL</span>
              </div>
            )}

            {payment === 'Transfer' && (
              <div className="p-4 bg-primary-50 rounded-3xl text-center border border-primary-100 animate-in zoom-in duration-300">
                <p className="text-[10px] font-black text-primary-900 uppercase tracking-widest mb-2">REKENING BCA</p>
                <div className="text-2xl font-black text-primary-950">1234 567 890</div>
                <p className="text-xs font-bold text-slate-500 mt-1">a/n RNI MART</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bayar</p>
                <p className="text-3xl font-black text-primary-950">Rp {total.toLocaleString('id-ID')}</p>
              </div>
              <button 
                onClick={handleProcessOrder}
                className="bg-primary-950 text-white px-10 py-4 rounded-3xl font-black text-sm shadow-xl hover:bg-primary-900 hover:scale-105 active:scale-95 transition-all"
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
