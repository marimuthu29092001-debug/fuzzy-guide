import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { CATEGORIES } from '../../data/initialData';
import { Icon } from '../common/Icons';

export const ProductModal = ({ isOpen, onClose, productToEdit }) => {
  const { warehouses, suppliers, saveProduct, getCurrencySymbol } = useInventory();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    barcode: '',
    description: '',
    stock: 10,
    minStock: 15,
    maxStock: 200,
    unitCost: 100,
    retailPrice: 180,
    unit: 'pcs',
    warehouseId: 'wh-1',
    warehouseName: 'Chennai Central Hub',
    binLocation: 'Aisle A - Shelf 01',
    supplierId: 'sup-1',
    supplierName: 'Apex Silicon & Microtech Ltd'
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      // Auto-generate fresh SKU and Barcode for new item
      const randomSku = `STK-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const randomBarcode = `890${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setFormData({
        name: '',
        sku: randomSku,
        category: 'Electronics',
        barcode: randomBarcode,
        description: '',
        stock: 50,
        minStock: 20,
        maxStock: 300,
        unitCost: 500,
        retailPrice: 850,
        unit: 'pcs',
        warehouseId: warehouses[0]?.id || 'wh-1',
        warehouseName: warehouses[0]?.name || 'Chennai Central Hub',
        binLocation: 'Aisle A - Shelf 01',
        supplierId: suppliers[0]?.id || 'sup-1',
        supplierName: suppliers[0]?.name || 'Apex Silicon & Microtech Ltd'
      });
    }
  }, [productToEdit, isOpen, warehouses, suppliers]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let updated = { ...prev, [name]: value };

      if (name === 'warehouseId') {
        const wh = warehouses.find(w => w.id === value);
        if (wh) updated.warehouseName = wh.name;
      }
      if (name === 'supplierId') {
        const sup = suppliers.find(s => s.id === value);
        if (sup) updated.supplierName = sup.name;
      }

      return updated;
    });
  };

  const handleGenerateSKU = () => {
    const catCode = (formData.category.substring(0, 3) || 'GEN').toUpperCase();
    const newSku = `STK-${catCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData(prev => ({ ...prev, sku: newSku }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) {
      alert('Please fill out product name and SKU.');
      return;
    }

    saveProduct({
      ...formData,
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      unitCost: Number(formData.unitCost),
      retailPrice: Number(formData.retailPrice)
    });

    onClose();
  };

  // Calculate gross margin %
  const marginPct = formData.retailPrice > 0
    ? (((formData.retailPrice - formData.unitCost) / formData.retailPrice) * 100).toFixed(1)
    : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: '#818CF8' }}>
              <Icon name="box" size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {productToEdit ? 'Edit Product Specifications' : 'Register New Inventory SKU'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {productToEdit ? `Updating ${productToEdit.sku}` : 'Add a new product to warehouse master catalog'}
              </span>
            </div>
          </div>
          <button className="control-btn btn-icon-round" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Product Name */}
              <div className="form-group col-span-2">
                <label className="form-label">Product Name / Title *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Industrial Cat6A Shielded Spool 305m"
                  className="text-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* SKU & Auto Generator */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">SKU Identifier *</label>
                  <button
                    type="button"
                    onClick={handleGenerateSKU}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-500)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Auto Generate
                  </button>
                </div>
                <input
                  type="text"
                  name="sku"
                  required
                  className="text-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="select-input"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Barcode Number */}
              <div className="form-group">
                <label className="form-label">Barcode / UPC Number</label>
                <input
                  type="text"
                  name="barcode"
                  className="text-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  value={formData.barcode}
                  onChange={handleChange}
                />
              </div>

              {/* Unit of Measurement */}
              <div className="form-group">
                <label className="form-label">Measurement Unit</label>
                <select
                  name="unit"
                  className="select-input"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="units">Units</option>
                  <option value="packs">Packs / Boxes</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="drums">Drums / Spools</option>
                  <option value="rolls">Rolls</option>
                  <option value="meters">Meters</option>
                </select>
              </div>

              {/* On Hand Stock */}
              <div className="form-group">
                <label className="form-label">Current Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  className="text-input"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>

              {/* Minimum Reorder Stock */}
              <div className="form-group">
                <label className="form-label">Safety Stock (Min Alert)</label>
                <input
                  type="number"
                  name="minStock"
                  min="1"
                  className="text-input"
                  value={formData.minStock}
                  onChange={handleChange}
                />
              </div>

              {/* Unit Cost */}
              <div className="form-group">
                <label className="form-label">Unit Cost ({getCurrencySymbol()})</label>
                <input
                  type="number"
                  name="unitCost"
                  min="0"
                  step="any"
                  className="text-input"
                  value={formData.unitCost}
                  onChange={handleChange}
                />
              </div>

              {/* Retail Selling Price */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Selling Price ({getCurrencySymbol()})</label>
                  <span style={{ fontSize: '0.72rem', color: marginPct > 0 ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                    {marginPct}% Margin
                  </span>
                </div>
                <input
                  type="number"
                  name="retailPrice"
                  min="0"
                  step="any"
                  className="text-input"
                  value={formData.retailPrice}
                  onChange={handleChange}
                />
              </div>

              {/* Warehouse Selection */}
              <div className="form-group">
                <label className="form-label">Warehouse Facility</label>
                <select
                  name="warehouseId"
                  className="select-input"
                  value={formData.warehouseId}
                  onChange={handleChange}
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              {/* Bin Location */}
              <div className="form-group">
                <label className="form-label">Aisle / Bin Location</label>
                <input
                  type="text"
                  name="binLocation"
                  placeholder="e.g. Aisle C - Rack 04 - Bin 12"
                  className="text-input"
                  value={formData.binLocation}
                  onChange={handleChange}
                />
              </div>

              {/* Primary Supplier */}
              <div className="form-group col-span-2">
                <label className="form-label">Primary Vendor / Supplier</label>
                <select
                  name="supplierId"
                  className="select-input"
                  value={formData.supplierId}
                  onChange={handleChange}
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              {/* Notes / Description */}
              <div className="form-group col-span-2">
                <label className="form-label">Description / Technical Notes</label>
                <textarea
                  name="description"
                  rows="2"
                  className="text-input"
                  placeholder="Additional specifications or handling instructions..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="control-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="control-btn btn-primary">
              <Icon name="check" size={16} />
              <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
