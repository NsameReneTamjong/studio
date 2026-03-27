
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
  History
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
  Pie
} from "recharts";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// MOCK DATA
const PERFORMANCE_DATA = [
  { name: 'Form 1', average: 14.2, students: 45 },
  { name: 'Form 2', average: 12.8, students: 40 },
  { name: 'Form 3', average: 15.5, students: 38 },
  { name: 'Form 4', average: 13.1, students: 42 },
  { name: 'Form 5', average: 16.4, students: 42 },
  { name: 'L6', average: 11.9, students: 35 },
  { name: 'U6', average: 17.2, students: 30 },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 4500000 },
  { month: 'Feb', revenue: 5200000 },
  { month: 'Mar', revenue: 4800000 },
  { month: 'Apr', revenue: 6100000 },
  { month: 'May', revenue: 7500000 },
];

const FEE_TYPE_DISTRIBUTION = [
  { name: 'Tuition', value: 12500000, color: '#264D73' },
  { name: 'Uniforms', value: 2450000, color: '#67D0E4' },
  { name: 'Exams', value: 1800000, color: '#FCD116' },
  { name: 'Library', value: 850000, color: '#CE1126' },
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

  const stats = useMemo(() => ({
    totalStudents: 2500,
    activeStaff: 120,
    totalRevenue: "22.4M",
    avgAttendance: "94.2%",
    admissionIntake: "+15% YoY",
    systemHealth: "Optimal"
  }), []);

  const handlePrint = (report: any) => {
    setPreviewReport(report);
  };

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      window.print();
      toast({ title: "Report Exported", description: "The strategic dossier has been prepared for printing." });
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
            <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter uppercase">Institutional Statistics</h1>
            <p className="text-muted-foreground text-sm">Comprehensive node-level strategic analysis and performance auditing.</p>
          </div>
        </div>
        <Button onClick={() => handlePrint({ type: 'Global Audit', date: new Date().toLocaleDateString() })} className="gap-2 shadow-lg h-12 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs">
          <Printer className="w-5 h-5" /> Generate Audit Report
        </Button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrollment", value: stats.totalStudents, icon: GraduationCap, color: "text-blue-600", trend: "+120 this term" },
          { label: "Net Revenue", value: `${stats.totalRevenue} XAF`, icon: Coins, color: "text-emerald-600", trend: "82% Collected" },
          { label: "Attendance", value: stats.avgAttendance, icon: UserCheck, color: "text-purple-600", trend: "Target Met" },
          { label: "Admission Velocity", value: stats.admissionIntake, icon: TrendingUp, color: "text-orange-600", trend: "Upward growth" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all bg-white">
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

      {/* TABS FOR DEEP DIVE */}
      <Tabs defaultValue="finance" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[800px] mb-8 bg-white shadow-sm border h-auto p-1.5 rounded-[1.5rem]">
          <TabsTrigger value="finance" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <Coins className="w-4 h-4" /> Finance Audit
          </TabsTrigger>
          <TabsTrigger value="pedagogy" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <Award className="w-4 h-4" /> Pedagogical Ranks
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <Activity className="w-4 h-4" /> Presence Matrix
          </TabsTrigger>
          <TabsTrigger value="admissions" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <UserPlus className="w-4 h-4" /> Intake Analysis
          </TabsTrigger>
        </TabsList>

        {/* FINANCE AUDIT */}
        <TabsContent value="finance" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-8 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-primary/5 border-b p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-primary uppercase flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" /> Monthly Revenue Velocity
                  </CardTitle>
                  <CardDescription>Visualizing collection performance across the session.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-secondary/20 text-primary border-none font-black px-3 h-7">2023/24 SESSION</Badge>
              </CardHeader>
              <CardContent className="h-[350px] pt-10">
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
                    <Area name="Revenue (XAF)" type="monotone" dataKey="revenue" stroke="#264D73" strokeWidth={4} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-primary p-8 text-white">
                <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-secondary" /> Fee Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <ResponsiveContainer width="100%" height={200}>
                  <RePieChart>
                    <Pie
                      data={FEE_TYPE_DISTRIBUTION}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {FEE_TYPE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-3">
                  {FEE_TYPE_DISTRIBUTION.map((type, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/20 border border-accent">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                        <span className="text-xs font-bold text-primary">{type.name}</span>
                      </div>
                      <span className="text-xs font-black text-primary">{(type.value / 1000000).toFixed(1)}M XAF</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PEDAGOGICAL RANKS */}
        <TabsContent value="pedagogy" className="animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-primary p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Award className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black uppercase">Excellence Leaderboard</CardTitle>
                    <CardDescription className="text-white/60">Top performing students across all institutional sections.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/30 uppercase text-[10px] font-black tracking-widest">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Global Rank</TableHead>
                      <TableHead>Student Profile</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right pr-8">Term Average</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TOP_STUDENTS.map((s) => (
                      <TableRow key={s.rank} className="hover:bg-accent/5">
                        <TableCell className="pl-8">
                          <Badge className={cn(
                            "h-8 w-8 rounded-full border-none flex items-center justify-center font-black",
                            s.rank === 1 ? "bg-amber-100 text-amber-700" : "bg-primary/5 text-primary"
                          )}>{s.rank}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <AvatarImage src={s.avatar} />
                              <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-sm text-primary uppercase">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px] font-bold">{s.class}</Badge></TableCell>
                        <TableCell className="text-right pr-8 font-black text-primary text-lg">{s.avg.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="lg:col-span-5 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-accent/5 border-b p-8">
                <CardTitle className="text-xl font-black text-primary uppercase flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-secondary" /> Level Performance Matrix
                </CardTitle>
                <CardDescription>Average Moy/20 per class level stream.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PERFORMANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="average" radius={[10, 10, 0, 0]}>
                      {PERFORMANCE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.average >= 12 ? '#264D73' : '#67D0E4'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PRESENCE MATRIX */}
        <TabsContent value="attendance" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm rounded-[2rem] bg-white">
              <CardHeader className="p-8 pb-2">
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter">Attendance Heatmap</CardTitle>
                <CardDescription>Visualizing student presence trends across the academic term.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] p-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#67D0E4" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#67D0E4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#67D0E4" strokeWidth={4} fill="url(#colorAtt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[2rem] bg-white">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter">Class Presence Audit</CardTitle>
                <CardDescription>Daily verified presence records by class level.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 text-[10px] font-black uppercase">
                    <TableRow>
                      <TableHead className="pl-8">Class Level</TableHead>
                      <TableHead className="text-center">Enrolled</TableHead>
                      <TableHead className="text-center">Present %</TableHead>
                      <TableHead className="text-right pr-8">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PERFORMANCE_DATA.map((cls) => (
                      <TableRow key={cls.name}>
                        <TableCell className="pl-8 font-bold text-sm">{cls.name}</TableCell>
                        <TableCell className="text-center font-bold text-primary">{cls.students}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-black text-green-600">94.2%</span>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="w-2 h-2 rounded-full bg-green-500 ml-auto animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ADMISSIONS ANALYSIS */}
        <TabsContent value="admissions" className="mt-0 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] bg-white">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter">Intake Growth Ledger</CardTitle>
                <CardDescription>Tracking new admissions velocity per month.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="revenue" radius={[10, 10, 0, 0]} fill="#264D73" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 border-none shadow-sm rounded-[2rem] bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
               <div className="p-6 bg-accent rounded-full">
                  <Users className="w-16 h-16 text-primary" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-primary uppercase leading-tight">Gender Diversity</h3>
                  <p className="text-xs text-muted-foreground mt-2">Verified demographics across the node registry.</p>
               </div>
               <div className="w-full space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-primary/60">
                    <span>Male</span>
                    <span>52%</span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '52%' }} />
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-secondary">
                    <span>Female</span>
                    <span>48%</span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: '48%' }} />
                  </div>
               </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* REPORT PREVIEW DIALOG */}
      <Dialog open={!!previewReport} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-8 text-white no-print shrink-0 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Institutional Strategic Report</DialogTitle>
                  <DialogDescription className="text-white/60">Verified strategic data dossier for institutional governance.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewReport(null)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
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
                  <p className="text-[10px] md:text-xs font-bold uppercase opacity-60 tracking-[0.3em] underline underline-offset-4 decoration-double">GLOBAL STRATEGIC DATA AUDIT & PERFORMANCE LEDGER</p>
               </div>

               {/* REVENUE MATRIX */}
               <section className="space-y-6">
                  <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2">
                    <Coins className="w-4 h-4" /> Financial Integrity Record
                  </h4>
                  <div className="grid grid-cols-2 gap-8 bg-primary/5 p-6 rounded-2xl border border-black/5">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Term Collection Recap</p>
                        <div className="space-y-2">
                           {FEE_TYPE_DISTRIBUTION.map((f, i) => (
                             <div key={i} className="flex justify-between text-xs font-bold">
                                <span className="opacity-60">{f.name}:</span>
                                <span>{f.value.toLocaleString()} XAF</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="flex flex-col items-center justify-center text-center space-y-2 bg-white rounded-xl shadow-sm border p-4">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Aggregate Net Intake</p>
                        <p className="text-3xl font-black text-primary underline underline-offset-4 decoration-double">22,450,000 XAF</p>
                        <Badge variant="outline" className="border-green-600 text-green-700 font-black text-[8px] uppercase tracking-widest">82.4% Target Achieved</Badge>
                     </div>
                  </div>
               </section>

               {/* PEDAGOGICAL MATRIX */}
               <section className="space-y-6">
                  <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Academic Merit Registry
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                     <Table className="border-collapse border-2 border-black/10">
                        <TableHeader className="bg-black/5">
                           <TableRow>
                              <TableHead className="text-[10px] font-black uppercase text-black">Top Global Rank</TableHead>
                              <TableHead className="text-[10px] font-black uppercase text-black">Student Identity</TableHead>
                              <TableHead className="text-center text-[10px] font-black uppercase text-black">Academic Level</TableHead>
                              <TableHead className="text-right text-[10px] font-black uppercase text-black pr-6">Moy/20</TableHead>
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
                  </div>
               </section>

               {/* REGISTRY SEALS */}
               <div className="pt-12 border-t border-black/5 flex justify-between items-end">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <QrCode className="w-20 h-20 opacity-10" />
                    <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 leading-tight">Institutional<br/>Data Integrity QR</p>
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
                    <img src={platformSettings.logo} alt="SaaS" className="w-4 h-4 object-contain opacity-20" />
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
                onClick={() => toast({ title: "Packet Prepared", description: "Report PDF is being generated." })}
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
