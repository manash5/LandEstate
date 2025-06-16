import React from 'react';
import PropertyCard from '../components/PropertyCard';
import StatsCard from '../components/StatsCard';
import { properties, issues } from '../data/mockData';
import { Building, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = ({ setSelectedRoom }) => {
  const totalProperties = properties.length;
  const totalRooms = properties.reduce((sum, prop) => sum + prop.totalRooms, 0);
  const occupiedRooms = properties.reduce((sum, prop) => sum + prop.occupiedRooms, 0);
  const openIssues = issues.filter(issue => issue.status === 'open').length;

  const stats = [
    {
      title: "Total Properties",
      value: totalProperties,
      icon: Building,
      color: "blue",
      change: "+2 this month"
    },
    {
      title: "Total Rooms",
      value: totalRooms,
      icon: Users,
      color: "green",
      change: `${occupiedRooms}/${totalRooms} occupied`
    },
    {
      title: "Open Issues",
      value: openIssues,
      icon: AlertTriangle,
      color: "red",
      change: "2 high priority"
    },
    {
      title: "Rent Collection",
      value: "85%",
      icon: CheckCircle,
      color: "purple",
      change: "This month"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your property management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Assigned Properties</h2>
          <span className="text-sm text-gray-500">{totalProperties} properties assigned</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              setSelectedRoom={setSelectedRoom}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;