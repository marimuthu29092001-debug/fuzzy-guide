import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Icon } from '../common/Icons';

export const SuppliersView = () => {
  const {
    suppliers,
    purchaseOrders,
    products,
    formatCurrency,
    createPurchaseOrder,
    receivePurchaseOrder,
    autoGenerateLowStockPO
  } = useInventory();

  const [activeTab, setActiveTab] = useState('pos'); // 'pos' or 'suppliers'
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isPoModalOpen) {
      document.body.classList.add('sidebar-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isPoModalOpen]);

  // New PO Form
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [orderItems, setOrderItems] = useState([
    { productId: products[0]?.id || '', quantity: 20 }
  ]);

  const handleAddItemRow = () => {
    setOrderItems(prev => [...prev, { productId: products[0]?.id || '', quantity: 10 }]);
  };

  const handleRemoveItemRow = (index) => {
    setOrderItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setOrderItems(prev =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleCreatePO = (e) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === selectedSupplierId);
    if (!sup) return;

    const preparedItems = orderItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: prod?.name || 'Item',
        quantity: Number(item.quantity),
        unitCost: prod?.unitCost || 0
      };
    });

    const totalAmount = preparedItems.reduce((acc, curr) => acc + curr.quantity * curr.unitCost, 0);

    createPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      items: preparedItems,
      totalAmount,
      status: 'Ordered',
      expectedDelivery: expectedDate,
      priority: 'High'
    });

    setIsPoModalOpen(false);
  };

  return (
    <div className="content-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Icon name="shoppingBag" size={24} color="var(--primary-500)" />
            Procurement & Supplier Management
          </h1>
          <p className="section-subtitle">
            Manage vendor networks, raise purchase orders, and receive automated restock deliveries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="control-btn" onClick={autoGenerateLowStockPO}>
            <Icon name="refreshCw" size={16} />
            <span>Auto-Generate Low Stock POs</span>
          </button>
          <button className="control-btn btn-primary" onClick={() => setIsPoModalOpen(true)}>
            <Icon name="plus" size={16} />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        <button
          className={`control-btn ${activeTab === 'pos' ? 'btn-primary' : ''}`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('pos')}
        >
          <Icon name="fileText" size={16} />
          <span>Active Purchase Orders ({purchaseOrders.length})</span>
        </button>
        <button
          className={`control-btn ${activeTab === 'suppliers' ? 'btn-primary' : ''}`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('suppliers')}
        >
          <Icon name="shoppingBag" size={16} />
          <span>Supplier Directory ({suppliers.length})</span>
        </button>
      </div>

      {/* View: Purchase Orders */}
      {activeTab === 'pos' && (
        <div className="glass-card" style={{ padding: '0.5rem', overflow: 'hidden' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier / Vendor</th>
                  <th>Order Items</th>
                  <th>Order Value</th>
                  <th>Status</th>
                  <th>Expected Delivery</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map(po => (
                  <tr key={po.id}>
                    {/* PO No */}
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: '#818CF8' }}>
                        {po.id}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Created: {new Date(po.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Supplier */}
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{po.supplierName}</div>
                    </td>

                    {/* Items List */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {po.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.78rem' }}>
                            • <strong>{item.quantity}x</strong> {item.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Value */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {formatCurrency(po.totalAmount)}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      {po.status === 'Received' ? (
                        <span className="badge badge-in-stock">
                          <Icon name="check" size={12} /> Received & Stocked
                        </span>
                      ) : po.status === 'Ordered' ? (
                        <span className="badge badge-category">
                          <Icon name="refreshCw" size={12} /> Ordered / In Transit
                        </span>
                      ) : (
                        <span className="badge badge-low-stock">Draft</span>
                      )}
                    </td>

                    {/* Delivery Date */}
                    <td>
                      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                        {po.expectedDelivery}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      {po.status !== 'Received' ? (
                        <button
                          className="control-btn btn-success"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => receivePurchaseOrder(po.id)}
                          title="Verify delivery and add units into inventory"
                        >
                          <Icon name="check" size={13} />
                          <span>Receive & Restock</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Suppliers Directory */}
      {activeTab === 'suppliers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {suppliers.map(sup => (
            <div key={sup.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{sup.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sup.city}</span>
                </div>
                <span className="badge badge-in-stock">
                  ★ {sup.rating} Rating
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.75rem 0 1rem 0' }}>
                {sup.categories.map((cat, idx) => (
                  <span key={idx} className="badge badge-category" style={{ fontSize: '0.7rem' }}>
                    {cat}
                  </span>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contact Person:</span>
                  <span style={{ fontWeight: 600 }}>{sup.contactPerson}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                  <span style={{ color: 'var(--primary-500)' }}>{sup.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Average Lead Time:</span>
                  <span style={{ fontWeight: 600 }}>{sup.leadTimeDays} Days</span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  className="control-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setSelectedSupplierId(sup.id);
                    setIsPoModalOpen(true);
                  }}
                >
                  <Icon name="plus" size={14} />
                  <span>Raise PO for {sup.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create PO Modal */}
      {isPoModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPoModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: '#818CF8' }}>
                  <Icon name="shoppingBag" size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Raise New Purchase Order (PO)</h2>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Order components from authorized supplier partner
                  </span>
                </div>
              </div>
              <button className="control-btn btn-icon-round" onClick={() => setIsPoModalOpen(false)}>
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePO}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* Supplier */}
                  <div className="form-group col-span-2">
                    <label className="form-label">Vendor / Supplier</label>
                    <select
                      className="select-input"
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                    >
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                      ))}
                    </select>
                  </div>

                  {/* Expected Delivery */}
                  <div className="form-group col-span-2">
                    <label className="form-label">Expected Delivery Date</label>
                    <input
                      type="date"
                      className="text-input"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                    />
                  </div>

                  {/* Line Items */}
                  <div className="form-group col-span-2">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label className="form-label">Line Items to Order</label>
                      <button
                        type="button"
                        onClick={handleAddItemRow}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        + Add Another Item
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {orderItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          <select
                            className="select-input"
                            style={{ flex: 2 }}
                            value={item.productId}
                            onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({formatCurrency(p.unitCost)} / {p.unit})
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            className="text-input"
                            style={{ width: '90px' }}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          />
                          {orderItems.length > 1 && (
                            <button
                              type="button"
                              className="control-btn btn-danger"
                              style={{ padding: '0.45rem' }}
                              onClick={() => handleRemoveItemRow(idx)}
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="control-btn" onClick={() => setIsPoModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="control-btn btn-primary">
                  <Icon name="check" size={16} />
                  <span>Issue Purchase Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
