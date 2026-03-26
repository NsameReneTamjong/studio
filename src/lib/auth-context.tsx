
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "SUB_ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "BURSAR" | "LIBRARIAN" | "CEO" | "CTO" | "COO" | "INV";

export interface SchoolInfo {
  id: string;
  name: string;
  shortName: string;
  principal: string;
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

export interface PlatformFees {
  STUDENT: string;
  PARENT: string;
  TEACHER: string;
  BURSAR: string;
  LIBRARIAN: string;
  SCHOOL_ADMIN: string;
  SUB_ADMIN: string;
}

interface PlatformSettings {
  name: string;
  logo: string;
  paymentDeadline: string;
  fees: PlatformFees;
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
  createdAt: Date;
}

export interface Feedback {
  id: string;
  subject: string;
  message: string;
  schoolName: string;
  schoolId: string;
  schoolLogo: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  status: "New" | "Resolved";
  createdAt: Date;
}

export interface Order {
  id: string;
  fullName: string;
  occupation: string;
  schoolName: string;
  whatsappNumber: string;
  email: string;
  region: string;
  division: string;
  subDivision: string;
  status: "pending" | "processed";
  createdAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  createdAt: Date;
  senderUid: string;
}

export interface SupportContribution {
  id: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  amount: number;
  method: string;
  phone: string;
  message: string;
  status: "New" | "Verified";
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  platformSettings: PlatformSettings;
  testimonials: Testimony[];
  feedbacks: Feedback[];
  orders: Order[];
  announcements: Announcement[];
  supportContributions: SupportContribution[];
  schools: SchoolInfo[];
  featuredVideos: any[];
  login: (matricule: string) => Promise<void>;
  activateAccount: (matricule: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateSchool: (updates: Partial<SchoolInfo>) => Promise<void>;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => Promise<void>;
  markLicensePaid: () => Promise<void>;
  incrementAiRequest: () => Promise<void>;
  // Data Handlers
  addTestimony: (testimony: Omit<Testimony, "id" | "status" | "createdAt">) => void;
  approveTestimony: (id: string) => void;
  deleteTestimony: (id: string) => void;
  addFeedback: (feedback: Omit<Feedback, "id" | "status" | "createdAt">) => void;
  resolveFeedback: (id: string) => void;
  deleteFeedback: (id: string) => void;
  addOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => void;
  processOrder: (id: string) => void;
  deleteOrder: (id: string) => void;
  addAnnouncement: (ann: Omit<Announcement, "id" | "createdAt">) => void;
  deleteAnnouncement: (id: string) => void;
  addSchool: (school: Omit<SchoolInfo, "status">) => void;
  toggleSchoolStatus: (id: string) => void;
  deleteSchool: (id: string) => void;
  addSupport: (contribution: Omit<SupportContribution, "id" | "status" | "createdAt">) => void;
  verifySupport: (id: string) => void;
  deleteSupport: (id: string) => void;
  // Auth
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_SCHOOLS: SchoolInfo[] = [
  {
    id: "GBHS-D",
    name: "GBHS Deido",
    shortName: "GBHSD",
    principal: "Dr. Jean-Pierre Fonka",
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
  },
  {
    id: "JOSS-L",
    name: "Lycée de Joss",
    shortName: "JOSSL",
    principal: "Mme. Marie Ngono",
    motto: "Knowledge is Power",
    logo: "https://picsum.photos/seed/school-logo-2/200/200",
    banner: "https://picsum.photos/seed/school-banner-2/1200/400",
    description: "A prestigious institution known for its high academic standards and vibrant student life.",
    location: "Douala, Littoral",
    region: "Littoral",
    division: "Wouri",
    subDivision: "Douala 1er",
    cityVillage: "Douala",
    address: "Bonanjo, Douala",
    phone: "+237 671 11 11 11",
    email: "admin@lyceejoss.cm",
    status: "Active"
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    fullName: "Dr. Jean-Pierre Biya",
    occupation: "School Principal",
    schoolName: "GBHS Douala",
    whatsappNumber: "+237 677 88 99 00",
    email: "principal@gbhsdouala.cm",
    region: "Littoral",
    division: "Wouri",
    subDivision: "Douala 1er",
    status: "pending",
    createdAt: new Date()
  },
  {
    id: "ORD-1002",
    fullName: "Mme. Elise Ngo",
    occupation: "Bursar",
    schoolName: "Lycée de Bonamoussadi",
    whatsappNumber: "+237 699 11 22 33",
    email: "bursar@lyceebona.cm",
    region: "Littoral",
    division: "Wouri",
    subDivision: "Douala 5ème",
    status: "processed",
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    id: "ORD-1003",
    fullName: "Prof. Luc Abena",
    occupation: "Principal",
    schoolName: "Lycée de Mballa II",
    whatsappNumber: "+237 655 44 55 66",
    email: "abena.luc@mballa2.cm",
    region: "Center",
    division: "Mfoundi",
    subDivision: "Yaoundé 1er",
    status: "pending",
    createdAt: new Date(Date.now() - 172800000)
  }
];

const INITIAL_SUPPORT: SupportContribution[] = [
  {
    id: "SUP-2001",
    userName: "Alice Thompson",
    userRole: "STUDENT",
    userAvatar: "https://picsum.photos/seed/s1/100/100",
    amount: 5000,
    method: "MTN MoMo",
    phone: "677001122",
    message: "I love the new MCQ exams! Keep up the good work.",
    status: "Verified",
    createdAt: new Date()
  },
  {
    id: "SUP-2002",
    userName: "Mr. Robert Thompson",
    userRole: "PARENT",
    userAvatar: "https://picsum.photos/seed/p1/100/100",
    amount: 15000,
    method: "Orange Money",
    phone: "699334455",
    message: "Great platform. It makes tracking my daughter's progress so easy.",
    status: "New",
    createdAt: new Date()
  },
  {
    id: "SUP-2003",
    userName: "Dr. Aris Tesla",
    userRole: "TEACHER",
    userAvatar: "https://picsum.photos/seed/t1/100/100",
    amount: 10000,
    method: "MTN MoMo",
    phone: "670112233",
    message: "Supporting the digital transformation of education in Cameroon.",
    status: "Verified",
    createdAt: new Date(Date.now() - 432000000)
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Global Platform Update v2.4.0",
    content: "We have successfully rolled out high-availability nodes across the region. Performance is now 40% faster.",
    target: "all_schools",
    senderName: "Platform CEO",
    senderRole: "CEO",
    senderAvatar: "https://picsum.photos/seed/ceo/100/100",
    senderUid: "mock_EDUI26CEO001",
    createdAt: new Date()
  }
];

const INITIAL_TESTIMONIALS: Testimony[] = [
  {
    id: "test-1",
    userId: "S1",
    name: "Alice Thompson",
    role: "STUDENT",
    schoolName: "GBHS Deido",
    profileImage: "https://picsum.photos/seed/s1/150/150",
    message: "EduIgnite has completely changed how I study. The MCQ timers are great for preparation!",
    status: "approved",
    createdAt: new Date()
  },
  {
    id: "test-2",
    userId: "P1",
    name: "Mr. Robert Thompson",
    role: "PARENT",
    schoolName: "GBHS Deido",
    profileImage: "https://picsum.photos/seed/p1/150/150",
    message: "Transparency is the key. I can check my child's attendance and grades from anywhere.",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000)
  }
];

const DEMO_ACCOUNTS: Record<string, any> = {
  "EDUI26CEO001": { name: "Platform CEO", role: "CEO", schoolId: null, isLicensePaid: true },
  "GBHS26": { name: "Principal Fonka", role: "SCHOOL_ADMIN", schoolId: "GBHS-D", isLicensePaid: true },
  "GBHS26A001": { name: "Vice Principal Academics", role: "SUB_ADMIN", schoolId: "GBHS-D", isLicensePaid: true },
  "GBHS26T001": { name: "Dr. Aris Tesla", role: "TEACHER", schoolId: "GBHS-D", isLicensePaid: true },
  "GBHS26S001": { name: "Alice Thompson", role: "STUDENT", schoolId: "GBHS-D", isLicensePaid: true },
  "GBHS26B001": { name: "Mme. Ngono Celine", role: "BURSAR", schoolId: "GBHS-D", isLicensePaid: true },
  "GBHS26L001": { name: "Mr. Ebong", role: "LIBRARIAN", schoolId: "GBHS-D", isLicensePaid: true },
  "GBHS26P001": { name: "Mr. Robert Thompson", role: "PARENT", schoolId: "GBHS-D", isLicensePaid: true }
};

const DEFAULT_FEES: PlatformFees = {
  STUDENT: "5000",
  PARENT: "2500",
  TEACHER: "10000",
  BURSAR: "10000",
  LIBRARIAN: "10000",
  SCHOOL_ADMIN: "25000",
  SUB_ADMIN: "15000"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<SchoolInfo[]>(INITIAL_SCHOOLS);
  const [testimonials, setTestimonials] = useState<Testimony[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [supportContributions, setSupportContributions] = useState<SupportContribution[]>(INITIAL_SUPPORT);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    name: "EduIgnite",
    logo: "https://picsum.photos/seed/eduignite-platform/200/200",
    paymentDeadline: "2024-10-31",
    fees: DEFAULT_FEES
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
    
    // Load collections from local storage for persistence
    const collections = [
      { key: "testimonials", setter: setTestimonials, default: INITIAL_TESTIMONIALS },
      { key: "feedbacks", setter: setFeedbacks, default: [] },
      { key: "orders", setter: setOrders, default: INITIAL_ORDERS },
      { key: "announcements", setter: setAnnouncements, default: INITIAL_ANNOUNCEMENTS },
      { key: "support", setter: setSupportContributions, default: INITIAL_SUPPORT },
      { key: "schools", setter: setSchools, default: INITIAL_SCHOOLS },
      { key: "platform", setter: setPlatformSettings, default: { name: "EduIgnite", logo: "https://picsum.photos/seed/eduignite-platform/200/200", paymentDeadline: "2024-10-31", fees: DEFAULT_FEES } }
    ];

    collections.forEach(c => {
      const saved = localStorage.getItem(`eduignite_${c.key}`);
      const parsed = saved ? JSON.parse(saved) : null;
      
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        c.setter(parsed);
      } else if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
        c.setter(parsed);
      } else if (c.default) {
        c.setter(c.default);
      }
    });

