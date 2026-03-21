
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search, 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  MoreVertical, 
  UserPlus,
  Briefcase,
  Calendar,
  Settings2,
  Trash2,
  Ban,
  CheckCircle2,
  Eye,
  Building2,
  Award,
  BookOpen,
  Clock,
  MapPin,
  History,
  GraduationCap,
  Printer,
  FileText,
  FileCheck,
  Signature,
  Phone,
  User,
  Heart
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock Staff Data
const INITIAL_STAFF = [
  { 
    id: "T001", 
    name: "Dr. Aris Tesla", 
    role: "TEACHER", 
    type: "Government-sent",
    email: "aris.tesla@school.edu", 
    phone: "+237 677 88 99 00",
    gender: "Male",
    dob: "1985-05-15",
    address: "Bonapriso, Douala",
    department: "Science", 
    status: "active", 
    joined: "Sept 2020", 
    avatar: "https://picsum.photos/seed/t1/100/100",
    section: "Anglophone Section",
    education: {
      degree: "Ph.D. in Applied Physics",
      institution: "University of Buea",
      year: "2012"
    },
    experience: {
      years: "12",
      previous: "Lycée Classique de Bafoussam"
    },
    portfolio: {
      bio: "Dedicated Physics educator with 15 years of experience in experimental research and thermodynamics.",
      awards: ["Teacher of the Year 2022"],
      stats: { sessions: 142, students: 124, avgMark: "14.5/20" }
    },
    schedule: {
      Monday: [{ time: "08:00 AM", subject: "Physics Form 5A", room: "Lab 1" }],
    }
  },
];

const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section", "Cross-Sectional"];

