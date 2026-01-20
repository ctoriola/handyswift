import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminNav } from '../../components/AdminNav';
import { Users, UserCheck, FileText, AlertCircle } from 'lucide-react';

interface AdminStats {
  users: {
    total: number;
    providers: number;
    activeProviders: number;
  };
  jobs: {
    total: number;
    completed: number;
    completionRate: number;
  };
  bookings: {
    total: number;
  };
  admin: {
    pendingProviderApplications: number;
    openReports: number;
  };
}

export function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [user, isAdmin, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <AdminNav />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-slate-400">Platform management and analytics</p>
            </div>

            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading...</div>
            ) : error ? (
              <div className="text-red-600">Error: {error}</div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{stats.users.total}</div>
                      <p className="text-xs text-slate-400 mt-1">{stats.users.providers} providers</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" /> Active Providers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{stats.users.activeProviders}</div>
                      <p className="text-xs text-slate-400 mt-1">Verified & active</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Jobs Posted
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{stats.jobs.total}</div>
                      <p className="text-xs text-slate-400 mt-1">{stats.jobs.completed} completed ({stats.jobs.completionRate.toFixed(1)}%)</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Pending Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">{stats.admin.pendingProviderApplications + stats.admin.openReports}</div>
                      <p className="text-xs text-slate-400 mt-1">
                        {stats.admin.pendingProviderApplications} applications, {stats.admin.openReports} reports
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Platform Overview</CardTitle>
                    <CardDescription>Key metrics and statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-slate-400 text-sm mb-2">Total Bookings</p>
                        <p className="text-2xl font-bold text-white">{stats.bookings.total}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2">Job Completion Rate</p>
                        <p className="text-2xl font-bold text-green-400">{stats.jobs.completionRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2">Provider Approval Rate</p>
                        <p className="text-2xl font-bold text-blue-400">{((stats.users.activeProviders / stats.users.providers * 100) || 0).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2">Active Jobs</p>
                        <p className="text-2xl font-bold text-yellow-400">{stats.jobs.total - stats.jobs.completed}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
