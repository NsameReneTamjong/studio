
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
  ShieldCheck,
  Building2,
  Globe,
  Activity,
  ArrowRight,
  Download,
  Filter,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Legend,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- MOCK DATA FOR SUPER ADMIN PLATFORM REVIEW ---

const WEEKLY_REVENUE = [
  { name: 'Mon', revenue: 45000 },
  { name: 'Tue', revenue: 52000 },
  { name: 'Wed', revenue: 48000 },
  { name: 'Thu', revenue: 61000 },
  { name: 'Fri', revenue: 55000 },
  { name: 'Sat', revenue: 32000 },
  { name: 'Sun', revenue: 28000 },
];

const MONTHLY_REVENUE = [
  { name: 'Jan', revenue: 1200000 },
  { name: 'Feb', revenue: 1450000 },
  { name: 'Mar', revenue: 1100000 },
  { name: 'Apr', revenue: 1800000 },
  { name: 'May', revenue: 2100000 },
  { name: 'Jun', revenue: 1950000 },
];

const YEARLY_REVENUE = [
  { name: '2020', revenue: 8500000 },
  { name: '2021', revenue: 12400000 },
  { name: '2022', revenue: 18200000 },
  { name: '2023', revenue: 24500000 },
  { name: '2024', revenue: 31000000 },
];

const USER_DEMOGRAPHICS = [
  { role: 'Students', count: 12450, fill: '#264D73' },
  { role: 'Teachers', count: 1200, fill: '#67D0E4' },
  { role: 'Parents', count: 8500, fill: '#F59E0B' },
  { role: 'Staff', count: 450, fill: '#10B981' },
];

const SCHOOL_STATUS = [
  { name: 'Active', value: 18, color: '#10B981' },
  { name: 'Trial', value: 4, color: '#67D0E4' },
  { name: 'Suspended', value: 2, color: '#EF4444' },
];

const TOP_SCHOOLS = [
  { id: "S001", name: "Lycée de Joss", domain: "joss.cm", users: 1200, revenue: "2.4M", status: "Active" },
  { id: "S002", name: "GBHS Yaoundé", domain: "gbhs.yaounde.edu", users: 2850, revenue: "4.8M", status: "Active" },
  { id: "S003", name: "BUEA University", domain: "ubuea.cm", users: 4500, revenue: "8.2M", status: "Active" },
  { id: "S004", name: "Lycée de Maroua", domain: "maroua.edu", users: 900, revenue: "1.2M", status: "Suspended" },
];

// --- MOCK DATA FOR PARENT DASHBOARD ---
const CHILDREN_PERFORMANCE = [
  { name: 'Alice Thompson', average: 15.4, attendance: 98, fill: 'hsl(var(--primary))' },
  { name: 'Diana Prince', average: 18.2, attendance: 100, fill: 'hsl(var(--secondary))' },
];

