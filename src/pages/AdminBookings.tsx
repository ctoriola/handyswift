import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Trash2, User, MapPin, Calendar, DollarSign } from 'lucide-react';

interface Booking {
  id: string;
  user_name: string;
  provider_name: string;
  service: string;
  location: string;
  booking_date: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  price?: number;
  created_at: string;
}

const statusColors: Record<Booking['status'], string> = {
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

export function AdminBookings() {
  const navigate = useNavigate();
  const { user, isInitializing } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isInitializing) {
      return; // Wait for auth to initialize
    }
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Mock data - replace with actual API call
        setBookings([
          {
            id: '1',
            user_name: 'John Doe',
            provider_name: 'Jane Smith',
            service: 'Plumbing Repair',
            location: '123 Main St, New York, NY',
            booking_date: '2026-02-05T10:00:00Z',
            status: 'confirmed',
            price: 150,
            created_at: '2026-02-01T14:30:00Z',
          },
          {
            id: '2',
            user_name: 'Bob Wilson',
            provider_name: 'Alice Johnson',
            service: 'Electrical Installation',
            location: '456 Oak Ave, Los Angeles, CA',
            booking_date: '2026-02-03T14:00:00Z',
            status: 'completed',
            price: 200,
            created_at: '2026-01-28T09:15:00Z',
          },
          {
            id: '3',
            user_name: 'Sarah Williams',
            provider_name: 'Mike Davis',
            service: 'AC Maintenance',
            location: '789 Elm St, Chicago, IL',
            booking_date: '2026-02-08T16:00:00Z',
            status: 'pending',
            price: 120,
            created_at: '2026-02-02T11:45:00Z',
          },
          {
            id: '4',
            user_name: 'Mike Johnson',
            provider_name: 'Sarah White',
            service: 'House Cleaning',
            location: '321 Pine Rd, Houston, TX',
            booking_date: '2026-01-30T09:00:00Z',
            status: 'cancelled',
            price: 100,
            created_at: '2026-01-29T16:20:00Z',
          },
          {
            id: '5',
            user_name: 'Emily Davis',
            provider_name: 'Jane Smith',
            service: 'Pipe Repair',
            location: '654 Cedar Ln, Phoenix, AZ',
            booking_date: '2026-02-07T13:00:00Z',
            status: 'confirmed',
            price: 180,
            created_at: '2026-02-03T10:30:00Z',
          },
        ]);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const filteredBookings = bookings.filter(b =>
    b.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(bookings.filter(b => b.id !== bookingId));
      // TODO: Add API call to delete booking
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <AdminHeader title="Bookings" description="View and manage all service bookings" />
      <div className="ml-64 pt-20 pb-12 px-8">
        <div className="container mx-auto max-w-7xl">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (bookings.filter(b => b.status === 'completed').length / bookings.length) * 100
                )}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Bookings</CardTitle>
            <CardDescription>Filter by user, provider, or service</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by user, provider, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
            <CardDescription>Complete list of service bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <TableRow key={b.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{b.user_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{b.provider_name}</TableCell>
                        <TableCell>{b.service}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {b.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {new Date(b.booking_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-slate-400" />
                            {b.price?.toFixed(2) || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[b.status]
                          }`}>
                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBooking(b.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
