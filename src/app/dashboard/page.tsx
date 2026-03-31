
"use client";

import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  CheckCircle2,
  Clock,
  Wallet,
  User,
  Radio,
  PenTool,
  History,
  LayoutGrid,
  Sparkles,
  AlertCircle,
  FileEdit,
  ListChecks,
  BookOpen,
  MapPin,
  Timer,
  BookMarked,
  TrendingDown,
  QrCode,
  Smartphone,
  MessageCircle,
  Baby,
  Scale,
  Signature as SignatureIcon,
  FileDown,
  FileText,
  ShieldAlert,
  BarChart3,
  UserCheck,
  UserPlus,
  UserCog,
  UserRoundCheck,
  UserRoundX,
  Library,
  Book,
  Archive,
  ArrowDownCircle,
  Receipt,
  Printer,
  Heart,
  Plus,
  X,
  Trophy,
  FileBadge,
  Download
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DATA_PERIODS = {
  weekly: [
    { name: 'Mon', users: 120, revenue: 45000, loans: 12 },
    { name: 'Tue', users: 150, revenue: 52000, loans: 18 },
    { name: 'Wed', users: 180, revenue: 48000, loans: 15 },
    { name: 'Thu', users: 210, revenue: 61000, loans: 24 },
    { name: 'Fri', users: 250, revenue: 55000, loans: 30 },
    { name: 'Sat', users: 190, usersRevenue: 32000, loans: 8 },
    { name: 'Sun', users: 110, revenue: 28000, loans: 5 },
  ],
  monthly: [
    { name: 'Week 1', users: 1200, revenue: 245000, performance: 14.2, loans: 85 },
    { name: 'Week 2', users: 1450, revenue: 280000, performance: 15.5, loans: 110 },
    { name: 'Week 3', users: 1100, revenue: 210000, performance: 13.8, loans: 95 },
    { name: 'Week 4', users: 1800, revenue: 350000, performance: 16.1, loans: 140 },
  ],
  yearly: [
    { name: 'Jan', users: 4500, revenue: 1200000, loans: 420 },
    { name: 'Feb', users: 5200, revenue: 1450000, loans: 480 },
    { name: 'Mar', users: 4800, revenue: 1100000, loans: 450 },
    { name: 'Apr', users: 6100, revenue: 1800000, loans: 520 },
    { name: 'May', users: 7500, revenue: 2100000, loans: 610 },
    { name: 'Jun', users: 6900, revenue: 1950000, loans: 580 },
    { name: 'Jul', users: 7200, revenue: 2300000, loans: 400 },
    { name: 'Aug', users: 8100, revenue: 2500000, loans: 350 },
    { name: 'Sep', users: 9500, revenue: 3100000, loans: 780 },
    { name: 'Oct', users: 10200, revenue: 3400000, loans: 820 },
    { name: 'Nov', users: 11500, revenue: 3800000, loans: 850 },
    { name: 'Dec', users: 12400, revenue: 4200000, loans: 900 },
  ]
};

const LIBRARIAN_CATEGORY_DATA = [
  { name: 'Science', count: 450, color: '#264D73' },
  { name: 'Math', count: 320, color: '#67D0E4' },
  { name: 'Literature', count: 280, color: '#FCD116' },
  { name: 'History', count: 150, color: '#CE1126' },
  { name: 'Arts', count: 120, color: '#10B981' },
];

const LIBRARIAN_RECENT_LOANS = [
  { student: "Alice Thompson", class: "Form 5", book: "Advanced Physics", due: "Today", status: "Active", avatar: "https://picsum.photos/seed/s1/100/100" },
  { student: "Bob Richards", class: "Upper Sixth", book: "Calculus II", due: "Tomorrow", status: "Active", avatar: "https://picsum.photos/seed/s2/100/100" },
  { student: "Charlie Davis", class: "Form 3", book: "Organic Chemistry", due: "28 May", status: "Overdue", avatar: "https://picsum.photos/seed/s3/100/100" },
];

const LIBRARIAN_LOW_STOCK = [
  { title: "General Chemistry", author: "Dr. White", available: 0, total: 10 },
  { title: "English Grammar", author: "Ms. Bennet", available: 1, total: 15 },
  { title: "Modern History", author: "Prof. Smith", available: 2, total: 8 },
];

const BURSAR_REVENUE_TRENDS = [
  { name: 'Mon', revenue: 450000 },
  { name: 'Tue', revenue: 520000 },
  { name: 'Wed', revenue: 480000 },
  { name: 'Thu', revenue: 610000 },
  { name: 'Fri', revenue: 550000 },
  { name: 'Sat', revenue: 320000 },
  { name: 'Sun', revenue: 110000 },
];

const BURSAR_FEE_DISTRIBUTION = [
  { name: 'Tuition', value: 12500000, color: '#264D73' },
  { name: 'Uniforms', value: 2450000, color: '#67D0E4' },
  { name: 'PTA', value: 1200000, color: '#FCD116' },
  { name: 'Exams', value: 850000, color: '#CE1126' },
];

