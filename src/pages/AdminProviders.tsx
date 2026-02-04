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
import { Trash2, Mail, MapPin, Star, Badge } from 'lucide-react';

interface Provider {
  id: string;
  email: string;
  full_name: string;
  specialization?: string;
  location?: string;
  rating: number;
  total_jobs: number;
  verified: boolean;
  created_at: string;
}

export function AdminProviders() {
  const navigate = useNavigate();
  const { user, isInitializing } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
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
  }, [user, isInitializing, navigate]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${apiUrl}/admin/providers?search=${encodeURIComponent(searchTerm)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch providers');
        }

        const data = await response.json();
        setProviders(data.data.providers || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [navigate, searchTerm]);

  const filteredProviders = providers;

  const handleDeleteProvider = async (providerId: string) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      setProviders(providers.filter(p => p.id !== providerId));
      // TODO: Add API call to delete provider
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading providers...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Providers" description="Manage all service providers" />
        <div className="flex-1 overflow-auto pb-12 px-8">
          <div className="container mx-auto max-w-6xl">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Providers</CardTitle>
            <CardDescription>Filter by name, email, or specialization</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name, email, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Providers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Providers ({filteredProviders.length})</CardTitle>
            <CardDescription>Registered service providers on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.length > 0 ? (
                    filteredProviders.map((p) => (
                      <TableRow key={p.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{p.full_name}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {p.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {p.specialization || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {p.location || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{p.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{p.total_jobs}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              p.verified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {p.verified ? 'Verified' : 'Pending'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProvider(p.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                        No providers found
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
    </div>
  );
}
