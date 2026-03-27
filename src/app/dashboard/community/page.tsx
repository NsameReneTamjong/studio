
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  User, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Fingerprint, 
  Building, 
  Plus, 
  Network, 
  ShieldAlert, 
  ChevronRight, 
  Settings2, 
  GraduationCap, 
  Users, 
  Pencil, 
  UserX, 
  Loader2, 
  X,
  CheckCircle2,
  History,
  Activity,
  Printer,
  Download,
  Clock,
  Zap,
  Lock,
  BookOpen,
  LayoutGrid
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
interface SubAdminPermissions {
  manageStudents: boolean;
  manageStaff: boolean;
  generateReports: boolean;
  fullControl: boolean;
}

interface SchoolAdmin {
  id: string;
  name: string;
  role: string;
  purview: string;
  avatar: string;
  status: "active" | "inactive";
  permissions: SubAdminPermissions;
}

interface InstitutionalClass {
  id: string;
  name: string;
  baseLevel: string;
  section: string;
  students: number;
}

// Mock Data
const INITIAL_SUB_SCHOOLS = [
  { id: "SEC-01", name: "Anglophone Section", type: "General", head: "Dr. Aris Tesla", headRole: "Vice Principal", students: 450, staff: 18, color: "bg-blue-500" },
  { id: "SEC-02", name: "Francophone Section", type: "General", head: "Mme. Celine Njoh", headRole: "Vice Principal", students: 620, staff: 24, color: "bg-emerald-500" },
  { id: "SEC-03", name: "Technical Section", type: "Technical", head: "Mr. Ebong", headRole: "Section Head", students: 214, staff: 12, color: "bg-purple-500" },
];

const INITIAL_ADMINS: SchoolAdmin[] = [
  { 
    id: "GBHS26", 
    name: "Principal Fonka", 
    role: "Principal", 
    purview: "Whole Institution", 
    avatar: "https://picsum.photos/seed/p1/100/100",
    status: "active",
    permissions: { manageStudents: true, manageStaff: true, generateReports: true, fullControl: true }
  },
  { 
    id: "GBHS26A001", 
    name: "VP Academics", 
    role: "Vice Principal", 
    purview: "Anglophone Section", 
    avatar: "https://picsum.photos/seed/subadmin/100/100",
    status: "active",
    permissions: { manageStudents: true, manageStaff: true, generateReports: true, fullControl: false }
  },
];

const INITIAL_CLASSES: InstitutionalClass[] = [
  { id: "CLS-01", name: "Form 1A", baseLevel: "6ème / Form 1", section: "Anglophone Section", students: 42 },
  { id: "CLS-02", name: "Form 1B", baseLevel: "6ème / Form 1", section: "Anglophone Section", students: 40 },
  { id: "CLS-03", name: "2nde C", baseLevel: "2nde / Form 5", section: "Francophone Section", students: 38 },
];

const GOVERNANCE_LOGS = [
  { id: "L1", admin: "VP Academics", action: "Authorized ID Card Batch", purview: "Anglophone Section", time: "Today, 10:45 AM", type: "Operational", severity: "Medium" },
  { id: "L2", admin: "Section Head", action: "Modified Class Schedule", purview: "Technical Section", time: "Today, 09:12 AM", type: "Pedagogical", severity: "High" },
  { id: "L3", admin: "VP Academics", action: "Verified Seq 1 Marks", purview: "Anglophone Section", time: "Yesterday", type: "Evaluations", severity: "Medium" },
  { id: "L4", admin: "Admin Assistant", action: "Updated Student Dossier", purview: "Francophone Section", time: "Yesterday", type: "Registry", severity: "Low" },
];

const STAFF_MEMBERS = [
  { id: "GBHS26T001", name: "Dr. Aris Tesla", role: "TEACHER" },
  { id: "GBHS26B001", name: "Mme. Celine Njoh", role: "BURSAR" },
  { id: "GBHS26L001", name: "Mr. Ebong", role: "LIBRARIAN" },
];

const BASE_LEVELS = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

