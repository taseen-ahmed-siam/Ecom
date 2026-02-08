import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { useStore } from '../App';
import { Order } from '../types';
import { api } from '../services/api';

export const Checkout: React.FC = () => {
  const { cart, clearCart, user, addOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = total > 150 ? 0 : 15.00;
  const finalTotal = total + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const token = (user as any)?.token;
        if (!token) {
            setError("You must be logged in to place an order");
            setLoading(false);
            return;
        }

        const orderData = {
            orderItems: cart.map(item => ({
                product: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.quantity
            })),
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                postalCode: formData.zip,
                country: 'USA'
            },
            paymentMethod: 'Credit Card',
            itemsPrice: total,
            shippingPrice: shipping,
            taxPrice: 0,
            totalPrice: finalTotal
        };

        const createdOrder = await api.orders.create(orderData, token);
        
        // Transform for frontend state compatibility
        const frontendOrder: Order = {
           id: createdOrder.id,
           customerName: user.name,
           email: user.email,
           address: formData.address,
           items: cart,
           total: finalTotal,
           totalPrice: finalTotal,
           status: 'Pending',
           date: new Date().toISOString(),
           paymentMethod: 'Credit Card'
        };
        
        addOrder(frontendOrder);
        clearCart();
        setStep('success');

    } catch (err: any) {
        setError(err.message || 'Order failed');
    } finally {
        setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="text-brand-600 hover:underline">Return to Shop</button>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Thank you for your purchase. We've received your order.
        </p>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-brand-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <div className="space-y-8">
          {/* Steps Indicator */}
          <div className="flex items-center space-x-4 text-sm font-medium">
             <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-brand-600' : 'text-green-600'}`}>
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">1</div>
                Shipping
             </div>
             <div className="h-px w-12 bg-gray-300"></div>
             <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-brand-600' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">2</div>
                Payment
             </div>
          </div>

          <form onSubmit={step === 'shipping' ? (e) => { e.preventDefault(); setStep('payment'); } : handlePlaceOrder}>
            {step === 'shipping' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-left-4">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5" /> Shipping Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input required name="zip" value={formData.zip} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-6 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <Lock className="w-4 h-4" /> Transactions are secure and encrypted.
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input required name="cardName" value={formData.cardName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input required name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exp Date</label>
                    <input required name="expDate" placeholder="MM/YY" value={formData.expDate} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input required name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep('shipping')} className="w-1/3 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Back
                    </button>
                    <button type="submit" disabled={loading} className="w-2/3 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : `Pay $${finalTotal.toFixed(2)}`}
                    </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-200 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 py-2 border-b border-gray-200 last:border-0">
                        <div className="w-16 h-16 bg-white rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};