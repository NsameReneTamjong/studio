
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Users, 
  Clock, 
  Play, 
  Plus, 
  ChevronRight, 
  Radio, 
  Calendar,
  History,
  BookOpen,
  User,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MOCK_LIVE_CLASSES = [
  {
    id: "LIVE-001",
    subject: "Advanced Physics",
    topic: "Introduction to Quantum Mechanics",
    teacher: "Dr. Aris Tesla",
    participants: 42,
    status: "live",
    startTime: "Started 15m ago",
    thumbnail: "https://picsum.photos/seed/physics-live/800/450"
  },
  {
    id: "LIVE-002",
    subject: "Mathematics",
    topic: "Vector Calculus Integration",
    teacher: "Prof. Sarah Smith",
    participants: 0,
    status: "upcoming",
    startTime: "Starts in 2h 30m",
    thumbnail: "https://picsum.photos/seed/math-live/800/450"
  }
];

export default function LiveClassesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const router = useRouter();
  const { toast } = useToast();
  
  const isTeacher = user?.role === "TEACHER";

  const handleStartClass = () => {
    const classId = `CLASS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    router.push(`/dashboard/live-classes/${classId}`);
    toast({
      title: "Class Room Initialized",
      description: "Setting up your virtual pedagogical space.",
    });
  };

  const handleJoinClass = (id: string) => {
    router.push(`/dashboard/live-classes/${id}`);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Video className="w-6 h-6 text-secondary" />
            </div>
            {t("liveClasses")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher 
              ? "Organize and host real-time virtual classroom sessions." 
              : "Attend live lectures and interact with your instructors."}
          </p>
        </div>
        
        {isTeacher && (
          <Button onClick={handleStartClass} className="gap-2 shadow-lg h-12 px-8 rounded-2xl font-bold bg-secondary text-primary hover:bg-secondary/90">
            <Plus className="w-5 h-5" /> {t("startClass")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_LIVE_CLASSES.map((session) => (
          <Card key={session.id} className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-[2rem] bg-white">
            <div className="aspect-video relative overflow-hidden bg-accent/20">
              <img 
                src={session.thumbnail} 
                alt={session.topic} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                {session.status === 'live' ? (
                  <Badge className="bg-red-600 text-white border-none gap-1.5 px-3 h-7 font-black animate-pulse">
                    <Radio className="w-3.5 h-3.5" /> LIVE NOW
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-primary border-none gap-1.5 px-3 h-7 font-black">
                    <Calendar className="w-3.5 h-3.5" /> UPCOMING
                  </Badge>
                )}
              </div>

              {session.status === 'live' && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs font-bold">{session.participants} watching</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3 text-secondary" /> {session.startTime}
                  </div>
                </div>
              )}
            </div>

            <CardHeader className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary font-bold uppercase">{session.subject}</Badge>
              </div>
              <CardTitle className="text-xl font-black leading-tight text-primary line-clamp-2">
                {session.topic}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2 font-bold">
                <User className="w-3.5 h-3.5 text-secondary" /> {session.teacher}
              </CardDescription>
            </CardHeader>

            <CardFooter className="p-6 pt-0">
              <Button 
                className={cn(
                  "w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs gap-2 shadow-lg",
                  session.status === 'live' ? "bg-primary text-white" : "bg-accent text-primary hover:bg-accent/80"
                )}
                onClick={() => session.status === 'live' && handleJoinClass(session.id)}
                disabled={session.status !== 'live'}
              >
                {session.status === 'live' ? (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Join Virtual Room
                  </>
                ) : (
                  "Remind Me"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Empty State / Schedule Card */}
        <Card className="border-2 border-dashed border-accent rounded-[2rem] bg-accent/5 flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <History className="w-8 h-8 text-primary/30" />
          </div>
          <div>
            <h3 className="font-bold text-primary">No more sessions today?</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Check your academic calendar for the full weekly broadcast schedule.</p>
          </div>
          <Button variant="outline" className="rounded-xl font-bold" asChild>
            <a href="/dashboard/schedule">View Schedule</a>
          </Button>
        </Card>
      </div>

      {/* Institutional Safeguard Footer */}
      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center gap-4 max-w-2xl">
        <div className="p-3 bg-primary rounded-2xl text-white shadow-xl">
          <ShieldCheck className="w-6 h-6 text-secondary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary">Secure Pedagogical Broadcasting</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All live sessions are encrypted and logged for institutional compliance. Automated attendance is recorded based on session duration.
          </p>
        </div>
      </div>
    </div>
  );
}
