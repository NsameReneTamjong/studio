
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
  Trash2
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

const MOCK_COURSES = [
  { id: "PHY101", name: "Advanced Physics", instructorName: "Dr. Aris Tesla", targetClass: "2nde / Form 5", type: "compulsory", color: "bg-blue-500" },
  { id: "MAT101", name: "Mathematics", instructorName: "Prof. Sarah Smith", targetClass: "2nde / Form 5", type: "compulsory", color: "bg-emerald-500" },
];

export default function CoursesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [newSubject, setNewSubject] = useState({
    name: "",
    id: "",
    instructorName: "Dr. Jean Dupont",
    targetClass: "2nde / Form 5",
    type: "compulsory",
    color: "bg-blue-500"
  });

  const isAdmin = user?.role === "SCHOOL_ADMIN";

  useEffect(() => {
    setTimeout(() => {
      setSubjects(MOCK_COURSES);
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
      setNewSubject({ name: "", id: "", instructorName: "Dr. Jean Dupont", targetClass: "2nde / Form 5", type: "compulsory", color: "bg-blue-500" });
      toast({ title: "Subject Registered", description: `${newSubject.name} added to curriculum.` });
    }, 800);
  };

  const handleDeleteSubject = async (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast({ title: "Removed", description: "Subject removed from curriculum." });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">
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
                    <Label>Lead Instructor</Label>
                    <Select value={newSubject.instructorName} onValueChange={(v) => setNewSubject({...newSubject, instructorName: v})}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Aris Tesla">Dr. Aris Tesla</SelectItem>
                        <SelectItem value="Prof. Sarah Smith">Prof. Sarah Smith</SelectItem>
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
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
      ) : subjects && subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.map((course) => (
            <Card key={course.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className={`h-2 ${course.color || 'bg-blue-500'}`} />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold">{course.id}</Badge>
                      <Badge className="text-[9px] uppercase font-black border-none h-4 px-2 bg-primary/10 text-primary">{course.type}</Badge>
                    </div>
                    <CardTitle className="text-xl text-primary">{course.name}</CardTitle>
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
                <Button variant="ghost" className="w-full justify-between hover:bg-white h-10">
                  <span className="flex items-center gap-2 font-bold text-xs"><Eye className="w-4 h-4" /> View Details</span>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/5" onClick={() => handleDeleteSubject(course.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
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
