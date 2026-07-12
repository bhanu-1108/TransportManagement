// ===================================================
// TransitOps — Complete Dummy Data
// All data is realistic and ready for backend swap
// ===================================================

// ===== VEHICLES =====
export const dummyVehicles = [
  { id: 'V001', regNumber: 'MH-12-AB-1234', name: 'Tata Ace Gold', type: 'Mini-Truck', status: 'Available', odometer: 48200, maxLoad: 750, acquisitionCost: 580000, region: 'West', year: 2021, fuelType: 'Diesel', lastService: '2026-05-15' },
  { id: 'V002', regNumber: 'DL-01-CD-5678', name: 'Ashok Leyland Dost', type: 'Van', status: 'On Trip', odometer: 91400, maxLoad: 1500, acquisitionCost: 920000, region: 'North', year: 2020, fuelType: 'Diesel', lastService: '2026-04-20' },
  { id: 'V003', regNumber: 'KA-05-EF-9012', name: 'Mahindra Furio 7', type: 'Truck', status: 'In Shop', odometer: 152300, maxLoad: 7000, acquisitionCost: 2100000, region: 'South', year: 2019, fuelType: 'Diesel', lastService: '2026-06-01' },
  { id: 'V004', regNumber: 'GJ-01-GH-3456', name: 'Eicher Pro 2095', type: 'Truck', status: 'Available', odometer: 78600, maxLoad: 9500, acquisitionCost: 2800000, region: 'West', year: 2022, fuelType: 'Diesel', lastService: '2026-06-20' },
  { id: 'V005', regNumber: 'RJ-14-IJ-7890', name: 'Tata Ultra 1014', type: 'Truck', status: 'On Trip', odometer: 205100, maxLoad: 10000, acquisitionCost: 3200000, region: 'North', year: 2018, fuelType: 'Diesel', lastService: '2026-03-10' },
  { id: 'V006', regNumber: 'TN-09-KL-2345', name: 'Force Traveller', type: 'Bus', status: 'Available', odometer: 64800, maxLoad: 3500, acquisitionCost: 1450000, region: 'South', year: 2021, fuelType: 'Diesel', lastService: '2026-05-28' },
  { id: 'V007', regNumber: 'MH-43-MN-6789', name: 'BharatBenz 1623', type: 'Tanker', status: 'Available', odometer: 113500, maxLoad: 16000, acquisitionCost: 4200000, region: 'West', year: 2020, fuelType: 'Diesel', lastService: '2026-06-10' },
  { id: 'V008', regNumber: 'UP-32-OP-0123', name: 'Swaraj Mazda T2', type: 'Van', status: 'Retired', odometer: 312400, maxLoad: 2000, acquisitionCost: 750000, region: 'Central', year: 2014, fuelType: 'Diesel', lastService: '2025-11-05' },
  { id: 'V009', regNumber: 'WB-23-QR-4567', name: 'Tata Signa 1923', type: 'Truck', status: 'Available', odometer: 42100, maxLoad: 19000, acquisitionCost: 3800000, region: 'East', year: 2023, fuelType: 'Diesel', lastService: '2026-07-01' },
  { id: 'V010', regNumber: 'AP-28-ST-8901', name: 'Ashok Leyland Partner', type: 'Pickup', status: 'On Trip', odometer: 88700, maxLoad: 1200, acquisitionCost: 890000, region: 'South', year: 2021, fuelType: 'CNG', lastService: '2026-05-05' },
  { id: 'V011', regNumber: 'HR-26-UV-2345', name: 'Mahindra Jeeto', type: 'Mini-Truck', status: 'Available', odometer: 38900, maxLoad: 650, acquisitionCost: 470000, region: 'North', year: 2022, fuelType: 'Petrol', lastService: '2026-06-15' },
  { id: 'V012', regNumber: 'PB-65-WX-6789', name: 'Tata LPT 1613', type: 'Truck', status: 'In Shop', odometer: 178200, maxLoad: 16000, acquisitionCost: 2900000, region: 'North', year: 2017, fuelType: 'Diesel', lastService: '2026-06-25' },
  { id: 'V013', regNumber: 'MP-09-YZ-0123', name: 'Piaggio Ape Xtra', type: 'Mini-Truck', status: 'Available', odometer: 22400, maxLoad: 500, acquisitionCost: 320000, region: 'Central', year: 2023, fuelType: 'CNG', lastService: '2026-07-05' },
  { id: 'V014', regNumber: 'OD-02-AB-4567', name: 'Volvo FM 11', type: 'Truck', status: 'Available', odometer: 95300, maxLoad: 25000, acquisitionCost: 7500000, region: 'East', year: 2021, fuelType: 'Diesel', lastService: '2026-04-15' },
  { id: 'V015', regNumber: 'CG-07-CD-8901', name: 'JCBL Electric Van', type: 'Van', status: 'Available', odometer: 18600, maxLoad: 2000, acquisitionCost: 1850000, region: 'Central', year: 2024, fuelType: 'Electric', lastService: '2026-07-08' },
];

