"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileEdit, 
  Clock, 
  ChevronRight, 
  Plus,
  Trash2,
  Inbox,
  Award,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

const MOCK_ASSIGNMENTS = [
  {
    id: "1",
    title: "Newton's Laws Lab Report",
    courseName: "Advanced Physics",
    targetClass: "2nde / Form 5",
    dueDate: "2024-06-15",
    maxMarks: 20,
    status: "upcoming"
  }
];

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [gradingAssignment, setGradingAssignment] = useState<any>(null);
  
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subjectId: "PHY101",
    targetClass: "2nde / Form 5",
    dueDate: "",
    maxMarks: 20,
    instructions: ""
  });

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const handleCreateAssignment = () => {
    if (!newAssignment.title) return;
    setIsProcessing(true);
    setTimeout(() => {
      const newTask = {
        id: Math.random().toString(),
        ...newAssignment,
        courseName: "Physics",
        status: 'upcoming'
      };
      setAssignments([newTask, ...assignments]);
      setIsCreating(false);
      setIsProcessing(false);
      toast({ title: "Task Published", description: "The assignment is now visible to students." });
    }, 800);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast({ title: "Assignment Removed", description: "The task has been deleted." });
  };

  if (!isTeacher) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
            <FileEdit className="w-8 h-8 text-secondary" />
            {t("assignments")}
          </h1>
          <p className="text-muted-foreground mt-1">Track your homework and project deadlines for {user?.school?.name}.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <StudentAssignmentCard key={assignment.id} assignment={assignment} />
          ))}
          {assignments.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl opacity-40">
              <FileEdit className="w-12 h-12 mx-auto mb-4" />
              <p>No assignments currently posted for your class.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <FileEdit className="w-6 h-6 text-secondary" />
            </div>
            Academic Tasks
          </h1>
          <p className="text-muted-foreground mt-1">Manage institutional tasks and grading workflows.</p>
        </div>
        <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl" onClick={() => setIsCreating(true)}>
          <Plus className="w-5 h-5" /> Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {assignments.map((task) => (
          <Card key={task.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="h-1.5 w-full bg-primary" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary mb-2">
                    {task.targetClass}
                  </Badge>
                  <CardTitle className="text-xl text-primary font-black">{task.title}</CardTitle>
                  <CardDescription className="font-bold flex items-center gap-2 mt-1">
                    <Award className="w-3.5 h-3.5" /> {task.courseName}
                  </CardDescription>
                </div>
                <div className="p-2 bg-accent rounded-xl"><Inbox className="w-5 h-5 text-primary" /></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/30 p-3 rounded-xl border border-accent flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black uppercase opacity-40">Due Date</p>
                  <p className="text-xs font-bold">{task.dueDate}</p>
                </div>
                <div className="h-8 w-px bg-accent mx-2" />
                <div className="space-y-0.5 text-right">
                  <p className="text-[9px] font-black uppercase opacity-40">Max Marks</p>
                  <p className="text-xs font-bold">{task.maxMarks}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex gap-2">
              <Button 
                className="flex-1 h-10 bg-primary shadow-sm gap-2 text-xs font-bold"
                onClick={() => setGradingAssignment(task)}
              >
                <FileEdit className="w-3.5 h-3.5" /> Grade
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-destructive/20 hover:text-destructive"
                onClick={() => handleDeleteAssignment(task.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-black">Setup New Task</DialogTitle>
            <DialogDescription className="text-white/60">Configure an academic assignment for your class.</DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label>Assignment Title</Label>
                <Input value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} placeholder="e.g. Chapter 4 Exercises" className="h-12 bg-accent/30 border-none rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={newAssignment.subjectId} onValueChange={(v) => setNewAssignment({...newAssignment, subjectId: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHY101">Advanced Physics</SelectItem>
                    <SelectItem value="MAT101">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Class</Label>
                <Select value={newAssignment.targetClass} onValueChange={(v) => setNewAssignment({...newAssignment, targetClass: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Max Marks</Label>
                <Input type="number" value={newAssignment.maxMarks} onChange={(e) => setNewAssignment({...newAssignment, maxMarks: parseInt(e.target.value)})} className="h-12 bg-accent/30 border-none rounded-xl" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Instructions</Label>
                <Textarea value={newAssignment.instructions} onChange={(e) => setNewAssignment({...newAssignment, instructions: e.target.value})} placeholder="Guidelines for students..." className="min-h-[120px] bg-accent/30 border-none rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={handleCreateAssignment} disabled={isProcessing} className="w-full h-12 shadow-lg font-bold">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StudentAssignmentCard({ assignment }: { assignment: any }) {
  return (
    <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
      <div className="h-1.5 bg-blue-500" />
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{assignment.status}</Badge>
          <Badge className="bg-primary text-white border-none font-bold text-[10px]">MAX: {assignment.maxMarks}</Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">{assignment.title}</CardTitle>
        <CardDescription className="font-bold">{assignment.courseName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/20 p-3 rounded-lg">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-bold">DUE: {assignment.dueDate}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        <Button asChild variant="outline" className="w-full justify-between hover:bg-primary hover:text-white transition-all group/btn">
          <Link href={`/dashboard/assignments/submit?id=${assignment.id}`}>
            View & Submit
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
