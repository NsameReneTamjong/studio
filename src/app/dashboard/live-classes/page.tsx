
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
  Trash2,
  AlertCircle,
  Ban,
  CheckCircle2,
  History
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology"];

export default function OnlineClassesPage() {
  const { user, liveClasses, addLiveClass, deleteLiveClass, cancelLiveClass } = useAuth();
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

  const getStatus = (c: LiveClass): "live" | "upcoming" | "ended" | "cancelled" => {
    if (c.status === 'cancelled') return 'cancelled';
    
    const start = new Date(c.scheduledDateTime).getTime();
    const end = start + (c.duration * 60000);
    const now = Date.now();

    if (now >= start && now < end) return "live";
    if (now < start) return "upcoming";
    return "ended";
  };

  const processedClasses = useMemo(() => {
    return [...liveClasses].map(c => ({
      ...c,
      derivedStatus: getStatus(c)
    }));
  }, [liveClasses]);

  const liveNow = processedClasses.filter(c => c.derivedStatus === 'live');
  const upcoming = processedClasses.filter(c => c.derivedStatus === 'upcoming');
  const finished = processedClasses.filter(c => c.derivedStatus === 'ended' || c.derivedStatus === 'cancelled');

  const handleStartClass = (id: string) => {
    router.push(`/dashboard/live-classes/${id}`);
    toast({
      title: "Initializing Node",
      description: "Establishing secure virtual pedagogical link.",
    });
  };

  const handleCancelClass = (id: string) => {
    cancelLiveClass(id);
    toast({ variant: "destructive", title: "Session Cancelled", description: "The session has been flagged as cancelled in the registry." });
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
            {t("onlineClasses")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
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
                    <DialogTitle className="text-2xl font-black uppercase">Plan Online Class</DialogTitle>
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

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-10 bg-white shadow-sm border h-auto p-1.5 rounded-[2rem]">
          <TabsTrigger value="live" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all">
            <Radio className="w-4 h-4 text-red-500" /> Live Now
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all">
            <Calendar className="w-4 h-4 text-primary" /> Upcoming
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all">
            <History className="w-4 h-4 text-muted-foreground" /> Registry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          {liveNow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveNow.map((session) => (
                <ClassCard key={session.id} session={session} isTeacher={isTeacher} onStart={handleStartClass} onCancel={handleCancelClass} onDelete={deleteLiveClass} />
              ))}
            </div>
          ) : (
            <EmptyState icon={VideoOff} title="No Live Sessions" description="There are no online classes broadcasting at this moment." />
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.map((session) => (
                <ClassCard key={session.id} session={session} isTeacher={isTeacher} onStart={handleStartClass} onCancel={handleCancelClass} onDelete={deleteLiveClass} />
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} title="No Upcoming Classes" description="Your pedagogical calendar is currently clear for the coming days." />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          {finished.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80">
              {finished.map((session) => (
                <ClassCard key={session.id} session={session} isTeacher={isTeacher} onStart={handleStartClass} onCancel={handleCancelClass} onDelete={deleteLiveClass} />
              ))}
            </div>
          ) : (
            <EmptyState icon={History} title="Empty Registry" description="No previous or cancelled sessions recorded in the node registry." />
          )}
        </TabsContent>
      </Tabs>

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

function ClassCard({ session, isTeacher, onStart, onCancel, onDelete }: any) {
  const status = session.derivedStatus;
  
  return (
    <Card className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] bg-white flex flex-col">
      <div className="aspect-video relative overflow-hidden bg-slate-900">
        <img 
          src={`https://picsum.photos/seed/${session.id}/800/450`} 
          className={cn("w-full h-full object-cover transition-transform duration-700 group-hover:scale-110", status === 'live' ? "opacity-60" : "opacity-40 grayscale")}
          alt={session.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4">
          {status === 'live' ? (
            <Badge className="bg-red-600 text-white border-none gap-1.5 px-3 h-7 font-black animate-pulse">
              <Radio className="w-3.5 h-3.5" /> LIVE NOW
            </Badge>
          ) : status === 'upcoming' ? (
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-primary border-none gap-1.5 px-3 h-7 font-black">
              <Calendar className="w-3.5 h-3.5 text-primary/40" /> UPCOMING
            </Badge>
          ) : status === 'cancelled' ? (
            <Badge className="bg-red-100 text-red-700 border-none gap-1.5 px-3 h-7 font-black uppercase">
              <Ban className="w-3.5 h-3.5" /> CANCELLED
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-slate-800/80 backdrop-blur-md text-white/40 border-none px-3 h-7 font-black">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> COMPLETED
            </Badge>
          )}
        </div>

        {status !== 'ended' && status !== 'cancelled' && (
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
        <CardTitle className="text-xl font-black text-primary leading-tight line-clamp-1">{session.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2 font-bold uppercase text-[10px]">
          <User className="w-3 h-3 text-secondary" /> {session.teacherName}
        </CardDescription>
      </CardHeader>

      <CardFooter className="p-6 mt-auto flex flex-col gap-3">
        {status === 'live' ? (
          <Button 
            className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg transition-all active:scale-95 bg-primary text-white"
            onClick={() => onStart(session.id)}
          >
            <Play className="w-4 h-4 fill-current text-secondary" /> {isTeacher ? "Attend Class" : "Join Session"}
          </Button>
        ) : status === 'upcoming' ? (
          <div className="space-y-3 w-full">
            <Button variant="secondary" className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-accent text-primary cursor-default">
              Waiting for Node...
            </Button>
            {isTeacher && (
              <Button variant="ghost" size="sm" className="w-full text-red-500 hover:bg-red-50 text-[9px] font-black uppercase" onClick={() => onCancel(session.id)}>
                <Ban className="w-3 h-3 mr-2" /> Cancel Session
              </Button>
            )}
          </div>
        ) : (
          <Button variant="outline" className="w-full h-12 rounded-2xl font-bold text-[10px] uppercase opacity-50 cursor-not-allowed">
            Archived
          </Button>
        )}
        
        {isTeacher && (
          <Button variant="ghost" size="sm" className="text-destructive/20 hover:text-destructive hover:bg-red-50 text-[9px] font-black uppercase tracking-widest h-8 rounded-xl" onClick={() => onDelete(session.id)}>
            <Trash2 className="w-3 h-3 mr-2" /> Delete Record
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, description }: any) {
  return (
    <Card className="border-2 border-dashed border-primary/10 rounded-[3rem] bg-primary/[0.02] flex flex-col items-center justify-center text-center p-20 space-y-6">
      <div className="p-6 bg-white rounded-full shadow-sm">
        <Icon className="w-12 h-12 text-primary/10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-primary uppercase">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto font-medium">{description}</p>
      </div>
    </Card>
  );
}
