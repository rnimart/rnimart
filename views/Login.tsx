
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { LOGO_URL } from '../constants';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
  onResetPassword: (username: string, newPass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, users, onResetPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => (u.username === username || u.wa === username) && u.password === password);
    if (user) {
      onLogin(user);
      navigate(user.role === 'Admin' ? '/admin/analytics' : '/');
    } else {
      setError('Username atau Password salah!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-500 border border-slate-100">
        <div className="bg-gradient-to-br from-primary-950 to-primary-800 p-10 text-center text-white space-y-4">
          <img src={LOGO_URL} alt="Logo" className="h-20 w-20 bg-white p-3 rounded-3xl mx-auto shadow-2xl" />
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Masuk Member</h2>
            <p className="text-primary-200 text-sm font-medium opacity-80">Akses fitur eksklusif & hemat RNI Mart.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-2xl border border-red-100 animate-bounce text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ID Member / WhatsApp</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
              placeholder="admin / 628..."
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
              <button 
                type="button" 
                onClick={() => setIsForgotOpen(true)}
                className="text-[10px] font-black text-primary-700 uppercase tracking-widest hover:underline"
              >
                Lupa?
              </button>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-950 text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-primary-900 hover:-translate-y-1 active:scale-95 transition-all"
          >
            MASUK SEKARANG
          </button>

          <div className="text-center pt-4">
             <p className="text-sm text-slate-500 font-medium">Belum punya akun? <Link to="/register" className="text-primary-800 font-black">Daftar Baru</Link></p>
          </div>
        </form>
      </div>

      <ForgotPasswordModal 
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        users={users}
        onReset={onResetPassword}
      />
    </div>
  );
};

export default Login;
