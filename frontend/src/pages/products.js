import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Package, Search, ArrowLeft, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

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

  const toggleEnabled = async (product) => {
    try {
      await fetch(`http://localhost:3001/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: !product.is_enabled })
      });
      fetchProducts();
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head><title>Products - GM Electric Store</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100">
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <a href="/" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </a>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Products Catalog</h1>
                <p className="text-sm text-slate-500">Manage your inventory items</p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-medium">Product Name</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-medium">Category</th>
                    <th className="text-right py-3 px-4 text-slate-600 font-medium">Stock</th>
                    <th className="text-right py-3 px-4 text-slate-600 font-medium">Purchase Price</th>
                    <th className="text-right py-3 px-4 text-slate-600 font-medium">Selling Price</th>
                    <th className="text-center py-3 px-4 text-slate-600 font-medium">Status</th>
                    <th className="text-center py-3 px-4 text-slate-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{product.name}</td>
                      <td className="py-3 px-4 text-slate-600">{product.category}</td>
                      <td className={`py-3 px-4 text-right font-medium ${product.current_stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.current_stock}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">Rs. {product.purchase_price}</td>
                      <td className="py-3 px-4 text-right text-slate-800 font-semibold">Rs. {product.selling_price}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleEnabled(product)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.is_enabled 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {product.is_enabled ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No products found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
