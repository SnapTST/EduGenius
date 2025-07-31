
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// This is a simplified auth context. In a real app, you'd integrate with Firebase Auth
// or another identity provider.

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock user database
const users = {
  'user@example.com': 'password123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // For simplicity, we're not persisting auth state. A real app would use
  // localStorage, cookies, or a server-side session.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, pass: string) => {
    // @ts-ignore
    if (users[email] && users[email] === pass) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
