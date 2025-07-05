import React, { useEffect, useState } from 'react';
import Dashboard from '../components/dashboard';
import Properties from '../components/properties';
import MyListing from '../components/MyListing';
import Profile from '../components/Profile';
import Sidebar from '../components/sidebar';
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
      case 'PropAI':
        return (
          <div className="flex-1 overflow-hidden transition-all duration-300 my-10 bg-slate-100">
            <header className="bg-white shadow-sm border-b border-gray-100 px-8 py-6 my-6 mx-3">
              <h1 className="text-3xl font-bold text-gray-800">PropAI</h1>
            </header>
            <div className="px-8 py-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">PropAI Features</h2>
                <p className="text-gray-600">AI-powered property features will appear here.</p>
              </div>
            </div>
          </div>
        );
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