// ===== DRIVERS =====
export const dummyDrivers = [
  { id: 'D001', name: 'Rajesh Sharma', licenseNo: 'MH-0120-2021-1234', licenseCategory: 'CE', licenseExpiry: '2027-08-15', contact: '+91-9876543210', status: 'Available', safetyScore: 94, trips: 287, region: 'West', joiningDate: '2019-03-15', email: 'rajesh.sharma@transitops.in' },
  { id: 'D002', name: 'Suresh Yadav', licenseNo: 'DL-0920-2020-5678', licenseCategory: 'C', licenseExpiry: '2026-09-20', contact: '+91-9876543211', status: 'On Trip', safetyScore: 88, trips: 342, region: 'North', joiningDate: '2018-07-22', email: 'suresh.yadav@transitops.in' },
  { id: 'D003', name: 'Priya Nair', licenseNo: 'KA-1121-2021-9012', licenseCategory: 'B', licenseExpiry: '2028-11-30', contact: '+91-9876543212', status: 'Available', safetyScore: 97, trips: 156, region: 'South', joiningDate: '2021-01-10', email: 'priya.nair@transitops.in' },
  { id: 'D004', name: 'Mohan Patel', licenseNo: 'GJ-0322-2022-3456', licenseCategory: 'CE', licenseExpiry: '2026-08-10', contact: '+91-9876543213', status: 'On Trip', safetyScore: 79, trips: 198, region: 'West', joiningDate: '2020-09-05', email: 'mohan.patel@transitops.in' },
  { id: 'D005', name: 'Vikram Singh', licenseNo: 'RJ-0719-2019-7890', licenseCategory: 'CE', licenseExpiry: '2025-07-15', contact: '+91-9876543214', status: 'Suspended', safetyScore: 58, trips: 412, region: 'North', joiningDate: '2017-05-18', email: 'vikram.singh@transitops.in' },
  { id: 'D006', name: 'Kavita Menon', licenseNo: 'TN-0423-2023-2345', licenseCategory: 'D', licenseExpiry: '2029-04-20', contact: '+91-9876543215', status: 'Available', safetyScore: 92, trips: 89, region: 'South', joiningDate: '2023-02-14', email: 'kavita.menon@transitops.in' },
  { id: 'D007', name: 'Amit Verma', licenseNo: 'UP-1118-2018-6789', licenseCategory: 'C', licenseExpiry: '2026-11-25', contact: '+91-9876543216', status: 'Off Duty', safetyScore: 83, trips: 276, region: 'Central', joiningDate: '2018-08-30', email: 'amit.verma@transitops.in' },
  { id: 'D008', name: 'Pooja Gupta', licenseNo: 'WB-0521-2021-0123', licenseCategory: 'B', licenseExpiry: '2027-05-18', contact: '+91-9876543217', status: 'Available', safetyScore: 96, trips: 134, region: 'East', joiningDate: '2021-04-20', email: 'pooja.gupta@transitops.in' },
  { id: 'D009', name: 'Ramu Krishnan', licenseNo: 'AP-0820-2020-4567', licenseCategory: 'CE', licenseExpiry: '2026-08-30', contact: '+91-9876543218', status: 'On Trip', safetyScore: 85, trips: 321, region: 'South', joiningDate: '2019-11-12', email: 'ramu.krishnan@transitops.in' },
  { id: 'D010', name: 'Harpreet Kaur', licenseNo: 'PB-0322-2022-8901', licenseCategory: 'B', licenseExpiry: '2028-03-15', contact: '+91-9876543219', status: 'Available', safetyScore: 91, trips: 167, region: 'North', joiningDate: '2022-01-08', email: 'harpreet.kaur@transitops.in' },
  { id: 'D011', name: 'Dinesh Rathore', licenseNo: 'MP-1117-2017-2345', licenseCategory: 'CE', licenseExpiry: '2026-07-20', contact: '+91-9876543220', status: 'Available', safetyScore: 76, trips: 498, region: 'Central', joiningDate: '2016-09-25', email: 'dinesh.rathore@transitops.in' },
  { id: 'D012', name: 'Swati Joshi', licenseNo: 'HR-0623-2023-6789', licenseCategory: 'C', licenseExpiry: '2029-06-10', contact: '+91-9876543221', status: 'Off Duty', safetyScore: 89, trips: 45, region: 'North', joiningDate: '2023-05-01', email: 'swati.joshi@transitops.in' },
];

