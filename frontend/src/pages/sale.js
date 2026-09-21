import { useState, useEffect } from 'react';

export default function NewSale() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
  const [paymentInfo, setPaymentInfo] = useState({ amountPaid: '', paymentType: 'cash' });
  const [message, setMessage] = useState('');

  // Fetch products on search
  useEffect(() => {
    if (searchQuery.length > 1) {
      fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error(err));
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

  // Fetch customers
  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error(err));
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product_id === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        unit_price: product.selling_price,
        quantity: 1,
        subtotal: product.selling_price,
        stock: product.current_stock
      }]);
    }
    setSearchQuery('');
    setProducts([]);
  };

  // Update cart item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.product_id !== productId));
    } else {
      setCart(cart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.unit_price }
          : item
      ));
    }
  };

  // Calculate totals
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const amountDue = totalAmount - (parseFloat(paymentInfo.amountPaid) || 0);

  // Add new customer
  const handleAddCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      const result = await response.json();
      if (result.success) {
        setCustomers([...customers, { id: result.customerId, ...newCustomer, current_balance: 0 }]);
        setSelectedCustomer({ id: result.customerId, ...newCustomer });
        setShowCustomerModal(false);
        setNewCustomer({ name: '', phone: '', address: '' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Complete sale
  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      setMessage('❌ Please add items to cart');
      return;
    }

    if (parseFloat(paymentInfo.amountPaid) < totalAmount && !selectedCustomer) {
      setMessage('❌ Please select a customer for credit sales');
      return;
    }

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomer?.id,
          total_amount: totalAmount,
          amount_paid: parseFloat(paymentInfo.amountPaid) || totalAmount,
          items: cart
        })
      });

      const result = await response.json();
      if (result.success) {
        setMessage('✅ Sale completed successfully!');
        // Print receipt
        if (window.electron) {
          window.electron.printReceipt({
            saleId: result.saleId,
            items: cart,
            total: totalAmount,
            paid: paymentInfo.amountPaid,
            customer: selectedCustomer
          });
        }
        // Reset form
        setTimeout(() => {
          setCart([]);
          setPaymentInfo({ amountPaid: '', paymentType: 'cash' });
          setSelectedCustomer(null);
          setMessage('');
        }, 2000);
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
        <h1 style={styles.title}>🧾 New Sale / Billing</h1>
      </header>

      <div style={styles.mainContent}>
        {/* Left Panel - Product Search & Cart */}
        <div style={styles.leftPanel}>
          {/* Search Box */}
          <div style={styles.searchSection}>
            <input
              type="text"
              placeholder="🔍 Search product by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              autoFocus
            />
            
            {products.length > 0 && (
              <div style={styles.searchResults}>
                {products.map(product => (
                  <div
                    key={product.id}
                    style={styles.productResult}
                    onClick={() => addToCart(product)}
                  >
                    <div>
                      <strong>{product.name}</strong>
                      <div style={styles.productMeta}>
                        Stock: {product.current_stock} | Rs. {product.selling_price}/{product.unit}
                      </div>
                    </div>
                    <button style={styles.addBtn}>+ Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <div style={styles.cartSection}>
            <h2 style={styles.cartTitle}>Cart Items ({cart.length})</h2>
            {cart.length === 0 ? (
              <div style={styles.emptyCart}>No items in cart</div>
            ) : (
              <div style={styles.cartItems}>
                {cart.map(item => (
                  <div key={item.product_id} style={styles.cartItem}>
                    <div style={styles.cartItemInfo}>
                      <div style={styles.cartItemName}>{item.name}</div>
                      <div style={styles.cartItemPrice}>Rs. {item.unit_price} × {item.quantity}</div>
                    </div>
                    <div style={styles.quantityControls}>
                      <button 
                        style={styles.qtyBtn}
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >-</button>
                      <span style={styles.qtyValue}>{item.quantity}</span>
                      <button 
                        style={styles.qtyBtn}
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <div style={styles.cartItemSubtotal}>Rs. {item.subtotal}</div>
                    <button 
                      style={styles.removeBtn}
                      onClick={() => updateQuantity(item.product_id, 0)}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Customer & Payment */}
        <div style={styles.rightPanel}>
          {/* Customer Selection */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👤 Customer (Optional)</h3>
            {selectedCustomer ? (
              <div style={styles.selectedCustomer}>
                <div>
                  <strong>{selectedCustomer.name}</strong>
                  {selectedCustomer.phone && <div>{selectedCustomer.phone}</div>}
                  {selectedCustomer.current_balance > 0 && (
                    <div style={{color: '#f44336'}}>Due: Rs. {selectedCustomer.current_balance}</div>
                  )}
                </div>
                <button 
                  style={styles.changeBtn}
                  onClick={() => setSelectedCustomer(null)}
                >Change</button>
              </div>
            ) : (
              <div style={styles.customerActions}>
                <select
                  style={styles.input}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === parseInt(e.target.value));
                    if (customer) setSelectedCustomer(customer);
                  }}
                  value=""
                >
                  <option value="">Select existing customer...</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} {customer.current_balance > 0 ? `(Due: Rs. ${customer.current_balance})` : ''}
                    </option>
                  ))}
                </select>
                <button 
                  style={styles.newCustomerBtn}
                  onClick={() => setShowCustomerModal(true)}
                >+ New Customer</button>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💰 Payment Details</h3>
            <div style={styles.totalDisplay}>
              <span>Total Amount:</span>
              <span style={styles.totalValue}>Rs. {totalAmount.toFixed(2)}</span>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Amount Paid</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paymentInfo.amountPaid}
                onChange={(e) => setPaymentInfo({...paymentInfo, amountPaid: e.target.value})}
                style={styles.input}
                placeholder="Enter amount paid"
              />
            </div>

            {amountDue > 0 && (
              <div style={styles.dueAlert}>
                ⚠️ Credit (Khata): Rs. {amountDue.toFixed(2)} will be added to customer's ledger
              </div>
            )}

            {message && <div style={styles.message}>{message}</div>}

            <button 
              style={styles.completeBtn}
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
            >
              ✅ Complete & Print
            </button>
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showCustomerModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Add New Customer</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name *</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                style={styles.input}
                placeholder="Customer name"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="text"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                style={styles.input}
                placeholder="Phone number"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Address</label>
              <input
                type="text"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                style={styles.input}
                placeholder="Address (optional)"
              />
            </div>
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowCustomerModal(false)}>Cancel</button>
              <button style={styles.submitBtn} onClick={handleAddCustomer}>Add Customer</button>
            </div>
          </div>
        </div>
      )}
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
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '20px',
  },
  title: {
    margin: '0',
    fontSize: '28px',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '20px',
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  searchSection: {
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    border: '2px solid #ddd',
    borderRadius: '12px',
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
  productResult: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  productMeta: {
    fontSize: '14px',
    color: '#666',
    marginTop: '4px',
  },
  addBtn: {
    padding: '8px 16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  cartSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cartTitle: {
    margin: '0 0 16px',
    fontSize: '20px',
    color: '#333',
  },
  emptyCart: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
  },
  cartItems: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    gap: '12px',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontWeight: '600',
    marginBottom: '4px',
  },
  cartItemPrice: {
    fontSize: '14px',
    color: '#666',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '18px',
  },
  qtyValue: {
    minWidth: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cartItemSubtotal: {
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'right',
  },
  removeBtn: {
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#f44336',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  },
  rightPanel: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    margin: '0 0 16px',
    fontSize: '18px',
    color: '#333',
  },
  selectedCustomer: {
    padding: '16px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeBtn: {
    padding: '8px 16px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  customerActions: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  newCustomerBtn: {
    padding: '12px 20px',
    backgroundColor: '#9c27b0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  totalDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f0f7ff',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  totalValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  dueAlert: {
    padding: '12px',
    backgroundColor: '#fff3e0',
    borderRadius: '8px',
    marginBottom: '16px',
    color: '#e65100',
  },
  message: {
    padding: '16px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
    fontWeight: '600',
  },
  completeBtn: {
    width: '100%',
    padding: '18px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '400px',
    maxWidth: '90%',
  },
  modalTitle: {
    margin: '0 0 20px',
    fontSize: '22px',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#9e9e9e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
