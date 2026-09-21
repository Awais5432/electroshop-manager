import Head from 'next/head';
import { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Save, ArrowLeft, AlertCircle, CheckCircle,
  TrendingUp, DollarSign, Calendar, User, Tag, Hash, Box
} from 'lucide-react';

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Wires',
    unit: 'Piece',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    supplier: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const categories = ['Wires', 'Switches', 'MCBs', 'Lights', 'Fans', 'Tools', 'Other'];
  const units = ['Piece', 'Meter', 'Box', 'Dozen', 'Kg', 'Set'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length > 2) {
      const matched = products.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase())
      );
      if (matched.length === 1) {
        setSelectedProduct(matched[0]);
        setFormData({
          ...formData,
          name: matched[0].name,
          category: matched[0].category,
          unit: matched[0].unit,
          purchasePrice: matched[0].purchase_price,
          sellingPrice: matched[0].selling_price
        });
        setShowForm(true);
      }
    } else {
      setSelectedProduct(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const endpoint = selectedProduct 
        ? 'http://localhost:3001/api/stock/add'
        : 'http://localhost:3001/api/products';
      
      const payload = selectedProduct
        ? { 
            productId: selectedProduct.id, 
            quantity: parseFloat(formData.quantity),
            purchasePrice: parseFloat(formData.purchasePrice),
            supplier: formData.supplier
          }
        : {
            name: formData.name,
            category: formData.category,
            unit: formData.unit,
            purchasePrice: parseFloat(formData.purchasePrice),
            sellingPrice: parseFloat(formData.sellingPrice),
            quantity: parseFloat(formData.quantity),
            supplier: formData.supplier
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Stock added successfully!' });
        setFormData({
          name: '', category: 'Wires', unit: 'Piece',
          purchasePrice: '', sellingPrice: '', quantity: '', supplier: ''
        });
        setSelectedProduct(null);
        setShowForm(false);
        setSearchTerm('');
        fetchProducts();
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save stock. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Stock - GM Electric Store</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="/" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </a>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Add Stock / Purchase</h1>
                  <p className="text-sm text-slate-500">Update inventory with new purchases</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search product name (e.g., 2.5mm Wire, MCB 20A)..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
              />
            </div>
            
            {searchTerm.length > 2 && !selectedProduct && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-700">
                  No exact match found. Fill the form below to add a new product.
                </p>
              </div>
            )}

            {selectedProduct && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  Selected: {selectedProduct.name} ({selectedProduct.current_stock} in stock)
                </span>
              </div>
            )}
          </div>

          {/* Form Section */}
          {(showForm || searchTerm.length > 2) && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Package className="w-4 h-4 inline mr-1" />
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., 2.5mm Copper Wire"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Unit
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Purchase Price (per unit) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                    placeholder="0.00"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Selling Price (per unit) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                    placeholder="0.00"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Box className="w-4 h-4 inline mr-1" />
                    Quantity Purchased *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="0"
                  />
                </div>

                {/* Supplier */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Supplier (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="Supplier name"
                  />
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`mb-6 p-4 rounded-xl ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save & Print Receipt'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSearchTerm('');
                    setSelectedProduct(null);
                    setFormData({
                      name: '', category: 'Wires', unit: 'Piece',
                      purchasePrice: '', sellingPrice: '', quantity: '', supplier: ''
                    });
                  }}
                  className="px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Recent Stock Entries */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Today's Stock Entries
            </h2>
            <div className="text-center py-12 text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No stock entries today</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
