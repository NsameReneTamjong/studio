
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Search, Filter, User, FileDown, FileType, Coins } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    left: 25000
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
    left: 0
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
    left: 105000
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
    left: 0
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
    left: 75000
  },
];

export default function StudentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [feeType, setFeeType] = useState("tuition");

  const filtered = MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const isBursar = user?.role === "BURSAR";
  const isTeacher = user?.role === "TEACHER";
  const isAdmin = ["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(user?.role || "");
  
  const canAdd = isAdmin;

  const handleExport = (type: 'PDF' | 'Excel') => {
    toast({
      title: isBursar ? `Exporting Financial Statistics` : `Exporting Student List`,
      description: `The report is being generated as a ${type} file.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">
            {isBursar ? "Financial Student Records" : "Student Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isBursar 
              ? "Monitor student payment statuses and outstanding balances." 
              : "Institutional records for all enrolled students."}
          </p>
        </div>
        {canAdd && (
          <Button className="gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> Add New Student
          </Button>
        )}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, ID or email..." 
                className="pl-10 h-11" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {isBursar && (
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-primary" />
                  <Select value={feeType} onValueChange={setFeeType}>
                    <SelectTrigger className="w-[180px] h-11">
                      <SelectValue placeholder="Fee Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition Fees</SelectItem>
                      <SelectItem value="uniform">Uniform Package</SelectItem>
                      <SelectItem value="transport">Transport Fee</SelectItem>
                      <SelectItem value="exams">Exam Fees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button variant="outline" className="gap-2 h-11">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/30 hover:bg-accent/30">
                  <TableHead className="w-[120px] font-black uppercase text-[10px] tracking-widest pl-6 py-4">Matricule</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Student Profile</TableHead>
                  
                  {isBursar ? (
                    <>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Class</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">Paid (XAF)</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-6">Left (XAF)</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Gender</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest pr-6">Date of Birth</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-accent/5 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-primary pl-6">{student.id}</TableCell>
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
                    
                    {isBursar ? (
                      <>
                        <TableCell className="text-xs font-bold text-muted-foreground">{student.class}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm font-black text-green-600">
                            {student.paid.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <span className={`text-sm font-black ${student.left > 0 ? 'text-red-600' : 'text-primary opacity-30'}`}>
                            {student.left.toLocaleString()}
                          </span>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-sm font-medium">{student.gender}</TableCell>
                        <TableCell className="text-sm font-medium pr-6">{student.dob}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 h-10 px-4 text-xs font-black uppercase tracking-widest shadow-sm"
                onClick={() => handleExport('PDF')}
              >
                <FileDown className="w-4 h-4" /> 
                {isBursar ? "Export Debt Statistics" : "Export PDF List"}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 h-10 px-4 text-xs font-black uppercase tracking-widest shadow-sm"
                onClick={() => handleExport('Excel')}
              >
                <FileType className="w-4 h-4" /> 
                {isBursar ? "Revenue Report" : "Export Excel"}
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
              <span>Displaying {filtered.length} students</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
