import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Icon } from '../common/Icons';

export const Navbar = ({ onToggleSidebar, onOpenAddModal, onLogout }) => {
  const {
    theme,
    setTheme,
    currency,
    setCurrency,
    notifications,
    markAllNotificationsRead,
    globalSearch,
    setGlobalSearch
  } = useInventory();

  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="top-navbar">
      {/* Mobile Menu & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="control-btn btn-icon-round mobile-menu-btn"
          id="mobile-menu-trigger"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          title="Open menu"
        >
          <Icon name="menu" size={20} />
        </button>

        <div className="nav-search-box">
          <Icon name="search" size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search SKU, Product, Barcode..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
          {globalSearch && (
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setGlobalSearch('')}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Actions: Currency, Theme, Notifications, Add Product */}
      <div className="nav-actions">
        {/* Currency Switcher */}
        <select
          className="select-input nav-currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{ padding: '0.45rem 0.65rem', fontWeight: 600, fontSize: '0.85rem' }}
          title="Switch Display Currency"
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
        </select>

        {/* Theme Toggle */}
        <button
          className="control-btn btn-icon-round"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="control-btn btn-icon-round"
            onClick={() => setShowNotifs(!showNotifs)}
            title="Stock Notifications"
          >
            <Icon name="bell" size={18} />
            {unreadCount > 0 && <span className="notif-badge"></span>}
          </button>

          {showNotifs && (
            <div className="notif-dropdown">
              <div style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Stock Alerts & Activity</span>
                {unreadCount > 0 && (
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                    onClick={markAllNotificationsRead}
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No recent notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: n.type === 'warning' ? 'var(--amber-500)' : n.type === 'success' ? 'var(--emerald-500)' : 'var(--text-primary)' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Product Button */}
        <button className="control-btn btn-primary nav-add-btn" onClick={onOpenAddModal}>
          <Icon name="plus" size={16} />
          <span className="btn-text-hide-mobile">New Product</span>
        </button>

        {/* User Profile / Logout */}
        {onLogout && (
          <button
            className="control-btn btn-icon-round"
            onClick={onLogout}
            title="Sign Out"
            style={{ color: '#EF4444' }}
          >
            <Icon name="logout" size={18} color="#EF4444" />
          </button>
        )}
      </div>
    </header>
  );
};
