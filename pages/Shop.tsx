import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const categories = ['All', 'Electronics', 'Clothing', 'Accessories', 'Furniture'];

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('keyword', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());

      const data = await api.products.list(params);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sync URL with state
    const newParams = new URLSearchParams();
    if (search) newParams.set('q', search);
    if (selectedCategory !== 'All') newParams.set('category', selectedCategory);
    setSearchParams(newParams);

    // Debounce fetch
    const timeout = setTimeout(() => {
      fetchFilteredProducts();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, selectedCategory, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shop All Products</h1>
           <p className="text-gray-500 mt-1">Explore our premium collection</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">Category</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                            type="radio" 
                            name="category"
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 text-brand-600 transition-all checked:border-brand-600 checked:bg-brand-600 hover:border-brand-400"
                        />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <span className={`ml-2 text-sm transition-colors ${selectedCategory === cat ? 'font-medium text-brand-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="text-sm font-semibold text-gray-900 mb-3 block">Price Range</label>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                   <span>${priceRange[0]}</span>
                   <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
             </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
               <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                 <Search className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-medium text-gray-900">No products found</h3>
               <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
               <button 
                onClick={() => {setSearch(''); setSelectedCategory('All'); setPriceRange([0, 1000]);}}
                className="mt-4 text-brand-600 font-medium hover:text-brand-700 hover:underline transition-colors"
               >
                 Clear all filters
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};