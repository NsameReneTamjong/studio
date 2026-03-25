
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useFirestore, useUser, useAuth as useFirebaseAuth } from "@/firebase";

export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "BURSAR" | "LIBRARIAN";

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

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatar: string;
  content: string;
  schoolName: string;
}

export interface FeaturedVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  category: string;
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
  aiRequestCount?: number;
}

interface AuthContextType {
  user: User | null;
  platformSettings: PlatformSettings;
  testimonials: Testimonial[];
  featuredVideos: FeaturedVideo[];
  login: (matricule: string, password: string) => Promise<void>;
  activateAccount: (matricule: string, password: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateSchool: (updates: Partial<SchoolInfo>) => Promise<void>;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => Promise<void>;
  markLicensePaid: () => Promise<void>;
  incrementAiRequest: () => Promise<void>;
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
  description: "One of the premier government institutions in Douala, dedicated to excellence in pedagogy and character building for the next generation of leaders.",
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

const DEMO_USERS: Record<string, User> = {
  "EDUI26CEO001": {
    id: "EDUI26CEO001",
    name: "Platform CEO",
    email: "ceo@eduignite.io",
    role: "SUPER_ADMIN",
    schoolId: null,
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/ceo/150/150"
  },
  "GBHS26": {
    id: "GBHS26",
    name: "Principal Fonka",
    email: "principal@gbhsdeido.cm",
    role: "SCHOOL_ADMIN",
    schoolId: "GBHS",
    school: DEMO_SCHOOL,
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/admin/150/150"
  },
  "GBHS26T001": {
    id: "GBHS26T001",
    name: "Dr. Aris Tesla",
    email: "tesla@gbhsdeido.cm",
    role: "TEACHER",
    schoolId: "GBHS",
    school: DEMO_SCHOOL,
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/teacher/150/150"
  },
  "GBHS26S001": {
    id: "GBHS26S001",
    name: "Alice Thompson",
    email: "alice@gbhsdeido.cm",
    role: "STUDENT",
    schoolId: "GBHS",
    school: DEMO_SCHOOL,
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/student/150/150"
  },
  "GBHS26B001": {
    id: "GBHS26B001",
    name: "Mme. Ngono Celine",
    email: "ngono@gbhsdeido.cm",
    role: "BURSAR",
    schoolId: "GBHS",
    school: DEMO_SCHOOL,
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/bursar/150/150"
  },
  "GBHS26L001": {
    id: "GBHS26L001",
    name: "Mr. Ebong",
    email: "ebong@gbhsdeido.cm",
    role: "LIBRARIAN",
    schoolId: "GBHS",
    school: DEMO_SCHOOL,
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/librarian/150/150"
  },
  "GBHS26P001": {
    id: "GBHS26P001",
    name: "Mr. Robert Thompson",
    email: "robert@thompson.com",
    role: "PARENT",
    schoolId: "GBHS",
    school: DEMO_SCHOOL,
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/parent/150/150"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    name: "EduIgnite",
    logo: "https://picsum.photos/seed/eduignite-platform/200/200"
  });
  const router = useRouter();
  const firestore = useFirestore();
  const auth = useFirebaseAuth();
  const { user: firebaseUser } = useUser();

  useEffect(() => {
    const savedUser = localStorage.getItem("edu_nexus_session");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (matricule: string, password: string) => {
    setIsLoading(true);
    const m = matricule.toUpperCase();
    const demoUser = DEMO_USERS[m];
    
    if (!demoUser || (password !== "password" && password !== "")) {
      setIsLoading(false);
      throw new Error("Invalid Matricule or Password. Use 'password' for demo.");
    }

    try {
      const email = `${m.toLowerCase()}@eduignite.io`;
      let userCredential;
      
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, "password123");
      } catch (e: any) {
        // Handle ambiguous credential errors or missing users
        if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, email, "password123");
          } catch (createError: any) {
            // If creation fails because user already exists, try signing in one last time
            if (createError.code === 'auth/email-already-in-use') {
              userCredential = await signInWithEmailAndPassword(auth, email, "password123");
            } else {
              throw createError;
            }
          }
        } else {
          throw e;
        }
      }

      const firebaseUserInstance = userCredential.user;
      const userRef = doc(firestore, "users", firebaseUserInstance.uid);
      
      const docData = {
        uid: firebaseUserInstance.uid,
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        schoolId: demoUser.schoolId,
        isLicensePaid: demoUser.isLicensePaid
      };

      await setDoc(userRef, docData, { merge: true });

      setUserData(demoUser);
      localStorage.setItem("edu_nexus_session", JSON.stringify(demoUser));
      
      if (demoUser.role === "SUPER_ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/welcome");
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      throw new Error("Authentication failed. Ensure Firestore is provisioned.");
    } finally {
      setIsLoading(false);
    }
  };

  const activateAccount = async (matricule: string, password: string) => {
    return login(matricule, password);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!userData || !firebaseUser) return;
    const updated = { ...userData, ...updates };
    setUserData(updated);
    localStorage.setItem("edu_nexus_session", JSON.stringify(updated));
    
    const userRef = doc(firestore, "users", firebaseUser.uid);
    await setDoc(userRef, {
      name: updated.name,
      email: updated.email,
      isLicensePaid: updated.isLicensePaid
    }, { merge: true });
  };

  const updateSchool = async (updates: Partial<SchoolInfo>) => {
    if (!userData || !userData.school) return;
    const updatedSchool = { ...userData.school, ...updates };
    const updatedUser = { ...userData, school: updatedSchool };
    setUserData(updatedUser);
    localStorage.setItem("edu_nexus_session", JSON.stringify(updatedUser));
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

  const logout = async () => {
    setUserData(null);
    localStorage.removeItem("edu_nexus_session");
    await auth.signOut();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user: userData, 
      platformSettings,
      testimonials: [
        { id: "1", author: "M. Fonka", role: "Principal", avatar: "https://picsum.photos/seed/t1/100/100", content: "EduIgnite has transformed how we track student attendance and fees.", schoolName: "GBHS Deido" },
        { id: "2", author: "Mme. Celine", role: "Bursar", avatar: "https://picsum.photos/seed/b1/100/100", content: "The digital receipt system saved us weeks of manual auditing.", schoolName: "Lycée de Joss" }
      ],
      featuredVideos: [
        { id: "1", title: "Digital Transformation", description: "How schools are evolving with EduIgnite.", thumbnail: "https://picsum.photos/seed/vid1/400/225", youtubeId: "dQw4w9WgXcQ", category: "Platform" }
      ],
      login, 
      activateAccount,
      updateUser, 
      updateSchool, 
      updatePlatformSettings,
      markLicensePaid, 
      incrementAiRequest,
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
