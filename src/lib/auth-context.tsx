
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase, useUser, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { signInAnonymously, signOut } from "firebase/auth";
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
}

interface AuthContextType {
  user: User | null;
  platformSettings: PlatformSettings;
  login: (role: UserRole, schoolId?: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  updateSchool: (updates: Partial<SchoolInfo>) => void;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;
  markLicensePaid: () => void;
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
  const { auth, firestore } = useFirebase();
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    name: "EduIgnite",
    logo: ""
  });
  const router = useRouter();

  // Sync Global Platform Settings
  useEffect(() => {
    const docRef = doc(firestore, 'settings', 'platform');
    const unsubscribe = onSnapshot(
      docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setPlatformSettings(docSnap.data() as PlatformSettings);
        }
      },
      (serverError) => {
        // Log the error but don't emit a global permission error for branding
        // This prevents the app from locking up if branding is restricted or missing initially
        console.warn("Platform branding could not be loaded, using defaults.", serverError);
      }
    );
    return () => unsubscribe();
  }, [firestore]);

  // Sync User Profile from Firestore
  useEffect(() => {
    if (isAuthLoading) return;

    if (!authUser) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    const userDocRef = doc(firestore, "users", authUser.uid);
    const unsubscribe = onSnapshot(
      userDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data() as User);
        } else {
          setUserData(null);
        }
        setIsLoading(false);
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authUser, isAuthLoading, firestore]);

  const login = async (role: UserRole, schoolId: string = "S001") => {
    setIsLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const uid = result.user.uid;

      const userDocRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
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

        await setDoc(userDocRef, newUser).catch(async (e) => {
          const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: newUser
          });
          errorEmitter.emit('permission-error', permissionError);
        });

        // Register Super Admin in platform_admins collection to grant system authority
        if (role === "SUPER_ADMIN") {
          await setDoc(doc(firestore, "platform_admins", uid), {
            uid,
            role: "CEO",
            createdAt: serverTimestamp()
          });
        }

        await registerMatricule(firestore, matricule, uid);
      }

      if (role === "SUPER_ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/welcome");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!authUser) return;
    const userDocRef = doc(firestore, "users", authUser.uid);
    await setDoc(userDocRef, updates, { merge: true }).catch(async (e) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: updates
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const updateSchool = async (updates: Partial<SchoolInfo>) => {
    if (!userData || !userData.school || !authUser) return;
    const updatedSchool = { ...userData.school, ...updates };
    const userDocRef = doc(firestore, "users", authUser.uid);
    await setDoc(userDocRef, { school: updatedSchool }, { merge: true }).catch(async (e) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: { school: updatedSchool }
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const updatePlatformSettings = async (updates: Partial<PlatformSettings>) => {
    const docRef = doc(firestore, 'settings', 'platform');
    await setDoc(docRef, updates, { merge: true }).catch(async (e) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: updates
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const markLicensePaid = async () => {
    if (!authUser) return;
    const userDocRef = doc(firestore, "users", authUser.uid);
    await setDoc(userDocRef, { isLicensePaid: true }, { merge: true }).catch(async (e) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: { isLicensePaid: true }
      });
      errorEmitter.emit('permission-error', permissionError);
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
      login, 
      updateUser, 
      updateSchool, 
      updatePlatformSettings,
      markLicensePaid, 
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
