import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutGrid, Radio } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { currentUser, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-12">
              <div 
                className="cursor-pointer flex items-center gap-3 group" 
                onClick={() => navigate('/dashboard')}
              >
                <h1 className="text-xl font-bold text-brand-950 tracking-tight">
                  Structural Memory
                </h1>
              </div>
              
              <div className="hidden md:flex items-center gap-1">
                <NavItem 
                  active={location.pathname === '/dashboard'} 
                  onClick={() => navigate('/dashboard')} 
                  icon={<LayoutGrid size={18} />} 
                  label="Overview" 
                />
                 <NavItem 
                  active={location.pathname === '/drone-status'} 
                  onClick={() => navigate('/drone-status')} 
                  icon={<Radio size={18} />} 
                  label="Drone Status" 
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800">{currentUser?.displayName}</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  {userRole === 'admin' ? 'Administrator' : 'Viewer'}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="text-slate-400 hover:text-brand-900 transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-12 max-w-7xl mx-auto px-6">
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${active 
        ? 'text-brand-900 bg-brand-50' 
        : 'text-slate-500 hover:text-brand-900 hover:bg-slate-50'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Layout;