
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
  BarChart3
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

  // Mock data for Bursar Charts
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
  ] : user?.role === "BURSAR" ? [
    { label: language === "en" ? "Total Revenue" : "Revenu Total", value: "4.2M XAF", icon: Coins, color: "text-green-600" },
    { label: language === "en" ? "Students Paid" : "Élèves en Règle", value: "842", icon: Users, color: "text-blue-600" },
    { label: language === "en" ? "Debt Outstanding" : "Dettes en Attente", value: "1.8M XAF", icon: TrendingUp, color: "text-red-600" },
    { label: language === "en" ? "Today's Intake" : "Recette du Jour", value: "125k XAF", icon: Wallet, color: "text-amber-600" },
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
          {user?.role === "BURSAR" 
            ? (language === "en" ? "Manage institutional financial health and fee tracking." : "Gérez la santé financière et le suivi des frais.")
            : user?.role === "PARENT" 
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
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>
              {user?.role === "BURSAR" 
                ? (language === "en" ? "Revenue Distribution" : "Répartition des Revenus")
                : user?.role === "PARENT" 
                ? (language === "en" ? "Children Summary" : "Résumé des Enfants")
                : (language === "en" ? "Upcoming Schedule" : "Emploi du Temps à Venir")}
            </CardTitle>
            <CardDescription>
              {user?.role === "BURSAR"
                ? (language === "en" ? "Revenue breakdown by institutional cost centers" : "Répartition par centres de coûts")
                : user?.role === "PARENT"
                ? (language === "en" ? "Quick view of your children's status." : "Vue rapide du statut de vos enfants.")
                : (language === "en" ? "Your classes for the next 24 hours" : "Vos cours pour les prochaines 24 heures")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {user?.role === "BURSAR" ? (
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
            ) : user?.role === "PARENT" ? (
              <div className="space-y-4">
                {[
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
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { time: "09:00 AM", subject: language === "en" ? "Advanced Mathematics" : "Mathématiques Avancées", room: "Room 402", teacher: "Dr. Aris" },
                  { time: "11:30 AM", subject: language === "en" ? "English Literature" : "Littérature Anglaise", room: "Room 201", teacher: "Ms. Bennet" },
                  { time: "02:00 PM", subject: language === "en" ? "Physics Lab" : "Laboratoire de Physique", room: "Lab C", teacher: "Mr. Tesla" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-accent/30 border border-accent hover:bg-accent/50 transition-all group">
                    <div className="bg-white px-4 py-2 rounded-lg flex flex-col items-center justify-center shadow-sm border border-primary/10 shrink-0">
                      <Clock className="w-3 h-3 text-primary mb-1" />
                      <span className="text-xs font-bold text-primary">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary group-hover:text-primary/80 transition-colors">{item.subject}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.room}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" /> {item.teacher}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs gap-1 text-primary hover:bg-primary hover:text-white" asChild>
                      <Link href="/dashboard/schedule">
                        {language === "en" ? "Details" : "Détails"} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>
              {user?.role === "BURSAR" 
                ? (language === "en" ? "Payment Status" : "Statut des Paiements")
                : (language === "en" ? "Recent Notifications" : "Notifications Récentes")}
            </CardTitle>
          </CardHeader>
          <CardContent className={user?.role === "BURSAR" ? "h-[300px]" : ""}>
            {user?.role === "BURSAR" ? (
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
                  { title: language === "en" ? "New Assignment" : "Nouveau Devoir", time: "2h ago", type: "academic", href: "/dashboard/assignments" },
                  { title: language === "en" ? "Attendance Updated" : "Présence Mise à Jour", time: "4h ago", type: "system", href: "/dashboard/attendance" },
                  { title: language === "en" ? "Campus News" : "Actualités du Campus", time: "Yesterday", type: "info", href: "/dashboard/announcements" },
                ].map((notif, idx) => (
                  <Link key={idx} href={notif.href} className="flex gap-3 items-start group p-2 rounded-lg hover:bg-accent/30 transition-colors">
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'academic' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{notif.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{notif.time}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors mt-1" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
