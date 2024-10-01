import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  id: number;
  roles: string[];
  token: string;
}

interface AuthContextType {
  auth: AuthState | null;
  loading: boolean;  // Add loading state
  login: (id: number, token: string, roles: string[]) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);  // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<{ exp: number }>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setAuth({
            id: Number(localStorage.getItem('id')),
            roles: JSON.parse(localStorage.getItem('roles') || '[]'),
            token,
          });
        } else {
          localStorage.clear();
        }
      } catch (e) {
        console.error('Invalid token:', e);
        localStorage.clear();
      }
    }
    setLoading(false);  // Set loading to false once done
  }, []);

  const login = (id: number, token: string, roles: string[]) => {
    localStorage.setItem('token', token);
    localStorage.setItem('id', id.toString());
    localStorage.setItem('roles', JSON.stringify(roles));
    setAuth({ id, roles, token });
  };

  const logout = () => {
    localStorage.clear();
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
