
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  MessageSquare, 
  Users, 
  LogOut, 
  Send, 
  ShieldCheck, 
  Settings2, 
  MoreHorizontal, 
  Sparkles, 
  Zap, 
  X, 
  Fingerprint,
  CheckCircle2,
  Mail,
  Circle,
  Heart,
  LayoutGrid,
  ListChecks,
  UserCheck,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
  isSelf: boolean;
  avatar: string;
}

// Larger mock participant list to test scrolling
const MOCK_PARTICIPANTS = [
  { name: "Alice Thompson", id: "GBHS26S001", avatar: "https://picsum.photos/seed/s1/100/100" },
  { name: "Bob Richards", id: "GBHS26S002", avatar: "https://picsum.photos/seed/s2/100/100" },
  { name: "Charlie Davis", id: "GBHS26S003", avatar: "https://picsum.photos/seed/s3/100/100" },
  { name: "Diana Prince", id: "GBHS26S004", avatar: "https://picsum.photos/seed/s4/100/100" },
  { name: "Ethan Hunt", id: "GBHS26S005", avatar: "https://picsum.photos/seed/s5/100/100" },
  { name: "Fiona Gallagher", id: "GBHS26S006", avatar: "https://picsum.photos/seed/s6/100/100" },
  { name: "George Miller", id: "GBHS26S007", avatar: "https://picsum.photos/seed/s7/100/100" },
  { name: "Hannah Baker", id: "GBHS26S008", avatar: "https://picsum.photos/seed/s8/100/100" },
  { name: "Ian Wright", id: "GBHS26S009", avatar: "https://picsum.photos/seed/s9/100/100" },
  { name: "Julia Roberts", id: "GBHS26S010", avatar: "https://picsum.photos/seed/s10/100/100" },
  { name: "Kevin Hart", id: "GBHS26S011", avatar: "https://picsum.photos/seed/s11/100/100" },
  { name: "Lisa Kudrow", id: "GBHS26S012", avatar: "https://picsum.photos/seed/s12/100/100" },
];