// ===== TRIPS =====
export const dummyTrips = [
  { id: 'TR001', vehicleId: 'V002', vehicle: 'DL-01-CD-5678', driverId: 'D002', driver: 'Suresh Yadav', source: 'Delhi Hub', destination: 'Chandigarh Depot', status: 'Dispatched', cargoWeight: 1200, distance: 250, plannedDate: '2026-07-12', eta: '45 min', revenue: 28000, notes: 'Fragile electronics cargo' },
  { id: 'TR002', vehicleId: 'V005', vehicle: 'RJ-14-IJ-7890', driverId: 'D004', driver: 'Mohan Patel', source: 'Jaipur Depot', destination: 'Ahmedabad Hub', status: 'Dispatched', cargoWeight: 8500, distance: 680, plannedDate: '2026-07-12', eta: 'In 10m', revenue: 92000, notes: 'Auto parts shipment' },
  { id: 'TR003', vehicleId: 'V001', vehicle: 'MH-12-AB-1234', driverId: 'D001', driver: 'Rajesh Sharma', source: 'Mumbai HQ', destination: 'Pune Depot', status: 'Completed', cargoWeight: 600, distance: 148, plannedDate: '2026-07-11', eta: '—', revenue: 15500, notes: '' },
  { id: 'TR004', vehicleId: 'V004', vehicle: 'GJ-01-GH-3456', driverId: 'D011', driver: 'Dinesh Rathore', source: 'Surat Hub', destination: 'Baroda Depot', status: 'Completed', cargoWeight: 7200, distance: 135, plannedDate: '2026-07-11', eta: '—', revenue: 38000, notes: 'Textiles' },
  { id: 'TR005', vehicleId: 'V009', vehicle: 'WB-23-QR-4567', driverId: 'D008', driver: 'Pooja Gupta', source: 'Kolkata Port', destination: 'Bhubaneswar Depot', status: 'Draft', cargoWeight: 14000, distance: 470, plannedDate: '2026-07-13', eta: 'Awaiting vehicle', revenue: 75000, notes: 'Industrial equipment' },
  { id: 'TR006', vehicleId: 'V007', vehicle: 'MH-43-MN-6789', driverId: 'D001', driver: 'Rajesh Sharma', source: 'Mumbai HQ', destination: 'Nashik Hub', status: 'Completed', cargoWeight: 12000, distance: 180, plannedDate: '2026-07-10', eta: '—', revenue: 45000, notes: 'Chemical tanker' },
  { id: 'TR007', vehicleId: 'V010', vehicle: 'AP-28-ST-8901', driverId: 'D009', driver: 'Ramu Krishnan', source: 'Hyderabad Hub', destination: 'Chennai Depot', status: 'Dispatched', cargoWeight: 900, distance: 625, plannedDate: '2026-07-12', eta: '2h 30m', revenue: 52000, notes: 'Perishable goods' },
  { id: 'TR008', vehicleId: 'V014', vehicle: 'OD-02-AB-4567', driverId: 'D007', driver: 'Amit Verma', source: 'Bhubaneswar', destination: 'Kolkata Port', status: 'Cancelled', cargoWeight: 22000, distance: 440, plannedDate: '2026-07-09', eta: '—', revenue: 0, notes: 'Cancelled due to weather' },
  { id: 'TR009', vehicleId: 'V006', vehicle: 'TN-09-KL-2345', driverId: 'D003', driver: 'Priya Nair', source: 'Chennai Hub', destination: 'Bangalore Depot', status: 'Completed', cargoWeight: 2800, distance: 346, plannedDate: '2026-07-10', eta: '—', revenue: 42000, notes: 'Passenger goods' },
  { id: 'TR010', vehicleId: 'V011', vehicle: 'HR-26-UV-2345', driverId: 'D010', driver: 'Harpreet Kaur', source: 'Gurgaon Hub', destination: 'Delhi NCR', status: 'Completed', cargoWeight: 500, distance: 35, plannedDate: '2026-07-11', eta: '—', revenue: 8500, notes: 'Last mile delivery' },
  { id: 'TR011', vehicleId: 'V013', vehicle: 'MP-09-YZ-0123', driverId: 'D006', driver: 'Kavita Menon', source: 'Indore Depot', destination: 'Bhopal Hub', status: 'Completed', cargoWeight: 400, distance: 192, plannedDate: '2026-07-09', eta: '—', revenue: 18000, notes: 'FMCG goods' },
  { id: 'TR012', vehicleId: 'V015', vehicle: 'CG-07-CD-8901', driverId: 'D006', driver: 'Kavita Menon', source: 'Raipur Hub', destination: 'Nagpur Depot', status: 'Draft', cargoWeight: 1500, distance: 285, plannedDate: '2026-07-14', eta: 'Pending', revenue: 32000, notes: 'EV delivery trial run' },
];

