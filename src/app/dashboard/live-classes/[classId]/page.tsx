
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageCircle, 
  Users, 
  LogOut, 
  Send,
  Monitor,
  MoreVertical,
  ShieldCheck,
  Radio,
  User,
  AlertCircle,
  X,
  Smartphone,
  Info,
  Settings2,
  Lock,
  Zap,
  Layout
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

const MOCK_PARTICIPANTS = [
  { name: "Alice Thompson", role: "STUDENT", avatar: "https://picsum.photos/seed/s1/100/100", active: true },
  { name: "Bob Richards", role: "STUDENT", avatar: "https://picsum.photos/seed/s2/100/100", active: true },
  { name: "Charlie Davis", role: "STUDENT", avatar: "https://picsum.photos/seed/s3/100/100", active: true },
  { name: "Diana Prince", role: "STUDENT", avatar: "https://picsum.photos/seed/s4/100/100", active: true },
];

export default function LiveClassRoomPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "System", text: "End-to-end encryption active. Virtual room secured.", timestamp: "10:30 AM", isMe: false },
    { id: "2", sender: "Alice Thompson", text: "Hello Teacher, audio is clear from my end!", timestamp: "10:31 AM", isMe: false },
  ]);

  const isTeacher = user?.role === "TEACHER";

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Hardware Access Denied",
          description: "Please enable camera and microphone permissions in your browser settings to proceed.",
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: user?.name || "Me",
      text: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages([...messages, newMsg]);
    setChatMessage("");
  };

  const handleLeaveClass = () => {
    router.push("/dashboard/live-classes");
    toast({ title: "Session Closed", description: "The pedagogical record has been finalized." });
  };

  const toggleCamera = () => {
    if (videoRef.current?.srcObject) {
      const videoTrack = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCamOn;
        setIsCamOn(!isCamOn);
      }
    }
  };

  const toggleMic = () => {
    if (videoRef.current?.srcObject) {
      const audioTrack = (videoRef.current.srcObject as MediaStream).getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-body">
      {/* 1. COMPACT ROOM HEADER */}
      <header className="h-16 px-6 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] animate-pulse flex items-center gap-2 shadow-lg shadow-red-600/20">
            <Radio className="w-3 h-3" /> LIVE BROADCAST
          </div>
          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
          <div>
            <h1 className="font-black text-sm uppercase tracking-tighter text-white/90">Advanced Physics - Form 5A</h1>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Pedagogical Node: {params.classId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-2xl border border-white/10">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest">{MOCK_PARTICIPANTS.length + 1} Authorized</span>
          </div>
          <Button variant="destructive" size="sm" className="h-10 px-6 rounded-2xl gap-2 font-black uppercase text-[10px] tracking-widest shadow-xl" onClick={handleLeaveClass}>
            <LogOut className="w-4 h-4" /> {isTeacher ? "End Session" : "Exit Room"}
          </Button>
        </div>
      </header>

      {/* 2. DUAL-PANE STAGE AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* MAIN VIDEO STAGE */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-hidden relative">
          <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
            
            {/* BROADCASTER FEED */}
            <video 
              ref={videoRef} 
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                !isCamOn && "opacity-0"
              )} 
              autoPlay 
              muted 
            />
            
            {/* NO-VIDEO STATE */}
            {(!isCamOn || !hasCameraPermission) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                  <Avatar className="h-40 w-40 border-4 border-white/10 shadow-2xl relative z-10">
                    <AvatarImage src="https://picsum.photos/seed/t1/200/200" />
                    <AvatarFallback className="text-5xl font-black bg-slate-800 text-white/20">T</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center mt-8 space-y-2 relative z-10">
                  <p className="text-2xl font-black uppercase tracking-tighter text-white/90">
                    {isTeacher ? user?.name : "Dr. Aris Tesla"}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60">
                    {isCamOn ? "Syncing Device..." : "Camera Paused by Host"}
                  </p>
                </div>
              </div>
            )}

            {/* OVERLAYS */}
            <div className="absolute top-8 left-8 flex flex-col gap-3">
               <Badge className="bg-black/40 backdrop-blur-md border-white/10 text-white font-black text-[9px] px-4 py-1.5 uppercase tracking-widest w-fit">
                 {isTeacher ? "MASTER CONTROL" : "SECURE RECEPTION"}
               </Badge>
               {isSharing && (
                 <Badge className="bg-secondary text-primary border-none font-black text-[9px] px-4 py-1.5 uppercase tracking-widest w-fit animate-in slide-in-from-left-4">
                   SCREEN SHARING ACTIVE
                 </Badge>
               )}
            </div>

            {/* MY MINI PREVIEW (For Students) */}
            {!isTeacher && (
              <div className="absolute bottom-8 right-8 w-56 aspect-video rounded-[1.5rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-800 backdrop-blur-xl transition-transform hover:scale-105">
                 <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <User className="w-8 h-8 text-white/10" />
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Your Identity (Incognito)</p>
                 </div>
                 <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                    <span className="text-[8px] font-black uppercase text-white/60">Local Sync</span>
                 </div>
              </div>
            )}
          </div>

          {/* 3. CENTERED CONTROLS BAR */}
          <div className="h-24 bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] flex items-center justify-center gap-6 px-10 shrink-0 shadow-2xl relative z-20">
            <Button 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-[1.5rem] shadow-2xl transition-all active:scale-90",
                isMicOn ? "bg-white text-slate-950 hover:bg-white/90" : "bg-red-600 text-white hover:bg-red-700"
              )}
              onClick={toggleMic}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>
            
            <Button 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-[1.5rem] shadow-2xl transition-all active:scale-90",
                isCamOn ? "bg-white text-slate-950 hover:bg-white/90" : "bg-red-600 text-white hover:bg-red-700"
              )}
              onClick={toggleCamera}
            >
              {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
            
            <div className="w-px h-10 bg-white/10 mx-2" />
            
            <Button 
              size="icon" 
              variant="ghost" 
              className={cn(
                "h-14 w-14 rounded-[1.5rem] text-white transition-all active:scale-90",
                isSharing ? "bg-secondary text-primary" : "hover:bg-white/10"
              )}
              onClick={() => setIsSharing(!isSharing)}
            >
              <Monitor className="w-6 h-6" />
            </Button>
            
            <Button size="icon" variant="ghost" className="h-14 w-14 rounded-[1.5rem] text-white hover:bg-white/10 transition-all active:scale-90">
              <Settings2 className="w-6 h-6" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-4 bg-black/20 px-6 py-3 rounded-2xl border border-white/5 ml-4">
               <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Network</p>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1 h-3 bg-secondary rounded-full" />
                     <div className="w-1 h-4 bg-secondary rounded-full" />
                     <div className="w-1 h-2 bg-secondary rounded-full" />
                     <span className="text-[10px] font-black text-secondary ml-1">STABLE</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 4. INTERACTIVE SIDEBAR */}
        <aside className="hidden lg:flex w-[400px] bg-slate-950 border-l border-white/5 flex-col shrink-0">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="bg-slate-900/50 border-b border-white/5 rounded-none h-16 shrink-0 px-6 gap-8">
              <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:text-secondary rounded-none border-b-2 border-transparent data-[state=active]:border-secondary h-full text-[10px] font-black uppercase tracking-[0.2em] gap-2 transition-all">
                <MessageCircle className="w-4 h-4" /> DISCUSSION
              </TabsTrigger>
              <TabsTrigger value="students" className="data-[state=active]:bg-transparent data-[state=active]:text-secondary rounded-none border-b-2 border-transparent data-[state=active]:border-secondary h-full text-[10px] font-black uppercase tracking-[0.2em] gap-2 transition-all">
                <Users className="w-4 h-4" /> PARTICIPANTS
              </TabsTrigger>
            </TabsList>

            {/* CHAT INTERFACE */}
            <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 mt-0">
              <ScrollArea className="flex-1 p-8">
                <div className="space-y-8">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn(
                      "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2",
                      msg.isMe ? "items-end" : "items-start"
                    )}>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{msg.sender}</span>
                        <span className="text-[8px] text-white/10 font-bold">{msg.timestamp}</span>
                      </div>
                      <div className={cn(
                        "p-4 rounded-[1.25rem] text-sm max-w-[85%] leading-relaxed",
                        msg.isMe 
                          ? "bg-primary text-white rounded-tr-none shadow-xl border border-white/5" 
                          : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              <div className="p-6 bg-slate-900/30 border-t border-white/5">
                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/5">
                  <Input 
                    placeholder="Contribute to discussion..." 
                    className="bg-transparent border-none h-12 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-0 px-4 text-sm"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="icon" className="h-11 w-11 rounded-xl bg-secondary text-primary hover:bg-secondary/90 shrink-0 shadow-lg active:scale-90" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* PARTICIPANTS LIST */}
            <TabsContent value="students" className="flex-1 overflow-y-auto p-8 mt-0 bg-slate-950">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Session Registry</h3>
                   <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">{MOCK_PARTICIPANTS.length + 1} Total</Badge>
                </div>
                
                {/* Host Entry */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-primary shadow-lg">
                      <AvatarImage src="https://picsum.photos/seed/t1/100/100" />
                      <AvatarFallback>T</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">Dr. Aris Tesla</p>
                      <p className="text-[8px] font-black text-secondary uppercase tracking-widest">HOST / INSTRUCTOR</p>
                    </div>
                  </div>
                  <Mic className="w-3 h-3 text-secondary" />
                </div>

                {/* Student Entries */}
                {MOCK_PARTICIPANTS.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-white/10 grayscale group-hover:grayscale-0 transition-all">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-bold text-white/80">{p.name}</p>
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">{p.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-lg shadow-green-500/20" />
                       {isTeacher && <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-red-500"><MicOff className="w-3.5 h-3.5"/></Button>}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* SIDEBAR FOOTER */}
          <div className="p-8 border-t border-white/5 bg-slate-900/50">
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-secondary" />
                   <p className="text-[9px] font-black text-white/40 leading-relaxed uppercase tracking-widest">
                     Session archiving active. Automated presence logs synced to node registry.
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-black/20 p-2 rounded-xl border border-white/5 text-center">
                      <p className="text-[7px] font-black text-white/20 uppercase">Latency</p>
                      <p className="text-[10px] font-mono text-secondary">24ms</p>
                   </div>
                   <div className="bg-black/20 p-2 rounded-xl border border-white/5 text-center">
                      <p className="text-[7px] font-black text-white/20 uppercase">Resolution</p>
                      <p className="text-[10px] font-mono text-secondary">1080p</p>
                   </div>
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Tabs({ children, defaultValue, className }: { children: React.ReactNode, defaultValue: string, className?: string }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { active, setActive });
        }
        return child;
      })}
    </div>
  );
}

function TabsList({ children, className, active, setActive }: any) {
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { active, setActive });
        }
        return child;
      })}
    </div>
  );
}

function TabsTrigger({ children, value, className, active, setActive }: any) {
  return (
    <button 
      onClick={() => setActive(value)}
      className={cn(className)}
      data-state={active === value ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
}

function TabsContent({ children, value, className, active }: any) {
  if (active !== value) return null;
  return <div className={className}>{children}</div>;
}
