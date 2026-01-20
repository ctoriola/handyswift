import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { AdminNav } from '../../components/AdminNav';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Eye } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  user_id: string;
  user_email: string;
  created_at: string;
  status: 'open' | 'in_progress' | 'completed';
}

export function AdminJobsPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    fetchJobs();
  }, [user, isAdmin, navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/jobs?limit=50&offset=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.data?.jobs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = filterStatus === 'all'
    ? jobs
    : jobs.filter(j => j.status === filterStatus);

  const statusStats = {
    open: jobs.filter(j => j.status === 'open').length,
    in_progress: jobs.filter(j => j.status === 'in_progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
  };

  if (!user || !isAdmin) {
    return <div className="p-8 text-center">Access denied</div>;
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <AdminNav />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Jobs Overview</h1>
          <p className="text-slate-400">Monitor all platform jobs and bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition"
            onClick={() => setFilterStatus('all')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{jobs.length}</div>
                <p className="text-sm text-slate-400 mt-1">Total Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition"
            onClick={() => setFilterStatus('open')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{statusStats.open}</div>
                <p className="text-sm text-slate-400 mt-1">Open</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition"
            onClick={() => setFilterStatus('in_progress')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{statusStats.in_progress}</div>
                <p className="text-sm text-slate-400 mt-1">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition"
            onClick={() => setFilterStatus('completed')}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{statusStats.completed}</div>
                <p className="text-sm text-slate-400 mt-1">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-900/20 border-red-800 mb-6">
            <CardContent className="pt-6 text-red-400">{error}</CardContent>
          </Card>
        )}

        {/* Jobs Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
            <CardDescription>
              {filterStatus === 'all' ? 'All jobs on platform' : `Jobs with status: ${filterStatus}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading jobs...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Title</TableHead>
                      <TableHead className="text-slate-300">Category</TableHead>
                      <TableHead className="text-slate-300">Posted By</TableHead>
                      <TableHead className="text-slate-300">Budget</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Posted</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job.id} className="border-slate-700 hover:bg-slate-800/50 text-slate-300">
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{job.category}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{job.user_email}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-400">${job.budget.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              job.status === 'completed'
                                ? 'default'
                                : job.status === 'in_progress'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {job.status === 'in_progress' ? 'In Progress' : job.status === 'open' ? 'Open' : 'Completed'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{new Date(job.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Job Dialog */}
        {selectedJob && (
          <AlertDialog open={true} onOpenChange={() => setSelectedJob(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">{selectedJob.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  Job ID: {selectedJob.id}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 text-slate-300 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Category</p>
                    <p className="text-white font-medium">{selectedJob.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Budget</p>
                    <p className="text-white font-semibold text-green-400">${selectedJob.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="text-white">{selectedJob.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <p className="text-white capitalize">{selectedJob.status === 'in_progress' ? 'In Progress' : selectedJob.status}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Posted By</p>
                  <p className="text-white text-sm">{selectedJob.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Posted On</p>
                  <p className="text-white text-sm">{new Date(selectedJob.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Description</p>
                  <p className="text-white text-sm whitespace-pre-wrap bg-slate-700/50 p-3 rounded">
                    {selectedJob.description}
                  </p>
                </div>
              </div>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