// ===== MAINTENANCE =====
export const dummyMaintenance = [
  { id: 'MNT001', vehicleId: 'V003', vehicle: 'KA-05-EF-9012', type: 'Engine Overhaul', description: 'Complete engine overhaul due to excessive oil consumption', cost: 85000, date: '2026-06-28', vendor: 'KAR Auto Services', status: 'In Progress', nextServiceKm: 180000 },
  { id: 'MNT002', vehicleId: 'V012', vehicle: 'PB-65-WX-6789', type: 'Brake Service', description: 'Front and rear brake pad replacement + disc resurfacing', cost: 22000, date: '2026-06-25', vendor: 'Punjab Motors', status: 'In Progress', nextServiceKm: 200000 },
  { id: 'MNT003', vehicleId: 'V001', vehicle: 'MH-12-AB-1234', type: 'Oil Change', description: 'Synthetic oil change + filter replacement', cost: 4500, date: '2026-05-15', vendor: 'Tata Authorized', status: 'Completed', nextServiceKm: 58200 },
  { id: 'MNT004', vehicleId: 'V005', vehicle: 'RJ-14-IJ-7890', type: 'Tire Replacement', description: '4 rear tires replaced due to wear', cost: 38000, date: '2026-03-10', vendor: 'MRF Tyre Hub', status: 'Completed', nextServiceKm: 255000 },
  { id: 'MNT005', vehicleId: 'V007', vehicle: 'MH-43-MN-6789', type: 'Routine Service', description: '50K km routine service and checkup', cost: 12000, date: '2026-06-10', vendor: 'BharatBenz ASS', status: 'Completed', nextServiceKm: 133500 },
  { id: 'MNT006', vehicleId: 'V014', vehicle: 'OD-02-AB-4567', type: 'Electrical', description: 'Alternator replacement and electrical system check', cost: 28000, date: '2026-04-15', vendor: 'Volvo Trucks India', status: 'Completed', nextServiceKm: 110000 },
  { id: 'MNT007', vehicleId: 'V004', vehicle: 'GJ-01-GH-3456', type: 'AC Repair', description: 'Cabin AC compressor replacement', cost: 18500, date: '2026-06-20', vendor: 'Eicher Dealer GJ', status: 'Completed', nextServiceKm: 88600 },
  { id: 'MNT008', vehicleId: 'V009', vehicle: 'WB-23-QR-4567', type: 'Oil Change', description: 'First scheduled oil change', cost: 5200, date: '2026-07-01', vendor: 'Tata Authorized', status: 'Completed', nextServiceKm: 52000 },
];

