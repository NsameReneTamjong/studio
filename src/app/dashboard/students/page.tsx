
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, MoreHorizontal, Filter, GraduationCap, Eye, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", grade: "10th", section: "A", gpa: "3.9", status: "Enrolled", email: "alice.t@school.edu", avatar: "https://picsum.photos/seed/s1/100/100" },
  { id: "S002", name: "Bob Richards", grade: "12th", section: "C", gpa: "3.2", status: "Enrolled", email: "bob.r@school.edu", avatar: "https://picsum.photos/seed/s2/100/100" },
  { id: "S003", name: "Charlie Davis", grade: "11th", section: "B", gpa: "3.5", status: "Leave", email: "charlie.d@school.edu", avatar: "https://picsum.photos/seed/s3/100/100" },
  { id: "S004", name: "Diana Prince", grade: "10th", section: "A", gpa: "4.0", status: "Enrolled", email: "diana.p@school.edu", avatar: "https://picsum.photos/seed/s4/100/100" },
  { id: "S005", name: "Ethan Hunt", grade: "12th", section: "B", gpa: "2.8", status: "Probation", email: "ethan.h@school.edu", avatar: "https://picsum.photos/seed/s5/100/100" },
];

export default function StudentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const canAdd = ["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(user?.role || "");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Student Management</h1>
          <p className="text-muted-foreground mt-1">Manage and view all enrolled student records.</p>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/30 hover:bg-accent/30">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-accent/5 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-accent">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary">{student.name}</span>
                          <span className="text-xs text-muted-foreground">{student.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{student.grade}</TableCell>
                    <TableCell className="text-sm">{student.section}</TableCell>
                    <TableCell className="font-bold text-primary">{student.gpa}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Enrolled" ? "default" : student.status === "Leave" ? "secondary" : "destructive"} className="text-[10px] h-5">
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold" asChild>
                          <Link href={`/dashboard/children/view?id=${student.id}`}>
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </Link>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Institutional Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/children/view?id=${student.id}`}>View Report Card</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Record</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Archive Student</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filtered.length} of {MOCK_STUDENTS.length} students</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
