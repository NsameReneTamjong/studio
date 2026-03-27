
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Coins, 
  Calendar, 
  ShieldCheck, 
  Download, 
  Printer,
  ChevronRight,
  UserCheck,
  UserPlus,
  BookOpen,
  Award,
  Clock,
  Building2,
  PieChart,
  ArrowUpRight,
  TrendingDown,
  Activity,
  Zap,
  Info,
  FileText,
  MapPin,
  QrCode,
  X,
  History,
  Lock,
  Globe,
  Scale,
  CheckCircle2,
  Filter,
  UserRoundCheck,
  UserRoundX,
  UserCog,
  LayoutGrid,
  Search,
  School
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- CONSTANTS & MOCK DATA ---
const ACADEMIC_YEARS = ["2023 / 2024", "2022 / 2023"];
const TERMS = ["Term 1", "Term 2", "Term 3"];
const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section"];
const CLASSES = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Lower Sixth", "Upper Sixth"];

const PERFORMANCE_BY_CLASS = [
  { name: 'Form 1', average: 14.2, students: 45, passRate: 88, revenue: "1.2M", arrears: "450k", attendance: 92 },
  { name: 'Form 2', average: 12.8, students: 40, passRate: 75, revenue: "1.1M", arrears: "800k", attendance: 85 },
  { name: 'Form 3', average: 15.5, students: 38, passRate: 92, revenue: "1.4M", arrears: "200k", attendance: 96 },
  { name: 'Form 4', average: 13.1, students: 42, passRate: 80, revenue: "1.3M", arrears: "600k", attendance: 88 },
  { name: 'Form 5', average: 16.4, students: 42, passRate: 95, revenue: "1.5M", arrears: "100k", attendance: 98 },
];

const TEACHER_PERFORMANCE = [
  { name: "Dr. Aris Tesla", subject: "Physics", engagement: 98, passRate: 94, ranking: 1, avatar: "https://picsum.photos/seed/t1/100/100" },
  { name: "Prof. Sarah Smith", subject: "Math", engagement: 95, passRate: 92, ranking: 2, avatar: "https://picsum.photos/seed/t2/100/100" },
  { name: "Ms. Bennet", subject: "Literature", engagement: 88, passRate: 85, ranking: 3, avatar: "https://picsum.photos/seed/t3/100/100" },
  { name: "Mr. Abena", subject: "Arts", engagement: 92, passRate: 82, ranking: 4, avatar: "https://picsum.photos/seed/t4/100/100" },
];

const STUDENT_MERIT_LIST = [
  { name: "Alice Thompson", class: "Form 5", avg: 18.45, status: "Perfect", attendance: 100, avatar: "https://picsum.photos/seed/s1/100/100" },
  { name: "Bob Richards", class: "Upper Sixth", avg: 17.92, status: "Good", attendance: 98, avatar: "https://picsum.photos/seed/s2/100/100" },
  { name: "Charlie Davis", class: "Form 3", avg: 17.15, status: "Good", attendance: 95, avatar: "https://picsum.photos/seed/s3/100/100" },
  { name: "Diana Prince", class: "Form 5", avg: 16.88, status: "Perfect", attendance: 100, avatar: "https://picsum.photos/seed/s4/100/100" },
];

const ATTENDANCE_ALERTS = [
  { name: "John Doe", class: "Form 2", rate: 62, status: "Critical", trend: "down" },
  { name: "Jane Smith", class: "L6", rate: 68, status: "Warning", trend: "stable" },
];

