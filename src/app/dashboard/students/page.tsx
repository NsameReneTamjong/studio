
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  User, 
  FileDown, 
  FileType, 
  Coins, 
  Users,
  Calendar,
  Layers,
  VenetianMask,
  UserPlus,
  Building2,
  FileCheck,
  Printer,
  Signature,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Info,
  Heart,
  QrCode,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const MOCK_STUDENTS = [
  { 
    id: "S001", 
    name: "Alice Thompson", 
    gender: "Female", 
    dob: "15/05/2008", 
    email: "alice.t@school.edu", 
    avatar: "https://picsum.photos/seed/s1/100/100",
    class: "Form 5 / 2nde",
    paid: 125000,
    left: 25000,
    enrolmentYear: "2023"
  },
  { 
    id: "S002", 
    name: "Bob Richards", 
    gender: "Male", 
    dob: "22/11/2006", 
    email: "bob.r@school.edu", 
    avatar: "https://picsum.photos/seed/s2/100/100",
    class: "Upper Sixth / Terminale",
    paid: 150000,
    left: 0,
    enrolmentYear: "2022"
  },
  { 
    id: "S003", 
    name: "Charlie Davis", 
    gender: "Male", 
    dob: "10/03/2007", 
    email: "charlie.d@school.edu", 
    avatar: "https://picsum.photos/seed/s3/100/100",
    class: "Lower Sixth / 1ère",
    paid: 45000,
    left: 105000,
    enrolmentYear: "2023"
  },
  { 
    id: "S004", 
    name: "Diana Prince", 
    gender: "Female", 
    dob: "05/01/2008", 
    email: "diana.p@school.edu", 
    avatar: "https://picsum.photos/seed/s4/100/100",
    class: "Form 5 / 2nde",
    paid: 150000,
    left: 0,
    enrolmentYear: "2023"
  },
  { 
    id: "S005", 
    name: "Ethan Hunt", 
    gender: "Male", 
    dob: "30/09/2006", 
    email: "ethan.h@school.edu", 
    avatar: "https://picsum.photos/seed/s5/100/100",
    class: "Upper Sixth / Terminale",
    paid: 75000,
    left: 75000,
    enrolmentYear: "2021"
  },
];

const CLASSES = ["Form 5 / 2nde", "Lower Sixth / 1ère", "Upper Sixth / Terminale"];
const YEARS = ["2021", "2022", "2023", "2024"];

