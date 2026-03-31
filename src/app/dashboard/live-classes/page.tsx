
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  ArrowRight, 
  XCircle, 
  CheckCircle2, 
  MoreVertical, 
  Play, 
  Info,
  Loader2,
  BookOpen,
  User,
  ShieldCheck,
  Smartphone,
  Search,
  ArrowLeft,
  X,
  Pencil,
  Save,
  Radio,
  Timer,
  AlertCircle
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

// --- MOCK DATA ---
const INITIAL_CLASSES = [
  { id: "LC-001", title: "Quantum Mechanics: The Basics", subject: "Advanced Physics", teacher: "Dr. Aris Tesla", startTime: new Date().toISOString(), duration: "60", status: "live", students: 42, avatar: "https://picsum.photos/seed/t1/100/100" },
  { id: "LC-002", title: "Organic Chemistry Revision", subject: "General Chemistry", teacher: "Dr. White", startTime: new Date(Date.now() + 86400000).toISOString(), duration: "45", status: "upcoming", students: 38, avatar: "https://picsum.photos/seed/t5/100/100" },
  { id: "LC-003", title: "Calculus II: Integration", subject: "Mathematics", teacher: "Prof. Sarah Smith", startTime: new Date(Date.now() - 172800000).toISOString(), duration: "90", status: "completed", students: 45, avatar: "https://picsum.photos/seed/t2/100/100" },
  { id: "LC-004", title: "Modern Poetry Workshop", subject: "English Literature", teacher: "Ms. Bennet", startTime: new Date(Date.now() + 172800000).toISOString(), duration: "60", status: "cancelled", students: 0, avatar: "https://picsum.photos/seed/t3/100/100" },
];

