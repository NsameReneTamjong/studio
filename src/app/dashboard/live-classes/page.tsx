
"use client";

import { useState, useMemo } from "react";
import { useAuth, type LiveClass } from "@/lib/auth-context";
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
  User,
  ShieldCheck,
  CalendarDays,
  X,
  Loader2,
  VideoOff,
  Trash2
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

const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology"];

export default function LiveClassesPage() {
  const { user, liveClasses, addLiveClass, deleteLiveClass } = useAuth();
  const { t, language } = useI18n();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isScheduling, setIsScheduling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    subject: "",
    topic: "",
    date: "",
    time: "",
    duration: "60"
  });

  const isTeacher = user?.role === "TEACHER";

  const getStatus = (scheduledTime: string, durationMinutes: number): "live" | "upcoming" | "ended" => {
    const start = new Date(scheduledTime).getTime();
    const end = start + (durationMinutes * 60000);
    const now = Date.now();

    if (now >= start && now < end) return "live";
    if (now < start) return "upcoming";
    return "ended";
  };

  const sortedClasses = useMemo(() => {
    return [...liveClasses].map(c => ({
      ...c,
      status: getStatus(c.scheduledDateTime, c.duration)
    })).sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (b.status === 'live' && a.status !== 'live') return 1;
      return new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime();
    });
  }, [liveClasses]);

  const handleStartClass = (id: string) => {
    router.push(`/dashboard/live-classes/${id}`);
    toast({
      title: "Initializing Node",
      description: "Establishing secure virtual pedagogical link.",
    });
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData.topic || !scheduleData.subject || !scheduleData.date || !scheduleData.time) {
      toast({ variant: "destructive", title: "Missing Information" });
      return;
    }
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const scheduledDateTime = `${scheduleData.date}T${scheduleData.time}:00`;
      addLiveClass({
        title: scheduleData.topic,
        subject: scheduleData.subject,
        scheduledDateTime,
        duration: parseInt(scheduleData.duration)
      });
      
      setIsProcessing(false);
      setIsScheduling(false);
      setScheduleData({ subject: "", topic: "", date: "", time: "", duration: "60" });
      toast({ title: "Session Scheduled" });
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Video className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? 'Live Classes' : 'Classes en Direct'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher 
              ? "Govern virtual pedagogical sessions and real-time interactions." 
              : "Access active lectures and synchronize with your instructors."}
          </p>
        </div>
        
        {isTeacher && (
          <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-primary text-white">
                <Plus className="w-5 h-5" /> Schedule New Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><Video className="w-8 h-8 text-secondary" /></div>
                  <div>
                    <DialogTitle className="text-2xl font-black uppercase">Plan Live Class</DialogTitle>
                    <DialogDescription className="text-white/60">Configure a future pedagogical node.</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <form onSubmit={handleScheduleSubmit}>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
                    <Select value={scheduleData.subject} onValueChange={(v) => setScheduleData({...scheduleData, subject: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Session Topic</Label>
                    <Input 
                      className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
                      placeholder="e.g. Quantum Mechanics Intro"
                      value={scheduleData.topic}
                      onChange={(e) => setScheduleData({...scheduleData, topic: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</Label>
                      <Input type="date" className="h-12 bg-accent/30 border-none rounded-xl" value={scheduleData.date} onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Start Time</Label>
                      <Input type="time" className="h-12 bg-accent/30 border-none rounded-xl" value={scheduleData.time} onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Duration (Minutes)</Label>
                    <Select value={scheduleData.duration} onValueChange={(v) => setScheduleData({...scheduleData, duration: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Minutes</SelectItem>
                        <SelectItem value="45">45 Minutes</SelectItem>
                        <SelectItem value="60">60 Minutes</SelectItem>
                        <SelectItem value="90">90 Minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button type="submit" className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Commit to Calendar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedClasses.map((session) => (
          <Card key={session.id} className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] bg-white flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-slate-900">
              <img 
                src={`https://picsum.photos/seed/${session.id}/800/450`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                alt={session.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                {session.status === 'live' ? (
                  <Badge className="bg-red-600 text-white border-none gap-1.5 px-3 h-7 font-black animate-pulse">
                    <Radio className="w-3.5 h-3.5" /> LIVE NOW
                  </Badge>
                ) : session.status === 'upcoming' ? (
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-primary border-none gap-1.5 px-3 h-7 font-black">
                    <Calendar className="w-3.5 h-3.5 text-primary/40" /> UPCOMING
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-800/80 backdrop-blur-md text-white/40 border-none px-3 h-7 font-black">
                    SESSION ENDED
                  </Badge>
                )}
              </div>

              {session.status !== 'ended' && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-[10px] font-black uppercase">
                      {new Date(session.scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <Badge className="bg-white/10 backdrop-blur-md border-white/10 text-white text-[9px] font-bold h-6">
                    {session.duration}m Duration
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader className="p-6 pb-2">
              <Badge variant="outline" className="w-fit text-[9px] border-primary/10 text-primary font-black uppercase mb-2">{session.subject}</Badge>
              <CardTitle className="text-xl font-black text-primary leading-tight">{session.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2 font-bold uppercase text-[10px]">
                <User className="w-3 h-3 text-secondary" /> {session.teacherName}
              </CardDescription>
            </CardHeader>

            <CardFooter className="p-6 mt-auto flex flex-col gap-3">
              <Button 
                className={cn(
                  "w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg transition-all active:scale-95",
                  session.status === 'live' ? "bg-primary text-white" : "bg-accent text-primary hover:bg-accent/80"
                )}
                onClick={() => handleStartClass(session.id)}
                disabled={session.status === 'ended'}
              >
                {session.status === 'live' ? (
                  <><Play className="w-4 h-4 fill-current text-secondary" /> {isTeacher ? "Start Session" : "Join Session"}</>
                ) : session.status === 'upcoming' ? (
                  "Waiting for Start..."
                ) : "Archives Available Soon"}
              </Button>
              {isTeacher && (
                <Button variant="ghost" size="sm" className="text-destructive/40 hover:text-destructive hover:bg-red-50 text-[9px] font-black uppercase tracking-widest h-8 rounded-xl" onClick={() => deleteLiveClass(session.id)}>
                  <Trash2 className="w-3 h-3 mr-2" /> Decommission Node
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}

        {liveClasses.length === 0 && (
          <Card className="col-span-full border-2 border-dashed border-primary/10 rounded-[3rem] bg-primary/[0.02] flex flex-col items-center justify-center text-center p-20 space-y-6">
            <div className="p-6 bg-white rounded-full shadow-sm">
              <VideoOff className="w-12 h-12 text-primary/10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-primary uppercase">No Active Nodes</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto font-medium">Check the institutional master plan or contact the sub-admin for schedule synchronization.</p>
            </div>
          </Card>
        )}
      </div>

      <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row items-center gap-6 max-w-3xl">
        <div className="p-4 bg-primary rounded-2xl text-white shadow-xl">
          <ShieldCheck className="w-8 h-8 text-secondary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black text-primary uppercase tracking-tight">Encrypted Pedagogical Stream</p>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Virtual rooms use high-fidelity node encryption. Participant logs are automatically archived in the institutional registry for compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