const CHILDREN_TABLE_DATA = [
  { id: "S001", name: "Alice Thompson", class: "Form 5 / 2nde", average: "15.40", attendance: "98%", status: "Excellent", avatar: "https://picsum.photos/seed/alice/100/100" },
  { id: "S004", name: "Diana Prince", class: "Form 5 / 2nde", average: "18.20", attendance: "100%", status: "Superior", avatar: "https://picsum.photos/seed/diana/100/100" },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { t, language } = useI18n();
  const [timeframe, setTimeframe] = useState("monthly");

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Preparing Workspace...</p>
      </div>
    );
  }

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isParent = user?.role === "PARENT";

  const getRevenueData = () => {
    switch (timeframe) {
      case 'weekly': return WEEKLY_REVENUE;
      case 'yearly': return YEARLY_REVENUE;
      default: return MONTHLY_REVENUE;
    }
  };

  // --- SUPER ADMIN VIEW ---
  if (isSuperAdmin) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              Platform Review
            </h1>
            <p className="text-muted-foreground mt-1">
              Analyzing global institutional growth, SaaS revenue, and user engagement.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={timeframe} onValueChange={setTimeframe} className="bg-white p-1 rounded-xl border shadow-sm h-auto">
              <TabsList className="h-9">
                <TabsTrigger value="weekly" className="text-[10px] uppercase font-black px-4">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-[10px] uppercase font-black px-4">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="text-[10px] uppercase font-black px-4">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl shadow-sm">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Global Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black opacity-60 tracking-widest leading-none">Total SaaS Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-secondary">31.4M <span className="text-xs font-medium opacity-40">XAF</span></div>
              <p className="text-[9px] font-bold mt-2 uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" /> +12.5% from last period
              </p>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
              <Coins className="w-24 h-24" />
            </div>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">Global Users</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">22,650</div>
              <p className="text-[9px] font-bold mt-2 uppercase text-muted-foreground">Active Across all nodes</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">System Integrity</CardTitle>
              <Activity className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">99.9%</div>
              <p className="text-[9px] font-bold mt-2 uppercase text-green-600">High Availability Active</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">Active Schools</CardTitle>
              <Building2 className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">24</div>
              <p className="text-[9px] font-bold mt-2 uppercase text-muted-foreground">Institutional Instances</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Analytics Chart */}
          <Card className="lg:col-span-8 border-none shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-accent/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Revenue Analytics</CardTitle>
                  <CardDescription>SaaS subscription and service fee trends.</CardDescription>
                </div>
                <div className="bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">Live Ledger</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getRevenueData()}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis hide />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${value.toLocaleString()} XAF`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Demographics & Status */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-sm h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">User Demographics</CardTitle>
                <CardDescription>Distribution across roles.</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={USER_DEMOGRAPHICS} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="role" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} width={70} />
                    <RechartsTooltip />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Institutional Health</CardTitle>
                <CardDescription>Subscription status status distribution.</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SCHOOL_STATUS}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {SCHOOL_STATUS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Performing Schools Table */}
        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-white border-b p-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Institutional Revenue Ledger
              </CardTitle>
              <CardDescription>Detailed revenue contribution and user density per node.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/schools" className="gap-2">Manage All Schools <ChevronRight className="w-4 h-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                  <TableHead className="pl-8 py-4">School Profile</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-center">Active Users</TableHead>
                  <TableHead className="text-center">SaaS Status</TableHead>
                  <TableHead className="text-right pr-8">Period Revenue (XAF)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_SCHOOLS.map((school) => (
                  <TableRow key={school.id} className="hover:bg-accent/5">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/5 rounded-lg border">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-sm text-primary">{school.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{school.domain}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="ghost" className="text-xs font-black">{school.users.toLocaleString()}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase border-none px-3",
                        school.status === 'Active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {school.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 font-black text-primary">
                      {school.revenue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/20 p-4 border-t flex justify-end">
             <p className="text-[10px] uppercase font-black opacity-30 italic">EduIgnite Platform Governance Suite • Secure Infrastructure</p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- INSTITUTIONAL ROLE VIEW ---
  
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

  const stats = user?.role === "SCHOOL_ADMIN" ? [
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
    { label: language === "en" ? "Avg. Performance" : "Performance Moyenne", value: "16.8/20", icon: Award, color: "text-amber-600" },
    { label: language === "en" ? "School Notices" : "Avis Scolaires", value: "3", icon: AlertCircle, color: "text-blue-600" },
    { label: language === "en" ? "Next Event" : "Prochain Événement", value: "PTA Meeting", icon: CalendarIcon, color: "text-purple-600" },
  ] : [
    { label: "Overall GPA / Moyenne", value: "14.50", icon: Award, color: "text-amber-600" },
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
              : user?.role === "PARENT"
              ? (language === "en" ? "Monitor your children's academic progress and institutional standing." : "Surveillez les progrès académiques et le statut institutionnel de vos enfants.")
              : (language === "en" ? "Here's what's happening in EduIgnite today." : "Voici ce qui se passe dans EduIgnite aujourd'hui.")}
          </p>
        </div>
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
              {user?.role === "SCHOOL_ADMIN" 
                ? (language === "en" ? "Revenue & Resource Analytics" : "Analyses des Revenus et Ressources")
                : user?.role === "BURSAR" 
                ? (language === "en" ? "Revenue Distribution" : "Répartition des Revenus")
                : user?.role === "PARENT"
                ? (language === "en" ? "Children Performance Comparison" : "Comparaison des Performances des Enfants")
                : (language === "en" ? "Upcoming Schedule" : "Emploi du Temps à Venir")}
            </CardTitle>
            <CardDescription>
              {isParent ? (language === 'en' ? "Visual overview of academic averages across siblings." : "Aperçu visuel des moyennes académiques entre frères et sœurs.") : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
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
            ) : isParent ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHILDREN_PERFORMANCE}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis domain={[0, 20]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${value.toFixed(2)} / 20`, 'Average']}
                  />
                  <Bar dataKey="average" radius={[8, 8, 0, 0]} barSize={60} />
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

      {isParent && (
        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-white border-b p-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Children's Academic Standing
              </CardTitle>
              <CardDescription>Consolidated status of term averages and institutional compliance.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/children" className="gap-2">View Full Dossiers <ChevronRight className="w-4 h-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                  <TableHead className="pl-8 py-4">Student Profile</TableHead>
                  <TableHead>Academic Level</TableHead>
                  <TableHead className="text-center">Term Average</TableHead>
                  <TableHead className="text-center">Attendance</TableHead>
                  <TableHead className="text-right pr-8">Performance Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CHILDREN_TABLE_DATA.map((child) => (
                  <TableRow key={child.id} className="hover:bg-accent/5">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={child.avatar} alt={child.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">{child.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary leading-none mb-1">{child.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{child.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold border-primary/10 text-primary">{child.class}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-black text-primary text-lg">{child.average}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-muted-foreground">{child.attendance}</span>
                        <div className="w-12 h-1 bg-accent rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: child.attendance }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase border-none px-3",
                        child.status === 'Superior' ? "bg-primary text-white" : "bg-green-100 text-green-700"
                      )}>
                        {child.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/20 p-4 border-t flex justify-between items-center">
             <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-[10px] uppercase font-black opacity-30 italic">All results are validated by the principal's office.</p>
             </div>
             <Link href="/dashboard/chat">
               <Button variant="link" size="sm" className="text-[10px] uppercase font-black gap-2">
                 <MessageSquare className="w-3 h-3" /> Contact Teachers
               </Button>
             </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
