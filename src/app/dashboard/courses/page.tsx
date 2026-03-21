
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, User, Clock, FileText, ChevronRight, Plus, Download, FileType, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ENROLLED_SUBJECTS = [
  {
    id: "PHY101",
    name: "Advanced Physics",
    instructor: "Dr. Aris Tesla",
    schedule: "Mon, Wed 09:00 AM",
    progress: 75,
    color: "bg-blue-500",
    materials: [
      { id: "M1", title: "Thermodynamics Lecture Notes", type: "PDF", date: "Oct 12, 2023", size: "2.4 MB" },
      { id: "M2", title: "Kinematics Practice Sheet", type: "DOCX", date: "Oct 15, 2023", size: "1.1 MB" },
      { id: "M3", title: "Vector Analysis Quiz Prep", type: "PDF", date: "Oct 20, 2023", size: "850 KB" },
    ]
  },
  {
    id: "MAT202",
    name: "Calculus II",
    instructor: "Prof. Sarah Smith",
    schedule: "Tue, Thu 11:30 AM",
    progress: 45,
    color: "bg-purple-500",
    materials: [
      { id: "M4", title: "Integration by Parts", type: "PDF", date: "Oct 10, 2023", size: "3.1 MB" },
      { id: "M5", title: "Trigonometric Substitution", type: "PDF", date: "Oct 18, 2023", size: "2.8 MB" },
    ]
  },
  {
    id: "LIT105",
    name: "English Literature",
    instructor: "Ms. Bennet",
    schedule: "Fri 10:00 AM",
    progress: 90,
    color: "bg-emerald-500",
    materials: [
      { id: "M6", title: "Poetry Analysis Guide", type: "PDF", date: "Oct 05, 2023", size: "1.5 MB" },
    ]
  },
];

const OPTIONAL_SUBJECTS = [
  { id: "CS101", name: "Computer Science", instructor: "Mr. Babbage", coeff: 2 },
  { id: "FM201", name: "Further Mathematics", instructor: "Mrs. Lovelace", coeff: 3 },
  { id: "MUS101", name: "Music & Arts", instructor: "Mr. Mozart", coeff: 2 },
];

export default function MySubjectsPage() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  const handleAddSubject = (subjectName: string) => {
    toast({
      title: language === 'en' ? "Subject Added" : "Matière Ajoutée",
      description: `${subjectName} ${language === 'en' ? 'has been added to your optional courses.' : 'a été ajoutée à vos cours facultatifs.'}`,
    });
    setIsAddingSubject(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">{t("courses")}</h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' ? "Manage your class subjects and access learning materials." : "Gérez vos matières et accédez aux supports de cours."}
          </p>
        </div>
        
        <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg h-11">
              <Plus className="w-4 h-4" /> {t("addSubject")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("availableSubjects")}</DialogTitle>
              <DialogDescription>
                {language === 'en' ? "Choose an optional subject to add to your class register." : "Choisissez une matière facultative à ajouter à votre registre."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {OPTIONAL_SUBJECTS.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl border border-accent bg-accent/10">
                  <div>
                    <p className="font-bold text-sm">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">Instructor: {sub.instructor} • Coeff: {sub.coeff}</p>
                  </div>
                  <Button size="sm" onClick={() => handleAddSubject(sub.name)}>{language === 'en' ? 'Add' : 'Ajouter'}</Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ENROLLED_SUBJECTS.map((course) => (
          <Card key={course.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`h-2 ${course.color}`} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2">{course.id}</Badge>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{course.name}</CardTitle>
                </div>
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{course.schedule}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{language === 'en' ? 'Syllabus Progress' : 'Progression du Programme'}</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${course.color} transition-all duration-500`} 
                    style={{ width: `${course.progress}%` }} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-accent/30 border-t border-accent/50 pt-4">
              <Button 
                variant="ghost" 
                className="w-full justify-between group-hover:bg-white"
                onClick={() => setSelectedSubject(course)}
              >
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> {t("viewMaterials")}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Materials Dialog */}
      <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t("materials")} - {selectedSubject?.name}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? `Access resources shared by ${selectedSubject?.instructor}.` 
                : `Accédez aux ressources partagées par ${selectedSubject?.instructor}.`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={language === 'en' ? "Search materials..." : "Chercher supports..."} className="pl-10" />
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {selectedSubject?.materials.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-4 rounded-xl border border-accent hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <FileType className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{file.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{file.type} • {file.size} • {file.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:text-primary">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <CardFooter className="px-0 pt-4 flex justify-between items-center text-xs text-muted-foreground italic border-t mt-4">
            <span>{selectedSubject?.materials.length} {language === 'en' ? 'files found' : 'fichiers trouvés'}</span>
            <Button variant="link" size="sm" onClick={() => setSelectedSubject(null)}>{t("cancel")}</Button>
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
