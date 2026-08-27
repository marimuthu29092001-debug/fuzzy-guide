import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Icon } from '../common/Icons';

export const MovementsView = () => {
  const { products, warehouses, transactions, recordMovement, transferStock } = useInventory();

  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
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
  }, [isModalOpen]);

  // New Transaction Form State
  const [formType, setFormType] = useState('IN'); // IN, OUT, TRANSFER
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('Supplier Stock Inward Intake');
  const [referenceNo, setReferenceNo] = useState('PO-9000');
  const [operator, setOperator] = useState('Warehouse Operator');
  const [fromWarehouse, setFromWarehouse] = useState(warehouses[0]?.id || '');
  const [toWarehouse, setToWarehouse] = useState(warehouses[1]?.id || '');

  // Filtered Transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      tx.productName.toLowerCase().includes(query) ||
      (tx.sku && tx.sku.toLowerCase().includes(query)) ||
      (tx.referenceNo && tx.referenceNo.toLowerCase().includes(query)) ||
      tx.reason.toLowerCase().includes(query) ||
      (tx.operator && tx.operator.toLowerCase().includes(query));

    return matchesType && matchesQuery;
  });

  const handleSubmitMovement = (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;

    if (formType === 'TRANSFER') {
      transferStock({
        productId: prod.id,
        fromWarehouseId: fromWarehouse,
        toWarehouseId: toWarehouse,
        quantity: Number(quantity),
        notes: reason
      });
    } else {
      recordMovement({
        type: formType,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: Number(quantity),
        reason: reason,
        warehouseName: prod.warehouseName,
        operator: operator,
        referenceNo: referenceNo || `${formType}-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }

    setIsModalOpen(false);
  };

  const exportMovementsCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Product', 'SKU', 'Quantity', 'Reason', 'Facility / Route', 'Reference', 'Operator', 'Timestamp'];
    const rows = filteredTransactions.map(tx => [
      `"${tx.id}"`,
      `"${tx.type}"`,
      `"${tx.productName}"`,
      `"${tx.sku}"`,
      tx.quantity,
      `"${tx.reason}"`,
      `"${tx.warehouseName || ''}"`,
      `"${tx.referenceNo}"`,
      `"${tx.operator}"`,
      `"${new Date(tx.timestamp).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Stock_Movements_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Icon name="arrowUpDown" size={24} color="var(--primary-500)" />
            Stock In / Out Ledger
          </h1>
          <p className="section-subtitle">
            Audit trail of all inbound goods receipts, customer order dispatches, and warehouse transfers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="control-btn" onClick={exportMovementsCSV}>
            <Icon name="download" size={16} />
            <span>Export Audit Trail</span>
          </button>
          <button className="control-btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Icon name="plus" size={16} />
            <span>Record Movement</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="filter-group">
            <button
              className={`control-btn ${filterType === 'ALL' ? 'btn-primary' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              All Movements ({transactions.length})
            </button>
            <button
              className={`control-btn ${filterType === 'IN' ? 'btn-success' : ''}`}
              onClick={() => setFilterType('IN')}
            >
              Stock In (+ Receipts)
            </button>
            <button
              className={`control-btn ${filterType === 'OUT' ? 'btn-danger' : ''}`}
              onClick={() => setFilterType('OUT')}
            >
              Stock Out (- Dispatches)
            </button>
            <button
              className={`control-btn ${filterType === 'TRANSFER' ? 'btn-primary' : ''}`}
              onClick={() => setFilterType('TRANSFER')}
            >
              Transfers (⇄)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search reference, SKU, operator..."
              className="text-input"
              style={{ width: '260px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card" style={{ padding: '0.5rem', overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tx ID & Time</th>
                <th>Type</th>
                <th>Product / SKU</th>
                <th>Quantity</th>
                <th>Reason / Facility</th>
                <th>Reference No</th>
                <th>Authorized Operator</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  {/* ID & Timestamp */}
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {tx.id}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td>
                    {tx.type === 'IN' && (
                      <span className="badge badge-in-stock">
                        <Icon name="plus" size={11} /> Stock IN
                      </span>
                    )}
                    {tx.type === 'OUT' && (
                      <span className="badge badge-out-stock">
                        <Icon name="minus" size={11} /> Stock OUT
                      </span>
                    )}
                    {tx.type === 'TRANSFER' && (
                      <span className="badge badge-category">
                        ⇄ Transfer
                      </span>
                    )}
                  </td>

                  {/* Product */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tx.productName}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#818CF8' }}>
                      {tx.sku}
                    </div>
                  </td>

                  {/* Quantity */}
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: tx.type === 'IN' ? '#10B981' : tx.type === 'OUT' ? '#EF4444' : '#818CF8'
                      }}
                    >
                      {tx.type === 'IN' ? '+' : tx.type === 'OUT' ? '-' : '⇄'} {tx.quantity}
                    </span>
                  </td>

                  {/* Reason & Facility */}
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>{tx.reason}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {tx.warehouseName}
                    </div>
                  </td>

                  {/* Reference */}
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: 'var(--bg-surface-elevated)', padding: '2px 8px', borderRadius: '4px' }}>
                      {tx.referenceNo}
                    </span>
                  </td>

                  {/* Operator */}
                  <td>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {tx.operator || 'System'}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No stock movement records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Movement Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: '#818CF8' }}>
                  <Icon name="arrowUpDown" size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Log New Stock Movement</h2>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Record inventory intake, outbound shipment dispatch, or inter-warehouse transfer
                  </span>
                </div>
              </div>
              <button className="control-btn btn-icon-round" onClick={() => setIsModalOpen(false)}>
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitMovement}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* Type Selector */}
                  <div className="form-group col-span-2">
                    <label className="form-label">Movement Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                      <button
                        type="button"
                        className={`control-btn ${formType === 'IN' ? 'btn-success' : ''}`}
                        onClick={() => {
                          setFormType('IN');
                          setReason('Supplier Purchase Restock');
                        }}
                      >
                        + Stock IN
                      </button>
                      <button
                        type="button"
                        className={`control-btn ${formType === 'OUT' ? 'btn-danger' : ''}`}
                        onClick={() => {
                          setFormType('OUT');
                          setReason('Customer Order Dispatch');
                        }}
                      >
                        - Stock OUT
                      </button>
                      <button
                        type="button"
                        className={`control-btn ${formType === 'TRANSFER' ? 'btn-primary' : ''}`}
                        onClick={() => {
                          setFormType('TRANSFER');
                          setReason('Facility Stock Rebalance');
                        }}
                      >
                        ⇄ Transfer
                      </button>
                    </div>
                  </div>

                  {/* Product Selection */}
                  <div className="form-group col-span-2">
                    <label className="form-label">Select SKU / Product *</label>
                    <select
                      className="select-input"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} [{p.sku}] - Current Stock: {p.stock} {p.unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="form-group">
                    <label className="form-label">Quantity to Move *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="text-input"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  {/* Reference No */}
                  <div className="form-group">
                    <label className="form-label">Reference Number (PO/SO/TR)</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="e.g. PO-8901, SO-4421"
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)}
                    />
                  </div>

                  {/* If Transfer: Origin & Destination */}
                  {formType === 'TRANSFER' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Source Warehouse</label>
                        <select
                          className="select-input"
                          value={fromWarehouse}
                          onChange={(e) => setFromWarehouse(e.target.value)}
                        >
                          {warehouses.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Destination Warehouse</label>
                        <select
                          className="select-input"
                          value={toWarehouse}
                          onChange={(e) => setToWarehouse(e.target.value)}
                        >
                          {warehouses.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Reason */}
                  <div className="form-group col-span-2">
                    <label className="form-label">Reason / Memo</label>
                    <input
                      type="text"
                      className="text-input"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  {/* Operator */}
                  <div className="form-group col-span-2">
                    <label className="form-label">Operator / Approver</label>
                    <input
                      type="text"
                      className="text-input"
                      value={operator}
                      onChange={(e) => setOperator(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="control-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="control-btn btn-primary">
                  <Icon name="check" size={16} />
                  <span>Submit Transaction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