export default function StudentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [feeType, setFeeType] = useState("tuition");

  // Add Student State
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [admissionSuccess, setAdmissionSuccess] = useState<any>(null);
  const [admissionForm, setAdmissionForm] = useState({
    name: "",
    gender: "Female",
    dob: "",
    email: "",
    phone: "",
    address: "",
    parentName: "",
    parentPhone: "",
    class: "Form 5 / 2nde",
    section: "A",
    enrolmentYear: "2024"
  });

  const filtered = MOCK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || s.class === classFilter;
    const matchesGender = genderFilter === "all" || s.gender === genderFilter;
    const matchesYear = yearFilter === "all" || s.enrolmentYear === yearFilter;
    
    return matchesSearch && matchesClass && matchesGender && matchesYear;
  });
  
  const isBursar = user?.role === "BURSAR";
  const isAdmin = ["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(user?.role || "");
  
  const handleExport = (type: 'PDF' | 'Excel') => {
    toast({
      title: `Exporting Registry`,
      description: `The list of ${filtered.length} students is being generated as ${type}.`,
    });
  };

  const handleAdmission = () => {
    if (!admissionForm.name || !admissionForm.parentName) {
      toast({ variant: "destructive", title: "Missing Information", description: "Student Name and Parent Name are required." });
      return;
    }

    const newStudent = {
      id: `S-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...admissionForm,
      avatar: `https://picsum.photos/seed/${admissionForm.name}/100/100`,
      paid: 0,
      left: 150000
    };

    setIsAdmissionOpen(false);
    setAdmissionSuccess(newStudent);
    toast({
      title: "Student Admitted",
      description: `Admission record created for ${admissionForm.name}.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            {isBursar ? "Financial Student Records" : "Student Registry"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isBursar 
              ? "Monitor student payment statuses and outstanding balances." 
              : "Institutional records for all enrolled students."}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Dialog open={isAdmissionOpen} onOpenChange={setIsAdmissionOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
                  <UserPlus className="w-5 h-5" /> Add New Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <GraduationCap className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black">Student Admission Suite</DialogTitle>
                      <DialogDescription className="text-white/60">Onboard a new student into the institutional registry.</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full rounded-none bg-accent/30 h-12">
                    <TabsTrigger value="profile">Student Profile</TabsTrigger>
                    <TabsTrigger value="parent">Guardian Details</TabsTrigger>
                    <TabsTrigger value="academic">Academic Class</TabsTrigger>
                  </TabsList>
                  
                  <div className="p-8 max-h-[60vh] overflow-y-auto">
                    <TabsContent value="profile" className="space-y-6 mt-0">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                          <Label>Full Name</Label>
                          <Input value={admissionForm.name} onChange={(e) => setAdmissionForm({...admissionForm, name: e.target.value})} placeholder="e.g. Alice Thompson" className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select value={admissionForm.gender} onValueChange={(v) => setAdmissionForm({...admissionForm, gender: v})}>
                            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Input type="date" value={admissionForm.dob} onChange={(e) => setAdmissionForm({...admissionForm, dob: e.target.value})} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email (Optional)</Label>
                          <Input value={admissionForm.email} onChange={(e) => setAdmissionForm({...admissionForm, email: e.target.value})} placeholder="student@school.edu" className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Student Phone</Label>
                          <Input value={admissionForm.phone} onChange={(e) => setAdmissionForm({...admissionForm, phone: e.target.value})} placeholder="+237 ..." className="h-11 rounded-xl" />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Residential Address</Label>
                          <Input value={admissionForm.address} onChange={(e) => setAdmissionForm({...admissionForm, address: e.target.value})} placeholder="City, Quarter" className="h-11 rounded-xl" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="parent" className="space-y-6 mt-0">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                          <Label>Parent / Guardian Full Name</Label>
                          <Input value={admissionForm.parentName} onChange={(e) => setAdmissionForm({...admissionForm, parentName: e.target.value})} placeholder="e.g. Mr. Robert Thompson" className="h-11 rounded-xl" />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Guardian Primary Contact</Label>
                          <Input value={admissionForm.parentPhone} onChange={(e) => setAdmissionForm({...admissionForm, parentPhone: e.target.value})} placeholder="+237 ..." className="h-11 rounded-xl" />
                        </div>
                        <div className="col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800 leading-relaxed">
                            A parent portal account will be automatically generated and linked to this student profile using the guardian's contact information.
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="academic" className="space-y-6 mt-0">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                          <Label>Target Academic Class</Label>
                          <Select value={admissionForm.class} onValueChange={(v) => setAdmissionForm({...admissionForm, class: v})}>
                            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Assigned Section</Label>
                          <Select value={admissionForm.section} onValueChange={(v) => setAdmissionForm({...admissionForm, section: v})}>
                            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Section A</SelectItem>
                              <SelectItem value="B">Section B</SelectItem>
                              <SelectItem value="C">Section C</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Enrolment Year</Label>
                          <Select value={admissionForm.enrolmentYear} onValueChange={(v) => setAdmissionForm({...admissionForm, enrolmentYear: v})}>
                            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
                  <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsAdmissionOpen(false)}>Cancel</Button>
                  <Button onClick={handleAdmission} className="flex-1 rounded-xl h-12 shadow-lg font-bold">Validate Admission</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Filtered Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{filtered.length} Students</div>
          </CardContent>
        </Card>
        
        {isBursar && (
          <Card className="border-none shadow-sm bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase font-bold text-red-600 tracking-widest">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-red-700">
                {filtered.reduce((acc, curr) => acc + curr.left, 0).toLocaleString()} XAF
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or Matricule..." 
                  className="pl-10 h-12 bg-accent/20 border-none rounded-xl" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  variant="secondary" 
                  className="gap-2 h-12 rounded-xl bg-primary text-white hover:bg-primary/90"
                  onClick={() => handleExport('PDF')}
                >
                  <FileDown className="w-4 h-4" /> Export PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 h-12 rounded-xl border-primary/20"
                  onClick={() => handleExport('Excel')}
                >
                  <FileType className="w-4 h-4" /> Export Excel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-accent/10 rounded-2xl border border-accent">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2">
                  <Layers className="w-3 h-3"/> Class Level
                </Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="bg-white border-none h-10 rounded-lg shadow-sm">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2">
                  <VenetianMask className="w-3 h-3"/> Gender
                </Label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="bg-white border-none h-10 rounded-lg shadow-sm">
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3 h-3"/> Enrolment Year
                </Label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="bg-white border-none h-10 rounded-lg shadow-sm">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {isBursar && (
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2">
                    <Coins className="w-3 h-3"/> Fee Category
                  </Label>
                  <Select value={feeType} onValueChange={setFeeType}>
                    <SelectTrigger className="bg-white border-none h-10 rounded-lg shadow-sm">
                      <SelectValue placeholder="Fee Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition Fees</SelectItem>
                      <SelectItem value="uniform">Uniform Package</SelectItem>
                      <SelectItem value="exams">Exam Fees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/10 border-b border-accent/20">
                  <TableHead className="w-[120px] font-black uppercase text-[10px] tracking-widest pl-8 py-4">Matricule</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Student Profile</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Academic Class</TableHead>
                  
                  {isBursar ? (
                    <>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">Paid (XAF)</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Balance (XAF)</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Gender</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Enrolled</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest pr-8 text-right">Birthday</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-accent/5 transition-colors border-b border-accent/10">
                    <TableCell className="font-mono text-xs font-bold text-primary pl-8">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary leading-none mb-1">{student.name}</span>
                          <span className="text-[10px] text-muted-foreground">{student.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-primary/20 text-primary font-bold">
                        {student.class}
                      </Badge>
                    </TableCell>
                    
                    {isBursar ? (
                      <>
                        <TableCell className="text-right">
                          <span className="text-sm font-black text-green-600">
                            {student.paid.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <span className={`text-sm font-black ${student.left > 0 ? 'text-red-600' : 'text-primary opacity-30'}`}>
                            {student.left.toLocaleString()}
                          </span>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">{student.gender}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-accent text-primary border-none text-[10px]">{student.enrolmentYear}</Badge>
                        </TableCell>
                        <TableCell className="text-sm font-medium pr-8 text-right text-muted-foreground">{student.dob}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isBursar ? 5 : 6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                        <Users className="w-12 h-12 opacity-10" />
                        <p className="font-bold">No students match your active filters.</p>
                        <Button variant="link" onClick={() => { setClassFilter("all"); setGenderFilter("all"); setYearFilter("all"); setSearchTerm(""); }}>
                          Clear all filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* SUCCESS & PRINTABLE ADMISSION FORM */}
      <Dialog open={!!admissionSuccess} onOpenChange={() => setAdmissionSuccess(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="bg-green-600 p-8 text-white no-print">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <FileCheck className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">Admission Confirmed!</DialogTitle>
                <DialogDescription className="text-white/80">The student has been successfully enrolled. Print the formal admission letter below.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div id="printable-admission-form" className="p-12 bg-white font-serif text-black min-h-[1000px] relative overflow-hidden print:p-0">
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
                Official Student Admission & Enrollment Form
              </h1>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-12 gap-8">
              {/* Profile Side */}
              <div className="col-span-3 space-y-6">
                <div className="w-full aspect-square border-2 border-black rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center">
                  <img src={admissionSuccess?.avatar} alt="Student" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 bg-black/5 text-center rounded border border-black/10">
                  <p className="text-[9px] uppercase font-bold opacity-60">Admission No. (Matricule)</p>
                  <p className="text-sm font-mono font-black">{admissionSuccess?.id}</p>
                </div>
                <div className="space-y-4 text-[11px]">
                  <h4 className="font-black uppercase border-b border-black/20 pb-1">Academic Assignment</h4>
                  <div className="space-y-2">
                    <p><span className="font-bold">Class Level:</span> {admissionSuccess?.class}</p>
                    <p><span className="font-bold">Section:</span> {admissionSuccess?.section}</p>
                    <p><span className="font-bold">Enrolment Year:</span> {admissionSuccess?.enrolmentYear}</p>
                    <p><span className="font-bold">Campus:</span> Main Campus</p>
                  </div>
                </div>
                <div className="pt-4 flex flex-col items-center">
                   <QrCode className="w-24 h-24 opacity-20" />
                   <p className="text-[8px] font-bold uppercase mt-2 opacity-40">Scan for Verification</p>
                </div>
              </div>

              {/* Data Side */}
              <div className="col-span-9 space-y-8">
                {/* Personal Section */}
                <section className="space-y-3">
                  <h3 className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> Section I: Student Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[12px]">
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Full Legal Name</span> {admissionSuccess?.name}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Gender</span> {admissionSuccess?.gender}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Date of Birth</span> {admissionSuccess?.dob}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Contact Number</span> {admissionSuccess?.phone || 'N/A'}</p>
                    <p className="col-span-2"><span className="font-bold uppercase opacity-50 text-[9px] block">Home Address</span> {admissionSuccess?.address}</p>
                  </div>
                </section>

                {/* Guardian Section */}
                <section className="space-y-3">
                  <h3 className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 flex items-center gap-2">
                    <Heart className="w-3 h-3" /> Section II: Guardian Information
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[12px]">
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Parent / Guardian Name</span> {admissionSuccess?.parentName}</p>
                    <p><span className="font-bold uppercase opacity-50 text-[9px] block">Primary Phone</span> {admissionSuccess?.parentPhone}</p>
                  </div>
                </section>

                {/* Status Section */}
                <section className="space-y-3">
                  <h3 className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Section III: Enrolment Terms
                  </h3>
                  <div className="p-4 border-2 border-black/10 rounded bg-accent/5">
                    <p className="text-[11px] leading-relaxed italic">
                      The student named above is hereby admitted to <strong>{user?.school?.name || 'this institution'}</strong> for the 2024/2025 academic session. This admission is subject to the validation of original birth certificates and previous academic transcripts. The student and guardian agree to abide by the institutional code of conduct and financial policies.
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-16 grid grid-cols-2 gap-20">
              <div className="space-y-10">
                <div className="h-px bg-black w-full" />
                <div className="text-center">
                  <p className="font-bold text-[10px] uppercase">Parent / Guardian Signature</p>
                  <p className="text-[8px] opacity-40 italic">Acceptance of Terms & Admission</p>
                </div>
              </div>
              <div className="space-y-10 relative">
                <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 opacity-10">
                   <Signature className="w-16 h-16 -rotate-12" />
                </div>
                <div className="h-px bg-black w-full" />
                <div className="text-center">
                  <p className="font-bold text-[10px] uppercase">Registrar / Principal</p>
                  <p className="text-[10px] font-black">EduIgnite Institutional Verification</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 inset-x-0 text-center">
               <p className="text-[9px] uppercase font-black opacity-20 tracking-[0.3em]">
                 OFFICIAL ENROLLMENT DOSSIER • EduIgnite SaaS Admission Suite
               </p>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t no-print flex sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 gap-2 rounded-xl h-12" onClick={() => setAdmissionSuccess(null)}>
              Dismiss
            </Button>
            <Button className="flex-1 gap-2 rounded-xl h-12 shadow-lg" onClick={() => window.print()}>
              <Printer className="w-5 h-5" /> Print Admission Letter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
