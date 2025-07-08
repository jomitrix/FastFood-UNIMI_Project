import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ApiService } from '@/services/apiService';
import { AuthService } from '@/services/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const getUser = useCallback(async () => {
    try {
      const data = await AuthService.getUser();
      if (data && data.status === "success") setUser(data.user);
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = ApiService.getToken();
      if (token) {
        setIsAuthenticated(true);
        await getUser();
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (e) {
      return false;
    }
  }, [getUser]);

  const login = useCallback(async (email, password) => {
    try {
      const data = await AuthService.login(email, password);
      if (!data || data.status !== "success") return { success: false, error: data.error ?? 'Login failed' };

      const { token } = data;
      if (!token) return { success: false, error: 'Login failed' };

      await AuthService.storeToken(token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  const register = useCallback(async (username, email, password, name, surname, role) => {
    try {
      const data = await AuthService.register(username, email, password, name, surname, role);
      if (!data || data.status !== "success") return { success: false, error: data.error ?? 'Registration failed' };

      const { token } = data;
      if (!token) return { success: false, error: 'Registrazione failed' };

      await AuthService.storeToken(token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  const logout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    register,
    getUser,
    logout,
    checkAuthStatus
  }), [isAuthenticated, user, login, register, getUser, logout, checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);