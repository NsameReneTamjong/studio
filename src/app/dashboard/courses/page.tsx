
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
  ChevronRight,
  ArrowLeft,
  FileText,
  Video,
  Link as LinkIcon,
  Download,
  Upload,
  FileDown,
  MoreVertical,
  Clock,
  ShieldCheck,
  Calendar
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

const INITIAL_MATERIALS = [
  { id: "M1", title: "Kinematics Summary PDF", type: "pdf", date: "2024-05-10", size: "2.4 MB", subjectId: "PHY101" },
  { id: "M2", title: "Thermodynamics Lecture Video", type: "video", date: "2024-05-12", size: "45 MB", subjectId: "PHY101" },
  { id: "M3", title: "Vector Calculus Notes", type: "pdf", date: "2024-05-14", size: "1.8 MB", subjectId: "MAT101" },
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
  
  // Materials View State
  const [viewingMaterialsFor, setViewingMaterialsFor] = useState<any>(null);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newMaterialData, setNewMaterialData] = useState({ title: "", type: "pdf" });

  const [myOptionalSubjects, setMyOptionalSubjects] = useState<string[]>([]);
  
  const [newSubject, setNewSubject] = useState({
    name: "",
    id: "",
    instructorName: "Dr. Jean Dupont",
    targetClass: "2nde / Form 5",
    type: "mandatory",
    color: "bg-blue-500"
  });

  const isTeacher = user?.role === "TEACHER";
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

  const handleAddMaterial = () => {
    if (!newMaterialData.title) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created = {
        id: `M-${Math.random().toString(36).substr(2, 5)}`,
        title: newMaterialData.title,
        type: newMaterialData.type,
        date: new Date().toISOString().split('T')[0],
        size: "1.2 MB",
        subjectId: viewingMaterialsFor.id
      };
      setMaterials([created, ...materials]);
      setIsProcessing(false);
      setIsAddingMaterial(false);
      setNewMaterialData({ title: "", type: "pdf" });
      toast({ title: "Material Uploaded", description: "Resource added to class archive." });
    }, 1200);
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
    toast({ title: "Material Removed", description: "Resource deleted from subject library." });
  };

  // Filter Logic
  if (viewingMaterialsFor) {
    const subjectMaterials = materials.filter(m => m.subjectId === viewingMaterialsFor.id);
    
    return (
      <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setViewingMaterialsFor(null)} className="rounded-full hover:bg-white shadow-sm">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-[9px] font-black border-none", viewingMaterialsFor.color)}>{viewingMaterialsFor.id}</Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline tracking-tight">{viewingMaterialsFor.name}</h1>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">{language === 'en' ? 'Subject Materials Archive' : 'Archives des supports de cours'}</p>
            </div>
          </div>
          <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg h-12 px-8 rounded-2xl bg-primary text-white font-bold">
                <Upload className="w-5 h-5" /> {language === 'en' ? 'Upload Material' : 'Ajouter un Support'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><BookMarked className="w-8 h-8 text-secondary" /></div>
                  <div>
                    <DialogTitle className="text-2xl font-black">Publish Resource</DialogTitle>
                    <DialogDescription className="text-white/60">Upload new pedagogical material for students.</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Title / Label</Label>
                  <Input 
                    value={newMaterialData.title} 
                    onChange={(e) => setNewMaterialData({...newMaterialData, title: e.target.value})} 
                    placeholder="e.g. Chapter 4 Summary" 
                    className="h-12 bg-accent/30 border-none rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Resource Type</Label>
                  <Select value={newMaterialData.type} onValueChange={(v) => setNewMaterialData({...newMaterialData, type: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="video">Lecture Video</SelectItem>
                      <SelectItem value="link">Reference Link</SelectItem>
                      <SelectItem value="doc">Worksheet (DOC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
                  <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    This material will be immediately accessible to all students registered in {viewingMaterialsFor.targetClass}.
                  </p>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                <Button onClick={handleAddMaterial} disabled={isProcessing || !newMaterialData.title} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-2">
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Confirm Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectMaterials.map((material) => (
            <Card key={material.id} className="border-none shadow-sm group hover:shadow-md transition-all overflow-hidden bg-white">
              <div className="p-6 flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  material.type === 'pdf' ? "bg-red-50 text-red-600" :
                  material.type === 'video' ? "bg-blue-50 text-blue-600" :
                  material.type === 'link' ? "bg-emerald-50 text-emerald-600" :
                  "bg-amber-50 text-amber-600"
                )}>
                  {material.type === 'pdf' ? <FileText className="w-6 h-6" /> :
                   material.type === 'video' ? <Video className="w-6 h-6" /> :
                   material.type === 'link' ? <LinkIcon className="w-6 h-6" /> :
                   <BookOpen className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary text-sm leading-tight truncate mb-1">{material.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {material.date}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span>{material.size}</span>
                  </div>
                </div>
              </div>
              <CardFooter className="bg-accent/10 p-3 border-t flex justify-between gap-2">
                <div className="flex flex-1 gap-2">
                  <Button variant="ghost" className="flex-1 h-9 rounded-lg hover:bg-white text-primary text-[10px] font-black uppercase tracking-widest gap-2">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                  <Button variant="ghost" className="flex-1 h-9 rounded-lg hover:bg-white text-primary text-[10px] font-black uppercase tracking-widest gap-2">
                    <Download className="w-3.5 h-3.5" /> Get
                  </Button>
                </div>
                {isTeacher && (
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive/20 hover:text-destructive hover:bg-red-50" onClick={() => handleDeleteMaterial(material.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          {subjectMaterials.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-[2rem] bg-accent/5 space-y-4">
              <div className="p-4 bg-white rounded-full w-fit mx-auto shadow-sm">
                <BookMarked className="w-10 h-10 text-primary/20" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-primary uppercase tracking-tighter">No materials found</p>
                <p className="text-xs text-muted-foreground">Upload class summaries, videos or notes for your students.</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2" onClick={() => setIsAddingMaterial(true)}>
                <Plus className="w-4 h-4" /> Add First Material
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

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
                <CourseCard key={course.id} course={course} isAdmin={isAdmin} onDelete={() => handleDeleteSubject(course.id)} onViewMaterials={() => setViewingMaterialsFor(course)} />
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
                  <CourseCard key={course.id} course={course} isAdmin={isAdmin} onDelete={() => handleDeleteSubject(course.id)} onViewMaterials={() => setViewingMaterialsFor(course)} />
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

function CourseCard({ course, isAdmin, onDelete, onViewMaterials }: { course: any, isAdmin: boolean, onDelete: () => void, onViewMaterials: () => void }) {
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
        <Button variant="ghost" className="flex-1 justify-between hover:bg-white h-10 group/btn" onClick={onViewMaterials}>
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
