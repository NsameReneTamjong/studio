"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "BURSAR" | "LIBRARIAN";

export interface SchoolInfo {
  id: string;
  name: string;
  motto: string;
  logo: string;
  banner: string;
  description: string;
  location: string; // Combined display location
  region: string;
  division: string;
  subDivision: string;
  cityVillage: string;
  address: string;
  postalCode?: string;
  phone: string;
  email: string;
}

interface PlatformSettings {
  name: string;
  logo: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
  avatar?: string;
  school?: SchoolInfo;
  isLicensePaid: boolean; 
}

interface AuthContextType {
  user: User | null;
  platformSettings: PlatformSettings;
  login: (role: UserRole, schoolName?: string) => void;
  updateUser: (updates: Partial<User>) => void;
  updateSchool: (updates: Partial<SchoolInfo>) => void;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;
  markLicensePaid: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_SCHOOLS: Record<string, SchoolInfo> = {
  "S001": {
    id: "S001",
    name: "Lycée de Joss",
    motto: "Discipline - Travail - Succès",
    logo: "https://picsum.photos/seed/joss-logo/200/200",
    banner: "https://picsum.photos/seed/joss-banner/1200/600",
    description: "One of the most prestigious secondary institutions in Douala, committed to academic excellence since 1950.",
    location: "Douala, Littoral",
    region: "Littoral",
    division: "Wouri",
    subDivision: "Douala I",
    cityVillage: "Douala",
    address: "Rue de Joss, Bonanjo",
    postalCode: "B.P. 4015",
    phone: "+237 233 42 10 15",
    email: "contact@lyceedejoss.cm"
  },
  "S002": {
    id: "S002",
    name: "GBHS Yaoundé",
    motto: "Excellence through Bilingualism",
    logo: "https://picsum.photos/seed/gbhs-logo/200/200",
    banner: "https://picsum.photos/seed/gbhs-banner/1200/600",
    description: "A leading bilingual institution in the heart of the capital city, shaping the future of Cameroonian youth.",
    location: "Yaoundé, Centre",
    region: "Centre",
    division: "Mfoundi",
    subDivision: "Yaoundé I",
    cityVillage: "Yaoundé",
    address: "Essos, Avenue de l'Indépendance",
    postalCode: "B.P. 1105",
    phone: "+237 222 30 45 60",
    email: "info@gbhsyaounde.edu"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    name: "EduIgnite",
    logo: ""
  });
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("edu-nexus-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedPlatform = localStorage.getItem("edu-nexus-platform");
    if (savedPlatform) {
      setPlatformSettings(JSON.parse(savedPlatform));
    }
  }, []);

  const login = (role: UserRole, schoolId: string = "S001") => {
    const school = role === "SUPER_ADMIN" ? undefined : MOCK_SCHOOLS[schoolId] || MOCK_SCHOOLS["S001"];
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === "SUPER_ADMIN" ? "EduIgnite Super Admin" : 
            role === "SCHOOL_ADMIN" ? `${school?.name} Principal` :
            role === "TEACHER" ? "Sarah Smith" : 
            role === "PARENT" ? "Robert Parent" : 
            role === "BURSAR" ? "Finance Manager" :
            role === "LIBRARIAN" ? "Resource Librarian" : "John Doe",
      email: `${role.toLowerCase()}@eduignite.io`,
      role,
      schoolId: role === "SUPER_ADMIN" ? null : schoolId,
      avatar: `https://picsum.photos/seed/${role}/100/100`,
      school,
      isLicensePaid: role === "SUPER_ADMIN"
    };
    setUser(mockUser);
    localStorage.setItem("edu-nexus-user", JSON.stringify(mockUser));
    
    if (role === "SUPER_ADMIN") {
      router.push("/dashboard");
    } else {
      router.push("/welcome");
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("edu-nexus-user", JSON.stringify(updatedUser));
  };

  const updateSchool = (updates: Partial<SchoolInfo>) => {
    if (!user || !user.school) return;
    const updatedSchool = { ...user.school, ...updates };
    const updatedUser = { ...user, school: updatedSchool };
    setUser(updatedUser);
    localStorage.setItem("edu-nexus-user", JSON.stringify(updatedUser));
  };

  const updatePlatformSettings = (updates: Partial<PlatformSettings>) => {
    const updated = { ...platformSettings, ...updates };
    setPlatformSettings(updated);
    localStorage.setItem("edu-nexus-platform", JSON.stringify(updated));
  };

  const markLicensePaid = () => {
    if (!user) return;
    const updatedUser = { ...user, isLicensePaid: true };
    setUser(updatedUser);
    localStorage.setItem("edu-nexus-user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("edu-nexus-user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      platformSettings,
      login, 
      updateUser, 
      updateSchool, 
      updatePlatformSettings,
      markLicensePaid, 
      logout, 
      isAuthenticated: !!user 
    }}>
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