// ===== FUEL LOGS =====
export const dummyFuelLogs = [
  { id: 'FL001', vehicleId: 'V001', vehicle: 'MH-12-AB-1234', date: '2026-07-10', liters: 45, costPerLiter: 92.5, totalCost: 4163, odometer: 48200, station: 'HPCL Mumbai', tripId: 'TR003' },
  { id: 'FL002', vehicleId: 'V002', vehicle: 'DL-01-CD-5678', date: '2026-07-11', liters: 120, costPerLiter: 91.8, totalCost: 11016, odometer: 91400, station: 'BPCL Delhi', tripId: 'TR001' },
  { id: 'FL003', vehicleId: 'V004', vehicle: 'GJ-01-GH-3456', date: '2026-07-11', liters: 200, costPerLiter: 90.2, totalCost: 18040, odometer: 78600, station: 'IOC Surat', tripId: 'TR004' },
  { id: 'FL004', vehicleId: 'V005', vehicle: 'RJ-14-IJ-7890', date: '2026-07-12', liters: 280, costPerLiter: 91.5, totalCost: 25620, odometer: 205100, station: 'HPCL Jaipur', tripId: 'TR002' },
  { id: 'FL005', vehicleId: 'V006', vehicle: 'TN-09-KL-2345', date: '2026-07-10', liters: 160, costPerLiter: 89.6, totalCost: 14336, odometer: 64800, station: 'IOC Chennai', tripId: 'TR009' },
  { id: 'FL006', vehicleId: 'V007', vehicle: 'MH-43-MN-6789', date: '2026-07-10', liters: 350, costPerLiter: 91.0, totalCost: 31850, odometer: 113500, station: 'BPCL Mumbai', tripId: 'TR006' },
  { id: 'FL007', vehicleId: 'V009', vehicle: 'WB-23-QR-4567', date: '2026-07-08', liters: 85, costPerLiter: 92.1, totalCost: 7829, odometer: 42100, station: 'IOC Kolkata', tripId: null },
  { id: 'FL008', vehicleId: 'V010', vehicle: 'AP-28-ST-8901', date: '2026-07-12', liters: 65, costPerLiter: 79.5, totalCost: 5168, odometer: 88700, station: 'CNG Station HYD', tripId: 'TR007' },
  { id: 'FL009', vehicleId: 'V011', vehicle: 'HR-26-UV-2345', date: '2026-07-11', liters: 25, costPerLiter: 96.4, totalCost: 2410, odometer: 38900, station: 'HPCL Gurgaon', tripId: 'TR010' },
  { id: 'FL010', vehicleId: 'V014', vehicle: 'OD-02-AB-4567', date: '2026-07-09', liters: 420, costPerLiter: 90.8, totalCost: 38136, odometer: 95300, station: 'IOC Bhubaneswar', tripId: 'TR008' },
];

