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
import { CheckCircle2, Eye } from 'lucide-react';

interface Report {
  id: string;
  reporter_id: string;
  reporter_email: string;
  reported_user_id: string;
  reported_user_email: string;
  report_type: 'inappropriate_behavior' | 'fraud' | 'safety_concern' | 'quality_issue' | 'other';
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'dismissed';
  resolution_notes?: string;
  resolved_by?: string;
  created_at: string;
  updated_at: string;
}

export function AdminReportsPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [suspendUser, setSuspendUser] = useState(false);
  const [actionType, setActionType] = useState<'view' | 'resolve' | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchReports();
  }, [user, isAdmin, navigate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/reports?status=open&page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async () => {
    if (!selectedReport) return;
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/reports/${selectedReport.id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resolution_notes: resolutionNotes,
          suspend_reported_user: suspendUser,
        }),
      });

      if (!response.ok) throw new Error('Failed to resolve report');
      setReports(reports.map(r =>
        r.id === selectedReport.id
          ? { ...r, status: 'resolved', resolution_notes: resolutionNotes }
          : r
      ));
      setActionType(null);
      setSelectedReport(null);
      setResolutionNotes('');
      setSuspendUser(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const reportTypeLabels: Record<Report['report_type'], string> = {
    'inappropriate_behavior': 'Inappropriate Behavior',
    'fraud': 'Fraud',
    'safety_concern': 'Safety Concern',
    'quality_issue': 'Quality Issue',
    'other': 'Other',
  };

  const openReports = reports.filter(r => r.status === 'open' || r.status === 'in_review');

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
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Disputes</h1>
          <p className="text-slate-400">Manage user reports and platform disputes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{openReports.length}</div>
                <p className="text-sm text-slate-400 mt-1">Open/Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {reports.filter(r => r.report_type === 'fraud').length}
                </div>
                <p className="text-sm text-slate-400 mt-1">Fraud Reports</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {reports.filter(r => r.report_type === 'safety_concern').length}
                </div>
                <p className="text-sm text-slate-400 mt-1">Safety Concerns</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {reports.filter(r => r.status === 'resolved').length}
                </div>
                <p className="text-sm text-slate-400 mt-1">Resolved</p>
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

        {/* Reports Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Reports ({reports.length})</CardTitle>
            <CardDescription>Review and resolve user complaints</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading reports...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Reporter</TableHead>
                      <TableHead className="text-slate-300">Reported User</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} className="border-slate-700 hover:bg-slate-800/50 text-slate-300">
                        <TableCell>
                          <Badge variant="outline">{reportTypeLabels[report.report_type]}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{report.reporter_email}</TableCell>
                        <TableCell className="text-xs">{report.reported_user_email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.status === 'resolved'
                                ? 'default'
                                : report.status === 'in_review'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedReport(report);
                                setActionType('view');
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {report.status !== 'resolved' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setActionType('resolve');
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
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
        {selectedReport && actionType === 'view' && (
          <AlertDialog open={true} onOpenChange={() => setActionType(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700 max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Report Details</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4 text-slate-300 max-h-96 overflow-y-auto">
                <div>
                  <p className="text-sm text-slate-400">Type</p>
                  <p className="text-white">{reportTypeLabels[selectedReport.report_type]}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Reporter</p>
                  <p className="text-white text-sm">{selectedReport.reporter_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Reported User</p>
                  <p className="text-white text-sm">{selectedReport.reported_user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Description</p>
                  <p className="text-white text-sm">{selectedReport.description}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="text-white capitalize">{selectedReport.status}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="text-white text-sm">{new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>
                {selectedReport.resolution_notes && (
                  <div>
                    <p className="text-sm text-slate-400">Resolution Notes</p>
                    <p className="text-white text-sm">{selectedReport.resolution_notes}</p>
                  </div>
                )}
              </div>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {selectedReport && actionType === 'resolve' && (
          <AlertDialog open={true} onOpenChange={() => setActionType(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700 max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Resolve Report</AlertDialogTitle>
                <AlertDialogDescription>
                  Report from {selectedReport.reporter_email} against {selectedReport.reported_user_email}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Resolution Notes
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter resolution details..."
                    className="w-full px-3 py-2 bg-slate-700 border-slate-600 text-white rounded text-sm"
                  />
                </div>
                <label className="flex items-center gap-3 text-slate-300">
                  <input
                    type="checkbox"
                    checked={suspendUser}
                    onChange={(e) => setSuspendUser(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Suspend reported user</span>
                </label>
              </div>
              <div className="flex gap-3">
                <AlertDialogCancel
                  onClick={() => {
                    setResolutionNotes('');
                    setSuspendUser(false);
                    setActionType(null);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResolveReport}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Resolve
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
