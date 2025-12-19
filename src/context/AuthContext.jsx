import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Check admins
      const adminResponse = await fetch(`http://localhost:5005/admins?email=${email}&password=${password}`);
      const admins = await adminResponse.json();

      if (admins.length > 0) {
        const admin = admins[0];
        setUser(admin);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(admin));
        return { success: true, user: admin };
      }

      // Check customers
      const customerResponse = await fetch(`http://localhost:5005/customers?email=${email}&password=${password}`);
      const customers = await customerResponse.json();

      if (customers.length > 0) {
        const customer = customers[0];
        setUser(customer);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(customer));
        return { success: true, user: customer };
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};