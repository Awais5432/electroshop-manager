import Head from 'next/head';
import { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, Users, BarChart3, Settings, AlertTriangle,
  DollarSign, TrendingUp, Clock, CreditCard, FileText, Zap, User,
  Plus, Search, Printer, Save, Trash2, Edit, Check, X, ChevronRight,
  ArrowLeft, LogOut, Moon, Sun, Languages, Type
} from 'lucide-react';

export default function Home() {
  const [todayStats, setTodayStats] = useState({
    sales: 0,
    khataGiven: 0,
    cashInHand: 0,
    lowStockCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/dashboard');
      const data = await res.json();
      setTodayStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Fallback to zero if API fails
      setTodayStats({ sales: 0, khataGiven: 0, cashInHand: 0, lowStockCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'New Sale',
      subtitle: 'Create billing invoice',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      href: '/sale',
      shortcut: 'Ctrl+S'
    },
    {
      title: 'Add Stock',
      subtitle: 'Purchase & inventory',
      icon: Package,
      color: 'from-green-500 to-green-600',
      href: '/stock',
      shortcut: 'Ctrl+P'
    },
    {
      title: 'Customers & Khata',
      subtitle: 'Manage credit ledger',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      href: '/customers',
      shortcut: 'Ctrl+K'
    },
    {
      title: 'Reports',
      subtitle: 'Sales & analytics',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      href: '/reports',
      shortcut: 'Ctrl+R'
    },
    {
      title: 'Products',
      subtitle: 'Manage catalog',
      icon: Package,
      color: 'from-teal-500 to-teal-600',
      href: '/products',
      shortcut: 'Ctrl+M'
    },
    {
      title: 'Settings',
      subtitle: 'Shop & printer config',
      icon: Settings,
      color: 'from-gray-600 to-gray-700',
      href: '/settings',
      shortcut: 'Ctrl+,'
    }
  ];

  return (
    <>
      <Head>
        <title>GM Electric Store - Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    GM Electric Store
                  </h1>
                  <p className="text-sm text-slate-500">Manager Portal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">
                    Low Stock: {loading ? '...' : todayStats.lowStockCount} items
                  </span>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Today's Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="Today's Sales"
              value={`Rs. ${loading ? '...' : todayStats.sales.toLocaleString()}`}
              icon={DollarSign}
              color="blue"
              trend="+12%"
            />
            <SummaryCard
              title="Khata Given"
              value={`Rs. ${loading ? '...' : todayStats.khataGiven.toLocaleString()}`}
              icon={CreditCard}
              color="purple"
              trend="+5%"
            />
            <SummaryCard
              title="Cash in Hand"
              value={`Rs. ${loading ? '...' : todayStats.cashInHand.toLocaleString()}`}
              icon={TrendingUp}
              color="green"
              trend="+8%"
            />
            <SummaryCard
              title="Transactions"
              value={loading ? '...' : '0'}
              icon={Clock}
              color="orange"
              trend="Today"
            />
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm mb-3">{item.subtitle}</p>
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <span>{item.shortcut}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Activity
            </h2>
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent transactions yet</p>
              <p className="text-sm mt-1">Start by creating a sale or adding stock</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function SummaryCard({ title, value, icon: Icon, color, trend }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full">
          {trend}
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
