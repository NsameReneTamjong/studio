
"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  AlertCircle, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Award 
} from "lucide-react";
import { Button } from "@/components/ui/button";

function AwardIcon({ className }: { className?: string }) {
  return <Award className={className} />;
}

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = user?.role === "ADMIN" ? [
    { label: "Total Students", value: "1,284", icon: GraduationCap, color: "text-blue-600" },
    { label: "Faculty Members", value: "86", icon: Users, color: "text-purple-600" },
    { label: "Active Courses", value: "42", icon: BookOpen, color: "text-green-600" },
    { label: "Attendance Rate", value: "94.2%", icon: TrendingUp, color: "text-amber-600" },
  ] : user?.role === "TEACHER" ? [
    { label: "Assigned Students", value: "124", icon: GraduationCap, color: "text-blue-600" },
    { label: "Current Classes", value: "5", icon: BookOpen, color: "text-purple-600" },
    { label: "Pending Grades", value: "18", icon: AlertCircle, color: "text-red-600" },
    { label: "Avg. Attendance", value: "96%", icon: TrendingUp, color: "text-green-600" },
  ] : [
    { label: "Overall GPA", value: "3.84", icon: AwardIcon, color: "text-amber-600" },
    { label: "Courses Enrolled", value: "6", icon: BookOpen, color: "text-blue-600" },
    { label: "Attendance", value: "98%", icon: TrendingUp, color: "text-green-600" },
    { label: "Upcoming Tasks", value: "4", icon: CalendarIcon, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening in EduNexus today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your classes for the next 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "09:00 AM", subject: "Advanced Mathematics", room: "Room 402", teacher: "Dr. Aris" },
                { time: "11:30 AM", subject: "English Literature", room: "Room 201", teacher: "Ms. Bennet" },
                { time: "02:00 PM", subject: "Physics Lab", room: "Lab C", teacher: "Mr. Tesla" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 border border-accent">
                  <div className="bg-white px-3 py-1 rounded text-sm font-bold text-primary shadow-sm">{item.time}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary">{item.subject}</h4>
                    <p className="text-xs text-muted-foreground">{item.room} • {item.teacher}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">Details</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "New Assignment", time: "2h ago", type: "academic" },
                { title: "Attendance Updated", time: "4h ago", type: "system" },
                { title: "Campus News", time: "Yesterday", type: "info" },
              ].map((notif, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${notif.type === 'academic' ? 'bg-blue-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
