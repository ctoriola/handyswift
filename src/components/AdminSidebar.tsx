import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BookOpen, 
  Briefcase,
  LogOut,
  ChevronRight
} from 'lucide-react';

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
    },
    {
      label: 'Users',
      icon: Users,
      path: '/admin/users',
    },
    {
      label: 'Providers',
      icon: UserCheck,
      path: '/admin/providers',
    },
    {
      label: 'Bookings',
      icon: BookOpen,
      path: '/admin/bookings',
    },
    {
      label: 'Jobs',
      icon: Briefcase,
      path: '/admin/jobs',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-slate-900 text-white shadow-lg flex flex-col flex-shrink-0 h-screen">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
            HS
          </div>
          <div>
            <h1 className="text-lg font-bold">HandySwift</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-slate-800">
        <p className="text-sm text-slate-300">Logged in as</p>
        <p className="font-medium text-white truncate">{user?.full_name}</p>
        <p className="text-xs text-slate-400">{user?.email}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {active && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-slate-800">
        <Button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
