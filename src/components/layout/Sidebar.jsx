import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Icon } from '../common/Icons';

export const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const { currentView, setCurrentView, metrics, resetToFactoryData } = useInventory();

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: 'dashboard' },
    {
      id: 'inventory',
      label: 'Inventory Master',
      icon: 'box',
      badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount} Low` : null,
      badgeType: 'warning'
    },
    { id: 'movements', label: 'Stock In / Out', icon: 'arrowUpDown' },
    { id: 'suppliers', label: 'Purchase Orders & Suppliers', icon: 'shoppingBag' },
    { id: 'warehouses', label: 'Warehouses & Hubs', icon: 'warehouse' },
    { id: 'barcode', label: 'Barcode & Scanner', icon: 'barcode' },
    { id: 'reports', label: 'Valuation & Reports', icon: 'fileText' }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon-box">
          <Icon name="box" size={22} color="#FFFFFF" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="brand-title">STACKLY</span>
            <span className="brand-badge">PRO</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Enterprise Stock System
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.id}>
            <button
              className={`nav-item-btn ${currentView === item.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentView(item.id);
                if (onClose) onClose();
              }}
            >
              <div className="nav-left">
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`nav-pill ${item.badgeType}`}>{item.badge}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Sidebar Footer Widget */}
      <div className="sidebar-footer">
        <div className="wh-mini-status">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Central Warehouse</span>
            <span style={{ color: 'var(--emerald-500)' }}>78% Filled</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: 'var(--bg-surface-elevated)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #10B981, #6366F1)' }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="control-btn"
            style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center', color: 'var(--text-muted)' }}
            onClick={resetToFactoryData}
            title="Reset to factory realistic data"
          >
            <Icon name="refreshCw" size={13} />
            <span>Reset Demo</span>
          </button>
          {onLogout && (
            <button
              className="control-btn"
              style={{ fontSize: '0.75rem', justifyContent: 'center', color: '#EF4444', borderColor: '#FEE2E2' }}
              onClick={onLogout}
              title="Sign Out"
            >
              <Icon name="logout" size={13} color="#EF4444" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
