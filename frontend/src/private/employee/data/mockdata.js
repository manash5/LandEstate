// Mock data for Land Estate Employee Dashboard

export const properties = [
  {
    id: 1,
    name: "Sunset Apartments",
    location: "Downtown District, New York",
    price: 2500.00,
    priceDuration: "per month",
    type: "Apartment",
    beds: 2,
    baths: 2,
    areaSqm: 85.50,
    mainImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"
    ],
    hasKitchen: true,
    hasBalcony: true,
    hasParking: true,
    description: "Modern apartment with stunning city views. Features include hardwood floors, stainless steel appliances, and a private balcony.",
    totalRooms: 12,
    occupiedRooms: 10,
    userId: 1,
    employeeId: 1,
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    status: "active",
    amenities: ["Gym", "Pool", "Parking", "Security"]
  },
  {
    id: 2,
    name: "Oak Tree Hotel",
    location: "Business District, Chicago",
    price: 150.00,
    priceDuration: "per night",
    type: "Hotel",
    beds: 1,
    baths: 1,
    areaSqm: 35.00,
    mainImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500"
    ],
    hasKitchen: false,
    hasBalcony: false,
    hasParking: true,
    description: "Luxury hotel rooms with premium amenities and 24/7 concierge service.",
    totalRooms: 50,
    occupiedRooms: 42,
    userId: 2,
    employeeId: 1,
    createdAt: "2024-02-01T10:15:00Z",
    updatedAt: "2024-02-10T16:20:00Z",
    status: "active",
    amenities: ["Concierge", "Room Service", "Spa", "Restaurant", "Wifi"]
  },
  {
    id: 3,
    name: "Garden Villa",
    location: "Suburban Heights, Los Angeles",
    price: 4500.00,
    priceDuration: "per month",
    type: "House",
    beds: 4,
    baths: 3,
    areaSqm: 200.75,
    mainImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500"
    ],
    hasKitchen: true,
    hasBalcony: false,
    hasParking: true,
    description: "Spacious family home with beautiful garden, modern kitchen, and quiet neighborhood setting.",
    totalRooms: 1,
    occupiedRooms: 1,
    userId: 3,
    employeeId: 2,
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-01-25T09:30:00Z",
    status: "active",
    amenities: ["Garden", "Garage", "Fireplace", "Patio"]
  },
  {
    id: 4,
    name: "Metro Office Complex",
    location: "Financial District, San Francisco",
    price: 8000.00,
    priceDuration: "per month",
    type: "Commercial",
    beds: 0,
    baths: 4,
    areaSqm: 450.00,
    mainImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500"
    ],
    hasKitchen: true,
    hasBalcony: false,
    hasParking: true,
    description: "Modern office space perfect for startups and small businesses. Features open floor plan and conference rooms.",
    totalRooms: 8,
    occupiedRooms: 6,
    userId: 4,
    employeeId: 1,
    createdAt: "2024-02-05T14:20:00Z",
    updatedAt: "2024-02-15T11:10:00Z",
    status: "active",
    amenities: ["Conference Rooms", "High-speed Internet", "Reception Area", "Parking"]
  },
  {
    id: 5,
    name: "Riverside Lofts",
    location: "Arts District, Portland",
    price: 1800.00,
    priceDuration: "per month",
    type: "Apartment",
    beds: 1,
    baths: 1,
    areaSqm: 65.25,
    mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500"
    ],
    hasKitchen: true,
    hasBalcony: true,
    hasParking: false,
    description: "Industrial-style loft with exposed brick walls, high ceilings, and river views.",
    totalRooms: 24,
    occupiedRooms: 18,
    userId: 5,
    employeeId: 2,
    createdAt: "2024-01-30T16:45:00Z",
    updatedAt: "2024-02-08T13:25:00Z",
    status: "active",
    amenities: ["River View", "Exposed Brick", "High Ceilings", "Artist Studios"]
  }
];

