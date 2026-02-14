
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LOGO_URL } from '../constants';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onLogout: () => void;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, cartCount, onLogout, onOpenCart }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-primary-950 to-primary-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="h-10 w-10 bg-white p-1 rounded-xl shadow-inner" />
              <span className="text-xl font-extrabold tracking-tight hidden sm:block">RNI MART</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 ml-10">
              <Link to="/" className="text-sm font-bold hover:text-accent-yellow transition-colors">KATALOG</Link>
              {user && user.role !== 'Admin' && (
                <Link to="/history" className="text-sm font-bold hover:text-accent-yellow transition-colors">PESANAN SAYA</Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenCart}
              className="relative p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all group border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-primary-900 group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10 hidden sm:block">
                  Halo, {user.nama.split(' ')[0]}
                </span>
                <button 
                  onClick={() => { onLogout(); navigate('/login'); }}
                  className="bg-white text-primary-950 hover:bg-slate-100 px-4 py-2 rounded-full text-xs font-extrabold shadow-sm transition-all active:scale-95"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-accent-yellow text-primary-950 hover:brightness-110 px-6 py-2 rounded-full text-xs font-extrabold shadow-lg transition-all active:scale-95"
              >
                MASUK
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
