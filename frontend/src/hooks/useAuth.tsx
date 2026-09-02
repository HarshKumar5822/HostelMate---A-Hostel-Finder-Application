import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  token?: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updatedUser: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('hm_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('hm_token') || null;
  });

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('hm_token', token);
      localStorage.setItem('hm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hm_token');
      localStorage.removeItem('hm_user');
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        return {
          success: false,
          error: data.message || 'Invalid email or password. Please verify your credentials.',
        };
      }

      const authenticatedUser: AuthUser = {
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'student',
        token: data.token,
      };

      setToken(data.token);
      setUser(authenticatedUser);
      return { success: true };
    } catch {
      // Fallback for offline local dev mode if backend connection error occurs
      if (email === 'user@hostelmate.com' && password === 'password123') {
        const mockToken = 'mock_jwt_token_demo';
        const mockUser: AuthUser = {
          id: 'user-demo-1',
          name: 'Harsh Kumar',
          email: 'user@hostelmate.com',
          role: 'student',
          token: mockToken,
        };
        setToken(mockToken);
        setUser(mockUser);
        return { success: true };
      }
      return {
        success: false,
        error: 'Authentication failed. Please check if email and password match your registered account.',
      };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        return {
          success: false,
          error: data.message || 'Signup failed. Email may already be registered.',
        };
      }

      const newUser: AuthUser = {
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'student',
        token: data.token,
      };

      setToken(data.token);
      setUser(newUser);
      return { success: true };
    } catch {
      return {
        success: false,
        error: 'Unable to connect to server. Please try again in a moment.',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hm_token');
    localStorage.removeItem('hm_user');
  };

  const updateUser = (updated: Partial<AuthUser>) => {
    if (user) {
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem('hm_user', JSON.stringify(merged));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
