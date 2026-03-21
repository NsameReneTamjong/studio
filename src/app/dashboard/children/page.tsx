
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Calendar, BookOpen, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n-context";

const CHILDREN = [
  {
    id: "S001",
    name: "Alice Thompson",
    grade: "10th",
    gpa: "3.9",
    attendance: "98%",
    nextClass: "Physics 101 - 09:00 AM",
    avatar: "https://picsum.photos/seed/alice/200/200"
  },
  {
    id: "S004",
    name: "Diana Prince",
    grade: "10th",
    gpa: "4.0",
    attendance: "100%",
    nextClass: "Math Honors - 10:30 AM",
    avatar: "https://picsum.photos/seed/diana/200/200"
  }
];

export default function ChildrenPage() {
  const { t, language } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">
          {language === "en" ? "My Children" : "Mes Enfants"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "en" 
            ? "Select a child to view their full performance, schedule, and attendance." 
            : "Sélectionnez un enfant pour voir ses performances, son emploi du temps et ses présences."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CHILDREN.map((child) => (
          <Card key={child.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 bg-accent/30">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm shrink-0">
                <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{child.name}</CardTitle>
                <CardDescription className="font-medium text-primary/70">ID: {child.id} • {child.grade} Grade</CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="bg-primary text-white text-[10px]">
                    {language === "en" ? "Top Student" : "Élève Brillant"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-accent shadow-sm">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1 mb-1">
                    <Award className="w-3 h-3 text-amber-500"/> {language === "en" ? "GPA" : "Moyenne"}
                  </p>
                  <p className="text-2xl font-bold text-primary">{child.gpa}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-accent shadow-sm">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-blue-500"/> {language === "en" ? "Attendance" : "Présence"}
                  </p>
                  <p className="text-2xl font-bold text-primary">{child.attendance}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-accent/20 border border-accent">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {language === "en" ? "Next Up Today" : "Cours suivant"}
                </p>
                <p className="font-semibold text-sm">{child.nextClass}</p>
              </div>

              <Button className="w-full h-11 shadow-sm gap-2 text-base" asChild>
                <Link href={`/dashboard/children/view?id=${child.id}`}>
                  {language === "en" ? "Open Child Dashboard" : "Ouvrir le Tableau de Bord"}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
