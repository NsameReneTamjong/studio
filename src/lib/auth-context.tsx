
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase, useUser, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, getDoc, setDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, increment } from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { generateSchoolMatricule, generatePlatformMatricule, registerMatricule } from "@/lib/matricule";

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
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, schoolId?: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  updateSchool: (updates: Partial<SchoolInfo>) => void;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;
  markLicensePaid: () => void;
  incrementAiRequest: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  }
};

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
    return onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        setUserData(data);
      }
      setIsLoading(false);
    }, (e) => setIsLoading(false));
  }, [authUser, isAuthLoading, firestore]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, schoolId: string = "S001") => {
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const uid = result.user.uid;

      let matricule = "";
      if (role === "SUPER_ADMIN") {
        matricule = await generatePlatformMatricule(firestore, "CEO");
      } else {
        matricule = await generateSchoolMatricule(firestore, schoolId, role === 'SCHOOL_ADMIN' ? 'ADMIN' : role as any);
      }

      const school = role === "SUPER_ADMIN" ? undefined : MOCK_SCHOOLS[schoolId] || MOCK_SCHOOLS["S001"];
      
      const newUser: User = {
        id: matricule,
        uid: uid,
        name,
        email,
        role,
        schoolId: role === "SUPER_ADMIN" ? null : schoolId,
        avatar: `https://picsum.photos/seed/${uid}/100/100`,
        school,
        isLicensePaid: role === "SUPER_ADMIN",
        aiRequestCount: 0,
        lastAiReset: serverTimestamp()
      };

      await setDoc(doc(firestore, "users", uid), newUser);
      await registerMatricule(firestore, matricule, uid);

      if (role === "SUPER_ADMIN") {
        await setDoc(doc(firestore, "platform_admins", uid), {
          uid, role: "CEO", createdAt: serverTimestamp()
        });
      }

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
    if (!userData || !userData.school || !authUser) return;
    const updatedSchool = { ...userData.school, ...updates };
    await updateDoc(doc(firestore, "users", authUser.uid), { school: updatedSchool });
  };

  const updatePlatformSettings = async (updates: Partial<PlatformSettings>) => {
    await updateDoc(doc(firestore, 'settings', 'platform'), updates);
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
      register,
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
