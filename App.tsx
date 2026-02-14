
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, Product, Order } from './types';
import { getStoreData, saveProducts, saveOrders, saveUsers, saveCategories } from './store';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Catalog from './views/Catalog';
import Login from './views/Login';
import Register from './views/Register';
import AdminAnalytics from './views/AdminAnalytics';
import AdminInventory from './views/AdminInventory';
import AdminOrders from './views/AdminOrders';
import AdminCustomers from './views/AdminCustomers';
import UserHistory from './views/UserHistory';
import CartModal from './components/CartModal';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const data = getStoreData();
    setProducts(data.products);
    setOrders(data.orders);
    setUsers(data.users);
    setCategories(data.categories);

    const session = localStorage.getItem('rni_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('rni_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rni_session');
  };

  const handleAddCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      const updated = [...categories, newCat];
      setCategories(updated);
      saveCategories(updated);
    }
  };

  const handleResetPassword = (username: string, newPass: string) => {
    const updatedUsers = users.map(u => u.username === username ? { ...u, password: newPass } : u);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.username === updatedUser.username ? updatedUser : u);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    // Jika user yang diedit adalah user yang sedang login, update sesinya juga
    if (currentUser && currentUser.username === updatedUser.username) {
      setCurrentUser(updatedUser);
      localStorage.setItem('rni_session', JSON.stringify(updatedUser));
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(item => item.qty > 0);
    });
  };

  const clearCart = () => setCart([]);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar 
          user={currentUser} 
          cartCount={cart.reduce((a, b) => a + b.qty, 0)} 
          onLogout={handleLogout} 
          onOpenCart={() => setIsCartOpen(true)}
        />
        
        <div className="flex flex-1">
          {currentUser?.role === 'Admin' && <Sidebar />}
          
          <main className={`flex-1 p-4 md:p-8 ${currentUser?.role === 'Admin' ? 'bg-white' : 'bg-slate-50'}`}>
            <Routes>
              <Route path="/" element={<Catalog products={products} categories={categories} onAddToCart={addToCart} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} users={users} onResetPassword={handleResetPassword} />} />
              <Route path="/register" element={<Register users={users} onRegister={(u) => { setUsers([...users, u]); saveUsers([...users, u]); }} />} />
              
              <Route path="/admin/analytics" element={
                currentUser?.role === 'Admin' ? <AdminAnalytics orders={orders} /> : <Navigate to="/" />
              } />
              <Route path="/admin/inventory" element={
                currentUser?.role === 'Admin' ? (
                  <AdminInventory 
                    products={products} 
                    setProducts={(p) => { setProducts(p); saveProducts(p); }} 
                    categories={categories}
                    onAddCategory={handleAddCategory}
                  />
                ) : <Navigate to="/" />
              } />
              <Route path="/admin/orders" element={
                currentUser?.role === 'Admin' ? <AdminOrders orders={orders} setOrders={(o) => { setOrders(o); saveOrders(o); }} /> : <Navigate to="/" />
              } />
              <Route path="/admin/customers" element={
                currentUser?.role === 'Admin' ? <AdminCustomers users={users} onUpdateUser={handleUpdateUser} /> : <Navigate to="/" />
              } />
              
              <Route path="/history" element={
                currentUser ? <UserHistory orders={orders} user={currentUser} /> : <Navigate to="/login" />
              } />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>

        <footer className="bg-primary-950 text-white py-6 text-center text-sm font-semibold tracking-wider uppercase">
          Copyright @RNI MART 2026 I HAK CIPTA DILINDUNGI
        </footer>

        <CartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          onUpdateQty={updateCartQty}
          onCheckout={(order) => {
            const newOrders = [order, ...orders];
            setOrders(newOrders);
            saveOrders(newOrders);
            clearCart();
            setIsCartOpen(false);
          }}
          user={currentUser}
        />
      </div>
    </HashRouter>
  );
};

export default App;
