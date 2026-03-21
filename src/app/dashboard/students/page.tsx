
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  User, 
  FileDown, 
  FileType, 
  Coins, 
  Download, 
  Users,
  Calendar,
  Layers,
  VenetianMask
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
            <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
              <Plus className="w-5 h-5" /> Add New Student
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Statistics Cards */}
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
    </div>
  );
}