const BURSAR_RECENT_COLLECTIONS = [
  { student: "Alice Thompson", id: "GBHS26S001", type: "Tuition", amount: "50,000", method: "Cash", date: "10:30 AM", status: "Verified", avatar: "https://picsum.photos/seed/s1/100/100" },
  { student: "Bob Richards", id: "GBHS26S002", type: "Uniform", amount: "25,000", method: "Orange", date: "09:12 AM", status: "Verified", avatar: "https://picsum.photos/seed/s2/100/100" },
  { student: "Diana Prince", id: "GBHS26S004", type: "PTA", amount: "10,000", method: "MTN", date: "Yesterday", status: "Verified", avatar: "https://picsum.photos/seed/s4/100/100" },
];

const BURSAR_CLASS_REVENUE = [
  { class: "Form 1", target: 4500000, collected: 3800000, percentage: 84 },
  { class: "Form 2", target: 4000000, collected: 2200000, percentage: 55 },
  { class: "Form 5", target: 4200000, collected: 4000000, percentage: 95 },
];

const ADMIN_CLASS_SUMMARY = [
  { class: "Form 1", students: 45, average: 14.2, attendance: 92, revenue: 85 },
  { class: "Form 2", students: 40, average: 12.8, attendance: 85, revenue: 60 },
  { class: "Form 3", students: 38, average: 15.5, attendance: 96, revenue: 95 },
  { class: "Form 4", students: 42, average: 13.1, attendance: 88, revenue: 78 },
  { class: "Form 5", students: 42, average: 16.4, attendance: 98, revenue: 98 },
];

const ADMIN_GOVERNANCE_LOGS = [
  { action: "Verified Sequence 1 Marks", actor: "VP Academics", time: "10:30 AM", status: "Success" },
  { action: "Authorized Fee Receipt Batch", actor: "Bursar Office", time: "09:12 AM", status: "Pending" },
  { action: "Updated Library Policy", actor: "Head Librarian", time: "Yesterday", status: "Success" },
  { action: "Class Stream Promotion Sync", actor: "System Node", time: "Yesterday", status: "Success" },
];

const TEACHER_CLASS_DATA = [
  { name: 'Form 1', attendance: 92, performance: 12.5 },
  { name: 'Form 2', attendance: 85, performance: 11.8 },
  { name: 'Form 3', attendance: 96, performance: 14.2 },
  { name: 'Form 4', attendance: 88, performance: 13.1 },
  { name: 'Form 5', attendance: 98, performance: 16.4 },
];

const STUDENT_SUBJECT_PERF = [
  { name: 'Physics', score: 16.5 },
  { name: 'Maths', score: 18.2 },
  { name: 'Literature', score: 14.0 },
  { name: 'Chem', score: 13.5 },
  { name: 'Biology', score: 15.8 },
];

const USER_DISTRIBUTION = [
  { name: 'Students', value: 18500, color: '#264D73' },
  { name: 'Teachers', value: 2400, color: '#67D0E4' },
  { name: 'Admins', value: 124, color: '#FCD116' },
  { name: 'Founders', value: 5, color: '#CE1126' },
];

const UPCOMING_TASKS = [
  { id: "T1", title: "Physics Seq 2 Entry", class: "Form 5", deadline: "Today, 4PM", status: "Urgent", icon: PenTool },
  { id: "T2", title: "Lab Report Review", class: "Form 3", deadline: "Tomorrow", status: "Upcoming", icon: FileEdit },
];

const RECENT_GRADES = [
  { student: "Alice Thompson", class: "Form 5", subject: "Physics", score: "18.5/20", status: "Excellent", avatar: "https://picsum.photos/seed/s1/100/100" },
  { student: "Bob Richards", class: "Form 5", subject: "Physics", score: "14.2/20", status: "Good", avatar: "https://picsum.photos/seed/s2/100/100" },
];

const STUDENT_RECENT_RESULTS = [
  { subject: "Advanced Physics", sequence: "Seq 1", score: "16.5", avg: "12.4", rank: "2nd" },
  { subject: "Mathematics", sequence: "Seq 1", score: "18.0", avg: "13.1", rank: "1st" },
  { subject: "Literature", sequence: "Seq 1", score: "14.0", avg: "11.2", rank: "5th" },
];

const STUDENT_TODAY_SCHEDULE = [
  { time: "08:00 AM", subject: "Advanced Physics", room: "Room 402", teacher: "Dr. Tesla" },
  { time: "10:30 AM", subject: "Mathematics", room: "Hall A", teacher: "Prof. Smith" },
  { time: "01:30 PM", subject: "Literature", room: "Library B", teacher: "Ms. Bennet" },
];

const PARENT_CHILDREN_LEDGER = [
  { id: "GBHS26S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", class: "Form 5", today: "Math Exam (Hall A)", status: "At School", gpa: "16.45", attendance: "98%", feeStatus: 85, isHonourRoll: true },
  { id: "GBHS26S004", name: "Diana Thompson", avatar: "https://picsum.photos/seed/s4/100/100", class: "Form 3", today: "Biology Lab", status: "At School", gpa: "14.20", attendance: "95%", feeStatus: 40, isHonourRoll: false },
];

