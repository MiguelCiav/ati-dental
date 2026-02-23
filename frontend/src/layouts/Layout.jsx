import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Navbar from '../components/ui/Navbar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Navbar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
