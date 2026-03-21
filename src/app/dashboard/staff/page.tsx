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
  Signature
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
    department: "Science", 
    status: "active", 
    joined: "Sept 2020", 
    avatar: "https://picsum.photos/seed/t1/100/100",
    portfolio: {
      bio: "Dedicated Physics educator with 15 years of experience in experimental research and thermodynamics.",
      education: "Ph.D. in Applied Physics - University of Buea",
      awards: ["Teacher of the Year 2022", "Innovation in STEM Award"],
      stats: { sessions: 142, students: 124, avgMark: "14.5/20" }
    },
    schedule: {
      Monday: [{ time: "08:00 AM", subject: "Physics Form 5A", room: "Lab 1" }],
      Tuesday: [{ time: "10:30 AM", subject: "Science Lower 6", room: "Room 402" }],
      Wednesday: [{ time: "08:00 AM", subject: "Physics Form 5A", room: "Lab 1" }],
      Thursday: [{ time: "11:30 AM", subject: "General Science", room: "Hall B" }],
      Friday: [{ time: "09:00 AM", subject: "Dept. Meeting", room: "Conference" }]
    }
  },
  { 
    id: "T002", 
    name: "Prof. Sarah Smith", 
    role: "TEACHER", 
    type: "School-employed",
    email: "sarah.s@school.edu", 
    department: "Mathematics", 
    status: "active", 
    joined: "Oct 2021", 
    avatar: "https://picsum.photos/seed/t2/100/100",
    portfolio: {
      bio: "Passionate mathematician focused on making complex calculus intuitive for high school students.",
      education: "M.Sc. Pure Mathematics - Sorbonne University",
      awards: ["Excellence in Bilingual Teaching"],
      stats: { sessions: 98, students: 85, avgMark: "15.2/20" }
    },
    schedule: {
      Monday: [{ time: "10:00 AM", subject: "Pure Maths", room: "Room 301" }],
      Wednesday: [{ time: "10:00 AM", subject: "Pure Maths", room: "Room 301" }],
      Friday: [{ time: "11:00 AM", subject: "Calculus Workshop", room: "Library" }]
    }
  },
  { 
    id: "B001", 
    name: "Mme. Ngono Celine", 
    role: "BURSAR", 
    type: "Permanent",
    email: "celine.n@school.edu", 
    department: "Finance", 
    status: "active", 
    joined: "Aug 2019", 
    avatar: "https://picsum.photos/seed/b1/100/100",
    portfolio: {
      bio: "Certified public accountant specializing in institutional financial management and audit compliance.",
      education: "MBA in Finance - ESSEC Douala",
      awards: ["Financial Integrity Ribbon"],
      stats: { transactions: "1.2k", auditsPassed: 4, compliance: "100%" }
    },
    schedule: {
      Daily: [{ time: "08:00 AM - 04:00 PM", subject: "Fee Collection & Accounting", room: "Bursary Office" }]
    }
  },
];

