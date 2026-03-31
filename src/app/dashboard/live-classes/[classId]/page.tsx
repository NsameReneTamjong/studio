
"use client";

import { useState, useEffect } from "react";
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
  Heart
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
  avatar: string;
}

export default function LiveClassRoomPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "Jessica", role: "STUDENT", text: "Can you explain how you find the vertex?", time: "10:05 AM", isSelf: false, avatar: "https://picsum.photos/seed/s3/100/100" },
    { id: "2", sender: "Ryan", role: "STUDENT", text: "What happens when x = 2?", time: "10:07 AM", isSelf: false, avatar: "https://picsum.photos/seed/s5/100/100" },
  ]);

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

  const participants = [
    { name: "Lisa", id: "GBHS26S001", avatar: "https://picsum.photos/seed/lisa/100/100" },
    { name: "Carlos", id: "GBHS26S002", avatar: "https://picsum.photos/seed/carlos/100/100" },
    { name: "Carmos", id: "GBHS26S003", avatar: "https://picsum.photos/seed/carmos/100/100" },
    { name: "Julia", id: "GBHS26S004", avatar: "https://picsum.photos/seed/julia/100/100" },
  ];

  const attendees = [
    { name: "Jessica", id: "GBHS26S005", avatar: "https://picsum.photos/seed/s3/100/100" },
    { name: "Ryan", id: "GBHS26S006", avatar: "https://picsum.photos/seed/s5/100/100" },
    { name: "Sophia", id: "GBHS26S007", avatar: "https://picsum.photos/seed/s6/100/100" },
    { name: "David", id: "GBHS26S008", avatar: "https://picsum.photos/seed/s2/100/100" },
  ];

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
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-red-500 fill-red-500/20" />
          <Monitor className="w-4 h-4" />
          <Settings2 className="w-4 h-4" />
          <Mail className="w-4 h-4" />
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
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Live Class : Mathematics</h2>
              <div className="flex gap-1 ml-2">
                <Circle className="w-1.5 h-1.5 fill-white" />
                <Circle className="w-1.5 h-1.5 fill-white opacity-40" />
              </div>
            </div>
            
            <div className="w-full h-full relative">
              <img 
                src="https://picsum.photos/seed/math-teacher/1200/800" 
                alt="Mathematics Lecture" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </Card>

          {/* CHAT & Q&A AREA */}
          <Card className="h-64 bg-[#252841] border-none rounded-2xl overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Chat & Q&A</h3>
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
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 bg-black/20 mt-auto">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 h-12">
                <input 
                  placeholder="Type your message here..." 
                  className="flex-1 bg-transparent border-none outline-none text-xs text-white" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="sm" className="bg-primary text-white font-bold h-8 px-4 rounded-lg" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: PARTICIPANTS */}
        <div className="w-[320px] hidden xl:flex flex-col gap-4 shrink-0">
          {/* ACTIVE SPEAKERS */}
          <div className="grid grid-cols-1 gap-4">
            {[{ name: "Adam", avatar: "https://picsum.photos/seed/adam/200/200" }, { name: "Carlos", avatar: "https://picsum.photos/seed/carlos/200/200" }].map((p, i) => (
              <div key={i} className="aspect-video bg-[#252841] rounded-2xl overflow-hidden relative border border-white/5 group">
                <img src={p.avatar} alt={p.name} className="w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-black uppercase text-white">{p.name}</div>
                <div className="absolute top-2 right-2 p-1.5 bg-secondary text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Mic className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>

          {/* PARTICIPANTS GRID */}
          <Card className="bg-[#252841] border-none rounded-2xl overflow-hidden flex flex-col shadow-xl flex-1">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Participants (24)</h3>
              <LayoutGrid className="w-3 h-3 text-slate-500" />
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
              {participants.map((p) => (
                <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 bg-slate-800">
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover opacity-70" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <p className="text-[8px] font-black uppercase text-white truncate">{p.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ATTENDEES LIST */}
            <div className="mt-auto border-t border-white/5">
              <div className="px-4 py-2 bg-black/20 flex items-center justify-between">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Users className="w-3 h-3" /> Attendees
                </h3>
                <MoreHorizontal className="w-3 h-3 text-slate-500" />
              </div>
              <div className="p-4 space-y-3">
                {attendees.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <Avatar className="h-6 w-6 border border-white/10">
                      <AvatarImage src={a.avatar} />
                      <AvatarFallback className="text-[8px] font-bold">{a.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-200">{a.name}</p>
                    </div>
                  </div>
                ))}
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
            <div className={cn("p-2.5 rounded-xl transition-all", isMuted ? "bg-red-600" : "bg-white/5 group-hover:bg-white/10")}>
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
            <div className={cn("p-2.5 rounded-xl transition-all", isCamOff ? "bg-red-600" : "bg-white/5 group-hover:bg-white/10")}>
              {isCamOff ? <VideoOff className="w-5 h-5 text-white" /> : <VideoIcon className="w-5 h-5 text-white" />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
              1 Video
            </span>
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSharing(!isSharing)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={cn("p-2.5 rounded-xl transition-all", isSharing ? "bg-secondary text-primary" : "bg-green-600 text-white hover:bg-green-700")}>
              <Monitor className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
              Share Screen
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all">
              <div className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-600" />
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
              Record
            </span>
          </button>
        </div>

        <Button 
          variant="destructive" 
          className="h-12 px-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-widest shadow-xl transition-all active:scale-95"
          onClick={handleLeave}
        >
          Leave
        </Button>
      </footer>
    </div>
  );
}