export default function CommunityPage() {
  const { language } = useI18n();
  const { toast } = useToast();
  const [subSchools, setSubSchools] = useState(INITIAL_SUB_SCHOOLS);
  const [admins, setAdmins] = useState<SchoolAdmin[]>(INITIAL_ADMINS);
  const [classes, setClasses] = useState<InstitutionalClass[]>(INITIAL_CLASSES);
  
  const [isAddingSubSchool, setIsAddingSubSchool] = useState(false);
  const [isAppointingAdmin, setIsAppointingAdmin] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  
  const [editingAdmin, setEditingAdmin] = useState<SchoolAdmin | null>(null);
  const [configuringSection, setConfiguringSection] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [newSectionData, setNewSectionData] = useState({ name: "", type: "General" });
  const [newClassData, setNewClassData] = useState({ name: "", baseLevel: BASE_LEVELS[0], section: INITIAL_SUB_SCHOOLS[0].name });
  
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    id: "",
    title: "",
    purview: "Whole Institution",
    permissions: {
      manageStudents: false,
      manageStaff: false,
      generateReports: false,
      fullControl: false
    }
  });

  const handleAddSection = () => {
    if (!newSectionData.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created = {
        id: `SEC-${Math.floor(100 + Math.random() * 900)}`,
        name: newSectionData.name,
        type: newSectionData.type,
        head: "Unassigned",
        headRole: "Pending",
        students: 0,
        staff: 0,
        color: "bg-primary"
      };
      setSubSchools([...subSchools, created]);
      setIsProcessing(false);
      setIsAddingSubSchool(false);
      setNewSectionData({ name: "", type: "General" });
      toast({ title: "Section Created", description: `${created.name} added to school structure.` });
    }, 800);
  };

  const handleAddClass = () => {
    if (!newClassData.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created = {
        id: `CLS-${Math.floor(100 + Math.random() * 900)}`,
        ...newClassData,
        students: 0
      };
      setClasses([...classes, created]);
      setIsProcessing(false);
      setIsAddingClass(false);
      setNewClassData({ name: "", baseLevel: BASE_LEVELS[0], section: INITIAL_SUB_SCHOOLS[0].name });
      toast({ title: "Class Registry Updated", description: `${created.name} is now active.` });
    }, 1000);
  };

  const handleUpdateSection = () => {
    if (!configuringSection) return;
    setIsProcessing(true);
    setTimeout(() => {
      setSubSchools(prev => prev.map(s => s.id === configuringSection.id ? configuringSection : s));
      setIsProcessing(false);
      setConfiguringSection(null);
      toast({ title: "Section Updated", description: "The institutional structure has been synchronized." });
    }, 800);
  };

  const handleAppointAdmin = () => {
    if (!newAdminData.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created: SchoolAdmin = {
        id: newAdminData.id || `ADM-${Math.floor(100 + Math.random() * 900)}`,
        name: newAdminData.name,
        role: newAdminData.title || "Sub-Admin",
        purview: newAdminData.purview,
        avatar: `https://picsum.photos/seed/${newAdminData.name}/100/100`,
        status: "active",
        permissions: newAdminData.permissions
      };
      setAdmins([...admins, created]);
      setIsProcessing(false);
      setIsAppointingAdmin(false);
      setNewAdminData({ name: "", id: "", title: "", purview: "Whole Institution", permissions: { manageStudents: false, manageStaff: false, generateReports: false, fullControl: false } });
      toast({ title: "Admin Appointed", description: `${created.name} is now authorized.` });
    }, 1000);
  };

  const handleUpdateAdmin = () => {
    if (!editingAdmin) return;
    setIsProcessing(true);
    setTimeout(() => {
      setAdmins(prev => prev.map(a => a.id === editingAdmin.id ? editingAdmin : a));
      setIsProcessing(false);
      setEditingAdmin(null);
      toast({ title: "Hierarchy Updated", description: "Administrator details have been synchronized." });
    }, 800);
  };

  const handleRemoveAdmin = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    toast({ variant: "destructive", title: "Admin Removed", description: "The administrative record has been decommissioned." });
  };

  const PermissionCheckbox = ({ id, label, checked, onChange, icon: Icon }: any) => (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
      checked ? "border-primary bg-primary/5" : "border-accent bg-white"
    )} onClick={() => onChange(!checked)}>
      <Checkbox checked={checked} onCheckedChange={() => {}} className="pointer-events-none" />
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", checked ? "text-primary" : "text-muted-foreground")} />
        <span className="font-bold text-xs">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Network className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? "Institutional Hierarchy" : "Hiérarchie Institutionnelle"}
          </h1>
          <p className="text-muted-foreground mt-1">Manage sub-schools, classes, sections, and administrative appointments.</p>
        </div>
      </div>

      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[1000px] mb-8 bg-white shadow-sm border h-auto p-1.5 rounded-3xl overflow-x-auto no-scrollbar">
          <TabsTrigger value="structure" className="gap-2 py-3 rounded-2xl transition-all font-bold">
            <Building className="w-4 h-4" /> Sections
          </TabsTrigger>
          <TabsTrigger value="classes" className="gap-2 py-3 rounded-2xl transition-all font-bold">
            <BookOpen className="w-4 h-4" /> Class Registry
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-2 py-3 rounded-2xl transition-all font-bold">
            <ShieldCheck className="w-4 h-4" /> Admin Team
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2 py-3 rounded-2xl transition-all font-bold">
            <History className="w-4 h-4" /> Strategic Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-primary uppercase tracking-tight">Active Sections</h3>
            <Dialog open={isAddingSubSchool} onOpenChange={setIsAddingSubSchool}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg bg-secondary text-primary hover:bg-secondary/90 font-bold">
                  <Plus className="w-4 h-4" /> Create Section
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">New Institutional Section</DialogTitle>
                  <DialogDescription className="text-white/60">Define a specialized sub-school or wing.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label>Section Name</Label>
                    <Input value={newSectionData.name} onChange={(e) => setNewSectionData({...newSectionData, name: e.target.value})} placeholder="e.g. Technical Section" className="h-12 bg-accent/30 border-none rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newSectionData.type} onValueChange={(v) => setNewSectionData({...newSectionData, type: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General Education</SelectItem>
                        <SelectItem value="Technical">Technical Education</SelectItem>
                        <SelectItem value="Teacher Training">Teacher Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={handleAddSection} className="w-full h-12 rounded-xl shadow-lg font-bold" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Section Creation"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subSchools.map(sec => (
              <Card key={sec.id} className="border-none shadow-sm group hover:shadow-md transition-all overflow-hidden bg-white">
                <div className={cn("h-1.5 w-full", sec.color)} />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] font-black uppercase border-primary/10 text-primary">{sec.type}</Badge>
                    <div className="p-2 bg-accent rounded-xl"><Building2 className="w-5 h-5 text-primary" /></div>
                  </div>
                  <CardTitle className="text-xl font-black text-primary mt-2">{sec.name}</CardTitle>
                  <CardDescription className="font-bold flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-secondary" /> Head: {sec.head}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-accent/30 p-3 rounded-xl text-center space-y-0.5">
                      <p className="text-[9px] font-black uppercase opacity-40">Students</p>
                      <p className="text-lg font-black text-primary">{sec.students}</p>
                    </div>
                    <div className="bg-accent/30 p-3 rounded-xl text-center space-y-0.5">
                      <p className="text-[9px] font-black uppercase opacity-40">Personnel</p>
                      <p className="text-lg font-black text-primary">{sec.staff}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t bg-accent/10 p-4">
                  <Button variant="ghost" className="w-full justify-between hover:bg-white text-xs font-bold text-primary" onClick={() => setConfiguringSection({...sec})}>
                    Section Configuration
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="classes" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-primary uppercase tracking-tight">Active Class Streams</h3>
            <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg bg-primary text-white font-bold">
                  <Plus className="w-4 h-4" /> Add New Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">Define Class Stream</DialogTitle>
                  <DialogDescription className="text-white/60">Initialize a specific student cohort.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Class Label</Label>
                    <Input value={newClassData.name} onChange={(e) => setNewClassData({...newClassData, name: e.target.value})} placeholder="e.g. Form 1B or Terminale C" className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Academic Base Level</Label>
                    <Select value={newClassData.baseLevel} onValueChange={(v) => setNewClassData({...newClassData, baseLevel: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent>{BASE_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Institutional Section</Label>
                    <Select value={newClassData.section} onValueChange={(v) => setNewClassData({...newClassData, section: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent>{subSchools.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={handleAddClass} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs bg-primary text-white" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                    Confirm Registry Update
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map(cls => (
              <Card key={cls.id} className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all">
                <CardHeader className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase">{cls.section}</Badge>
                    <div className="p-2 bg-accent rounded-lg"><LayoutGrid className="w-4 h-4 text-primary" /></div>
                  </div>
                  <CardTitle className="text-xl font-black text-primary leading-none uppercase">{cls.name}</CardTitle>
                  <CardDescription className="text-[10px] font-bold mt-1">{cls.baseLevel}</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                   <div className="flex items-center justify-between p-3 bg-accent/20 rounded-xl border border-accent">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Enrolled Students</p>
                        <p className="text-base font-black text-primary">{cls.students}</p>
                      </div>
                      <QrCode className="w-8 h-8 opacity-10" />
                   </div>
                </CardContent>
                <CardFooter className="p-3 bg-accent/10 border-t flex justify-end">
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white text-primary/40 hover:text-primary"><Pencil className="w-3.5 h-3.5"/></Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white text-destructive/40 hover:text-destructive" onClick={() => setClasses(classes.filter(c => c.id !== cls.id))}><Trash2 className="w-3.5 h-3.5"/></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hierarchy" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-primary uppercase tracking-tight">Administrative Team</h3>
            <Dialog open={isAppointingAdmin} onOpenChange={setIsAppointingAdmin}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg bg-primary text-white font-bold">
                  <ShieldCheck className="w-4 h-4" /> Appoint Sub-Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">Appoint Sub-Administrator</DialogTitle>
                  <DialogDescription className="text-white/60">Authorize a staff member for specific administrative duties.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <Label>Select Professional</Label>
                      <Select onValueChange={(v) => {
                        const s = STAFF_MEMBERS.find(item => item.id === v);
                        if(s) setNewAdminData({...newAdminData, id: s.id, name: s.name});
                      }}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue placeholder="Search Staff Registry..." /></SelectTrigger>
                        <SelectContent>{STAFF_MEMBERS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.role})</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title / Position</Label>
                      <Input value={newAdminData.title} onChange={(e) => setNewAdminData({...newAdminData, title: e.target.value})} placeholder="e.g. Vice Principal" className="h-12 bg-accent/30 border-none rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Assigned Purview</Label>
                      <Select value={newAdminData.purview} onValueChange={(v) => setNewAdminData({...newAdminData, purview: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Whole Institution">Whole Institution</SelectItem>
                          {subSchools.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-primary/40 tracking-widest border-b pb-2">Operational Authority Toggle</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <PermissionCheckbox label="Manage Students" icon={GraduationCap} checked={newAdminData.permissions.manageStudents} onChange={(v: boolean) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, manageStudents: v}})} />
                      <PermissionCheckbox label="Manage Staff" icon={Users} checked={newAdminData.permissions.manageStaff} onChange={(v: boolean) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, manageStaff: v}})} />
                      <PermissionCheckbox label="Generate Reports" icon={FileText} checked={newAdminData.permissions.generateReports} onChange={(v: boolean) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, generateReports: v}})} />
                      <PermissionCheckbox label="Full Control" icon={ShieldAlert} checked={newAdminData.permissions.fullControl} onChange={(v: boolean) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, fullControl: v}})} />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={handleAppointAdmin} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3" disabled={isProcessing || !newAdminData.name}>
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    Confirm Appointment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map(adm => (
              <Card key={adm.id} className="border-none shadow-xl bg-white overflow-hidden group">
                <CardHeader className={cn(
                  "p-6 text-white text-center pb-8 relative",
                  adm.status === 'active' ? "bg-primary" : "bg-destructive/80"
                )}>
                  <Avatar className="h-20 w-20 border-4 border-white/20 mx-auto shadow-2xl mb-4">
                    <AvatarImage src={adm.avatar} />
                    <AvatarFallback>{adm.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-black">{adm.name}</CardTitle>
                  <Badge variant="secondary" className="bg-white/10 text-white border-none mt-2 uppercase text-[8px] tracking-widest">{adm.role}</Badge>
                </CardHeader>
                <CardContent className="p-6 -mt-4 bg-white rounded-t-3xl space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Strategic Purview</p>
                    <p className="text-sm font-bold text-primary">{adm.purview}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {adm.permissions.fullControl ? <Badge className="bg-primary text-white text-[8px] font-black">FULL CONTROL</Badge> : <Badge variant="outline" className="text-[8px] font-bold">SUB-ADMIN</Badge>}
                    {adm.permissions.manageStudents && <Badge variant="secondary" className="text-[8px] font-bold h-4">Students</Badge>}
                    {adm.permissions.manageStaff && <Badge variant="secondary" className="text-[8px] font-bold h-4">Staff</Badge>}
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/10 p-3 border-t flex justify-end gap-2">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/40 hover:text-primary" onClick={() => setEditingAdmin({...adm})}>
                     <Pencil className="w-4 h-4"/>
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/40 hover:text-destructive" onClick={() => handleRemoveAdmin(adm.id)}>
                     <UserX className="w-4 h-4"/>
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b flex flex-row items-center justify-between p-6">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Governance Audit Logs
                </CardTitle>
                <CardDescription>Verified chronological record of sub-administrative actions across institutional sections.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl h-10 font-bold gap-2">
                  <Printer className="w-4 h-4" /> Print Registry
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl h-10 font-bold gap-2">
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Administrator</TableHead>
                    <TableHead>Purview / Section</TableHead>
                    <TableHead>Strategic Action</TableHead>
                    <TableHead className="text-center">Impact</TableHead>
                    <TableHead className="text-center">Timestamp</TableHead>
                    <TableHead className="text-right pr-8">Integrity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {GOVERNANCE_LOGS.map((log) => (
                    <TableRow key={log.id} className="hover:bg-accent/5 transition-colors border-b">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-sm text-primary">{log.admin}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-primary/10 font-bold">{log.purview}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-primary">{log.action}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-black">{log.type}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[8px] font-black uppercase border-none px-2",
                          log.severity === 'High' ? "bg-red-100 text-red-700" : 
                          log.severity === 'Medium' ? "bg-amber-100 text-amber-700" : 
                          "bg-blue-100 text-blue-700"
                        )}>
                          {log.severity} Impact
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-[10px] font-mono font-bold text-muted-foreground">
                        <div className="flex items-center justify-center gap-1.5">
                          <Clock className="w-3 h-3" /> {log.time}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-1.5 text-green-600 font-bold text-[9px] uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Signed</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-6 border-t border-accent flex justify-center">
               <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Governance synchronization active. Records are tamper-proof.</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary/40">
                    <Zap className="w-3.5 h-3.5" /> Live Node Audit
                  </div>
               </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SECTION CONFIGURATION DIALOG */}
      <Dialog open={!!configuringSection} onOpenChange={() => setConfiguringSection(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl"><Settings2 className="w-8 h-8 text-secondary" /></div>
              <div>
                <DialogTitle className="text-2xl font-black">Section Configuration</DialogTitle>
                <DialogDescription className="text-white/60">Strategic parameters for {configuringSection?.name}.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setConfiguringSection(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input value={configuringSection?.name || ""} onChange={(e) => setConfiguringSection({...configuringSection, name: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
            </div>
            <div className="space-y-2">
              <Label>Section Type</Label>
              <Select value={configuringSection?.type} onValueChange={(v) => setConfiguringSection({...configuringSection, type: v})}>
                <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General Education</SelectItem>
                  <SelectItem value="Technical">Technical Education</SelectItem>
                  <SelectItem value="Teacher Training">Teacher Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assigned Section Head</Label>
              <Select value={configuringSection?.head} onValueChange={(v) => setConfiguringSection({...configuringSection, head: v})}>
                <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_MEMBERS.map(s => <SelectItem key={s.id} value={s.name}>{s.name} ({s.role})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={handleUpdateSection} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Commit Section Updates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT ADMIN DIALOG */}
      <Dialog open={!!editingAdmin} onOpenChange={() => setEditingAdmin(null)}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl"><Settings2 className="w-8 h-8 text-secondary" /></div>
              <div>
                <DialogTitle className="text-2xl font-black">Modify Admin Purview</DialogTitle>
                <DialogDescription className="text-white/60">Update authority and roles for {editingAdmin?.name}.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditingAdmin(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Strategic Role</Label>
                <Input value={editingAdmin?.role || ""} onChange={(e) => setEditingAdmin(prev => prev ? {...prev, role: e.target.value} : null)} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                <Label>Section Purview</Label>
                <Select value={editingAdmin?.purview} onValueChange={(v) => setEditingAdmin(prev => prev ? {...prev, purview: v} : null)}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Whole Institution">Whole Institution</SelectItem>
                    {subSchools.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-primary/40 tracking-widest border-b pb-2">Authority Parameters</h4>
              <div className="grid grid-cols-2 gap-3">
                {editingAdmin && (
                  <>
                    <PermissionCheckbox 
                      label="Manage Students" 
                      icon={GraduationCap} 
                      checked={editingAdmin.permissions.manageStudents} 
                      onChange={(v: boolean) => setEditingAdmin({...editingAdmin, permissions: {...editingAdmin.permissions, manageStudents: v}})} 
                    />
                    <PermissionCheckbox 
                      label="Manage Staff" 
                      icon={Users} 
                      checked={editingAdmin.permissions.manageStaff} 
                      onChange={(v: boolean) => setEditingAdmin({...editingAdmin, permissions: {...editingAdmin.permissions, manageStaff: v}})} 
                    />
                    <PermissionCheckbox 
                      label="Generate Reports" 
                      icon={FileText} 
                      checked={editingAdmin.permissions.generateReports} 
                      onChange={(v: boolean) => setEditingAdmin({...editingAdmin, permissions: {...editingAdmin.permissions, generateReports: v}})} 
                    />
                    <PermissionCheckbox 
                      label="Full Control" 
                      icon={ShieldAlert} 
                      checked={editingAdmin.permissions.fullControl} 
                      onChange={(v: boolean) => setEditingAdmin({...editingAdmin, permissions: {...editingAdmin.permissions, fullControl: v}})} 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={handleUpdateAdmin} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              Commit Authority Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
