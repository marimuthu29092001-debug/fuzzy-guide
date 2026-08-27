export const INITIAL_WAREHOUSES = [
  {
    id: "wh-1",
    name: "Chennai Central Hub",
    code: "MAA-01",
    location: "Guindy Industrial Estate, Chennai",
    capacity: 25000,
    usedCapacity: 19450,
    manager: "Karthik Subramanian",
    status: "Active",
    zones: ["Aisle A (High Density)", "Aisle B (Heavy Goods)", "Aisle C (Electronics)", "Cold Storage Zone"]
  },
  {
    id: "wh-2",
    name: "Bengaluru Logistics Hub",
    code: "BLR-02",
    location: "Electronic City Phase 1, Bengaluru",
    capacity: 18000,
    usedCapacity: 11200,
    manager: "Ananya Sharma",
    status: "Active",
    zones: ["Tech Bay 1", "Tech Bay 2", "Express Dispatch Dock"]
  },
  {
    id: "wh-3",
    name: "Mumbai Sea-Freight Terminal",
    code: "BOM-03",
    location: "JNPT Logistics Zone, Navi Mumbai",
    capacity: 35000,
    usedCapacity: 31800,
    manager: "Vikram Mehta",
    status: "Active",
    zones: ["Container Yard 4", "Bulk Storage Hall A", "Inspection Bay"]
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: "sup-1",
    name: "Apex Silicon & Microtech Ltd",
    contactPerson: "Rajesh Kannan",
    email: "rajesh@apexsilicon.com",
    phone: "+91 98401 23456",
    rating: 4.9,
    leadTimeDays: 4,
    categories: ["Electronics", "Components"],
    activeOrders: 2,
    city: "Bengaluru, India"
  },
  {
    id: "sup-2",
    name: "Nordic Precision Metals & Fasteners",
    contactPerson: "Arun David",
    email: "orders@nordicmetals.in",
    phone: "+91 94440 98765",
    rating: 4.7,
    leadTimeDays: 7,
    categories: ["Industrial Hardware", "Raw Materials"],
    activeOrders: 1,
    city: "Coimbatore, India"
  },
  {
    id: "sup-3",
    name: "Zenith Polymer & Packaging Corp",
    contactPerson: "Priya Sundaram",
    email: "contact@zenithpackaging.com",
    phone: "+91 99620 44556",
    rating: 4.8,
    leadTimeDays: 3,
    categories: ["Packaging", "Finished Goods"],
    activeOrders: 0,
    city: "Chennai, India"
  },
  {
    id: "sup-4",
    name: "OmniPower Electrical Solutions",
    contactPerson: "Naveen Kumar",
    email: "sales@omnipower.co.in",
    phone: "+91 98200 11223",
    rating: 4.6,
    leadTimeDays: 5,
    categories: ["Electricals", "Power Supplies"],
    activeOrders: 1,
    city: "Hyderabad, India"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "STK-1001",
    sku: "STK-MCU-ESP32S3",
    name: "ESP32-S3 Dual-Core WiFi/BLE Microcontroller",
    category: "Electronics",
    barcode: "8901234567890",
    description: "High-performance IoT dual-core Xtensa 32-bit SoC with 8MB PSRAM and native USB.",
    stock: 450,
    minStock: 100,
    maxStock: 1000,
    unitCost: 320,
    retailPrice: 580,
    unit: "pcs",
    warehouseId: "wh-1",
    warehouseName: "Chennai Central Hub",
    binLocation: "Aisle C - Shelf 04 - Bin 12",
    supplierId: "sup-1",
    supplierName: "Apex Silicon & Microtech Ltd",
    lastUpdated: "2026-08-25T10:30:00Z",
    status: "In Stock"
  },
  {
    id: "STK-1002",
    sku: "STK-IND-BEAR608",
    name: "Precision Ceramic Ball Bearing 608-RS",
    category: "Industrial Hardware",
    barcode: "8901234567891",
    description: "ABEC-9 industrial grade hybrid ceramic bearings with low friction silicone seal.",
    stock: 28,
    minStock: 50,
    maxStock: 500,
    unitCost: 145,
    retailPrice: 280,
    unit: "pcs",
    warehouseId: "wh-1",
    warehouseName: "Chennai Central Hub",
    binLocation: "Aisle B - Shelf 02 - Bin 08",
    supplierId: "sup-2",
    supplierName: "Nordic Precision Metals & Fasteners",
    lastUpdated: "2026-08-26T14:15:00Z",
    status: "Low Stock"
  },
  {
    id: "STK-1003",
    sku: "STK-PWR-SMPS24V",
    name: "Industrial 24V 15A DIN-Rail Power Supply",
    category: "Electricals",
    barcode: "8901234567892",
    description: "360W Ultra-slim DIN-rail AC/DC switching power unit with 94% efficiency & surge protector.",
    stock: 0,
    minStock: 20,
    maxStock: 150,
    unitCost: 1850,
    retailPrice: 2950,
    unit: "units",
    warehouseId: "wh-2",
    warehouseName: "Bengaluru Logistics Hub",
    binLocation: "Tech Bay 1 - Rack 03",
    supplierId: "sup-4",
    supplierName: "OmniPower Electrical Solutions",
    lastUpdated: "2026-08-24T09:00:00Z",
    status: "Out of Stock"
  },
  {
    id: "STK-1004",
    sku: "STK-PKG-BXECOM-L",
    name: "Heavy-Duty 5-Ply Corrugated Shipping Box (L)",
    category: "Packaging",
    barcode: "8901234567893",
    description: "450x300x250mm reinforced kraft paper boxes with 35kg burst strength for logistics.",
    stock: 1840,
    minStock: 400,
    maxStock: 3000,
    unitCost: 38,
    retailPrice: 75,
    unit: "packs",
    warehouseId: "wh-3",
    warehouseName: "Mumbai Sea-Freight Terminal",
    binLocation: "Bulk Storage Hall A - Pallet 14",
    supplierId: "sup-3",
    supplierName: "Zenith Polymer & Packaging Corp",
    lastUpdated: "2026-08-27T08:45:00Z",
    status: "In Stock"
  },
  {
    id: "STK-1005",
    sku: "STK-SNS-LIDART20",
    name: "Solid-State 3D LiDAR Sensor Module 20m",
    category: "Electronics",
    barcode: "8901234567894",
    description: "ToF ranging sensor with 120° FOV, UART/I2C communication, and IP67 waterproof housing.",
    stock: 12,
    minStock: 25,
    maxStock: 100,
    unitCost: 4200,
    retailPrice: 6900,
    unit: "units",
    warehouseId: "wh-2",
    warehouseName: "Bengaluru Logistics Hub",
    binLocation: "Tech Bay 2 - Vault B",
    supplierId: "sup-1",
    supplierName: "Apex Silicon & Microtech Ltd",
    lastUpdated: "2026-08-26T17:20:00Z",
    status: "Critical"
  },
  {
    id: "STK-1006",
    sku: "STK-FAS-M4TIHEX",
    name: "Grade 5 Titanium M4 Socket Cap Screws (Pack 50)",
    category: "Industrial Hardware",
    barcode: "8901234567895",
    description: "Aerospace grade Ti-6Al-4V ultra-lightweight high-tensile hardware fasteners.",
    stock: 120,
    minStock: 40,
    maxStock: 300,
    unitCost: 850,
    retailPrice: 1450,
    unit: "packs",
    warehouseId: "wh-1",
    warehouseName: "Chennai Central Hub",
    binLocation: "Aisle A - Tray 19",
    supplierId: "sup-2",
    supplierName: "Nordic Precision Metals & Fasteners",
    lastUpdated: "2026-08-25T11:10:00Z",
    status: "In Stock"
  },
  {
    id: "STK-1007",
    sku: "STK-CAB-CAT6SFTP",
    name: "Industrial Cat6A S/FTP Shielded Cable (305m Drum)",
    category: "Electricals",
    barcode: "8901234567896",
    description: "10Gbps pure copper 23AWG double-shielded LSZH flame retardant spool.",
    stock: 45,
    minStock: 15,
    maxStock: 80,
    unitCost: 6500,
    retailPrice: 9800,
    unit: "drums",
    warehouseId: "wh-3",
    warehouseName: "Mumbai Sea-Freight Terminal",
    binLocation: "Hall A - Rack 08",
    supplierId: "sup-4",
    supplierName: "OmniPower Electrical Solutions",
    lastUpdated: "2026-08-26T16:00:00Z",
    status: "In Stock"
  },
  {
    id: "STK-1008",
    sku: "STK-PKG-BUBROLL",
    name: "Anti-Static Biodegradable Air Bubble Wrap (100m)",
    category: "Packaging",
    barcode: "8901234567897",
    description: "Eco-friendly compostable bubble cushioning roll with ESD protection coating.",
    stock: 8,
    minStock: 20,
    maxStock: 120,
    unitCost: 550,
    retailPrice: 920,
    unit: "rolls",
    warehouseId: "wh-1",
    warehouseName: "Chennai Central Hub",
    binLocation: "Aisle B - Bay 06",
    supplierId: "sup-3",
    supplierName: "Zenith Polymer & Packaging Corp",
    lastUpdated: "2026-08-27T09:15:00Z",
    status: "Critical"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TX-9041",
    type: "IN", // IN, OUT, TRANSFER, ADJUST
    productId: "STK-1001",
    productName: "ESP32-S3 Dual-Core WiFi/BLE Microcontroller",
    sku: "STK-MCU-ESP32S3",
    quantity: 150,
    reason: "Supplier Purchase Order PO-8021 Received",
    warehouseName: "Chennai Central Hub",
    operator: "Karthik Subramanian",
    timestamp: "2026-08-27T09:40:00Z",
    referenceNo: "PO-8021"
  },
  {
    id: "TX-9040",
    type: "OUT",
    productId: "STK-1003",
    productName: "Industrial 24V 15A DIN-Rail Power Supply",
    sku: "STK-PWR-SMPS24V",
    quantity: 20,
    reason: "Production Line Dispatch Batch #441",
    warehouseName: "Bengaluru Logistics Hub",
    operator: "Ananya Sharma",
    timestamp: "2026-08-26T16:30:00Z",
    referenceNo: "SO-4019"
  },
  {
    id: "TX-9039",
    type: "TRANSFER",
    productId: "STK-1004",
    productName: "Heavy-Duty 5-Ply Corrugated Shipping Box (L)",
    sku: "STK-PKG-BXECOM-L",
    quantity: 300,
    reason: "Inter-Warehouse Balance Reallocation",
    fromWarehouse: "Mumbai Sea-Freight Terminal",
    toWarehouse: "Chennai Central Hub",
    warehouseName: "Transfer: BOM-03 -> MAA-01",
    operator: "Vikram Mehta",
    timestamp: "2026-08-26T11:15:00Z",
    referenceNo: "TR-3008"
  },
  {
    id: "TX-9038",
    type: "OUT",
    productId: "STK-1005",
    productName: "Solid-State 3D LiDAR Sensor Module 20m",
    sku: "STK-SNS-LIDART20",
    quantity: 13,
    reason: "Robotics R&D Client Shipment",
    warehouseName: "Bengaluru Logistics Hub",
    operator: "Ananya Sharma",
    timestamp: "2026-08-25T15:20:00Z",
    referenceNo: "INV-7740"
  },
  {
    id: "TX-9037",
    type: "IN",
    productId: "STK-1006",
    productName: "Grade 5 Titanium M4 Socket Cap Screws",
    sku: "STK-FAS-M4TIHEX",
    quantity: 60,
    reason: "Routine Restock from Nordic Metals",
    warehouseName: "Chennai Central Hub",
    operator: "Karthik Subramanian",
    timestamp: "2026-08-24T14:10:00Z",
    referenceNo: "PO-8018"
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: "PO-8022",
    supplierId: "sup-4",
    supplierName: "OmniPower Electrical Solutions",
    items: [
      { productId: "STK-1003", name: "Industrial 24V 15A DIN-Rail Power Supply", quantity: 50, unitCost: 1850 }
    ],
    totalAmount: 92500,
    status: "Ordered",
    expectedDelivery: "2026-09-01",
    createdAt: "2026-08-26T11:00:00Z",
    priority: "High"
  },
  {
    id: "PO-8021",
    supplierId: "sup-1",
    supplierName: "Apex Silicon & Microtech Ltd",
    items: [
      { productId: "STK-1001", name: "ESP32-S3 Dual-Core WiFi/BLE SoC", quantity: 150, unitCost: 320 },
      { productId: "STK-1005", name: "Solid-State 3D LiDAR Module", quantity: 25, unitCost: 4200 }
    ],
    totalAmount: 153000,
    status: "Received",
    expectedDelivery: "2026-08-27",
    createdAt: "2026-08-22T09:30:00Z",
    priority: "Medium"
  },
  {
    id: "PO-8020",
    supplierId: "sup-3",
    supplierName: "Zenith Polymer & Packaging Corp",
    items: [
      { productId: "STK-1008", name: "Anti-Static Biodegradable Air Bubble Wrap", quantity: 40, unitCost: 550 }
    ],
    totalAmount: 22000,
    status: "Draft",
    expectedDelivery: "2026-08-30",
    createdAt: "2026-08-27T08:00:00Z",
    priority: "High"
  }
];

export const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Industrial Hardware",
  "Electricals",
  "Packaging",
  "Raw Materials",
  "Finished Goods"
];
