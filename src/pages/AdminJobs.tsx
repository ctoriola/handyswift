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
import { Trash2, User, MapPin, Calendar, DollarSign, Tag } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  category: string;
  posted_by: string;
  location: string;
  budget?: number;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  posted_date: string;
  offers_count: number;
}

const statusColors: Record<Job['status'], string> = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  closed: 'bg-red-100 text-red-800',
};

export function AdminJobs() {
  const navigate = useNavigate();
  const { user, isInitializing } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
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
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${apiUrl}/admin/jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        setJobs(data.data.jobs || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]);

  const filteredJobs = jobs;

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      setJobs(jobs.filter(j => j.id !== jobId));
      // TODO: Add API call to delete job
    }
  };

  const openJobs = jobs.filter(j => j.status === 'open').length;
  const totalBudget = jobs.reduce((sum, j) => sum + (j.budget || 0), 0);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading jobs...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Jobs" description="View and manage all posted jobs" />
        <div className="flex-1 overflow-auto pb-12 px-8">
          <div className="container mx-auto max-w-7xl">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Open Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{openJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toFixed(0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalBudget / jobs.length).toFixed(0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Jobs</CardTitle>
            <CardDescription>Filter by title, category, or posted by</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by title, category, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Jobs ({filteredJobs.length})</CardTitle>
            <CardDescription>Complete list of posted job requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Posted By</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Offers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((j) => (
                      <TableRow key={j.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{j.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-slate-400" />
                            {j.category}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            {j.posted_by}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {j.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-slate-400" />
                            {j.budget ? j.budget.toFixed(0) : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                            {j.offers_count} offer{j.offers_count !== 1 ? 's' : ''}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[j.status]
                          }`}>
                            {j.status === 'in_progress'
                              ? 'In Progress'
                              : j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteJob(j.id)}
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
                        No jobs found
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
