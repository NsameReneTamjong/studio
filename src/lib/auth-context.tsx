
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "SUPER_ADMIN" | "CEO" | "CTO" | "COO" | "INV" | "DESIGNER" | "SCHOOL_ADMIN" | "SUB_ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "BURSAR" | "LIBRARIAN";

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

export interface TutorialLinks {
  STUDENT: string;
  TEACHER: string;
  PARENT: string;
  SCHOOL_ADMIN: string;
  BURSAR: string;
  LIBRARIAN: string;
}

interface PlatformSettings {
  name: string;
  logo: string;
  paymentDeadline: string;
  fees: PlatformFees;
  tutorialLinks: TutorialLinks;
}

export interface User {
  id: string; 
  uid: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
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
  targetUid?: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  createdAt: Date;
  senderUid: string;
}

export interface SupportContribution {
  id: string;
  uid: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  schoolName: string;
  amount: number;
  method: string;
  phone: string;
  message: string;
  status: "New" | "Verified";
  createdAt: Date;
}

export interface PersonalChat {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isOfficial: boolean;
}

export interface PublicEvent {
  id: string;
  type: "video" | "image";
  title: string;
  description: string;
  url: string;
}

interface AuthContextType {
  user: User | null;
  platformSettings: PlatformSettings;
  testimonials: Testimony[];
  feedbacks: Feedback[];
  orders: Order[];
  announcements: Announcement[];
  supportContributions: SupportContribution[];
  personalChats: PersonalChat[];
  schools: SchoolInfo[];
  publicEvents: PublicEvent[];
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
  addPublicEvent: (event: Omit<PublicEvent, "id">) => void;
  deletePublicEvent: (id: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_EVENTS: PublicEvent[] = [
  {
    id: "e1",
    type: "video",
    title: "Annual Pedagogical Conference 2024",
    description: "Witness the digital transformation journey of 120+ schools across the region.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
  },
  {
    id: "e2",
    type: "image",
    title: "New STEM Laboratory Launch",
    description: "Inaugurating state-of-the-art facilities at GBHS Deido to empower future engineers.",
    url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop",
  }
];

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
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Critical Security Patch: Node API Core",
    content: "Internal Board Alert: A critical security patch has been applied to the authentication core. All board members must verify their biometric MFA status. Systems are operating at 100% integrity.",
    target: "saas_admins",
    senderName: "Tech Director",
    senderRole: "CTO",
    senderAvatar: "https://picsum.photos/seed/cto/100/100",
    senderUid: "mock_EDUI26CTO001",
    createdAt: new Date(Date.now() - 3600000)
  }
];

