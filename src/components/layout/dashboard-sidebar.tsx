
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
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
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();

  const routes = [
    {
      label: t("platformOverview"),
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["SUPER_ADMIN"],
    },
    {
      label: t("schools"),
      icon: Globe,
      href: "/dashboard/schools",
      roles: ["SUPER_ADMIN"],
    },
    {
      label: t("overview"),
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      label: t("students"),
      icon: GraduationCap,
      href: "/dashboard/students",
      roles: ["SCHOOL_ADMIN", "TEACHER"],
    },
    {
      label: t("staff"),
      icon: Users,
      href: "/dashboard/staff",
      roles: ["SCHOOL_ADMIN"],
    },
    {
      label: t("myChildren"),
      icon: Heart,
      href: "/dashboard/children",
      roles: ["PARENT"],
    },
    {
      label: t("courses"),
      icon: BookOpen,
      href: "/dashboard/courses",
      roles: ["SCHOOL_ADMIN", "STUDENT", "TEACHER"],
    },
    {
      label: t("grades"),
      icon: Award,
      href: "/dashboard/grades",
      roles: ["TEACHER", "STUDENT"], // Parents view grades through the Child View
    },
    {
      label: t("attendance"),
      icon: ClipboardCheck,
      href: "/dashboard/attendance",
      roles: ["TEACHER", "STUDENT"], // Parents view attendance through the Child View
    },
    {
      label: t("aiFeedback"),
      icon: Sparkles,
      href: "/dashboard/ai-feedback",
      roles: ["TEACHER"],
    },
    {
      label: t("schedule"),
      icon: Calendar,
      href: "/dashboard/schedule",
      roles: ["TEACHER", "STUDENT"], // Parents view schedule through the Child View
    },
  ];

  const filteredRoutes = routes.filter((route) => route.roles.includes(user?.role || ""));

  return (
    <div className="flex flex-col h-full bg-primary text-white w-64 border-r border-white/10">
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-1.5 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight font-headline">EduNexus</span>
          </div>
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
        </div>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {filteredRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
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

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
            <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">{user?.name}</span>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">{user?.role}</span>
          </div>
        </div>
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
