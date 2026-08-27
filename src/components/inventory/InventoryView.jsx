import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { CATEGORIES } from '../../data/initialData';
import { Icon } from '../common/Icons';

export const InventoryView = ({ onOpenAddModal, onEditProduct }) => {
  const {
    products,
    warehouses,
    formatCurrency,
    quickAdjustStock,
    deleteProduct,
    globalSearch,
    setGlobalSearch
  } = useInventory();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(item => {
        // Search query
        const query = globalSearch.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          (item.barcode && item.barcode.includes(query)) ||
          (item.binLocation && item.binLocation.toLowerCase().includes(query));

        // Category filter
        const matchesCategory =
          selectedCategory === 'All Categories' || item.category === selectedCategory;

        // Status filter
        const matchesStatus =
          selectedStatus === 'ALL' || item.status.toUpperCase() === selectedStatus;

        // Warehouse filter
        const matchesWarehouse =
          selectedWarehouse === 'ALL' || item.warehouseId === selectedWarehouse;

        return matchesSearch && matchesCategory && matchesStatus && matchesWarehouse;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [products, globalSearch, selectedCategory, selectedStatus, selectedWarehouse, sortBy, sortOrder]);

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Barcode', 'Current Stock', 'Min Stock', 'Unit Cost', 'Retail Price', 'Warehouse', 'Bin Location', 'Status'];
    const rows = filteredProducts.map(p => [
      `"${p.sku}"`,
      `"${p.name}"`,
      `"${p.category}"`,
      `"${p.barcode}"`,
      p.stock,
      p.minStock,
      p.unitCost,
      p.retailPrice,
      `"${p.warehouseName}"`,
      `"${p.binLocation}"`,
      `"${p.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Stackly_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return <span className="badge badge-in-stock"><Icon name="check" size={12} /> In Stock</span>;
      case 'Low Stock':
        return <span className="badge badge-low-stock"><Icon name="alertTriangle" size={12} /> Low Stock</span>;
      case 'Critical':
        return <span className="badge badge-critical"><Icon name="alertTriangle" size={12} /> Critical</span>;
      case 'Out of Stock':
        return <span className="badge badge-out-stock"><Icon name="close" size={12} /> Out of Stock</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="content-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Icon name="box" size={24} color="var(--primary-500)" />
            Inventory Master Catalog
          </h1>
          <p className="section-subtitle">
            Manage SKU specifications, bin locations, purchase thresholds, and real-time on-hand quantities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="control-btn" onClick={exportToCSV} title="Export current list to CSV spreadsheet">
            <Icon name="download" size={16} />
            <span>Export CSV</span>
          </button>
          <button className="control-btn btn-primary" onClick={onOpenAddModal}>
            <Icon name="plus" size={16} />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="filter-group">
            {/* Category */}
            <select
              className="select-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="select-input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN STOCK">In Stock</option>
              <option value="LOW STOCK">Low Stock</option>
              <option value="CRITICAL">Critical Low</option>
              <option value="OUT OF STOCK">Out of Stock</option>
            </select>

            {/* Warehouse Filter */}
            <select
              className="select-input"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
            >
              <option value="ALL">All Warehouses</option>
              {warehouses.map(wh => (
                <option key={wh.id} value={wh.id}>{wh.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredProducts.length}</strong> of {products.length} SKUs
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Master Table */}
      <div className="glass-card" style={{ padding: '0.5rem', overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
                  Product Details / SKU ↕
                </th>
                <th>Category</th>
                <th onClick={() => { setSortBy('stock'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
                  On Hand Stock ↕
                </th>
                <th>Status</th>
                <th>Unit Cost / Retail</th>
                <th>Warehouse & Bin</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  {/* Product Details */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#818CF8', background: 'rgba(99, 102, 241, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                        {product.sku}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Barcode: {product.barcode}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="badge badge-category">{product.category}</span>
                  </td>

                  {/* Stock with Quick Adjust */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div className="stock-adjuster">
                        <button
                          className="adjust-btn"
                          onClick={() => quickAdjustStock(product.id, -1, 'Catalog Decrement')}
                          disabled={product.stock <= 0}
                          title="Decrease 1"
                        >
                          <Icon name="minus" size={12} />
                        </button>
                        <span className="adjust-qty">{product.stock}</span>
                        <button
                          className="adjust-btn"
                          onClick={() => quickAdjustStock(product.id, 1, 'Catalog Increment')}
                          title="Increase 1"
                        >
                          <Icon name="plus" size={12} />
                        </button>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {product.unit} (Min: {product.minStock})
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td>{getStatusBadge(product.status)}</td>

                  {/* Pricing */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {formatCurrency(product.retailPrice)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Cost: {formatCurrency(product.unitCost)}
                    </div>
                  </td>

                  {/* Warehouse Location */}
                  <td>
                    <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                      {product.warehouseName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {product.binLocation || 'Unassigned'}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        className="control-btn"
                        style={{ padding: '0.35rem 0.55rem' }}
                        onClick={() => onEditProduct(product)}
                        title="Edit specifications"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        className="control-btn btn-danger"
                        style={{ padding: '0.35rem 0.55rem' }}
                        onClick={() => {
                          if (window.confirm(`Delete ${product.name} from catalog?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        title="Remove product"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <Icon name="box" size={36} color="var(--text-muted)" />
                      <span>No matching products found. Adjust your search or filters.</span>
                      <button className="control-btn btn-primary" onClick={onOpenAddModal}>
                        Create New SKU
                      </button>
                    </div>
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