export default function StatisticsPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  // Filters
  const [filters, setFilters] = useState({
    year: ACADEMIC_YEARS[0],
    term: TERMS[0],
    section: "all",
    class: "all"
  });

  const [previewReport, setPreviewReport] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 20 Strategic Metrics Calculation Logic
  const stats = useMemo(() => ({
    // Academic (1-5)
    globalAvg: "14.25",
    highestSchool: "18.45",
    lowestSchool: "06.12",
    passRate: "84%",
    totalAssessments: "14,200",
    totalStudents: "2,500",
    // Financial (6-10)
    totalRevenue: "22.45M",
    totalArrears: "4.12M",
    collectionRate: "82%",
    expectedIntake: "26.5M",
    avgFeePerStudent: "125k",
    // Operational (11-15)
    overallAttendance: "94.2%",
    perfectAttendaceCount: 142,
    criticalLowAttendance: 18,
    staffPresence: "98.5%",
    studentTeacherRatio: "21:1",
    // Segmented (16-20)
    topSection: "Anglophone",
    bottomSection: "Technical",
    topClass: "Form 5",
    bottomClass: "Form 2",
    growthIndex: "+4.2%"
  }), [filters]);

  const handleGenerateReport = (scope: 'school' | 'section' | 'class') => {
    setPreviewReport({
      type: `${scope.toUpperCase()} STRATEGIC AUDIT`,
      scope,
      date: new Date().toLocaleDateString(),
      filters: { ...filters }
    });
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-[1.5rem] shadow-2xl border-4 border-white">
            <BarChart3 className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter uppercase leading-none">Institutional Intelligence</h1>
            <p className="text-muted-foreground text-sm mt-1">Global oversight of pedagogical, financial, and operational velocity.</p>
          </div>
        </div>

        {/* INTEGRATED FILTERS */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-primary/5">
          <div className="flex items-center gap-2 px-3 border-r">
            <Calendar className="w-4 h-4 text-primary/40" />
            <Select value={filters.year} onValueChange={(v) => setFilters({...filters, year: v})}>
              <SelectTrigger className="w-[120px] border-none h-9 text-xs font-bold focus:ring-0 uppercase"><SelectValue /></SelectTrigger>
              <SelectContent>{ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 px-3 border-r">
            <Clock className="w-4 h-4 text-primary/40" />
            <Select value={filters.term} onValueChange={(v) => setFilters({...filters, term: v})}>
              <SelectTrigger className="w-[100px] border-none h-9 text-xs font-bold focus:ring-0 uppercase"><SelectValue /></SelectTrigger>
              <SelectContent>{TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 px-3 border-r">
            <Globe className="w-4 h-4 text-primary/40" />
            <Select value={filters.section} onValueChange={(v) => setFilters({...filters, section: v})}>
              <SelectTrigger className="w-[150px] border-none h-9 text-xs font-bold focus:ring-0 uppercase"><SelectValue placeholder="All Sections" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Entire Node</SelectItem>
                {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 px-3">
            <LayoutGrid className="w-4 h-4 text-primary/40" />
            <Select value={filters.class} onValueChange={(v) => setFilters({...filters, class: v})}>
              <SelectTrigger className="w-[120px] border-none h-9 text-xs font-bold focus:ring-0 uppercase"><SelectValue placeholder="All Classes" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Global Mean</SelectItem>
                {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2. CORE PERFORMANCE TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp className="w-16 h-16"/></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em]">Global Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{stats.globalAvg} <span className="text-sm opacity-40">/ 20</span></div>
            <p className="text-[9px] font-bold mt-2 uppercase flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {stats.growthIndex} vs Prev Term</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white group hover:ring-2 hover:ring-primary/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Net Intake</CardTitle>
            <Coins className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-primary">{stats.totalRevenue} <span className="text-xs font-bold text-muted-foreground">XAF</span></div>
            <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1">{stats.collectionRate} Efficiency</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white group hover:ring-2 hover:ring-primary/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Presence Mean</CardTitle>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-primary">{stats.overallAttendance}</div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{stats.perfectAttendaceCount} Perfect Logs</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white group hover:ring-2 hover:ring-primary/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Excellence Peak</CardTitle>
            <Award className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-primary">{stats.highestSchool}</div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">High watermark score</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN ANALYTICS DOMAINS */}
      <Tabs defaultValue="pedagogy" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[1000px] mb-8 bg-white shadow-sm border h-auto p-1.5 rounded-[2rem]">
          <TabsTrigger value="pedagogy" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all"><Award className="w-4 h-4"/> Academic Audit</TabsTrigger>
          <TabsTrigger value="finance" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all"><Coins className="w-4 h-4"/> Financial Matrix</TabsTrigger>
          <TabsTrigger value="staff" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all"><UserCog className="w-4 h-4"/> Teacher Rankings</TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all"><Activity className="w-4 h-4"/> Presence Audit</TabsTrigger>
        </TabsList>

        {/* ACADEMIC AUDIT */}
        <TabsContent value="pedagogy" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 p-8 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2"><TrendingUp className="w-5 h-5 text-secondary" /> Performance Variance by Class</CardTitle>
                  <CardDescription>Visualizing average marks across active cohorts.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] pt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_BY_CLASS}>
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="average" stroke="#264D73" strokeWidth={4} fill="url(#colorAvg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4 border-none shadow-xl rounded-[2.5rem] bg-primary text-white flex flex-col">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2"><Scale className="w-5 h-5 text-secondary"/> Range Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 px-8">
                {[
                  { label: "Whole School Peak", value: stats.highestSchool, color: "text-secondary" },
                  { label: "Top Class Avg", value: "16.4 (Form 5)", color: "text-white" },
                  { label: "Lower Bound Peak", value: "06.12", color: "text-red-400" },
                  { label: "Segment Delta", value: "12.33 Points", color: "text-white/60" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                    <span className={cn("text-lg font-black", item.color)}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-white/5 p-6 border-t border-white/5">
                 <p className="text-[9px] font-bold text-center w-full uppercase tracking-widest opacity-40 italic">Rankings updated automatically from registry.</p>
              </CardFooter>
            </Card>
          </div>

          {/* STUDENT MERIT TABLE */}
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b">
              <CardTitle className="text-xl font-black text-primary uppercase">Institutional Merit List</CardTitle>
              <CardDescription>Top students based on current term aggregate averages.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[10px] font-black">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Global Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-center">Mean Score</TableHead>
                    <TableHead className="text-right pr-8">Performance Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {STUDENT_MERIT_LIST.map((s, i) => (
                    <TableRow key={i} className="hover:bg-accent/5">
                      <TableCell className="pl-8"><Badge className="bg-primary/5 text-primary border-none font-black h-7 w-7 rounded-full flex items-center justify-center p-0 shadow-lg">0{i+1}</Badge></TableCell>
                      <TableCell className="font-bold text-sm text-primary uppercase">{s.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] font-bold uppercase">{s.class}</Badge></TableCell>
                      <TableCell className="text-center font-black text-primary text-lg">{s.avg.toFixed(2)}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge className={cn("text-[9px] font-black uppercase px-3 border-none", s.status === 'Perfect' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700")}>
                          {s.status} STANDING
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FINANCIAL MATRIX */}
        <TabsContent value="finance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Aggregate intake</p>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Coins className="w-4 h-4"/></div>
              </div>
              <div className="text-3xl font-black text-primary">{stats.totalRevenue} XAF</div>
              <p className="text-[9px] font-bold text-emerald-600 uppercase flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5"/> +14.2% Growth Index</p>
            </Card>
            <Card className="border-none shadow-sm bg-white p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">System Arrears</p>
                <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingDown className="w-4 h-4"/></div>
              </div>
              <div className="text-3xl font-black text-primary">{stats.totalArrears} XAF</div>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground"><span>Absorption Rate</span><span>82%</span></div>
                <Progress value={82} className="h-1.5 [&>div]:bg-primary" />
              </div>
            </Card>
            <Card className="border-none shadow-sm bg-primary text-white p-6 rounded-3xl flex flex-col justify-center">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Expected Intake Target</p>
               <div className="text-3xl font-black text-secondary">{stats.expectedIntake} XAF</div>
               <p className="text-[9px] font-bold mt-2 opacity-60 uppercase">Institutional Node Cap</p>
            </Card>
          </div>

          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b">
              <CardTitle className="text-xl font-black text-primary uppercase">Revenue Performance by Class</CardTitle>
              <CardDescription>Intake vs Outstanding debt across the class registry.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Class Level</TableHead>
                    <TableHead className="text-center">Enrolled</TableHead>
                    <TableHead className="text-center">Collected Intake</TableHead>
                    <TableHead className="text-center">Active Arrears</TableHead>
                    <TableHead className="text-right pr-8">Velocity %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERFORMANCE_BY_CLASS.map((c) => (
                    <TableRow key={c.name} className="hover:bg-accent/5">
                      <TableCell className="pl-8 font-black text-primary text-sm uppercase">{c.name}</TableCell>
                      <TableCell className="text-center font-bold text-muted-foreground">{c.students}</TableCell>
                      <TableCell className="text-center font-black text-primary">{c.revenue}</TableCell>
                      <TableCell className="text-center font-black text-red-600">{c.arrears}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-black text-primary">{((parseFloat(c.revenue) / (parseFloat(c.revenue) + parseFloat(c.arrears))) * 100).toFixed(0)}%</span>
                          <div className="w-20 h-1 bg-accent rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${((parseFloat(c.revenue) / (parseFloat(c.revenue) + parseFloat(c.arrears))) * 100)}%` }} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEACHER PERFORMANCE */}
        <TabsContent value="staff" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEACHER_PERFORMANCE.map((t) => (
              <Card key={t.ranking} className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all">
                <div className="bg-primary p-6 text-center text-white pb-10 relative">
                  <Badge className="absolute top-4 left-4 bg-secondary text-primary border-none font-black h-6 w-6 rounded-full flex items-center justify-center p-0 shadow-lg">#{t.ranking}</Badge>
                  <Avatar className="h-20 w-20 border-4 border-white/20 mx-auto shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-500">
                    <AvatarImage src={t.avatar} />
                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">{t.name}</CardTitle>
                  <Badge variant="outline" className="text-white/60 border-white/10 uppercase text-[8px] tracking-widest mt-2">{t.subject} LEAD</Badge>
                </div>
                <CardContent className="p-6 -mt-6 bg-white rounded-t-[2.5rem] space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Engagement</p>
                      <p className="text-xl font-black text-primary">{t.engagement}%</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Pass Rate</p>
                      <p className="text-xl font-black text-emerald-600">{t.passRate}%</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 text-primary gap-2 h-10 rounded-xl">
                    <History className="w-3.5 h-3.5" /> Performance Log
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ATTENDANCE AUDIT */}
        <TabsContent value="attendance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-secondary"><CheckCircle2 className="w-8 h-8" /></div>
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tight">Institutional Attendance Audit</CardTitle>
                      <CardDescription className="text-white/60">Cross-sectional analysis of pedagogical presence.</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase opacity-40">School Mean</p>
                    <p className="text-3xl font-black text-secondary">{stats.overallAttendance}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/30 uppercase text-[10px] font-black">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Class Level</TableHead>
                      <TableHead className="text-center">Mean Presence</TableHead>
                      <TableHead className="text-right pr-8">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PERFORMANCE_BY_CLASS.map((c) => (
                      <TableRow key={c.name} className="hover:bg-accent/5">
                        <TableCell className="pl-8 font-black text-primary text-sm uppercase">{c.name}</TableCell>
                        <TableCell className="text-center font-black text-lg">{c.attendance}%</TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-32 h-1.5 bg-accent rounded-full overflow-hidden">
                              <div className={cn("h-full", c.attendance >= 90 ? "bg-green-500" : "bg-amber-500")} style={{ width: `${c.attendance}%` }} />
                            </div>
                            <Badge className={cn("text-[8px] font-black border-none h-5 px-2", c.attendance >= 90 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                              {c.attendance >= 90 ? 'OPTIMAL' : 'MONITOR'}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-sm rounded-[2rem] bg-red-50 p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl text-red-600 shadow-sm"><UserRoundX className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-sm font-black text-red-900 uppercase">Intervention Queue</h4>
                    <p className="text-[10px] text-red-700 font-bold uppercase opacity-60">Low Attendance Alerts</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {ATTENDANCE_ALERTS.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-red-100 group hover:bg-white transition-all">
                      <div>
                        <p className="text-xs font-black text-primary uppercase">{a.name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{a.class} • {a.rate}% Rate</p>
                      </div>
                      <Badge variant="destructive" className="text-[8px] h-5 px-2">{a.status}</Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold gap-2">
                  <Smartphone className="w-4 h-4" /> Notify Guardians
                </Button>
              </Card>

              <Card className="border-none shadow-sm rounded-[2rem] bg-green-50 p-8 space-y-4 text-center">
                 <div className="p-4 bg-white rounded-[2rem] shadow-xl w-fit mx-auto border-2 border-green-100">
                    <UserRoundCheck className="w-12 h-12 text-green-600" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-lg font-black text-green-900 uppercase leading-none">Perfect Attendance</h4>
                    <p className="text-3xl font-black text-green-700">{stats.perfectAttendaceCount}</p>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Active Students</p>
                 </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* STRATEGIC REPORT DIALOG */}
      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-8 text-white no-print shrink-0 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary"><FileText className="w-8 h-8" /></div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight">{previewReport?.type}</DialogTitle>
                  <DialogDescription className="text-white/60">Verified institutional data dossier generated on {previewReport?.date}.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewReport(null)} className="text-white/40 hover:text-white"><X className="w-6 h-6" /></Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-muted p-4 md:p-10 print:p-0 print:bg-white no-scrollbar">
            <div id="printable-strategic-audit" className="bg-white p-8 md:p-16 border-2 border-black/10 shadow-sm relative flex flex-col space-y-12 font-serif text-black print:border-none print:shadow-none min-w-[800px] mx-auto">
               
               {/* National Header */}
               <div className="grid grid-cols-3 gap-2 items-start text-center border-b-2 border-black pb-6">
                  <div className="space-y-0.5 text-[8px] uppercase font-bold">
                    <p>Republic of Cameroon</p>
                    <p>Peace - Work - Fatherland</p>
                    <div className="h-px bg-black w-10 mx-auto my-1" />
                    <p>Ministry of Secondary Education</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={user?.school?.logo || platformSettings.logo} alt="School" className="w-20 h-20 object-contain" />
                  </div>
                  <div className="space-y-0.5 text-[8px] uppercase font-bold">
                    <p>République du Cameroun</p>
                    <p>Paix - Travail - Patrie</p>
                    <div className="h-px bg-black w-10 mx-auto my-1" />
                    <p>Min. des Enseignements Secondaires</p>
                  </div>
               </div>

               <div className="text-center space-y-2">
                  <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter text-primary leading-tight">{user?.school?.name || "INSTITUTIONAL NODE"}</h2>
                  <p className="text-[10px] md:text-xs font-bold uppercase opacity-60 tracking-[0.3em] underline underline-offset-4 decoration-double">GLOBAL STRATEGIC PERFORMANCE AUDIT (20 CORE METRICS)</p>
               </div>

               {/* PERFORMANCE MATRIX TABLE (20 STATS) */}
               <div className="grid grid-cols-2 gap-12 pt-4">
                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2"><Users className="w-4 h-4"/> Global Context</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">1. Total Enrollment:</span><span>{stats.totalStudents}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">2. Staff Density:</span><span>{stats.staffPresence}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">3. Student-Teacher Ratio:</span><span>{stats.studentTeacherRatio}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">4. Growth Index:</span><span className="text-green-600">{stats.growthIndex}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">5. System Health:</span><span className="text-green-600 font-black">OPTIMAL</span></div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2"><Award className="w-4 h-4"/> Academic Merit</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">6. Institutional Mean:</span><span>{stats.globalAvg} / 20</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">7. Excellence Peak:</span><span>{stats.highestSchool} / 20</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">8. Bottom Mean:</span><span className="text-red-600">{stats.lowestSchool} / 20</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">9. Best Section:</span><span>{stats.topSection}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">10. Lead Class:</span><span>{stats.topClass}</span></div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2"><Coins className="w-4 h-4"/> Financial Matrix</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">11. Net Revenue Intake:</span><span>{stats.totalRevenue} XAF</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">12. Active Arrears:</span><span className="text-red-600">{stats.totalArrears} XAF</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">13. Expected Target:</span><span>{stats.expectedIntake} XAF</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">14. Collection Velocity:</span><span>{stats.collectionRate}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">15. Avg Fee/Student:</span><span>{stats.avgFeePerStudent}</span></div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2"><Activity className="w-4 h-4"/> Operational Pulse</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">16. Global Presence:</span><span>{stats.overallAttendance}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">17. Perfect Logs:</span><span className="text-green-600">{stats.perfectAttendaceCount}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">18. Critical Deficits:</span><span className="text-red-600">{stats.criticalLowAttendance}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">19. Assessment Volume:</span><span>{stats.totalAssessments}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">20. Node Security:</span><span className="text-green-600">VERIFIED</span></div>
                    </div>
                  </section>
               </div>

               <section className="pt-8 border-t border-black/5">
                  <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 mb-4">Teacher Performance Rankings</h4>
                  <Table className="border-collapse border-2 border-black/5">
                    <TableHeader className="bg-black/5">
                       <TableRow>
                          <TableHead className="text-[10px] font-black uppercase text-black">Rank</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-black">Instructor</TableHead>
                          <TableHead className="text-center text-[10px] font-black uppercase text-black">Engagement</TableHead>
                          <TableHead className="text-right text-[10px] font-black uppercase text-black pr-6">Subject Pass Rate</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {TEACHER_PERFORMANCE.slice(0, 3).map((t, i) => (
                         <TableRow key={i} className="border-b border-black/5">
                            <TableCell className="font-black text-xs">NO. 0{t.ranking}</TableCell>
                            <TableCell className="font-bold text-xs uppercase">{t.name} ({t.subject})</TableCell>
                            <TableCell className="text-center font-bold text-xs">{t.engagement}%</TableCell>
                            <TableCell className="text-right pr-6 font-black text-sm text-primary">{t.passRate}%</TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                  </Table>
               </section>

               {/* REGISTRY SEALS */}
               <div className="pt-12 border-t border-black/5 flex justify-between items-end">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <QrCode className="w-20 h-20 opacity-10" />
                    <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 leading-tight">Institutional<br/>Strategic Data QR</p>
                  </div>
                  <div className="text-center space-y-6 w-48">
                    <div className="h-14 w-full mx-auto bg-primary/5 rounded-xl border-b-2 border-black/40 relative flex items-center justify-center overflow-hidden shadow-inner">
                       <SignatureSVG className="w-full h-full text-primary/20 p-2" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">The Principal</p>
                  </div>
               </div>

               <div className="text-center pt-6 border-t border-black/5">
                  <div className="flex items-center justify-center gap-3">
                    <img src={platformSettings.logo} alt="EduIgnite" className="w-4 h-4 object-contain opacity-20" />
                    <p className="text-[8px] font-black uppercase text-muted-foreground opacity-30 tracking-[0.3em]">
                      Verified Strategic Intelligence • Secure Node Registry • {new Date().getFullYear()}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-8 border-t no-print flex flex-col sm:flex-row gap-4 shrink-0">
            <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs" onClick={() => setPreviewReport(null)}>
              Dismiss Audit
            </Button>
            <div className="flex flex-col sm:flex-row flex-1 gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs gap-2"
                onClick={() => toast({ title: "Packet Prepared", description: "Strategic PDF is being generated for export." })}
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button 
                className="flex-1 rounded-2xl h-14 shadow-2xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white hover:bg-primary/90 transition-all active:scale-95" 
                onClick={() => { window.print(); setPreviewReport(null); }}
              >
                <Printer className="w-4 h-4" /> Print Strategic Dossier
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SignatureSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 25C15 25 20 15 25 15C30 15 35 30 40 30C45 30 50 10 55 10C60 10 65 35 70 35C75 35 80 20 85 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 30L85 10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
    </svg>
  );
}
