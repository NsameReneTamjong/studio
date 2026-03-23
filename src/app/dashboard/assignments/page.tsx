
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileEdit, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ChevronRight, 
  Eye,
  Trash2,
  Inbox,
  Award,
  Settings,
  ArrowUpRight,
  TrendingUp,
  User,
  ExternalLink,
  Save,
  X,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, query, where, orderBy, getDocs } from "firebase/firestore";
import Link from "next/link";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  // State
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState<any>(null);
  const [viewingMarksAssignment, setViewingMarksAssignment] = useState<any>(null);
  
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subjectId: "",
    targetClass: "2nde / Form 5",
    dueDate: "",
    maxMarks: 20,
    instructions: ""
  });

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  // Data Fetching
  const subjectsQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId) return null;
    return query(collection(db, "schools", user.schoolId, "courses"), where("teacherUid", "==", user.uid));
  }, [db, user?.schoolId, user?.uid]);
  const { data: mySubjects } = useCollection(subjectsQuery);

  const assignmentsQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId) return null;
    if (isTeacher) {
      return query(collection(db, "schools", user.schoolId, "assignments"), where("teacherUid", "==", user.uid), orderBy("createdAt", "desc"));
    }
    return query(collection(db, "schools", user.schoolId, "assignments"), where("targetClass", "==", user.class || ""), orderBy("createdAt", "desc"));
  }, [db, user?.schoolId, user?.uid, isTeacher, user?.class]);
  const { data: assignments, isLoading } = useCollection(assignmentsQuery);

  const submissionsQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId || !gradingAssignment) return null;
    return collection(db, "schools", user.schoolId, "assignments", gradingAssignment.id, "submissions");
  }, [db, user?.schoolId, gradingAssignment]);
  const { data: activeSubmissions } = useCollection(submissionsQuery);

  // Handlers
  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.subjectId || !user?.schoolId) return;
    setIsProcessing(true);
    try {
      const subject = mySubjects?.find(s => s.id === newAssignment.subjectId);
      await addDoc(collection(db, "schools", user.schoolId, "assignments"), {
        ...newAssignment,
        courseName: subject?.name || "Unknown",
        teacherUid: user.uid,
        teacherName: user.name,
        createdAt: serverTimestamp(),
        status: 'upcoming',
        submissionsCount: 0
      });
      setIsCreating(false);
      toast({ title: "Task Published", description: "The assignment is now visible to students." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to publish assignment." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordMark = async (submissionId: string, grade: number) => {
    if (!user?.schoolId || !gradingAssignment) return;
    try {
      const subRef = doc(db, "schools", user.schoolId, "assignments", gradingAssignment.id, "submissions", submissionId);
      await updateDoc(subRef, { grade, status: 'graded' });
      toast({ title: "Mark Recorded", description: "Student's grade has been saved." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save mark." });
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!user?.schoolId) return;
    try {
      await deleteDoc(doc(db, "schools", user.schoolId, "assignments", id));
      toast({ title: "Assignment Removed", description: "The task has been deleted." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete assignment." });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>;
  }

  if (!isTeacher) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
            <FileEdit className="w-8 h-8 text-secondary" />
            {t("assignments")}
          </h1>
          <p className="text-muted-foreground mt-1">Track your homework and project deadlines for {user?.class}.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignments?.map((assignment) => (
            <StudentAssignmentCard key={assignment.id} assignment={assignment} />
          ))}
          {assignments?.length === 0 && (
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
        {assignments?.map((task) => (
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
                  <p className="text-xs font-bold">{new Date(task.dueDate).toLocaleDateString()}</p>
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

      {/* Creation Dialog */}
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
                    {mySubjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
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
                <Input type="datetime-local" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
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

      {/* Grading Dialog */}
      <Dialog open={!!gradingAssignment} onOpenChange={() => setGradingAssignment(null)}>
        <DialogContent className="sm:max-w-4xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-black">Grading Portal</DialogTitle>
            <DialogDescription className="text-white/60">{gradingAssignment?.title} • Official Registry</DialogDescription>
          </DialogHeader>
          <div className="p-0">
            <Table>
              <TableHeader className="bg-accent/30">
                <TableRow className="uppercase text-[10px] font-black">
                  <TableHead className="pl-8 py-4">Student Profile</TableHead>
                  <TableHead className="text-center">Submitted At</TableHead>
                  <TableHead className="text-center">Work</TableHead>
                  <TableHead className="text-center">Mark / {gradingAssignment?.maxMarks}</TableHead>
                  <TableHead className="pr-8 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeSubmissions?.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{sub.studentName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-primary">{sub.studentName}</p>
                          <p className="text-[10px] text-muted-foreground">{sub.studentMatricule}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {new Date(sub.submittedAt?.toDate?.() || sub.submittedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild><Button variant="ghost" size="sm" className="text-primary font-bold">View Text</Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Student Submission</DialogTitle></DialogHeader><div className="p-4 bg-accent/20 rounded-xl italic">{sub.content}</div></DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="number" 
                        defaultValue={sub.grade}
                        onBlur={(e) => handleRecordMark(sub.id, parseFloat(e.target.value))}
                        className="w-16 h-9 mx-auto text-center font-bold"
                      />
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Badge className={cn("text-[10px] uppercase font-black", sub.status === 'graded' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700")}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {activeSubmissions?.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">No submissions found for this task.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="p-6 bg-accent/10 border-t">
            <Button variant="ghost" onClick={() => setGradingAssignment(null)}>Close Registry</Button>
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
          <span className="font-bold">DUE: {new Date(assignment.dueDate).toLocaleDateString()}</span>
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