export const issues = [
  {
    id: 1,
    propertyId: 1,
    propertyName: "Sunset Apartments",
    title: "Heating System Malfunction",
    description: "The heating system in apartment 3B is not working properly. Tenant reports cold temperatures.",
    status: "open",
    priority: "high",
    category: "maintenance",
    reportedBy: "John Doe",
    reportedDate: "2024-02-20T09:15:00Z",
    assignedTo: "Mike Johnson",
    estimatedCost: 450.00,
    roomNumber: "3B",
    contactInfo: "john.doe@email.com"
  },
  {
    id: 2,
    propertyId: 2,
    propertyName: "Oak Tree Hotel",
    title: "Elevator Out of Service",
    description: "Main elevator is stuck between floors 3 and 4. Maintenance team notified.",
    status: "in-progress",
    priority: "high",
    category: "maintenance",
    reportedBy: "Front Desk",
    reportedDate: "2024-02-21T14:30:00Z",
    assignedTo: "Emergency Maintenance",
    estimatedCost: 1200.00,
    roomNumber: "Main Elevator",
    contactInfo: "frontdesk@oaktreehotel.com"
  },
  {
    id: 3,
    propertyId: 3,
    propertyName: "Garden Villa",
    title: "Kitchen Faucet Leak",
    description: "Kitchen faucet has a persistent leak that needs repair.",
    status: "open",
    priority: "medium",
    category: "plumbing",
    reportedBy: "Sarah Wilson",
    reportedDate: "2024-02-19T11:20:00Z",
    assignedTo: "Plumbing Team",
    estimatedCost: 125.00,
    roomNumber: "Kitchen",
    contactInfo: "sarah.wilson@email.com"
  },
  {
    id: 4,
    propertyId: 4,
    propertyName: "Metro Office Complex",
    title: "Air Conditioning Unit Noise",
    description: "AC unit in conference room making unusual noises during operation.",
    status: "resolved",
    priority: "low",
    category: "hvac",
    reportedBy: "Office Manager",
    reportedDate: "2024-02-15T13:45:00Z",
    assignedTo: "HVAC Specialist",
    estimatedCost: 200.00,
    actualCost: 180.00,
    roomNumber: "Conference Room A",
    contactInfo: "manager@metrooffice.com",
    resolvedDate: "2024-02-18T10:30:00Z"
  },
  {
    id: 5,
    propertyId: 5,
    propertyName: "Riverside Lofts",
    title: "Window Lock Broken",
    description: "Window lock in unit 2C is broken and needs replacement for security.",
    status: "open",
    priority: "medium",
    category: "security",
    reportedBy: "Alex Chen",
    reportedDate: "2024-02-21T16:00:00Z",
    assignedTo: "Security Team",
    estimatedCost: 75.00,
    roomNumber: "2C",
    contactInfo: "alex.chen@email.com"
  },
  {
    id: 6,
    propertyId: 1,
    propertyName: "Sunset Apartments",
    title: "Parking Lot Lighting",
    description: "Several parking lot lights are out, creating safety concerns for residents.",
    status: "in-progress",
    priority: "high",
    category: "electrical",
    reportedBy: "Security Guard",
    reportedDate: "2024-02-20T20:30:00Z",
    assignedTo: "Electrical Team",
    estimatedCost: 320.00,
    roomNumber: "Parking Lot",
    contactInfo: "security@sunsetapts.com"
  }
];

