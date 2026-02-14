
import React, { useState } from 'react';
import { User, Role } from '../types';

interface AdminCustomersProps {
  users: User[];
  onUpdateUser: (updatedUser: User) => void;
}

const AdminCustomers: React.FC<AdminCustomersProps> = ({ users, onUpdateUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser);
      setIsModalOpen(false);
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-slate-800 tracking-tight">Database <span className="text-primary-950 underline decoration-accent-yellow">Member</span></h1>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-5">Nama Member</th>
                <th className="px-6 py-5">ID / Username</th>
                <th className="px-6 py-5">WhatsApp</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Alamat</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.username} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-800">{u.nama}</div>
                    <div className="text-[10px] font-medium text-slate-400">{u.email || '-'}</div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg text-xs">
                      {u.username}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <a href={`https://wa.me/${u.wa}`} target="_blank" className="font-bold text-primary-700 hover:underline">
                      +{u.wa}
                    </a>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest ${
                      u.role === 'Admin' ? 'bg-primary-950 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{u.alamat || '-'}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleEditClick(u)}
                      className="p-2 bg-primary-50 text-primary-600 hover:bg-primary-950 hover:text-white rounded-xl transition-all shadow-sm"
                      title="Edit Member"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form 
            onSubmit={handleSave}
            className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-8 space-y-6 animate-in zoom-in duration-300"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">Edit <span className="text-primary-950">Informasi Member</span></h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editingUser.nama}
                  onChange={e => setEditingUser({ ...editingUser, nama: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Username (ID)</label>
                <input 
                  type="text" 
                  value={editingUser.username}
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-500 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">WhatsApp</label>
                <input 
                  type="text" 
                  value={editingUser.wa}
                  onChange={e => setEditingUser({ ...editingUser, wa: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
                <input 
                  type="email" 
                  value={editingUser.email || ''}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Role Akses</label>
                <select 
                  value={editingUser.role}
                  onChange={e => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Alamat Pengiriman</label>
                <textarea 
                  value={editingUser.alamat || ''}
                  onChange={e => setEditingUser({ ...editingUser, alamat: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="flex-[2] bg-primary-950 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-900 transition-all uppercase tracking-widest"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
