"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, MoreHorizontal, Filter, Eye, User, FileDown, FileType } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", gender: "Female", dob: "15/05/2008", email: "alice.t@school.edu", avatar: "https://picsum.photos/seed/s1/100/100" },
  { id: "S002", name: "Bob Richards", gender: "Male", dob: "22/11/2006", email: "bob.r@school.edu", avatar: "https://picsum.photos/seed/s2/100/100" },
  { id: "S003", name: "Charlie Davis", gender: "Male", dob: "10/03/2007", email: "charlie.d@school.edu", avatar: "https://picsum.photos/seed/s3/100/100" },
  { id: "S004", name: "Diana Prince", gender: "Female", dob: "05/01/2008", email: "diana.p@school.edu", avatar: "https://picsum.photos/seed/s4/100/100" },
  { id: "S005", name: "Ethan Hunt", gender: "Male", dob: "30/09/2006", email: "ethan.h@school.edu", avatar: "https://picsum.photos/seed/s5/100/100" },
];

export default function StudentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const canAdd = ["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(user?.role || "");

  const handleExport = (type: 'PDF' | 'Excel') => {
    toast({
      title: `Exporting to ${type}`,
      description: `The student list is being generated as a ${type} file.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Student Management</h1>
          <p className="text-muted-foreground mt-1">Institutional records for all enrolled students.</p>
        </div>
        {canAdd && (
          <Button className="gap-2 shadow-lg">
            <Plus className="w-4 h-4" /> Add New Student
          </Button>
        )}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, ID or email..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/30 hover:bg-accent/30">
                  <TableHead className="w-[120px] font-bold uppercase text-[10px] tracking-wider">Matricule</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-wider">Student Profile</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-wider">Gender</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-wider">Date of Birth</TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px] tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-accent/5 transition-colors">
                    <TableCell className="font-mono text-xs font-bold text-primary">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary leading-none mb-1">{student.name}</span>
                          <span className="text-[10px] text-muted-foreground">{student.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{student.gender}</TableCell>
                    <TableCell className="text-sm font-medium">{student.dob}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[10px] font-black uppercase tracking-tighter" asChild>
                          <Link href={`/dashboard/children/view?id=${student.id}`}>
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </Link>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Options</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/children/view?id=${student.id}`}>View Full File</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Update Record</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 h-9 text-xs font-bold shadow-sm"
                onClick={() => handleExport('PDF')}
              >
                <FileDown className="w-4 h-4" /> Export PDF
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2 h-9 text-xs font-bold shadow-sm"
                onClick={() => handleExport('Excel')}
              >
                <FileType className="w-4 h-4" /> Export Excel
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
              <span>Showing {filtered.length} students</span>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <MoreHorizontal className="w-3 h-3 rotate-90" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
