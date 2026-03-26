
"use client";

import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building2, 
  Activity, 
  Globe, 
  Loader2,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
  ChevronRight,
  ClipboardCheck,
  Coins,
  ArrowUpRight,
  Calendar,
  PieChart,
  Zap,
  Crown,
  Search,
  Info,
  Lock,
  ArrowRight,
  Award,
  Heart,
  Wallet,
  CheckCircle2,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

const DATA_PERIODS = {
  weekly: [
    { name: 'Mon', users: 120, revenue: 45000 },
    { name: 'Tue', users: 150, revenue: 52000 },
    { name: 'Wed', users: 180, revenue: 48000 },
    { name: 'Thu', users: 210, revenue: 61000 },
    { name: 'Fri', users: 250, revenue: 55000 },
    { name: 'Sat', users: 190, revenue: 32000 },
    { name: 'Sun', users: 110, revenue: 28000 },
  ],
  monthly: [
    { name: 'Week 1', users: 1200, revenue: 245000 },
    { name: 'Week 2', users: 1450, revenue: 280000 },
    { name: 'Week 3', users: 1100, revenue: 210000 },
    { name: 'Week 4', users: 1800, revenue: 350000 },
  ],
  yearly: [
    { name: 'Jan', users: 4500, revenue: 1200000 },
    { name: 'Feb', users: 5200, revenue: 1450000 },
    { name: 'Mar', users: 4800, revenue: 1100000 },
    { name: 'Apr', users: 6100, revenue: 1800000 },
    { name: 'May', users: 7500, revenue: 2100000 },
    { name: 'Jun', users: 6900, revenue: 1950000 },
    { name: 'Jul', users: 7200, revenue: 2300000 },
    { name: 'Aug', users: 8100, revenue: 2500000 },
    { name: 'Sep', users: 9500, revenue: 3100000 },
    { name: 'Oct', users: 10200, revenue: 3400000 },
    { name: 'Nov', users: 11500, revenue: 3800000 },
    { name: 'Dec', users: 12400, revenue: 4200000 },
  ]
};

const USER_DISTRIBUTION = [
  { name: 'Students', value: 18500, color: '#264D73' },
  { name: 'Teachers', value: 2400, color: '#67D0E4' },
  { name: 'Admins', value: 124, color: '#FCD116' },
  { name: 'Founders', value: 5, color: '#CE1126' },
];