const DEMO_ACCOUNTS: Record<string, any> = {
  "EDUI26CEO001": { name: "EduIgnite CEO", role: "CEO", schoolId: null, isLicensePaid: true, avatar: "https://picsum.photos/seed/ceo/150/150", phone: "+237 600 00 00 01", whatsapp: "+237 600 00 00 01" },
  "EDUI26CTO001": { name: "Tech Director", role: "CTO", schoolId: null, isLicensePaid: true, avatar: "https://picsum.photos/seed/cto/150/150", phone: "+237 600 00 00 02", whatsapp: "+237 600 00 00 02" },
  "EDUI26COO001": { name: "Operations Lead", role: "COO", schoolId: null, isLicensePaid: true, avatar: "https://picsum.photos/seed/coo/150/150", phone: "+237 600 00 00 03", whatsapp: "+237 600 00 00 03" },
  "EDUI26INV001": { name: "Lead Investor", role: "INV", schoolId: null, isLicensePaid: true, avatar: "https://picsum.photos/seed/inv/150/150", phone: "+237 600 00 00 04", whatsapp: "+237 600 00 00 04" },
  "EDUI26DES001": { name: "Creative Lead", role: "DESIGNER", schoolId: null, isLicensePaid: true, avatar: "https://picsum.photos/seed/designer/150/150", phone: "+237 600 00 00 05", whatsapp: "+237 600 00 00 05" },
  "GBHS26": { name: "Principal Fonka", role: "SCHOOL_ADMIN", schoolId: "GBHS-D", isLicensePaid: true, avatar: "https://picsum.photos/seed/p1/150/150", phone: "+237 600 11 11 11", whatsapp: "+237 600 11 11 11" },
  "GBHS26A001": { name: "VP Academics", role: "SUB_ADMIN", schoolId: "GBHS-D", isLicensePaid: true, avatar: "https://picsum.photos/seed/subadmin/150/150", phone: "+237 600 22 22 22", whatsapp: "+237 600 22 22 22" },
  "GBHS26T001": { name: "Dr. Aris Tesla", role: "TEACHER", schoolId: "GBHS-D", isLicensePaid: true, avatar: "https://picsum.photos/seed/t1/150/150", phone: "+237 600 33 33 33", whatsapp: "+237 600 33 33 33" },
  "GBHS26B001": { name: "Mme. Ngono Celine", role: "BURSAR", schoolId: "GBHS-D", isLicensePaid: true, avatar: "https://picsum.photos/seed/b1/150/150", phone: "+237 600 44 44 44", whatsapp: "+237 600 44 44 44" },
  "GBHS26L001": { name: "Mr. Ebong", role: "LIBRARIAN", schoolId: "GBHS-D", isLicensePaid: true, avatar: "https://picsum.photos/seed/l1/150/150", phone: "+237 600 55 55 55", whatsapp: "+237 600 55 55 55" },
  "GBHS26S001": { name: "Alice Thompson", role: "STUDENT", schoolId: "GBHS-D", isLicensePaid: true, avatar: "https://picsum.photos/seed/s1/150/150", phone: "+237 600 66 66 66", whatsapp: "+237 600 66 66 66" },
  "GBHS26P001": { name: "Mr. Robert Thompson", role: "PARENT", schoolId: "GBHS-D", isLicensePaid: true, avatar: "https://picsum.photos/seed/pa1/150/150", phone: "+237 677 00 11 22", whatsapp: "+237 677 00 11 22" }
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

const DEFAULT_TUTORIALS: TutorialLinks = {
  STUDENT: "https://youtube.com/watch?v=eduignite-student",
  TEACHER: "https://youtube.com/watch?v=eduignite-teacher",
  PARENT: "https://youtube.com/watch?v=eduignite-parent",
  SCHOOL_ADMIN: "https://youtube.com/watch?v=eduignite-admin",
  BURSAR: "https://youtube.com/watch?v=eduignite-bursar",
  LIBRARIAN: "https://youtube.com/watch?v=eduignite-librarian",
};

const PLATFORM_DEFAULTS: PlatformSettings = {
  name: "EduIgnite",
  logo: "https://picsum.photos/seed/eduignite-platform/200/200",
  paymentDeadline: "2024-10-31",
  fees: DEFAULT_FEES,
  tutorialLinks: DEFAULT_TUTORIALS
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<SchoolInfo[]>([]);
  const [testimonials, setTestimonials] = useState<Testimony[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [personalChats, setPersonalChats] = useState<PersonalChat[]>([]);
  const [supportContributions, setSupportContributions] = useState<SupportContribution[]>([]);
  const [publicEvents, setPublicEvents] = useState<PublicEvent[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(PLATFORM_DEFAULTS);

  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("eduignite_prototype_session");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
    
    const loadRegistry = (key: string, defaultValue: any) => {
      const saved = localStorage.getItem(`eduignite_${key}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.length > 0 ? parsed : defaultValue;
          }
          return { ...defaultValue, ...parsed };
        } catch (e) {
          console.error(`Error loading registry ${key}`, e);
        }
      }
      return defaultValue;
    };

    setTestimonials(loadRegistry("testimonials", []));
    setFeedbacks(loadRegistry("feedbacks", []));
    setOrders(loadRegistry("orders", []));
    setAnnouncements(loadRegistry("announcements", INITIAL_ANNOUNCEMENTS));
    setPersonalChats(loadRegistry("personal_chats", []));
    setSupportContributions(loadRegistry("support", []));
    setSchools(loadRegistry("schools", INITIAL_SCHOOLS));
    setPublicEvents(loadRegistry("events", INITIAL_EVENTS));
    setPlatformSettings(loadRegistry("platform", PLATFORM_DEFAULTS));

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("eduignite_testimonials", JSON.stringify(testimonials));
      localStorage.setItem("eduignite_feedbacks", JSON.stringify(feedbacks));
      localStorage.setItem("eduignite_orders", JSON.stringify(orders));
      localStorage.setItem("eduignite_announcements", JSON.stringify(announcements));
      localStorage.setItem("eduignite_personal_chats", JSON.stringify(personalChats));
      localStorage.setItem("eduignite_support", JSON.stringify(supportContributions));
      localStorage.setItem("eduignite_schools", JSON.stringify(schools));
      localStorage.setItem("eduignite_events", JSON.stringify(publicEvents));
      localStorage.setItem("eduignite_platform", JSON.stringify(platformSettings));
    }
  }, [testimonials, feedbacks, orders, announcements, personalChats, supportContributions, schools, platformSettings, publicEvents, isLoading]);

  const login = async (matricule: string) => {
    setIsLoading(true);
    const m = matricule.toUpperCase();
    const demoData = DEMO_ACCOUNTS[m] || { name: "Guest User", role: "STUDENT", schoolId: "GBHS-D", isLicensePaid: true };
    
    const schoolList = schools.length > 0 ? schools : INITIAL_SCHOOLS;
    const assignedSchool = demoData.schoolId ? schoolList.find(s => s.id === demoData.schoolId) : undefined;

    const mockUser: User = {
      id: m,
      uid: `mock_${m}`,
      name: demoData.name,
      email: demoData.email || `${m.toLowerCase()}@eduignite.io`,
      phone: demoData.phone || "+237 600 00 00 00",
      whatsapp: demoData.whatsapp || "+237 600 00 00 00",
      role: demoData.role,
      schoolId: demoData.schoolId,
      isLicensePaid: demoData.isLicensePaid,
      avatar: demoData.avatar || `https://picsum.photos/seed/${m}/150/150`,
      school: assignedSchool
    };

    setUserData(mockUser);
    localStorage.setItem("eduignite_prototype_session", JSON.stringify(mockUser));
    
    const executiveRoles = ["CEO", "CTO", "COO", "INV", "SUPER_ADMIN", "DESIGNER"];
    if (executiveRoles.includes(mockUser.role)) {
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
    setSupportContributions(prev => prev.map(c => {
      if (c.id === id) {
        // Send Appreciation Message to Live Chat
        const msg: PersonalChat = {
          id: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          senderId: "mock_EDUI26CEO001",
          senderName: "EduIgnite CEO",
          senderRole: "CEO",
          senderAvatar: "https://picsum.photos/seed/ceo/150/150",
          receiverId: c.uid,
          text: `Dear ${c.userName}, We have verified your generous contribution. Your support is fueling the digital transformation of education across Africa. The EduIgnite community Love you dear, EduIgnite CEO.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOfficial: true
        };
        setPersonalChats(prevChats => [...prevChats, msg]);
        return { ...c, status: "Verified" };
      }
      return c;
    }));
  };
  const deleteSupport = (id: string) => {
    setSupportContributions(prev => prev.filter(c => i.id !== id));
  };

  const addPublicEvent = (e: Omit<PublicEvent, "id">) => {
    setPublicEvents(prev => [{ ...e, id: `EVT-${Math.random().toString(36).substr(2, 5).toUpperCase()}` }, ...prev]);
  };
  const deletePublicEvent = (id: string) => {
    setPublicEvents(prev => prev.filter(e => e.id !== id));
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
      personalChats,
      supportContributions,
      schools,
      publicEvents,
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
      addPublicEvent,
      deletePublicEvent,
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