export default function StaffManagementPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "",
    address: "",
    degree: "",
    institution: "",
    gradYear: "",
    expYears: "",
    prevCompany: "",
    role: "TEACHER",
    type: "Government-sent",
    department: "",
    section: "Anglophone Section",
    joined: new Date().toISOString().split('T')[0]
  });

  const [selectedStaffForPortfolio, setSelectedStaffForPortfolio] = useState<any>(null);
  const [selectedStaffForSchedule, setSelectedStaffForSchedule] = useState<any>(null);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    if (!formData.name || !formData.email) {
      toast({ variant: "destructive", title: "Missing Info", description: "Name and Email are required." });
      return;
    }

    const newStaffMember = {
      id: `ST-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...formData,
      status: "active",
      avatar: `https://picsum.photos/seed/${formData.name}/100/100`,
      education: {
        degree: formData.degree,
        institution: formData.institution,
        year: formData.gradYear
      },
      experience: {
        years: formData.expYears,
        previous: formData.prevCompany
      },
      portfolio: { bio: "Profile pending completion.", awards: [], stats: { sessions: 0, students: 0, avgMark: "N/A" } },
      schedule: {}
    };

    setStaff(prev => [newStaffMember, ...prev]);
    setIsAddModalOpen(false);
    setOnboardingSuccess(newStaffMember);
    toast({ title: "Staff Onboarded", description: `Appointment record generated for ${formData.name}.` });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TEACHER': return 'bg-purple-100 text-purple-700';
      case 'VICE_PRINCIPAL': case 'SCHOOL_ADMIN': return 'bg-blue-100 text-blue-700';
      case 'BURSAR': return 'bg-green-100 text-green-700';
      case 'LIBRARIAN': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            Institutional Staff
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage educational professionals and administrative personnel.
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
              <UserPlus className="w-5 h-5" /> Onboard Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black">Register New Staff</DialogTitle>
              <DialogDescription className="text-white/60">Complete the professional profile to generate appointment records.</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-4 w-full rounded-none bg-accent/30 h-12">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="professional">Work Exp.</TabsTrigger>
                <TabsTrigger value="institutional">Assignment</TabsTrigger>
              </TabsList>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <TabsContent value="personal" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2"><Label>Full Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Jean Dupont" /></div>
                    <div className="space-y-2"><Label>Gender</Label><Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Institutional Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Phone Number</Label><Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                    <div className="col-span-2 space-y-2"><Label>Residential Address</Label><Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} /></div>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2"><Label>Highest Degree</Label><Input value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} /></div>
                    <div className="col-span-2 space-y-2"><Label>Institution of Award</Label><Input value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Year of Graduation</Label><Input value={formData.gradYear} onChange={(e) => setFormData({...formData, gradYear: e.target.value})} /></div>
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><Label>Years of Experience</Label><Input type="number" value={formData.expYears} onChange={(e) => setFormData({...formData, expYears: e.target.value})} /></div>
                    <div className="col-span-2 space-y-2"><Label>Previous Institution</Label><Input value={formData.prevCompany} onChange={(e) => setFormData({...formData, prevCompany: e.target.value})} /></div>
                  </div>
                </TabsContent>

                <TabsContent value="institutional" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Designated Role</Label>
                      <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                          <SelectItem value="VICE_PRINCIPAL">Vice Principal</SelectItem>
                          <SelectItem value="BURSAR">Bursar</SelectItem>
                          <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Section Assignment</Label>
                      <Select value={formData.section} onValueChange={(v) => setFormData({...formData, section: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Department</Label><Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Classification</Label><Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Government-sent">Government-sent</SelectItem><SelectItem value="School-employed">School-employed</SelectItem></SelectContent></Select></div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStaff} className="flex-1 rounded-xl h-12 shadow-lg font-bold">Onboard & Generate Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, ID or department..." 
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
                <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Staff ID</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Professional Profile</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Institutional Unit</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((s) => (
                <TableRow key={s.id} className="group hover:bg-accent/5 border-b border-accent/10">
                  <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                        <AvatarImage src={s.avatar} alt={s.name} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">{s.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary leading-none mb-1">{s.name}</span>
                        <Badge variant="outline" className={cn("w-fit text-[8px] h-4 uppercase border-none tracking-tighter", getRoleColor(s.role))}>
                          {s.role}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-primary">{s.section}</p>
                      <p className="text-[10px] text-muted-foreground">{s.department}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "text-[9px] font-black uppercase tracking-tighter border-none px-3",
                      s.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-accent/50">
                        <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Management</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setSelectedStaffForPortfolio(s)}>
                          <Eye className="w-4 h-4 text-primary" /> View Portfolio
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setSelectedStaffForSchedule(s)}>
                          <Calendar className="w-4 h-4 text-primary" /> View Work Schedule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:bg-destructive/5">
                          <Trash2 className="w-4 h-4" /> Terminate Contract
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Portfolio & Schedule Dialogs (Simplified for Brevity) */}
      <Dialog open={!!selectedStaffForPortfolio} onOpenChange={() => setSelectedStaffForPortfolio(null)}>
        <DialogContent className="sm:max-w-4xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                <AvatarImage src={selectedStaffForPortfolio?.avatar} />
                <AvatarFallback className="text-3xl text-primary bg-white">{selectedStaffForPortfolio?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-black">{selectedStaffForPortfolio?.name}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-secondary text-primary border-none">{selectedStaffForPortfolio?.role}</Badge>
                  <span className="text-white/60 text-sm font-mono">{selectedStaffForPortfolio?.section}</span>
                </div>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8">
             <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest mb-4">Academic & Professional purview</h3>
                <div className="grid grid-cols-2 gap-8 text-sm">
                   <div>
                      <p className="font-bold opacity-40 uppercase text-[10px]">Highest Qualification</p>
                      <p className="font-black text-primary">{selectedStaffForPortfolio?.education?.degree}</p>
                   </div>
                   <div>
                      <p className="font-bold opacity-40 uppercase text-[10px]">Service History</p>
                      <p className="font-black text-primary">{selectedStaffForPortfolio?.experience?.years} Years</p>
                   </div>
                </div>
             </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t"><Button onClick={() => setSelectedStaffForPortfolio(null)} className="w-full">Close Portfolio</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
