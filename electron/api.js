const express = require('express');
const router = express.Router();
const { getDb } = require('../database/db');

// Products API
router.get('/products', (req, res) => {
  try {
    const db = getDb();
    const products = db.prepare('SELECT * FROM products WHERE is_enabled = 1 ORDER BY name').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', (req, res) => {
  try {
    const db = getDb();
    const { name, category, unit, purchase_price, selling_price, quantity, supplier, low_stock_alert } = req.body;
    
    // Check if product exists
    let product = db.prepare('SELECT * FROM products WHERE name = ?').get(name);
    
    if (!product) {
      // Create new product
      const result = db.prepare(`
        INSERT INTO products (name, category, unit, purchase_price, selling_price, current_stock, low_stock_alert, is_enabled)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `).run(name, category, unit, purchase_price, selling_price, quantity || 0, low_stock_alert || 5);
      
      productId = result.lastInsertRowid;
    } else {
      productId = product.id;
      // Update existing product prices if changed
      db.prepare(`
        UPDATE products SET purchase_price = ?, selling_price = ? WHERE id = ?
      `).run(purchase_price, selling_price, productId);
    }
    
    // Add stock entry
    db.prepare(`
      INSERT INTO stock_entries (product_id, quantity, purchase_price, supplier)
      VALUES (?, ?, ?, ?)
    `).run(productId, quantity, purchase_price, supplier || '');
    
    // Update current stock
    db.prepare(`
      UPDATE products SET current_stock = current_stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(quantity, productId);
    
    res.json({ success: true, productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { name, category, unit, purchase_price, selling_price, low_stock_alert, is_enabled } = req.body;
    
    db.prepare(`
      UPDATE products 
      SET name = ?, category = ?, unit = ?, purchase_price = ?, selling_price = ?, low_stock_alert = ?, is_enabled = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, category, unit, purchase_price, selling_price, low_stock_alert, is_enabled !== undefined ? is_enabled : 1, id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/products/:id', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    // Check if product has stock or sales history
    const stockCount = db.prepare('SELECT COUNT(*) as count FROM stock_entries WHERE product_id = ?').get(id);
    const salesCount = db.prepare('SELECT COUNT(*) as count FROM sale_items WHERE product_id = ?').get(id);
    
    if (stockCount.count > 0 || salesCount.count > 0) {
      return res.status(400).json({ error: 'Cannot delete product with stock or sales history. Please disable it instead.' });
    }
    
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/search', (req, res) => {
  try {
    const db = getDb();
    const { q } = req.query;
    const products = db.prepare(`
      SELECT * FROM products 
      WHERE is_enabled = 1 AND (name LIKE ? OR category LIKE ?)
      ORDER BY name
      LIMIT 20
    `).all(`%${q}%`, `%${q}%`);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales API
router.post('/sales', (req, res) => {
  try {
    const db = getDb();
    const { customer_id, total_amount, amount_paid, items } = req.body;
    const amount_due = total_amount - amount_paid;
    const payment_type = amount_due > 0 ? 'khata' : 'cash';
    
    // Create sale record
    const result = db.prepare(`
      INSERT INTO sales (customer_id, total_amount, amount_paid, amount_due, payment_type)
      VALUES (?, ?, ?, ?, ?)
    `).run(customer_id || null, total_amount, amount_paid, amount_due, payment_type);
    
    const saleId = result.lastInsertRowid;
    
    // Add sale items and update stock
    for (const item of items) {
      db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `).run(saleId, item.product_id, item.quantity, item.unit_price, item.subtotal);
      
      // Deduct from stock
      db.prepare(`
        UPDATE products SET current_stock = current_stock - ? WHERE id = ?
      `).run(item.quantity, item.product_id);
    }
    
    // If khata, create ledger entry
    if (amount_due > 0 && customer_id) {
      db.prepare(`
        INSERT INTO khata_entries (customer_id, sale_id, type, amount, description)
        VALUES (?, ?, 'debit', ?, 'Sale on credit')
      `).run(customer_id, saleId, amount_due);
      
      // Update customer balance
      db.prepare(`
        UPDATE customers SET current_balance = current_balance + ? WHERE id = ?
      `).run(amount_due, customer_id);
    }
    
    res.json({ success: true, saleId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customers API
router.get('/customers', (req, res) => {
  try {
    const db = getDb();
    const customers = db.prepare('SELECT * FROM customers ORDER BY name').all();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/customers', (req, res) => {
  try {
    const db = getDb();
    const { name, phone, address, opening_balance } = req.body;
    
    const result = db.prepare(`
      INSERT INTO customers (name, phone, address, opening_balance, current_balance)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, phone, address || '', opening_balance || 0, opening_balance || 0);
    
    res.json({ success: true, customerId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/customers/:id/khata', (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    const entries = db.prepare(`
      SELECT * FROM khata_entries 
      WHERE customer_id = ? 
      ORDER BY date DESC
    `).all(id);
    
    res.json({ customer, entries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
router.get('/dashboard/stats', (req, res) => {
  try {
    const db = getDb();
    
    const todaySales = db.prepare(`
      SELECT SUM(total_amount) as total FROM sales WHERE date(date) = date('now')
    `).get();
    
    const todayKhata = db.prepare(`
      SELECT SUM(amount_due) as total FROM sales WHERE date(date) = date('now') AND amount_due > 0
    `).get();
    
    const lowStockProducts = db.prepare(`
      SELECT COUNT(*) as count FROM products 
      WHERE is_enabled = 1 AND current_stock <= low_stock_alert
    `).get();
    
    const totalOutstanding = db.prepare(`
      SELECT SUM(current_balance) as total FROM customers
    `).get();
    
    res.json({
      todaySales: todaySales.total || 0,
      todayKhata: todayKhata.total || 0,
      lowStockCount: lowStockProducts.count,
      totalOutstanding: totalOutstanding.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
