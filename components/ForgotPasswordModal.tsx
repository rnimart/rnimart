
import React, { useState } from 'react';
import { User } from '../types';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onReset: (username: string, newPass: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, users, onReset }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [wa, setWa] = useState('62');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.username === username && u.wa === wa);
    if (user) {
      setStep(2);
    } else {
      setError('Data tidak cocok! Periksa kembali Username dan WhatsApp Anda.');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setError('Password konfirmasi tidak cocok!');
      return;
    }
    if (newPass.length < 3) {
      setError('Password terlalu pendek!');
      return;
    }
    onReset(username, newPass);
    alert('Password berhasil diperbarui! Silakan login kembali.');
    onClose();
    resetState();
  };

  const resetState = () => {
    setStep(1);
    setUsername('');
    setWa('62');
    setNewPass('');
    setConfirmPass('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-primary-950 p-8 text-center text-white">
          <h3 className="text-xl font-black uppercase tracking-tight">
            {step === 1 ? 'Verifikasi Identitas' : 'Reset Password'}
          </h3>
          <p className="text-xs text-primary-200 mt-2">
            {step === 1 
              ? 'Masukkan data Anda untuk memverifikasi kepemilikan akun.' 
              : 'Buatlah password baru yang aman dan mudah diingat.'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-500 text-[10px] font-black p-4 rounded-2xl border border-red-100 uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ID / Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">WhatsApp</label>
                <input 
                  type="text" 
                  value={wa}
                  onChange={e => setWa(e.target.value)}
                  placeholder="628..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-primary-950 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-primary-900 transition-all">
                VERIFIKASI DATA
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password Baru</label>
                <input 
                  type="password" 
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Konfirmasi Password</label>
                <input 
                  type="password" 
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-green-700 transition-all">
                SIMPAN PASSWORD BARU
              </button>
            </form>
          )}

          <button 
            onClick={onClose}
            className="w-full mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
