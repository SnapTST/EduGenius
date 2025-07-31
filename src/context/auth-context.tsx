
'use client';

import * as React from 'react';

// Define the User type
type User = {
  name: string;
  email: string;
};

// Define the context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
};

// Create the context with a default undefined value
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check for a logged-in user in localStorage when the app loads
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = storedUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userToStore } = foundUser;
      setUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = storedUsers.some((u: any) => u.email === email);

    if (userExists) {
      return false; // User with this email already exists
    }

    const newUser = { name, email, password };
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const { password: _, ...userToStore } = newUser;
    setUser(userToStore);
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
