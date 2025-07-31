import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import StatsCard from './StatsCard';
import { getEmployeeDashboard } from '../../../services/api';
import { Building, Users, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

const Dashboard = ({ setSelectedRoom }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeDashboard();
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No dashboard data available</p>
      </div>
    );
  }

  const { stats, properties, employee } = dashboardData;

  const statsCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building,
      color: "blue",
      change: `${stats.totalProperties} assigned to you`
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      icon: Users,
      color: "green",
      change: `${stats.occupiedRooms}/${stats.totalRooms} occupied (${stats.occupancyRate}%)`
    },
    {
      title: "Open Issues",
      value: stats.openIssues,
      icon: AlertTriangle,
      color: "red",
      change: "Require attention"
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: CheckCircle,
      color: "purple",
      change: "From assigned properties"
    }
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="bg-slate-100 p-6 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
            Welcome back, {employee.name}
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            {employee.role} - {employee.department}
          </p>
          
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Assigned Properties</h2>
          <span className="text-sm text-gray-500">{stats.totalProperties} properties assigned</span>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                setSelectedRoom={setSelectedRoom}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <Building className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Properties Assigned</h3>
            <p className="text-gray-500">You haven't been assigned any properties yet. Contact your manager for assignments.</p>
          </div>
        )}
      </div>

      {/* Recent Activities Section */}
      {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;