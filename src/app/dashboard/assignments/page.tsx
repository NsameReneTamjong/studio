
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
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ChevronRight, 
  Plus,
  ArrowUpRight,
  BookOpen,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Mock Data for Assignments
const MOCK_ASSIGNMENTS = [
  {
    id: "A1",
    title: "Thermodynamics Problems Set",
    subject: "Advanced Physics",
    teacher: "Dr. Tesla",
    dueDate: "2024-05-30T23:59:59Z",
    status: "due", // upcoming, due, submitted, graded
    maxMarks: 20,
  },
  {
    id: "A2",
    title: "Poetry Analysis Essay",
    subject: "English Literature",
    teacher: "Ms. Bennet",
    dueDate: "2024-05-28T23:59:59Z",
    status: "submitted",
    maxMarks: 10,
  },
  {
    id: "A3",
    title: "Matrix Multiplication Lab",
    subject: "Mathematics",
    teacher: "Prof. Smith",
    dueDate: "2024-05-20T23:59:59Z",
    status: "graded",
    score: 18,
    maxMarks: 20,
    feedback: "Excellent work on the inverse matrix section."
  },
  {
    id: "A4",
    title: "Future Tech Project",
    subject: "Informatique",
    teacher: "Mr. Babbage",
    dueDate: "2024-06-15T23:59:59Z",
    status: "upcoming",
    maxMarks: 50,
  }
];

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">{t("upcoming")}</Badge>;
      case "due":
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">{t("due")}</Badge>;
      case "submitted":
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">{t("submitted")}</Badge>;
      case "graded":
        return <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">{t("graded")}</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming": return <Calendar className="w-5 h-5 text-blue-500" />;
      case "due": return <Clock className="w-5 h-5 text-amber-500" />;
      case "submitted": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "graded": return <Award className="w-5 h-5 text-primary" />;
      default: return <FileEdit className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleCreateAssignment = () => {
    toast({
      title: t("save"),
      description: language === 'en' ? "Assignment has been posted successfully." : "Le devoir a été publié avec succès.",
    });
    setIsCreating(false);
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
              ? (language === 'en' ? "Assign tasks and review student submissions." : "Assignez des tâches et examinez les devoirs des élèves.")
              : (language === 'en' ? "Track your homework and project deadlines." : "Suivez vos devoirs et les dates limites de vos projets.")
            }
          </p>
        </div>

        {isTeacher && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg h-11">
                <Plus className="w-4 h-4" /> {language === 'en' ? 'New Assignment' : 'Nouveau Devoir'}
              </Button>
            </DialogTrigger>
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
                <Button onClick={handleCreateAssignment}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_ASSIGNMENTS.map((assignment) => (
          <Card key={assignment.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                   {getStatusIcon(assignment.status)}
                   {getStatusBadge(assignment.status)}
                </div>
                {assignment.status === 'graded' && (
                  <Badge variant="secondary" className="bg-primary text-white border-none font-bold">
                    {assignment.score}/{assignment.maxMarks}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{assignment.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {assignment.subject} • {assignment.teacher}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/30 p-3 rounded-lg flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-wider">{t("dueDate")}</span>
                 </div>
                 <span className="font-bold text-primary">
                    {new Date(assignment.dueDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short' })}
                 </span>
              </div>

              {assignment.status === 'graded' && assignment.feedback && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 italic text-[11px] text-muted-foreground">
                  "{assignment.feedback}"
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-accent/30 border-t border-accent/50 pt-4">
              {isTeacher ? (
                <Button variant="ghost" className="w-full justify-between hover:bg-white text-primary">
                  {language === 'en' ? 'Grade Submissions' : 'Noter les devoirs'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  className={cn(
                    "w-full gap-2 shadow-sm",
                    assignment.status === 'submitted' && "bg-muted text-muted-foreground cursor-default hover:bg-muted",
                    assignment.status === 'upcoming' && "opacity-50 cursor-not-allowed"
                  )}
                  variant={assignment.status === 'due' ? 'default' : 'outline'}
                  disabled={assignment.status === 'upcoming' || assignment.status === 'submitted'}
                  asChild
                >
                  <Link href={assignment.status === 'due' ? `/dashboard/assignments/submit?id=${assignment.id}` : "#"}>
                    {assignment.status === 'graded' ? (
                      <>{language === 'en' ? 'View Details' : 'Voir détails'} <ChevronRight className="w-4 h-4"/></>
                    ) : assignment.status === 'submitted' ? (
                      <>{language === 'en' ? 'Waiting for Grade' : 'En attente de note'}</>
                    ) : (
                      <>{t("submitAssignment")} <ArrowUpRight className="w-4 h-4" /></>
                    )}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
