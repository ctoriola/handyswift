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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';

interface PendingProvider {
  id: string;
  provider_id: string;
  provider_email: string;
  provider_name: string;
  status: 'pending' | 'approved' | 'rejected';
  documents_submitted: boolean;
  submission_date: string;
  rejection_reason?: string;
}

export function AdminProvidersPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<PendingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view' | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchProviders();
  }, [user, isAdmin, navigate]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/providers/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch providers');
      const data = await response.json();
      setProviders(data.data?.providers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedProvider) return;
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/providers/${selectedProvider.provider_id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to approve provider');
      setProviders(providers.map(p =>
        p.provider_id === selectedProvider.provider_id
          ? { ...p, status: 'approved' }
          : p
      ));
      setActionType(null);
      setSelectedProvider(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReject = async () => {
    if (!selectedProvider) return;
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/providers/${selectedProvider.provider_id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      });

      if (!response.ok) throw new Error('Failed to reject provider');
      setProviders(providers.map(p =>
        p.provider_id === selectedProvider.provider_id
          ? { ...p, status: 'rejected', rejection_reason: rejectionReason }
          : p
      ));
      setActionType(null);
      setSelectedProvider(null);
      setRejectionReason('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const pendingProviders = providers.filter(p => p.status === 'pending');
  const allStatuses = providers;

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
          <h1 className="text-3xl font-bold text-white mb-2">Provider Management</h1>
          <p className="text-slate-400">Verify and approve provider applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{pendingProviders.length}</div>
                <p className="text-sm text-slate-400 mt-1">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{allStatuses.filter(p => p.status === 'approved').length}</div>
                <p className="text-sm text-slate-400 mt-1">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{allStatuses.filter(p => p.status === 'rejected').length}</div>
                <p className="text-sm text-slate-400 mt-1">Rejected</p>
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

        {/* Providers Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Provider Applications ({allStatuses.length})</CardTitle>
            <CardDescription>Review and manage provider verification requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading providers...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Name</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Submitted</TableHead>
                      <TableHead className="text-slate-300">Documents</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allStatuses.map((provider) => (
                      <TableRow key={provider.id} className="border-slate-700 hover:bg-slate-800/50 text-slate-300">
                        <TableCell>{provider.provider_email}</TableCell>
                        <TableCell>{provider.provider_name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              provider.status === 'approved'
                                ? 'default'
                                : provider.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {provider.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(provider.submission_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={provider.documents_submitted ? 'default' : 'secondary'}>
                            {provider.documents_submitted ? 'Submitted' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setActionType('view');
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {provider.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setActionType('approve');
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setActionType('reject');
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Dialogs */}
        {selectedProvider && actionType === 'view' && (
          <AlertDialog open={true} onOpenChange={() => setActionType(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Provider Details</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4 text-slate-300">
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-mono text-white">{selectedProvider.provider_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="text-white">{selectedProvider.provider_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="text-white capitalize">{selectedProvider.status}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Application Date</p>
                  <p className="text-white">{new Date(selectedProvider.submission_date).toLocaleString()}</p>
                </div>
                {selectedProvider.rejection_reason && (
                  <div>
                    <p className="text-sm text-slate-400">Rejection Reason</p>
                    <p className="text-white">{selectedProvider.rejection_reason}</p>
                  </div>
                )}
              </div>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {selectedProvider && actionType === 'approve' && (
          <AlertDialog open={true} onOpenChange={() => setActionType(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Approve Provider</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to approve {selectedProvider.provider_name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {selectedProvider && actionType === 'reject' && (
          <AlertDialog open={true} onOpenChange={() => setActionType(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Reject Provider</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject {selectedProvider.provider_name}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full px-3 py-2 bg-slate-700 border-slate-600 text-white rounded"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <AlertDialogCancel onClick={() => { setRejectionReason(''); setActionType(null); }}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReject}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reject
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}