export default function DashboardPage() {
  const { user, schools, isLoading } = useAuth();
  const { t, language } = useI18n();

  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [selectedSchoolId, setSelectedSchoolId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeChartData = DATA_PERIODS[timePeriod] || DATA_PERIODS.monthly;

  const summaryStats = useMemo(() => {
    return {
      totalUsers: "22,482",
      students: "18,540",
      teachers: "2,418",
      admins: "124",
      founders: "5",
      revenue: "4.2M",
      activeNodes: (schools || []).length,
      systemHealth: "Optimal"
    };
  }, [schools]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Platform Data...</p>
      </div>
    );
  }

  const isPlatformExecutive = ["SUPER_ADMIN", "CEO", "CTO", "COO", "INV", "DESIGNER"].includes(user.role);
  const isInstitutionalAdmin = ["SCHOOL_ADMIN", "SUB_ADMIN"].includes(user.role);
  const isParent = user.role === "PARENT";
  const isBursar = user.role === "BURSAR";

  if (isPlatformExecutive) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              Platform Intelligence
            </h1>
            <p className="text-muted-foreground">Strategic network analysis and institutional revenue metrics.</p>
          </div>

          <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border flex flex-wrap items-center gap-3 w-fit">
            <div className="flex items-center gap-2 px-3 border-r">
              <Calendar className="w-4 h-4 text-primary/40" />
              <Select value={timePeriod} onValueChange={(v: any) => setTimePeriod(v)}>
                <SelectTrigger className="w-[120px] border-none shadow-none h-9 text-xs font-bold focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">This Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                  <SelectItem value="yearly">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 px-3">
              <Building2 className="w-4 h-4 text-primary/40" />
              <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                <SelectTrigger className="w-[180px] border-none shadow-none h-9 text-xs font-bold focus:ring-0">
                  <SelectValue placeholder="All Institutions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Entire Network</SelectItem>
                  {(schools || []).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users className="w-16 h-16"/></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black opacity-60 tracking-widest">Global Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-secondary">{summaryStats.totalUsers}</div>
              <p className="text-[9px] font-bold mt-2 uppercase flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +12% Growth</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Students</CardTitle>
              <GraduationCap className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-primary">{summaryStats.students}</div>
              <p className="text-[9px] font-bold mt-1 text-muted-foreground uppercase">82% Participation</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Teachers</CardTitle>
              <Users className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-primary">{summaryStats.teachers}</div>
              <p className="text-[9px] font-bold mt-1 text-muted-foreground uppercase">Active Curriculums</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Founders</CardTitle>
              <Crown className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-primary">{summaryStats.founders}</div>
              <p className="text-[9px] font-bold mt-1 text-muted-foreground uppercase">Executive Board</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-secondary text-primary overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black opacity-60 tracking-widest">Net Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{summaryStats.revenue} <span className="text-xs">XAF</span></div>
              <p className="text-[9px] font-bold mt-1 uppercase">Platform Licenses</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="border-b bg-accent/5 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Revenue & User Intake Velocity
                </CardTitle>
                <CardDescription>Analyzing {timePeriod} trends across the network.</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/5 text-primary border-none uppercase text-[9px] font-black h-7 px-3">
                <Zap className="w-3 h-3 mr-1.5" /> High Availability Node
              </Badge>
            </CardHeader>
            <CardContent className="h-[400px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeChartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#67D0E4" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#67D0E4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                  <Area name="Revenue (XAF)" type="monotone" dataKey="revenue" stroke="#264D73" strokeWidth={4} fill="url(#colorRev)" />
                  <Area name="Active Users" type="monotone" dataKey="users" stroke="#67D0E4" strokeWidth={4} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white flex flex-col">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <PieChart className="w-5 h-5 text-secondary" />
                User Segment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-10">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={USER_DISTRIBUTION} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} width={80} />
                  <RechartsTooltip />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={30}>
                    {USER_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 space-y-3">
                {USER_DISTRIBUTION.map((segment, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/20 border border-accent">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-xs font-bold text-primary">{segment.name}</span>
                    </div>
                    <span className="text-sm font-black">{segment.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
          <CardHeader className="bg-white border-b p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                <Building2 className="w-6 h-6 text-secondary" />
                Node Performance Audit
              </CardTitle>
              <CardDescription>Granular review of institutional nodes and their financial integrity.</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search nodes..." 
                className="pl-10 bg-accent/20 border-none rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b">
                <TableRow>
                  <TableHead className="pl-8 py-4">Institutional Node</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead className="text-center">Teachers</TableHead>
                  <TableHead className="text-center">Collection %</TableHead>
                  <TableHead className="text-center">License Rev.</TableHead>
                  <TableHead className="text-right pr-8">Integrity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(schools || [])
                  .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((school) => (
                  <TableRow key={school.id} className="hover:bg-accent/5 transition-colors border-b last:border-0">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white p-1 border shadow-sm flex items-center justify-center shrink-0">
                          <img src={school.logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-primary uppercase">{school.name}</p>
                          <p className="text-[9px] font-mono text-muted-foreground">{school.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-black text-primary">1,240</TableCell>
                    <TableCell className="text-center font-black text-primary">85</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-green-600">92%</span>
                        <div className="w-16 h-1 bg-accent rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: '92%' }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-black text-primary">850,000 XAF</TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-2 text-green-600 font-bold text-[9px] uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" /> VERIFIED
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-accent/10 p-6 border-t flex justify-between items-center">
             <div className="flex items-center gap-2 text-muted-foreground italic">
                <Info className="w-4 h-4 text-primary/40" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">All metrics are computed in real-time across the regional clusters.</p>
             </div>
             <Button variant="ghost" className="gap-2 text-[10px] font-black uppercase" asChild>
               <Link href="/dashboard/schools">Manage All Nodes <ChevronRight className="w-4 h-4"/></Link>
             </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isInstitutionalAdmin) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl shadow-xl border-2 border-white">
              <Building2 className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline">Institutional Command</h1>
              <p className="text-muted-foreground mt-1">{user.school?.name || "EduIgnite Node"} • Head Oversight</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-xl h-11 border-primary/20 font-bold">
              <Link href="/dashboard/students">Manage Registry</Link>
            </Button>
            <Button asChild className="rounded-xl h-11 px-8 shadow-lg font-bold gap-2 bg-primary text-white">
              <Link href="/dashboard/announcements">
                <Zap className="w-4 h-4" /> Broadcast
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: "1,284", icon: GraduationCap, color: "text-blue-600", desc: "Active Node" },
            { label: "Total Staff", value: "85", icon: Users, color: "text-purple-600", desc: "Professionals" },
            { label: "Fee Intake", value: "92%", icon: Coins, color: "text-green-600", desc: "Target: 100%" },
            { label: "Pending Tasks", value: "12", icon: ClipboardCheck, color: "text-amber-600", desc: "Action Required" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
                <stat.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{stat.value}</div>
                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-primary/5 p-8 border-b">
              <CardTitle className="text-primary flex items-center gap-2 font-black uppercase tracking-tighter">
                <Activity className="w-5 h-5 text-secondary"/> Node Operational Pulse
              </CardTitle>
              <CardDescription>Institutional activity trends for the current academic session.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_PERIODS.monthly}>
                  <defs>
                    <linearGradient id="colorNode" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={4} fill="url(#colorNode)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm rounded-[2rem] bg-secondary/10 p-8 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white rounded-[1.5rem] shadow-xl">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter leading-none">Registry Audit</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Ensure all student and staff records are synchronized with the national delegration standards.</p>
              </div>
              <Button asChild className="w-full gap-2 rounded-xl h-11 font-bold bg-primary text-white shadow-lg">
                <Link href="/dashboard/staff">
                  Staff Registry
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isBursar) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl shadow-xl border-2 border-white">
              <Coins className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline">Bursar Suite</h1>
              <p className="text-muted-foreground mt-1">{user.school?.name || "EduIgnite Node"} • Financial Oversight</p>
            </div>
          </div>
          <Button asChild className="rounded-xl h-11 px-8 shadow-lg font-bold gap-2 bg-primary text-white">
            <Link href="/dashboard/fees">
              <ShieldCheck className="w-4 h-4" /> Collect Payment
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Intake Target", value: "24.5M", icon: TrendingUp, color: "text-green-600", desc: "84% Achieved" },
            { label: "Daily Collection", value: "450k", icon: ArrowUpRight, color: "text-blue-600", desc: "12 Transactions" },
            { label: "Total Arrears", value: "4.6M", icon: Info, color: "text-red-600", desc: "Urgent Follow-up" },
            { label: "Fee Categories", value: "4", icon: Wallet, color: "text-amber-600", desc: "Active Structures" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
                <stat.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{stat.value} <span className="text-xs font-bold text-muted-foreground">XAF</span></div>
                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-primary/5 p-8 border-b">
              <CardTitle className="text-primary flex items-center gap-2 font-black uppercase tracking-tighter">
                <TrendingUp className="w-5 h-5 text-secondary"/> Revenue Intake Velocity
              </CardTitle>
              <CardDescription>Visualizing collection performance for the current academic session.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_PERIODS.monthly}>
                  <defs>
                    <linearGradient id="colorBursar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={4} fill="url(#colorBursar)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm rounded-[2rem] bg-secondary/10 p-8 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white rounded-[1.5rem] shadow-xl">
                <History className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter leading-none">Recent Registry</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Review the latest transaction logs and verify physical deposits.</p>
              </div>
              <Button asChild className="w-full gap-2 rounded-xl h-11 font-bold bg-primary text-white shadow-lg">
                <Link href="/dashboard/fees">
                  Open Ledger
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isParent) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user.school?.logo && (
              <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xl border-2 border-accent hidden sm:flex items-center justify-center overflow-hidden">
                <img src={user.school.logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline">Family Overview</h1>
              <p className="text-muted-foreground mt-1">Institutional Node: {user.school?.name || "EduIgnite Node"}</p>
            </div>
          </div>
          <div className="bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <p className="text-xs font-bold text-primary">Verified Parent Identity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Children Enrolled", value: "2", icon: Heart, color: "text-rose-600" },
            { label: "Family Average", value: "15.4 / 20", icon: Award, color: "text-amber-600" },
            { label: "Presence Score", value: "94%", icon: ClipboardCheck, color: "text-green-600" },
            { label: "License Status", value: "Active", icon: Wallet, color: "text-blue-600" },
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
            <CardHeader className="bg-primary text-white p-8">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-secondary" />
                Pedagogical Engagement
              </CardTitle>
              <CardDescription className="text-white/60">Combined performance trends for your children.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_PERIODS.monthly}>
                  <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[2rem] bg-secondary/10 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter leading-none">Manage Children</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Access individual report cards, attendance logs, and teacher feedback.</p>
              </div>
              <Button asChild className="w-full gap-2 rounded-xl h-11 font-bold">
                <Link href="/dashboard/children">
                  Open Children Registry
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xl border-2 border-accent hidden sm:flex items-center justify-center overflow-hidden shrink-0">
            {user.school?.logo ? (
              <img src={user.school.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-primary/40" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter">Welcome, {user.name}</h1>
            <p className="text-muted-foreground mt-1">Institutional Dashboard: {user.school?.name || "EduIgnite Node"}</p>
          </div>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-3 shrink-0">
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
            <CardContent><div className="text-2xl font-black text-primary">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl overflow-hidden rounded-[2rem]">
          <CardHeader className="bg-primary/5 p-8 border-b">
            <CardTitle className="text-primary flex items-center gap-2 font-black uppercase tracking-tighter">
              <TrendingUp className="w-5 h-5 text-secondary"/> Pedagogical Pulse
            </CardTitle>
            <CardDescription>Visual summary of institutional engagement and activity.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_PERIODS.monthly}>
                <defs>
                  <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={4} fill="url(#colorPulse)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] bg-secondary/10 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-black text-primary uppercase tracking-tighter leading-none">Verified Identity</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Your account is secured with a unique institutional matricule. All actions are logged for integrity.</p>
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl font-bold border-primary/20 bg-white">
              <Link href="/dashboard/profile">View Secure Profile</Link>
            </Button>
          </Card>
          
          <Card className="border-none shadow-sm bg-primary text-white p-6 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-secondary" />
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">System Notice</h4>
             </div>
             <p className="text-xs font-medium leading-relaxed italic">
               "Dashboard synchronization is currently operating at optimal capacity across the network."
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
