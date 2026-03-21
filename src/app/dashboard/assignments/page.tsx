
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
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock Data for Assignments with States
const INITIAL_ASSIGNMENTS = [
  { id: "A1", title: "Thermodynamics Problems Set", subject: "Physics", dueDate: "2024-06-15T23:59:59Z", status: "upcoming", submissions: 0, maxMarks: 20 },
  { id: "A2", title: "Poetry Analysis Essay", subject: "English", dueDate: "2024-05-28T23:59:59Z", status: "submitted", submissions: 42, maxMarks: 10 },
  { id: "A3", title: "Matrix Multiplication Lab", subject: "Maths", dueDate: "2024-05-20T23:59:59Z", status: "graded", submissions: 38, maxMarks: 20 },
  { id: "A4", title: "Chemical Bonds Basic", subject: "Chemistry", dueDate: "2024-06-10T23:59:59Z", status: "upcoming", submissions: 0, maxMarks: 20 },
];

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const handleCreateAssignment = () => {
    toast({ title: "Task Published", description: "The assignment is now visible to students." });
    setIsCreating(false);
  };

  const upcoming = assignments.filter(a => a.status === 'upcoming');
  const submitted = assignments.filter(a => a.status === 'submitted');
  const graded = assignments.filter(a => a.status === 'graded');

  if (!isTeacher) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
            <FileEdit className="w-8 h-8 text-secondary" />
            {t("assignments")}
          </h1>
          <p className="text-muted-foreground mt-1">Track your homework and project deadlines.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <StudentAssignmentCard key={assignment.id} assignment={assignment} />
          ))}
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
            {t("assignments")}
          </h1>
          <p className="text-muted-foreground mt-1">Manage institutional tasks and grading workflows.</p>
        </div>
        <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl" onClick={() => setIsCreating(true)}>
          <Plus className="w-5 h-5" /> {language === 'en' ? 'Create Assignment' : 'Créer un Devoir'}
        </Button>
      </div>

      {/* Main Teacher Interface: 4 Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* CARD 1: UPCOMING (EDIT) */}
        <Card className="border-none shadow-xl bg-white overflow-hidden flex flex-col h-[500px]">
          <CardHeader className="bg-blue-50 border-b border-blue-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-blue-700 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" /> {language === 'en' ? 'Upcoming' : 'À venir'}
              </CardTitle>
              <CardDescription className="text-blue-600/60">Open for submissions</CardDescription>
            </div>
            <Badge className="bg-blue-600 text-white border-none">{upcoming.length}</Badge>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {upcoming.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 group hover:bg-blue-50 transition-colors">
                    <h4 className="font-bold text-primary leading-tight mb-1">{task.title}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3">{task.subject}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-100/50">
                      <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3"/> Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:bg-white gap-1">
                        <Settings className="w-3 h-3" /> Edit
                      </Button>
                    </div>
                  </div>
                ))}
                {upcoming.length === 0 && <EmptyPlaceholder text="No upcoming tasks" />}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* CARD 2: SUBMITTED (GRADE) */}
        <Card className="border-none shadow-xl bg-white overflow-hidden flex flex-col h-[500px]">
          <CardHeader className="bg-amber-50 border-b border-amber-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-amber-700 text-lg flex items-center gap-2">
                <Inbox className="w-5 h-5" /> {language === 'en' ? 'Submitted' : 'Rendus'}
              </CardTitle>
              <CardDescription className="text-amber-600/60">Deadline reached / Pending</CardDescription>
            </div>
            <Badge className="bg-amber-600 text-white border-none">{submitted.length}</Badge>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {submitted.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl border border-amber-100 bg-amber-50/30 group hover:bg-amber-50 transition-colors">
                    <h4 className="font-bold text-primary leading-tight mb-1">{task.title}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3">{task.subject}</p>
                    <div className="bg-white/50 p-2 rounded-lg mb-3 flex items-center justify-between text-[10px]">
                      <span className="font-medium">Submissions:</span>
                      <span className="font-black text-amber-700">{task.submissions} students</span>
                    </div>
                    <Button className="w-full h-8 text-xs bg-amber-600 hover:bg-amber-700 gap-2 shadow-sm">
                      <FileEdit className="w-3 h-3" /> Grade Assignment
                    </Button>
                  </div>
                ))}
                {submitted.length === 0 && <EmptyPlaceholder text="No submissions to grade" />}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* CARD 3: GRADED (VIEW MARKS) */}
        <Card className="border-none shadow-xl bg-white overflow-hidden flex flex-col h-[500px]">
          <CardHeader className="bg-green-50 border-b border-green-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-700 text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {language === 'en' ? 'Graded' : 'Notés'}
              </CardTitle>
              <CardDescription className="text-green-600/60">Marks recorded</CardDescription>
            </div>
            <Badge className="bg-green-600 text-white border-none">{graded.length}</Badge>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {graded.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl border border-green-100 bg-green-50/30 group hover:bg-green-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-primary leading-tight mb-1">{task.title}</h4>
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-3">{task.subject}</p>
                    <Button variant="outline" className="w-full h-8 text-xs border-green-200 text-green-700 hover:bg-white gap-2">
                      <Eye className="w-3 h-3" /> View Marks
                    </Button>
                  </div>
                ))}
                {graded.length === 0 && <EmptyPlaceholder text="No graded tasks yet" />}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* CARD 4: SUMMARY / ARCHIVE */}
        <Card className="border-none shadow-xl bg-primary text-white overflow-hidden flex flex-col h-[500px]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" /> {language === 'en' ? 'Insights' : 'Aperçus'}
            </CardTitle>
            <CardDescription className="text-white/60">Performance & Archiving</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Efficiency Rate</p>
              <div className="text-3xl font-black text-secondary">92%</div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[92%]" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10 h-12 rounded-xl group px-4">
                <div className="flex items-center gap-3">
                  <Plus className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-bold">New Assignment</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10 h-12 rounded-xl group px-4">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold">Clear Recent View</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10 h-12 rounded-xl group px-4">
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold">Export All Records</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 mt-auto">
             <div className="bg-white/5 p-4 rounded-2xl w-full text-center italic text-[10px] text-white/40 border border-white/5">
               "Great teachers focus on growth, not just grades."
             </div>
          </CardFooter>
        </Card>
      </div>

      {/* Creation Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-black tracking-tight">{language === 'en' ? 'Setup New Task' : 'Créer un Devoir'}</DialogTitle>
            <DialogDescription className="text-white/60">Configure an academic assignment for your class.</DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'en' ? 'Task Title' : 'Titre'}</Label>
                <Input placeholder="e.g. Chapter 4 Exercises" className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'en' ? 'Subject' : 'Matière'}</Label>
                <Input placeholder="e.g. Physics" className="bg-accent/30 border-none h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("dueDate")}</Label>
                <Input type="datetime-local" className="bg-accent/30 border-none h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'en' ? 'Max Marks' : 'Note Max'}</Label>
                <Input type="number" placeholder="20" className="bg-accent/30 border-none h-12 rounded-xl" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Instructions</Label>
                <Textarea placeholder="Instructions for students..." className="min-h-[120px] bg-accent/30 border-none rounded-xl" />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
            <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsCreating(false)}>{t("cancel")}</Button>
            <Button onClick={handleCreateAssignment} className="flex-1 rounded-xl h-12 shadow-lg font-bold">{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StudentAssignmentCard({ assignment }: { assignment: any }) {
  const { t } = useI18n();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500";
      case "submitted": return "bg-green-500";
      case "graded": return "bg-primary";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
      <div className={cn("h-1.5", getStatusColor(assignment.status))} />
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{assignment.status}</Badge>
          {assignment.status === 'graded' && (
            <Badge className="bg-primary text-white border-none font-bold">GRADED</Badge>
          )}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">{assignment.title}</CardTitle>
        <CardDescription>{assignment.subject}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/20 p-3 rounded-lg">
          <Clock className="w-4 h-4" />
          <span className="font-bold">DUE: {new Date(assignment.dueDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        <Button variant="outline" className="w-full justify-between hover:bg-primary hover:text-white transition-all group/btn">
          View Details
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 opacity-30 grayscale">
      <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary flex items-center justify-center">
        <FileEdit className="w-6 h-6" />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest">{text}</p>
    </div>
  );
}
