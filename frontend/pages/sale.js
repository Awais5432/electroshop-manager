import Head from 'next/head';
import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Plus, Minus, Trash2, ArrowLeft, Printer,
  User, Phone, MapPin, CreditCard, DollarSign, CheckCircle, AlertCircle,
  Package, Tag, Hash, Save, X
} from 'lucide-react';

export default function Sale() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentType, setPaymentType] = useState('cash'); // cash, partial, credit
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/products?enabled=true');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleAddCustomer = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      if (res.ok) {
        const customer = await res.json();
        setSelectedCustomer(customer);
        setShowCustomerForm(false);
        setNewCustomer({ name: '', phone: '', address: '' });
        fetchCustomers();
      }
    } catch (err) {
      console.error('Failed to add customer:', err);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
  };

  const calculateDue = () => {
    const total = calculateTotal();
    const paid = parseFloat(amountPaid) || 0;
    return total - paid;
  };

  const handleCompleteSale = async () => {
    const total = calculateTotal();
    const paid = parseFloat(amountPaid) || 0;
    const due = calculateDue();

    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty!' });
      return;
    }

    if (due > 0 && !selectedCustomer) {
      setMessage({ type: 'error', text: 'Please select a customer for credit sales!' });
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      const saleData = {
        customerId: selectedCustomer ? selectedCustomer.id : null,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.selling_price
        })),
        totalAmount: total,
        amountPaid: paid,
        amountDue: due,
        paymentType: due > 0 ? 'credit' : 'cash'
      };

      const res = await fetch('http://localhost:3001/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Sale completed successfully!' });
        setCart([]);
        setSelectedCustomer(null);
        setAmountPaid('');
        fetchProducts();
      } else {
        throw new Error('Failed to complete sale');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to complete sale. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const total = calculateTotal();
  const paid = parseFloat(amountPaid) || 0;
  const due = calculateDue();

  return (
    <>
      <Head>
        <title>New Sale - GM Electric Store</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="/" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </a>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">New Sale / Billing</h1>
                  <p className="text-sm text-slate-500">Create invoice and manage payments</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Product Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products (e.g., Wire, MCB, Switch)..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Product Results */}
                {searchTerm && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => {
                          addToCart(product);
                          setSearchTerm('');
                        }}
                        disabled={product.current_stock <= 0}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-800">{product.name}</h3>
                            <p className="text-sm text-slate-500">{product.category} • {product.unit}</p>
                            <p className="text-blue-600 font-bold mt-1">Rs. {product.selling_price}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs font-medium ${product.current_stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              Stock: {product.current_stock}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  Shopping Cart ({cart.length} items)
                </h2>

                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Cart is empty</p>
                    <p className="text-sm mt-1">Search and add products above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">{item.name}</h3>
                          <p className="text-sm text-slate-500">Rs. {item.selling_price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center hover:bg-red-100 ml-2"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Payment & Customer */}
            <div className="space-y-6">
              {/* Customer Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Customer (Optional)
                </h2>

                {selectedCustomer ? (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-purple-800">{selectedCustomer.name}</h3>
                        <p className="text-sm text-purple-600">{selectedCustomer.phone}</p>
                        {selectedCustomer.current_balance > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            Previous Due: Rs. {selectedCustomer.current_balance}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowCustomerForm(!showCustomerForm)}
                      className="w-full py-3 bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl text-purple-600 font-medium hover:bg-purple-100 transition-colors mb-3"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add New Customer
                    </button>

                    {customers.length > 0 && (
                      <select
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onChange={(e) => {
                          const customer = customers.find(c => c.id === parseInt(e.target.value));
                          setSelectedCustomer(customer);
                        }}
                        value=""
                      >
                        <option value="">Select Existing Customer</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}

                {showCustomerForm && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Address (Optional)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    />
                    <button
                      onClick={handleAddCustomer}
                      className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
                    >
                      Save Customer
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Payment Details
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">Rs. {total.toFixed(2)}</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600">Due Amount (Khata)</span>
                    <span className={`font-bold text-lg ${due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Rs. {due.toFixed(2)}
                    </span>
                  </div>
                </div>

                {message && (
                  <div className={`mb-4 p-4 rounded-xl ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  onClick={handleCompleteSale}
                  disabled={processing || cart.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {processing ? 'Processing...' : 'Complete Sale & Print'}
                </button>

                {due > 0 && (
                  <p className="text-xs text-center text-slate-500 mt-2">
                    This will be added to customer's khata balance
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
