import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Truck, Shield, ArrowLeft, Minus, Plus, ShoppingCart, Share2, Check, Loader2 } from 'lucide-react';
import { useStore } from '../App';
import { Product } from '../types';
import { api } from '../services/api';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

  useEffect(() => {
    const fetchProduct = async () => {
        try {
            if (id) {
                const data = await api.products.get(id);
                setProduct(data);
                if (data) {
                    document.title = `${data.name} | Lumina Commerce`;
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
        for(let i = 0; i < qty; i++) {
            addToCart(product);
        }
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          </div>
      );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Link to="/shop" className="text-brand-600 font-medium hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/" className="hover:text-brand-600 transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link to="/shop" className="hover:text-brand-600 transition-colors">Shop</Link></li>
          <li>/</li>
          <li className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      {/* Product Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnail Placeholder */}
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map((i) => (
                   <div key={i} className={`aspect-square rounded-lg bg-gray-50 overflow-hidden border ${i === 1 ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-200'} cursor-pointer hover:border-brand-400 transition-colors`}>
                        <img src={product.image} className="w-full h-full object-cover" alt="thumbnail" />
                   </div>
               ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
                <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide bg-brand-50 px-3 py-1 rounded-full">
                    {product.category}
                </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-bold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600 hover:text-brand-600 cursor-pointer underline decoration-gray-300 underline-offset-4">{product.reviews || 0} Reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <span className="text-lg text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Save 20%</span>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                <p>{product.description}</p>
                <ul className="mt-4 space-y-2 list-none pl-0">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> In stock and ready to ship</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Premium quality guaranteed</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 30-day money-back guarantee</li>
                </ul>
            </div>

            {/* Actions */}
            <div className="space-y-4 border-t border-gray-100 pt-8 mt-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg w-full sm:w-32">
                        <button 
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="p-3 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="flex-1 text-center font-semibold text-gray-900">{qty}</span>
                        <button 
                            onClick={() => setQty(qty + 1)}
                            className="p-3 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-brand-600 text-white py-3 px-8 rounded-lg font-bold text-lg shadow-lg shadow-brand-200 hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Free shipping over $150
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" /> 2 Year Warranty
                    </div>
                    <button className="flex items-center gap-1 hover:text-brand-600">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {['Description', 'Specifications', 'Shipping & Returns'].map((tab) => {
                        const key = tab.toLowerCase().split(' ')[0] as any;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(key)}
                                className={`${activeTab === key ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="py-8">
                {activeTab === 'desc' && (
                    <div className="prose max-w-none text-gray-600">
                        <p>{product.description}</p>
                    </div>
                )}
                {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium text-gray-900">Brand</span>
                            <span className="text-gray-600">{product.brand || 'Lumina'}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="font-medium text-gray-900">Category</span>
                            <span className="text-gray-600">{product.category}</span>
                        </div>
                    </div>
                )}
                {activeTab === 'shipping' && (
                    <div className="text-gray-600 space-y-4">
                        <p>We offer free standard shipping on all orders over $150. Orders are processed within 1-2 business days.</p>
                        <p><strong>Returns:</strong> You have 30 days to return your item if you are not 100% satisfied. Item must be in original condition.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};