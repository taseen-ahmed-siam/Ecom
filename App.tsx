import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { Login } from './pages/Login';
import { Checkout } from './pages/Checkout';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { CartSidebar } from './components/CartSidebar';
import { AiAssistant } from './components/AiAssistant';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Product, CartItem, User, Order, OrderStatus } from './types';
import { api } from './services/api';

// State Management (Context)
interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  login: (user: User) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  fetchProducts: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch Products on Mount using Mock API
  const fetchProducts = async () => {
    try {
      const data = await api.products.list();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Persistence
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { 
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Actions
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  // Auth Actions
  const login = (userData: User) => setUser(userData);
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Admin Actions
  const addProduct = async (product: Product) => {
     try {
       await api.products.create(product);
       fetchProducts(); 
     } catch (e) {
       console.error(e);
     }
  };
  
  const updateProduct = async (updatedProduct: Product) => {
     try {
       await api.products.update(updatedProduct);
       fetchProducts();
     } catch (e) {
       console.error(e);
     }
  };

  const deleteProduct = async (id: string) => {
     try {
       await api.products.delete(id);
       fetchProducts();
     } catch (e) {
       console.error(e);
     }
  };

  // Order Actions
  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    
    // Sync with backend
    if (user && (user as any).token) {
       try {
         await api.orders.updateStatus(id, status, (user as any).token);
       } catch (e) {
         console.error("Failed to update status on server", e);
       }
    }
  };

  return (
    <StoreContext.Provider value={{
      products, cart, user, orders, isCartOpen, 
      toggleCart, addToCart, removeFromCart, updateQuantity, clearCart,
      addProduct, updateProduct, deleteProduct,
      login, logout,
      addOrder, updateOrderStatus, fetchProducts
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="/about" element={<Layout><div className="p-20 text-center text-xl">About Page Placeholder</div></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminProducts /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute role="admin">
              <AdminLayout><AdminOrders /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <AdminLayout><div className="p-10">Page Under Construction</div></AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <CartSidebar />
        <AiAssistant />
      </Router>
    </StoreContext.Provider>
  );
};

export default App;