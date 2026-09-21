import Head from 'next/head';
import { useState, useEffect } from 'react';
import { 
  Users, Search, Plus, ArrowLeft, Phone, MapPin, DollarSign,
  CreditCard, FileText, Printer, TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '', openingBalance: '' });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const handleAddCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCustomer,
          openingBalance: parseFloat(newCustomer.openingBalance) || 0
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Customer added successfully!' });
        setNewCustomer({ name: '', phone: '', address: '', openingBalance: '' });
        setShowAddForm(false);
        fetchCustomers();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add customer.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!selectedCustomer || !paymentAmount) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/khata/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          amount: parseFloat(paymentAmount),
          description: 'Payment received'
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Payment recorded successfully!' });
        setPaymentAmount('');
        fetchCustomers();
        // Refresh selected customer
        const updated = await fetch('http://localhost:3001/api/customers');
        const data = await updated.json();
        setSelectedCustomer(data.find(c => c.id === selectedCustomer.id));
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to record payment.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const totalOutstanding = customers.reduce((sum, c) => sum + (c.current_balance || 0), 0);

  return (
    <>
      <Head>
        <title>Customers & Khata - GM Electric Store</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="/" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </a>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Customers & Khata</h1>
                  <p className="text-sm text-slate-500">Manage credit ledger and customer balances</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">Rs. {totalOutstanding.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Customers with Due</p>
                  <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.current_balance > 0).length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">All Customers</h2>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Customer
                  </button>
                </div>

                {showAddForm && (
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
                    <input
                      type="text"
                      placeholder="Customer Name *"
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Opening Balance (if any)"
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCustomer.openingBalance}
                      onChange={(e) => setNewCustomer({...newCustomer, openingBalance: e.target.value})}
                    />
                    <button
                      onClick={handleAddCustomer}
                      disabled={loading || !newCustomer.name || !newCustomer.phone}
                      className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Customer'}
                    </button>
                  </div>
                )}

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedCustomer?.id === customer.id
                          ? 'bg-purple-50 border-2 border-purple-300'
                          : 'bg-slate-50 border border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{customer.name}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${customer.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Rs. {customer.current_balance?.toLocaleString() || 0}
                          </p>
                          <p className="text-xs text-slate-500">
                            {customer.current_balance > 0 ? 'Due' : 'Clear'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Details & Khata */}
            <div>
              {selectedCustomer ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                  <div className="text-center mb-6 pb-6 border-b border-slate-200">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-10 h-10 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h2>
                    <p className="text-slate-500 flex items-center justify-center gap-1 mt-1">
                      <Phone className="w-4 h-4" />
                      {selectedCustomer.phone}
                    </p>
                    {selectedCustomer.address && (
                      <p className="text-sm text-slate-500 flex items-center justify-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {selectedCustomer.address}
                      </p>
                    )}
                  </div>

                  <div className={`text-center p-6 rounded-xl mb-6 ${
                    selectedCustomer.current_balance > 0 
                      ? 'bg-red-50 border-2 border-red-200' 
                      : 'bg-green-50 border-2 border-green-200'
                  }`}>
                    <p className="text-sm text-slate-600 mb-1">Current Balance</p>
                    <p className={`text-3xl font-bold ${
                      selectedCustomer.current_balance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      Rs. {selectedCustomer.current_balance?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs mt-2">
                      {selectedCustomer.current_balance > 0 ? 'Customer owes this amount' : 'Account clear'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Record Payment
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                      <button
                        onClick={handleAddPayment}
                        disabled={loading || !paymentAmount}
                        className="px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 flex items-center justify-center gap-2">
                    <FileText className="w-5 h-5" />
                    Print Statement
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center py-24">
                  <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">Select a customer to view details</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
