import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../App';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const { products } = useStore();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Modern lifestyle background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-500/20 border border-brand-500/50 text-brand-300 text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
                New Collection 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Lifestyle</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Discover a curated collection of premium electronics, fashion, and accessories designed for the modern individual. Quality you can trust, style you can feel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-1">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/about" className="inline-flex items-center justify-center px-8 py-4 border border-white/20 backdrop-blur-sm text-lg font-medium rounded-xl text-white hover:bg-white/10 transition-all">
                Learn More
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm font-medium text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-700 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                            </div>
                        ))}
                    </div>
                    <span>500+ Happy Customers</span>
                </div>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-white">4.9/5</span> Rating
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Free Worldwide Shipping</h3>
            <p className="text-gray-500 leading-relaxed">On all orders over $150. Fast, reliable, and fully trackable delivery to your doorstep.</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Secure Payments</h3>
            <p className="text-gray-500 leading-relaxed">Your security is our priority. All transactions are encrypted and 100% secure.</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">30-Day Returns</h3>
            <p className="text-gray-500 leading-relaxed">Not satisfied? Return it within 30 days for a full refund. No questions asked.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-500 max-w-xl">Our best-selling items this week. Hand-picked for quality and style.</p>
          </div>
          <Link to="/shop" className="group flex items-center text-brand-600 font-bold hover:text-brand-700 text-lg transition-colors">
            View All Collection <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-600 rounded-3xl p-8 md:p-20 text-center text-white relative overflow-hidden isolate shadow-2xl">
             <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to upgrade your style?</h2>
                <p className="text-brand-100 text-lg md:text-xl mb-10">Join thousands of satisfied customers who have found their perfect match with Lumina Commerce.</p>
                <Link to="/shop" className="inline-block bg-white text-brand-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg">Start Shopping</Link>
             </div>
             {/* Decorative elements */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500 rounded-full opacity-30 blur-3xl mix-blend-multiply"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-700 rounded-full opacity-30 blur-3xl mix-blend-multiply"></div>
          </div>
      </section>
    </div>
  );
};