import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, MessageSquareText, FileBarChart, LogOut, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('sentigov_admin_token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('sentigov_admin_token');
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Activity },
    { path: '/analyzer', label: 'Submit Feedback', icon: MessageSquareText },
    { path: '/feed', label: 'Public Feed', icon: MessageSquareText },
  ];

  if (isAdmin) {
    navLinks.push({ path: '/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard });
    navLinks.push({ path: '/reports', label: 'Reports', icon: FileBarChart });
  }

  return (
    <nav className="sticky top-0 z-50 bg-darkSpace/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neonPurple flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SentiGov AI</span>
          </Link>
          
          <div className="flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', isActive ? 'text-neonCyan' : '')} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div>
            {isAdmin ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-roseGlow hover:bg-roseGlow/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 hover:border-neonPurple/50 text-gray-300 hover:text-white transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-neonPurple" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
