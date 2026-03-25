
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  User, 
  Plus, 
  Search, 
  Eye, 
  CheckCircle2, 
  HelpCircle,
  Loader2,
  Trash2,
  Sparkles,
  BookMarked,
  Info,
  ChevronRight
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

const INITIAL_COURSES = [
  { id: "PHY101", name: "Advanced Physics", instructorName: "Dr. Aris Tesla", targetClass: "2nde / Form 5", type: "mandatory", color: "bg-blue-500" },
  { id: "MAT101", name: "Mathematics", instructorName: "Prof. Sarah Smith", targetClass: "2nde / Form 5", type: "mandatory", color: "bg-emerald-500" },
  { id: "LIT105", name: "Modern Literature", instructorName: "Ms. Bennet", targetClass: "2nde / Form 5", type: "optional", color: "bg-purple-500" },
  { id: "ART202", name: "Fine Arts & Design", instructorName: "Mr. Abena", targetClass: "2nde / Form 5", type: "optional", color: "bg-rose-500" },
];

export default function CoursesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isEnrollingOptional, setIsEnrollingOptional] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  // To simulate student's enrolled optional subjects
  const [myOptionalSubjects, setMyOptionalSubjects] = useState<string[]>([]);
  
  const [newSubject, setNewSubject] = useState({
    name: "",
    id: "",
    instructorName: "Dr. Jean Dupont",
    targetClass: "2nde / Form 5",
    type: "mandatory",
    color: "bg-blue-500"
  });

  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    setTimeout(() => {
      setSubjects(INITIAL_COURSES);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreateSubject = async () => {
    if (!newSubject.name || !newSubject.id) return;
    setIsProcessing(true);
    setTimeout(() => {
      setSubjects([...subjects, { ...newSubject }]);
      setIsProcessing(false);
      setIsAddingSubject(false);
      setNewSubject({ name: "", id: "", instructorName: "Dr. Jean Dupont", targetClass: "2nde / Form 5", type: "mandatory", color: "bg-blue-500" });
      toast({ title: "Subject Registered", description: `${newSubject.name} added to curriculum.` });
    }, 800);
  };

  const handleEnrollOptional = (subjectId: string) => {
    if (myOptionalSubjects.includes(subjectId)) {
      toast({ variant: "destructive", title: "Already Enrolled" });
      return;
    }
    setMyOptionalSubjects([...myOptionalSubjects, subjectId]);
    toast({ title: "Enrollment Confirmed", description: "This subject has been added to your curriculum." });
    setIsEnrollingOptional(false);
  };

  const handleDeleteSubject = async (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast({ title: "Removed", description: "Subject removed from curriculum." });
  };

  const mandatorySubjects = subjects.filter(s => s.type === "mandatory");
  const enrolledOptional = subjects.filter(s => s.type === "optional" && (isAdmin || myOptionalSubjects.includes(s.id)));
  const availableOptional = subjects.filter(s => s.type === "optional" && !myOptionalSubjects.includes(s.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            {isAdmin ? "Institutional Subjects" : t("courses")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Monitor pedagogical activity, resources, and performance for all courses."
              : "Manage your class subjects and access learning materials."}
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
                <Plus className="w-5 h-5" /> Add New Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary p-8 text-white">
                <DialogTitle className="text-2xl font-black">Setup New Subject</DialogTitle>
                <DialogDescription className="text-white/60">Configure curriculum requirements and instructor assignment.</DialogDescription>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <Label>Subject Name</Label>
                    <Input value={newSubject.name} onChange={(e) => setNewSubject({...newSubject, name: e.target.value})} placeholder="e.g. Advanced Physics" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject ID (Code)</Label>
                    <Input value={newSubject.id} onChange={(e) => setNewSubject({...newSubject, id: e.target.value})} placeholder="e.g. PHY101" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject Type</Label>
                    <Select value={newSubject.type} onValueChange={(v) => setNewSubject({...newSubject, type: v})}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mandatory">Mandatory</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Instructor</Label>
                    <Select value={newSubject.instructorName} onValueChange={(v) => setNewSubject({...newSubject, instructorName: v})}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Aris Tesla">Dr. Aris Tesla</SelectItem>
                        <SelectItem value="Prof. Sarah Smith">Prof. Sarah Smith</SelectItem>
                        <SelectItem value="Ms. Bennet">Ms. Bennet</SelectItem>
                        <SelectItem value="Mr. Abena">Mr. Abena</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Target Class Level</Label>
                    <Select value={newSubject.targetClass} onValueChange={(v) => setNewSubject({...newSubject, targetClass: v})}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                <Button onClick={handleCreateSubject} className="w-full h-12 shadow-lg font-bold" disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register Subject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {isStudent && (
          <Dialog open={isEnrollingOptional} onOpenChange={setIsEnrollingOptional}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="gap-2 shadow-lg h-12 px-6 rounded-2xl bg-secondary text-primary hover:bg-secondary/90">
                <Plus className="w-5 h-5" /> {t("addSubject")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary p-8 text-white">
                <DialogTitle className="text-2xl font-black">{t("availableSubjects")}</DialogTitle>
                <DialogDescription className="text-white/60">Elective courses available for your class level.</DialogDescription>
              </DialogHeader>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableOptional.map((course) => (
                    <Card key={course.id} className="border border-accent hover:border-primary/20 transition-all group cursor-pointer" onClick={() => handleEnrollOptional(course.id)}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", course.color)}>
                          <BookMarked className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-bold text-sm truncate">{course.name}</p>
                          <p className="text-[10px] text-muted-foreground">{course.instructorName}</p>
                        </div>
                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  ))}
                  {availableOptional.length === 0 && (
                    <div className="col-span-2 py-10 text-center text-muted-foreground italic">
                      No additional optional subjects available for enrollment.
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="bg-accent/10 p-6 border-t">
                <Button variant="ghost" onClick={() => setIsEnrollingOptional(false)} className="w-full">Close Catalog</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
      ) : subjects.length > 0 ? (
        <div className="space-y-12">
          {/* Mandatory Subjects Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-primary/10" />
              <h2 className="text-sm font-black uppercase text-primary/40 tracking-[0.3em]">{language === 'en' ? 'Mandatory Subjects' : 'Matières Obligatoires'}</h2>
              <div className="h-px flex-1 bg-primary/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mandatorySubjects.map((course) => (
                <CourseCard key={course.id} course={course} isAdmin={isAdmin} onDelete={() => handleDeleteSubject(course.id)} />
              ))}
            </div>
          </section>

          {/* Optional Subjects Section */}
          {(isAdmin || enrolledOptional.length > 0) && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-primary/10" />
                <h2 className="text-sm font-black uppercase text-primary/40 tracking-[0.3em]">{language === 'en' ? 'Optional Subjects' : 'Matières Facultatives'}</h2>
                <div className="h-px flex-1 bg-primary/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {enrolledOptional.map((course) => (
                  <CourseCard key={course.id} course={course} isAdmin={isAdmin} onDelete={() => handleDeleteSubject(course.id)} />
                ))}
                {isStudent && enrolledOptional.length === 0 && (
                  <Card className="border-2 border-dashed border-accent bg-accent/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <Sparkles className="w-8 h-8 text-primary/20" />
                    <p className="text-xs text-muted-foreground font-medium">You haven't enrolled in any optional subjects yet.</p>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => setIsEnrollingOptional(true)}>Enroll Now</Button>
                  </Card>
                )}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-3xl border-2 border-dashed">
          <BookOpen className="w-16 h-16 text-primary/10" />
          <p className="text-muted-foreground">No subjects found in the curriculum.</p>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, isAdmin, onDelete }: { course: any, isAdmin: boolean, onDelete: () => void }) {
  const { language } = useI18n();
  
  return (
    <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className={cn("h-2", course.color || 'bg-blue-500')} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-bold">{course.id}</Badge>
              <Badge className={cn(
                "text-[9px] uppercase font-black border-none h-4 px-2",
                course.type === 'mandatory' ? "bg-primary text-white" : "bg-secondary text-primary"
              )}>
                {course.type}
              </Badge>
            </div>
            <CardTitle className="text-xl text-primary font-black tracking-tight">{course.name}</CardTitle>
          </div>
          <div className="p-2 bg-accent/50 rounded-lg"><BookOpen className="w-5 h-5 text-primary" /></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Instructor</p>
            <p className="text-xs font-bold truncate">{course.instructorName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Class Level</p>
            <p className="text-xs font-bold truncate">{course.targetClass}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-accent/30 border-t border-accent/50 pt-4 flex gap-2">
        <Button variant="ghost" className="flex-1 justify-between hover:bg-white h-10 group/btn">
          <span className="flex items-center gap-2 font-bold text-xs">
            <Eye className="w-4 h-4" /> {language === 'en' ? 'Materials' : 'Supports'}
          </span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
        </Button>
        {isAdmin && (
          <Button variant="ghost" size="icon" className="text-destructive/20 hover:text-destructive hover:bg-destructive/5" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
