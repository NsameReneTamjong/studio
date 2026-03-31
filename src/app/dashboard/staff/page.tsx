
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Search, 
  MoreVertical, 
  UserPlus,
  Trash2,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Printer,
  Mail,
  Loader2,
  Pencil,
  Ban,
  User,
  Building2,
  Fingerprint,
  X,
  UserCheck,
  UserX,
  Plus,
  Briefcase,
  GraduationCap,
  History,
  Smartphone,
  MapPin,
  QrCode,
  Download,
  Info,
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  Activity,
  Award,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Target,
  FileBadge,
  Save,
  MessageCircle,
  Signature as SignatureIcon
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section", "Cross-Sectional"];
const REGIONS = ["Adamaoua", "Centre", "East", "Far North", "Littoral", "North", "North West", "South", "South West", "West"];
const EMPLOYMENT_TYPES = ["Permanent", "Part-time", "Public Service"];

// --- TEACHER MOCK DATA ---
const TEACHER_STATS = {
  subjects: [
    { name: "Advanced Physics", classes: 3, materials: 12, scheduled: 15, held: 14, cancelled: 1, attendance: 94, performance: 16.5 },
    { name: "Mathematics", classes: 2, materials: 8, scheduled: 10, held: 10, cancelled: 0, attendance: 92, performance: 14.8 },
  ],
  materialTrend: [
    { month: 'Jan', count: 4 },
    { month: 'Feb', count: 7 },
    { month: 'Mar', count: 5 },
    { month: 'Apr', count: 9 },
    { month: 'May', count: 12 },
  ],
  engagementBreakdown: [
    { name: 'Live Held', value: 24, color: '#10B981' },
    { name: 'Live Cancelled', value: 1, color: '#EF4444' },
    { name: 'Scheduled', value: 2, color: '#3B82F6' },
  ],
  performanceCurve: [
    { month: 'M1', att: 88, perf: 12.5 },
    { month: 'M2', att: 92, perf: 13.8 },
    { month: 'M3', att: 95, perf: 15.2 },
    { month: 'M4', att: 94, perf: 16.4 },
  ]
};

// --- BURSAR MOCK DATA ---
const BURSAR_STATS = {
  handledVolume: "42.5M",
  collectionVelocity: 88,
  monthlyTrend: [
    { name: 'Jan', amount: 4.2 },
    { name: 'Feb', amount: 5.8 },
    { name: 'Mar', amount: 3.1 },
    { name: 'Apr', amount: 7.4 },
    { name: 'May', amount: 8.2 },
  ],
  methodSplit: [
    { name: 'Cash', value: 45, color: '#264D73' },
    { name: 'Mobile Money', value: 55, color: '#67D0E4' },
  ]
};

// --- LIBRARIAN MOCK DATA ---
const LIBRARIAN_STATS = {
  volumesManaged: 1420,
  loanVelocity: 94,
  monthlyExpansion: [
    { name: 'Jan', items: 120 },
    { name: 'Feb', items: 150 },
    { name: 'Mar', items: 80 },
    { name: 'Apr', items: 210 },
    { name: 'May', items: 190 },
  ],
  categorySplit: [
    { name: 'Science', value: 450, color: '#264D73' },
    { name: 'Arts', value: 320, color: '#67D0E4' },
    { name: 'Math', value: 280, color: '#FCD116' },
  ]
};

const MOCK_STAFF = [
  { id: "GBHS26T001", uid: "T1", name: "Dr. Aris Tesla", role: "TEACHER", section: "Anglophone Section", avatar: "https://picsum.photos/seed/t1/100/100", status: "active", employmentType: "Permanent", dob: "15/05/1985", region: "Littoral", email: "tesla@school.edu", phone: "+237 600 11 22 33" },
  { id: "GBHS26B001", uid: "B1", name: "Mme. Ngono Celine", role: "BURSAR", section: "Cross-Sectional", avatar: "https://picsum.photos/seed/b1/100/100", status: "active", employmentType: "Public Service", dob: "22/11/1980", region: "Centre", email: "ngono@school.edu", phone: "+237 600 44 55 66" },
  { id: "GBHS26L001", uid: "L1", name: "Mr. Ebong Paul", role: "LIBRARIAN", section: "Cross-Sectional", avatar: "https://picsum.photos/seed/l1/100/100", status: "active", employmentType: "Permanent", dob: "10/03/1982", region: "South West", email: "ebong@school.edu", phone: "+237 600 77 88 99" },
];