export default function StaffManagementPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New States for Onboarding Form
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "TEACHER",
    type: "Government-sent",
    email: "",
    department: "",
    joined: new Date().toISOString().split('T')[0]
  });

  // Detail Dialogs
  const [selectedStaffForPortfolio, setSelectedStaffForPortfolio] = useState<any>(null);
  const [selectedStaffForSchedule, setSelectedStaffForSchedule] = useState<any>(null);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    if (!formData.name || !formData.email) return;

    const newStaffMember = {
      id: `ST-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...formData,
      status: "active",
      avatar: `https://picsum.photos/seed/${formData.name}/100/100`,
      portfolio: {
        bio: "Profile pending completion by employee.",
        education: "Pending",
        awards: [],
        stats: { sessions: 0, students: 0, avgMark: "N/A" }
      },
      schedule: {}
    };

    setStaff(prev => [newStaffMember, ...prev]);
    setIsAddModalOpen(false);
    setOnboardingSuccess(newStaffMember);
    
    toast({
      title: "Staff Onboarded",
      description: `Appointment record generated for ${formData.name}.`,
    });
  };

  const handleStatusToggle = (id: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === id) {
        const newStatus = s.status === 'active' ? 'suspended' : 'active';
        toast({
          title: "Status Updated",
          description: `${s.name} is now ${newStatus}.`,
        });
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TEACHER': return 'bg-purple-100 text-purple-700';
      case 'BURSAR': case 'ACCOUNTANT': return 'bg-green-100 text-green-700';
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
          <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black">Register New Staff</DialogTitle>
              <DialogDescription className="text-white/60">Define role and departmental assignment for the new employee.</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="e.g. Jean Dupont" 
                    className="bg-accent/30 border-none h-12"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                    <SelectTrigger className="bg-accent/30 border-none h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="BURSAR">Bursar</SelectItem>
                      <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                      <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.role === 'TEACHER' && (
                  <div className="space-y-2">
                    <Label>Teacher Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                      <SelectTrigger className="bg-accent/30 border-none h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Government-sent">Government-sent</SelectItem>
                        <SelectItem value="School-employed">School-employed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="col-span-2 space-y-2">
                  <Label>Institutional Email</Label>
                  <Input 
                    type="email" 
                    placeholder="name@school.edu" 
                    className="bg-accent/30 border-none h-12"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input 
                    placeholder="e.g. Science" 
                    className="bg-accent/30 border-none h-12"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Join Date</Label>
                  <Input 
                    type="date" 
                    className="bg-accent/30 border-none h-12"
                    value={formData.joined}
                    onChange={(e) => setFormData({...formData, joined: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStaff} className="flex-1 rounded-xl h-12 shadow-lg font-bold">Onboard Professional</Button>
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
              <TableRow className="bg-accent/10 border-b border-accent/20 hover:bg-accent/10">
                <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Staff ID</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Professional Profile</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Designation</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Department</TableHead>
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
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">
                          {s.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary leading-none mb-1">{s.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{s.email}</span>
                          {s.type && (
                            <Badge variant="ghost" className="h-3 px-1.5 text-[8px] uppercase border-none bg-accent text-primary">
                              {s.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px] border-none font-black uppercase tracking-tighter", getRoleColor(s.role))}>
                      {s.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground">
                    {s.department}
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
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setOnboardingSuccess(s)}>
                          <Printer className="w-4 h-4 text-primary" /> Onboarding Form
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusToggle(s.id)}>
                          {s.status === 'active' ? (
                            <><Ban className="w-4 h-4 text-amber-600" /> Suspend Account</>
                          ) : (
                            <><CheckCircle2 className="w-4 h-4 text-green-600" /> Activate Account</>
                          )}
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

      {/* Portfolio Dialog */}
      <Dialog open={!!selectedStaffForPortfolio} onOpenChange={() => setSelectedStaffForPortfolio(null)}>
        <DialogContent className="sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] overflow-y-auto">
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
                  <span className="text-white/60 text-sm font-mono">{selectedStaffForPortfolio?.id}</span>
                </div>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4" /> Professional Background
              </h3>
              <div className="bg-accent/20 p-6 rounded-2xl border border-accent">
                <p className="text-sm italic leading-relaxed text-muted-foreground">"{selectedStaffForPortfolio?.portfolio?.bio}"</p>
                <div className="mt-4 pt-4 border-t border-accent grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Education</p>
                    <p className="text-sm font-bold text-primary">{selectedStaffForPortfolio?.portfolio?.education}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Department</p>
                    <p className="text-sm font-bold text-primary">{selectedStaffForPortfolio?.department}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Object.entries(selectedStaffForPortfolio?.portfolio?.stats || {}).map(([key, val]: [string, any]) => (
                <div key={key} className="bg-white p-4 rounded-xl shadow-sm border border-accent text-center">
                  <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">{key}</p>
                  <p className="text-xl font-black text-primary">{val}</p>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t">
            <Button onClick={() => setSelectedStaffForPortfolio(null)} className="rounded-xl w-full h-12 shadow-lg">Close Portfolio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={!!selectedStaffForSchedule} onOpenChange={() => setSelectedStaffForSchedule(null)}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-secondary p-8 text-primary">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/50 rounded-xl">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Duty Timetable</DialogTitle>
                <DialogDescription className="text-primary/60 font-bold">{selectedStaffForSchedule?.name} • Weekly Workload</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-0">
            <ScrollArea className="max-h-[60vh]">
              <div className="p-8 space-y-6">
                {selectedStaffForSchedule?.schedule && Object.keys(selectedStaffForSchedule.schedule).map((day) => (
                  <div key={day} className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b pb-2 flex items-center justify-between">
                      {day}
                      <Badge variant="outline" className="text-[9px] h-5 border-primary/20">{selectedStaffForSchedule.schedule[day].length} slots</Badge>
                    </h4>
                    <div className="space-y-2">
                      {selectedStaffForSchedule.schedule[day].map((slot: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm group hover:ring-2 hover:ring-primary/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="bg-accent/30 p-2 rounded-lg text-primary">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-primary">{slot.subject}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">{slot.time}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-primary/40 uppercase">Room</span>
                            <span className="text-xs font-bold flex items-center gap-1"><MapPin className="w-3 h-3"/> {slot.room}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t flex justify-between items-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Workload Registry
            </p>
            <Button variant="ghost" onClick={() => setSelectedStaffForSchedule(null)}>Close Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SUCCESS & PRINTABLE ONBOARDING FORM */}
      <Dialog open={!!onboardingSuccess} onOpenChange={() => setOnboardingSuccess(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="bg-green-600 p-8 text-white no-print">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <FileCheck className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">Onboarding Successful!</DialogTitle>
                <DialogDescription className="text-white/80">Staff member has been added to the registry. Print the form below for physical records.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div id="printable-onboarding-form" className="p-12 bg-white font-serif text-black min-h-[800px] relative overflow-hidden print:p-0">
            {/* Form Header */}
            <div className="flex flex-col items-center text-center space-y-4 border-b-2 border-black pb-8 mb-10">
              <Building2 className="w-16 h-16 text-primary/20 absolute top-12 right-12 opacity-50" />
              <div className="space-y-1 uppercase tracking-tight text-xs font-bold">
                <p>Republic of Cameroon</p>
                <p>Peace - Work - Fatherland</p>
                <div className="h-px bg-black w-12 mx-auto my-1" />
                <p>{user?.school?.name || "Lycée de Joss"}</p>
                <p>{user?.school?.location || "Douala, Littoral"}</p>
              </div>
              <h1 className="text-3xl font-black uppercase underline decoration-2 underline-offset-8 mt-6">
                Institutional Appointment & Onboarding Form
              </h1>
            </div>

            {/* Employee Details Section */}
            <div className="grid grid-cols-12 gap-10 items-start">
              <div className="col-span-3">
                <div className="w-32 h-32 border-2 border-black rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center">
                  <img src={onboardingSuccess?.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 p-2 bg-black/5 text-center rounded border border-black/10">
                  <p className="text-[10px] uppercase font-bold opacity-60">Matricule ID</p>
                  <p className="text-sm font-mono font-black">{onboardingSuccess?.id}</p>
                </div>
              </div>

              <div className="col-span-9 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase opacity-50">Full Name</p>
                    <p className="text-lg font-black border-b border-black/10 pb-1">{onboardingSuccess?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase opacity-50">Designation / Role</p>
                    <p className="text-lg font-black border-b border-black/10 pb-1">{onboardingSuccess?.role}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase opacity-50">Employment Type</p>
                    <p className="text-lg font-bold border-b border-black/10 pb-1">{onboardingSuccess?.type || "Permanent Administrative"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase opacity-50">Assigned Department</p>
                    <p className="text-lg font-bold border-b border-black/10 pb-1">{onboardingSuccess?.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase opacity-50">Effective Date</p>
                    <p className="text-lg font-bold border-b border-black/10 pb-1">{onboardingSuccess?.joined}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase opacity-50">Institutional Email</p>
                    <p className="text-lg font-medium italic border-b border-black/10 pb-1">{onboardingSuccess?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Summary */}
            <div className="mt-12 p-6 border-2 border-black/5 rounded-xl bg-accent/5 space-y-4">
              <h3 className="font-black text-sm uppercase flex items-center gap-2">
                <FileText className="w-4 h-4" /> Onboarding Certification
              </h3>
              <p className="text-sm leading-relaxed italic">
                This document serves as the official digital onboarding record for the above-named professional at <strong>{user?.school?.name}</strong>. 
                The employee is hereby registered into the institutional portal with the designated role and permissions. 
                Full access to pedagogical and administrative modules has been granted effective as of the registration date.
              </p>
            </div>

            {/* Signature Section */}
            <div className="mt-20 grid grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="h-px bg-black w-full" />
                <div className="text-center">
                  <p className="font-bold text-xs uppercase">Employee Signature</p>
                  <p className="text-[9px] opacity-40 italic mt-1">Acceptance of digital policy</p>
                </div>
              </div>
              <div className="space-y-12">
                <div className="flex justify-center h-12 items-end">
                   <Signature className="w-12 h-12 text-primary opacity-10 -rotate-12" />
                </div>
                <div className="h-px bg-black w-full" />
                <div className="text-center">
                  <p className="font-bold text-xs uppercase">Authorized Registrar</p>
                  <p className="text-sm font-black mt-1">EduIgnite Automated Verification</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 inset-x-0 text-center">
               <p className="text-[10px] uppercase font-black opacity-20 tracking-[0.3em]">
                 Official Digital Document • EduIgnite SaaS Onboarding Suite
               </p>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t no-print flex sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 gap-2 rounded-xl h-12" onClick={() => setOnboardingSuccess(null)}>
              Dismiss
            </Button>
            <Button className="flex-1 gap-2 rounded-xl h-12 shadow-lg" onClick={() => window.print()}>
              <Printer className="w-5 h-5" /> Print Appointment Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
