
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

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
      name: role === "SUPER_ADMIN" ? "SaaS Overlord" : 
            role === "SCHOOL_ADMIN" ? `${schoolName} Admin` :
            role === "TEACHER" ? "Sarah Smith" : 
            role === "PARENT" ? "Robert Parent" : "John Doe",
      email: `${role.toLowerCase()}@edunexus.edu`,
      role,
      schoolId: role === "SUPER_ADMIN" ? null : "school-123",
      avatar: `https://picsum.photos/seed/${role}/100/100`,
    };
    setUser(mockUser);
    localStorage.setItem("edu-nexus-user", JSON.stringify(mockUser));
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("edu-nexus-user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
