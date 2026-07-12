// ===== ROLES =====
export const ROLES = {
  FLEET_MANAGER: 'fleet_manager',
  DRIVER: 'driver',
  SAFETY_OFFICER: 'safety_officer',
  FINANCIAL_ANALYST: 'financial_analyst',
};

export const ROLE_LABELS = {
  fleet_manager: 'Fleet Manager',
  driver: 'Driver',
  safety_officer: 'Safety Officer',
  financial_analyst: 'Financial Analyst',
};

export const ROLE_COLORS = {
  fleet_manager: 'badge-role-fleet',
  driver: 'badge-role-driver',
  safety_officer: 'badge-role-safety',
  financial_analyst: 'badge-role-financial',
};

// ===== VEHICLE STATUS =====
export const VEHICLE_STATUS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
};

// ===== DRIVER STATUS =====
export const DRIVER_STATUS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
};

// ===== TRIP STATUS =====
export const TRIP_STATUS = {
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// ===== VEHICLE TYPES =====
export const VEHICLE_TYPES = ['Truck', 'Van', 'Mini-Truck', 'Tanker', 'Bus', 'Pickup'];

// ===== LICENSE CATEGORIES =====
export const LICENSE_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'CE'];

// ===== EXPENSE CATEGORIES =====
export const EXPENSE_CATEGORIES = ['Toll', 'Maintenance', 'Miscellaneous', 'Repairs', 'Insurance'];

// ===== MAINTENANCE TYPES =====
export const MAINTENANCE_TYPES = ['Oil Change', 'Tire Replacement', 'Brake Service', 'Engine Overhaul', 'AC Repair', 'Electrical', 'Routine Service', 'Body Work'];

// ===== REGIONS =====
export const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'International'];

// ===== STATUS BADGE MAP =====
export const STATUS_BADGE_CLASS = {
  Available: 'badge-available',
  'On Trip': 'badge-on-trip',
  'In Shop': 'badge-in-shop',
  Retired: 'badge-retired',
  'Off Duty': 'badge-off-duty',
  Suspended: 'badge-suspended',
  Draft: 'badge-draft',
  Dispatched: 'badge-dispatched',
  Completed: 'badge-completed',
  Cancelled: 'badge-cancelled',
};

// ===== NAVIGATION PER ROLE =====
import {
  LayoutDashboard, Truck, Users, Route, Wrench,
  Fuel, ReceiptText, BarChart3, PieChart, Settings, Bell, User
} from 'lucide-react';

export const NAV_ITEMS_BY_ROLE = {
  fleet_manager: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Vehicles', icon: Truck, path: '/vehicles' },
    { label: 'Drivers', icon: Users, path: '/drivers' },
    { label: 'Trips', icon: Route, path: '/trips' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { label: 'Fuel', icon: Fuel, path: '/fuel' },
    { label: 'Expenses', icon: ReceiptText, path: '/expenses' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Analytics', icon: PieChart, path: '/analytics' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ],
  driver: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Trips', icon: Route, path: '/trips' },
    { label: 'Profile', icon: User, path: '/profile' },
  ],
  safety_officer: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Drivers', icon: Users, path: '/drivers' },
    { label: 'Vehicles', icon: Truck, path: '/vehicles' },
    { label: 'Trips', icon: Route, path: '/trips' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ],
  financial_analyst: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Fuel', icon: Fuel, path: '/fuel' },
    { label: 'Expenses', icon: ReceiptText, path: '/expenses' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Analytics', icon: PieChart, path: '/analytics' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ],
};

// ===== DEMO ACCOUNTS =====
export const DEMO_ACCOUNTS = [
  {
    id: 1,
    name: 'Ravi Kumar',
    email: 'ravi@transitops.in',
    password: 'fleet123',
    role: ROLES.FLEET_MANAGER,
    avatar: 'RK',
    department: 'Fleet Operations',
  },
  {
    id: 2,
    name: 'Priya Nair',
    email: 'priya@transitops.in',
    password: 'driver123',
    role: ROLES.DRIVER,
    avatar: 'PN',
    department: 'Logistics',
  },
  {
    id: 3,
    name: 'Arjun Mehta',
    email: 'arjun@transitops.in',
    password: 'safety123',
    role: ROLES.SAFETY_OFFICER,
    avatar: 'AM',
    department: 'Safety & Compliance',
  },
  {
    id: 4,
    name: 'Sneha Patel',
    email: 'sneha@transitops.in',
    password: 'finance123',
    role: ROLES.FINANCIAL_ANALYST,
    avatar: 'SP',
    department: 'Finance',
  },
];

// ===== PERMISSIONS PER ROLE =====
export const PERMISSIONS = {
  fleet_manager: {
    vehicles: ['view', 'create', 'edit', 'delete'],
    drivers: ['view', 'create', 'edit', 'delete'],
    trips: ['view', 'create', 'edit', 'delete'],
    maintenance: ['view', 'create', 'edit', 'delete'],
    fuel: ['view', 'create', 'edit', 'delete'],
    expenses: ['view', 'create', 'edit', 'delete'],
    reports: ['view', 'export'],
    analytics: ['view'],
    settings: ['view', 'edit'],
  },
  driver: {
    vehicles: ['view'],
    drivers: [],
    trips: ['view', 'create'],
    maintenance: [],
    fuel: [],
    expenses: [],
    reports: [],
    analytics: [],
    settings: [],
  },
  safety_officer: {
    vehicles: ['view'],
    drivers: ['view'],
    trips: ['view'],
    maintenance: ['view'],
    fuel: [],
    expenses: [],
    reports: ['view', 'export'],
    analytics: [],
    settings: ['view'],
  },
  financial_analyst: {
    vehicles: [],
    drivers: [],
    trips: ['view'],
    maintenance: [],
    fuel: ['view', 'create', 'edit'],
    expenses: ['view', 'create', 'edit'],
    reports: ['view', 'export'],
    analytics: ['view'],
    settings: ['view'],
  },
};
