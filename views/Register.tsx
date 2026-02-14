
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

interface RegisterProps {
  onRegister: (user: User) => void;
  users: User[];
}

const Register: React.FC<RegisterProps> = ({ onRegister, users }) => {
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    wa: '62',
    email: '',
    alamat: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.username === formData.username)) {
      alert("Username sudah terpakai!");
      return;
    }
    const newUser: User = { ...formData, role: 'Customer' };
    onRegister(newUser);
    alert("Pendaftaran Berhasil!");
    navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in fade-in duration-500 border border-slate-100">
        <div className="bg-primary-950 p-10 text-center text-white">
          <h2 className="text-2xl font-black uppercase tracking-tight">Buat Akun Member</h2>
          <p className="text-primary-200 text-sm font-medium opacity-80 mt-2">Daftarkan diri Anda untuk kemudahan belanja hemat.</p>
        </div>

        <form onSubmit={handleRegister} className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ID / Username</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nomor WhatsApp</label>
              <input 
                type="text" 
                value={formData.wa}
                onChange={e => setFormData({ ...formData, wa: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Alamat Pengiriman</label>
              <textarea 
                value={formData.alamat}
                onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password Baru</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-950 text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-primary-900 hover:-translate-y-1 active:scale-95 transition-all"
          >
            DAFTAR SEKARANG
          </button>

          <div className="text-center pt-2">
             <p className="text-sm text-slate-500 font-medium">Sudah punya akun? <Link to="/login" className="text-primary-800 font-black">Masuk</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
