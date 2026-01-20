import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Users, UserCheck, FileText, AlertCircle, TrendingUp } from 'lucide-react';

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
    // Redirect if not admin
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

  if (loading) {
    return <div className="p-8 text-center">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center">No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Platform management and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition">
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

          {/* Active Providers */}
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition">
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

          {/* Jobs Posted */}
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition">
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

          {/* Pending Actions */}
          <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition">
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

        {/* Tabs for Management */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Management</CardTitle>
            <CardDescription>Manage users, providers, and platform content</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="providers">Providers</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-4">
                <div className="text-center py-8 text-slate-400">
                  <p>User management coming soon</p>
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Go to User Management
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="providers" className="mt-4">
                <div className="text-center py-8 text-slate-400">
                  <p>Provider management coming soon</p>
                  <button
                    onClick={() => navigate('/admin/providers')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Go to Provider Management
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="jobs" className="mt-4">
                <div className="text-center py-8 text-slate-400">
                  <p>Jobs overview coming soon</p>
                  <button
                    onClick={() => navigate('/admin/jobs')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Go to Jobs
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="mt-4">
                <div className="text-center py-8 text-slate-400">
                  <p>Reports management coming soon</p>
                  <button
                    onClick={() => navigate('/admin/reports')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Go to Reports
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
