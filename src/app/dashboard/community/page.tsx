
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
import { 
  Search, 
  MoreVertical, 
  User, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  Ban, 
  Clock, 
  CheckCircle2, 
  UsersRound,
  FileText,
  TrendingUp,
  Activity,
  UserCheck,
  Building2,
  Fingerprint,
  Building,
  Plus,
  Network,
  UserPlus,
  ShieldAlert,
  ChevronRight,
  Settings2,
  LayoutGrid,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  FileSpreadsheet,
  GraduationCap,
  PenTool,
  Award,
  History,
  Mail,
  Calendar,
  MapPin
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

// Mock Data
const INITIAL_SUB_SCHOOLS = [
  { id: "SEC-01", name: "Anglophone Section", type: "General", head: "Dr. Aris Tesla", headRole: "Vice Principal", students: 450, staff: 18, color: "bg-blue-500" },
  { id: "SEC-02", name: "Francophone Section", type: "General", head: "Mme. Ngono Celine", headRole: "Vice Principal", students: 620, staff: 24, color: "bg-emerald-500" },
  { id: "SEC-03", name: "Technical Section", type: "Technical", head: "Mr. Ebong", headRole: "Section Head", students: 214, staff: 12, color: "bg-purple-500" },
];

const INITIAL_ADMINS = [
  { id: "ADM-01", name: "Principal Fonka", role: "Principal", purview: "Whole Institution", avatar: "https://picsum.photos/seed/p1/100/100" },
  { id: "ADM-02", name: "Dr. Aris Tesla", role: "Vice Principal", purview: "Anglophone Section", avatar: "https://picsum.photos/seed/t1/100/100" },
  { id: "ADM-03", name: "Mme. Ngono Celine", role: "Vice Principal", purview: "Francophone Section", avatar: "https://picsum.photos/seed/b1/100/100" },
];

const INITIAL_USERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", email: "alice.t@school.edu", avatar: "https://picsum.photos/seed/s1/100/100", status: "active", lastLogin: "2 hours ago", section: "Anglophone Section", dept: "Science Section A" },
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", email: "aris.tesla@school.edu", avatar: "https://picsum.photos/seed/t1/100/100", status: "active", lastLogin: "10 mins ago", section: "Anglophone Section", dept: "Physics Department" },
  { id: "B001", name: "Mme. Ngono Celine", role: "BURSAR", email: "celine.n@school.edu", avatar: "https://picsum.photos/seed/b1/100/100", status: "active", lastLogin: "Yesterday", section: "Cross-Sectional", dept: "Finance Office" },
  { id: "L001", name: "Mr. Ebong", role: "LIBRARIAN", email: "ebong.lib@school.edu", avatar: "https://picsum.photos/seed/l1/100/100", status: "suspended", lastLogin: "3 days ago", section: "Technical Section", dept: "Resource Center" },
];

const MOCK_ACTIVITIES = [
  { id: 1, action: "Assignment Submitted", module: "Pedagogy", time: "Oct 24, 10:30 AM", detail: "Physics: Thermodynamics Lab", status: "Verified" },
  { id: 2, action: "Library Book Borrowed", module: "Library", time: "Oct 23, 02:15 PM", detail: "Calculus II (Ref: IGN-102)", status: "Verified" },
];

const MOCK_CHART_DATA = [
  { day: 'Mon', engagement: 40 },
  { day: 'Tue', engagement: 65 },
  { day: 'Wed', engagement: 45 },
  { day: 'Thu', engagement: 90 },
  { day: 'Fri', engagement: 75 },
  { day: 'Sat', engagement: 20 },
  { day: 'Sun', engagement: 10 },
];

