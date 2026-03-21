
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, User, Clock, FileText, ChevronRight } from "lucide-react";

const ENROLLED_COURSES = [
  {
    id: "PHY101",
    name: "Advanced Physics",
    instructor: "Dr. Aris Tesla",
    schedule: "Mon, Wed 09:00 AM",
    progress: 75,
    color: "bg-blue-500",
  },
  {
    id: "MAT202",
    name: "Calculus II",
    instructor: "Prof. Sarah Smith",
    schedule: "Tue, Thu 11:30 AM",
    progress: 45,
    color: "bg-purple-500",
  },
  {
    id: "LIT105",
    name: "English Literature",
    instructor: "Ms. Bennet",
    schedule: "Fri 10:00 AM",
    progress: 90,
    color: "bg-emerald-500",
  },
  {
    id: "CHE301",
    name: "General Chemistry",
    instructor: "Dr. Walter White",
    schedule: "Mon, Wed 02:00 PM",
    progress: 60,
    color: "bg-amber-500",
  },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">My Enrolled Courses</h1>
        <p className="text-muted-foreground mt-1">Manage your active classes and track your academic progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ENROLLED_COURSES.map((course) => (
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
                  <span>Course Progress</span>
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
              <Button variant="ghost" className="w-full justify-between group-hover:bg-white">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> View Materials</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
