
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Scale
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

// MOCK DATA FOR 20 STATISTICS
const PERFORMANCE_DATA = [
  { name: 'Form 1', average: 14.2, students: 45, passRate: 88 },
  { name: 'Form 2', average: 12.8, students: 40, passRate: 75 },
  { name: 'Form 3', average: 15.5, students: 38, passRate: 92 },
  { name: 'Form 4', average: 13.1, students: 42, passRate: 80 },
  { name: 'Form 5', average: 16.4, students: 42, passRate: 95 },
  { name: 'L6', average: 11.9, students: 35, passRate: 70 },
  { name: 'U6', average: 17.2, students: 30, passRate: 98 },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 4500000, expected: 5000000 },
  { month: 'Feb', revenue: 5200000, expected: 5000000 },
  { month: 'Mar', revenue: 4800000, expected: 5000000 },
  { month: 'Apr', revenue: 6100000, expected: 6000000 },
  { month: 'May', revenue: 7500000, expected: 8000000 },
];

const FEE_TYPE_DISTRIBUTION = [
  { name: 'Tuition Fees', value: 12500000, color: '#264D73' },
  { name: 'Uniform Packages', value: 2450000, color: '#67D0E4' },
  { name: 'PTA Contribution', value: 1800000, color: '#FCD116' },
  { name: 'Library & Exams', value: 850000, color: '#CE1126' },
];

const SECTION_PERFORMANCE = [
  { name: 'Anglophone', avg: 15.2, enrollment: 1250 },
  { name: 'Francophone', avg: 14.8, enrollment: 1050 },
  { name: 'Technical', avg: 13.5, enrollment: 200 },
];

const TOP_STUDENTS = [
  { name: "Alice Thompson", class: "Form 5", avg: 18.45, rank: 1, avatar: "https://picsum.photos/seed/s1/100/100" },
  { name: "Bob Richards", class: "U6", avg: 17.92, rank: 2, avatar: "https://picsum.photos/seed/s2/100/100" },
  { name: "Charlie Davis", class: "Form 3", avg: 17.15, rank: 3, avatar: "https://picsum.photos/seed/s3/100/100" },
  { name: "Diana Prince", class: "Form 5", avg: 16.88, rank: 4, avatar: "https://picsum.photos/seed/s4/100/100" },
];