export const employees = [
  {
    id: 1,
    name: "Emma Rodriguez",
    email: "emma.rodriguez@landestate.com",
    phone: "+1-555-0101",
    isActive: true,
    hireDate: "2023-03-15T00:00:00Z",
    managerId: null,
    role: "Property Manager",
    department: "Operations",
    propertiesManaged: [1, 2, 4],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b6c5?w=150"
  },
  {
    id: 2,
    name: "James Thompson",
    email: "james.thompson@landestate.com",
    phone: "+1-555-0102",
    isActive: true,
    hireDate: "2023-06-20T00:00:00Z",
    managerId: 1,
    role: "Assistant Manager",
    department: "Operations",
    propertiesManaged: [3, 5],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  {
    id: 3,
    name: "Lisa Wang",
    email: "lisa.wang@landestate.com",
    phone: "+1-555-0103",
    isActive: true,
    hireDate: "2023-09-10T00:00:00Z",
    managerId: 1,
    role: "Maintenance Coordinator",
    department: "Maintenance",
    propertiesManaged: [],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
  }
];

export const tenants = [
  {
    id: 1,
    name: "Michael Johnson",
    email: "michael.johnson@email.com",
    phone: "+1-555-0201",
    propertyId: 1,
    propertyName: "Sunset Apartments",
    roomNumber: "3A",
    leaseStart: "2024-01-01T00:00:00Z",
    leaseEnd: "2024-12-31T23:59:59Z",
    rentAmount: 2500.00,
    depositAmount: 5000.00,
    paymentStatus: "paid",
    rentDueDate: "2024-03-01",
    issue: null,
    lastUpdated: "2024-02-15",
    emergencyContact: {
      name: "Sarah Johnson",
      phone: "+1-555-0202",
      relationship: "Spouse"
    }
  },
  {
    id: 2,
    name: "David Park",
    email: "david.park@email.com",
    phone: "+1-555-0203",
    propertyId: 3,
    propertyName: "Garden Villa",
    roomNumber: "Main House",
    leaseStart: "2023-12-01T00:00:00Z",
    leaseEnd: "2024-11-30T23:59:59Z",
    rentAmount: 4500.00,
    depositAmount: 9000.00,
    paymentStatus: "paid",
    rentDueDate: "2024-03-01",
    issue: null,
    lastUpdated: "2024-02-10",
    emergencyContact: {
      name: "Emily Park",
      phone: "+1-555-0204",
      relationship: "Wife"
    }
  },
  {
    id: 3,
    name: "Jennifer Lopez",
    email: "jennifer.lopez@email.com",
    phone: "+1-555-0205",
    propertyId: 5,
    propertyName: "Riverside Lofts",
    roomNumber: "2C",
    leaseStart: "2024-02-01T00:00:00Z",
    leaseEnd: "2025-01-31T23:59:59Z",
    rentAmount: 1800.00,
    depositAmount: 3600.00,
    paymentStatus: "unpaid",
    rentDueDate: "2024-02-01",
    issue: "Late payment - 20 days overdue",
    lastUpdated: "2024-02-20",
    emergencyContact: {
      name: "Carlos Lopez",
      phone: "+1-555-0206",
      relationship: "Father"
    }
  },
  {
    id: 4,
    name: "Robert Chen",
    email: "robert.chen@email.com",
    phone: "+1-555-0207",
    propertyId: 1,
    propertyName: "Sunset Apartments",
    roomNumber: "2B",
    leaseStart: "2023-11-15T00:00:00Z",
    leaseEnd: "2024-11-14T23:59:59Z",
    rentAmount: 2500.00,
    depositAmount: 5000.00,
    paymentStatus: "paid",
    rentDueDate: "2024-03-01",
    issue: null,
    lastUpdated: "2024-02-18",
    emergencyContact: {
      name: "Lisa Chen",
      phone: "+1-555-0208",
      relationship: "Sister"
    }
  },
  {
    id: 5,
    name: "Amanda Wilson",
    email: "amanda.wilson@email.com",
    phone: "+1-555-0209",
    propertyId: 2,
    propertyName: "Oak Tree Hotel",
    roomNumber: "205",
    leaseStart: "2024-01-10T00:00:00Z",
    leaseEnd: "2024-07-09T23:59:59Z",
    rentAmount: 150.00,
    depositAmount: 300.00,
    paymentStatus: "paid",
    rentDueDate: "2024-02-25",
    issue: null,
    lastUpdated: "2024-02-22",
    emergencyContact: {
      name: "Tom Wilson",
      phone: "+1-555-0210",
      relationship: "Father"
    }
  },
  {
    id: 6,
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@email.com",
    phone: "+1-555-0211",
    propertyId: 5,
    propertyName: "Riverside Lofts",
    roomNumber: "1A",
    leaseStart: "2023-09-01T00:00:00Z",
    leaseEnd: "2024-08-31T23:59:59Z",
    rentAmount: 1800.00,
    depositAmount: 3600.00,
    paymentStatus: "unpaid",
    rentDueDate: "2024-02-01",
    issue: "Maintenance request - heating system",
    lastUpdated: "2024-02-19",
    emergencyContact: {
      name: "Maria Rodriguez",
      phone: "+1-555-0212",
      relationship: "Wife"
    }
  },
  {
    id: 7,
    name: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    phone: "+1-555-0213",
    propertyId: 4,
    propertyName: "Metro Office Complex",
    roomNumber: "Suite 401",
    leaseStart: "2024-01-01T00:00:00Z",
    leaseEnd: "2026-12-31T23:59:59Z",
    rentAmount: 8000.00,
    depositAmount: 16000.00,
    paymentStatus: "paid",
    rentDueDate: "2024-03-01",
    issue: null,
    lastUpdated: "2024-02-20",
    emergencyContact: {
      name: "John Smith",
      phone: "+1-555-0214",
      relationship: "Manager"
    }
  }
];

export const maintenanceRecords = [
  {
    id: 1,
    propertyId: 1,
    propertyName: "Sunset Apartments",
    issueId: 4,
    type: "Preventive",
    description: "Monthly HVAC system inspection and filter replacement",
    cost: 150.00,
    performedBy: "HVAC Specialist",
    performedDate: "2024-02-01T10:00:00Z",
    nextScheduled: "2024-03-01T10:00:00Z",
    status: "completed",
    warranty: "3 months"
  },
  {
    id: 2,
    propertyId: 2,
    propertyName: "Oak Tree Hotel",
    issueId: null,
    type: "Emergency",
    description: "Emergency plumbing repair in room 205",
    cost: 320.00,
    performedBy: "Emergency Plumber",
    performedDate: "2024-02-18T22:30:00Z",
    nextScheduled: null,
    status: "completed",
    warranty: "6 months"
  },
  {
    id: 3,
    propertyId: 3,
    propertyName: "Garden Villa",
    issueId: null,
    type: "Routine",
    description: "Landscaping and garden maintenance",
    cost: 200.00,
    performedBy: "Landscaping Team",
    performedDate: "2024-02-15T08:00:00Z",
    nextScheduled: "2024-03-15T08:00:00Z",
    status: "completed",
    warranty: null
  }
];

export const dashboardStats = {
  totalProperties: properties.length,
  totalRooms: properties.reduce((sum, prop) => sum + prop.totalRooms, 0),
  occupiedRooms: properties.reduce((sum, prop) => sum + prop.occupiedRooms, 0),
  occupancyRate: Math.round((properties.reduce((sum, prop) => sum + prop.occupiedRooms, 0) / properties.reduce((sum, prop) => sum + prop.totalRooms, 0)) * 100),
  openIssues: issues.filter(issue => issue.status === 'open').length,
  highPriorityIssues: issues.filter(issue => issue.priority === 'high' && issue.status !== 'resolved').length,
  monthlyRevenue: properties.reduce((sum, prop) => {
    if (prop.priceDuration === 'per month') {
      return sum + (prop.price * prop.occupiedRooms);
    }
    return sum;
  }, 0),
  maintenanceCosts: maintenanceRecords.reduce((sum, record) => sum + record.cost, 0)
};

export const recentActivity = [
  {
    id: 1,
    type: "issue_reported",
    message: "New issue reported: Heating System Malfunction at Sunset Apartments",
    timestamp: "2024-02-20T09:15:00Z",
    priority: "high"
  },
  {
    id: 2,
    type: "payment_received",
    message: "Rent payment received from Michael Johnson - Sunset Apartments 3A",
    timestamp: "2024-02-20T14:30:00Z",
    priority: "normal"
  },
  {
    id: 3,
    type: "maintenance_completed",
    message: "HVAC maintenance completed at Sunset Apartments",
    timestamp: "2024-02-18T16:45:00Z",
    priority: "normal"
  },
  {
    id: 4,
    type: "new_tenant",
    message: "New lease signed: Jennifer Lopez - Riverside Lofts 2C",
    timestamp: "2024-02-15T11:20:00Z",
    priority: "normal"
  }
];

// Property types for forms and filters
export const propertyTypes = ["Apartment", "Hotel", "House", "Commercial"];

// Issue priorities and statuses
export const issuePriorities = ["low", "medium", "high", "critical"];
export const issueStatuses = ["open", "in-progress", "resolved", "closed"];
export const issueCategories = ["maintenance", "plumbing", "electrical", "hvac", "security", "cleaning", "other"];

// Payment statuses
export const paymentStatuses = ["current", "late", "overdue", "paid"];
