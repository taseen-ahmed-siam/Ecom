import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, Loader2 } from 'lucide-react';
import { useStore } from '../App';
import { Order } from '../types';
import { api } from '../services/api';

const StatsCard: React.FC<{ title: string; value: string; icon: any; trend: string; color: string }> = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-green-500 text-sm font-medium flex items-center">
        {trend} <TrendingUp className="w-3 h-3 ml-1" />
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = (user as any)?.token;
        if (!token) return;

        const [fetchedOrders, fetchedProducts] = await Promise.all([
           api.orders.list(token),
           api.products.list()
        ]);

        setOrders(fetchedOrders);
        setProductsCount(fetchedProducts.length);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || order.total || 0), 0);
  const totalOrders = orders.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Real-time data from database.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign} 
          trend="Live" 
          color="bg-brand-600"
        />
        <StatsCard 
          title="Total Orders" 
          value={totalOrders.toString()} 
          icon={ShoppingBag} 
          trend="Live" 
          color="bg-purple-600"
        />
        <StatsCard 
          title="Total Products" 
          value={productsCount.toString()} 
          icon={Users} 
          trend="Inventory" 
          color="bg-orange-500"
        />
        <StatsCard 
          title="Avg. Order Value" 
          value={totalOrders > 0 ? `$${(totalRevenue / totalOrders).toFixed(2)}` : '$0'} 
          icon={TrendingUp} 
          trend="Metric" 
          color="bg-green-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                   <th className="text-left py-2">ID</th>
                   <th className="text-left py-2">User</th>
                   <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2 text-gray-500">{o.id.substring(0, 8)}...</td>
                    <td className="py-2 font-medium">{(o as any).user?.name || o.customerName || 'Guest'}</td>
                    <td className="py-2 text-right">${(o.totalPrice || o.total || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};