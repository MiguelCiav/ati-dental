import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Navbar from '../components/ui/Navbar';
import './Layout.css';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="layout-main">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
    </div>
  );
};

export default Layout;
