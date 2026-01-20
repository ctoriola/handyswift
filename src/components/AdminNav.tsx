import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LayoutDashboard, Users, UserCheck, FileText, AlertCircle, LogOut } from 'lucide-react';

export function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/providers', icon: UserCheck, label: 'Providers' },
    { path: '/admin/jobs', icon: FileText, label: 'Jobs' },
    { path: '/admin/reports', icon: AlertCircle, label: 'Reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 p-6 flex flex-col h-screen">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">HandySwift</h1>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === path || (path === '/admin' && location.pathname.startsWith('/admin'))
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        variant="destructive"
        className="w-full flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
}
