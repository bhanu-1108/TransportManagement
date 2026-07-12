import { createContext, useContext, useState, useCallback } from 'react';
import { DEMO_ACCOUNTS, PERMISSIONS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('transitops_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const account = DEMO_ACCOUNTS.find(
        a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );

      if (!account) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }

      const userData = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        avatar: account.avatar,
        department: account.department,
        loginTime: new Date().toISOString(),
      };

      setUser(userData);
      sessionStorage.setItem('transitops_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('transitops_user');
  }, []);

  /**
   * Check if current user has a specific permission for a module
   * @param {string} module - e.g. 'vehicles'
   * @param {string} action - e.g. 'create', 'edit', 'delete', 'view'
   */
  const hasPermission = useCallback((module, action) => {
    if (!user) return false;
    const rolePerms = PERMISSIONS[user.role];
    if (!rolePerms) return false;
    const modulePerms = rolePerms[module];
    if (!modulePerms) return false;
    return modulePerms.includes(action);
  }, [user]);

  const canView = useCallback((module) => hasPermission(module, 'view'), [hasPermission]);
  const canCreate = useCallback((module) => hasPermission(module, 'create'), [hasPermission]);
  const canEdit = useCallback((module) => hasPermission(module, 'edit'), [hasPermission]);
  const canDelete = useCallback((module) => hasPermission(module, 'delete'), [hasPermission]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      hasPermission,
      canView,
      canCreate,
      canEdit,
      canDelete,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
