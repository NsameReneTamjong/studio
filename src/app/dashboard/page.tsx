
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
  Coins,
  Wallet,
  Globe,
  Activity,
  Download,
  Building2,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Loader2,
  Library,
  Book,
  ArrowUpRight
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
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

// Mock Analytic Charts (kept for visual structure, but using real data for stats)
const MONTHLY_REVENUE = [
  { name: 'Jan', revenue: 1200000 },
  { name: 'Feb', revenue: 1450000 },
  { name: 'Mar', revenue: 1100000 },
  { name: 'Apr', revenue: 1800000 },
  { name: 'May', revenue: 2100000 },
  { name: 'Jun', revenue: 1950000 },
];

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { t, language } = useI18n();
  const db = useFirestore();

  // Real Data Subscriptions for Admin
  const schoolsQuery = useMemoFirebase(() => {
    if (!db || user?.role !== "SUPER_ADMIN") return null;
    return query(collection(db, "schools"), orderBy("createdAt", "desc"), limit(5));
  }, [db, user?.role]);
  const { data: schoolsData, isLoading: isSchoolsLoading } = useCollection(schoolsQuery);

  const usersQuery = useMemoFirebase(() => {
    if (!db || user?.role !== "SUPER_ADMIN") return null;
    return collection(db, "users");
  }, [db, user?.role]);
  const { data: allUsers } = useCollection(usersQuery);

  const feedbackQuery = useMemoFirebase(() => {
    if (!db || user?.role !== "SUPER_ADMIN") return null;
    return query(collection(db, "feedback"), limit(5), orderBy("createdAt", "desc"));
  }, [db, user?.role]);
  const { data: recentFeedback } = useCollection(feedbackQuery);

  if (isAuthLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Identity...</p>
      </div>
    );
  }

  const isSuperAdmin = user.role === "SUPER_ADMIN";

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
            <p className="text-muted-foreground mt-1">Live data metrics from the SaaS institutional network.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black opacity-60 tracking-widest leading-none">Global Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-secondary">{allUsers?.length || 0}</div>
              <p className="text-[9px] font-bold mt-2 uppercase flex items-center gap-1">
                <Users className="w-3 h-3" /> Across all instances
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">Active Schools</CardTitle>
              <Building2 className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">{schoolsData?.length || 0}</div>
              <p className="text-[9px] font-bold mt-2 uppercase text-muted-foreground">Provisioned Nodes</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">System Load</CardTitle>
              <Activity className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">Normal</div>
              <p className="text-[9px] font-bold mt-2 uppercase text-green-600">High Availability Active</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">Open Tickets</CardTitle>
              <MessageSquare className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">{recentFeedback?.filter(f => f.status === 'New').length || 0}</div>
              <p className="text-[9px] font-bold mt-2 uppercase text-muted-foreground">Admin Feedback</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-accent/10">
              <CardTitle className="text-lg">Revenue Projection</CardTitle>
              <CardDescription>SaaS service fee trends across the network.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_REVENUE}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-sm h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentFeedback?.map(fb => (
                <div key={fb.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-secondary shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary">{fb.schoolName}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{fb.message}</p>
                  </div>
                </div>
              ))}
              {(!recentFeedback || recentFeedback.length === 0) && <p className="text-xs text-muted-foreground italic text-center py-10">No recent activity logs.</p>}
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-white border-b p-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Institutional Nodes
              </CardTitle>
              <CardDescription>Live health status of school instances.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/schools" className="gap-2">Manage All <ChevronRight className="w-4 h-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                  <TableHead className="pl-8 py-4">School Profile</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead className="text-center">Matricule</TableHead>
                  <TableHead className="text-right pr-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolsData?.map((school) => (
                  <TableRow key={school.id} className="hover:bg-accent/5">
                    <TableCell className="pl-8 py-4 font-bold text-sm text-primary">{school.name}</TableCell>
                    <TableCell className="text-xs">{school.principal}</TableCell>
                    <TableCell className="text-center font-mono font-black text-xs">{school.id}</TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn("text-[9px] uppercase font-black", school.status === 'Active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                        {school.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- ROLE-SPECIFIC STATS (PLACEHOLDER FOR NOW) ---
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Welcome, {user.name}</h1>
        <p className="text-muted-foreground mt-1">Institutional Dashboard: {user.school?.name || "Initializing..."}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Role Registry", value: user.role, icon: ShieldCheck, color: "text-blue-600" },
          { label: "License Status", value: user.isLicensePaid ? "Active" : "Locked", icon: Wallet, color: "text-green-600" },
          { label: "Matricule", value: user.id, icon: GraduationCap, color: "text-purple-600" },
          { label: "AI Requests", value: user.aiRequestCount || 0, icon: Activity, color: "text-amber-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
