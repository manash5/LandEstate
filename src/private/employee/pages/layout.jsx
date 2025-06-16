import React, { useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MyProperties from '../components/MyProperties';
import ServiceRecords from '../components/ServiceRecords';
import Issues from '../components/Issues';
import TenantsOverview from '../components/TenantsOverview';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [currentComponent, setCurrentComponent] = useState(<Dashboard />);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Function to render component based on active tab
  const renderComponent = (tab) => {
    switch (tab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Assigned Properties':
        return <MyProperties />;
      case 'Service Records':
        return <ServiceRecords />;
      case 'Issues Raised':
        return <Issues />;
      case 'Tenants Overview':
        return <TenantsOverview />;
      case 'Settings':
        return <Setting />;
      default:
        return <Dashboard />;
    }
  };

  // Handle initial state from navigation
  useEffect(() => {
    if (location.state?.showAnalyze) {
      setActiveTab('Analyze');
      setCurrentComponent(renderComponent('Analyze'));
    }
  }, [location.state]);

  // Handle tab changes
  useEffect(() => {
    setCurrentComponent(renderComponent(activeTab));
  }, [activeTab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const handleSidebarCollapse = (isCollapsed) => {
    setIsSidebarCollapsed(isCollapsed);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Fixed Sidebar Container */}
      <div className="fixed left-0 top-0 h-screen">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onCollapse={handleSidebarCollapse}
        />
      </div>

      {/* Main Content with dynamic margin based on sidebar state */}
      <div className={`flex-1 transition-all duration-300 overflow-y-auto ${
        isSidebarCollapsed ? 'ml-[96px]' : 'ml-[296px]'
      }`}>
        {currentComponent}
      </div>
    </div>
  );
};

export default Layout;