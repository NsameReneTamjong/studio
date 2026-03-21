
"use client";

import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  AlertCircle, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Award,
  Heart,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AwardIcon({ className }: { className?: string }) {
  return <Award className={className} />;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();

  // Statistics tailored by role
  const stats = user?.role === "SUPER_ADMIN" ? [
    { label: language === "en" ? "Active Schools" : "Écoles Actives", value: "24", icon: Users, color: "text-blue-600" },
    { label: language === "en" ? "Total Users" : "Total Utilisateurs", value: "15.4k", icon: GraduationCap, color: "text-purple-600" },
    { label: language === "en" ? "System Health" : "Santé Système", value: "99.9%", icon: TrendingUp, color: "text-green-600" },
    { label: language === "en" ? "Pending Support" : "Support en Attente", value: "12", icon: AlertCircle, color: "text-amber-600" },
  ] : user?.role === "SCHOOL_ADMIN" ? [
    { label: language === "en" ? "Total Students" : "Total Élèves", value: "1,284", icon: GraduationCap, color: "text-blue-600" },
    { label: language === "en" ? "Faculty Members" : "Membres du personnel", value: "86", icon: Users, color: "text-purple-600" },
    { label: language === "en" ? "Active Courses" : "Cours Actifs", value: "42", icon: BookOpen, color: "text-green-600" },
    { label: language === "en" ? "Attendance Rate" : "Taux de Présence", value: "94.2%", icon: TrendingUp, color: "text-amber-600" },
  ] : user?.role === "TEACHER" ? [
    { label: language === "en" ? "Assigned Students" : "Élèves Assignés", value: "124", icon: GraduationCap, color: "text-blue-600" },
    { label: language === "en" ? "Current Classes" : "Classes Actuelles", value: "5", icon: BookOpen, color: "text-purple-600" },
    { label: language === "en" ? "Pending Grades" : "Notes en Attente", value: "18", icon: AlertCircle, color: "text-red-600" },
    { label: language === "en" ? "Avg. Attendance" : "Présence Moyenne", value: "96%", icon: TrendingUp, color: "text-green-600" },
  ] : user?.role === "PARENT" ? [
    { label: language === "en" ? "Children Registered" : "Enfants Inscrits", value: "2", icon: Heart, color: "text-red-600" },
    { label: language === "en" ? "Avg. Performance" : "Performance Moyenne", value: "16.8/20", icon: AwardIcon, color: "text-amber-600" },
    { label: language === "en" ? "School Notices" : "Avis Scolaires", value: "3", icon: AlertCircle, color: "text-blue-600" },
    { label: language === "en" ? "Next Event" : "Prochain Événement", value: "PTA Meeting", icon: CalendarIcon, color: "text-purple-600" },
  ] : [
    // STUDENT
    { label: "Overall GPA / Moyenne", value: "14.50", icon: AwardIcon, color: "text-amber-600" },
    { label: language === "en" ? "Courses Enrolled" : "Cours Inscrits", value: "6", icon: BookOpen, color: "text-blue-600" },
    { label: language === "en" ? "Attendance" : "Présence", value: "98%", icon: TrendingUp, color: "text-green-600" },
    { label: language === "en" ? "Upcoming Tasks" : "Tâches à Venir", value: "4", icon: CalendarIcon, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">{t("welcome")}, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === "PARENT" 
            ? (language === "en" ? "Monitor your children's academic journey here." : "Suivez le parcours académique de vos enfants ici.")
            : (language === "en" ? "Here's what's happening in EduIgnite today." : "Voici ce qui se passe dans EduIgnite aujourd'hui.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>
              {user?.role === "PARENT" 
                ? (language === "en" ? "Children Summary" : "Résumé des Enfants")
                : (language === "en" ? "Upcoming Schedule" : "Emploi du Temps à Venir")}
            </CardTitle>
            <CardDescription>
              {user?.role === "PARENT"
                ? (language === "en" ? "Quick view of your children's status." : "Vue rapide du statut de vos enfants.")
                : (language === "en" ? "Your classes for the next 24 hours" : "Vos cours pour les prochaines 24 heures")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user?.role === "PARENT" ? (
                // PARENT VIEW: List of children
                [
                  { name: "Alice Thompson", grade: "10th", average: "15.4", status: "In Class" },
                  { name: "Diana Prince", grade: "10th", average: "18.2", status: "In Class" },
                ].map((child, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-accent/30 border border-accent hover:bg-accent/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {child.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary">{child.name}</h4>
                      <p className="text-xs text-muted-foreground">{child.grade} Grade • Avg: {child.average}/20</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/children/view?id=${idx === 0 ? 'S001' : 'S004'}`}>
                        {language === "en" ? "View Full Report" : "Voir le Bulletin"}
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                // OTHER ROLES: Upcoming schedule
                [
                  { time: "09:00 AM", subject: language === "en" ? "Advanced Mathematics" : "Mathématiques Avancées", room: "Room 402", teacher: "Dr. Aris" },
                  { time: "11:30 AM", subject: language === "en" ? "English Literature" : "Littérature Anglaise", room: "Room 201", teacher: "Ms. Bennet" },
                  { time: "02:00 PM", subject: language === "en" ? "Physics Lab" : "Laboratoire de Physique", room: "Lab C", teacher: "Mr. Tesla" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 border border-accent">
                    <div className="bg-white px-3 py-1 rounded text-sm font-bold text-primary shadow-sm">{item.time}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary">{item.subject}</h4>
                      <p className="text-xs text-muted-foreground">{item.room} • {item.teacher}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      {language === "en" ? "Details" : "Détails"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>{language === "en" ? "Recent Notifications" : "Notifications Récentes"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: language === "en" ? "New Assignment" : "Nouveau Devoir", time: "2h ago", type: "academic" },
                { title: language === "en" ? "Attendance Updated" : "Présence Mise à Jour", time: "4h ago", type: "system" },
                { title: language === "en" ? "Campus News" : "Actualités du Campus", time: "Yesterday", type: "info" },
              ].map((notif, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${notif.type === 'academic' ? 'bg-blue-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
