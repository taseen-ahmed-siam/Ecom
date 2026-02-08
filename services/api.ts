import { Product, Order, User, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

// Simulated latency
const DELAY = 600;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage Helpers
const getDB = <T>(key: string, initial: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  } catch (e) {
    return initial;
  }
};

const setDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  products: {
    list: async (params?: URLSearchParams): Promise<Product[]> => {
      await delay(DELAY);
      let products = getDB<Product[]>('db_products', INITIAL_PRODUCTS);
      
      if (params) {
        const keyword = params.get('keyword')?.toLowerCase();
        const category = params.get('category');
        const minPrice = Number(params.get('minPrice') || 0);
        const maxPrice = Number(params.get('maxPrice') || 1000000);

        products = products.filter(p => {
          const matchesKeyword = keyword ? p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword) : true;
          const matchesCategory = category && category !== 'All' ? p.category === category : true;
          const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
          return matchesKeyword && matchesCategory && matchesPrice;
        });
      }
      return products;
    },
    get: async (id: string): Promise<Product | null> => {
      await delay(DELAY);
      const products = getDB<Product[]>('db_products', INITIAL_PRODUCTS);
      return products.find(p => p.id === id) || null;
    },
    create: async (product: Omit<Product, 'id' | 'rating' | 'reviews'>): Promise<Product> => {
      await delay(DELAY);
      const products = getDB<Product[]>('db_products', INITIAL_PRODUCTS);
      const newProduct: Product = { 
        ...product, 
        id: Date.now().toString(),
        rating: 0,
        reviews: 0
      };
      products.push(newProduct);
      setDB('db_products', products);
      return newProduct;
    },
    update: async (product: Product): Promise<Product> => {
      await delay(DELAY);
      let products = getDB<Product[]>('db_products', INITIAL_PRODUCTS);
      products = products.map(p => p.id === product.id ? product : p);
      setDB('db_products', products);
      return product;
    },
    delete: async (id: string): Promise<void> => {
      await delay(DELAY);
      let products = getDB<Product[]>('db_products', INITIAL_PRODUCTS);
      products = products.filter(p => p.id !== id);
      setDB('db_products', products);
    }
  },
  orders: {
    create: async (orderData: any, token: string): Promise<Order> => {
       await delay(DELAY);
       if (!token) throw new Error("Unauthorized");
       
       const orders = getDB<Order[]>('db_orders', []);
       const newOrder: Order = {
         id: Date.now().toString(),
         customerName: 'User', // In real app, derived from token/user
         email: 'user@example.com',
         address: orderData.shippingAddress.address,
         items: orderData.orderItems.map((item: any) => ({
             ...item,
             id: item.product, // Map back for frontend type compatibility
             stock: 100, // Dummy
             rating: 5,
             reviews: 0,
             category: 'General',
             description: '',
             quantity: item.qty
         })),
         total: orderData.totalPrice,
         totalPrice: orderData.totalPrice,
         status: 'Pending',
         date: new Date().toISOString(),
         paymentMethod: orderData.paymentMethod
       };
       
       orders.unshift(newOrder);
       setDB('db_orders', orders);
       return newOrder;
    },
    list: async (token: string): Promise<Order[]> => {
      await delay(DELAY);
      if (!token) throw new Error("Unauthorized");
      return getDB<Order[]>('db_orders', []);
    },
    updateStatus: async (id: string, status: OrderStatus, token: string) => {
       await delay(DELAY);
       if (!token) throw new Error("Unauthorized");
       let orders = getDB<Order[]>('db_orders', []);
       orders = orders.map(o => o.id === id ? { ...o, status } : o);
       setDB('db_orders', orders);
       return orders.find(o => o.id === id);
    }
  },
  auth: {
    login: async (email: string, password: string): Promise<User & { token: string }> => {
      await delay(DELAY);
      if (email === 'admin@lumina.com' && password === 'admin123') {
        return {
          id: 'admin_1',
          name: 'Admin User',
          email,
          role: 'admin',
          token: 'mock_admin_token_123'
        };
      }
      if (email === 'user@lumina.com' && password === 'user123') {
        return {
          id: 'user_1',
          name: 'John Doe',
          email,
          role: 'customer',
          token: 'mock_user_token_456'
        };
      }
      throw new Error('Invalid email or password');
    }
  }
};