export default function StatisticsPage() {
  const { user, platformSettings } = useAuth();
  const { language } = useI18n();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("finance");
  const [previewReport, setPreviewReport] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // THE 20 CORE STATISTICS MATRIX
  const statsMatrix = useMemo(() => ({
    // Global Level (1-7)
    totalStudents: 2500,
    globalAverage: "14.25",
    attendanceRate: "94.2%",
    genderParity: "1.02", // M/F Ratio
    totalStaff: 120,
    systemUptime: "99.9%",
    licenseCompliance: "88%",
    // Financial Level (8-12)
    totalRevenue: "22.45M",
    totalArrears: "4.12M",
    tuitionIntake: "12.5M",
    uniformRevenue: "2.45M",
    ptaContributions: "1.8M",
    // Section Level (13-15)
    bestSection: "Anglophone",
    sectionEnrollmentDelta: "+5%",
    sectionAttendanceVariance: "1.2%",
    // Class Level (16-20)
    topClass: "Form 5",
    excellencePeak: "18.45",
    interventionRequired: 2, // Classes below 10/20
    studentTeacherRatio: "21:1",
    assessmentVolume: "14,500" // Total questions answered/graded
  }), []);

  const handlePrint = (report: any) => {
    setPreviewReport(report);
  };

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      window.print();
      toast({ title: "Strategic Dossier Exported", description: "The full institutional audit has been prepared." });
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-xl border-2 border-white">
            <BarChart3 className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter uppercase leading-none">Strategic Intelligence</h1>
            <p className="text-muted-foreground text-sm mt-1">Deep-dive auditing across 20 core institutional performance indicators.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-primary/10 bg-white gap-2 font-bold" onClick={() => toast({ title: "Refreshing Node Data..." })}>
            <Zap className="w-4 h-4 text-secondary" /> Live Sync
          </Button>
          <Button onClick={() => handlePrint({ type: 'Global Strategic Audit', date: new Date().toLocaleDateString() })} className="gap-2 shadow-xl h-12 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs">
            <Printer className="w-5 h-5" /> Export Strategic Dossier
          </Button>
        </div>
      </div>

      {/* QUICK INSIGHTS GRID (Top 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Global Enrollment", value: statsMatrix.totalStudents, icon: GraduationCap, color: "text-blue-600", trend: "+120 this term" },
          { label: "Net Intake (XAF)", value: statsMatrix.totalRevenue, icon: Coins, color: "text-emerald-600", trend: `${statsMatrix.licenseCompliance} License Paid` },
          { label: "Attendance Mean", value: statsMatrix.attendanceRate, icon: UserCheck, color: "text-purple-600", trend: "Threshold Met" },
          { label: "System Integrity", value: statsMatrix.systemUptime, icon: ShieldCheck, color: "text-orange-600", trend: "Verified Node" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</CardTitle>
              <stat.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-primary">{stat.value}</div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* STRATEGIC TABS */}
      <Tabs defaultValue="finance" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[900px] mb-8 bg-white shadow-sm border h-auto p-1.5 rounded-[1.5rem] overflow-x-auto no-scrollbar">
          <TabsTrigger value="finance" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <Coins className="w-4 h-4" /> Financial Matrix
          </TabsTrigger>
          <TabsTrigger value="pedagogy" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <Award className="w-4 h-4" /> Academic Merit
          </TabsTrigger>
          <TabsTrigger value="sections" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <Globe className="w-4 h-4" /> Section Audit
          </TabsTrigger>
          <TabsTrigger value="intake" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <UserPlus className="w-4 h-4" /> Intake Analysis
          </TabsTrigger>
        </TabsList>

        {/* FINANCIAL MATRIX */}
        <TabsContent value="finance" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-primary/5 border-b p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-primary uppercase flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" /> Revenue Absorption Velocity
                  </CardTitle>
                  <CardDescription>Target vs Actual collection for the {platformSettings.paymentDeadline} cycle.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] pt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#264D73" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#264D73" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area name="Actual Revenue" type="monotone" dataKey="revenue" stroke="#264D73" strokeWidth={4} fill="url(#colorRev)" />
                    <Area name="Expected Target" type="monotone" dataKey="expected" stroke="#67D0E4" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-primary text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-black uppercase opacity-60 tracking-widest">Aggregate Arrears</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-secondary">{statsMatrix.totalArrears} XAF</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase opacity-60"><span>Recovery Progress</span><span>74%</span></div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: '74%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-[2rem] bg-white p-6 space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest border-b pb-2">Fee Type Performance</h4>
                <div className="space-y-3">
                  {FEE_TYPE_DISTRIBUTION.map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{f.name}</span>
                      </div>
                      <span className="text-xs font-black text-primary">{(f.value / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ACADEMIC MERIT */}
        <TabsContent value="pedagogy" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-primary p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-secondary"><Award className="w-8 h-8" /></div>
                  <div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight">Institutional Excellence List</CardTitle>
                    <CardDescription className="text-white/60">Top performers across all class streams & sections.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-accent/30 uppercase text-[10px] font-black">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Global Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right pr-8">Mean Moy/20</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TOP_STUDENTS.map((s) => (
                      <TableRow key={s.rank} className="hover:bg-accent/5">
                        <TableCell className="pl-8"><Badge className="h-7 w-7 rounded-full bg-primary/5 text-primary border-none flex items-center justify-center font-black">{s.rank}</Badge></TableCell>
                        <TableCell className="font-bold text-sm text-primary uppercase">{s.name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[9px] font-bold">{s.class}</Badge></TableCell>
                        <TableCell className="text-right pr-8 font-black text-primary text-lg">{s.avg.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="lg:col-span-5 space-y-6">
              <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-8 pb-2">
                  <CardTitle className="text-lg font-black text-primary uppercase flex items-center gap-2">
                    <Scale className="w-5 h-5 text-secondary" /> Pass Rate Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PERFORMANCE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="passRate" radius={[10, 10, 0, 0]}>
                        {PERFORMANCE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.passRate >= 80 ? '#264D73' : '#67D0E4'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-none shadow-sm bg-blue-50 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-black uppercase text-blue-600">Peak Avg</p>
                  <p className="text-2xl font-black text-blue-700">{statsMatrix.excellencePeak}</p>
                </Card>
                <Card className="border-none shadow-sm bg-red-50 p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-black uppercase text-red-600">Interventions</p>
                  <p className="text-2xl font-black text-red-700">{statsMatrix.interventionRequired} Classes</p>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SECTION AUDIT */}
        <TabsContent value="sections" className="mt-0 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SECTION_PERFORMANCE.map((section) => (
              <Card key={section.name} className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all">
                <div className="bg-primary p-6 text-white text-center space-y-1">
                  <Globe className="w-8 h-8 text-secondary mx-auto mb-2 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <CardTitle className="text-xl font-black uppercase tracking-tight">{section.name}</CardTitle>
                  <CardDescription className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Institutional Node Wing</CardDescription>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-end border-b border-accent pb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Enrollment</p>
                      <p className="text-2xl font-black text-primary">{section.enrollment}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-primary/10 text-primary font-black uppercase h-6">ACTIVE</Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Pedagogical Mean</p>
                      <p className="text-3xl font-black text-secondary underline decoration-double underline-offset-4">{section.avg}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-green-600 flex items-center justify-end gap-1"><ArrowUpRight className="w-3 h-3"/> +0.4%</p>
                      <p className="text-[8px] font-black text-muted-foreground uppercase opacity-40">Trends vs Prev Term</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* INTAKE ANALYSIS */}
        <TabsContent value="intake" className="mt-0">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-10 border-b flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black text-primary uppercase tracking-tighter">Admission Intake Velocity</CardTitle>
                <CardDescription>Tracking new node registrations and demographic diversity.</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="bg-accent/30 p-4 rounded-2xl text-center min-w-[120px]">
                  <p className="text-[10px] font-black uppercase text-primary/40">M/F Ratio</p>
                  <p className="text-xl font-black text-primary">{statsMatrix.genderParity}</p>
                </div>
                <div className="bg-accent/30 p-4 rounded-2xl text-center min-w-[120px]">
                  <p className="text-[10px] font-black uppercase text-primary/40">Staff Load</p>
                  <p className="text-xl font-black text-primary">{statsMatrix.studentTeacherRatio}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="revenue" radius={[15, 15, 0, 0]} fill="#264D73">
                    {REVENUE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === REVENUE_DATA.length - 1 ? '#67D0E4' : '#264D73'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* STRATEGIC REPORT DIALOG */}
      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-8 text-white no-print shrink-0 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary"><BarChart3 className="w-8 h-8" /></div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase">Institutional Strategic Audit</DialogTitle>
                  <DialogDescription className="text-white/60">Comprehensive data dossier for node governance.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewReport(null)} className="text-white/40 hover:text-white"><X className="w-6 h-6" /></Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-muted p-4 md:p-10 print:p-0 print:bg-white no-scrollbar">
            <div id="printable-strategic-report" className="bg-white p-8 md:p-16 border-2 border-black/10 shadow-sm relative flex flex-col space-y-12 font-serif text-black print:border-none print:shadow-none min-w-[800px] mx-auto">
               
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
                  {/* Category 1: Global Enrollment & Scale */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2"><Users className="w-4 h-4"/> Institutional Scale</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">1. Global Enrollment:</span><span>{statsMatrix.totalStudents} Students</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">2. Staff Presence:</span><span>{statsMatrix.totalStaff} Members</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">3. Teacher-Student Ratio:</span><span>{statsMatrix.studentTeacherRatio}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">4. Gender Parity Index:</span><span>{statsMatrix.genderParity}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">5. System Integrity:</span><span className="text-green-600 font-black">OPTIMAL</span></div>
                    </div>
                  </section>

                  {/* Category 2: Academic Excellence */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2"><Award className="w-4 h-4"/> Pedagogical Merit</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">6. Institutional Mean:</span><span>{statsMatrix.globalAverage} / 20</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">7. Excellence Peak:</span><span>{statsMatrix.excellencePeak} / 20</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">8. Top Section:</span><span>{statsMatrix.bestSection}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">9. Best Performing Class:</span><span>{statsMatrix.topClass}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">10. Active Interventions:</span><span className="text-red-600 font-black">{statsMatrix.interventionRequired} Classes</span></div>
                    </div>
                  </section>

                  {/* Category 3: Financial Health */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2"><Coins className="w-4 h-4"/> Financial Matrix</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">11. Aggregate Net Revenue:</span><span>{statsMatrix.totalRevenue} XAF</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">12. Total Outstanding Arrears:</span><span className="text-red-600">{statsMatrix.totalArrears} XAF</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">13. Tuition Intake:</span><span>{statsMatrix.tuitionIntake} XAF</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">14. Auxiliary Revenue:</span><span>{statsMatrix.uniformRevenue} XAF</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">15. License Compliance:</span><span>{statsMatrix.licenseCompliance}</span></div>
                    </div>
                  </section>

                  {/* Category 4: Operational Data */}
                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2"><Activity className="w-4 h-4"/> Operational Pulse</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">16. Global Attendance Mean:</span><span>{statsMatrix.attendanceRate}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">17. Sectional Variance:</span><span>{statsMatrix.sectionAttendanceVariance}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">18. Assessment Volume:</span><span>{statsMatrix.assessmentVolume}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">19. Intake Growth Delta:</span><span>{statsMatrix.sectionEnrollmentDelta}</span></div>
                       <div className="flex justify-between text-xs font-bold"><span className="opacity-60">20. Digital Node Uptime:</span><span>{statsMatrix.systemUptime}</span></div>
                    </div>
                  </section>
               </div>

               {/* TOP PERFORMERS TABLE (Deep Dive) */}
               <section className="space-y-6 pt-8">
                  <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Academic Merit Registry (Top 3)
                  </h4>
                  <Table className="border-collapse border-2 border-black/10">
                    <TableHeader className="bg-black/5">
                       <TableRow>
                          <TableHead className="text-[10px] font-black uppercase text-black">Rank</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-black">Student Profile</TableHead>
                          <TableHead className="text-center text-[10px] font-black uppercase text-black">Class</TableHead>
                          <TableHead className="text-right text-[10px] font-black uppercase text-black pr-6">Mean Moy/20</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {TOP_STUDENTS.slice(0, 3).map((s, i) => (
                         <TableRow key={i} className="border-b border-black/5">
                            <TableCell className="font-black text-xs">NO. {s.rank}</TableCell>
                            <TableCell className="font-bold text-xs uppercase">{s.name}</TableCell>
                            <TableCell className="text-center font-bold text-xs">{s.class}</TableCell>
                            <TableCell className="text-right pr-6 font-black text-sm">{s.avg.toFixed(2)}</TableCell>
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
                    <div className="h-14 w-full mx-auto bg-primary/5 rounded-xl border-b-2 border-black/40 relative flex items-center justify-center overflow-hidden">
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
              Dismiss Auditor
            </Button>
            <div className="flex flex-col sm:flex-row flex-1 gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs gap-2"
                onClick={() => toast({ title: "Packet Prepared", description: "Strategic PDF is being generated." })}
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button 
                className="flex-1 rounded-2xl h-14 shadow-2xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white hover:bg-primary/90 transition-all active:scale-95" 
                onClick={handleExport}
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
