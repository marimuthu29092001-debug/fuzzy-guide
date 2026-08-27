import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Icon } from '../common/Icons';

export const BarcodeView = () => {
  const { products, quickAdjustStock, formatCurrency } = useInventory();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [scanInput, setScanInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Handle barcode lookup
  const handleScanLookup = (code) => {
    const cleanCode = code.trim().toLowerCase();
    const found = products.find(
      p =>
        (p.barcode && p.barcode.toLowerCase() === cleanCode) ||
        p.sku.toLowerCase() === cleanCode ||
        p.id.toLowerCase() === cleanCode
    );

    if (found) {
      setScannedProduct(found);
      setScanFeedback({ type: 'success', message: `Found: ${found.name}` });
    } else {
      setScannedProduct(null);
      setScanFeedback({ type: 'error', message: 'No item found with barcode / SKU: ' + code });
    }
  };

  const handleSimulateLaserScan = (prod) => {
    setIsScanning(true);
    setScanInput(prod.barcode);
    setTimeout(() => {
      setIsScanning(false);
      handleScanLookup(prod.barcode);
    }, 600);
  };

  const handlePrintLabels = () => {
    window.print();
  };

  return (
    <div className="content-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Icon name="barcode" size={24} color="var(--primary-500)" />
            Barcode & Rapid Scanner Station
          </h1>
          <p className="section-subtitle">
            Generate EAN/UPC labels, print warehouse bin stickers, and perform rapid optical check-in/check-out.
          </p>
        </div>

        <button className="control-btn btn-primary" onClick={handlePrintLabels}>
          <Icon name="printer" size={16} />
          <span>Print Barcode Label Sheet</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem' }}>
        {/* Left Column: Barcode Generator & Printable Label Card */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Barcode & Asset Label Generator
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Select an item to generate high-resolution warehouse bin labels
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
              Select Product:
            </label>
            <select
              className="select-input"
              style={{ width: '100%' }}
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} [{p.sku}]
                </option>
              ))}
            </select>
          </div>

          {/* Printable Label Badge Card */}
          {selectedProduct && (
            <div
              style={{
                background: '#FFFFFF',
                color: '#111827',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '2px dashed #9CA3AF'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                STACKLY LOGISTICS ASSET TAG
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem', maxWidth: '320px' }}>
                {selectedProduct.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#4B5563', marginBottom: '1rem' }}>
                SKU: {selectedProduct.sku}
              </div>

              {/* Barcode Visual Stripes */}
              <div style={{ width: '85%', maxWidth: '280px', marginBottom: '0.4rem' }}>
                <div className="barcode-stripes"></div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '0.25em', fontWeight: 700 }}>
                {selectedProduct.barcode}
              </div>

              {/* Footer details on badge */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '0.75rem', marginTop: '1rem', fontSize: '0.75rem', color: '#4B5563' }}>
                <span>Bin: <strong>{selectedProduct.binLocation || 'Rack A'}</strong></span>
                <span>Price: <strong>{formatCurrency(selectedProduct.retailPrice)}</strong></span>
                <span>Unit: <strong>{selectedProduct.unit}</strong></span>
              </div>
            </div>
          )}

          {/* Quick Simulators */}
          <div style={{ marginTop: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Test Quick Scanners for Demo:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {products.slice(0, 3).map(p => (
                <button
                  key={p.id}
                  className="control-btn"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  onClick={() => handleSimulateLaserScan(p)}
                >
                  <Icon name="scan" size={13} />
                  <span>Scan {p.sku.split('-')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Laser Scanner & Rapid Stock Adjuster */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Simulated Optical Scanner
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Point barcode reader or enter SKU/Barcode manually for instant check-in
            </span>
          </div>

          {/* Scanner Viewfinder Box */}
          <div
            style={{
              height: '180px',
              borderRadius: 'var(--radius-lg)',
              background: 'radial-gradient(circle at center, #1E1B4B 0%, #0B0F17 100%)',
              border: '2px solid var(--border-subtle)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: '1.25rem'
            }}
          >
            {/* Viewfinder Target Reticle */}
            <div
              style={{
                width: '180px',
                height: '90px',
                border: '2px solid rgba(99, 102, 241, 0.6)',
                borderRadius: '8px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  background: isScanning ? '#EF4444' : '#10B981',
                  boxShadow: isScanning ? '0 0 10px #EF4444' : '0 0 10px #10B981',
                  animation: 'pulse 1s infinite'
                }}
              ></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isScanning ? 'Decoding...' : 'Laser Ready'}
              </span>
            </div>
          </div>

          {/* Scan Input Form */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              className="text-input"
              style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
              placeholder="Type Barcode or SKU (e.g. 8901234567890)..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleScanLookup(scanInput);
              }}
            />
            <button
              className="control-btn btn-primary"
              onClick={() => handleScanLookup(scanInput)}
            >
              <Icon name="search" size={16} />
              <span>Lookup</span>
            </button>
          </div>

          {/* Scan Result Feedback */}
          {scanFeedback && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                background: scanFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: scanFeedback.type === 'success' ? '#10B981' : '#F87171',
                border: `1px solid ${scanFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}
            >
              {scanFeedback.message}
            </div>
          )}

          {/* Scanned Item Action Card */}
          {scannedProduct && (
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{scannedProduct.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#818CF8', fontFamily: 'var(--font-mono)' }}>
                    {scannedProduct.sku} • Bin: {scannedProduct.binLocation}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {scannedProduct.stock} {scannedProduct.unit}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>On Hand</span>
                </div>
              </div>

              {/* Rapid In/Out Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  className="control-btn btn-success"
                  style={{ justifyContent: 'center' }}
                  onClick={() => {
                    quickAdjustStock(scannedProduct.id, 1, 'Laser Scanner Intake (+1)');
                    setScannedProduct(prev => ({ ...prev, stock: prev.stock + 1 }));
                  }}
                >
                  <Icon name="plus" size={15} />
                  <span>Rapid Intake (+1)</span>
                </button>
                <button
                  className="control-btn btn-danger"
                  style={{ justifyContent: 'center' }}
                  disabled={scannedProduct.stock <= 0}
                  onClick={() => {
                    quickAdjustStock(scannedProduct.id, -1, 'Laser Scanner Dispatch (-1)');
                    setScannedProduct(prev => ({ ...prev, stock: prev.stock - 1 }));
                  }}
                >
                  <Icon name="minus" size={15} />
                  <span>Rapid Dispatch (-1)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
