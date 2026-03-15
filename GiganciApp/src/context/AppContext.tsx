import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, User, MOCK_USERS } from '../data/mockData';

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState('pl');

  const login = (role: UserRole) => {
    setUser(MOCK_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn: user !== null,
      login,
      logout,
      language,
      setLanguage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
