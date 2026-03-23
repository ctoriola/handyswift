import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, Briefcase, Calendar, FileText, TrendingUp, MapPin, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { adminAPI } from '../services/api';

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
  const [locations, setLocations] = useState<Array<{id: number; name: string}>>([]);
  const [newLocation, setNewLocation] = useState('');
  const [addingLocation, setAddingLocation] = useState(false);

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
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${apiUrl}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data.data);

        // Fetch locations
        try {
          const locationRes = await adminAPI.getLocations(token);
          if (locationRes.success && locationRes.locations) {
            setLocations(locationRes.locations);
          }
        } catch (err) {
          console.error('Error fetching locations:', err);
          setLocations([
            { id: 1, name: 'Abuja' },
            { id: 2, name: 'Lagos' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddLocation = async () => {
    if (!newLocation.trim()) {
      return;
    }

    setAddingLocation(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await adminAPI.addLocation(token, newLocation);
      if (res.success) {
        setLocations([...locations, res.location]);
        setNewLocation('');
      } else {
        setError(res.message || 'Failed to add location');
      }
    } catch (err) {
      console.error('Error adding location:', err);
      setError('Error adding location');
    } finally {
      setAddingLocation(false);
    }
  };

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
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Dashboard" description="Platform overview and analytics" />
        <div className="flex-1 overflow-auto pb-12 px-8">
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

            {/* Locations Management */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Service Locations
                  </CardTitle>
                  <CardDescription>Add and manage service locations for providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add New Location */}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter location name (e.g., Benin City)"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddLocation();
                          }
                        }}
                      />
                      <Button
                        onClick={handleAddLocation}
                        disabled={addingLocation || !newLocation.trim()}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Location
                      </Button>
                    </div>

                    {/* List of Locations */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-slate-600 mb-3">Available Locations ({locations.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {locations.map((loc) => (
                          <div
                            key={loc.id}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {loc.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