export default function CommunityPage() {
  const { language } = useI18n();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [subSchools, setSubSchools] = useState(INITIAL_SUB_SCHOOLS);
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [viewingUser, setViewingUser] = useState<any>(null);
  
  // Creation States
  const [isAddingSubSchool, setIsAddingSubSchool] = useState(false);
  const [isAppointingAdmin, setIsAppointingAdmin] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspend = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    toast({ title: "Status Updated", description: "User account status has been toggled." });
  };

  const handleCreateSubSchool = () => {
    toast({ title: "Sub-School Created", description: "New institutional section has been registered." });
    setIsAddingSubSchool(false);
  };

  const handleAppointAdmin = () => {
    toast({ title: "Admin Appointed", description: "Administrative purview has been synchronized." });
    setIsAppointingAdmin(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-700';
      case 'TEACHER': return 'bg-purple-100 text-purple-700';
      case 'BURSAR': return 'bg-green-100 text-green-700';
      case 'LIBRARIAN': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <UsersRound className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? "Institutional Community" : "Communauté Institutionnelle"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor activity, manage sub-schools, and define administrative hierarchy.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-accent flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground leading-none">Registered</p>
                <p className="text-lg font-black text-primary leading-tight">{users.length}</p>
              </div>
           </div>
        </div>
      </div>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[800px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="registry" className="gap-2 py-3 rounded-xl transition-all">
            <UsersRound className="w-4 h-4" /> Registry
          </TabsTrigger>
          <TabsTrigger value="structure" className="gap-2 py-3 rounded-xl transition-all">
            <Building className="w-4 h-4" /> Sections
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-2 py-3 rounded-xl transition-all">
            <ShieldCheck className="w-4 h-4" /> Admin Hierarchy
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 py-3 rounded-xl transition-all">
            <Activity className="w-4 h-4" /> Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-0 animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, ID or role..." 
                  className="pl-10 h-12 bg-accent/20 border-none rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent/10 border-b border-accent/20">
                    <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Matricule</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">User Profile</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Institutional Unit</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                    <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="group hover:bg-accent/5 border-b border-accent/10">
                      <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{u.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                            <AvatarImage src={u.avatar} alt={u.name} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs">{u.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-primary leading-none mb-1">{u.name}</span>
                            <Badge variant="outline" className={cn("w-fit text-[8px] h-4 uppercase border-none tracking-tighter", getRoleColor(u.role))}>
                              {u.role}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-primary">{u.section}</p>
                          <p className="text-[10px] text-muted-foreground">{u.dept}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-tighter border-none px-3",
                          u.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Button variant="ghost" size="icon" onClick={() => setViewingUser(u)} className="rounded-full"><Eye className="w-4 h-4 text-primary" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Sub-School Sections</h3>
              <Dialog open={isAddingSubSchool} onOpenChange={setIsAddingSubSchool}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl"><Plus className="w-4 h-4" /> Add Section</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Institutional Section</DialogTitle>
                    <DialogDescription>Create a sub-school or specialized wing (e.g. Anglophone Wing).</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2"><Label>Section Name</Label><Input placeholder="e.g. Technical Wing" /></div>
                    <div className="space-y-2">
                      <Label>Section Head / Lead</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Assign staff..." /></SelectTrigger>
                        <SelectContent>{INITIAL_USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter><Button onClick={handleCreateSubSchool}>Register Section</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subSchools.map(section => (
                <Card key={section.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  <div className={cn("h-1.5 w-full", section.color)} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20">{section.type}</Badge>
                        <CardTitle className="text-xl font-black text-primary">{section.name}</CardTitle>
                      </div>
                      <div className="p-2 bg-accent rounded-xl"><Building className="w-5 h-5 text-primary" /></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 space-y-1">
                      <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest leading-none">Section Head</p>
                      <p className="text-sm font-bold text-primary">{section.head}</p>
                      <Badge className="bg-secondary text-primary border-none text-[8px] h-4">{section.headRole}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center p-2 rounded-xl bg-accent/30">
                        <p className="text-[9px] font-black uppercase opacity-40">Students</p>
                        <p className="text-lg font-black">{section.students}</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-accent/30">
                        <p className="text-[9px] font-black uppercase opacity-40">Faculty</p>
                        <p className="text-lg font-black">{section.staff}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-accent/10 p-4">
                    <Button variant="ghost" className="w-full justify-between hover:bg-white text-xs font-bold">Manage Section <ChevronRight className="w-4 h-4" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hierarchy" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Administrative Hierarchy</h3>
              <Dialog open={isAppointingAdmin} onOpenChange={setIsAppointingAdmin}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl bg-secondary text-primary hover:bg-secondary/90 shadow-sm">
                    <ShieldCheck className="w-4 h-4" /> Appoint Sub-Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Admin Appointment Suite</DialogTitle>
                    <DialogDescription>Define specific administrative roles and purviews.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Staff Member</Label>
                      <Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{INITIAL_USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="space-y-2"><Label>Designated Title</Label><Input placeholder="e.g. Vice Principal Academics" /></div>
                    <div className="space-y-2">
                      <Label>Operational Purview</Label>
                      <Select><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                        <SelectItem value="whole">Whole Institution</SelectItem>
                        <SelectItem value="anglophone">Anglophone Section</SelectItem>
                        <SelectItem value="francophone">Francophone Section</SelectItem>
                      </SelectContent></Select>
                    </div>
                  </div>
                  <DialogFooter><Button onClick={handleAppointAdmin}>Confirm Appointment</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map(adm => (
                <Card key={adm.id} className="border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="bg-primary p-6 text-white text-center pb-8">
                    <Avatar className="h-20 w-20 border-4 border-white/20 mx-auto shadow-2xl mb-4">
                      <AvatarImage src={adm.avatar} />
                      <AvatarFallback>{adm.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg font-black">{adm.name}</CardTitle>
                    <Badge variant="secondary" className="bg-white/10 text-white border-none mt-2">{adm.role}</Badge>
                  </CardHeader>
                  <CardContent className="p-6 -mt-4 bg-white rounded-t-3xl space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3 text-secondary" /> pur·view / responsibility
                      </p>
                      <p className="text-sm font-bold text-primary">{adm.purview}</p>
                    </div>
                    <div className="pt-4 border-t border-accent flex justify-between items-center">
                       <Button variant="outline" size="sm" className="rounded-xl h-8 px-4 text-[10px] font-black uppercase">Edit Duties</Button>
                       <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <History className="w-4 h-4" /> Full Institutional Footprint
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30">
                  <TableRow className="uppercase text-[10px] font-black">
                    <TableHead className="pl-8 py-4">Event / Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right pr-8">Integrity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ACTIVITIES.map(act => (
                    <TableRow key={act.id}>
                      <TableCell className="pl-8 font-bold text-sm text-primary">{act.action}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[9px] font-black uppercase border-primary/10">{act.module}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{act.detail}</TableCell>
                      <TableCell className="text-right pr-8"><div className="inline-flex items-center gap-1 text-[10px] text-green-600 font-black"><CheckCircle2 className="w-3 h-3" /> {act.status}</div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Portfolio Drill-down */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="absolute top-4 right-12 flex items-center gap-2">
               <Fingerprint className="w-4 h-4 opacity-30" />
               <span className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Verified Digital ID</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="h-32 w-32 border-4 border-white shadow-2xl shrink-0">
                <AvatarImage src={viewingUser?.avatar} />
                <AvatarFallback className="text-4xl text-primary bg-white">{viewingUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <DialogTitle className="text-4xl font-black tracking-tight">{viewingUser?.name}</DialogTitle>
                    <Badge className="bg-secondary text-primary border-none font-black h-6">{viewingUser?.role}</Badge>
                  </div>
                  <DialogDescription className="text-white/60 text-lg flex items-center justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4"/> {viewingUser?.email}</span>
                    <span className="opacity-30">|</span>
                    <span className="flex items-center gap-1.5 font-mono">ID: {viewingUser?.id}</span>
                  </DialogDescription>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                   <Badge variant="secondary" className="bg-white/10 text-white border-none gap-1.5 py-1 px-3">
                     <Building2 className="w-3.5 h-3.5" /> {viewingUser?.section}
                   </Badge>
                   <Badge variant="secondary" className="bg-white/10 text-white border-none gap-1.5 py-1 px-3">
                     <Calendar className="w-3.5 h-3.5" /> Joined Sept 2023
                   </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8">
             <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Operational pur·view
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  This account has active access to the <strong>{viewingUser?.section}</strong> module. All actions performed are logged under the verified digital ID system.
                </p>
             </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t flex justify-end">
            <Button onClick={() => setViewingUser(null)} className="rounded-xl px-10 h-12 shadow-lg font-black uppercase tracking-widest text-xs">Close Dossier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
