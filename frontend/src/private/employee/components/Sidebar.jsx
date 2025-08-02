import React, { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Building, 
  Clipboard, 
  Users, 
  ChevronLeft,
  PartyPopper, 
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import houseIcon from '../../../assets/house.png';

const Sidebar = ({ activeTab, onTabChange, onCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const navigate = useNavigate();

  // Get employee data from localStorage and API
  useEffect(() => {
    const loadEmployeeData = () => {
      const storedEmployeeData = localStorage.getItem('employeeData');
      if (storedEmployeeData) {
        setEmployeeData(JSON.parse(storedEmployeeData));
      }
    };

    loadEmployeeData();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', loadEmployeeData);
    
    return () => {
      window.removeEventListener('storage', loadEmployeeData);
    };
  }, []);

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Building, label: 'Assigned Properties' },
    { icon: Clipboard, label: 'Issues Raised' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Users, label: 'Tenants Overview' },
  ];

  const handleItemClick = (label) => {
    if (onTabChange) {
      onTabChange(label);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeData');
    navigate('/employee/login');
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  // Get first letter of name for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-2 h-screen bg-slate-100">
      <div className={`bg-[#111523] text-white h-full rounded-2xl transition-all duration-300 ease-in-out overflow-hidden shadow-xl ${
          isCollapsed ? 'w-[80px]' : 'w-[280px]'
        }`}>
        {/* Header with Logo and Toggle Button */}
        <div className="flex items-center justify-between my-10 px-5">
          <div className="logo flex items-center space-x-2 px-2">
            {isCollapsed? <img src={houseIcon} alt="LandEstate Logo" />:<><img src={houseIcon} alt="LandEstate Logo" /><h1 className="text-xl  text-white font-bold text-primary-500 px-2">LandEstate</h1></>}
          </div>
          
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 ease-in-out"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200" />
            </button>
          )}
        </div>

        {/* Collapse button when sidebar is collapsed */}
        {isCollapsed && (
          <div className="px-5 mb-6">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 ease-in-out rotate-180"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-200" />
            </button>
          </div>
        )}

        <div className="bottom-6 left-0 right-0 px-4 mb-10">
          <div className={`flex items-center space-x-3 p-2 rounded-xl bg-white/5 border border-white/10 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 m-0">
              <span className="text-white font-semibold text-sm">{getInitials(employeeData?.name)}</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 items-center justify-center">
                <p className="text-sm font-medium text-white truncate m-0">{employeeData?.name || 'Employee'}</p>
                <p className="text-xs text-gray-400 truncate m-0">{employeeData?.email || 'employee@landestate.com'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item.label)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 ease-in-out group relative ${
                activeTab === item.label
                  ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/20 border border-blue-500/40 text-blue-300'
                  : 'hover:bg-gray-800/50 text-gray-300 hover:text-white border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${
                activeTab === item.label 
                  ? 'text-blue-400' 
                  : 'group-hover:text-blue-400'
              } transition-colors duration-300`} />
              
              <span className={`font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100'
              }`}>
                {item.label}
              </span>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>
        {/* Logout button below navigation */}
        <div className="px-4 mt-2">
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 ease-in-out group relative bg-red-500/10 border border-red-500/40 text-red-300 active:bg-red-700/40 active:text-white font-medium`}
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
            <span className={isCollapsed ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;