import React, { createContext, useState, useContext, useEffect } from 'react';

// A mock user database stored in localStorage
const USER_DB_KEY = 'thelDenUserDb';
const SESSION_KEY = 'thelDenSession';

const getInitialUserDb = () => {
  const db = localStorage.getItem(USER_DB_KEY);
  if (db) {
    return JSON.parse(db);
  }
  // Hardcoded admin user
  return {
    'ayahakuttyv@gmail.com': {
      password: 'password@!123',
      name: 'Admin',
      profilePic: 'https://picsum.photos/seed/admin/200'
    }
  };
};

interface User {
  name: string;
  email: string;
  profilePic?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDb, setUserDb] = useState(getInitialUserDb);
  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for active session on initial load
    const activeSession = localStorage.getItem(SESSION_KEY);
    if (activeSession) {
      try {
        setUser(JSON.parse(activeSession));
      } catch (e) {
        console.error("Failed to parse user session from localStorage", e);
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  useEffect(() => {
    // Persist user database changes
    localStorage.setItem(USER_DB_KEY, JSON.stringify(userDb));
  }, [userDb]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const storedUser = userDb[email];
    if (storedUser && storedUser.password === password) {
      const userData = { email, name: storedUser.name, profilePic: storedUser.profilePic };
      setUser(userData);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    if (userDb[email]) {
      // User already exists
      return false;
    }
    
    // Log the user in first by updating the session state and storage
    const userData = { email, name, profilePic: `https://picsum.photos/seed/${email}/200` };
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));

    // Then, update the user database
    setUserDb(prevDb => ({ ...prevDb, [email]: { password, name, profilePic: userData.profilePic } }));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

      // Also update name/pic in the "DB"
      const dbUser = userDb[user.email];
      if(dbUser) {
        setUserDb(prev => ({
          ...prev,
          [user.email]: {
            ...dbUser,
            name: updatedUser.name,
            profilePic: updatedUser.profilePic
          }
        }))
      }
    }
  };

  // FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension, resolving multiple parsing errors.
  return React.createElement(AuthContext.Provider, {
    value: { isAuthenticated, user, login, signup, logout, updateUser }
  }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};