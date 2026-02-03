import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, Briefcase, Calendar, FileText, TrendingUp } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalJobs: number;
  activeJobs: number;
  completedBookings: number;
  usersByRole: { name: string; value: number }[];
  bookingsByStatus: { name: string; value: number }[];
  jobsByCategory: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isInitializing } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verify admin access - wait for auth initialization
  useEffect(() => {
    if (isInitializing) {
      return; // Wait for auth to initialize
    }
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Add admin role check when implemented
  }, [user, isInitializing, navigate]);

  // Fetch admin statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // For now, using mock data - replace with actual API calls
        setStats({
          totalUsers: 156,
          totalProviders: 42,
          totalBookings: 283,
          totalJobs: 67,
          activeJobs: 23,
          completedBookings: 198,
          usersByRole: [
            { name: 'Regular Users', value: 114 },
            { name: 'Providers', value: 42 },
          ],
          bookingsByStatus: [
            { name: 'Completed', value: 198 },
            { name: 'Active', value: 65 },
            { name: 'Cancelled', value: 20 },
          ],
          jobsByCategory: [
            { name: 'Plumbing', value: 15 },
            { name: 'Electrical', value: 12 },
            { name: 'Cleaning', value: 18 },
            { name: 'Carpentry', value: 10 },
            { name: 'HVAC', value: 12 },
          ],
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center p-4">No data available</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <AdminHeader title="Dashboard" description="Platform overview and analytics" />
      <div className="ml-64 pt-20 pb-12 px-8">
        <div className="container mx-auto max-w-7xl">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

          {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Users */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
              <p className="text-xs text-slate-500 mt-1">Including providers</p>
            </CardContent>
          </Card>

          {/* Total Providers */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Providers</CardTitle>
              <Briefcase className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalProviders}</div>
              <p className="text-xs text-slate-500 mt-1">Active professionals</p>
            </CardContent>
          </Card>

          {/* Total Bookings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Bookings</CardTitle>
              <Calendar className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalBookings}</div>
              <p className="text-xs text-slate-500 mt-1">{stats.completedBookings} completed</p>
            </CardContent>
          </Card>

          {/* Active Jobs */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Jobs</CardTitle>
              <FileText className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.activeJobs}</div>
              <p className="text-xs text-slate-500 mt-1">Out of {stats.totalJobs} total</p>
            </CardContent>
          </Card>

          {/* Growth Indicator */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Conversion</CardTitle>
              <TrendingUp className="h-5 w-5 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {Math.round((stats.completedBookings / stats.totalBookings) * 100)}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Job completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Users by Role */}
          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
              <CardDescription>Distribution of user types</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.usersByRole}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bookings by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings by Status</CardTitle>
              <CardDescription>Current booking distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.bookingsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Jobs by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Jobs by Category</CardTitle>
              <CardDescription>Service distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.jobsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.jobsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/users')}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{stats.totalUsers} users registered</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/providers')}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Manage Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{stats.totalProviders} providers active</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/bookings')}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Manage Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{stats.totalBookings} total bookings</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/admin/jobs')}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Manage Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{stats.activeJobs} active jobs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
