
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RefreshCcw, Search, Download } from "lucide-react";

const MOCK_GRADES = [
  { id: "S001", name: "Alice Thompson", quiz: 85, midterm: 92, project: 95, final: 0, grade: "A" },
  { id: "S002", name: "Bob Richards", quiz: 65, midterm: 70, project: 82, final: 0, grade: "B-" },
  { id: "S003", name: "Charlie Davis", quiz: 75, midterm: 68, project: 78, final: 0, grade: "C+" },
  { id: "S004", name: "Diana Prince", quiz: 98, midterm: 96, project: 100, final: 0, grade: "A+" },
  { id: "S005", name: "Ethan Hunt", quiz: 55, midterm: 60, project: 65, final: 0, grade: "D" },
];

export default function GradeBookPage() {
  const [course, setCourse] = useState("physics");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Grade Book</h1>
          <p className="text-muted-foreground mt-1">Input and manage scores for your assigned classes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4"/> Export CSV</Button>
          <Button className="gap-2 shadow-lg"><Save className="w-4 h-4"/> Save Changes</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="w-full sm:w-64">
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physics">Physics 101 - Sec A</SelectItem>
              <SelectItem value="math">Calculus II - Sec C</SelectItem>
              <SelectItem value="chem">Gen Chem - Sec B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Filter students..." className="pl-10" />
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Spring Semester 2024</CardTitle>
            <Badge variant="outline" className="gap-1"><RefreshCcw className="w-3 h-3"/> Auto-calculating GPA</Badge>
          </div>
          <CardDescription>Click on any score to edit. Changes are saved locally until synced.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/30">
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Quiz (15%)</TableHead>
                  <TableHead className="text-center">Midterm (25%)</TableHead>
                  <TableHead className="text-center">Project (20%)</TableHead>
                  <TableHead className="text-center">Final (40%)</TableHead>
                  <TableHead className="text-center font-bold text-primary">Total</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_GRADES.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">
                      <Input defaultValue={student.quiz} className="w-16 h-8 mx-auto text-center" type="number" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input defaultValue={student.midterm} className="w-16 h-8 mx-auto text-center" type="number" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input defaultValue={student.project} className="w-16 h-8 mx-auto text-center" type="number" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input defaultValue={student.final} className="w-16 h-8 mx-auto text-center" type="number" />
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {Math.round((student.quiz * 0.15) + (student.midterm * 0.25) + (student.project * 0.2) + (student.final * 0.4))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={student.grade.startsWith('A') ? 'default' : student.grade.startsWith('B') ? 'secondary' : 'outline'}>
                        {student.grade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
