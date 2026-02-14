
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';

interface CatalogProps {
  products: Product[];
  categories: string[];
  onAddToCart: (p: Product) => void;
}

const Catalog: React.FC<CatalogProps> = ({ products, categories, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'Semua' || p.kategori === activeCategory;
      const matchesSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="bg-accent-yellow text-primary-950 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-lg animate-bounce">
            Enterprise Experience
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Mall Digital <span className="text-accent-yellow">RNI MART</span></h1>
          <p className="text-primary-100 max-w-2xl opacity-90 leading-relaxed font-medium">
            Solusi belanja hemat, aman, dan terpercaya untuk seluruh keluarga Indonesia dengan kualitas layanan korporat.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grad)" />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {['Semua', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold border transition-all ${
                activeCategory === cat 
                ? 'bg-primary-950 text-white border-primary-950 shadow-md scale-105' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-primary-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="w-full md:w-96 relative">
          <input 
            type="text" 
            placeholder="Cari kebutuhan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-12 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col">
            <div 
              onClick={() => setSelectedProduct(product)}
              className="relative h-40 bg-slate-50 rounded-2xl mb-3 flex items-center justify-center p-4 overflow-hidden cursor-pointer"
            >
              <img 
                src={product.url_foto || PLACEHOLDER_IMAGE} 
                alt={product.nama} 
                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
              {product.type === 'paket' && (
                <span className="absolute top-2 left-2 bg-accent-yellow text-primary-950 text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  BUNDLING
                </span>
              )}
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight h-10">{product.nama}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.berat || 'SATUAN'}</p>
              <div className="flex items-center justify-between pt-2 mt-auto">
                <span className="text-sm font-black text-primary-950">Rp {product.harga.toLocaleString('id-ID')}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                  className="bg-primary-950 text-white p-1.5 rounded-lg hover:bg-primary-800 transition-colors shadow-md active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 italic">
            Produk tidak ditemukan...
          </div>
        )}
      </div>

      {/* MODAL DETAIL PRODUK */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300 max-h-[90vh]">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg text-slate-400 hover:text-primary-950 hover:scale-110 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="md:w-1/2 bg-slate-50 p-8 md:p-12 flex items-center justify-center relative">
              <img 
                src={selectedProduct.url_foto || PLACEHOLDER_IMAGE} 
                alt={selectedProduct.nama} 
                className="max-w-full max-h-[300px] md:max-h-full object-contain"
              />
              <div className="absolute top-8 left-8">
                <span className="bg-primary-950 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {selectedProduct.kategori || 'UNCATEGORIZED'}
                </span>
              </div>
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 leading-tight mb-2">{selectedProduct.nama}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-lg">
                      {selectedProduct.berat || 'Satuan Standar'}
                    </span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                      selectedProduct.type === 'paket' ? 'bg-accent-yellow text-primary-950' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {selectedProduct.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-[2px] bg-slate-200"></span>
                    Deskripsi Produk
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {selectedProduct.deskripsi || "Tidak ada deskripsi tambahan untuk produk ini."}
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga Terbaik</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${selectedProduct.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedProduct.stok > 0 ? `STOK: ${selectedProduct.stok}` : 'HABIS'}
                    </span>
                  </div>
                  <p className="text-4xl font-black text-primary-950">
                    Rp {selectedProduct.harga.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-auto flex gap-4">
                <button 
                  onClick={() => { onAddToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex-1 bg-primary-950 text-white py-5 rounded-[24px] font-black text-sm shadow-xl hover:bg-primary-900 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Tambah Ke Troli
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
