"use client";

import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Building2, 
  Activity, 
  MessageSquare, 
  Globe, 
  Loader2,
  ShieldCheck,
  Wallet,
  GraduationCap,
  TrendingUp
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";

const MONTHLY_REVENUE = [
  { name: 'Jan', revenue: 1200000 },
  { name: 'Feb', revenue: 1450000 },
  { name: 'Mar', revenue: 1100000 },
  { name: 'Apr', revenue: 1800000 },
  { name: 'May', revenue: 2100000 },
  { name: 'Jun', revenue: 1950000 },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { t } = useI18n();

  if (isLoading || !user) {
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
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black opacity-60 tracking-widest">Global Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-secondary">22,482</div>
              <p className="text-[9px] font-bold mt-2 uppercase flex items-center gap-1"><Users className="w-3 h-3" /> Across all instances</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Active Schools</CardTitle>
              <Building2 className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">124</div>
              <p className="text-[9px] font-bold mt-2 uppercase text-muted-foreground">Provisioned Nodes</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">System Load</CardTitle>
              <Activity className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">Normal</div>
              <p className="text-[9px] font-bold mt-2 uppercase text-green-600">High Availability Active</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Open Tickets</CardTitle>
              <MessageSquare className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">12</div>
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
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-sm h-fit">
            <CardHeader className="pb-2"><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { school: "GBHS Deido", text: "New student registry initialized." },
                { school: "Lycée de Joss", text: "Subscription renewal completed." }
              ].map((act, i) => (
                <div key={i} className="flex gap-3 items-start p-2 rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-secondary shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary">{act.school}</p>
                    <p className="text-[10px] text-muted-foreground">{act.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mt-1">Institutional Dashboard: {user.school?.name || "EduIgnite Node"}</p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <p className="text-xs font-bold text-green-700">Official Node Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Role Registry", value: user.role.replace('_', ' '), icon: ShieldCheck, color: "text-blue-600" },
          { label: "License Status", value: user.isLicensePaid ? "Active" : "Locked", icon: Wallet, color: "text-green-600" },
          { label: "Matricule", value: user.id, icon: GraduationCap, color: "text-purple-600" },
          { label: "AI Requests", value: user.aiRequestCount || 0, icon: Activity, color: "text-amber-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
              <stat.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", stat.color)} />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-primary">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl overflow-hidden rounded-[2rem]">
          <CardHeader className="bg-primary/5 p-8 border-b">
            <CardTitle className="text-primary flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Activity Insight</CardTitle>
            <CardDescription>Visual summary of institutional engagement.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE}>
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-secondary/10 flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-xl">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black text-primary uppercase tracking-tighter leading-none">Verified Identity</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Your account is secured with a unique institutional matricule. All actions are logged for integrity.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
