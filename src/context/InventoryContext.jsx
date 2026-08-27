import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSES,
  INITIAL_SUPPLIERS,
  INITIAL_TRANSACTIONS,
  INITIAL_PURCHASE_ORDERS
} from '../data/initialData';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('stackly_theme') || 'dark';
  });

  // Currency state (INR ₹, USD $, EUR €)
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('stackly_currency') || 'INR';
  });

  // Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('stackly_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Warehouses
  const [warehouses, setWarehouses] = useState(() => {
    const saved = localStorage.getItem('stackly_warehouses');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
  });

  // Suppliers
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('stackly_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  // Transactions / Movement History
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('stackly_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Purchase Orders
  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    const saved = localStorage.getItem('stackly_pos');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  // Toast / Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Low Stock Alert',
      message: 'Solid-State 3D LiDAR Sensor is critically low (12 units left).',
      type: 'warning',
      timestamp: '10 mins ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Shipment Received',
      message: 'PO-8021 arrived at Chennai Central Hub.',
      type: 'success',
      timestamp: '2 hours ago',
      read: false
    }
  ]);

  // Current active view
  const [currentView, setCurrentView] = useState('dashboard');
  // Global search
  const [globalSearch, setGlobalSearch] = useState('');

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('stackly_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('stackly_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('stackly_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('stackly_warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem('stackly_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('stackly_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('stackly_pos', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  // Helper for Currency Formatting
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    } else if (currency === 'USD') {
      const converted = num / 84; // Mock conversion rate
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(converted);
    } else if (currency === 'EUR') {
      const converted = num / 91;
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2
      }).format(converted);
    }
    return `₹${num.toLocaleString()}`;
  };

  const getCurrencySymbol = () => {
    if (currency === 'USD') return '$';
    if (currency === 'EUR') return '€';
    return '₹';
  };

  // Helper for Status compute
  const computeStatus = (stock, minStock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= Math.floor(minStock * 0.5)) return 'Critical';
    if (stock <= minStock) return 'Low Stock';
    return 'In Stock';
  };

  // Add or Update Product
  const saveProduct = (productData) => {
    const isEdit = Boolean(productData.id && products.some(p => p.id === productData.id));
    const status = computeStatus(productData.stock, productData.minStock);
    const updatedData = {
      ...productData,
      status,
      lastUpdated: new Date().toISOString()
    };

    if (isEdit) {
      setProducts(prev => prev.map(p => p.id === productData.id ? updatedData : p));
      addNotification({
        title: 'Product Updated',
        message: `${productData.name} (${productData.sku}) details modified.`,
        type: 'info'
      });
    } else {
      const newId = `STK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProduct = {
        ...updatedData,
        id: newId,
        barcode: productData.barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`
      };
      setProducts(prev => [newProduct, ...prev]);
      addNotification({
        title: 'New Product Added',
        message: `${newProduct.name} added to catalog.`,
        type: 'success'
      });
      // Register initial stock transaction if stock > 0
      if (newProduct.stock > 0) {
        recordMovement({
          type: 'IN',
          productId: newProduct.id,
          productName: newProduct.name,
          sku: newProduct.sku,
          quantity: Number(newProduct.stock),
          reason: 'Initial Catalog Inventory Intake',
          warehouseName: newProduct.warehouseName || 'Chennai Central Hub',
          operator: 'System Admin',
          referenceNo: 'INIT-IN'
        });
      }
    }
  };

  // Delete Product
  const deleteProduct = (id) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (target) {
      addNotification({
        title: 'Product Removed',
        message: `${target.name} has been deleted from inventory.`,
        type: 'warning'
      });
    }
  };

  // Quick Adjust Stock (Inline + / -)
  const quickAdjustStock = (productId, delta, reason = 'Quick Manual Adjustment') => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          const status = computeStatus(newStock, p.minStock);
          return {
            ...p,
            stock: newStock,
            status,
            lastUpdated: new Date().toISOString()
          };
        }
        return p;
      })
    );

    const product = products.find(p => p.id === productId);
    if (product) {
      const type = delta >= 0 ? 'IN' : 'OUT';
      recordMovement({
        type,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: Math.abs(delta),
        reason: `${reason} (${delta > 0 ? '+' : ''}${delta})`,
        warehouseName: product.warehouseName || 'Chennai Central Hub',
        operator: 'Floor Supervisor',
        referenceNo: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }
  };

  // Record Stock In / Out / Transfer
  const recordMovement = (txData) => {
    const newTx = {
      ...txData,
      id: `TX-${Math.floor(9000 + Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update product stock if not already handled
    if (txData.productId && txData.type !== 'TRANSFER') {
      const qtyChange = txData.type === 'IN' ? Number(txData.quantity) : -Number(txData.quantity);
      setProducts(prev =>
        prev.map(p => {
          if (p.id === txData.productId) {
            const newStock = Math.max(0, p.stock + qtyChange);
            return {
              ...p,
              stock: newStock,
              status: computeStatus(newStock, p.minStock),
              lastUpdated: new Date().toISOString()
            };
          }
          return p;
        })
      );
    }
  };

  // Transfer stock between warehouses
  const transferStock = ({ productId, fromWarehouseId, toWarehouseId, quantity, notes }) => {
    const product = products.find(p => p.id === productId);
    const fromWh = warehouses.find(w => w.id === fromWarehouseId);
    const toWh = warehouses.find(w => w.id === toWarehouseId);

    if (!product || !fromWh || !toWh) return;

    recordMovement({
      type: 'TRANSFER',
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: Number(quantity),
      reason: notes || `Transfer from ${fromWh.name} to ${toWh.name}`,
      fromWarehouse: fromWh.name,
      toWarehouse: toWh.name,
      warehouseName: `Transfer: ${fromWh.code} -> ${toWh.code}`,
      operator: 'Logistics Coordinator',
      referenceNo: `TR-${Math.floor(3000 + Math.random() * 1000)}`
    });

    addNotification({
      title: 'Warehouse Transfer Logged',
      message: `${quantity} ${product.unit} of ${product.name} routed to ${toWh.name}.`,
      type: 'success'
    });
  };

  // Create Purchase Order
  const createPurchaseOrder = (poData) => {
    const newPO = {
      ...poData,
      id: `PO-${Math.floor(8000 + Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: poData.status || 'Ordered'
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
    addNotification({
      title: 'Purchase Order Created',
      message: `${newPO.id} raised for ${newPO.supplierName} (${formatCurrency(newPO.totalAmount)}).`,
      type: 'success'
    });
    return newPO;
  };

  // Receive Purchase Order (Updates all item quantities in Inventory)
  const receivePurchaseOrder = (poId) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po || po.status === 'Received') return;

    // Mark as received
    setPurchaseOrders(prev =>
      prev.map(p => (p.id === poId ? { ...p, status: 'Received' } : p))
    );

    // Increment stocks
    po.items.forEach(item => {
      quickAdjustStock(item.productId, item.quantity, `PO Receipt [${po.id}]`);
    });

    addNotification({
      title: 'PO Restocked Successfully',
      message: `All items for order ${po.id} checked into warehouse inventory.`,
      type: 'success'
    });
  };

  // Auto Generate PO for Low Stock Items
  const autoGenerateLowStockPO = () => {
    const lowStockItems = products.filter(p => p.stock <= p.minStock);
    if (lowStockItems.length === 0) {
      addNotification({
        title: 'All Stock Optimal',
        message: 'No items are currently below minimum safety stock levels.',
        type: 'info'
      });
      return;
    }

    // Group by supplier
    const groupedBySupplier = {};
    lowStockItems.forEach(item => {
      const supId = item.supplierId || 'sup-1';
      if (!groupedBySupplier[supId]) {
        groupedBySupplier[supId] = [];
      }
      const orderQty = Math.max(item.maxStock - item.stock, item.minStock * 2);
      groupedBySupplier[supId].push({
        productId: item.id,
        name: item.name,
        quantity: orderQty,
        unitCost: item.unitCost
      });
    });

    let count = 0;
    Object.keys(groupedBySupplier).forEach(supId => {
      const sup = suppliers.find(s => s.id === supId) || suppliers[0];
      const items = groupedBySupplier[supId];
      const totalAmount = items.reduce((acc, curr) => acc + curr.quantity * curr.unitCost, 0);

      const d = new Date();
      d.setDate(d.getDate() + (sup.leadTimeDays || 4));

      createPurchaseOrder({
        supplierId: sup.id,
        supplierName: sup.name,
        items,
        totalAmount,
        status: 'Ordered',
        expectedDelivery: d.toISOString().split('T')[0],
        priority: 'High'
      });
      count++;
    });

    addNotification({
      title: 'Automated Reorders Raised',
      message: `Generated ${count} purchase order(s) for ${lowStockItems.length} low-stock SKU(s).`,
      type: 'success'
    });
  };

  // Notification helper
  const addNotification = ({ title, message, type = 'info' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 15)]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset to Factory Default Data
  const resetToFactoryData = () => {
    setProducts(INITIAL_PRODUCTS);
    setWarehouses(INITIAL_WAREHOUSES);
    setSuppliers(INITIAL_SUPPLIERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    localStorage.clear();
    addNotification({
      title: 'Data Reset',
      message: 'Factory demo dataset restored successfully.',
      type: 'info'
    });
  };

  // Summary Metrics calculations
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.unitCost), 0);
  const totalRetailValue = products.reduce((acc, p) => acc + (p.stock * p.retailPrice), 0);
  const totalSkuCount = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const inStockCount = products.filter(p => p.stock > p.minStock).length;

  return (
    <InventoryContext.Provider
      value={{
        theme,
        setTheme,
        currency,
        setCurrency,
        formatCurrency,
        getCurrencySymbol,
        products,
        warehouses,
        suppliers,
        transactions,
        purchaseOrders,
        notifications,
        currentView,
        setCurrentView,
        globalSearch,
        setGlobalSearch,
        saveProduct,
        deleteProduct,
        quickAdjustStock,
        recordMovement,
        transferStock,
        createPurchaseOrder,
        receivePurchaseOrder,
        autoGenerateLowStockPO,
        addNotification,
        markAllNotificationsRead,
        resetToFactoryData,
        // Computed metrics
        metrics: {
          totalStockValue,
          totalRetailValue,
          potentialProfit: totalRetailValue - totalStockValue,
          totalSkuCount,
          lowStockCount,
          outOfStockCount,
          inStockCount
        }
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