    setIsLoading(false);
  }, []);

  // Persistence Sync
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("eduignite_testimonials", JSON.stringify(testimonials));
      localStorage.setItem("eduignite_feedbacks", JSON.stringify(feedbacks));
      localStorage.setItem("eduignite_orders", JSON.stringify(orders));
      localStorage.setItem("eduignite_announcements", JSON.stringify(announcements));
      localStorage.setItem("eduignite_support", JSON.stringify(supportContributions));
      localStorage.setItem("eduignite_schools", JSON.stringify(schools));
      localStorage.setItem("eduignite_platform", JSON.stringify(platformSettings));
    }
  }, [testimonials, feedbacks, orders, announcements, supportContributions, schools, platformSettings, isLoading]);

  const login = async (matricule: string) => {
    setIsLoading(true);
    const m = matricule.toUpperCase();
    const demoData = DEMO_ACCOUNTS[m] || { name: "Guest User", role: "STUDENT", schoolId: "GBHS-D", isLicensePaid: true };
    
    const mockUser: User = {
      id: m,
      uid: `mock_${m}`,
      name: demoData.name,
      email: `${m.toLowerCase()}@eduignite.io`,
      role: demoData.role,
      schoolId: demoData.schoolId,
      isLicensePaid: demoData.isLicensePaid,
      avatar: `https://picsum.photos/seed/${m}/150/150`,
      school: demoData.schoolId ? schools.find(s => s.id === demoData.schoolId) : undefined
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
    const updated = { ...userData.school, ...updates };
    setSchools(prev => prev.map(s => s.id === updated.id ? updated : s));
    await updateUser({ school: updated });
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

  // --- Collection Handlers ---

  const addTestimony = (t: Omit<Testimony, "id" | "status" | "createdAt">) => {
    setTestimonials(prev => [{ ...t, id: Math.random().toString(36).substr(2, 9), status: "pending", createdAt: new Date() }, ...prev]);
  };
  const approveTestimony = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: "approved" } : t));
  };
  const deleteTestimony = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const addFeedback = (f: Omit<Feedback, "id" | "status" | "createdAt">) => {
    setFeedbacks(prev => [{ ...f, id: `FB-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, status: "New", createdAt: new Date() }, ...prev]);
  };
  const resolveFeedback = (id: string) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: "Resolved" } : f));
  };
  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const addOrder = (o: Omit<Order, "id" | "status" | "createdAt">) => {
    setOrders(prev => [{ ...o, id: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, status: "pending", createdAt: new Date() }, ...prev]);
  };
  const processOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "processed" } : o));
  };
  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const addAnnouncement = (a: Omit<Announcement, "id" | "createdAt">) => {
    setAnnouncements(prev => [{ ...a, id: Math.random().toString(), createdAt: new Date() }, ...prev]);
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const addSchool = (s: Omit<SchoolInfo, "status">) => {
    setSchools(prev => [{ ...s, status: "Active" }, ...prev]);
  };
  const toggleSchoolStatus = (id: string) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s));
  };
  const deleteSchool = (id: string) => {
    setSchools(prev => prev.filter(s => s.id !== id));
  };

  const addSupport = (c: Omit<SupportContribution, "id" | "status" | "createdAt">) => {
    setSupportContributions(prev => [{ ...c, id: `SUP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, status: "New", createdAt: new Date() }, ...prev]);
  };
  const verifySupport = (id: string) => {
    setSupportContributions(prev => prev.map(c => c.id === id ? { ...c, status: "Verified" } : c));
  };
  const deleteSupport = (id: string) => {
    setSupportContributions(prev => prev.filter(c => c.id !== id));
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
      feedbacks,
      orders,
      announcements,
      supportContributions,
      schools,
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
      addFeedback,
      resolveFeedback,
      deleteFeedback,
      addOrder,
      processOrder,
      deleteOrder,
      addAnnouncement,
      deleteAnnouncement,
      addSchool,
      toggleSchoolStatus,
      deleteSchool,
      addSupport,
      verifySupport,
      deleteSupport,
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