export default function StaffManagementPage() {
  const { user, platformSettings, addStaffRemark } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaff] = useState<any[]>([]);
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  
  const [viewingStaff, setViewingStaff] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [remarkText, setRemarkText] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    region: "Littoral",
    division: "",
    subDivision: "",
    villageOrigin: "",
    role: "TEACHER",
    section: "Anglophone Section",
    education: "",
    professional: "",
    employmentType: "Permanent",
    email: "",
    whatsapp: ""
  });

  const [qualifications, setQualifications] = useState([{ name: "", year: "" }]);

  useEffect(() => {
    setTimeout(() => {
      setStaff(MOCK_STAFF);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleAddQualification = () => {
    setQualifications([...qualifications, { name: "", year: "" }]);
  };

  const handleRemoveQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const handleQualificationChange = (index: number, field: string, value: string) => {
    const updated = [...qualifications];
    (updated[index] as any)[field] = value;
    setQualifications(updated);
  };

  const filteredStaff = staff.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = async () => {
    if (!formData.name || !formData.email) {
      toast({ variant: "destructive", title: "Missing Information", description: "Name and email are required." });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const yearCode = new Date().getFullYear().toString().slice(-2);
      const generatedId = `GBHS${yearCode}${formData.role.charAt(0)}00${staff.length + 1}`;
      const created = {
        ...formData,
        id: generatedId,
        uid: Math.random().toString(),
        avatar: `https://picsum.photos/seed/${generatedId}/100/100`,
        status: "active",
        qualifications: qualifications.filter(q => q.name !== "")
      };
      setStaff([...staff, created]);
      setIsProcessing(false);
      setIsAddModalOpen(false);
      setOnboardingSuccess(created);
      
      // Reset
      setFormData({
        name: "",
        dob: "",
        region: "Littoral",
        division: "",
        subDivision: "",
        villageOrigin: "",
        role: "TEACHER",
        section: "Anglophone Section",
        education: "",
        professional: "",
        employmentType: "Permanent",
        email: "",
        whatsapp: ""
      });
      setQualifications([{ name: "", year: "" }]);
      toast({ title: "Staff Onboarded", description: `Unique ID: ${generatedId}` });
    }, 1500);
  };

  const handleEditStaff = () => {
    if (!editingStaff.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      setStaff(prev => prev.map(s => s.uid === editingStaff.uid ? editingStaff : s));
      setIsProcessing(false);
      setEditingStaff(null);
      toast({ title: "Profile Updated", description: `${editingStaff.name}'s records have been synced.` });
    }, 800);
  };

  const handleToggleStaffStatus = (uid: string) => {
    setStaff(prev => prev.map(s => {
      if (s.uid === uid) {
        const nextStatus = s.status === "active" ? "inactive" : "active";
        toast({ 
          title: nextStatus === "active" ? "Access Restored" : "Access Suspended", 
          description: `${s.name} is now ${nextStatus}.` 
        });
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleSubmitRemark = () => {
    if (!remarkText.trim() || !viewingStaff) return;
    setIsProcessing(true);
    setTimeout(() => {
      addStaffRemark({
        staffId: viewingStaff.id,
        adminName: user?.name || "School Admin",
        text: remarkText
      });
      setRemarkText("");
      setIsProcessing(false);
      toast({ title: "Remark Recorded", description: "This message is now live on the staff dashboard." });
    }, 1000);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TEACHER': return 'bg-purple-100 text-purple-700';
      case 'SCHOOL_ADMIN': return 'bg-blue-100 text-blue-700';
      case 'BURSAR': return 'bg-green-100 text-green-700';
      case 'LIBRARIAN': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDownloadDossier = (staff: any) => {
    toast({ title: "Dossier Preparation", description: `Generating formal records for ${staff.name}...` });
    setTimeout(() => {
      toast({ title: "Download Ready", description: "Institutional dossier saved." });
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              Institutional Staff
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage educational professionals and administrative personnel.</p>
          </div>
        </div>
        
        <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl w-full md:w-auto" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="w-5 h-5" /> Onboard Staff
        </Button>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, ID..." 
              className="pl-10 h-12 bg-accent/20 border-none rounded-xl" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                  <TableHead className="pl-8 py-4">Staff ID</TableHead>
                  <TableHead>Professional Profile</TableHead>
                  <TableHead className="text-center">Section</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((s) => (
                  <TableRow key={s.uid} className="group hover:bg-accent/5 border-b border-accent/10">
                    <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent shrink-0">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{s.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary leading-none mb-1">{s.name.split(' ')[0]}</span>
                          <Badge variant="outline" className={cn("w-fit text-[8px] h-4 uppercase border-none tracking-tighter", getRoleColor(s.role))}>{s.role}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs font-bold text-primary">{s.section}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-3 h-5 border-none",
                        s.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5">
                            <MoreVertical className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-none">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black opacity-40 px-4 py-2">Dossier Options</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={() => setViewingStaff(s)}>
                            <Eye className="w-4 h-4 text-primary/60" /> 
                            <span className="font-bold text-xs">Full Audit View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={() => setEditingStaff({...s})}>
                            <Pencil className="w-4 h-4 text-primary/60" /> 
                            <span className="font-bold text-xs">Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-accent" />
                          <DropdownMenuItem 
                            className={cn(
                              "gap-3 px-4 py-2.5 cursor-pointer",
                              s.status === "active" ? "text-destructive hover:bg-red-50" : "text-green-600 hover:bg-green-50"
                            )}
                            onClick={() => handleToggleStaffStatus(s.uid)}
                          >
                            {s.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            <span className="font-bold text-xs">{s.status === "active" ? "Deactivate" : "Activate"}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* COMPREHENSIVE STAFF AUDIT DOSSIER */}
      <Dialog open={!!viewingStaff} onOpenChange={() => setViewingStaff(null)}>
        <DialogContent className="sm:max-w-7xl w-[95vw] h-[95vh] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-[#F0F2F5] flex flex-col">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-2xl shrink-0">
                  <AvatarImage src={viewingStaff?.avatar} />
                  <AvatarFallback className="text-3xl text-primary bg-white font-black">{viewingStaff?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-3xl font-black uppercase tracking-tighter">{viewingStaff?.name}</DialogTitle>
                    <Badge className="bg-secondary text-primary border-none font-black h-6">{viewingStaff?.role}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-white/60 font-mono text-xs">
                    <span className="flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5" /> MATRICULE: {viewingStaff?.id}</span>
                    <span className="opacity-30">|</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {viewingStaff?.section}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewingStaff(null)} className="text-white hover:bg-white/10 rounded-full transition-all">
                <X className="w-8 h-8" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
            {/* ROLE-SPECIFIC ANALYTICS */}
            {viewingStaff?.role === 'TEACHER' && (
              <div className="space-y-8">
                {/* 1. Metric Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-6 border-none shadow-sm bg-white">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Subject Clusters</p>
                    <div className="text-2xl font-black text-primary">{TEACHER_STATS.subjects.length} Subjects</div>
                  </Card>
                  <Card className="p-6 border-none shadow-sm bg-white">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Node Materials</p>
                    <div className="text-2xl font-black text-primary">{TEACHER_STATS.subjects.reduce((a,b) => a + b.materials, 0)} Uploads</div>
                  </Card>
                  <Card className="p-6 border-none shadow-sm bg-white">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Avg Attendance</p>
                    <div className="text-2xl font-black text-emerald-600">94.2%</div>
                  </Card>
                  <Card className="p-6 border-none shadow-sm bg-white">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Performance Mean</p>
                    <div className="text-2xl font-black text-secondary">15.6 / 20</div>
                  </Card>
                </div>

                {/* 2. Charts Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Chart 1: Material Velocity */}
                  <Card className="border-none shadow-sm p-6 bg-white">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Material Upload Velocity
                    </CardTitle>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={TEACHER_STATS.materialTrend}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                          <YAxis hide />
                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', shadow: 'none' }} />
                          <Bar dataKey="count" fill="#264D73" radius={[10, 10, 0, 0]} barSize={25} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Chart 2: Performance vs Attendance Curve */}
                  <Card className="border-none shadow-sm p-6 bg-white">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                      <LineIcon className="w-4 h-4" /> Success Outcome Mapping
                    </CardTitle>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={TEACHER_STATS.performanceCurve}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                          <YAxis hide />
                          <Tooltip />
                          <Legend iconType="circle" />
                          <Line name="Attendance %" type="monotone" dataKey="att" stroke="#67D0E4" strokeWidth={4} dot={{ r: 6 }} />
                          <Line name="Mean Score" type="monotone" dataKey="perf" stroke="#264D73" strokeWidth={4} dot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Chart 3: Live Session Status */}
                  <Card className="border-none shadow-sm p-6 bg-white">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                      <PieIcon className="w-4 h-4" /> Live Node Lifecycle
                    </CardTitle>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={TEACHER_STATS.engagementBreakdown}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {TEACHER_STATS.engagementBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" align="center" />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Chart 4: Subject Performance Matrix */}
                  <Card className="border-none shadow-sm p-6 bg-white">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Subject Density Registry
                    </CardTitle>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={TEACHER_STATS.subjects} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold' }} width={100} />
                          <Tooltip />
                          <Bar dataKey="performance" fill="#264D73" radius={[0, 10, 10, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* 3. Detailed Subjects Table */}
                <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary p-6 text-white">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Pedagogical Record Ledger</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-accent/30 uppercase text-[9px] font-black">
                        <TableRow>
                          <TableHead className="pl-8 py-4">Course Name</TableHead>
                          <TableHead className="text-center">Streams</TableHead>
                          <TableHead className="text-center">Materials</TableHead>
                          <TableHead className="text-center">Live Status (H/C)</TableHead>
                          <TableHead className="text-right pr-8">Performance Mean</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {TEACHER_STATS.subjects.map((s, i) => (
                          <TableRow key={i} className="hover:bg-accent/5">
                            <TableCell className="pl-8 font-black text-xs uppercase text-primary">{s.name}</TableCell>
                            <TableCell className="text-center font-bold">{s.classes}</TableCell>
                            <TableCell className="text-center font-bold">{s.materials}</TableCell>
                            <TableCell className="text-center">
                               <div className="flex items-center justify-center gap-3">
                                  <Badge className="bg-green-100 text-green-700 border-none font-black h-5">{s.held}</Badge>
                                  <Badge className="bg-red-100 text-red-700 border-none font-black h-5">{s.cancelled}</Badge>
                               </div>
                            </TableCell>
                            <TableCell className="text-right pr-8 font-black text-primary">{s.performance.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* BURSAR ACTIVITY AUDIT */}
            {viewingStaff?.role === 'BURSAR' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8 border-none shadow-sm bg-white flex flex-col justify-center items-center text-center space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-full text-emerald-600"><Coins className="w-12 h-12" /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Intake Handled</p>
                      <h2 className="text-4xl font-black text-primary uppercase">{BURSAR_STATS.handledVolume} XAF</h2>
                    </div>
                  </Card>
                  <Card className="p-8 border-none shadow-sm bg-white">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary mb-6">Monthly Collection Velocity</CardTitle>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={BURSAR_STATS.monthlyTrend}>
                          <Area type="monotone" dataKey="amount" stroke="#264D73" fill="#264D73" fillOpacity={0.1} strokeWidth={4} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* LIBRARIAN CATALOG AUDIT */}
            {viewingStaff?.role === 'LIBRARIAN' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8 border-none shadow-sm bg-white flex flex-col justify-center items-center text-center space-y-4">
                    <div className="p-4 bg-amber-50 rounded-full text-amber-600"><Library className="w-12 h-12" /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Inventory Control</p>
                      <h2 className="text-4xl font-black text-primary uppercase">{LIBRARIAN_STATS.volumesManaged} VOLS</h2>
                    </div>
                  </Card>
                  <Card className="p-8 border-none shadow-sm bg-white">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary mb-6">Accession Growth Rate</CardTitle>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={LIBRARIAN_STATS.monthlyExpansion}>
                          <Bar dataKey="items" fill="#264D73" radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* GLOBAL REMARK SYSTEM */}
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-secondary/20 p-8">
                <CardTitle className="text-xl font-black text-primary uppercase flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" /> Professional Remark & Feedback
                </CardTitle>
                <CardDescription className="text-primary/60">This remark will be visible on the staff member's personal dashboard for professional growth.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Administrative Evaluation</Label>
                  <Textarea 
                    placeholder="Provide professional feedback, appreciation, or areas for improvement..." 
                    className="min-h-[150px] bg-accent/30 border-none rounded-2xl p-6 leading-relaxed italic font-medium"
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-accent/10 p-6 border-t border-accent flex justify-end gap-4">
                 <div className="flex items-center gap-2 text-muted-foreground italic mr-auto">
                    <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Institutional Appraisal</p>
                 </div>
                 <Button variant="outline" className="rounded-xl h-12 font-bold px-8" onClick={() => handleDownloadDossier(viewingStaff)}>
                   <Printer className="w-4 h-4 mr-2" /> Print Full Audit
                 </Button>
                 <Button className="rounded-xl h-12 px-10 font-black uppercase tracking-widest text-[10px] shadow-lg gap-2" onClick={handleSubmitRemark} disabled={isProcessing || !remarkText.trim()}>
                   {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Commit Remark
                 </Button>
              </CardFooter>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* COMPREHENSIVE ONBOARDING DIALOG */}
      <Dialog open={isAddModalOpen} onOpenChange={() => setIsAddModalOpen(false)}>
        <DialogContent className="sm:max-w-4xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <UserPlus className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Onboard Educational Professional</DialogTitle>
                <DialogDescription className="text-white/60">Initialize full institutional employment record.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto bg-white">
            {/* Identity & Origin */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-accent pb-2">
                <Fingerprint className="w-4 h-4 text-primary/40" />
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Biometric Identity & Origin</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Professional Full Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dr. Jean-Pierre Tesla" className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Date of Birth</Label>
                  <Input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Region of Origin</Label>
                  <Select value={formData.region} onValueChange={(v) => setFormData({...formData, region: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Division</Label>
                  <Input value={formData.division} onChange={(e) => setFormData({...formData, division: e.target.value})} placeholder="e.g. Wouri" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Sub-Division</Label>
                  <Input value={formData.subDivision} onChange={(e) => setFormData({...formData, subDivision: e.target.value})} placeholder="e.g. Douala 1er" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Village / Town of Origin</Label>
                  <Input value={formData.villageOrigin} onChange={(e) => setFormData({...formData, villageOrigin: e.target.value})} placeholder="e.g. Bandjoun" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
              </div>
            </div>

            {/* Academic Qualifications */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-accent pb-2">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-primary/40" />
                  <h3 className="text-xs font-black uppercase text-primary tracking-widest">Academic Qualifications</h3>
                </div>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-[10px] font-black uppercase" onClick={handleAddQualification}>
                  <Plus className="w-3 h-3" /> Add Degree
                </Button>
              </div>
              <div className="space-y-3">
                {qualifications.map((q, idx) => (
                  <div key={idx} className="flex gap-3 animate-in fade-in zoom-in-95 duration-300">
                    <Input 
                      placeholder="Qualification Name (e.g. PhD Physics)" 
                      value={q.name} 
                      onChange={(e) => handleQualificationChange(idx, 'name', e.target.value)}
                      className="flex-1 bg-accent/20 border-none h-11 rounded-lg font-bold"
                    />
                    <Input 
                      placeholder="Year" 
                      value={q.year} 
                      onChange={(e) => handleQualificationChange(idx, 'year', e.target.value)}
                      className="w-24 bg-accent/20 border-none h-11 rounded-lg text-center font-bold"
                    />
                    <Button variant="ghost" size="icon" className="h-11 w-11 text-red-400" onClick={() => handleRemoveQualification(idx)} disabled={qualifications.length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
                  <History className="w-3.5 h-3.5" /> Education Background
                </Label>
                <Textarea 
                  value={formData.education} 
                  onChange={(e) => setFormData({...formData, education: e.target.value})} 
                  placeholder="Primary, Secondary, and Higher Ed timeline..." 
                  className="min-h-[120px] bg-accent/30 border-none rounded-xl"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Professional History
                </Label>
                <Textarea 
                  value={formData.professional} 
                  onChange={(e) => setFormData({...formData, professional: e.target.value})} 
                  placeholder="Previous institutional experience and research..." 
                  className="min-h-[120px] bg-accent/30 border-none rounded-xl"
                />
              </div>
            </div>

            {/* Employment Status & Contacts */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-accent pb-2">
                <ShieldCheck className="w-4 h-4 text-primary/40" />
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Status & Communication</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(v) => setFormData({...formData, employmentType: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{EMPLOYMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Strategic Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="BURSAR">Bursar</SelectItem>
                      <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Institutional Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@school.edu" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">WhatsApp / Phone</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                    <Input value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} placeholder="+237 6XX XX XX XX" className="h-12 bg-accent/30 border-none rounded-xl pl-10 font-bold" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-8 border-t border-accent shrink-0">
            <Button className="w-full h-16 rounded-2xl shadow-2xl font-black uppercase tracking-widest text-sm gap-3 bg-primary text-white hover:bg-primary/90 transition-all active:scale-95" onClick={handleAddStaff} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6 text-secondary" />}
              Finalize Institutional Onboarding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DETAILS DIALOG */}
      <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <DialogTitle className="text-2xl font-black">Edit Staff Profile</DialogTitle>
            <DialogDescription className="text-white/60">Update institutional records for {editingStaff?.name}.</DialogDescription>
            <Button variant="ghost" size="icon" onClick={() => setEditingStaff(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Update Full Name</Label>
              <Input 
                value={editingStaff?.name} 
                onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})} 
                className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Strategic Role</Label>
                <Select value={editingStaff?.role} onValueChange={(v) => setEditingStaff({...editingStaff, role: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="BURSAR">Bursar</SelectItem>
                    <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Institutional Section</Label>
                <Select value={editingStaff?.section} onValueChange={(v) => setEditingStaff({...editingStaff, section: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={handleEditStaff} className="w-full h-12 rounded-xl shadow-lg font-bold" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Commit Profile Changes"}
            </Button>
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
