import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Icon } from '../common/Icons';

export const DashboardView = ({ onOpenAddModal, onOpenRestockModal }) => {
  const {
    products,
    metrics,
    formatCurrency,
    transactions,
    autoGenerateLowStockPO,
    setCurrentView,
    quickAdjustStock
  } = useInventory();

  // Urgent low-stock products
  const urgentProducts = products
    .filter(p => p.stock <= p.minStock)
    .sort((a, b) => a.stock - b.stock);

  // Group by category for donut chart
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const totalProds = products.length || 1;
  const categoriesList = Object.entries(categoryCounts);

  const categoryColors = ['#6366F1', '#10B981', '#F59E0B', '#06B6D4', '#EC4899', '#8B5CF6'];

  return (
    <div className="content-body">
      {/* Section Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Icon name="dashboard" size={24} color="var(--primary-500)" />
            Executive Stock Overview
          </h1>
          <p className="section-subtitle">
            Real-time multi-warehouse inventory valuation, throughput analytics, and replenishment triggers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="control-btn btn-primary"
            onClick={autoGenerateLowStockPO}
            title="Auto-create purchase orders for all low stock items"
          >
            <Icon name="shoppingBag" size={16} />
            <span>1-Click Auto Reorder</span>
          </button>
          <button
            className="control-btn"
            onClick={() => setCurrentView('barcode')}
          >
            <Icon name="scan" size={16} />
            <span>Fast Scanner</span>
          </button>
        </div>
      </div>

      {/* Urgent Low Stock Banner (If low stock exists) */}
      {urgentProducts.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--amber-500)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'rgba(245, 158, 11, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--amber-500)' }}>
              <Icon name="alertTriangle" size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Attention Required: {urgentProducts.length} Item(s) Below Minimum Reorder Threshold
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Critical items including <span style={{ color: 'var(--amber-500)', fontWeight: 600 }}>{urgentProducts[0]?.name}</span> need immediate restock.
              </div>
            </div>
          </div>
          <button
            className="control-btn"
            style={{ fontSize: '0.82rem', borderColor: 'var(--amber-500)', color: 'var(--amber-500)' }}
            onClick={() => setCurrentView('inventory')}
          >
            Inspect Items
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Total Stock Cost Value */}
        <div className="glass-card kpi-card indigo">
          <div className="kpi-top">
            <span className="kpi-label">Inventory Valuation</span>
            <div className="kpi-icon-box indigo">
              <Icon name="box" size={20} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{formatCurrency(metrics.totalStockValue)}</div>
            <div className="kpi-trend trend-up">
              <Icon name="trendingUp" size={13} />
              <span>Asset Cost Valuation</span>
            </div>
          </div>
        </div>

        {/* Potential Retail Value */}
        <div className="glass-card kpi-card emerald">
          <div className="kpi-top">
            <span className="kpi-label">Retail Potential</span>
            <div className="kpi-icon-box emerald">
              <Icon name="trendingUp" size={20} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{formatCurrency(metrics.totalRetailValue)}</div>
            <div className="kpi-trend trend-up">
              <span>+ {formatCurrency(metrics.potentialProfit)} Est. Margin</span>
            </div>
          </div>
        </div>

        {/* Total SKU Items */}
        <div className="glass-card kpi-card cyan">
          <div className="kpi-top">
            <span className="kpi-label">Active SKUs</span>
            <div className="kpi-icon-box cyan">
              <Icon name="barcode" size={20} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{metrics.totalSkuCount}</div>
            <div className="kpi-trend trend-neutral">
              <span>Across 3 Warehouse Hubs</span>
            </div>
          </div>
        </div>

        {/* Low & Out of Stock */}
        <div className="glass-card kpi-card amber">
          <div className="kpi-top">
            <span className="kpi-label">Low & Out of Stock</span>
            <div className="kpi-icon-box amber">
              <Icon name="alertTriangle" size={20} />
            </div>
          </div>
          <div>
            <div className="kpi-value" style={{ color: metrics.lowStockCount + metrics.outOfStockCount > 0 ? '#F59E0B' : 'var(--emerald-500)' }}>
              {metrics.lowStockCount + metrics.outOfStockCount}
            </div>
            <div className="kpi-trend" style={{ color: metrics.outOfStockCount > 0 ? '#EF4444' : '#F59E0B' }}>
              <span>{metrics.outOfStockCount} Out of Stock • {metrics.lowStockCount} Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Throughput Bar / Flow Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Weekly Stock Velocity (Inbound vs Outbound)</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily material intake & customer dispatch volume</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10B981' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10B981' }}></span> Inbound
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#6366F1' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#6366F1' }}></span> Outbound
              </span>
            </div>
          </div>

          {/* SVG Chart Visualization */}
          <div style={{ height: '190px', width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 0.5rem 0.5rem 0.5rem', borderBottom: '1px solid var(--border-subtle)', gap: '1rem' }}>
            {[
              { day: 'Mon', in: 140, out: 85 },
              { day: 'Tue', in: 95, out: 120 },
              { day: 'Wed', in: 210, out: 160 },
              { day: 'Thu', in: 180, out: 90 },
              { day: 'Fri', in: 260, out: 210 },
              { day: 'Sat', in: 110, out: 140 },
              { day: 'Sun', in: 40, out: 65 }
            ].map((d, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '150px' }}>
                  <div
                    style={{
                      width: '14px',
                      height: `${(d.in / 300) * 100}%`,
                      background: 'linear-gradient(180deg, #34D399, #059669)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                    title={`Inbound: ${d.in} units`}
                  ></div>
                  <div
                    style={{
                      width: '14px',
                      height: `${(d.out / 300) * 100}%`,
                      background: 'linear-gradient(180deg, #818CF8, #4338CA)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                    title={`Outbound: ${d.out} units`}
                  ></div>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown & Warehouse Hubs */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Inventory Categorization Breakdown</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Stock distribution across product classifications</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {categoriesList.map(([cat, count], idx) => {
              const pct = Math.round((count / totalProds) * 100);
              const color = categoryColors[idx % categoryColors.length];
              return (
                <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} SKUs ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'var(--bg-surface-elevated)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '999px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Urgent Reorder Table & Recent Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* Critical Reorder Queue */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon name="alertTriangle" size={17} color="var(--amber-500)" />
              Safety Stock Replenishment
            </h3>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setCurrentView('inventory')}
            >
              View Catalog →
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product / SKU</th>
                  <th>Current</th>
                  <th>Min Safety</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {urgentProducts.slice(0, 5).map(prod => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{prod.sku}</div>
                    </td>
                    <td>
                      <span className={`badge ${prod.stock === 0 ? 'badge-out-stock' : prod.stock <= 10 ? 'badge-critical' : 'badge-low-stock'}`}>
                        {prod.stock} {prod.unit}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prod.minStock} {prod.unit}</td>
                    <td>
                      <button
                        className="control-btn"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                        onClick={() => quickAdjustStock(prod.id, 50, 'Quick Restock from Dashboard')}
                        title="Add +50 Units"
                      >
                        + Restock 50
                      </button>
                    </td>
                  </tr>
                ))}
                {urgentProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--emerald-500)' }}>
                      All items are adequately stocked!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Stock Movements Feed */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon name="arrowUpDown" size={17} color="var(--primary-500)" />
              Recent Movement Audit
            </h3>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setCurrentView('movements')}
            >
              Full Ledger →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {transactions.slice(0, 5).map(tx => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: tx.type === 'IN' ? 'rgba(16, 185, 129, 0.15)' : tx.type === 'OUT' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: tx.type === 'IN' ? '#10B981' : tx.type === 'OUT' ? '#EF4444' : '#818CF8',
                      fontWeight: 700,
                      fontSize: '0.72rem'
                    }}
                  >
                    {tx.type}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{tx.productName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {tx.reason} • <span style={{ fontFamily: 'var(--font-mono)' }}>{tx.referenceNo}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: tx.type === 'IN' ? '#10B981' : tx.type === 'OUT' ? '#EF4444' : '#818CF8',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {tx.type === 'IN' ? '+' : tx.type === 'OUT' ? '-' : '⇄'} {tx.quantity}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
