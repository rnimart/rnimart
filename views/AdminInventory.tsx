
import React, { useState, useRef, useMemo } from 'react';
import { Product, ProductType } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';

interface AdminInventoryProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  categories: string[];
  onAddCategory: (newCat: string) => void;
}

const AdminInventory: React.FC<AdminInventoryProps> = ({ products, setProducts, categories, onAddCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State untuk checklist isi paket
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    harga: 0,
    stok: 0,
    berat: '',
    kategori: categories[0] || '',
    type: 'satuan' as ProductType,
    deskripsi: '',
    url_foto: ''
  });

  // Ambil daftar produk satuan untuk opsi bundling
  const availableSatuan = useMemo(() => {
    return products.filter(p => p.type === 'satuan');
  }, [products]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, url_foto: base64String }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      nama: p.nama,
      harga: p.harga,
      stok: p.stok,
      berat: p.berat || '',
      kategori: p.kategori || categories[0],
      type: p.type,
      deskripsi: p.deskripsi,
      url_foto: p.url_foto
    });

    // Jika paket, ekstrak item dari deskripsi atau field lain jika ada
    if (p.type === 'paket') {
      const items = p.deskripsi.replace('Isi Paket: ', '').split(', ');
      setSelectedItems(items);
    } else {
      setSelectedItems([]);
    }

    setIsAddingNewCategory(false);
    setIsModalOpen(true);
  };

  const handleToggleItem = (itemName: string) => {
    setSelectedItems(prev => 
      prev.includes(itemName) 
      ? prev.filter(i => i !== itemName) 
      : [...prev, itemName]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalKategori = formData.kategori;
    if (isAddingNewCategory && newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      finalKategori = newCategoryName.trim();
    }

    // Jika paket, update deskripsi berdasarkan pilihan checklist
    let finalDeskripsi = formData.deskripsi;
    if (formData.type === 'paket' && selectedItems.length > 0) {
      finalDeskripsi = `Isi Paket: ${selectedItems.join(', ')}`;
    }

    const updatedData = { 
      ...formData, 
      kategori: finalKategori, 
      deskripsi: finalDeskripsi 
    };

    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...updatedData } : p));
    } else {
      const newProduct: Product = {
        ...updatedData,
        id: `PRD-${Date.now()}`
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Hapus produk ini?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAddingNewCategory(false);
    setNewCategoryName('');
    setSelectedItems([]);
    setFormData({
      nama: '',
      harga: 0,
      stok: 0,
      berat: '',
      kategori: categories[0] || '',
      type: 'satuan',
      deskripsi: '',
      url_foto: ''
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventaris <span className="text-primary-950 underline decoration-accent-yellow">Gudang</span></h1>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary-950 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-primary-800 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          TAMBAH PRODUK
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Info Produk</th>
                <th className="px-6 py-5">Jenis</th>
                <th className="px-6 py-5">Kategori</th>
                <th className="px-6 py-5">Harga</th>
                <th className="px-6 py-5">Stok</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={p.url_foto || PLACEHOLDER_IMAGE} className="w-12 h-12 rounded-xl object-contain bg-slate-100 p-1" />
                      <div>
                        <p className="font-bold text-slate-800">{p.nama}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">{p.berat || 'SATUAN'} | {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      p.type === 'paket' ? 'bg-accent-yellow text-primary-950' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {p.kategori || 'UNCATEGORIZED'}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-black text-primary-950">
                    Rp {p.harga.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                      p.stok > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.stok} UNIT
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2 hover:bg-primary-50 rounded-lg text-primary-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form 
            onSubmit={handleSave}
            className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-8 space-y-6 overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <h2 className="text-2xl font-black text-slate-800">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Jenis Produk</label>
              <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'satuan'})}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${formData.type === 'satuan' ? 'bg-white text-primary-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  SATUAN
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'paket'})}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${formData.type === 'paket' ? 'bg-primary-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  BUNDLING / PAKET
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Foto Produk</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative border-2 border-dashed border-slate-200 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer overflow-hidden min-h-[140px]"
                >
                  {formData.url_foto ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <img src={formData.url_foto} className="h-24 w-24 object-contain rounded-2xl shadow-lg mb-1" alt="Preview" />
                      <span className="text-[10px] font-bold text-primary-700">Ganti Foto</span>
                    </div>
                  ) : (
                    <>
                      <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="font-bold text-slate-600 text-sm">Pilih Foto</p>
                    </>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-primary-950 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama {formData.type === 'paket' ? 'Paket' : 'Produk'}</label>
                <input 
                  type="text" 
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  required
                />
              </div>

              {formData.type === 'paket' && (
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest ml-2">Pilih Isi Paket (Ceklis Produk)</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-4 max-h-48 overflow-y-auto custom-scrollbar grid grid-cols-2 gap-2">
                    {availableSatuan.map(p => (
                      <label 
                        key={p.id} 
                        className={`flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${
                          selectedItems.includes(p.nama) ? 'bg-primary-50 border-primary-200' : 'bg-white border-transparent'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedItems.includes(p.nama)}
                          onChange={() => handleToggleItem(p.nama)}
                        />
                        <img src={p.url_foto || PLACEHOLDER_IMAGE} className="w-8 h-8 rounded-lg object-contain bg-slate-100" />
                        <div className="flex-1 overflow-hidden">
                           <p className="text-xs font-bold text-slate-700 truncate">{p.nama}</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Rp {p.harga.toLocaleString('id-ID')} | {p.berat || '-'}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Harga (Rp)</label>
                <input 
                  type="number" 
                  value={formData.harga}
                  onChange={e => setFormData({ ...formData, harga: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Stok</label>
                <input 
                  type="number" 
                  value={formData.stok}
                  onChange={e => setFormData({ ...formData, stok: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Berat / Satuan</label>
                <input 
                  type="text" 
                  value={formData.berat}
                  onChange={e => setFormData({ ...formData, berat: e.target.value })}
                  placeholder={formData.type === 'paket' ? 'Contoh: Paket 3kg' : 'Contoh: 5kg'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kategori</label>
                <select 
                  value={isAddingNewCategory ? 'NEW' : formData.kategori}
                  onChange={e => {
                    if (e.target.value === 'NEW') setIsAddingNewCategory(true);
                    else { setIsAddingNewCategory(false); setFormData({ ...formData, kategori: e.target.value }); }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="NEW" className="font-bold text-primary-700">+ Tambah Baru...</option>
                </select>
              </div>
            </div>

            {isAddingNewCategory && (
              <div className="p-4 bg-primary-50 rounded-3xl border border-primary-100 space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-primary-950 uppercase tracking-widest">Nama Kategori Baru</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="flex-1 bg-white border border-primary-200 rounded-xl px-4 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Deskripsi</label>
              <textarea 
                value={formData.deskripsi}
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex gap-4">
               <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 font-bold text-sm">BATAL</button>
               <button type="submit" className="flex-[2] bg-primary-950 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-900 transition-all">SIMPAN DATA</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
