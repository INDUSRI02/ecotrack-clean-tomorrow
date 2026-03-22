import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ecotrack_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate auth - replace with real backend
    await new Promise((r) => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem("ecotrack_users") || "[]");
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    const u = { id: found.id, name: found.name, email: found.email };
    setUser(u);
    localStorage.setItem("ecotrack_user", JSON.stringify(u));
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem("ecotrack_users") || "[]");
    if (users.find((u: any) => u.email === email)) throw new Error("Email already exists");
    const newUser = { id: crypto.randomUUID(), name, email, password };
    users.push(newUser);
    localStorage.setItem("ecotrack_users", JSON.stringify(users));
    const u = { id: newUser.id, name, email };
    setUser(u);
    localStorage.setItem("ecotrack_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecotrack_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
