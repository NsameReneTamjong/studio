
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
  Smartphone,
  ShieldCheck,
  Settings2,
  Maximize2,
  Hand,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export default function LiveClassRoomPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "Dr. Aris Tesla", role: "TEACHER", text: "Welcome everyone! Let's get started with Quantum Mechanics.", time: "10:00 AM", isSelf: false },
    { id: "2", sender: "Alice Thompson", role: "STUDENT", text: "Ready for the session!", time: "10:01 AM", isSelf: false },
  ]);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.name || "You",
      role: user?.role || "USER",
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };
    setMessages([...messages, msg]);
    setChatMessage("");
  };

  const handleLeave = () => {
    toast({ title: "Session Terminated", description: "You have left the virtual node." });
    router.push("/dashboard/live-classes");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden text-slate-200 font-body">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="p-2 bg-primary rounded-xl shrink-0">
            <VideoIcon className="w-5 h-5 text-secondary" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-black text-white uppercase tracking-tighter truncate text-sm md:text-base">Quantum Mechanics: The Basics</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Node Registry • LIC-2024
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden md:flex border-white/10 text-white/60 font-mono text-[10px]">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Badge>
          <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
          <Button variant="destructive" size="sm" className="h-10 rounded-xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl" onClick={handleLeave}>
            <LogOut className="w-4 h-4" /> Exit Node
          </Button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* VIEWPORT AREA */}
        <div className="flex-1 relative flex flex-col p-4 md:p-6 gap-4 overflow-hidden bg-black/40">
          <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
            {/* MAIN VIDEO / SCREEN FEED */}
            {isSharing ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-10 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
                  <Monitor className="w-32 h-32 text-secondary relative" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white">Presenting Interface</h3>
                  <p className="text-slate-400 font-medium">Your screen is currently being broadcasted to all participants.</p>
                </div>
                <Button className="rounded-xl h-12 px-10 bg-white text-slate-900 hover:bg-slate-100 font-bold" onClick={() => setIsSharing(false)}>
                  Stop Presentation
                </Button>
              </div>
            ) : (
              <div className="w-full h-full bg-slate-800 relative group">
                <img 
                  src="https://picsum.photos/seed/physics-lecture/1920/1080" 
                  alt="Lecture" 
                  className="w-full h-full object-cover opacity-60" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* TEACHER OVERLAY */}
                <div className="absolute bottom-10 left-10 flex items-center gap-6">
                   <div className="w-24 h-24 rounded-[2rem] border-4 border-white/20 shadow-2xl overflow-hidden ring-4 ring-primary/20">
                      <img src="https://picsum.photos/seed/t1/200/200" alt="Tesla" className="w-full h-full object-cover" />
                   </div>
                   <div className="space-y-1">
                      <Badge className="bg-secondary text-primary border-none font-black uppercase text-[10px]">Active Instructor</Badge>
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight">Dr. Aris Tesla</h4>
                      <p className="text-xs text-white/60 font-bold uppercase tracking-[0.2em]">Department of Physics</p>
                   </div>
                </div>

                <div className="absolute top-10 right-10 flex flex-col gap-3">
                   <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-white font-black text-[10px] h-8 px-4">
                     <Users className="w-3.5 h-3.5 mr-2" /> 42 STUDENTS
                   </Badge>
                   <Badge className="bg-red-600 text-white border-none font-black text-[10px] h-8 px-4 animate-pulse">
                     RECORDING NODE
                   </Badge>
                </div>
              </div>
            )}
          </div>

          {/* SELF VIEW (THUMBNAIL) */}
          <div className="absolute bottom-10 right-10 w-48 aspect-video rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 group">
            {!isCamOff ? (
              <img src={user?.avatar} alt="Me" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800">
                <Avatar className="h-12 w-12 border-2 border-white/10"><AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback></Avatar>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-black uppercase text-white">YOU (PREVIEW)</div>
          </div>
        </div>

        {/* SIDEBAR AREA (CHAT / PARTICIPANTS) */}
        <aside className="w-[380px] border-l border-white/10 bg-slate-900/80 backdrop-blur-xl hidden lg:flex flex-col">
          <div className="p-4 flex gap-2">
            <Button 
              variant={activeTab === 'chat' ? 'secondary' : 'ghost'} 
              className={cn("flex-1 rounded-xl font-bold uppercase text-[10px] h-10", activeTab === 'chat' ? "bg-white text-slate-900" : "text-slate-400")}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Live Chat
            </Button>
            <Button 
              variant={activeTab === 'participants' ? 'secondary' : 'ghost'} 
              className={cn("flex-1 rounded-xl font-bold uppercase text-[10px] h-10", activeTab === 'participants' ? "bg-white text-slate-900" : "text-slate-400")}
              onClick={() => setActiveTab('participants')}
            >
              <Users className="w-4 h-4 mr-2" /> Node Feed
            </Button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'chat' ? (
              <>
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-6 py-6">
                    {messages.map((msg) => (
                      <div key={msg.id} className={cn("flex flex-col gap-1.5", msg.isSelf ? "items-end" : "items-start")}>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{msg.sender}</span>
                          <span className="text-[8px] text-slate-500 font-mono">{msg.time}</span>
                        </div>
                        <div className={cn(
                          "p-3 rounded-2xl text-xs leading-relaxed max-w-[90%]",
                          msg.isSelf ? "bg-primary text-white rounded-tr-none" : "bg-white/5 text-slate-200 rounded-tl-none border border-white/5"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-6 border-t border-white/5 bg-black/20">
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Type pedagogical query..." 
                      className="bg-white/5 border-white/10 h-12 rounded-xl text-xs text-white focus-visible:ring-secondary" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button size="icon" className="h-12 w-12 rounded-xl bg-primary text-white shrink-0" onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 py-6">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] mb-6">Verified Node Registry</p>
                  {[
                    { name: "Dr. Aris Tesla", role: "TEACHER", active: true },
                    { name: "Alice Thompson", role: "STUDENT", active: true },
                    { name: "Bob Richards", role: "STUDENT", active: true },
                    { name: "Charlie Davis", role: "STUDENT", active: true },
                    { name: "Diana Prince", role: "STUDENT", active: true },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarFallback className="text-[10px] font-bold">{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-slate-200 uppercase leading-none mb-1">{p.name}</p>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{p.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </aside>
      </div>

      {/* 3. CONTROL DOCK */}
      <footer className="h-24 border-t border-white/10 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center gap-4 px-6 shrink-0 relative z-20">
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant={isMuted ? "destructive" : "secondary"} 
            size="icon" 
            className={cn("h-12 w-12 md:h-14 md:w-14 rounded-2xl shadow-xl transition-all", !isMuted && "bg-white/10 hover:bg-white/20 text-white")}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
          </Button>
          <Button 
            variant={isCamOff ? "destructive" : "secondary"} 
            size="icon" 
            className={cn("h-12 w-12 md:h-14 md:w-14 rounded-2xl shadow-xl transition-all", !isCamOff && "bg-white/10 hover:bg-white/20 text-white")}
            onClick={() => setIsCamOff(!isCamOff)}
          >
            {isCamOff ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <VideoIcon className="w-5 h-5 md:w-6 md:h-6" />}
          </Button>
        </div>

        <div className="h-10 w-px bg-white/10 mx-2 md:mx-4" />

        <div className="flex items-center gap-2 md:gap-4">
          {isTeacher && (
            <Button 
              variant={isSharing ? "secondary" : "ghost"} 
              className={cn("h-12 md:h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 px-6 shadow-xl border border-white/5", isSharing ? "bg-secondary text-primary hover:bg-secondary/90" : "text-white hover:bg-white/10")}
              onClick={() => setIsSharing(!isSharing)}
            >
              <Monitor className="w-5 h-5" /> <span className="hidden md:block">Present Screen</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-12 w-12 md:h-14 md:w-14 rounded-2xl text-white hover:bg-white/10 shadow-xl border border-white/5">
            <Hand className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 md:h-14 md:w-14 rounded-2xl text-white hover:bg-white/10 shadow-xl border border-white/5">
            <MoreHorizontal className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>

        <div className="absolute right-10 hidden xl:flex items-center gap-4">
           <div className="text-right">
              <p className="text-[9px] font-black uppercase text-secondary tracking-widest">Signal Integrity</p>
              <p className="text-xs font-bold text-white">Encrypted Node</p>
           </div>
           <ShieldCheck className="w-8 h-8 text-secondary/40" />
        </div>
      </footer>
    </div>
  );
}