// ===== EXPENSES =====
export const dummyExpenses = [
  { id: 'EXP001', vehicleId: 'V001', vehicle: 'MH-12-AB-1234', category: 'Toll', description: 'Mumbai-Pune Expressway toll', amount: 320, date: '2026-07-11', tripId: 'TR003', approvedBy: 'Ravi Kumar' },
  { id: 'EXP002', vehicleId: 'V002', vehicle: 'DL-01-CD-5678', category: 'Toll', description: 'Delhi-Chandigarh highway toll', amount: 580, date: '2026-07-12', tripId: 'TR001', approvedBy: 'Ravi Kumar' },
  { id: 'EXP003', vehicleId: 'V003', vehicle: 'KA-05-EF-9012', category: 'Maintenance', description: 'Engine overhaul labor charges', amount: 25000, date: '2026-06-28', tripId: null, approvedBy: 'Ravi Kumar' },
  { id: 'EXP004', vehicleId: 'V005', vehicle: 'RJ-14-IJ-7890', category: 'Toll', description: 'Jaipur-Ahmedabad highway toll', amount: 1240, date: '2026-07-12', tripId: 'TR002', approvedBy: 'Ravi Kumar' },
  { id: 'EXP005', vehicleId: 'V007', vehicle: 'MH-43-MN-6789', category: 'Miscellaneous', description: 'Driver overnight stay allowance', amount: 850, date: '2026-07-10', tripId: 'TR006', approvedBy: 'Ravi Kumar' },
  { id: 'EXP006', vehicleId: 'V009', vehicle: 'WB-23-QR-4567', category: 'Insurance', description: 'Monthly insurance premium', amount: 18500, date: '2026-07-01', tripId: null, approvedBy: 'Ravi Kumar' },
  { id: 'EXP007', vehicleId: 'V012', vehicle: 'PB-65-WX-6789', category: 'Repairs', description: 'Brake system repair', amount: 22000, date: '2026-06-25', tripId: null, approvedBy: 'Ravi Kumar' },
  { id: 'EXP008', vehicleId: 'V010', vehicle: 'AP-28-ST-8901', category: 'Toll', description: 'HYD-Chennai expressway', amount: 980, date: '2026-07-12', tripId: 'TR007', approvedBy: 'Ravi Kumar' },
  { id: 'EXP009', vehicleId: 'V006', vehicle: 'TN-09-KL-2345', category: 'Miscellaneous', description: 'Loading/unloading labor', amount: 2400, date: '2026-07-10', tripId: 'TR009', approvedBy: 'Ravi Kumar' },
  { id: 'EXP010', vehicleId: 'V014', vehicle: 'OD-02-AB-4567', category: 'Toll', description: 'Bhubaneswar-Kolkata NH16', amount: 1620, date: '2026-07-09', tripId: 'TR008', approvedBy: 'Ravi Kumar' },
];

// ===== NOTIFICATIONS =====
export const dummyNotifications = [
  { id: 'N001', type: 'warning', title: 'License Expiring Soon', message: "Vikram Singh's license expires in 7 days. Renew immediately.", time: '2026-07-12T08:30:00', read: false, link: '/drivers' },
  { id: 'N002', type: 'warning', title: 'License Expiring Soon', message: "Suresh Yadav's license expires in 70 days.", time: '2026-07-12T08:00:00', read: false, link: '/drivers' },
  { id: 'N003', type: 'info', title: 'Trip Dispatched', message: 'Trip TR001 (Delhi → Chandigarh) has been dispatched.', time: '2026-07-12T07:45:00', read: false, link: '/trips' },
  { id: 'N004', type: 'success', title: 'Trip Completed', message: 'Trip TR003 (Mumbai → Pune) completed successfully.', time: '2026-07-11T18:20:00', read: true, link: '/trips' },
  { id: 'N005', type: 'danger', title: 'Vehicle In Maintenance', message: 'KA-05-EF-9012 entered maintenance. Removed from fleet pool.', time: '2026-07-11T10:00:00', read: true, link: '/maintenance' },
  { id: 'N006', type: 'info', title: 'New Maintenance Record', message: 'Brake service initiated for PB-65-WX-6789.', time: '2026-07-10T14:30:00', read: true, link: '/maintenance' },
  { id: 'N007', type: 'warning', title: 'Low Safety Score', message: "Vikram Singh's safety score is 58. Review required.", time: '2026-07-10T09:00:00', read: true, link: '/drivers' },
  { id: 'N008', type: 'danger', title: 'Trip Cancelled', message: 'TR008 cancelled due to weather conditions.', time: '2026-07-09T16:00:00', read: true, link: '/trips' },
  { id: 'N009', type: 'success', title: 'Monthly Report Ready', message: 'Fleet efficiency report for June 2026 is ready.', time: '2026-07-01T09:00:00', read: true, link: '/reports' },
  { id: 'N010', type: 'info', title: 'New Vehicle Added', message: 'JCBL Electric Van (CG-07-CD-8901) added to fleet.', time: '2026-06-30T11:00:00', read: true, link: '/vehicles' },
];

