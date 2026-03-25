
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "BURSAR" | "LIBRARIAN" | "CEO" | "CTO" | "COO" | "INV";

export interface SchoolInfo {
  id: string;
  name: string;
  motto: string;
  logo: string;
  banner: string;
  description: string;
  location: string;
  region: string;
  division: string;
  subDivision: string;
  cityVillage: string;
  address: string;
  postalCode?: string;
  phone: string;
  email: string;
  status: string;
}

interface PlatformSettings {
  name: string;
  logo: string;
}

export interface User {
  id: string; 
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
  avatar?: string;
  school?: SchoolInfo;
  isLicensePaid: boolean; 
  aiRequestCount?: number;
}

export interface Testimony {
  id: string;
  userId: string;
  name: string;
  profileImage: string;
  role: string;
  schoolName: string;
  message: string;
  status: "pending" | "approved";
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  platformSettings: PlatformSettings;
  testimonials: Testimony[];
  featuredVideos: any[];
  login: (matricule: string) => Promise<void>;
  activateAccount: (matricule: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateSchool: (updates: Partial<SchoolInfo>) => Promise<void>;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => Promise<void>;
  markLicensePaid: () => Promise<void>;
  incrementAiRequest: () => Promise<void>;
  addTestimony: (testimony: Omit<Testimony, "id" | "status" | "createdAt">) => void;
  approveTestimony: (id: string) => void;
  deleteTestimony: (id: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_SCHOOL: SchoolInfo = {
  id: "GBHS",
  name: "GBHS Deido",
  motto: "Discipline - Work - Success",
  logo: "https://picsum.photos/seed/school-logo-1/200/200",
  banner: "https://picsum.photos/seed/school-banner/1200/400",
  description: "One of the premier government institutions in Douala, dedicated to excellence in pedagogy and character building.",
  location: "Douala, Littoral",
  region: "Littoral",
  division: "Wouri",
  subDivision: "Douala 1er",
  cityVillage: "Douala",
  address: "Rue de Deido, BP 123",
  phone: "+237 670 00 00 00",
  email: "contact@gbhsdeido.cm",
  status: "Active"
};

const DEMO_ACCOUNTS: Record<string, any> = {
  "EDUI26CEO001": { name: "Platform CEO", role: "CEO", schoolId: null, isLicensePaid: true },
  "GBHS26": { name: "Principal Fonka", role: "SCHOOL_ADMIN", schoolId: "GBHS", isLicensePaid: true },
  "GBHS26T001": { name: "Dr. Aris Tesla", role: "TEACHER", schoolId: "GBHS", isLicensePaid: true },
  "GBHS26S001": { name: "Alice Thompson", role: "STUDENT", schoolId: "GBHS", isLicensePaid: true },
  "GBHS26B001": { name: "Mme. Ngono Celine", role: "BURSAR", schoolId: "GBHS", isLicensePaid: true },
  "GBHS26L001": { name: "Mr. Ebong", role: "LIBRARIAN", schoolId: "GBHS", isLicensePaid: true },
  "GBHS26P001": { name: "Mr. Robert Thompson", role: "PARENT", schoolId: "GBHS", isLicensePaid: true }
};

const INITIAL_TESTIMONIES: Testimony[] = [
  { id: "1", userId: "S1", name: "Alice Thompson", profileImage: "https://picsum.photos/seed/s1/100/100", role: "STUDENT", schoolName: "GBHS Deido", message: "EduIgnite has made tracking my grades so much easier! I love the MCQ exams.", status: "approved", createdAt: new Date() },
  { id: "2", userId: "T1", name: "Dr. Aris Tesla", profileImage: "https://picsum.photos/seed/t1/100/100", role: "TEACHER", schoolName: "GBHS Deido", message: "The AI feedback assistant saves me hours of manual work every week.", status: "approved", createdAt: new Date() },
  { id: "3", userId: "P1", name: "Robert Thompson", profileImage: "https://picsum.photos/seed/p1/100/100", role: "PARENT", schoolName: "GBHS Deido", message: "Finally a way to pay fees and check attendance from my phone. Incredible!", status: "pending", createdAt: new Date() },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimony[]>(INITIAL_TESTIMONIES);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    name: "EduIgnite",
    logo: "https://picsum.photos/seed/eduignite-platform/200/200"
  });

  const [featuredVideos] = useState([
    { id: 1, title: "Platform Introduction", description: "Learn how EduIgnite is revolutionizing school management.", thumbnail: "https://picsum.photos/seed/v1/800/450", category: "Platform" },
    { id: 2, title: "Teacher's Guide", description: "A quick walk-through of the pedagogical dashboard.", thumbnail: "https://picsum.photos/seed/v2/800/450", category: "Training" },
  ]);
  
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("eduignite_prototype_session");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
    const savedTestimonials = localStorage.getItem("eduignite_prototype_testimonials");
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("eduignite_prototype_testimonials", JSON.stringify(testimonials));
    }
  }, [testimonials, isLoading]);

  const login = async (matricule: string) => {
    setIsLoading(true);
    const m = matricule.toUpperCase();
    const demoData = DEMO_ACCOUNTS[m] || { name: "Guest User", role: "STUDENT", schoolId: "GBHS", isLicensePaid: true };
    
    const mockUser: User = {
      id: m,
      uid: `mock_${m}`,
      name: demoData.name,
      email: `${m.toLowerCase()}@eduignite.io`,
      role: demoData.role,
      schoolId: demoData.schoolId,
      isLicensePaid: demoData.isLicensePaid,
      avatar: `https://picsum.photos/seed/${m}/150/150`,
      school: demoData.schoolId ? DEMO_SCHOOL : undefined
    };

    setUserData(mockUser);
    localStorage.setItem("eduignite_prototype_session", JSON.stringify(mockUser));
    
    if (["CEO", "CTO", "INV", "SUPER_ADMIN"].includes(mockUser.role)) {
      router.push("/dashboard");
    } else {
      router.push("/welcome");
    }
    setIsLoading(false);
  };

  const activateAccount = async (matricule: string) => {
    return login(matricule);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!userData) return;
    const newUser = { ...userData, ...updates };
    setUserData(newUser);
    localStorage.setItem("eduignite_prototype_session", JSON.stringify(newUser));
  };

  const updateSchool = async (updates: Partial<SchoolInfo>) => {
    if (!userData || !userData.school) return;
    await updateUser({ school: { ...userData.school, ...updates } });
  };

  const updatePlatformSettings = async (updates: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => ({ ...prev, ...updates }));
  };

  const markLicensePaid = async () => {
    await updateUser({ isLicensePaid: true });
  };

  const incrementAiRequest = async () => {
    if (!userData) return;
    await updateUser({ aiRequestCount: (userData.aiRequestCount || 0) + 1 });
  };

  const addTestimony = (testimony: Omit<Testimony, "id" | "status" | "createdAt">) => {
    const newTest: Testimony = {
      ...testimony,
      id: Math.random().toString(36).substr(2, 9),
      status: "pending",
      createdAt: new Date()
    };
    setTestimonials(prev => [newTest, ...prev]);
  };

  const approveTestimony = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: "approved" } : t));
  };

  const deleteTestimony = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const logout = async () => {
    setUserData(null);
    localStorage.removeItem("eduignite_prototype_session");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user: userData, 
      platformSettings,
      testimonials,
      featuredVideos,
      login, 
      activateAccount,
      updateUser, 
      updateSchool, 
      updatePlatformSettings,
      markLicensePaid, 
      incrementAiRequest,
      addTestimony,
      approveTestimony,
      deleteTestimony,
      logout, 
      isAuthenticated: !!userData,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
