import { useState, useEffect } from 'react';

export default function AddStock() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Wires',
    unit: 'Piece',
    purchase_price: '',
    selling_price: '',
    quantity: '',
    supplier: '',
    low_stock_alert: 5
  });
  const [categories] = useState(['Wires', 'Switches', 'MCBs', 'Lights', 'Fans', 'Tools', 'Other']);
  const [units] = useState(['Piece', 'Meter', 'Box', 'Dozen', 'Kg', 'Set']);
  const [message, setMessage] = useState('');

  // Search products as user types
  useEffect(() => {
    if (searchQuery.length > 0) {
      fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error(err));
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

  // Select a product from search results
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      ...formData,
      name: product.name,
      category: product.category,
      unit: product.unit,
      purchase_price: product.purchase_price,
      selling_price: product.selling_price,
      low_stock_alert: product.low_stock_alert
    });
    setSearchQuery('');
    setProducts([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Stock added successfully!');
        setFormData({
          name: '',
          category: 'Wires',
          unit: 'Piece',
          purchase_price: '',
          selling_price: '',
          quantity: '',
          supplier: '',
          low_stock_alert: 5
        });
        setSelectedProduct(null);
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Error: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📦 Add Stock / Purchase Entry</h1>
      </header>

      <div style={styles.content}>
        {/* Search Box */}
        <div style={styles.searchSection}>
          <label style={styles.label}>Search Product (or add new)</label>
          <input
            type="text"
            placeholder="Type product name to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
          />
          
          {products.length > 0 && (
            <div style={styles.searchResults}>
              {products.map(product => (
                <div
                  key={product.id}
                  style={styles.resultItem}
                  onClick={() => handleSelectProduct(product)}
                >
                  <strong>{product.name}</strong>
                  <span style={styles.resultInfo}>
                    Stock: {product.current_stock} | Price: Rs. {product.selling_price}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {selectedProduct && (
            <div style={styles.selectedProduct}>
              ✅ Selected: <strong>{selectedProduct.name}</strong> (Current Stock: {selectedProduct.current_stock})
              <button 
                style={styles.clearBtn}
                onClick={() => {
                  setSelectedProduct(null);
                  setFormData({
                    name: '',
                    category: 'Wires',
                    unit: 'Piece',
                    purchase_price: '',
                    selling_price: '',
                    quantity: '',
                    supplier: '',
                    low_stock_alert: 5
                  });
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={styles.input}
                placeholder="Enter product name"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={styles.input}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                style={styles.input}
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity Purchased *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                style={styles.input}
                placeholder="e.g., 50"
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Purchase Price (per unit) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({...formData, purchase_price: e.target.value})}
                style={styles.input}
                placeholder="Rs."
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Selling Price (per unit) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({...formData, selling_price: e.target.value})}
                style={styles.input}
                placeholder="Rs."
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Supplier (optional)</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                style={styles.input}
                placeholder="Supplier name"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Alert when stock below</label>
              <input
                type="number"
                min="1"
                value={formData.low_stock_alert}
                onChange={(e) => setFormData({...formData, low_stock_alert: e.target.value})}
                style={styles.input}
              />
            </div>
          </div>

          {message && <div style={styles.message}>{message}</div>}

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitBtn}>
              💾 Save & Print
            </button>
            <button 
              type="button" 
              style={styles.cancelBtn}
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: '#ff9800',
    color: 'white',
    padding: '20px',
  },
  title: {
    margin: '0',
    fontSize: '28px',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  searchSection: {
    marginBottom: '24px',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  searchResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  resultItem: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  resultInfo: {
    display: 'block',
    fontSize: '14px',
    color: '#666',
    marginTop: '4px',
  },
  selectedProduct: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  clearBtn: {
    marginLeft: 'auto',
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  form: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    padding: '16px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  submitBtn: {
    flex: 1,
    padding: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '16px 32px',
    backgroundColor: '#9e9e9e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
