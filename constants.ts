import { Product, SalesData } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Lumina Noise-Cancelling Headphones',
    description: 'Experience pure sound with our industry-leading noise cancellation technology. 30-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=1',
    stock: 45,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Ergonomic Mesh Office Chair',
    description: 'Designed for comfort and productivity. Fully adjustable lumbar support and breathability.',
    price: 189.50,
    category: 'Furniture',
    image: 'https://picsum.photos/400/400?random=2',
    stock: 20,
    rating: 4.5,
    reviews: 89
  },
  {
    id: '3',
    name: 'Smart Fitness Watch Pro',
    description: 'Track your health metrics, workouts, and sleep patterns with precision. Waterproof up to 50m.',
    price: 149.00,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=3',
    stock: 100,
    rating: 4.6,
    reviews: 210
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, sustainable, and stylish. Made from 100% organic cotton for a comfortable fit.',
    price: 29.99,
    category: 'Clothing',
    image: 'https://picsum.photos/400/400?random=4',
    stock: 200,
    rating: 4.2,
    reviews: 55
  },
  {
    id: '5',
    name: 'Minimalist Leather Wallet',
    description: 'Crafted from premium full-grain leather. Slim profile with RFID protection.',
    price: 45.00,
    category: 'Accessories',
    image: 'https://picsum.photos/400/400?random=5',
    stock: 60,
    rating: 4.9,
    reviews: 340
  },
  {
    id: '6',
    name: '4K Ultra HD Monitor 27"',
    description: 'Stunning visuals with HDR support. Perfect for creators and gamers alike.',
    price: 349.99,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=6',
    stock: 15,
    rating: 4.7,
    reviews: 76
  }
];

export const MOCK_SALES_DATA: SalesData[] = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 7500 },
];
