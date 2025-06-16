export const properties = [
  {
    id: 1,
    name: "Green Villas #12",
    location: "Kathmandu, Nepal",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400",
    totalRooms: 8,
    occupiedRooms: 6,
    lastServiceDate: "2024-01-15",
    rooms: [
      {
        id: 101,
        number: "101",
        tenant: "Ram Prasad",
        rent: 15000,
        status: "paid",
        issue: null,
        lastUpdated: "2024-01-16",
        tenantContact: "+977-9841234567",
        rentDueDate: "2024-02-01"
      },
      {
        id: 102,
        number: "102",
        tenant: "Sita Sharma",
        rent: 18000,
        status: "unpaid",
        issue: "Water Leakage",
        lastUpdated: "2024-01-14",
        tenantContact: "+977-9841234568",
        rentDueDate: "2024-01-01"
      },
      {
        id: 103,
        number: "103",
        tenant: "Hari Bahadur",
        rent: 16000,
        status: "paid",
        issue: null,
        lastUpdated: "2024-01-16",
        tenantContact: "+977-9841234569",
        rentDueDate: "2024-02-01"
      }
    ]
  },
  {
    id: 2,
    name: "Sunrise Apartments #5",
    location: "Lalitpur, Nepal",
    image: "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=400",
    totalRooms: 12,
    occupiedRooms: 10,
    lastServiceDate: "2024-01-10",
    rooms: [
      {
        id: 201,
        number: "201A",
        tenant: "Maya Gurung",
        rent: 20000,
        status: "paid",
        issue: null,
        lastUpdated: "2024-01-15",
        tenantContact: "+977-9841234570",
        rentDueDate: "2024-02-01"
      },
      {
        id: 202,
        number: "201B",
        tenant: "Bikash Thapa",
        rent: 22000,
        status: "unpaid",
        issue: "Electricity Problem",
        lastUpdated: "2024-01-12",
        tenantContact: "+977-9841234571",
        rentDueDate: "2024-01-01"
      }
    ]
  },
  {
    id: 3,
    name: "Blue Heights Complex",
    location: "Bhaktapur, Nepal",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400",
    totalRooms: 15,
    occupiedRooms: 12,
    lastServiceDate: "2024-01-12",
    rooms: [
      {
        id: 301,
        number: "3A",
        tenant: "Anita Rai",
        rent: 25000,
        status: "paid",
        issue: null,
        lastUpdated: "2024-01-16",
        tenantContact: "+977-9841234572",
        rentDueDate: "2024-02-01"
      }
    ]
  }
];

export const serviceRecords = [
  {
    id: 1,
    serviceName: "Plumbing Repair",
    property: "Green Villas #12",
    date: "2024-01-15",
    location: "Room 102",
    description: "Fixed water leakage in bathroom",
    status: "completed",
    cost: 5000,
    technician: "Ram Maintenance"
  },
  {
    id: 2,
    serviceName: "Electrical Maintenance",
    property: "Sunrise Apartments #5",
    date: "2024-01-10",
    location: "Room 201B",
    description: "Replaced faulty wiring",
    status: "completed",
    cost: 8000,
    technician: "Electric Solutions"
  },
  {
    id: 3,
    serviceName: "Air Conditioning Service",
    property: "Blue Heights Complex",
    date: "2024-01-12",
    location: "Common Area",
    description: "Regular AC maintenance",
    status: "in-progress",
    cost: 12000,
    technician: "Cool Tech"
  }
];

export const issues = [
  {
    id: 1,
    title: "Water Leakage",
    property: "Green Villas #12",
    room: "102",
    tenant: "Sita Sharma",
    priority: "high",
    status: "open",
    reportedDate: "2024-01-14",
    description: "Water leaking from bathroom ceiling"
  },
  {
    id: 2,
    title: "Electricity Problem",
    property: "Sunrise Apartments #5",
    room: "201B",
    tenant: "Bikash Thapa",
    priority: "medium",
    status: "in-progress",
    reportedDate: "2024-01-12",
    description: "Frequent power cuts in the room"
  },
  {
    id: 3,
    title: "Internet Connectivity",
    property: "Blue Heights Complex",
    room: "3A",
    tenant: "Anita Rai",
    priority: "low",
    status: "resolved",
    reportedDate: "2024-01-10",
    description: "WiFi connection is slow"
  }
];