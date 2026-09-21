import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: '/' },
  { name: 'New Sale', icon: ShoppingCart, page: '/sale' },
  { name: 'Add Stock', icon: Package, page: '/stock' },
  { name: 'Customers', icon: Users, page: '/customers' },
  { name: 'Products', icon: FileText, page: '/products' },
  { name: 'Reports', icon: FileText, page: '/reports' },
  { name: 'Settings', icon: Settings, page: '/settings' },
];

export default function Sidebar({ onLogout }) {
  const [activePage, setActivePage] = useState('/');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigate = (page) => {
    setActivePage(page);
    window.history.pushState({}, '', page);
    // Trigger Next.js client-side navigation
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div style={{
      width: isCollapsed ? '80px' : '260px',
      background: '#1e40af',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {!isCollapsed && (
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>GM Electric</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div style={{ flex: 1, padding: '1rem 0.5rem' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.page;
          
          return (
            <button
              key={item.name}
              onClick={() => handleNavigate(item.page)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                marginBottom: '0.25rem',
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <Icon size={20} style={{ minWidth: '20px' }} />
              {!isCollapsed && (
                <span style={{ marginLeft: '0.75rem', fontSize: '0.95rem' }}>{item.name}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.2)',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#fca5a5',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.2)';
          }}
        >
          <LogOut size={20} style={{ minWidth: '20px' }} />
          {!isCollapsed && (
            <span style={{ marginLeft: '0.75rem', fontSize: '0.95rem' }}>Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
