import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  username?: string;
  full_name: string;
  email: string;
  phone?: string;
  photo?: string;
  membershipType?: 'Free' | 'Premium';
  role: 'user' | 'provider';
  specialization?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isProvider: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a mock JWT token for development
const generateMockToken = (user: User): string => {
  // Create a simple base64 encoded token
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 604800, // 7 days
  }));
  const signature = btoa('handyswift_dev_secret');
  return `${header}.${payload}.${signature}`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.user.id,
          full_name: response.data.user.full_name,
          email: response.data.user.email,
          role: response.data.user.role as 'user' | 'provider',
          membershipType: 'Free',
          specialization: response.data.user.specialization,
        };
        
        setUser(userData);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      } else {
        console.error('Login failed:', response.message);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isProvider: user?.role === 'provider',
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}