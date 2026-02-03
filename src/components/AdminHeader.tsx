import { useAuth } from '../contexts/AuthContext';
import { Bell, Settings, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-64 right-0 bg-white border-b border-slate-200 shadow-sm z-30 h-16">
      <div className="flex items-center justify-between h-full px-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative text-slate-600 hover:text-slate-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="text-slate-600 hover:text-slate-900 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-slate-700">{user?.full_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
