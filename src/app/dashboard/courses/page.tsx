"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  User, 
  Clock, 
  FileText, 
  ChevronRight, 
  Plus, 
  Download, 
  FileImage, 
  FileEdit, 
  FileCode,
  Search,
  Eye,
  X,
  Users,
  Award,
  PenTool,
  ClipboardCheck,
  TrendingUp,
  Settings2,
  Layers,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Comprehensive Mock Data for All School Subjects
const INITIAL_SUBJECTS = [
  {
    id: "PHY101",
    name: "Advanced Physics",
    instructor: "Dr. Aris Tesla",
    instructorAvatar: "https://picsum.photos/seed/t1/100/100",
    schedule: "Mon, Wed 09:00 AM",
    progress: 75,
    studentCount: 42,
    avgMark: "14.5/20",
    type: "compulsory",
    targetClass: "Form 5 / 2nde",
    color: "bg-blue-500",
    materials: [
      { id: "M1", title: "Thermodynamics Lecture Notes", type: "PDF", date: "Oct 12, 2023", size: "2.4 MB", url: "https://picsum.photos/seed/pdf1/800/1200" },
      { id: "M2", title: "Kinematics Practice Sheet", type: "DOCX", date: "Oct 15, 2023", size: "1.1 MB", url: "https://picsum.photos/seed/docx1/800/1200" },
    ],
    exams: [
      { id: "E1", title: "Sequence 1 Physics", date: "Sept 24, 2023", submissions: 42 },
      { id: "E2", title: "Mid-Term MCQ", date: "Oct 30, 2023", submissions: 40 },
    ],
    attendance: [
      { date: "Oct 24", time: "09:00 AM", present: 40, absent: 2 },
      { date: "Oct 22", time: "09:00 AM", present: 38, absent: 4 },
    ]
  },
  {
    id: "MAT202",
    name: "Calculus II",
    instructor: "Prof. Sarah Smith",
    instructorAvatar: "https://picsum.photos/seed/t2/100/100",
    schedule: "Tue, Thu 11:30 AM",
    progress: 45,
    studentCount: 38,
    avgMark: "15.2/20",
    type: "compulsory",
    targetClass: "Lower Sixth / 1ère",
    color: "bg-purple-500",
    materials: [
      { id: "M4", title: "Integration by Parts", type: "PDF", date: "Oct 10, 2023", size: "3.1 MB", url: "https://picsum.photos/seed/pdf2/800/1200" },
    ],
    exams: [
      { id: "E3", title: "Calculus Quiz 1", date: "Oct 05, 2023", submissions: 38 },
    ],
    attendance: [
      { date: "Oct 25", time: "11:30 AM", present: 35, absent: 3 },
    ]
  },
  {
    id: "LIT105",
    name: "English Literature",
    instructor: "Ms. Bennet",
    instructorAvatar: "https://picsum.photos/seed/t3/100/100",
    schedule: "Fri 10:00 AM",
    progress: 90,
    studentCount: 45,
    avgMark: "16.8/20",
    type: "optional",
    targetClass: "Form 5 / 2nde",
    color: "bg-emerald-500",
    materials: [
      { id: "M6", title: "Poetry Analysis Guide", type: "PDF", date: "Oct 05, 2023", size: "1.5 MB", url: "https://picsum.photos/seed/pdf3/800/1200" },
    ],
    exams: [],
    attendance: []
  },
];

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

const TEACHERS = [
  "Dr. Aris Tesla",
  "Prof. Sarah Smith",
  "Ms. Bennet",
  "Dr. Jane Smith",
  "Mr. John Doe",
  "Mme. Ngono Celine",
  "Mr. Ebong"
];

