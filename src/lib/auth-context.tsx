
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "BURSAR" | "LIBRARIAN";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, schoolName?: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("edu-nexus-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (role: UserRole, schoolName: string = "Springfield High") => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === "SUPER_ADMIN" ? "EduIgnite Super Admin" : 
            role === "SCHOOL_ADMIN" ? `${schoolName} Principal` :
            role === "TEACHER" ? "Sarah Smith" : 
            role === "PARENT" ? "Robert Parent" : 
            role === "BURSAR" ? "Finance Manager" :
            role === "LIBRARIAN" ? "Resource Librarian" : "John Doe",
      email: `${role.toLowerCase()}@eduignite.io`,
      role,
      schoolId: role === "SUPER_ADMIN" ? null : "school-123",
      avatar: `https://picsum.photos/seed/${role}/100/100`,
    };
    setUser(mockUser);
    localStorage.setItem("edu-nexus-user", JSON.stringify(mockUser));
    router.push("/dashboard");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("edu-nexus-user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("edu-nexus-user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
