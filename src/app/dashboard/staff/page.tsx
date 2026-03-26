
"use client";

import { useState, useEffect } from "react";
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
  Info
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
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section", "Cross-Sectional"];
const REGIONS = ["Adamaoua", "Centre", "East", "Far North", "Littoral", "North", "North West", "South", "South West", "West"];
const EMPLOYMENT_TYPES = ["Permanent", "Part-time", "Public Service"];

const MOCK_STAFF = [
  { id: "GBHS26T001", uid: "T1", name: "Dr. Aris Tesla", role: "TEACHER", section: "Anglophone Section", avatar: "https://picsum.photos/seed/t1/100/100", status: "active", employmentType: "Permanent" },
  { id: "GBHS26B001", uid: "B1", name: "Mme. Ngono Celine", role: "BURSAR", section: "Cross-Sectional", avatar: "https://picsum.photos/seed/b1/100/100", status: "active", employmentType: "Public Service" },
];

export default function StaffManagementPage() {
  const { user, platformSettings } = useAuth();
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TEACHER': return 'bg-purple-100 text-purple-700';
      case 'SCHOOL_ADMIN': return 'bg-blue-100 text-blue-700';
      case 'BURSAR': return 'bg-green-100 text-green-700';
      case 'LIBRARIAN': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
            <p className="text-muted-foreground mt-1">Manage educational professionals and administrative personnel.</p>
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
                          <span className="font-bold text-sm text-primary leading-none mb-1">{s.name}</span>
                          <Badge variant="outline" className={cn("w-fit text-[8px] h-4 uppercase border-none tracking-tighter", getRoleColor(s.role))}>{s.role}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs font-bold text-primary">{s.section}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-3 border-none",
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
                            <span className="font-bold text-xs">View Dossier</span>
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

      {/* COMPREHENSIVE ONBOARDING DIALOG */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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

      {/* VIEW PROFILE DIALOG */}
      <Dialog open={!!viewingStaff} onOpenChange={() => setViewingStaff(null)}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
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
                  <span className="flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5" /> ID: {viewingStaff?.id}</span>
                  <span className="opacity-30">|</span>
                  <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {viewingStaff?.section}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setViewingStaff(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
              <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary" /> Institutional Status
              </h3>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Employment Basis</p>
                  <p className="text-sm font-bold text-primary">{viewingStaff?.employmentType || "Standard"}</p>
                </div>
                <Badge className={cn(
                  "font-black text-[10px] px-3 border-none",
                  viewingStaff?.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {viewingStaff?.status === 'active' ? "ACTIVE RECORD" : "SUSPENDED"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase text-primary tracking-widest border-b pb-1">Academic Credentials</h4>
               <div className="flex flex-wrap gap-2">
                  {viewingStaff?.qualifications?.length > 0 ? viewingStaff.qualifications.map((q: any, i: number) => (
                    <Badge key={i} variant="outline" className="border-primary/10 text-primary font-bold">{q.name} ({q.year})</Badge>
                  )) : <p className="text-xs text-muted-foreground italic">No qualifications documented in registry.</p>}
               </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => { setOnboardingSuccess(viewingStaff); setViewingStaff(null); }}>
              <Printer className="w-4 h-4 mr-2" /> Generate Formal Dossier
            </Button>
            <Button onClick={() => setViewingStaff(null)} className="flex-1 rounded-xl h-12 font-black uppercase text-xs">Close Dossier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ONBOARDING SUCCESS & FORMAL DOSSIER */}
      <Dialog open={!!onboardingSuccess} onOpenChange={() => setOnboardingSuccess(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-6 md:p-8 text-white no-print relative shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter">Employment Dossier Activated</DialogTitle>
                  <DialogDescription className="text-white/60 text-xs md:text-sm">Verified professional record for {onboardingSuccess?.name}.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOnboardingSuccess(null)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted flex-1 overflow-y-auto overflow-x-auto p-4 md:p-10 print:p-0 print:bg-white no-scrollbar">
            <div id="printable-employee-dossier" className="bg-white p-8 md:p-16 border-2 border-black/10 shadow-sm relative flex flex-col space-y-12 font-serif text-black print:border-none print:shadow-none min-w-[800px] mx-auto">
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
                  <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter text-primary leading-tight">{user?.school?.name || "GOVERNMENT BILINGUAL HIGH SCHOOL DEIDO"}</h2>
                  <p className="text-[10px] md:text-xs font-bold uppercase opacity-60 tracking-[0.3em] underline underline-offset-4 decoration-double">NOTICE OF APPOINTMENT & EMPLOYEE RECORD</p>
               </div>

               <div className="space-y-8 bg-primary/5 p-8 rounded-3xl border border-black/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Building2 className="w-48 h-48" /></div>
                  
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-3">
                       <Avatar className="w-32 h-32 border-4 border-white rounded-[2rem] shadow-xl">
                          <AvatarImage src={onboardingSuccess?.avatar} />
                          <AvatarFallback className="text-4xl font-black">{onboardingSuccess?.name?.charAt(0)}</AvatarFallback>
                       </Avatar>
                    </div>
                    <div className="col-span-9 space-y-6">
                       <div className="grid grid-cols-2 gap-8 text-sm">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Full Identity Name</p>
                             <p className="text-lg font-black uppercase text-primary leading-none">{onboardingSuccess?.name}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Professional ID (Matricule)</p>
                             <div className="bg-primary text-secondary px-4 py-1 rounded-lg w-fit">
                                <p className="text-lg font-mono font-black">{onboardingSuccess?.id}</p>
                             </div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Strategic Role</p>
                             <p className="font-black uppercase text-primary">{onboardingSuccess?.role}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Basis of Employment</p>
                             <p className="font-bold">{onboardingSuccess?.employmentType}</p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2">
                      <Fingerprint className="w-4 h-4" /> Personal Registry
                    </h4>
                    <div className="space-y-3 text-[11px]">
                       <p><span className="font-bold opacity-60">Date of Birth:</span> {onboardingSuccess?.dob}</p>
                       <p><span className="font-bold opacity-60">Region of Origin:</span> {onboardingSuccess?.region}</p>
                       <p><span className="font-bold opacity-60">Division:</span> {onboardingSuccess?.division}</p>
                       <p><span className="font-bold opacity-60">Sub-Division:</span> {onboardingSuccess?.subDivision}</p>
                       <p><span className="font-bold opacity-60">Origin Village:</span> {onboardingSuccess?.villageOrigin}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> Academic Credentials
                    </h4>
                    <div className="space-y-3">
                       {onboardingSuccess?.qualifications?.map((q: any, i: number) => (
                         <div key={i} className="flex justify-between items-center text-xs border-b border-black/5 pb-1">
                            <span className="font-black text-primary uppercase">{q.name}</span>
                            <span className="font-mono font-bold text-muted-foreground">{q.year}</span>
                         </div>
                       ))}
                       <div className="mt-4 p-4 bg-accent/10 rounded-xl space-y-2">
                          <p className="text-[9px] font-black uppercase text-muted-foreground">Education Summary</p>
                          <p className="text-[10px] leading-relaxed italic">{onboardingSuccess?.education}</p>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="border-2 border-black/10 p-10 rounded-[2.5rem] bg-accent/5 space-y-4 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 opacity-5 rotate-12"><Briefcase className="w-32 h-32" /></div>
                  <h4 className="text-sm font-black uppercase text-primary">Institutional Commitment</h4>
                  <p className="text-[11px] leading-relaxed italic text-muted-foreground font-medium relative z-10">
                    "I, the undersigned, hereby commit to uphold the pedagogical standards and ethical code of {user?.school?.name || "this institution"}. I acknowledge that my role as a {onboardingSuccess?.role} requires the highest level of discipline, professionalism, and dedication to the academic success of our students. My actions will reflect the institutional values of Excellence, Integrity, and Service."
                  </p>
                  <div className="pt-6 flex justify-end">
                     <div className="w-48 border-b-2 border-black/40 h-10 relative flex items-center justify-center">
                        <SignatureSVG className="w-full h-full text-primary/10 p-2" />
                        <span className="absolute bottom-[-18px] text-[8px] font-black uppercase tracking-widest opacity-40">Employee Signature</span>
                     </div>
                  </div>
               </div>

               <div className="pt-12 border-t border-black/5 flex justify-between items-end">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <QrCode className="w-20 h-20 opacity-10" />
                    <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 leading-tight">Institutional<br/>Activation QR</p>
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
                      Verified Employment Record • Secure Registry Node • {new Date().getFullYear()}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 md:p-8 border-t no-print flex flex-col sm:flex-row gap-4 shrink-0">
            <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs" onClick={() => setOnboardingSuccess(null)}>
              Return to Staff Registry
            </Button>
            <div className="flex flex-col sm:flex-row flex-1 gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs gap-2"
                onClick={() => toast({ title: "Packet Prepared", description: "Employee PDF is being generated." })}
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button 
                className="flex-1 rounded-2xl h-14 shadow-2xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white hover:bg-primary/90 transition-all active:scale-95" 
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" /> Print Employment Packet
              </Button>
            </div>
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

function UserActionMenu({ onEdit, onToggleStatus, onView, status, role }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5">
          <MoreVertical className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-none">
        <DropdownMenuLabel className="text-[10px] uppercase font-black opacity-40 px-4 py-2">Dossier Options</DropdownMenuLabel>
        <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={onView}>
          <Eye className="w-4 h-4 text-primary/60" /> 
          <span className="font-bold text-xs">View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={onEdit}>
          <Pencil className="w-4 h-4 text-primary/60" /> 
          <span className="font-bold text-xs">Edit Details</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-accent" />
        <DropdownMenuItem 
          className={cn(
            "gap-3 px-4 py-2.5 cursor-pointer",
            status === "active" ? "text-destructive hover:bg-red-50" : "text-green-600 hover:bg-green-50"
          )}
          onClick={onToggleStatus}
        >
          {status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          <span className="font-bold text-xs">{status === "active" ? "Deactivate" : "Activate"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
