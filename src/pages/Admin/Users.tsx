import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
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
import { Search, Lock, LockOpen, Eye } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'provider' | 'admin';
  is_suspended: boolean;
  suspension_reason?: string;
  created_at: string;
}

export function AdminUsersPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionType, setActionType] = useState<'suspend' | 'unsuspend' | 'view' | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [user, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/users?limit=50&offset=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.data?.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/users/${selectedUser.id}/suspend`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ suspension_reason: suspendReason }),
      });

      if (!response.ok) throw new Error('Failed to suspend user');
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, is_suspended: true, suspension_reason: suspendReason } : u));
      setActionType(null);
      setSelectedUser(null);
      setSuspendReason('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUnsuspend = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/admin/users/${selectedUser.id}/unsuspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to unsuspend user');
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, is_suspended: false, suspension_reason: undefined } : u));
      setActionType(null);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">Manage platform users and provider accounts</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-900/20 border-red-800 mb-6">
            <CardContent className="pt-6 text-red-400">{error}</CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage and monitor user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Name</TableHead>
                      <TableHead className="text-slate-300">Role</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Joined</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-700 hover:bg-slate-800/50 text-slate-300">
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'provider' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_suspended ? 'destructive' : 'default'}>
                            {user.is_suspended ? 'Suspended' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setActionType('view');
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {user.is_suspended ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionType('unsuspend');
                                }}
                              >
                                <LockOpen className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionType('suspend');
                                }}
                              >
                                <Lock className="w-4 h-4" />
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
        {selectedUser && actionType === 'view' && (
          <AlertDialog open={true} onOpenChange={() => setActionType(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">User Details</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4 text-slate-300">
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="font-mono text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="text-white">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="text-white">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="text-white">{selectedUser.is_suspended ? 'Suspended' : 'Active'}</p>
                </div>
                {selectedUser.suspension_reason && (
                  <div>
                    <p className="text-sm text-slate-400">Suspension Reason</p>
                    <p className="text-white">{selectedUser.suspension_reason}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-400">Joined</p>
                  <p className="text-white">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
              </div>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {selectedUser && actionType === 'suspend' && (
          <AlertDialog open={true} onOpenChange={() => setActionType(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Suspend User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to suspend {selectedUser.email}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Suspension Reason
                  </label>
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="Enter reason for suspension..."
                    className="w-full px-3 py-2 bg-slate-700 border-slate-600 text-white rounded"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <AlertDialogCancel onClick={() => { setSuspendReason(''); setActionType(null); }}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSuspend}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Suspend
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {selectedUser && actionType === 'unsuspend' && (
          <AlertDialog open={true} onOpenChange={() => setActionType(null)}>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Unsuspend User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to unsuspend {selectedUser.email}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleUnsuspend}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Unsuspend
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
