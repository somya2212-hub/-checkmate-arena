import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiAdminLogin, getAdminMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ca_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ca_admin_token');
      if (savedToken) {
        try {
          const res = await getAdminMe();
          if (res.data.success) {
            setAdmin(res.data.admin);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiAdminLogin({ email, password });
    if (res.data.success) {
      const { token: jwtToken, admin: adminData } = res.data;
      localStorage.setItem('ca_admin_token', jwtToken);
      localStorage.setItem('ca_admin_user', JSON.stringify(adminData));
      setToken(jwtToken);
      setAdmin(adminData);
      return { success: true };
    }
    return { success: false, message: res.data.message || 'Login failed' };
  };

  const logout = () => {
    localStorage.removeItem('ca_admin_token');
    localStorage.removeItem('ca_admin_user');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
