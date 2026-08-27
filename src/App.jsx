import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { InventoryView } from './components/inventory/InventoryView';
import { MovementsView } from './components/movements/MovementsView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { WarehouseView } from './components/warehouses/WarehouseView';
import { BarcodeView } from './components/scanner/BarcodeView';
import { ReportsView } from './components/reports/ReportsView';
import { ProductModal } from './components/inventory/ProductModal';

const AppContent = () => {
  const { currentView } = useInventory();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (prod) => {
    setProductToEdit(prod);
    setProductModalOpen(true);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenAddModal={handleOpenAddModal}
          />
        );
      case 'inventory':
        return (
          <InventoryView
            onOpenAddModal={handleOpenAddModal}
            onEditProduct={handleEditProduct}
          />
        );
      case 'movements':
        return <MovementsView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'warehouses':
        return <WarehouseView />;
      case 'barcode':
        return <BarcodeView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView onOpenAddModal={handleOpenAddModal} />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Sidebar Backdrop */}
      <div
        className={`mobile-backdrop ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Dynamic View */}
        <main>{renderActiveView()}</main>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}

export default App;
