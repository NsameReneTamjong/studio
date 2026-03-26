
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Award,
  LogOut,
  Building2,
  Sparkles,
  Heart,
  Globe,
  Languages,
  MessageSquare,
  Megaphone,
  MessageCircle,
  User,
  X,
  PenTool,
  FileEdit,
  Library,
  Coins,
  Receipt,
  UsersRound,
  CreditCard,
  Settings2,
  Crown,
  Lock,
  Wallet,
  Video,
  Info,
  Quote,
  Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  onClose?: () => void;
}

const EXECUTIVE_ROLES: UserRole[] = ["SUPER_ADMIN", "CEO", "CTO", "COO", "INV", "DESIGNER"];

export function DashboardSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();

  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isSuperAdmin = EXECUTIVE_ROLES.includes(user?.role as UserRole);
  const isBursar = user?.role === "BURSAR";

  const routes = [
    {
      label: t("platformOverview"),
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: EXECUTIVE_ROLES,
    },
    {
      label: t("founders"),
      icon: Crown,
      href: "/dashboard/founders",
      roles: EXECUTIVE_ROLES,
    },
    {
      label: t("schools"),
      icon: Globe,
      href: "/dashboard/schools",
      roles: EXECUTIVE_ROLES,
    },
    {
      label: t("supportRegistry"),
      icon: Heart,
      href: "/dashboard/support",
      roles: EXECUTIVE_ROLES,
    },
    {
      label: language === 'en' ? 'Testimonials' : 'Témoignages',
      icon: Quote,
      href: "/dashboard/testimonials",
      roles: EXECUTIVE_ROLES,
    },
    {
      label: t("feedback"),
      icon: MessageSquare,
      href: "/dashboard/feedback",
      roles: [...EXECUTIVE_ROLES, "SCHOOL_ADMIN"],
    },
    {
      label: t("platformSettings"),
      icon: Settings2,
      href: "/dashboard/platform-settings",
      roles: EXECUTIVE_ROLES,
    },
    // SCHOOL ADMIN SPECIFIC MANAGEMENT
    {
      label: language === 'en' ? 'Manage Institution' : 'Gérer l\'Institution',
      icon: Settings2,
      href: "/dashboard/settings",
      roles: ["SCHOOL_ADMIN"],
    },
    {
      label: language === 'en' ? 'Hierarchy & Sections' : 'Hiérarchie & Sections',
      icon: Network,
      href: "/dashboard/community",
      roles: ["SCHOOL_ADMIN"],
    },
    // GENERAL DASHBOARD LINKS
    {
      label: t("chat"),
      icon: MessageCircle,
      href: "/dashboard/chat",
      roles: ["SCHOOL_ADMIN", "SUB_ADMIN", "TEACHER", "STUDENT", "PARENT", "BURSAR", "LIBRARIAN"],
    },
    {
      label: t("announcements"),
      icon: Megaphone,
      href: "/dashboard/announcements",
      roles: [...EXECUTIVE_ROLES, "SCHOOL_ADMIN", "SUB_ADMIN", "TEACHER", "STUDENT", "PARENT", "BURSAR", "LIBRARIAN"],
    },
    {
      label: t("overview"),
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["SCHOOL_ADMIN", "SUB_ADMIN", "TEACHER", "STUDENT", "PARENT", "BURSAR", "LIBRARIAN"],
    },
    {
      label: t("subscription"),
      icon: Wallet,
      href: "/dashboard/subscription",
      roles: ["SCHOOL_ADMIN", "SUB_ADMIN", "TEACHER", "STUDENT", "PARENT", "BURSAR", "LIBRARIAN"],
    },
    {
      label: t("students"),
      icon: GraduationCap,
      href: "/dashboard/students",
      roles: ["SCHOOL_ADMIN", "SUB_ADMIN", "TEACHER"],
    },
    {
      label: t("idCards"),
      icon: CreditCard,
      href: "/dashboard/id-cards",
      roles: ["SCHOOL_ADMIN", "SUB_ADMIN"],
    },
    {
      label: isBursar ? (language === 'en' ? "Pay Fee" : "Payer les Frais") : (language === 'en' ? "Fees & Finance" : "Frais & Finance"),
      icon: Coins,
      href: "/dashboard/fees",
      roles: ["BURSAR", "SCHOOL_ADMIN", "SUB_ADMIN"],
    },
    {
      label: t("staff"),
      icon: Users,
      href: "/dashboard/staff",
      roles: ["SCHOOL_ADMIN", "SUB_ADMIN"],
    },
    {
      label: t("myChildren"),
      icon: Heart,
      href: "/dashboard/children",
      roles: ["PARENT"],
    },
    {
      label: isAdmin ? (language === 'en' ? "Subjects" : "Matières") : t("courses"),
      icon: BookOpen,
      href: "/dashboard/courses",
      roles: ["SCHOOL_ADMIN", "SUB_ADMIN", "STUDENT", "TEACHER"],
    },
    {
      label: t("library"),
      icon: Library,
      href: "/dashboard/library",
      roles: ["STUDENT", "TEACHER", "LIBRARIAN", "SCHOOL_ADMIN", "SUB_ADMIN"],
    },
    {
      label: t("assignments"),
      icon: FileEdit,
      href: "/dashboard/assignments",
      roles: ["TEACHER", "STUDENT"],
    },
    {
      label: t("exams"),
      icon: PenTool,
      href: "/dashboard/exams",
      roles: ["TEACHER", "STUDENT", "SCHOOL_ADMIN", "SUB_ADMIN"],
    },
    {
      label: t("grades"),
      icon: Award,
      href: "/dashboard/grades",
      roles: ["TEACHER", "STUDENT", "SCHOOL_ADMIN", "SUB_ADMIN"],
    },
    {
      label: t("attendance"),
      icon: ClipboardCheck,
      href: "/dashboard/attendance",
      roles: ["TEACHER", "STUDENT", "SCHOOL_ADMIN", "SUB_ADMIN"],
    },
    {
      label: t("aiAssistant"),
      icon: Sparkles,
      href: "/dashboard/ai-assistant",
      roles: [...EXECUTIVE_ROLES, "SCHOOL_ADMIN", "SUB_ADMIN", "TEACHER", "STUDENT", "PARENT", "BURSAR", "LIBRARIAN"],
    },
    {
      label: language === 'en' ? 'Feedback' : 'Feedback',
      icon: Sparkles,
      href: "/dashboard/ai-feedback",
      roles: ["TEACHER"],
    },
    {
      label: t("schedule"),
      icon: Calendar,
      href: "/dashboard/schedule",
      roles: ["TEACHER"],
    },
    {
      label: t("profile"),
      icon: User,
      href: "/dashboard/profile",
      roles: [...EXECUTIVE_ROLES, "SCHOOL_ADMIN", "SUB_ADMIN", "TEACHER", "STUDENT", "PARENT", "BURSAR", "LIBRARIAN"],
    },
  ];

  const filteredRoutes = routes.filter((route) => route.roles.includes(user?.role || ""));

  return (
    <div className="flex flex-col h-full bg-primary text-white w-full border-r border-white/10">
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {!isSuperAdmin && user?.school?.logo ? (
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                <img src={user.school.logo} alt="School Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="bg-secondary p-1.5 rounded-lg shrink-0">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            )}
            <span className="text-lg font-bold tracking-tight font-headline truncate">
              {isSuperAdmin ? "EduIgnite" : (user?.school?.name || "EduIgnite")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Languages className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("fr")} className={language === "fr" ? "bg-accent" : ""}>
                  Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {onClose && (
              <Button variant="ghost" size="icon" className="text-white md:hidden" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        {filteredRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/10 group",
              pathname === route.href ? "bg-white/20 text-white" : "text-white/60"
            )}
          >
            <route.icon className={cn("w-5 h-5", pathname === route.href ? "text-secondary" : "text-white/60 group-hover:text-white")} />
            <span className="font-medium text-sm">{route.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 mt-auto bg-primary">
        <Link href="/dashboard/profile" className="flex items-center gap-3 mb-4 px-2 hover:bg-white/5 py-2 rounded-lg transition-colors group">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 border-2 border-transparent group-hover:border-white/20">
            <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate text-white">{user?.name}</span>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">{user?.role}</span>
          </div>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 gap-3"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          <span>{t("logout")}</span>
        </Button>
      </div>
    </div>
  );
}
