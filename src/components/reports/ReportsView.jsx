import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Icon } from '../common/Icons';

export const ReportsView = () => {
  const { products, metrics, formatCurrency, transactions, warehouses } = useInventory();

  // Top valued items
  const sortedByValue = [...products].sort(
    (a, b) => (b.stock * b.unitCost) - (a.stock * a.unitCost)
  );

  // Slow moving or zero stock items
  const zeroStockItems = products.filter(p => p.stock === 0);

  // Export full JSON Backup
  const exportFullJSON = () => {
    const backup = {
      exportTimestamp: new Date().toISOString(),
      version: 'Stackly v1.0 Enterprise',
      summary: metrics,
      products,
      warehouses,
      transactions
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Stackly_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintAuditSheet = () => {
    window.print();
  };

  return (
    <div className="content-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Icon name="fileText" size={24} color="var(--primary-500)" />
            Inventory Valuation & Audit Reports
          </h1>
          <p className="section-subtitle">
            Executive accounting valuation, variance audit schedules, and automated inventory archival.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="control-btn" onClick={exportFullJSON}>
            <Icon name="download" size={16} />
            <span>Download JSON Archive</span>
          </button>
          <button className="control-btn btn-primary" onClick={handlePrintAuditSheet}>
            <Icon name="printer" size={16} />
            <span>Print Official Stocktake Sheet</span>
          </button>
        </div>
      </div>

      {/* Valuation Summary Grid */}
      <div className="kpi-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-card kpi-card indigo">
          <div className="kpi-top">
            <span className="kpi-label">Cost Asset Value</span>
            <div className="kpi-icon-box indigo"><Icon name="box" size={18} /></div>
          </div>
          <div className="kpi-value">{formatCurrency(metrics.totalStockValue)}</div>
          <div className="kpi-trend trend-neutral">FIFO Cost Basis</div>
        </div>

        <div className="glass-card kpi-card emerald">
          <div className="kpi-top">
            <span className="kpi-label">Retail Gross Value</span>
            <div className="kpi-icon-box emerald"><Icon name="trendingUp" size={18} /></div>
          </div>
          <div className="kpi-value">{formatCurrency(metrics.totalRetailValue)}</div>
          <div className="kpi-trend trend-up">Projected Turnover</div>
        </div>

        <div className="glass-card kpi-card cyan">
          <div className="kpi-top">
            <span className="kpi-label">Unrealized Gross Margin</span>
            <div className="kpi-icon-box cyan"><Icon name="trendingUp" size={18} /></div>
          </div>
          <div className="kpi-value">{formatCurrency(metrics.potentialProfit)}</div>
          <div className="kpi-trend trend-up">
            {metrics.totalRetailValue > 0 ? `${((metrics.potentialProfit / metrics.totalRetailValue) * 100).toFixed(1)}% Gross Margin` : '0%'}
          </div>
        </div>

        <div className="glass-card kpi-card rose">
          <div className="kpi-top">
            <span className="kpi-label">Stockout Revenue Risk</span>
            <div className="kpi-icon-box rose"><Icon name="alertTriangle" size={18} /></div>
          </div>
          <div className="kpi-value">{zeroStockItems.length} SKUs</div>
          <div className="kpi-trend trend-down">Zero On-Hand Units</div>
        </div>
      </div>

      {/* Top Value Concentration & Printable Stocktake Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.75rem' }}>
        {/* Highest Capital Allocation SKUs */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.3rem' }}>
            Top Asset Value Inventory Concentration
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Items holding the highest total investment value on warehouse floor
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sortedByValue.slice(0, 5).map(prod => {
              const itemTotalVal = prod.stock * prod.unitCost;
              const pctOfTotal = metrics.totalStockValue > 0 ? Math.round((itemTotalVal / metrics.totalStockValue) * 100) : 0;

              return (
                <div
                  key={prod.id}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{prod.name}</div>
                      <span style={{ fontSize: '0.72rem', color: '#818CF8', fontFamily: 'var(--font-mono)' }}>
                        {prod.sku} • {prod.stock} {prod.unit}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(itemTotalVal)}</div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pctOfTotal}% of total</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '5px', background: 'var(--bg-main)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(pctOfTotal, 5)}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #10B981)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Printable Physical Audit Sheet Preview */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Physical Stocktake Audit Schedule</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>For warehouse floor counting & auditor sign-off</span>
            </div>
            <button className="control-btn" style={{ fontSize: '0.75rem' }} onClick={handlePrintAuditSheet}>
              <Icon name="printer" size={14} />
              <span>Print Sheet</span>
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>SKU / Bin</th>
                  <th>System Qty</th>
                  <th>Physical Count</th>
                  <th>Variance</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 6).map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.sku}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.binLocation || 'Aisle Main'}</div>
                    </td>
                    <td>{p.stock} {p.unit}</td>
                    <td>
                      <div style={{ width: '60px', height: '22px', border: '1px dashed var(--border-subtle)', borderRadius: '4px' }}></div>
                    </td>
                    <td>
                      <div style={{ width: '50px', height: '22px', border: '1px dashed var(--border-subtle)', borderRadius: '4px' }}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
