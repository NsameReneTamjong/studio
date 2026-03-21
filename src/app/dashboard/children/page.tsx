
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Calendar, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

const CHILDREN = [
  {
    id: "S001",
    name: "Alice Thompson",
    grade: "10th",
    gpa: "3.9",
    attendance: "98%",
    nextClass: "Physics 101 - 09:00 AM",
    avatar: "https://picsum.photos/seed/alice/100/100"
  },
  {
    id: "S004",
    name: "Diana Prince",
    grade: "10th",
    gpa: "4.0",
    attendance: "100%",
    nextClass: "Math Honors - 10:30 AM",
    avatar: "https://picsum.photos/seed/diana/100/100"
  }
];

export default function ChildrenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">My Children</h1>
        <p className="text-muted-foreground mt-1">Monitor academic performance and schedules for your children.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CHILDREN.map((child) => (
          <Card key={child.id} className="border-none shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center gap-4 bg-accent/30">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <CardTitle>{child.name}</CardTitle>
                <CardDescription>ID: {child.id} • {child.grade} Grade</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary text-white">Top Student</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1">
                    <Award className="w-3 h-3"/> Current GPA
                  </p>
                  <p className="text-2xl font-bold text-primary">{child.gpa}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3"/> Attendance
                  </p>
                  <p className="text-2xl font-bold text-primary">{child.attendance}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-accent/20 border border-accent">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Next Up Today
                </p>
                <p className="font-semibold text-sm">{child.nextClass}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="/dashboard/grades">
                    View Report Card <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="/dashboard/schedule">
                    View Full Schedule <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
