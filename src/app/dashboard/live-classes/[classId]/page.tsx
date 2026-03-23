
"use client";

import { useState, useEffect, useRef } from "react";
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
  AlertCircle
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

const MOCK_PARTICIPANTS = [
  { name: "Alice Thompson", role: "STUDENT", avatar: "https://picsum.photos/seed/s1/100/100" },
  { name: "Bob Richards", role: "STUDENT", avatar: "https://picsum.photos/seed/s2/100/100" },
  { name: "Charlie Davis", role: "STUDENT", avatar: "https://picsum.photos/seed/s3/100/100" },
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
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "System", text: "Welcome to the Live Class!", timestamp: "10:30 AM", isMe: false },
    { id: "2", sender: "Alice Thompson", text: "Hello Teacher, I'm ready!", timestamp: "10:31 AM", isMe: false },
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
          title: t("cameraDenied"),
          description: language === 'en' ? 'Please enable camera permissions in your browser settings to use this app.' : 'Veuillez activer les permissions de caméra dans votre navigateur.',
        });
      }
    };

    if (isTeacher) {
      getCameraPermission();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isTeacher, t, language, toast]);

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
    toast({ title: "Session Ended", description: "You have left the virtual room." });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="h-16 px-6 bg-slate-900/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-1">
            <Radio className="w-3 h-3" /> LIVE
          </div>
          <div>
            <h1 className="font-black text-sm uppercase tracking-tighter">Advanced Physics - Form 5A</h1>
            <p className="text-[10px] text-white/40 font-bold">Room ID: {params.classId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-xs font-black">{MOCK_PARTICIPANTS.length + 1} Present</span>
          </div>
          <Button variant="destructive" size="sm" className="h-9 px-4 rounded-xl gap-2 font-bold" onClick={handleLeaveClass}>
            <LogOut className="w-4 h-4" /> {isTeacher ? "End Session" : "Leave"}
          </Button>
        </div>
      </header>

      {/* Main Classroom Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Stage */}
        <div className="flex-1 p-4 md:p-8 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
            {/* Broadcaster Feed */}
            <video 
              ref={videoRef} 
              className={cn(
                "w-full h-full object-cover",
                !isCamOn && "hidden"
              )} 
              autoPlay 
              muted 
            />
            
            {(!isCamOn || !isTeacher) && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <Avatar className="h-32 w-32 border-4 border-primary shadow-2xl">
                  <AvatarImage src="https://picsum.photos/seed/t1/200/200" />
                  <AvatarFallback className="text-4xl bg-slate-800">T</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1/4 text-center space-y-2">
                  <p className="text-xl font-black uppercase tracking-widest">Broadcasting: Dr. Aris Tesla</p>
                  <p className="text-xs text-white/40">Camera is currently paused by host</p>
                </div>
              </div>
            )}

            {isTeacher && !(hasCameraPermission) && (
              <div className="absolute inset-0 flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-sm">
                <Alert variant="destructive" className="max-w-md bg-red-950 border-red-900">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser to start the live broadcast.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Stage Overlays */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
               <Badge className="bg-black/40 backdrop-blur-md border-white/10 text-white font-black text-[9px] px-3 py-1">
                 MASTER BROADCAST
               </Badge>
            </div>

            {/* My Preview (for non-teachers) */}
            {!isTeacher && (
              <div className="absolute bottom-6 right-6 w-48 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800">
                 <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white/20" />
                 </div>
                 <div className="absolute bottom-2 left-2 text-[8px] font-black uppercase bg-black/40 px-1.5 rounded">You (Student)</div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="h-20 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center gap-4 px-8 shrink-0">
            <Button 
              size="icon" 
              className={cn(
                "h-12 w-12 rounded-2xl shadow-xl transition-all",
                isMicOn ? "bg-white text-slate-900 hover:bg-white/90" : "bg-red-600 text-white"
              )}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button 
              size="icon" 
              className={cn(
                "h-12 w-12 rounded-2xl shadow-xl transition-all",
                isCamOn ? "bg-white text-slate-900 hover:bg-white/90" : "bg-red-600 text-white"
              )}
              onClick={() => setIsCamOn(!isCamOn)}
            >
              {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            
            <div className="w-px h-8 bg-white/10 mx-2" />
            
            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl text-white hover:bg-white/10">
              <Monitor className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl text-white hover:bg-white/10">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Sidebar (Chat & Participants) */}
        <aside className="hidden lg:flex w-96 bg-slate-900 border-l border-white/10 flex-col shrink-0">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="bg-transparent border-b border-white/10 rounded-none h-14 shrink-0 px-4 gap-4">
              <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:text-secondary rounded-none border-b-2 border-transparent data-[state=active]:border-secondary h-full text-xs font-black uppercase tracking-widest gap-2">
                <MessageCircle className="w-4 h-4" /> Chat
              </TabsTrigger>
              <TabsTrigger value="students" className="data-[state=active]:bg-transparent data-[state=active]:text-secondary rounded-none border-b-2 border-transparent data-[state=active]:border-secondary h-full text-xs font-black uppercase tracking-widest gap-2">
                <Users className="w-4 h-4" /> Students
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 mt-0">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn(
                      "flex flex-col gap-1",
                      msg.isMe ? "items-end" : "items-start"
                    )}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{msg.sender}</span>
                        <span className="text-[8px] text-white/20 font-bold">{msg.timestamp}</span>
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm max-w-[90%]",
                        msg.isMe ? "bg-secondary text-primary rounded-tr-none" : "bg-white/5 text-white rounded-tl-none border border-white/5"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              <div className="p-6 bg-slate-950/50 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Type to the class..." 
                    className="bg-white/5 border-none h-11 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-secondary"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="icon" className="h-11 w-11 rounded-xl bg-secondary text-primary hover:bg-secondary/90 shrink-0" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students" className="flex-1 overflow-y-auto p-6 mt-0">
              <div className="space-y-4">
                {MOCK_PARTICIPANTS.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-bold">{p.name}</p>
                        <p className="text-[8px] font-black text-white/30 uppercase">{p.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-6 border-t border-white/10 bg-slate-950/50">
             <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase tracking-tighter">
                  End-to-end encrypted session. Activity is being archived for institutional records.
                </p>
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
