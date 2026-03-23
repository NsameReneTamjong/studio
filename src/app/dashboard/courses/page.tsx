
"use client";

import { useState } from "react";
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
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, query, where, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

export default function CoursesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    id: "",
    instructorUid: "",
    instructorName: "",
    targetClass: "2nde / Form 5",
    type: "compulsory",
    color: "bg-blue-500"
  });

  const isAdmin = user?.role === "SCHOOL_ADMIN";

  // Fetch real subjects
  const subjectsQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId) return null;
    return collection(db, "schools", user.schoolId, "courses");
  }, [db, user?.schoolId]);

  const { data: subjects, isLoading } = useCollection(subjectsQuery);

  // Fetch staff for instructor assignment
  const staffQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId) return null;
    return query(collection(db, "users"), where("schoolId", "==", user.schoolId), where("role", "==", "TEACHER"));
  }, [db, user?.schoolId]);

  const { data: teachers } = useCollection(staffQuery);

  const handleCreateSubject = async () => {
    if (!newSubject.name || !newSubject.id || !newSubject.instructorUid || !user?.schoolId) {
      toast({ variant: "destructive", title: "Missing Info", description: "Subject name, ID, and instructor are required." });
      return;
    }

    setIsProcessing(true);
    try {
      const selectedTeacher = teachers?.find(t => t.uid === newSubject.instructorUid);
      
      await addDoc(collection(db, "schools", user.schoolId, "courses"), {
        ...newSubject,
        instructorName: selectedTeacher?.name || "Unassigned",
        createdAt: serverTimestamp()
      });

      setIsAddingSubject(false);
      setNewSubject({ name: "", id: "", instructorUid: "", instructorName: "", targetClass: "2nde / Form 5", type: "compulsory", color: "bg-blue-500" });
      toast({ title: "Subject Registered", description: `${newSubject.name} added to curriculum.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to register subject." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!user?.schoolId) return;
    try {
      await deleteDoc(doc(db, "schools", user.schoolId, "courses", id));
      toast({ title: "Removed", description: "Subject removed from curriculum." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete subject." });
    }
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
                    <Select value={newSubject.instructorUid} onValueChange={(v) => setNewSubject({...newSubject, instructorUid: v})}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select teacher..." /></SelectTrigger>
                      <SelectContent>
                        {teachers?.map(t => <SelectItem key={t.uid} value={t.uid}>{t.name}</SelectItem>)}
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
                  <div className="col-span-2 space-y-2">
                    <Label>Requirement Type</Label>
                    <RadioGroup defaultValue="compulsory" onValueChange={(v) => setNewSubject({...newSubject, type: v})} className="grid grid-cols-2 gap-4">
                      <Label htmlFor="compulsory" className="flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="compulsory" id="compulsory" className="sr-only" />
                        <CheckCircle2 className="mb-2 h-6 w-6 text-primary" />
                        <span className="font-bold">Compulsory</span>
                      </Label>
                      <Label htmlFor="optional" className="flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="optional" id="optional" className="sr-only" />
                        <HelpCircle className="mb-2 h-6 w-6 text-secondary" />
                        <span className="font-bold">Optional</span>
                      </Label>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
                <Button variant="ghost" className="flex-1 h-12" onClick={() => setIsAddingSubject(false)}>Cancel</Button>
                <Button onClick={handleCreateSubject} className="flex-1 h-12 shadow-lg font-bold" disabled={isProcessing}>
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
