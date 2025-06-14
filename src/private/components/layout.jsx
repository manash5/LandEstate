import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import Properties from './properties';
import MyListing from './MyListing';
import Profile from './Profile';
import Sidebar from './sidebar';
import Message from './message';
import Setting from './settings';

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

  useEffect(() => {
    switch (activeTab) {
      case 'Dashboard':
        setCurrentComponent(<Dashboard />);
        break;
      case 'Properties':
        setCurrentComponent(<Properties />);
        break;
      case 'MyListing':
        setCurrentComponent(<MyListing />);
        break;
      case 'Profile':
        setCurrentComponent(<Profile />);
        break;
      case 'PropAI':
        setCurrentComponent(
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
        break;
      case 'Message':
        setCurrentComponent(
          <Message />
        );
        break;
      case 'Settings':
        setCurrentComponent(
          <Setting />
        );
        break;
      default:
        setCurrentComponent(<Dashboard />);
    }
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