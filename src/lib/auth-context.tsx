
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

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

interface AuthContextType {
  user: User | null;
  platformSettings: PlatformSettings;
  login: (matricule: string, password?: string) => Promise<void>;
  activateAccount: (matricule: string, password?: string) => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    name: "EduIgnite",
    logo: "https://picsum.photos/seed/eduignite-platform/200/200"
  });
  
  const router = useRouter();
  const { auth, firestore } = initializeFirebase();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUserData({ ...userDoc.data(), uid: firebaseUser.uid } as User);
        }
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    });

    const unsubscribeSettings = onSnapshot(doc(firestore, "settings", "platform"), (snap) => {
      if (snap.exists()) {
        setPlatformSettings(snap.data() as PlatformSettings);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSettings();
    };
  }, [auth, firestore]);

  const login = async (matricule: string, password = "password123") => {
    setIsLoading(true);
    const m = matricule.toUpperCase();
    const email = `${m.toLowerCase()}@eduignite.io`;

    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw e;
        }
      }

      const uid = userCredential.user.uid;
      const userDocRef = doc(firestore, "users", uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        const demoData = DEMO_ACCOUNTS[m] || { name: "New User", role: "STUDENT", schoolId: null, isLicensePaid: true };
        const newUser: User = {
          id: m,
          uid: uid,
          name: demoData.name,
          email: email,
          role: demoData.role,
          schoolId: demoData.schoolId,
          isLicensePaid: demoData.isLicensePaid,
          avatar: `https://picsum.photos/seed/${m}/150/150`,
          school: demoData.schoolId ? DEMO_SCHOOL : undefined
        };
        await setDoc(userDocRef, newUser);
        setUserData(newUser);
      } else {
        setUserData({ ...userSnap.data(), uid } as User);
      }

      const role = (userSnap.data()?.role || DEMO_ACCOUNTS[m]?.role);
      if (["CEO", "CTO", "INV", "SUPER_ADMIN"].includes(role)) {
        router.push("/dashboard");
      } else {
        router.push("/welcome");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const activateAccount = async (matricule: string, password?: string) => {
    return login(matricule, password);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!userData) return;
    const userRef = doc(firestore, "users", userData.uid);
    await setDoc(userRef, updates, { merge: true });
  };

  const updateSchool = async (updates: Partial<SchoolInfo>) => {
    if (!userData || !userData.school) return;
    await updateUser({ school: { ...userData.school, ...updates } });
  };

  const updatePlatformSettings = async (updates: Partial<PlatformSettings>) => {
    await setDoc(doc(firestore, "settings", "platform"), updates, { merge: true });
  };

  const markLicensePaid = async () => {
    await updateUser({ isLicensePaid: true });
  };

  const incrementAiRequest = async () => {
    if (!userData) return;
    await updateUser({ aiRequestCount: (userData.aiRequestCount || 0) + 1 });
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user: userData, 
      platformSettings,
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