export default function CoursesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    id: "",
    instructor: "",
    targetClass: "",
    type: "compulsory"
  });

  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isStudent = user?.role === "STUDENT";

  const handleCreateSubject = () => {
    if (!newSubject.name || !newSubject.id || !newSubject.instructor) {
      toast({ variant: "destructive", title: "Error", description: "Subject name, ID, and instructor are required." });
      return;
    }
    toast({
      title: "Subject Created",
      description: `${newSubject.name} has been added to the ${newSubject.targetClass} curriculum as a ${newSubject.type} course taught by ${newSubject.instructor}.`
    });
    setIsAddingSubject(false);
    setNewSubject({ name: "", id: "", instructor: "", targetClass: "", type: "compulsory" });
  };

  const handleViewFile = (url: string, title: string) => {
    window.open(url, '_blank');
    toast({
      title: language === 'en' ? "Opening File" : "Ouverture du fichier",
      description: title,
    });
  };

  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'DOCX': return <FileEdit className="w-5 h-5 text-blue-500" />;
      default: return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">
            {isAdmin ? (language === 'en' ? "Institutional Subjects" : "Matières Institutionnelles") : t("courses")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? (language === 'en' ? "Monitor pedagogical activity, resources, and performance for all courses." : "Surveillez l'activité pédagogique, les supports et les performances de tous les cours.")
              : (language === 'en' ? "Manage your class subjects and access learning materials." : "Gérez vos matières et accédez aux supports de cours.")
            }
          </p>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
                <Plus className="w-5 h-5" /> {language === 'en' ? 'Add New Subject' : 'Nouvelle Matière'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary p-8 text-white">
                <DialogTitle className="text-2xl font-black">{language === 'en' ? 'Setup New Subject' : 'Nouvelle Matière'}</DialogTitle>
                <DialogDescription className="text-white/60">Configure curriculum requirements and instructor assignment.</DialogDescription>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject Name</Label>
                    <Input 
                      placeholder="e.g. Advanced Biology" 
                      className="bg-accent/30 border-none h-12 rounded-xl"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject ID</Label>
                    <Input 
                      placeholder="e.g. BIO101" 
                      className="bg-accent/30 border-none h-12 rounded-xl"
                      value={newSubject.id}
                      onChange={(e) => setNewSubject({...newSubject, id: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lead Instructor</Label>
                    <Select value={newSubject.instructor} onValueChange={(v) => setNewSubject({...newSubject, instructor: v})}>
                      <SelectTrigger className="bg-accent/30 border-none h-12 rounded-xl">
                        <SelectValue placeholder="Select teacher..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TEACHERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Class Level</Label>
                    <Select onValueChange={(v) => setNewSubject({...newSubject, targetClass: v})}>
                      <SelectTrigger className="bg-accent/30 border-none h-12 rounded-xl">
                        <SelectValue placeholder="Select class..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Requirement Type</Label>
                    <RadioGroup 
                      defaultValue="compulsory" 
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(v) => setNewSubject({...newSubject, type: v})}
                    >
                      <Label
                        htmlFor="compulsory"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-accent bg-white p-4 hover:bg-accent/50 cursor-pointer [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="compulsory" id="compulsory" className="sr-only" />
                        <CheckCircle2 className="mb-2 h-6 w-6 text-primary" />
                        <span className="font-bold text-sm">Compulsory</span>
                        <span className="text-[10px] text-muted-foreground text-center">Mandatory for the whole class</span>
                      </Label>
                      <Label
                        htmlFor="optional"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-accent bg-white p-4 hover:bg-accent/50 cursor-pointer [&:has([data-state=checked])]:border-primary"
                      >
                        <RadioGroupItem value="optional" id="optional" className="sr-only" />
                        <HelpCircle className="mb-2 h-6 w-6 text-secondary" />
                        <span className="font-bold text-sm">Optional</span>
                        <span className="text-[10px] text-muted-foreground text-center">Elective subject choice</span>
                      </Label>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
                <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsAddingSubject(false)}>{t("cancel")}</Button>
                <Button onClick={handleCreateSubject} className="flex-1 rounded-xl h-12 shadow-lg font-bold">Register Subject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {INITIAL_SUBJECTS.map((course) => (
          <Card key={course.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`h-2 ${course.color}`} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold">{course.id}</Badge>
                    <Badge className={cn(
                      "text-[9px] uppercase font-black border-none h-4 px-2",
                      course.type === 'compulsory' ? "bg-primary/10 text-primary" : "bg-secondary/20 text-primary"
                    )}>
                      {course.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{course.name}</CardTitle>
                </div>
                <div className="p-2 bg-accent/50 rounded-lg shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> Instructor
                  </p>
                  <p className="text-xs font-bold truncate">{course.instructor}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Class Level
                  </p>
                  <p className="text-xs font-bold">{course.targetClass}</p>
                </div>
              </div>

              {isStudent && (
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Syllabus Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                    <div className={`h-full ${course.color} transition-all`} style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="pt-2 border-t border-accent flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-secondary/20 rounded-md">
                        <TrendingUp className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Performance Index</span>
                   </div>
                   <span className="font-black text-primary text-sm">{course.avgMark}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-accent/30 border-t border-accent/50 pt-4 flex gap-2">
              {isAdmin ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-10 gap-2 text-xs font-bold bg-white"
                    onClick={() => setIsEditingSubject(true)}
                  >
                    <Settings2 className="w-4 h-4" /> Edit
                  </Button>
                  <Button 
                    className="flex-1 h-10 gap-2 text-xs font-bold shadow-sm"
                    onClick={() => setSelectedSubject(course)}
                  >
                    <Eye className="w-4 h-4" /> View
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:bg-white h-10"
                  onClick={() => setSelectedSubject(course)}
                >
                  <span className="flex items-center gap-2 font-bold text-xs"><FileText className="w-4 h-4" /> {t("viewMaterials")}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Subject Command Center Dialog */}
      <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="p-8 bg-primary text-white shrink-0">
            <div className="flex items-center gap-6">
              <div className={cn("p-4 rounded-2xl shadow-xl", selectedSubject?.color)}>
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-none text-[10px] font-black">{selectedSubject?.id}</Badge>
                  <Badge variant="secondary" className="bg-secondary text-primary border-none text-[10px] font-black uppercase">
                    {selectedSubject?.type}
                  </Badge>
                </div>
                <DialogTitle className="text-3xl font-black">{selectedSubject?.name}</DialogTitle>
                <DialogDescription className="text-white/60 font-bold flex items-center gap-2">
                  <User className="w-4 h-4" /> {selectedSubject?.instructor} • {selectedSubject?.targetClass}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="materials" className="flex-1 flex flex-col">
              <TabsList className="px-8 border-b bg-accent/10 h-14 justify-start gap-8 rounded-none">
                <TabsTrigger value="materials" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent shadow-none px-0 gap-2">
                  <FileText className="w-4 h-4" /> Resources
                </TabsTrigger>
                {isAdmin && (
                  <>
                    <TabsTrigger value="exams" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent shadow-none px-0 gap-2">
                      <PenTool className="w-4 h-4" /> Exams
                    </TabsTrigger>
                    <TabsTrigger value="results" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent shadow-none px-0 gap-2">
                      <Award className="w-4 h-4" /> Results
                    </TabsTrigger>
                    <TabsTrigger value="attendance" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent shadow-none px-0 gap-2">
                      <ClipboardCheck className="w-4 h-4" /> Attendance
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="materials" className="flex-1 overflow-y-auto p-8 mt-0">
                <div className="space-y-4">
                  {selectedSubject?.materials.map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between p-4 rounded-xl border bg-white hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/50 rounded-xl group-hover:bg-primary/10 transition-colors">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-primary">{file.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{file.type} • {file.size} • {file.date}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleViewFile(file.url, file.title)} className="gap-2">
                        <Eye className="w-4 h-4" /> View
                      </Button>
                    </div>
                  ))}
                  {selectedSubject?.materials.length === 0 && <p className="text-center py-10 text-muted-foreground">No resources uploaded.</p>}
                </div>
              </TabsContent>

              <TabsContent value="exams" className="flex-1 overflow-y-auto p-8 mt-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-accent/30 uppercase text-[10px] font-black">
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Submissions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSubject?.exams.map((ex: any) => (
                      <TableRow key={ex.id}>
                        <TableCell className="font-bold text-sm text-primary">{ex.title}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{ex.date}</TableCell>
                        <TableCell className="text-right font-black">{ex.submissions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="results" className="flex-1 overflow-y-auto p-8 mt-0">
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-10">
                   <div className="p-4 bg-secondary/20 rounded-full">
                      <TrendingUp className="w-12 h-12 text-primary" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold">Course Performance Analysis</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mt-2">Aggregate student outcome for {selectedSubject?.name} is currently <span className="font-black text-primary">{selectedSubject?.avgMark}</span>.</p>
                   </div>
                   <Button variant="outline" className="gap-2">Download Full Grade Ledger</Button>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="flex-1 overflow-y-auto p-8 mt-0">
                <div className="space-y-4">
                  {selectedSubject?.attendance.map((att: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600 border border-green-100">
                          <ClipboardCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{att.date}</p>
                          <p className="text-[10px] text-muted-foreground">{att.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Present</p>
                          <p className="text-sm font-black text-green-600">{att.present}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Absent</p>
                          <p className="text-sm font-black text-red-600">{att.absent}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="p-6 bg-accent/10 border-t flex justify-between items-center shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest italic">Institutional pedagogical audit active.</p>
            <Button variant="ghost" onClick={() => setSelectedSubject(null)}>Close Portal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditingSubject} onOpenChange={setIsEditingSubject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subject Parameters</DialogTitle>
            <DialogDescription>Modify global settings for this course.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Assign Instructor</label>
                <Select defaultValue="Dr. Aris Tesla">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEACHERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Schedule Window</label>
                <Input defaultValue="Mon, Wed 09:00 AM" />
             </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditingSubject(false)}>Cancel</Button>
            <Button onClick={() => { setIsEditingSubject(false); toast({ title: "Updated", description: "Subject settings saved." }); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
