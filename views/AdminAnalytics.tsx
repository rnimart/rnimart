
import React, { useMemo, useState, useEffect } from 'react';
import { Order, AdminStats } from '../types';
import { calculateStats } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getBusinessInsights } from '../services/gemini';

const COLORS = ['#4a148c', '#7b1fa2', '#9c27b0', '#ab47bc', '#ba68c8'];

interface AdminAnalyticsProps {
  orders: Order[];
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ orders }) => {
  const stats = useMemo(() => calculateStats(orders), [orders]);
  const [insight, setInsight] = useState<string>("Sedang menganalisis performa bisnis...");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const res = await getBusinessInsights(stats);
      setInsight(res || "Terjadi kesalahan saat memuat insight.");
      setLoadingInsight(false);
    };
    if (stats.totalOrders > 0) {
      fetchInsight();
    }
  }, [stats]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analisis <span className="text-primary-950 underline decoration-accent-yellow">Mall Digital</span></h1>
        <div className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full uppercase tracking-widest">
          Live Real-time Feed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'OMZET TOTAL', val: `Rp ${stats.totalOmzet.toLocaleString('id-ID')}`, color: 'border-green-500', icon: '💰' },
          { label: 'TRANSAKSI', val: stats.totalOrders, color: 'border-blue-500', icon: '📈' },
          { label: 'PENDING', val: stats.pendingCount, color: 'border-amber-500', icon: '⏳' },
          { label: 'SELESAI', val: stats.selesaiCount, color: 'border-purple-500', icon: '✅' },
        ].map(s => (
          <div key={s.label} className={`bg-white p-6 rounded-[32px] border-b-8 ${s.color} shadow-xl hover:scale-105 transition-all`}>
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-slate-400 tracking-widest">{s.label}</span>
               <span className="text-xl">{s.icon}</span>
            </div>
            <div className="text-2xl font-black text-slate-800">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-[450px]">
            <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-600 rounded-full"></span>
              Produk Terlaris (Qty)
            </h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={stats.topProducts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="nama" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="qty" fill="#4a148c" radius={[10, 10, 0, 0]}>
                  {stats.topProducts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-primary-950 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <h3 className="font-extrabold text-xl mb-4 flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-xl">🤖</span>
              Gemini AI Business Insight
            </h3>
            <p className={`text-lg leading-relaxed italic ${loadingInsight ? 'animate-pulse opacity-50' : 'opacity-100'} transition-opacity`}>
              "{insight}"
            </p>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-yellow/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full"></span>
              Pelanggan Loyal
            </h3>
            <div className="space-y-4">
              {stats.topCustomers.map((c, i) => (
                <div key={c.nama} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">{i+1}</span>
                    <span className="font-bold text-slate-700">{c.nama}</span>
                  </div>
                  <span className="font-black text-primary-900">Rp {c.total.toLocaleString('id-ID')}</span>
                </div>
              ))}
              {stats.topCustomers.length === 0 && <p className="text-center text-slate-400 py-4 italic text-sm">Belum ada data</p>}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
             <h3 className="font-bold text-lg mb-2">Order Distribution</h3>
             <ResponsiveContainer width="100%" height={200}>
               <PieChart>
                 <Pie
                   data={[
                     { name: 'Completed', value: stats.selesaiCount },
                     { name: 'Pending', value: stats.pendingCount }
                   ]}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   <Cell fill="#8b5cf6" />
                   <Cell fill="#fcd34d" />
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex justify-center gap-6 mt-2">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                 <span className="text-xs font-bold text-slate-500">Selesai</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-accent-yellow"></div>
                 <span className="text-xs font-bold text-slate-500">Pending</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
