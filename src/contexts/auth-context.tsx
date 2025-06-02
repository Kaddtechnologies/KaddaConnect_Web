
"use client";

import type { UserProfile } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { placeholderUser } from '@/lib/placeholder-data';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'kaddaconnect.auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.isAuthenticated && authData.user) {
          setUser(authData.user);
        }
      } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && pass === 'password') {
      const loggedInUser = { ...placeholderUser, email };
      setUser(loggedInUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user: loggedInUser }));
    } else {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoading(false);
  };

  const signup = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      displayName: name,
      profilePictureUrl: 'https://placehold.co/100x100.png',
      dataAiHint: 'profile person',
      interests: [],
      ministry: 'New Member',
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated: true, user: newUser }));
    setIsLoading(false);
  };
  

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
