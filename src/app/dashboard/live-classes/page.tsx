
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
  ShieldCheck,
  CalendarDays,
  X,
  Loader2,
  VideoOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology"];

export default function LiveClassesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isScheduling, setIsScheduling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    subject: "",
    topic: "",
    date: "",
    time: ""
  });

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

  const handleScheduleSubmit = () => {
    if (!scheduleData.topic || !scheduleData.subject) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsScheduling(false);
      toast({
        title: "Session Scheduled",
        description: "The live class has been added to the institutional calendar.",
      });
    }, 1200);
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
          <div className="flex flex-wrap gap-2">
            <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold border-primary/20 bg-white gap-2">
                  <CalendarDays className="w-5 h-5 text-primary" /> Schedule Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white relative">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <Video className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black">Plan Live Class</DialogTitle>
                      <DialogDescription className="text-white/60">Configure a future virtual session.</DialogDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsScheduling(false)} className="absolute top-4 right-4 text-white hover:bg-white/10">
                    <X className="w-6 h-6" />
                  </Button>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Subject</Label>
                    <Select onValueChange={(v) => setScheduleData({...scheduleData, subject: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Session Topic</Label>
                    <Input 
                      className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
                      placeholder="e.g. Introduction to Thermodynamics"
                      value={scheduleData.topic}
                      onChange={(e) => setScheduleData({...scheduleData, topic: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Date</Label>
                      <Input type="date" className="h-12 bg-accent/30 border-none rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Time</Label>
                      <Input type="time" className="h-12 bg-accent/30 border-none rounded-xl" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs" onClick={handleScheduleSubmit} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Schedule"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={handleStartClass} className="gap-2 shadow-lg h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs bg-secondary text-primary hover:bg-secondary/90">
              <Play className="w-4 h-4 fill-current" /> {t("startClass")}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_LIVE_CLASSES.map((session) => (
          <Card key={session.id} className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] bg-white">
            <div className="aspect-video relative overflow-hidden bg-accent/20">
              <img 
                src={session.thumbnail} 
                alt={session.topic} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                {session.status === 'live' ? (
                  <Badge className="bg-red-600 text-white border-none gap-1.5 px-3 h-7 font-black animate-pulse shadow-lg">
                    <Radio className="w-3.5 h-3.5" /> LIVE NOW
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-primary border-none gap-1.5 px-3 h-7 font-black shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-primary/40" /> UPCOMING
                  </Badge>
                )}
              </div>

              {session.status === 'live' && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-[10px] font-black uppercase">{session.participants} Students</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    <Clock className="w-3 h-3 text-secondary" /> {session.startTime}
                  </div>
                </div>
              )}
            </div>

            <CardHeader className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[9px] border-primary/10 text-primary font-black uppercase tracking-widest">{session.subject}</Badge>
              </div>
              <CardTitle className="text-xl font-black leading-tight text-primary line-clamp-2">
                {session.topic}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2 font-bold uppercase text-[10px] tracking-tight">
                <User className="w-3.5 h-3.5 text-secondary" /> {session.teacher}
              </CardDescription>
            </CardHeader>

            <CardFooter className="p-6 pt-0">
              <Button 
                className={cn(
                  "w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg transition-all active:scale-95",
                  session.status === 'live' ? "bg-primary text-white" : "bg-accent text-primary hover:bg-accent/80"
                )}
                onClick={() => session.status === 'live' && handleJoinClass(session.id)}
                disabled={session.status !== 'live'}
              >
                {session.status === 'live' ? (
                  <>
                    <Play className="w-4 h-4 fill-current text-secondary" /> Join virtual room
                  </>
                ) : (
                  "Add to calendar"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Empty State / Schedule Card */}
        <Card className="border-2 border-dashed border-primary/10 rounded-[2.5rem] bg-primary/[0.02] flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="p-5 bg-white rounded-[1.5rem] shadow-sm border border-primary/5">
            <VideoOff className="w-8 h-8 text-primary/20" />
          </div>
          <div>
            <h3 className="font-black text-primary uppercase tracking-tight">No more sessions?</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Check the institutional master plan for full duty coverage.</p>
          </div>
          <Button variant="outline" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-6 border-primary/10" asChild>
            <a href="/dashboard/schedule">Review Schedule</a>
          </Button>
        </Card>
      </div>

      {/* Institutional Safeguard Footer */}
      <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row items-center gap-6 max-w-3xl">
        <div className="p-4 bg-primary rounded-[1.5rem] text-white shadow-xl">
          <ShieldCheck className="w-8 h-8 text-secondary" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <p className="text-sm font-black text-primary uppercase tracking-tight">Secure Pedagogical Node</p>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Virtual classrooms are end-to-end encrypted. Presence logs and session recordings are automatically archived in the institutional registry for compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