const PARENT_RECENT_MARKS = [
  { child: "Alice", subject: "Physics", seq: "Seq 2", mark: "18.5/20", teacher: "Dr. Tesla", date: "Just now" },
  { child: "Diana", subject: "English", seq: "Seq 2", mark: "14.0/20", teacher: "Ms. Bennet", date: "2 hours ago" },
  { child: "Alice", subject: "Calculus", seq: "Seq 2", mark: "17.0/20", teacher: "Prof. Smith", date: "Yesterday" },
];

// Mock for Librarian Loan functionality
const MOCK_BOOKS = [
  { id: "B001", title: "Advanced Physics" },
  { id: "B002", title: "Calculus II" },
  { id: "B003", title: "Organic Chemistry" },
];

const MOCK_STUDENTS_LIST = [
  { id: "GBHS26S001", name: "Alice Thompson" },
  { id: "GBHS26S002", name: "Bob Richards" },
  { id: "GBHS26S003", name: "Charlie Davis" },
];

export default function DashboardPage() {
  const { user, schools, isLoading: isAuthLoading, platformSettings, staffRemarks } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();

  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [selectedSchoolId, setSelectedSchoolId] = useState("all");
  const [isDataSyncing, setIsDataSyncing] = useState(true);

  // Librarian Loan State
  const [isIssuingLoan, setIsIssuingLoan] = useState(false);
  const [isProcessingLoan, setIsProcessingLoan] = useState(false);
  const [loanFormData, setLoanFormData] = useState({
    studentId: "",
    bookId: "",
    duration: "7"
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsDataSyncing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const activeChartData = useMemo(() => DATA_PERIODS[timePeriod] || DATA_PERIODS.monthly, [timePeriod]);

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

  const handleIssueLoan = () => {
    if (!loanFormData.studentId || !loanFormData.bookId) {
      toast({ variant: "destructive", title: "Form Incomplete", description: "Select a student and a volume." });
      return;
    }
    setIsProcessingLoan(true);
    setTimeout(() => {
      setIsProcessingLoan(false);
      setIsIssuingLoan(false);
      setLoanFormData({ studentId: "", bookId: "", duration: "7" });
      toast({ title: "Loan Recorded", description: "Pedagogical materials issued to student node." });
    }, 1500);
  };

  const handleDownloadRemark = (remark: any) => {
    toast({ title: "Dossier Preparation", description: "Generating formal administrative report..." });
    setTimeout(() => {
      toast({ title: "Report Ready", description: "Download successful." });
    }, 1500);
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Identity Node...</p>
      </div>
    );
  }

  const isPlatformExecutive = ["SUPER_ADMIN", "CEO", "CTO", "COO", "INV", "DESIGNER"].includes(user.role);
  const isTeacher = user.role === "TEACHER";
  const isStudent = user.role === "STUDENT";
  const isParent = user.role === "PARENT";
  const isLibrarian = user.role === "LIBRARIAN";
  const isBursar = user.role === "BURSAR";
  const isAdmin = user.role === "SCHOOL_ADMIN" || user.role === "SUB_ADMIN";

  const myRemarks = useMemo(() => staffRemarks.filter(r => r.staffId === user.id), [staffRemarks, user.id]);

  // 1. PLATFORM EXECUTIVE VIEW
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

        {isDataSyncing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
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
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Students</CardTitle>
                <GraduationCap className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{summaryStats.students}</div>
                <p className="text-[9px] font-bold mt-1 text-muted-foreground uppercase">82% Participation</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Teachers</CardTitle>
                <Users className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{summaryStats.teachers}</div>
                <p className="text-[9px] font-bold mt-1 text-muted-foreground uppercase">Active Curriculums</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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
        )}

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
                    <linearGradient id="colorRev" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" x2="0" y2="1">
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
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} width={80} />
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
      </div>
    );
  }

  // 2. SCHOOL ADMIN / SUB ADMIN VIEW
  if (isAdmin) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-[1.5rem] shadow-xl border-4 border-white flex items-center justify-center p-3">
              {user.school?.logo ? (
                <img src={user.school.logo} alt="School" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-full h-full text-secondary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter uppercase leading-none">{user.school?.name || "Institution Dashboard"}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-secondary text-primary border-none font-black h-5 px-3 text-[9px] tracking-widest uppercase">Admin Node</Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• Principal: {user.school?.principal}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-primary/10 bg-white gap-2 shadow-sm">
              <FileDown className="w-4 h-4 text-primary" /> Reports
            </Button>
            <Button className="h-11 px-8 shadow-xl font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl">
              <ShieldCheck className="w-4 h-4" /> Verify Node
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Enrollment", value: "2,500+", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Staff Registry", value: "120 Active", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Collection Velocity", value: "82.4%", icon: Coins, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "System Integrity", value: "Optimal", icon: ShieldCheck, color: "text-primary", bg: "bg-primary/5" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary"/> Pedagogical Velocity
                </CardTitle>
                <CardDescription>Aggregate performance trends across all class streams.</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/10 text-primary font-bold h-7 px-4">NODE SYNC ACTIVE</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_PERIODS.monthly}>
                  <defs>
                    <linearGradient id="colorAdminPerf" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', shadow: 'none' }} />
                  <Area name="Node Mean" type="monotone" dataKey="performance" stroke="#264D73" strokeWidth={4} fill="url(#colorAdminPerf)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white flex flex-col">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Coins className="w-5 h-5 text-secondary" />
                Revenue Matrix
              </CardTitle>
              <CardDescription className="text-white/60 text-xs">Financial intake by class level.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-10 px-8 space-y-6">
              {ADMIN_CLASS_SUMMARY.slice(0, 4).map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary/60">
                    <span>{item.class}</span>
                    <span>{item.revenue}%</span>
                  </div>
                  <Progress value={item.revenue} className="h-1.5 rounded-full" />
                </div>
              ))}
              <div className="pt-4 border-t">
                 <Button asChild variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5">
                   <Link href="/dashboard/fees">Global Ledger Audit <ChevronRight className="w-3.5 h-3.5"/></Link>
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8">
              <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-secondary" />
                Class Stream Registry
              </CardTitle>
              <CardDescription>Pedagogical health summary per academic level.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Stream</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center">Average</TableHead>
                    <TableHead className="text-right pr-8">Presence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ADMIN_CLASS_SUMMARY.map((cls, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b last:border-0 h-16">
                      <TableCell className="pl-8 font-black text-primary uppercase text-xs">{cls.class}</TableCell>
                      <TableCell className="text-center font-bold text-xs">{cls.students}</TableCell>
                      <TableCell className="text-center font-black text-primary">{cls.average.toFixed(2)}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-none font-black h-5">{cls.attendance}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8">
              <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-secondary" />
                Governance Audit Logs
              </CardTitle>
              <CardDescription>Latest administrative actions across the node.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {ADMIN_GOVERNANCE_LOGS.map((log, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 border-b last:border-0 h-16">
                      <TableCell className="pl-8">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-primary uppercase leading-none">{log.action}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Actor: {log.actor}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex flex-col items-end">
                          <Badge variant="outline" className="text-[8px] font-black uppercase h-4 px-2 border-primary/10 text-primary">{log.status}</Badge>
                          <span className="text-[9px] text-muted-foreground mt-1 italic">{log.time}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-4 flex justify-center border-t">
               <div className="flex items-center gap-2 text-muted-foreground italic">
                  <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Verified Institutional Registry</p>
               </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 3. TEACHER DASHBOARD VIEW
  if (isTeacher) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white shadow-xl shrink-0 ring-4 ring-primary/5">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter">Welcome back, {user.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-black uppercase text-[10px] h-5 px-3">
                  Pedagogical Lead
                </Badge>
                {user.school && (
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• {user.school.name}</span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-3 shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <p className="text-xs font-bold text-green-700">Digital Node Sync Active</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Assigned Classes", value: "5 Streams", icon: LayoutGrid, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Students", value: "210 Active", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Pending Grading", value: "42 Scripts", icon: ListChecks, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Active Assignments", value: "3 Tasks", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary"/> Performance Velocity
                </CardTitle>
                <CardDescription>Aggregate student mean scores over current evaluation cycle.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_PERIODS.monthly}>
                  <defs>
                    <linearGradient id="colorPerf" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area name="Avg Mark" type="monotone" dataKey="performance" stroke="#264D73" strokeWidth={4} fill="url(#colorPerf)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white flex flex-col">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Presence Matrix
              </CardTitle>
              <CardDescription className="text-white/60">Mean attendance density per class.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-10">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={TEACHER_CLASS_DATA}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} />
                  <YAxis hide />
                  <RechartsTooltip />
                  <Bar dataKey="attendance" radius={[10, 10, 0, 0]} barSize={25} fill="#67D0E4" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 space-y-3">
                {TEACHER_CLASS_DATA.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/20 border border-accent">
                    <span className="text-xs font-bold text-primary uppercase">{item.name}</span>
                    <Badge variant="outline" className="border-primary/10 text-primary font-black">{item.attendance}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-secondary" />
                  Upcoming Pedagogical Tasks
                </CardTitle>
                <CardDescription>Timeline of markers and administrative duties.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {UPCOMING_TASKS.map((task) => (
                    <TableRow key={task.id} className="hover:bg-primary/5 transition-colors border-b last:border-0 h-16">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-accent/30 text-primary">
                            <task.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-primary uppercase">{task.title}</p>
                            <p className="text-[10px] text-muted-foreground font-bold">{task.class}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge className={cn(
                          "text-[8px] font-black uppercase border-none px-3 mb-1",
                          task.status === 'Urgent' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {task.status}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground font-bold italic">{task.deadline}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* TEACHER ADMINISTRATIVE REMARKS */}
          <Card className="lg:col-span-5 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-secondary/20 p-8 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Admin Evaluation
                </CardTitle>
                <CardDescription>Official professional feedback from the principal.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {myRemarks.length > 0 ? (
                <div className="space-y-4">
                  {myRemarks.map((remark) => (
                    <div key={remark.id} className="p-6 bg-accent/30 rounded-2xl border border-accent space-y-4 animate-in fade-in zoom-in-95">
                      <p className="text-sm italic font-medium text-primary leading-relaxed">
                        "{remark.text}"
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-accent/50">
                        <div className="flex items-center gap-2">
                          <SignatureIcon className="w-4 h-4 text-primary/40" />
                          <span className="text-[10px] font-black uppercase text-primary/60">{remark.adminName} • {remark.date}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-[10px] font-black uppercase bg-white shadow-sm" onClick={() => handleDownloadRemark(remark)}>
                          <Download className="w-3.5 h-3.5" /> PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-40">
                  <FileBadge className="w-12 h-12" />
                  <p className="text-xs font-bold uppercase tracking-widest">No formal remarks in dossier.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 4. STUDENT DASHBOARD VIEW
  if (isStudent) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white shadow-xl shrink-0 ring-4 ring-primary/5">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter uppercase leading-none">Welcome, {user.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-primary/5 text-primary border-primary/10 h-5 px-3 font-black uppercase text-[10px] tracking-widest">
                  {user.class}
                </Badge>
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">• Matricule: {user.id}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-3 shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <p className="text-xs font-bold text-green-700">Student Node Active</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Term Average", value: "16.45 / 20", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Attendance Integrity", value: "98.2%", icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Pending Tasks", value: "4 Assignments", icon: ListChecks, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Library Loans", value: "2 Volumes", icon: BookMarked, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary"/> Performance Velocity
                </CardTitle>
                <CardDescription>Visualizing your academic evolution over the current term.</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/10 text-primary font-bold uppercase text-[9px] px-3">VERIFIED RECORDS</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_PERIODS.monthly}>
                  <defs>
                    <linearGradient id="colorStudentPerf" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area name="Sequence Mark" type="monotone" dataKey="performance" stroke="#264D73" strokeWidth={4} fill="url(#colorStudentPerf)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-primary text-white flex flex-col">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                Subject Proficiency
              </CardTitle>
              <CardDescription className="text-white/60">Latest evaluation benchmarks.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-10">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={STUDENT_SUBJECT_PERF}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeights: 'bold', fill: '#fff' }} />
                  <YAxis hide />
                  <RechartsTooltip />
                  <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={20} fill="#67D0E4" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 space-y-3">
                {STUDENT_SUBJECT_PERF.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                    <Badge className="bg-secondary text-primary border-none font-black">{item.score}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  Today's Sequence
                </CardTitle>
                <CardDescription>Your chronological academic timetable for today.</CardDescription>
              </div>
              <Badge className="bg-secondary text-primary border-none font-black h-7 px-4">LIVE NODE</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {STUDENT_TODAY_SCHEDULE.map((slot, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b last:border-0 h-16">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-accent/30 text-primary">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-primary uppercase">{slot.subject}</p>
                            <p className="text-[10px] text-muted-foreground font-bold">{slot.time}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex flex-col items-end">
                          <p className="text-xs font-bold text-primary flex items-center gap-1.5"><MapPin className="w-3 h-3 text-secondary" /> {slot.room}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">{slot.teacher}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-white border-b p-8 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  Recent Results
                </CardTitle>
                <CardDescription>Latest marks registered in your dossier.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {STUDENT_RECENT_RESULTS.map((res, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 border-b last:border-0 h-16">
                      <TableCell className="pl-8">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-primary uppercase leading-none">{res.subject}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{res.sequence}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-primary">{res.score} <span className="text-[10px] opacity-40">/ 20</span></span>
                          <span className="text-[8px] font-bold uppercase text-secondary">Rank: {res.rank}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-4 border-t flex justify-center">
               <Button asChild variant="ghost" className="text-[10px] font-black uppercase gap-2 hover:bg-white transition-all">
                 <Link href="/dashboard/grades">Access Full Report Card <ChevronRight className="w-3.5 h-3.5"/></Link>
               </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 5. PARENT DASHBOARD VIEW
  if (isParent) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-[1.5rem] shadow-xl border-2 border-white">
              <Heart className="w-8 h-8 text-secondary fill-secondary/20" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter uppercase leading-none">Family Academic Hub</h1>
              <p className="text-muted-foreground text-sm mt-1">Strategic oversight of your children's pedagogical progress.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="h-12 px-6 rounded-2xl font-bold border-primary/10 bg-white gap-2">
              <Link href="/dashboard/children"><Baby className="w-4 h-4 text-primary" /> Manage Children</Link>
            </Button>
            <Button asChild className="h-12 px-8 shadow-xl font-black uppercase tracking-widest text-[10px] gap-2 bg-primary text-white">
              <Link href="/dashboard/subscription"><Wallet className="w-4 h-4 text-secondary" /> Pay Licenses</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Children Enrolled", value: "2 Students", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Family GPA Mean", value: "15.33 / 20", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Attendance Avg", value: "96.5%", icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Compliance Status", value: "Active Node", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary"/> Family Scholastic Velocity
                </CardTitle>
                <CardDescription>Aggregate success outcome trends for all children.</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/10 text-primary font-bold uppercase text-[9px] px-3">VERIFIED RECORDS</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_PERIODS.monthly}>
                  <defs>
                    <linearGradient id="colorParentPerf" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area name="Family Avg" type="monotone" dataKey="performance" stroke="#264D73" strokeWidth={4} fill="url(#colorParentPerf)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white flex flex-col">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Children Activity
              </CardTitle>
              <CardDescription className="text-white/60">Live node location tracking.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {PARENT_CHILDREN_LEDGER.map((child, i) => (
                <div key={i} className="p-6 border-b last:border-0 hover:bg-accent/10 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-accent">
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-primary uppercase leading-none">{child.name}</p>
                        {child.isHonourRoll && <Trophy className="w-3.5 h-3.5 text-secondary" />}
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-secondary" /> {child.today}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-none text-[8px] font-black h-5 px-2">LIVE</Badge>
                    {child.isHonourRoll && <Badge className="bg-primary text-secondary border-none text-[7px] font-black h-4 uppercase tracking-tighter">HONOUR ROLL</Badge>}
                  </div>
                </div>
              ))}
              <div className="p-6 bg-accent/20">
                 <Button asChild variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-white transition-all h-10">
                   <Link href="/dashboard/children">Access Children Dossiers <ChevronRight className="w-3.5 h-3.5"/></Link>
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                  <History className="w-5 h-5 text-secondary" />
                  Recent Academic Marks
                </CardTitle>
                <CardDescription>Latest evaluations synchronized across the family registry.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {PARENT_RECENT_MARKS.map((res, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b last:border-0 h-16">
                      <TableCell className="pl-8 py-4">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-primary uppercase leading-none">{res.child} • {res.subject}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{res.seq} • {res.teacher}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-primary">{res.mark}</span>
                          <span className="text-[8px] font-bold uppercase text-muted-foreground uppercase italic">{res.date}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-4 border-t flex justify-center">
               <Button asChild variant="ghost" className="text-[10px] font-black uppercase gap-2 hover:bg-white transition-all">
                 <Link href="/dashboard/grades">View Full Family Gradebook <ChevronRight className="w-3.5 h-3.5"/></Link>
               </Button>
            </CardFooter>
          </Card>

          <Card className="lg:col-span-5 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white flex flex-col">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Coins className="w-5 h-5 text-secondary" />
                Financial Intake Tracker
              </CardTitle>
              <CardDescription className="text-white/60">Monitoring fee compliance per student node.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-8 space-y-8 px-8">
              {PARENT_CHILDREN_LEDGER.map((child, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-black text-primary uppercase">{child.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{child.feeStatus}% Collected</p>
                  </div>
                  <Progress value={child.feeStatus} className="h-2 rounded-full" />
                  <div className="flex justify-between text-[9px] font-black uppercase text-primary/40 tracking-widest">
                    <span>Outstanding: {((1 - child.feeStatus/100) * 150000).toLocaleString()} XAF</span>
                    <button className="text-secondary hover:underline">Clear Balance</button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-accent flex flex-col items-center text-center gap-4">
                 <div className="p-4 bg-primary/5 rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-secondary opacity-40" />
                 </div>
                 <p className="text-[10px] text-muted-foreground leading-relaxed italic font-medium">
                   "Annual license renewals and tuition fees are synchronized with the national school registry. Verified receipts are available in the Finance module."
                 </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 6. LIBRARIAN DASHBOARD VIEW
  if (isLibrarian) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-[1.5rem] shadow-xl border-2 border-white">
              <Library className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter uppercase leading-none">Library Command Center</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-secondary text-primary border-none font-black h-5 px-3 text-[9px] tracking-widest uppercase">Node Curator</Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• Verified Registry Sync</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="h-11 px-6 rounded-xl font-bold border-primary/10 bg-white gap-2 shadow-sm">
              <Link href="/dashboard/library"><Book className="w-4 h-4 text-primary" /> Manage Catalog</Link>
            </Button>
            <Button 
              className="h-11 px-8 shadow-xl font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl"
              onClick={() => setIsIssuingLoan(true)}
            >
              <Plus className="w-4 h-4" /> Issue Loan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Volumes", value: "1,420 Items", icon: BookMarked, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Loans", value: "85 Checked Out", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Overdue Items", value: "12 Alerts", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
            { label: "Node Capacity", value: "92% Utilized", icon: LayoutGrid, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary"/> Circulation Velocity
                </CardTitle>
                <CardDescription>Aggregate borrowing trends for current session.</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/10 text-primary font-bold h-7 px-4">REGISTRY ACTIVE</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_PERIODS.monthly}>
                  <defs>
                    <linearGradient id="colorLoan" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', shadow: 'none' }} />
                  <Area name="Loan Volume" type="monotone" dataKey="loans" stroke="#264D73" strokeWidth={4} fill="url(#colorLoan)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white flex flex-col">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <PieChart className="w-5 h-5 text-secondary" />
                Collection Density
              </CardTitle>
              <CardDescription className="text-white/60 text-xs">Distribution by volume category.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-10">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={LIBRARIAN_CATEGORY_DATA}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} />
                  <YAxis hide />
                  <RechartsTooltip />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={25}>
                    {LIBRARIAN_CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 space-y-3">
                {LIBRARIAN_CATEGORY_DATA.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/20 border border-accent">
                    <span className="text-xs font-bold text-primary uppercase">{item.name}</span>
                    <Badge variant="outline" className="border-primary/10 text-primary font-black">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                  <Activity className="w-5 h-5 text-secondary" />
                  Active Circulation Registry
                </CardTitle>
                <CardDescription>Live tracking of checked-out pedagogical materials.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Borrower</TableHead>
                    <TableHead>Requested Volume</TableHead>
                    <TableHead className="text-center">Due Date</TableHead>
                    <TableHead className="text-right pr-8">Lifecycle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LIBRARIAN_RECENT_LOANS.map((loan, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b last:border-0 h-16">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border shadow-sm">
                            <AvatarImage src={loan.avatar} />
                            <AvatarFallback>{loan.student.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs md:text-sm text-primary uppercase leading-none mb-1">{loan.student}</span>
                            <span className="text-[8px] font-black uppercase text-muted-foreground">{loan.class}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-primary text-xs uppercase">{loan.book}</TableCell>
                      <TableCell className="text-center font-mono text-[10px] font-bold text-muted-foreground">{loan.due}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge className={cn(
                          "text-[8px] font-black uppercase px-2 h-5 border-none",
                          loan.status === 'Overdue' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        )}>
                          {loan.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8">
              <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-secondary" />
                Inventory Alerts
              </CardTitle>
              <CardDescription>Critical stock levels for high-demand curriculum.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {LIBRARIAN_LOW_STOCK.map((item, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 border-b last:border-0 h-16">
                      <TableCell className="pl-8">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black text-primary uppercase leading-none">{item.title}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">By {item.author}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex flex-col items-end">
                          <span className={cn("text-sm font-black", item.available === 0 ? "text-red-600" : "item.available < 3 ? 'text-amber-600' : 'text-primary'")}>
                            {item.available} <span className="text-[10px] opacity-40">/ {item.total}</span>
                          </span>
                          <span className="text-[8px] font-bold uppercase opacity-40">Stock Level</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-4 flex justify-center border-t">
               <div className="flex items-center gap-2 text-muted-foreground italic">
                  <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Verified Institutional Inventory</p>
               </div>
            </CardFooter>
          </Card>
        </div>

        {/* LOAN ISSUANCE DIALOG */}
        <Dialog open={isIssuingLoan} onOpenChange={setIsIssuingLoan}>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white relative">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <BookMarked className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black">Issue Material Loan</DialogTitle>
                  <DialogDescription className="text-white/60">Registry authorization for pedagogical volumes.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsIssuingLoan(false)} className="absolute top-4 right-4 text-white hover:bg-white/10">
                <X className="w-6 h-6" />
              </Button>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Student (Matricule)</Label>
                  <Select value={loanFormData.studentId} onValueChange={(v) => setLoanFormData({...loanFormData, studentId: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                      <SelectValue placeholder="Choose Borrower..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_STUDENTS_LIST.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Volume</Label>
                  <Select value={loanFormData.bookId} onValueChange={(v) => setLoanFormData({...loanFormData, bookId: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                      <SelectValue placeholder="Choose Book..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_BOOKS.map(b => <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Standard Duration</Label>
                  <div className="flex gap-2">
                    {["7", "14", "21"].map(d => (
                      <Button 
                        key={d}
                        variant={loanFormData.duration === d ? "default" : "outline"}
                        className={cn("flex-1 h-11 rounded-xl font-black", loanFormData.duration === d ? "bg-primary text-white" : "border-primary/10")}
                        onClick={() => setLoanFormData({...loanFormData, duration: d})}
                      >
                        {d} Days
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
              <Button className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3" onClick={handleIssueLoan} disabled={isProcessingLoan}>
                {isProcessingLoan ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-secondary" />}
                Authorize Loan Issue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // 7. BURSAR DASHBOARD VIEW
  if (isBursar) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-[1.5rem] shadow-xl border-2 border-white">
              <Coins className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter uppercase leading-none">Financial Management Hub</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-secondary text-primary border-none font-black h-5 px-3 text-[9px] tracking-widest uppercase">Bursar Office</Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• Global Revenue Node</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="h-11 px-6 rounded-xl font-bold border-primary/10 bg-white gap-2 shadow-sm">
              <Link href="/dashboard/fees"><Receipt className="w-4 h-4 text-primary" /> Collect Fees</Link>
            </Button>
            <Button className="h-11 px-8 shadow-xl font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl">
              <Printer className="w-4 h-4" /> Print Ledger
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Net Collection", value: "22.45M XAF", icon: Coins, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Outstanding Arrears", value: "4.12M XAF", icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
            { label: "Intake Efficiency", value: "82.4%", icon: PieChart, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Transaction Count", value: "1,240 Receipts", icon: Receipt, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-8 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary"/> Revenue Intake Velocity
                </CardTitle>
                <CardDescription>Chronological tracking of fee collections for the current period.</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/10 text-primary font-bold h-7 px-4">SECURE NODE SYNC</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BURSAR_REVENUE_TRENDS}>
                  <defs>
                    <linearGradient id="colorBursarRev" x1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', shadow: 'none' }} />
                  <Area name="Intake (XAF)" type="monotone" dataKey="revenue" stroke="#264D73" strokeWidth={4} fill="url(#colorBursarRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white flex flex-col">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Coins className="w-5 h-5 text-secondary" />
                Fee Allocation
              </CardTitle>
              <CardDescription className="text-white/60 text-xs">Distribution by fee category.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-10 px-8 space-y-6">
              {BURSAR_FEE_DISTRIBUTION.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary/60">
                    <span>{item.name}</span>
                    <span>{((item.value / 17000000) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(item.value / 17000000) * 100} className="h-1.5 rounded-full" />
                </div>
              ))}
              <div className="pt-4 border-t">
                 <Button asChild variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5">
                   <Link href="/dashboard/fees">View Policy Settings <ChevronRight className="w-3.5 h-3.5"/></Link>
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                  <History className="w-5 h-5 text-secondary" />
                  Recent Collection Registry
                </CardTitle>
                <CardDescription>Verified chronological record of latest payments.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Student Profile</TableHead>
                    <TableHead>Fee Category</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-right pr-8">Integrity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BURSAR_RECENT_COLLECTIONS.map((tx, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b last:border-0 h-16">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border shadow-sm">
                            <AvatarImage src={tx.avatar} />
                            <AvatarFallback>{tx.student.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[11px] font-black text-primary uppercase leading-none mb-1">{tx.student}</p>
                            <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase">{tx.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-primary text-xs uppercase">{tx.type}</TableCell>
                      <TableCell className="text-center font-black text-sm text-primary">{tx.amount} <span className="text-[9px] opacity-40">XAF</span></TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 font-bold text-[8px] uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Secure
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-8">
              <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-secondary" />
                Class Compliance Matrix
              </CardTitle>
              <CardDescription>Intake status summarized by academic level.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {BURSAR_CLASS_REVENUE.map((cls, i) => (
                    <TableRow key={i} className="hover:bg-primary/5 border-b last:border-0 h-16">
                      <TableCell className="pl-8">
                        <p className="text-xs font-black text-primary uppercase leading-none">{cls.class}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Target: {cls.target.toLocaleString()} XAF</p>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "text-sm font-black",
                            cls.percentage >= 90 ? "text-emerald-600" : cls.percentage < 60 ? "text-red-600" : "text-primary"
                          )}>{cls.percentage}%</span>
                          <span className="text-[8px] font-bold uppercase opacity-40">Compliance</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-4 flex justify-center border-t">
               <div className="flex items-center gap-2 text-muted-foreground italic">
                  <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Verified Institutional Financial Record</p>
               </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 8. STANDARD OVERVIEW (OTHER)
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white shadow-xl shrink-0 ring-4 ring-primary/5">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter">Welcome back, {user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-black uppercase text-[10px] h-5 px-3">
                {user.role.replace('_', ' ')}
              </Badge>
              {user.school && (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• {user.school.name}</span>
              )}
            </div>
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
          <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all">
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
          <CardContent className="h-[350px] pt-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_PERIODS.monthly}>
                <defs>
                  <linearGradient id="colorPulse" x1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="performance" stroke="hsl(var(--primary))" strokeWidth={4} fill="url(#colorPulse)" />
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
            <div className="pt-6 border-t border-white/10 flex justify-center gap-6 relative z-10">
                <div className="flex flex-col items-center gap-1 opacity-40">
                   <QrCode className="w-8 h-8" />
                   <span className="text-[7px] font-black uppercase tracking-widest">ID Scan</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-40">
                   <Lock className="w-8 h-8" />
                   <span className="text-[7px] font-black uppercase tracking-widest">Vault</span>
                </div>
             </div>
            <Button asChild variant="outline" className="w-full rounded-xl font-bold border-primary/10 bg-white">
              <Link href="/dashboard/profile">View Secure Profile</Link>
            </Button>
          </Card>
          
          <Card className="border-none shadow-sm bg-primary text-white p-6 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-secondary" />
                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">System Notice</h4>
             </div>
             <p className="text-xs font-medium leading-relaxed italic">
               "Dashboard synchronization is currently operating at optimal capacity across the node."
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SignatureSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 25C15 25 20 15 25 15C30 15 35 30 40 30C45 30 50 10 55 10C60 10 65 35 70 35C75 35 80 20 85 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
