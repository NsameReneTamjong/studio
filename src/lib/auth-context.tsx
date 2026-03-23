
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase, useUser } from "@/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy, 
  updateDoc, 
  increment,
  getDocs,
  where,
  limit
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
} from "firebase/auth";

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
  createdAt: any;
}

export interface FeaturedVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  category: string;
  createdAt: any;
}

interface User {
  id: string; // The Matricule
  uid: string; // Firebase Auth UID
  name: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
  avatar?: string;
  school?: SchoolInfo;
  isLicensePaid: boolean; 
  aiRequestCount?: number;
  lastAiReset?: any;
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

const matriculeToEmail = (matricule: string) => `${matricule.toLowerCase()}@eduignite.io`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth, firestore } = useFirebase();
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    name: "EduIgnite",
    logo: ""
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<FeaturedVideo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const docRef = doc(firestore, 'settings', 'platform');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setPlatformSettings(docSnap.data() as PlatformSettings);
    });
    return () => unsubscribe();
  }, [firestore]);

  useEffect(() => {
    const q = query(collection(firestore, "testimonials"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    });
  }, [firestore]);

  useEffect(() => {
    const q = query(collection(firestore, "featured_videos"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setFeaturedVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeaturedVideo)));
    });
  }, [firestore]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!authUser) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    const userDocRef = doc(firestore, "users", authUser.uid);
    return onSnapshot(userDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        
        if (data.schoolId) {
          const schoolsQuery = query(collection(firestore, "schools"), where("id", "==", data.schoolId), limit(1));
          const schoolSnap = await getDocs(schoolsQuery);
          if (!schoolSnap.empty) {
            data.school = { ...schoolSnap.docs[0].data(), id: schoolSnap.docs[0].id } as SchoolInfo;
          }
        }
        
        setUserData(data);
      }
      setIsLoading(false);
    });
  }, [authUser, isAuthLoading, firestore]);

  const login = async (matricule: string, password: string) => {
    setIsLoading(true);
    try {
      const email = matriculeToEmail(matricule);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const activateAccount = async (matricule: string, password: string) => {
    setIsLoading(true);
    try {
      const email = matriculeToEmail(matricule);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const uid = result.user.uid;

      await setDoc(doc(firestore, "users", uid), {
        id: matricule.toUpperCase(),
        uid: uid,
        email: email,
        isLicensePaid: false,
        createdAt: serverTimestamp()
      }, { merge: true });

      router.push("/welcome");
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!authUser) return;
    await updateDoc(doc(firestore, "users", authUser.uid), updates);
  };

  const updateSchool = async (updates: Partial<SchoolInfo>) => {
    if (!userData || !userData.schoolId || !authUser) return;
    const schoolsQuery = query(collection(firestore, "schools"), where("id", "==", userData.schoolId), limit(1));
    const schoolSnap = await getDocs(schoolsQuery);
    if (!schoolSnap.empty) {
      await updateDoc(schoolSnap.docs[0].ref, updates);
    }
  };

  const updatePlatformSettings = async (updates: Partial<PlatformSettings>) => {
    await setDoc(doc(firestore, 'settings', 'platform'), updates, { merge: true });
  };

  const markLicensePaid = async () => {
    if (!authUser) return;
    await updateDoc(doc(firestore, "users", authUser.uid), { isLicensePaid: true });
  };

  const incrementAiRequest = async () => {
    if (!authUser) return;
    await updateDoc(doc(firestore, "users", authUser.uid), {
      aiRequestCount: increment(1)
    });
  };

  const logout = async () => {
    await signOut(auth);
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
      logout, 
      isAuthenticated: !!authUser && !!userData,
      isLoading: isLoading || isAuthLoading
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
