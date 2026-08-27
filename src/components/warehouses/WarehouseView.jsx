import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Icon } from '../common/Icons';

export const WarehouseView = () => {
  const { warehouses, products, formatCurrency, setCurrentView } = useInventory();
  const [activeWarehouse, setActiveWarehouse] = useState(warehouses[0]?.id || 'wh-1');

  const selectedWh = warehouses.find(w => w.id === activeWarehouse) || warehouses[0];
  const whProducts = products.filter(p => p.warehouseId === activeWarehouse);
  const whTotalStockValue = whProducts.reduce((acc, p) => acc + (p.stock * p.unitCost), 0);

  const getOccupancyPct = (used, total) => {
    return Math.round((used / total) * 100);
  };

  return (
    <div className="content-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Icon name="warehouse" size={24} color="var(--primary-500)" />
            Multi-Warehouse & Storage Hubs
          </h1>
          <p className="section-subtitle">
            Facility rack allocations, real-time volume occupancy, and cross-docking logistics.
          </p>
        </div>

        <button className="control-btn btn-primary" onClick={() => setCurrentView('movements')}>
          <Icon name="arrowUpDown" size={16} />
          <span>Inter-Facility Stock Transfer</span>
        </button>
      </div>

      {/* Warehouse Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {warehouses.map(wh => {
          const occ = getOccupancyPct(wh.usedCapacity, wh.capacity);
          const isSelected = wh.id === activeWarehouse;
          const whItems = products.filter(p => p.warehouseId === wh.id);

          return (
            <div
              key={wh.id}
              className={`glass-card ${isSelected ? 'selected' : ''}`}
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-glass-card)'
              }}
              onClick={() => setActiveWarehouse(wh.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{wh.name}</h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#818CF8' }}>
                    CODE: {wh.code}
                  </span>
                </div>
                <span className="badge badge-in-stock">{wh.status}</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                {wh.location}
              </div>

              {/* Progress Gauge */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Capacity Utilization:</span>
                  <span style={{ fontWeight: 700, color: occ > 85 ? '#EF4444' : '#10B981' }}>{occ}% ({wh.usedCapacity.toLocaleString()} / {wh.capacity.toLocaleString()} m³)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${occ}%`,
                      height: '100%',
                      background: occ > 85 ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, #10B981, #6366F1)'
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Stored SKUs: <strong style={{ color: 'var(--text-primary)' }}>{whItems.length}</strong></span>
                <span>Facility Manager: <strong style={{ color: 'var(--text-primary)' }}>{wh.manager.split(' ')[0]}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Facility Details & Assigned Inventory */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon name="warehouse" size={20} color="var(--primary-500)" />
              {selectedWh.name} - Allocated Inventory & Zones
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Managed by {selectedWh.manager} • Total Stock Asset Value: <strong>{formatCurrency(whTotalStockValue)}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selectedWh.zones?.map((zone, idx) => (
              <span key={idx} className="badge badge-category" style={{ fontSize: '0.75rem' }}>
                {zone}
              </span>
            ))}
          </div>
        </div>

        {/* Facility Products Table */}
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>SKU Identifier</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Bin / Rack Location</th>
                <th>On-Hand Stock</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {whProducts.map(prod => (
                <tr key={prod.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#818CF8', fontWeight: 600 }}>
                    {prod.sku}
                  </td>
                  <td style={{ fontWeight: 600 }}>{prod.name}</td>
                  <td>
                    <span className="badge badge-category">{prod.category}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: 'var(--bg-surface-elevated)', padding: '3px 8px', borderRadius: '4px' }}>
                      {prod.binLocation || 'Zone Main'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.9rem' }}>{prod.stock}</strong> {prod.unit}
                  </td>
                  <td>{formatCurrency(prod.stock * prod.unitCost)}</td>
                </tr>
              ))}

              {whProducts.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No products currently assigned to this warehouse.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
