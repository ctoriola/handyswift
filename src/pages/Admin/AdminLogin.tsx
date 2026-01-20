import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AlertCircle, Lock, Mail } from 'lucide-react';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user, isAdmin } = useAuth();

  // If already logged in as admin, redirect to dashboard
  if (user && isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        // After login, check if user is admin
        // We need to fetch the updated user from the context
        setTimeout(() => {
          // Force a check by reading from localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.role === 'admin') {
              navigate('/admin');
            } else {
              setError('This account is not an admin account. Please use the regular login.');
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
            }
          }
        }, 100);
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 mt-2">HandySwift Management Dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Admin Login</CardTitle>
            <CardDescription>Enter your admin credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4" />
                    Password
                  </div>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-400 text-center">
                This is a restricted admin portal. Unauthorized access is prohibited.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Back to user login
          </button>
        </div>
      </div>
    </div>
  );
}