export default function LiveClassRoomPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isSyncingAttendance, setIsSyncingAttendance] = useState(false);
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>(
    MOCK_PARTICIPANTS.reduce((acc, p) => ({ ...acc, [p.id]: true }), {})
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "Alice", role: "STUDENT", text: "Can you explain how you find the vertex?", time: "10:05 AM", isSelf: false, avatar: "https://picsum.photos/seed/s1/100/100" },
    { id: "2", sender: "Bob", role: "STUDENT", text: "What happens when x = 2?", time: "10:07 AM", isSelf: false, avatar: "https://picsum.photos/seed/s2/100/100" },
  ]);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.name?.split(' ')[0] || "You",
      role: user?.role || "USER",
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      avatar: user?.avatar || ""
    };
    setMessages([...messages, msg]);
    setChatMessage("");
  };

  const handleLeave = () => {
    toast({ title: "Session Terminated", description: "You have left the virtual node." });
    router.push("/dashboard/live-classes");
  };

  const handleCommitAttendance = () => {
    setIsSyncingAttendance(true);
    setTimeout(() => {
      setIsSyncingAttendance(false);
      setIsAttendanceOpen(false);
      toast({ title: "Registry Synchronized", description: "Attendance data has been committed to the institutional node." });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1C2E] flex flex-col overflow-hidden text-slate-200">
      {/* TOP NAVIGATION BAR */}
      <header className="h-14 bg-[#1A1C2E] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-600 text-white border-none rounded-sm px-2 py-0.5 text-[10px] font-black h-5">LIVE</Badge>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Circle className="w-1.5 h-1.5 fill-slate-400" /> ON AIR
            </div>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <h2 className="hidden md:block text-xs font-black uppercase tracking-widest text-slate-400">Mathematics • Quadratic Equations</h2>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          {isTeacher && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-lg bg-white/5 border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase gap-2"
              onClick={() => setIsAttendanceOpen(true)}
            >
              <ListChecks className="w-3.5 h-3.5 text-secondary" />
              Take Attendance
            </Button>
          )}
          <div className="flex items-center gap-3">
            <Monitor className="w-4 h-4" />
            <Settings2 className="w-4 h-4" />
            <Mail className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* LEFT COLUMN: MAIN STAGE & CHAT */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* MAIN VIDEO FEED */}
          <Card className="flex-1 bg-[#252841] border-none rounded-2xl overflow-hidden relative shadow-2xl">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Main Presentation</h2>
            </div>
            
            <div className="w-full h-full relative">
              <img 
                src="https://picsum.photos/seed/math-teacher/1200/800" 
                alt="Mathematics Lecture" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                 <div className="flex -space-x-2">
                    {MOCK_PARTICIPANTS.slice(0, 3).map((p, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-[#252841]">
                        <AvatarImage src={p.avatar} />
                      </Avatar>
                    ))}
                 </div>
                 <span className="text-[10px] font-bold text-white/60">+21 others watching</span>
              </div>
            </div>
          </Card>

          {/* CHAT & Q&A AREA */}
          <Card className="h-64 bg-[#252841] border-none rounded-2xl overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Pedagogical Chat</h3>
              <div className="flex gap-3 text-white/40">
                <Heart className="w-3.5 h-3.5" />
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback className="text-[10px] font-bold">{msg.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-xs">
                        <span className="font-black text-secondary mr-2">{msg.sender}:</span>
                        <span className="text-slate-200">{msg.text}</span>
                      </p>
                      <span className="text-[8px] font-bold opacity-30 uppercase">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 bg-black/20 mt-auto">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 h-12">
                <input 
                  placeholder="Ask a question..." 
                  className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder:text-white/20" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button variant="ghost" size="icon" className="text-secondary hover:bg-white/10" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: PARTICIPANTS (SCROLLABLE) */}
        <div className="w-[320px] hidden xl:flex flex-col gap-4 shrink-0 overflow-hidden">
          {/* ACTIVE SPEAKERS */}
          <div className="space-y-4 shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Zap className="w-3 h-3 text-secondary fill-secondary" /> Active Speakers
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[{ name: "Tesla", role: "Instructor", avatar: "https://picsum.photos/seed/t1/200/200" }, { name: "Alice", role: "Student", avatar: "https://picsum.photos/seed/s1/200/200" }].map((p, i) => (
                <div key={i} className="aspect-video bg-[#252841] rounded-2xl overflow-hidden relative border border-white/5 group">
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-black uppercase text-white flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {p.name}
                  </div>
                  <div className="absolute top-2 right-2 p-1.5 bg-secondary text-primary rounded-lg">
                    <Mic className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PARTICIPANTS GRID (SCROLLABLE) */}
          <Card className="bg-[#252841] border-none rounded-2xl overflow-hidden flex flex-col shadow-xl flex-1">
            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Registry</h3>
                <Badge variant="outline" className="text-[8px] h-4 border-white/10 text-white/40">24 Active</Badge>
              </div>
              <LayoutGrid className="w-3 h-3 text-slate-500" />
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 grid grid-cols-2 gap-3">
                {MOCK_PARTICIPANTS.map((p) => (
                  <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 bg-slate-800 group cursor-pointer hover:border-secondary/40 transition-all">
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-white truncate">{p.name.split(' ')[0]}</p>
                      <p className="text-[7px] font-mono font-bold text-white/40 truncate">{p.id}</p>
                    </div>
                    {!presenceMap[p.id] && (
                      <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
                        <Badge variant="destructive" className="text-[7px] h-4 font-black">ABSENT</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* NODE STATUS FOOTER */}
            <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-500 tracking-widest">
                  <ShieldCheck className="w-3 h-3 text-green-600" />
                  Node Sync Active
               </div>
               <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-green-500" />
                  <span className="text-[8px] font-bold text-slate-500">92ms</span>
               </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CONTROL DOCK */}
      <footer className="h-20 bg-[#1A1C2E] border-t border-white/5 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={cn("p-2.5 rounded-xl transition-all", isMuted ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-white/5 group-hover:bg-white/10")}>
              {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
              {isMuted ? "Muted" : "Unmute"}
            </span>
          </button>

          <button 
            onClick={() => setIsCamOff(!isCamOff)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={cn("p-2.5 rounded-xl transition-all", isCamOff ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-white/5 group-hover:bg-white/10")}>
              {isCamOff ? <VideoOff className="w-5 h-5 text-white" /> : <VideoIcon className="w-5 h-5 text-white" />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
              Camera
            </span>
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSharing(!isSharing)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={cn("p-2.5 rounded-xl transition-all", isSharing ? "bg-secondary text-primary shadow-[0_0_15px_rgba(103,208,228,0.4)]" : "bg-white/5 hover:bg-white/10")}>
              <Monitor className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
              Share
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all">
              <div className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
              Rec
            </span>
          </button>
        </div>

        <Button 
          variant="destructive" 
          className="h-12 px-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-widest shadow-xl transition-all active:scale-95 border-none"
          onClick={handleLeave}
        >
          Leave
        </Button>
      </footer>

      {/* ATTENDANCE DIALOG (TEACHER ONLY) */}
      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-[#1A1C2E] text-slate-200">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                <ListChecks className="w-8 h-8" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tight">Live Attendance Registry</DialogTitle>
                <DialogDescription className="text-white/60">Mark presence for students currently in the virtual node.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsAttendanceOpen(false)} className="absolute top-4 right-4 text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          
          <ScrollArea className="max-h-[50vh] bg-white/5 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_PARTICIPANTS.map((p) => (
                <div 
                  key={p.id} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer",
                    presenceMap[p.id] ? "bg-white/10 border-white/10" : "bg-red-900/20 border-red-900/40"
                  )}
                  onClick={() => setPresenceMap(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarImage src={p.avatar} />
                      <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-white truncate uppercase">{p.name.split(' ')[0]}</p>
                      <p className="text-[8px] font-mono text-white/40 uppercase">{p.id}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                    presenceMap[p.id] ? "bg-green-600" : "bg-red-600"
                  )}>
                    {presenceMap[p.id] ? <UserCheck className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="bg-black/20 p-8 border-t border-white/5">
            <Button 
              className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs gap-3 shadow-xl transition-all"
              onClick={handleCommitAttendance}
              disabled={isSyncingAttendance}
            >
              {isSyncingAttendance ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 text-secondary" />}
              Commit Node Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
