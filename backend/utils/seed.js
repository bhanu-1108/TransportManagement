import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';
import Notification from '../models/Notification.js';

dotenv.config();

const usersData = [
  {
    name: 'Ravi Kumar',
    email: 'ravi@transitops.in',
    password: 'fleet123',
    role: 'fleet_manager',
    avatar: 'RK',
    department: 'Logistics'
  },
  {
    name: 'Priya Nair',
    email: 'priya@transitops.in',
    password: 'driver123',
    role: 'driver',
    avatar: 'PN',
    department: 'Operations'
  },
  {
    name: 'Arjun Singh',
    email: 'arjun@transitops.in',
    password: 'safety123',
    role: 'safety_officer',
    avatar: 'AS',
    department: 'Safety & Compliance'
  },
  {
    name: 'Sneha Patel',
    email: 'sneha@transitops.in',
    password: 'finance123',
    role: 'financial_analyst',
    avatar: 'SP',
    department: 'Finance'
  }
];

const vehiclesData = [
  { regNumber: 'MH-12-PQ-9876', name: 'Tata Ultra T.7', type: 'Truck', status: 'Available', odometer: 24500, maxLoad: 7500, acquisitionCost: 1850000, region: 'North', year: 2022, fuelType: 'Diesel', lastService: '2026-05-10' },
  { regNumber: 'MH-14-XY-1234', name: 'Mahindra Bolero Pik-Up', type: 'Van', status: 'On Trip', odometer: 48900, maxLoad: 1500, acquisitionCost: 950000, region: 'West', year: 2021, fuelType: 'Diesel', lastService: '2026-06-15' },
  { regNumber: 'DL-01-AB-5678', name: 'Ashok Leyland Ecomet', type: 'Truck', status: 'In Shop', odometer: 85200, maxLoad: 11000, acquisitionCost: 2600000, region: 'North', year: 2020, fuelType: 'Diesel', lastService: '2026-07-02' },
  { regNumber: 'KA-03-MM-4321', name: 'BharatBenz 1917R', type: 'Truck', status: 'Available', odometer: 12400, maxLoad: 10500, acquisitionCost: 2900000, region: 'South', year: 2023, fuelType: 'Diesel', lastService: '2026-04-20' },
  { regNumber: 'DL-02-CD-9876', name: 'Tata Winger Cargo', type: 'Van', status: 'Available', odometer: 32000, maxLoad: 1680, acquisitionCost: 1150000, region: 'North', year: 2022, fuelType: 'Diesel', lastService: '2026-05-18' }
];

const driversData = [
  { name: 'Karan Singh', email: 'karan@transitops.in', licenseNo: 'DL-01-2018-9876', licenseCategory: 'Heavy Vehicle', licenseExpiry: '2029-08-15', contact: '+91-98765-43210', status: 'Available', safetyScore: 92, region: 'North', joiningDate: '2021-02-10', trips: 142 },
  { name: 'Priya Nair', email: 'priya@transitops.in', licenseNo: 'MH-14-2020-5432', licenseCategory: 'Light Goods', licenseExpiry: '2026-08-20', contact: '+91-91234-56789', status: 'On Trip', safetyScore: 98, region: 'West', joiningDate: '2022-06-01', trips: 89 },
  { name: 'Baldev Singh', email: 'baldev@transitops.in', licenseNo: 'PB-02-2015-1234', licenseCategory: 'Heavy Vehicle', licenseExpiry: '2026-06-30', contact: '+91-98888-77777', status: 'Off Duty', safetyScore: 78, region: 'North', joiningDate: '2019-11-15', trips: 310 }
];

const notificationsData = [
  { title: 'Maintenance Pending', message: 'Vehicle MH-12-PQ-9876 has run 10,000km since last oil change.', type: 'warning', read: false },
  { title: 'Critical Alert: Safety Score', message: 'Driver Baldev Singh safety score fell below threshold of 80.', type: 'danger', read: false },
  { title: 'Trip Complete', message: 'Trip TR-1092 completed by Priya Nair on Tata Ultra.', type: 'success', read: true }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Drop collections
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Trip.deleteMany({});
    await Maintenance.deleteMany({});
    await FuelLog.deleteMany({});
    await Expense.deleteMany({});
    await Notification.deleteMany({});

    console.log('Old records wiped.');

    // Seed Users
    const users = await User.create(usersData);
    console.log(`Seeded ${users.length} Users.`);

    // Seed Vehicles
    const vehicles = await Vehicle.create(vehiclesData);
    console.log(`Seeded ${vehicles.length} Vehicles.`);

    // Seed Drivers
    const drivers = await Driver.create(driversData);
    console.log(`Seeded ${drivers.length} Drivers.`);

    // Seed Notifications
    const notifications = await Notification.create(notificationsData);
    console.log(`Seeded ${notifications.length} Notifications.`);

    // Seed a couple of default trips for demo
    const vId1 = vehicles[1]._id; // Bolero Pik-up
    const dId1 = drivers[1]._id;  // Priya Nair
    const tripData = [
      {
        source: 'Mumbai Port',
        destination: 'Pune Warehouse',
        vehicleId: vId1,
        vehicle: vehicles[1].regNumber,
        driverId: dId1,
        driver: drivers[1].name,
        cargoWeight: 1200,
        distance: 150,
        plannedDate: '2026-07-12',
        revenue: 18000,
        status: 'Dispatched',
        eta: '2 hours',
        notes: 'Priority industrial shipment'
      }
    ];
    await Trip.create(tripData);
    console.log('Seeded initial Trips.');

    // Seed a maintenance record
    await Maintenance.create({
      vehicleId: vehicles[2]._id, // Winger In Shop
      vehicle: vehicles[2].regNumber,
      type: 'Brake Pad Replacement',
      description: 'Replacing front disc brake pads due to wear and squealing.',
      cost: 4500,
      date: '2026-07-11',
      vendor: 'Tata Commercial Workshop',
      status: 'In Progress',
      nextServiceKm: 95000
    });
    console.log('Seeded initial Maintenance logs.');

    console.log('Database Seeded Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
