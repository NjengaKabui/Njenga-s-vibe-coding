import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Bell, Settings, LogOut, Menu, X, BookOpen, Users, BarChart2, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onSwitchRole: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onSwitchRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const studentNavItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'My Schedule', path: '/schedule', icon: <Calendar size={20} /> },
    { name: 'My Courses', path: '/courses', icon: <BookOpen size={20} /> },
    { name: 'Performance', path: '/performance', icon: <BarChart2 size={20} /> },
    { name: 'Announcements', path: '/announcements', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const teacherNavItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Teaching Materials', path: '/courses', icon: <Briefcase size={20} /> },
    { name: 'Assessments', path: '/schedule', icon: <Calendar size={20} /> },
    { name: 'Announcements', path: '/announcements', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const navItems = userRole === 'STUDENT' ? studentNavItems : teacherNavItems;

  const getTitle = () => {
    const item = navItems.find(i => i.path === location.pathname);
    return item ? item.name : 'ScholarSync';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Calendar className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">ScholarSync</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="bg-indigo-50 rounded-lg p-3 flex items-center justify-between border border-indigo-100">
            <div>
              <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wide">Current View</p>
              <p className="text-sm font-bold text-indigo-700">{userRole === 'STUDENT' ? 'Student Portal' : 'Teacher Portal'}</p>
            </div>
            <button 
              onClick={onSwitchRole}
              className="text-xs bg-white text-indigo-600 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              Switch
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut size={20} className="mr-3" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 lg:hidden flex items-center justify-between px-4 py-3">
          <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800">{getTitle()}</span>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
              <Bell className="text-gray-500 hover:text-gray-700 cursor-pointer" size={20} />
            </div>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800">{userRole === 'STUDENT' ? 'John Student' : 'Prof. Anderson'}</p>
                <p className="text-xs text-gray-500">{userRole === 'STUDENT' ? 'Computer Science' : 'Dept. Head'}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                {userRole === 'STUDENT' ? 'JS' : 'PA'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;