// ===== CHART DATA — Monthly =====
export const monthlyRevenueData = [
  { month: 'Jan', revenue: 485000, expenses: 310000, trips: 42 },
  { month: 'Feb', revenue: 520000, expenses: 295000, trips: 48 },
  { month: 'Mar', revenue: 610000, expenses: 340000, trips: 55 },
  { month: 'Apr', revenue: 578000, expenses: 325000, trips: 51 },
  { month: 'May', revenue: 692000, expenses: 380000, trips: 63 },
  { month: 'Jun', revenue: 645000, expenses: 355000, trips: 58 },
  { month: 'Jul', revenue: 410000, expenses: 230000, trips: 37 },
];

export const fleetUtilizationData = [
  { month: 'Jan', utilization: 72 },
  { month: 'Feb', utilization: 78 },
  { month: 'Mar', utilization: 84 },
  { month: 'Apr', utilization: 80 },
  { month: 'May', utilization: 88 },
  { month: 'Jun', utilization: 85 },
  { month: 'Jul', utilization: 81 },
];

export const fuelCostData = [
  { month: 'Jan', fuel: 128000, maintenance: 65000 },
  { month: 'Feb', fuel: 135000, maintenance: 42000 },
  { month: 'Mar', fuel: 158000, maintenance: 88000 },
  { month: 'Apr', fuel: 142000, maintenance: 55000 },
  { month: 'May', fuel: 175000, maintenance: 71000 },
  { month: 'Jun', fuel: 162000, maintenance: 93000 },
  { month: 'Jul', fuel: 96000, maintenance: 38000 },
];

export const vehicleStatusData = [
  { name: 'Available', value: 9, color: '#22C55E' },
  { name: 'On Trip', value: 3, color: '#3B82F6' },
  { name: 'In Shop', value: 2, color: '#F59E0B' },
  { name: 'Retired', value: 1, color: '#EF4444' },
];

export const tripsByRegionData = [
  { region: 'North', trips: 98, revenue: 1240000 },
  { region: 'South', trips: 85, revenue: 1080000 },
  { region: 'West', trips: 112, revenue: 1560000 },
  { region: 'East', trips: 64, revenue: 780000 },
  { region: 'Central', trips: 45, revenue: 520000 },
];

export const driverSafetyData = [
  { score: '90-100', count: 4, label: 'Excellent' },
  { score: '80-89', count: 5, label: 'Good' },
  { score: '70-79', count: 2, label: 'Fair' },
  { score: 'Below 70', count: 1, label: 'Poor' },
];

// ===== ACTIVITY TIMELINE =====
export const dummyActivity = [
  { id: 1, type: 'trip', message: 'Trip TR001 dispatched to Chandigarh', time: '2026-07-12T08:30:00', user: 'Ravi Kumar', icon: 'truck' },
  { id: 2, type: 'maintenance', message: 'V003 sent to maintenance (Engine Overhaul)', time: '2026-07-11T14:20:00', user: 'System', icon: 'wrench' },
  { id: 3, type: 'trip', message: 'Trip TR003 completed successfully', time: '2026-07-11T13:45:00', user: 'Rajesh Sharma', icon: 'check' },
  { id: 4, type: 'fuel', message: 'Fuel log added for V007 - 350L', time: '2026-07-10T10:30:00', user: 'Ravi Kumar', icon: 'fuel' },
  { id: 5, type: 'driver', message: 'Vikram Singh suspended for safety violation', time: '2026-07-10T09:00:00', user: 'Arjun Mehta', icon: 'alert' },
  { id: 6, type: 'vehicle', message: 'New vehicle JCBL Electric Van added', time: '2026-06-30T11:00:00', user: 'Ravi Kumar', icon: 'plus' },
];

// ===== KPI SUMMARY =====
export const dashboardKPIs = {
  activeVehicles: 12,
  availableVehicles: 9,
  vehiclesInMaintenance: 2,
  activeTrips: 3,
  pendingTrips: 2,
  driversOnDuty: 3,
  fleetUtilization: 81,
  monthlyRevenue: 410000,
  monthlyFuelCost: 96000,
  monthlyExpenses: 230000,
};
