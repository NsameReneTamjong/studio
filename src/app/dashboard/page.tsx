
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
  ChevronRight,
  Clock,
  MapPin,
  Coins,
  Wallet,
  PieChart as PieChartIcon,
  BarChart3,
  CalendarDays,
  Library,
  Book,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";

function AwardIcon({ className }: { className?: string }) {
  return <Award className={className} />;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();

  // Mock data for Bursar/Admin Finance Charts
  const paymentStatusData = [
    { name: 'Paid in Full', value: 450, color: '#10b981' },
    { name: 'Partial', value: 300, color: '#f59e0b' },
    { name: 'Not Paid', value: 150, color: '#ef4444' },
  ];

  const revenueByCategory = [
    { name: 'Tuition', amount: 2500000 },
    { name: 'Uniforms', amount: 850000 },
    { name: 'Transport', amount: 450000 },
    { name: 'Exams', amount: 300000 },
  ];

  // Mock data for Librarian/Admin Library Charts
  const circulationData = [
    { name: 'Available', value: 1200, color: '#10b981' },
    { name: 'Borrowed', value: 450, color: '#264D73' },
    { name: 'Overdue', value: 85, color: '#ef4444' },
  ];

  const bookCategoryPopularity = [
    { name: 'Science', loans: 320 },
    { name: 'Literature', loans: 280 },
    { name: 'Math', loans: 150 },
    { name: 'Tech', loans: 120 },
    { name: 'Arts', loans: 90 },
  ];

  // Statistics tailored by role
  const stats = user?.role === "SUPER_ADMIN" ? [
    { label: language === "en" ? "Active Schools" : "Écoles Actives", value: "24", icon: Users, color: "text-blue-600" },
    { label: language === "en" ? "Total Users" : "Total Utilisateurs", value: "15.4k", icon: GraduationCap, color: "text-purple-600" },
    { label: language === "en" ? "System Health" : "Santé Système", value: "99.9%", icon: TrendingUp, color: "text-green-600" },
    { label: language === "en" ? "Pending Support" : "Support en Attente", value: "12", icon: AlertCircle, color: "text-amber-600" },
  ] : user?.role === "SCHOOL_ADMIN" ? [
    { label: language === "en" ? "Total Revenue" : "Revenu Total", value: "4.2M XAF", icon: Coins, color: "text-green-600" },
    { label: language === "en" ? "Library Loans" : "Emprunts Bibliothèque", value: "450", icon: Book, color: "text-blue-600" },
    { label: language === "en" ? "Active Students" : "Élèves Actifs", value: "1,284", icon: GraduationCap, color: "text-purple-600" },
    { label: language === "en" ? "Attendance Rate" : "Taux de Présence", value: "94.2%", icon: TrendingUp, color: "text-amber-600" },
  ] : user?.role === "TEACHER" ? [
    { label: language === "en" ? "Assigned Students" : "Élèves Assignés", value: "124", icon: GraduationCap, color: "text-blue-600" },
    { label: language === "en" ? "Current Classes" : "Classes Actuelles", value: "5", icon: BookOpen, color: "text-purple-600" },
    { label: language === "en" ? "Pending Grades" : "Notes en Attente", value: "18", icon: AlertCircle, color: "text-red-600" },
    { label: language === "en" ? "Avg. Attendance" : "Présence Moyenne", value: "96%", icon: TrendingUp, color: "text-green-600" },
  ] : user?.role === "BURSAR" ? [
    { label: language === "en" ? "Total Revenue" : "Revenu Total", value: "4.2M XAF", icon: Coins, color: "text-green-600" },
    { label: language === "en" ? "Students Paid" : "Élèves en Règle", value: "842", icon: Users, color: "text-blue-600" },
    { label: language === "en" ? "Debt Outstanding" : "Dettes en Attente", value: "1.8M XAF", icon: TrendingUp, color: "text-red-600" },
    { label: language === "en" ? "Today's Intake" : "Recette du Jour", value: "125k XAF", icon: Wallet, color: "text-amber-600" },
  ] : user?.role === "LIBRARIAN" ? [
    { label: language === "en" ? "Total Books" : "Total Livres", value: "1,735", icon: Library, color: "text-blue-600" },
    { label: language === "en" ? "Active Loans" : "Emprunts Actifs", value: "450", icon: Book, color: "text-purple-600" },
    { label: language === "en" ? "Overdue Items" : "Retards", value: "85", icon: Clock, color: "text-red-600" },
    { label: language === "en" ? "Active Members" : "Membres Actifs", value: "1,120", icon: Users, color: "text-green-600" },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">{t("welcome")}, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "SCHOOL_ADMIN" 
              ? (language === "en" ? "Institutional Oversight: Monitor financial, library, and academic health." : "Supervision Institutionnelle : Surveillez la santé financière, bibliothécaire et académique.")
              : user?.role === "BURSAR" 
              ? (language === "en" ? "Manage institutional financial health and fee tracking." : "Gérez la santé financière et le suivi des frais.")
              : (language === "en" ? "Here's what's happening in EduIgnite today." : "Voici ce qui se passe dans EduIgnite aujourd'hui.")}
          </p>
        </div>
      </div>

      {/* Global Fee Deadline Banner - Visible to all institutional roles except Super Admin */}
      {(user?.role !== "SUPER_ADMIN") && (
        <Card className="border-none bg-primary text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CalendarDays className="w-32 h-32" />
          </div>
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-secondary p-3 rounded-2xl shadow-xl">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase tracking-tighter">Institutional Fee Deadline</h3>
                <p className="text-sm opacity-80 font-medium">Final term payments must be settled by June 30, 2024.</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
              <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status</p>
                <p className="text-lg font-bold text-secondary">Action Required</p>
              </div>
              <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">Payment required for enrollment validation</p>
            </div>
          </CardContent>
        </Card>
      )}

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
        {/* Main Observation Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>
              {user?.role === "SCHOOL_ADMIN" 
                ? (language === "en" ? "Revenue & Resource Analytics" : "Analyses des Revenus et Ressources")
                : user?.role === "BURSAR" 
                ? (language === "en" ? "Revenue Distribution" : "Répartition des Revenus")
                : (language === "en" ? "Upcoming Schedule" : "Emploi du Temps à Venir")}
            </CardTitle>
            <CardDescription>
              {user?.role === "SCHOOL_ADMIN"
                ? (language === "en" ? "Comparison of institutional revenue and library activity." : "Comparaison des revenus et de l'activité bibliothèque.")
                : (language === "en" ? "Your institutional metrics at a glance." : "Vos mesures institutionnelles en un coup d'œil.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {(user?.role === "BURSAR" || user?.role === "SCHOOL_ADMIN") ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${value.toLocaleString()} XAF`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : user?.role === "LIBRARIAN" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookCategoryPopularity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="loans" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="space-y-4">
                {[
                  { time: "09:00 AM", subject: language === "en" ? "Advanced Mathematics" : "Mathématiques Avancées", room: "Room 402", teacher: "Dr. Aris" },
                  { time: "11:30 AM", subject: language === "en" ? "English Literature" : "Littérature Anglaise", room: "Room 201", teacher: "Ms. Bennet" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-accent/30 border border-accent">
                    <div className="bg-white px-4 py-2 rounded-lg flex flex-col items-center justify-center shadow-sm">
                      <Clock className="w-3 h-3 text-primary mb-1" />
                      <span className="text-xs font-bold text-primary">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary">{item.subject}</h4>
                      <p className="text-[10px] text-muted-foreground">{item.room} • {item.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Secondary Observation Chart */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>
              {user?.role === "SCHOOL_ADMIN"
                ? (language === "en" ? "Circulation Overview" : "Aperçu de la Circulation")
                : user?.role === "BURSAR" 
                ? (language === "en" ? "Payment Status" : "Statut des Paiements")
                : (language === "en" ? "Notifications" : "Notifications")}
            </CardTitle>
          </CardHeader>
          <CardContent className={(user?.role === "BURSAR" || user?.role === "LIBRARIAN" || user?.role === "SCHOOL_ADMIN") ? "h-[300px]" : ""}>
            {(user?.role === "BURSAR" || user?.role === "SCHOOL_ADMIN") ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="space-y-4">
                {[
                  { title: "Fee Deadline Published", time: "Just now", type: "system" },
                  { title: "Library Report Generated", time: "2h ago", type: "info" },
                ].map((notif, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-2 rounded-lg hover:bg-accent/30 transition-colors">
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'system' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
