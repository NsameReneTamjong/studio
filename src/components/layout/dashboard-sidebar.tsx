
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Award,
  Settings,
  LogOut,
  Building2,
  Sparkles,
  Heart,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const routes = [
    {
      label: "Platform Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Schools",
      icon: Globe,
      href: "/dashboard/schools",
      roles: ["SUPER_ADMIN"],
    },
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"],
    },
    {
      label: "Students",
      icon: GraduationCap,
      href: "/dashboard/students",
      roles: ["SCHOOL_ADMIN", "TEACHER"],
    },
    {
      label: "Staff Directory",
      icon: Users,
      href: "/dashboard/staff",
      roles: ["SCHOOL_ADMIN"],
    },
    {
      label: "My Children",
      icon: Heart,
      href: "/dashboard/children",
      roles: ["PARENT"],
    },
    {
      label: "Courses",
      icon: BookOpen,
      href: "/dashboard/courses",
      roles: ["SCHOOL_ADMIN", "STUDENT", "TEACHER"],
    },
    {
      label: "Grade Book",
      icon: Award,
      href: "/dashboard/grades",
      roles: ["TEACHER", "STUDENT", "PARENT"],
    },
    {
      label: "Attendance",
      icon: ClipboardCheck,
      href: "/dashboard/attendance",
      roles: ["TEACHER", "STUDENT", "PARENT"],
    },
    {
      label: "AI Feedback",
      icon: Sparkles,
      href: "/dashboard/ai-feedback",
      roles: ["TEACHER"],
    },
    {
      label: "Schedule",
      icon: Calendar,
      href: "/dashboard/schedule",
      roles: ["TEACHER", "STUDENT", "PARENT"],
    },
  ];

  const filteredRoutes = routes.filter((route) => route.roles.includes(user?.role || ""));

  return (
    <div className="flex flex-col h-full bg-primary text-white w-64 border-r border-white/10">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-secondary p-1.5 rounded-lg">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight font-headline">EduNexus</span>
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
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
