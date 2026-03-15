import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as storeLogin, signup as storeSignup, logout as storeLogout, initStore } from '../data/store';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStore();
    const current = getCurrentUser();
    if (current) setUser(current);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = storeLogin(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const signup = async (data) => {
    const result = storeSignup(data);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = () => {
    storeLogout();
    setUser(null);
  };

  const refreshUser = () => {
    const current = getCurrentUser();
    if (current) setUser(current);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