export default function OnlineClassesPage() {
  const { user } = useAuth();
  const { language, t } = useI18n();
  const { toast } = useToast();
  const router = useRouter();

  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [isScheduling, setIsScheduling] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [cancellingClass, setCancellingClass] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingDetails, setViewingDetails] = useState<any>(null);
  
  const [newClass, setNewClass] = useState({
    title: "",
    subject: "Advanced Physics",
    date: "",
    time: "",
    duration: "60"
  });

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const handleSchedule = () => {
    if (!newClass.title || !newClass.date) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created = {
        id: `LC-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        title: newClass.title,
        subject: newClass.subject,
        teacher: user?.name || "Official Instructor",
        startTime: new Date(`${newClass.date}T${newClass.time || "08:00"}`).toISOString(),
        duration: newClass.duration,
        status: "upcoming",
        students: 0,
        avatar: user?.avatar || ""
      };
      setClasses([created, ...classes]);
      setIsProcessing(false);
      setIsScheduling(false);
      setNewClass({ title: "", subject: "Advanced Physics", date: "", time: "", duration: "60" });
      toast({ title: "Class Scheduled", description: "The session has been broadcasted to the student registry." });
    }, 1200);
  };

  const handleSaveEdit = () => {
    if (!editingClass || !editingClass.title) return;
    setIsProcessing(true);
    setTimeout(() => {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? editingClass : c));
      setIsProcessing(false);
      setEditingClass(null);
      toast({ title: "Session Updated", description: "Node registry has been synchronized." });
    }, 1000);
  };

  const handleConfirmCancel = () => {
    if (!cancellingClass || !cancelReason.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setClasses(prev => prev.map(c => c.id === cancellingClass.id ? { ...c, status: 'cancelled', cancelReason } : c));
      setIsProcessing(false);
      setCancellingClass(null);
      setCancelReason("");
      toast({ variant: "destructive", title: "Session Canceled", description: "Cancellation reason has been recorded." });
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live': return <Badge className="bg-red-600 text-white animate-pulse border-none font-black text-[9px] px-3">LIVE</Badge>;
      case 'upcoming': return <Badge className="bg-blue-100 text-blue-700 border-none font-black text-[9px] px-3">UPCOMING</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-700 border-none font-black text-[9px] px-3">COMPLETED</Badge>;
      case 'cancelled': return <Badge className="bg-slate-100 text-slate-700 border-none font-black text-[9px] px-3">CANCELED</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full shadow-sm hover:bg-white shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3 tracking-tighter uppercase">
              <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
                <Video className="w-6 h-6 text-secondary" />
              </div>
              {language === 'en' ? 'Virtual Classroom' : 'Classes Virtuelles'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">High-fidelity synchronous learning via the institutional node.</p>
          </div>
        </div>
        
        {isTeacher && (
          <Button className="h-12 px-8 rounded-2xl shadow-xl font-black uppercase text-[10px] gap-2" onClick={() => setIsScheduling(true)}>
            <Plus className="w-4 h-4" /> Schedule Live Session
          </Button>
        )}
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[800px] mb-10 bg-white shadow-sm border h-auto p-1.5 rounded-[2rem]">
          <TabsTrigger value="live" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all"><Radio className="w-4 h-4 text-red-500" /> Live Now</TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all"><Calendar className="w-4 h-4" /> Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all"><CheckCircle2 className="w-4 h-4" /> History</TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2 py-3 rounded-[1.5rem] font-bold transition-all"><XCircle className="w-4 h-4" /> Canceled</TabsTrigger>
        </TabsList>

        {["live", "upcoming", "completed", "cancelled"].map((status) => (
          <TabsContent key={status} value={status} className="mt-0 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.filter(c => c.status === status).map((session) => (
                <Card key={session.id} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white group hover:shadow-2xl transition-all duration-500 flex flex-col">
                  <div className={cn(
                    "h-2 w-full",
                    status === 'live' ? "bg-red-600" : status === 'upcoming' ? "bg-primary" : status === 'completed' ? "bg-green-500" : "bg-slate-300"
                  )} />
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/10 text-primary bg-primary/5">
                        {session.subject}
                      </Badge>
                      {getStatusBadge(session.status)}
                    </div>
                    <CardTitle className="text-2xl font-black text-primary leading-tight line-clamp-2 uppercase tracking-tighter">
                      {session.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 pt-4">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-1 ring-accent">
                        <AvatarImage src={session.avatar} />
                        <AvatarFallback>{session.teacher.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">Lead Instructor</p>
                        <p className="text-sm font-bold text-primary">{session.teacher}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 space-y-6 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-accent/30 p-3 rounded-2xl border border-accent space-y-1">
                        <p className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3"/> Start Time</p>
                        <p className="text-xs font-black text-primary truncate">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="bg-accent/30 p-3 rounded-2xl border border-accent space-y-1">
                        <p className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5"><Timer className="w-3 h-3"/> Duration</p>
                        <p className="text-xs font-black text-primary">{session.duration} mins</p>
                      </div>
                    </div>
                    
                    {status === 'live' && (
                      <div className="flex items-center justify-center gap-2 p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">{session.students} Joined Now</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-accent/10 p-6 border-t flex gap-2">
                    {status === 'live' ? (
                      <Button asChild className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs gap-3 shadow-xl transition-all active:scale-95">
                        <Link href={`/dashboard/live-classes/${session.id}`}>
                          {isTeacher ? "Resume Broadcast" : "Enter Classroom"}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="flex-1 h-12 rounded-xl font-bold bg-white text-primary border-primary/10 hover:bg-primary/5 text-xs"
                          onClick={() => setViewingDetails(session)}
                        >
                          <Info className="w-4 h-4 mr-2" /> Details
                        </Button>
                        {isTeacher && status === 'upcoming' && (
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-12 w-12 text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                              onClick={() => setEditingClass({...session})}
                            >
                              <Pencil className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-12 w-12 text-destructive/40 hover:text-destructive hover:bg-red-50 rounded-xl transition-all"
                              onClick={() => setCancellingClass(session)}
                            >
                              <XCircle className="w-5 h-5" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
              
              {classes.filter(c => c.status === status).length === 0 && (
                <div className="col-span-full py-24 text-center border-2 border-dashed rounded-[3rem] bg-white/50 space-y-4">
                  <Video className="w-16 h-16 text-primary/10 mx-auto" />
                  <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">No {status} sessions found in the registry.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* SCHEDULE DIALOG */}
      <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                <Video className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase">Schedule Broadcast</DialogTitle>
                <DialogDescription className="text-white/60">Initialize a new synchronous pedagogical node.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsScheduling(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Class Title</Label>
              <Input 
                value={newClass.title} 
                onChange={(e) => setNewClass({...newClass, title: e.target.value})} 
                className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
                placeholder="e.g. Introduction to Thermodynamics" 
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Subject Registry</Label>
                <Select value={newClass.subject} onValueChange={(v) => setNewClass({...newClass, subject: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advanced Physics">Advanced Physics</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="General Chemistry">General Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Duration (Mins)</Label>
                <Select value={newClass.duration} onValueChange={(v) => setNewClass({...newClass, duration: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">60 Minutes</SelectItem>
                    <SelectItem value="90">90 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Session Date</Label>
                <Input type="date" className="h-12 bg-accent/30 border-none rounded-xl" onChange={(e) => setNewClass({...newClass, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Start Time</Label>
                <Input type="time" className="h-12 bg-accent/30 border-none rounded-xl" onChange={(e) => setNewClass({...newClass, time: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={handleSchedule} disabled={isProcessing || !newClass.title || !newClass.date} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 text-secondary" />}
              Finalize Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                <Pencil className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase">Edit Live Session</DialogTitle>
                <DialogDescription className="text-white/60">Update pedagogical details for this node.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditingClass(null)} className="absolute top-4 right-4 text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Class Title</Label>
              <Input 
                value={editingClass?.title} 
                onChange={(e) => setEditingClass({...editingClass, title: e.target.value})} 
                className="h-12 bg-accent/30 border-none rounded-xl font-bold text-primary" 
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Subject Registry</Label>
                <Select value={editingClass?.subject} onValueChange={(v) => setEditingClass({...editingClass, subject: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advanced Physics">Advanced Physics</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="General Chemistry">General Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Duration (Mins)</Label>
                <Select value={editingClass?.duration} onValueChange={(v) => setEditingClass({...editingClass, duration: v})}>
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
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={handleSaveEdit} disabled={isProcessing || !editingClass?.title} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Node Updates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CANCELLATION DIALOG */}
      <Dialog open={!!cancellingClass} onOpenChange={() => setCancellingClass(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-destructive p-8 text-white relative shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-white">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase">Terminate Session</DialogTitle>
                <DialogDescription className="text-white/60">Formal cancellation record required.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setCancellingClass(null)} className="absolute top-4 right-4 text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-800 font-medium leading-relaxed">
                  Canceling a scheduled class will notify all registered students via their dashboards. This action is irreversible.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reason for Cancellation</Label>
                <Textarea 
                  placeholder="e.g. Technical difficulty, Institutional holiday..." 
                  className="min-h-[120px] bg-accent/30 border-none rounded-2xl p-4 focus-visible:ring-destructive font-medium"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button 
              variant="destructive"
              className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3" 
              onClick={handleConfirmCancel} 
              disabled={isProcessing || !cancelReason.trim()}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
              Decommission Node Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DETAILS DIALOG */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl text-secondary">
                <Info className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase">Session Brief</DialogTitle>
                <DialogDescription className="text-white/60">Registry details for node {viewingDetails?.id}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setViewingDetails(null)} className="absolute top-4 right-4 text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-8 bg-white">
            <div className="space-y-4">
               <h3 className="text-2xl font-black text-primary uppercase leading-tight">{viewingDetails?.title}</h3>
               <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase">{viewingDetails?.subject}</Badge>
                  <Badge variant="outline" className="border-primary/10 text-primary font-black uppercase text-[9px]">{viewingDetails?.status}</Badge>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Instructor</p>
                  <p className="font-bold text-primary">{viewingDetails?.teacher}</p>
               </div>
               <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Scheduled For</p>
                  <p className="font-bold text-primary">{new Date(viewingDetails?.startTime || "").toLocaleDateString()}</p>
               </div>
            </div>

            <div className="p-6 bg-accent/20 rounded-[2rem] border border-accent flex flex-col items-center gap-4 text-center">
               <div className="p-4 bg-white rounded-full shadow-inner"><Calendar className="w-8 h-8 text-primary/40" /></div>
               <p className="text-xs text-muted-foreground leading-relaxed italic">
                 "Prepare materials and ensure audio-visual synchronization 10 minutes before the scheduled start time."
               </p>
            </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t border-accent">
            <Button onClick={() => setViewingDetails(null)} className="w-full h-12 rounded-xl font-bold uppercase text-xs">Close Dossier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
