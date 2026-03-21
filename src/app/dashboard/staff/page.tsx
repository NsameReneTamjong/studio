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
    id: "B001", 
    name: "Mme. Ngono Celine", 
    role: "BURSAR", 
    type: "Permanent",
    email: "celine.n@school.edu", 
    phone: "+237 699 11 22 33",
    gender: "Female",
    dob: "1980-10-20",
    address: "Akwa, Douala",
    department: "Finance", 
    status: "active", 
    joined: "Aug 2019", 
    avatar: "https://picsum.photos/seed/b1/100/100",
    education: {
      degree: "MBA in Finance",
      institution: "ESSEC Douala",
      year: "2008"
    },
    experience: {
      years: "15",
      previous: "Standard Chartered Bank"
    },
    portfolio: {
      bio: "Certified public accountant specializing in institutional financial management and audit compliance.",
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
  
  // States for Onboarding Form
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  const [formData, setFormData] = useState({
    // Personal
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "",
    address: "",
    // Academic
    degree: "",
    institution: "",
    gradYear: "",
    // Experience
    expYears: "",
    prevCompany: "",
    // Institutional
    role: "TEACHER",
    type: "Government-sent",
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
    if (!formData.name || !formData.email) {
      toast({ variant: "destructive", title: "Missing Info", description: "Name and Email are required." });
      return;
    }

    const newStaffMember = {
      id: `ST-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      dob: formData.dob,
      address: formData.address,
      role: formData.role,
      type: formData.type,
      department: formData.department,
      joined: formData.joined,
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
      portfolio: {
        bio: "Profile pending completion by employee.",
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
          <DialogContent className="sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black">Register New Staff</DialogTitle>
              <DialogDescription className="text-white/60">Complete the employee's professional profile to generate appointment records.</DialogDescription>
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
                    <div className="col-span-2 space-y-2">
                      <Label>Full Name</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Jean Dupont" />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Institutional Email</Label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@school.edu" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+237 ..." />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Residential Address</Label>
                      <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="City, Quarter" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <Label>Highest Degree / Certification</Label>
                      <Input value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} placeholder="e.g. Ph.D in Physics" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Institution of Award</Label>
                      <Input value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} placeholder="e.g. University of Yaoundé I" />
                    </div>
                    <div className="space-y-2">
                      <Label>Year of Graduation</Label>
                      <Input value={formData.gradYear} onChange={(e) => setFormData({...formData, gradYear: e.target.value})} placeholder="e.g. 2015" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Total Years of Experience</Label>
                      <Input type="number" value={formData.expYears} onChange={(e) => setFormData({...formData, expYears: e.target.value})} placeholder="e.g. 10" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Previous Institution / Company</Label>
                      <Input value={formData.prevCompany} onChange={(e) => setFormData({...formData, prevCompany: e.target.value})} placeholder="e.g. GBHS Douala" />
                    </div>
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
                          <SelectItem value="BURSAR">Bursar</SelectItem>
                          <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                          <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.role === 'TEACHER' && (
                      <div className="space-y-2">
                        <Label>Teacher Classification</Label>
                        <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Government-sent">Government-sent</SelectItem>
                            <SelectItem value="School-employed">School-employed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} placeholder="e.g. Sciences" />
                    </div>
                    <div className="space-y-2">
                      <Label>Effective Joined Date</Label>
                      <Input type="date" value={formData.joined} onChange={(e) => setFormData({...formData, joined: e.target.value})} />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStaff} className="flex-1 rounded-xl h-12 shadow-lg font-bold">Onboard & Generate Form</Button>
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
        <DialogContent className="sm:max-w-4xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] overflow-y-auto">
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
          <div className="p-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b pb-2">
                  <User className="w-4 h-4" /> Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Gender</p>
                    <p className="text-sm font-bold">{selectedStaffForPortfolio?.gender || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Date of Birth</p>
                    <p className="text-sm font-bold">{selectedStaffForPortfolio?.dob || 'Not set'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Residential Address</p>
                    <p className="text-sm font-bold">{selectedStaffForPortfolio?.address || 'Not set'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Contact Number</p>
                    <p className="text-sm font-bold flex items-center gap-2 text-primary"><Phone className="w-3 h-3"/> {selectedStaffForPortfolio?.phone || 'Not set'}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b pb-2">
                  <GraduationCap className="w-4 h-4" /> Academic Background
                </h3>
                <div className="bg-accent/20 p-4 rounded-xl space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Qualification</p>
                    <p className="text-sm font-black text-primary">{selectedStaffForPortfolio?.education?.degree || 'No Degree info'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Awarding Body</p>
                    <p className="text-sm font-bold">{selectedStaffForPortfolio?.education?.institution || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Graduation Year</p>
                    <p className="text-sm font-bold">{selectedStaffForPortfolio?.education?.year || 'N/A'}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b pb-2">
                <Briefcase className="w-4 h-4" /> Professional Profile
              </h3>
              <div className="bg-white p-6 rounded-2xl border border-accent shadow-sm space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">About the Professional</p>
                  <p className="text-sm italic leading-relaxed text-muted-foreground">"{selectedStaffForPortfolio?.portfolio?.bio}"</p>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Years of Exp.</p>
                    <p className="text-lg font-black text-primary">{selectedStaffForPortfolio?.experience?.years || '0'} Years</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Previously at</p>
                    <p className="text-lg font-bold truncate">{selectedStaffForPortfolio?.experience?.previous || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Object.entries(selectedStaffForPortfolio?.portfolio?.stats || {}).map(([key, val]: [string, any]) => (
                <div key={key} className="bg-primary p-4 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-black text-white/50 mb-1">{key}</p>
                  <p className="text-xl font-black text-white">{val}</p>
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
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
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

          <div id="printable-onboarding-form" className="p-12 bg-white font-serif text-black min-h-[1000px] relative overflow-hidden print:p-0">
            {/* Form Header */}
            <div className="flex flex-col items-center text-center space-y-4 border-b-2 border-black pb-8 mb-8">
              <Building2 className="w-16 h-16 text-primary/20 absolute top-12 right-12 opacity-50" />
              <div className="space-y-1 uppercase tracking-tight text-[10px] font-bold">
                <p>Republic of Cameroon</p>
                <p>Peace - Work - Fatherland</p>
                <div className="h-px bg-black w-12 mx-auto my-1" />
                <p>{user?.school?.name || "Lycée de Joss"}</p>
                <p>{user?.school?.location || "Douala, Littoral"}</p>
              </div>
              <h1 className="text-2xl font-black uppercase underline decoration-2 underline-offset-8 mt-4">
                Institutional Appointment & Onboarding Form
              </h1>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-12 gap-8">
              {/* Profile Side */}
              <div className="col-span-3 space-y-6">
                <div className="w-full aspect-square border-2 border-black rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center">
                  <img src={onboardingSuccess?.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 bg-black/5 text-center rounded border border-black/10">
                  <p className="text-[9px] uppercase font-bold opacity-60">Matricule ID</p>
                  <p className="text-sm font-mono font-black">{onboardingSuccess?.id}</p>
                </div>
                <div className="space-y-4 text-[11px]">
                  <h4 className="font-black uppercase border-b border-black/20 pb-1">Role Detail</h4>
                  <div className="space-y-2">
                    <p><span className="font-bold">Designation:</span> {onboardingSuccess?.role}</p>
                    <p><span className="font-bold">Class:</span> {onboardingSuccess?.type || 'Permanent'}</p>
                    <p><span className="font-bold">Dept:</span> {onboardingSuccess?.department}</p>
                    <p><span className="font-bold">Effective:</span> {onboardingSuccess?.joined}</p>
                  </div>
                </div>
              </div>

              {/* Data Side */}
              <div className="col-span-9 space-y-8">
                {/* Personal Section */}
                <section className="space-y-3">
                  <h3 className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> Section I: Personal Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[12px]">
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Full Name</span> {onboardingSuccess?.name}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Institutional Email</span> {onboardingSuccess?.email}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Phone Number</span> {onboardingSuccess?.phone}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Date of Birth</span> {onboardingSuccess?.dob}</p>
                    <p className="col-span-2"><span className="font-bold uppercase opacity-50 text-[9px] block">Residential Address</span> {onboardingSuccess?.address}</p>
                  </div>
                </section>

                {/* Academic Section */}
                <section className="space-y-3">
                  <h3 className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 flex items-center gap-2">
                    <GraduationCap className="w-3 h-3" /> Section II: Academic Credentials
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[12px]">
                    <p className="col-span-2"><span className="font-bold uppercase opacity-50 text-[9px] block">Highest Qualification</span> {onboardingSuccess?.education?.degree}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Awarding Institution</span> {onboardingSuccess?.education?.institution}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Graduation Year</span> {onboardingSuccess?.education?.year}</p>
                  </div>
                </section>

                {/* Experience Section */}
                <section className="space-y-3">
                  <h3 className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Section III: Professional Experience
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[12px]">
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Total Service Years</span> {onboardingSuccess?.experience?.years} Years</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Previous Affiliation</span> {onboardingSuccess?.experience?.previous}</p>
                  </div>
                </section>

                {/* Terms */}
                <section className="mt-8 p-4 border-2 border-black/10 rounded bg-accent/5">
                  <p className="text-[11px] leading-relaxed italic">
                    The individual named above is hereby formally onboarded into the institutional portal of <strong>{user?.school?.name || 'this school'}</strong>. 
                    This appointment grants full professional access to the assigned pedagogical and administrative modules effective from the date of registration. 
                    The employee agrees to abide by the digital privacy and operational policies of the institution.
                  </p>
                </section>
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-16 grid grid-cols-2 gap-20">
              <div className="space-y-10">
                <div className="h-px bg-black w-full" />
                <div className="text-center">
                  <p className="font-bold text-[10px] uppercase">Employee Signature</p>
                  <p className="text-[8px] opacity-40 italic">Acceptance of Appointment & Terms</p>
                </div>
              </div>
              <div className="space-y-10 relative">
                <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 opacity-10">
                   <Signature className="w-16 h-16 -rotate-12" />
                </div>
                <div className="h-px bg-black w-full" />
                <div className="text-center">
                  <p className="font-bold text-[10px] uppercase">Authorized Registrar</p>
                  <p className="text-[10px] font-black">EduIgnite Institutional Verification</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 inset-x-0 text-center">
               <p className="text-[9px] uppercase font-black opacity-20 tracking-[0.3em]">
                 OFFICIAL DIGITAL DOSSIER • EduIgnite SaaS Onboarding Suite
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
