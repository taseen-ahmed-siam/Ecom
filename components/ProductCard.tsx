import React from 'react';
import { Plus, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../App';
import { Link } from 'react-router-dom';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if clicking the button
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3">
          {product.stock < 20 && (
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Low Stock
             </span>
          )}
        </div>
        {/* Mobile: Always visible cart button | Desktop: Hover visible */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-gray-900 hover:bg-brand-600 hover:text-white transition-all duration-300 transform translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 z-10 flex items-center justify-center focus:opacity-100 focus:translate-y-0"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-brand-600 font-semibold uppercase tracking-wider mb-2">
          {product.category}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-4 space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
};