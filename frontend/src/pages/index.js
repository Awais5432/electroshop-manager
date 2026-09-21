import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚡ ElectroShop Manager</h1>
        <p style={styles.subtitle}>POS, Inventory & Khata System</p>
      </header>

      <div style={styles.dashboard}>
        {/* Today's Summary */}
        <div style={styles.summaryCard}>
          <h2 style={styles.summaryTitle}>Today's Summary</h2>
          <div style={styles.summaryStats}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Total Sales</span>
              <span style={styles.statValue}>Rs. 0</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Khata Given</span>
              <span style={styles.statValue}>Rs. 0</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Low Stock Items</span>
              <span style={styles.statValue}>0</span>
            </div>
          </div>
        </div>

        {/* Main Action Tiles */}
        <div style={styles.tilesGrid}>
          <Link href="/sale" style={{ textDecoration: 'none' }}>
            <div style={{...styles.tile, ...styles.tileSale}}>
              <div style={styles.tileIcon}>🧾</div>
              <div style={styles.tileTitle}>New Sale</div>
              <div style={styles.tileDesc}>Billing & Invoice</div>
            </div>
          </Link>

          <Link href="/stock" style={{ textDecoration: 'none' }}>
            <div style={{...styles.tile, ...styles.tileStock}}>
              <div style={styles.tileIcon}>📦</div>
              <div style={styles.tileTitle}>Add Stock</div>
              <div style={styles.tileDesc}>Purchase Entry</div>
            </div>
          </Link>

          <Link href="/customers" style={{ textDecoration: 'none' }}>
            <div style={{...styles.tile, ...styles.tileCustomers}}>
              <div style={styles.tileIcon}>📚</div>
              <div style={styles.tileTitle}>Customers & Khata</div>
              <div style={styles.tileDesc}>Ledger Management</div>
            </div>
          </Link>

          <Link href="/products" style={{ textDecoration: 'none' }}>
            <div style={{...styles.tile, ...styles.tileProducts}}>
              <div style={styles.tileIcon}>📋</div>
              <div style={styles.tileTitle}>Products</div>
              <div style={styles.tileDesc}>Manage Inventory</div>
            </div>
          </Link>

          <Link href="/reports" style={{ textDecoration: 'none' }}>
            <div style={{...styles.tile, ...styles.tileReports}}>
              <div style={styles.tileIcon}>📊</div>
              <div style={styles.tileTitle}>Reports</div>
              <div style={styles.tileDesc}>Sales & Analytics</div>
            </div>
          </Link>

          <Link href="/settings" style={{ textDecoration: 'none' }}>
            <div style={{...styles.tile, ...styles.tileSettings}}>
              <div style={styles.tileIcon}>⚙️</div>
              <div style={styles.tileTitle}>Settings</div>
              <div style={styles.tileDesc}>Shop & Printer</div>
            </div>
          </Link>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>ElectroShop Manager v1.0.0</p>
      </footer>
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
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    margin: '0',
    fontSize: '32px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '16px',
    opacity: 0.9,
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  summaryTitle: {
    margin: '0 0 16px',
    fontSize: '20px',
    color: '#333',
  },
  summaryStats: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  statBox: {
    flex: '1',
    minWidth: '150px',
    padding: '16px',
    backgroundColor: '#f0f7ff',
    borderRadius: '8px',
    textAlign: 'center',
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  statValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  tile: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px 24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  tileSale: {
    borderTop: '4px solid #4caf50',
  },
  tileStock: {
    borderTop: '4px solid #ff9800',
  },
  tileCustomers: {
    borderTop: '4px solid #9c27b0',
  },
  tileProducts: {
    borderTop: '4px solid #2196f3',
  },
  tileReports: {
    borderTop: '4px solid #00bcd4',
  },
  tileSettings: {
    borderTop: '4px solid #607d8b',
  },
  tileIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  tileTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  tileDesc: {
    fontSize: '14px',
    color: '#666',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#999',
    fontSize: '14px',
  },
};
