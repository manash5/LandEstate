import React, { useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
import Properties from '../components/properties';
import MyListing from '../components/MyListing';
import Profile from '../components/Profile';
import Sidebar from '../components/Sidebar';
import Message from '../components/message';
import Setting from '../components/settings';
import Analyze from '../components/Analyze';
import { useLocation } from 'react-router-dom';

import { 
  LayoutDashboard, 
  Building, 
  ShoppingCart, 
  User, 
  Settings, 
  Receipt,
  ChevronLeft,
  PartyPopper, 
  MessageSquare
} from 'lucide-react';

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
      case 'Properties':
        return <Properties />;
      case 'Analyze':
        return <Analyze />;
      case 'Profile':
        return <Profile />;
      case 'Message':
        return <Message />;
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