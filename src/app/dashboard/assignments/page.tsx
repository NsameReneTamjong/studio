
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileEdit, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ChevronRight, 
  Save,
  User,
  Eye,
  Trash2,
  Inbox,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data for Assignments
const MOCK_ASSIGNMENTS = [
  { id: "A1", title: "Thermodynamics Problems Set", subject: "Physics", teacher: "Dr. Tesla", dueDate: "2024-05-30T23:59:59Z", status: "due", maxMarks: 20 },
  { id: "A2", title: "Poetry Analysis Essay", subject: "English", teacher: "Ms. Bennet", dueDate: "2024-05-28T23:59:59Z", status: "submitted", maxMarks: 10 },
  { id: "A3", title: "Matrix Multiplication Lab", subject: "Maths", teacher: "Prof. Smith", dueDate: "2024-05-20T23:59:59Z", status: "graded", score: 18, maxMarks: 20 },
];

// Mock Submissions for Teacher View
const INITIAL_SUBMISSIONS = [
  { id: "SUB001", studentName: "Alice Thompson", studentAvatar: "https://picsum.photos/seed/s1/100/100", assignmentTitle: "Thermodynamics", subject: "Physics", submittedAt: "2h ago", status: "pending" },
  { id: "SUB002", studentName: "Bob Richards", studentAvatar: "https://picsum.photos/seed/s2/100/100", assignmentTitle: "Kinematics Prep", subject: "Physics", submittedAt: "5h ago", status: "pending" },
  { id: "SUB003", studentName: "Diana Prince", studentAvatar: "https://picsum.photos/seed/s4/100/100", assignmentTitle: "Energy Lab", subject: "Physics", submittedAt: "Yesterday", status: "pending" },
];

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [activeSubmissions, setActiveSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [recordedMarks, setRecordedMarks] = useState<any[]>([]);
  const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({});

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const handleRecordGrade = (submissionId: string) => {
    const grade = gradeInputs[submissionId];
    if (!grade) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a grade first." });
      return;
    }

    const submission = activeSubmissions.find(s => s.id === submissionId);
    if (!submission) return;

    // Record the mark
    const newRecord = { ...submission, grade, recordedAt: new Date().toLocaleTimeString() };
    setRecordedMarks([newRecord, ...recordedMarks]);

    // Wipe out from active queue
    setActiveSubmissions(prev => prev.filter(s => s.id !== submissionId));
    
    toast({
      title: "Grade Recorded",
      description: `${submission.studentName}'s mark has been added to the register.`,
    });
  };

  const handleClearHistory = () => {
    setRecordedMarks([]);
    toast({ description: "Recent records cleared." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
            <FileEdit className="w-8 h-8 text-secondary" />
            {t("assignments")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher 
              ? "Manage grading queue and student submissions."
              : "Track your homework and project deadlines."
            }
          </p>
        </div>

        {isTeacher && (
          <Button className="gap-2 shadow-lg h-11" onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4" /> {language === 'en' ? 'New Assignment' : 'Nouveau Devoir'}
          </Button>
        )}
      </div>

      {isTeacher ? (
        <Tabs defaultValue="queue" className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1 rounded-xl h-auto">
            <TabsTrigger value="queue" className="gap-2 py-2">
              <Inbox className="w-4 h-4" /> Submission Queue 
              {activeSubmissions.length > 0 && (
                <Badge className="ml-1 bg-secondary text-primary border-none text-[10px] h-5">{activeSubmissions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recorded" className="gap-2 py-2">
              <CheckCircle2 className="w-4 h-4" /> Recently Recorded
            </TabsTrigger>
            <TabsTrigger value="manage" className="gap-2 py-2">
              <FileEdit className="w-4 h-4" /> Manage Tasks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="mt-0">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-accent/30 border-b">
                <CardTitle className="text-lg">Grading Queue</CardTitle>
                <CardDescription>View and grade pending student submissions. Items are wiped once recorded.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {activeSubmissions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 text-[10px] uppercase font-bold">
                        <TableHead className="pl-6">Student</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-center">Grade / 20</TableHead>
                        <TableHead className="text-right pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeSubmissions.map((sub) => (
                        <TableRow key={sub.id} className="group hover:bg-accent/5 transition-colors">
                          <TableCell className="pl-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={sub.studentAvatar} />
                                <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-sm text-primary">{sub.studentName}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">{sub.subject}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-sm">{sub.assignmentTitle}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] gap-1 font-medium border-primary/10">
                              <Clock className="w-3 h-3" /> {sub.submittedAt}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Input 
                              type="number" 
                              placeholder="0.0" 
                              className="w-16 h-9 mx-auto text-center font-bold"
                              value={gradeInputs[sub.id] || ""}
                              onChange={(e) => setGradeInputs({...gradeInputs, [sub.id]: e.target.value})}
                            />
                          </TableCell>
                          <TableCell className="text-right pr-6 space-x-2">
                            <Button variant="ghost" size="sm" className="h-9 gap-2 text-primary hover:bg-primary/5">
                              <Eye className="w-4 h-4" /> View
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-9 gap-2 shadow-sm bg-green-600 hover:bg-green-700"
                              onClick={() => handleRecordGrade(sub.id)}
                            >
                              <Save className="w-4 h-4" /> Record
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-primary/30" />
                    </div>
                    <div>
                      <p className="font-bold text-primary">All caught up!</p>
                      <p className="text-sm text-muted-foreground">No pending submissions to grade.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recorded" className="mt-0">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-accent/30 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Records</CardTitle>
                  <CardDescription>These marks have been sent to the permanent register.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive gap-2" onClick={handleClearHistory}>
                  <Trash2 className="w-4 h-4" /> Clear View
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {recordedMarks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 text-[10px] uppercase font-bold">
                        <TableHead className="pl-6">Student</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead className="text-center">Mark</TableHead>
                        <TableHead className="text-right pr-6">Recorded At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recordedMarks.map((rec, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="pl-6 font-bold">{rec.studentName}</TableCell>
                          <TableCell className="text-sm">{rec.assignmentTitle}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-primary text-white border-none">{rec.grade} / 20</Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6 text-xs text-muted-foreground">{rec.recordedAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    No recent records to display.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_ASSIGNMENTS.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} isTeacher={true} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MOCK_ASSIGNMENTS.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} isTeacher={false} />
          ))}
        </div>
      )}

      {/* Creation Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{language === 'en' ? 'Create Assignment' : 'Créer un Devoir'}</DialogTitle>
            <CardDescription>Post a new task for your students.</CardDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>{language === 'en' ? 'Title' : 'Titre'}</Label>
              <Input placeholder="e.g. Chapter 4 Exercises" />
            </div>
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Subject' : 'Matière'}</Label>
              <Input placeholder="e.g. Physics" />
            </div>
            <div className="space-y-2">
              <Label>{t("dueDate")}</Label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Max Marks' : 'Note Max'}</Label>
              <Input type="number" placeholder="20" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>{language === 'en' ? 'Description' : 'Description'}</Label>
              <Textarea placeholder="Instructions for students..." className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>{t("cancel")}</Button>
            <Button onClick={() => {
              setIsCreating(false);
              toast({ title: "Task Published", description: "The assignment is now visible to students." });
            }}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssignmentCard({ assignment, isTeacher }: { assignment: any, isTeacher: boolean }) {
  const { t, language } = useI18n();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "due": return <Clock className="w-5 h-5 text-amber-500" />;
      case "submitted": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "graded": return <Award className="w-5 h-5 text-primary" />;
      default: return <FileEdit className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
             {getStatusIcon(assignment.status)}
             <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{assignment.status}</Badge>
          </div>
          {assignment.status === 'graded' && (
            <Badge className="bg-primary text-white border-none font-bold">
              {assignment.score}/{assignment.maxMarks}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">{assignment.title}</CardTitle>
        <CardDescription>{assignment.subject} • {assignment.teacher}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-accent/30 p-3 rounded-lg flex items-center justify-between text-xs">
           <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">{t("dueDate")}</span>
           </div>
           <span className="font-bold text-primary">
              {new Date(assignment.dueDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short' })}
           </span>
        </div>
      </CardContent>
      <CardFooter className="bg-accent/30 border-t border-accent/50 pt-4">
        <Button variant="ghost" className="w-full justify-between hover:bg-white text-primary">
          {isTeacher ? "Manage Task" : "View Details"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
