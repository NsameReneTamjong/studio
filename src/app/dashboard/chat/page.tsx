
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Search, 
  User, 
  MessageCircle, 
  MoreVertical, 
  ArrowLeft, 
  Crown, 
  Zap, 
  Monitor, 
  Heart, 
  Sparkles, 
  Lock, 
  ShieldCheck,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const BOARD_CONTACTS = [
  { id: "mock_EDUI26CEO001", name: "EduIgnite CEO", role: "CEO", avatar: "https://picsum.photos/seed/ceo/150/150", lastMsg: "System growth is optimal.", online: true },
  { id: "mock_EDUI26CTO001", name: "Tech Director", role: "CTO", avatar: "https://picsum.photos/seed/cto/150/150", lastMsg: "Node API patched.", online: true },
  { id: "mock_EDUI26COO001", name: "Operations Lead", role: "COO", avatar: "https://picsum.photos/seed/coo/150/150", lastMsg: "New nodes activated.", online: false },
];

const MOCK_SCHOOL_CONTACTS = [
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", avatar: "https://picsum.photos/seed/t1/100/100", lastMsg: "Hello, Alice is doing great!", online: true },
  { id: "A001", name: "Principal Ngono", role: "SCHOOL_ADMIN", avatar: "https://picsum.photos/seed/a1/100/100", lastMsg: "Meeting rescheduled.", online: true },
];

const MOCK_MESSAGES = [
  { id: "M1", senderId: "other", text: "Hello, I wanted to discuss the metrics.", timestamp: "10:30 AM", isOfficial: false },
  { id: "M2", senderId: "me", text: "I have reports ready.", timestamp: "10:32 AM", isOfficial: false },
];

export default function ChatPage() {
  const { user, personalChats } = useAuth();
  const { t, language } = useI18n();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  const isExecutive = ["SUPER_ADMIN", "CEO", "CTO", "COO", "INV", "DESIGNER"].includes(user?.role || "");
  
  const relevantPersonalMessages = useMemo(() => {
    if (!user) return [];
    return personalChats.filter(m => m.receiverId === user.uid || m.senderId === user.uid);
  }, [personalChats, user]);

  const contacts = useMemo(() => {
    return isExecutive ? BOARD_CONTACTS.filter(c => c.id !== user?.uid) : [...MOCK_SCHOOL_CONTACTS];
  }, [isExecutive, user?.uid]);

  const activeMessages = useMemo(() => {
    if (!selectedContact) return [];
    const official = relevantPersonalMessages
      .filter(m => m.senderId === selectedContact.id || m.receiverId === selectedContact.id)
      .map(m => ({ id: m.id, senderId: m.senderId === user?.uid ? "me" : "other", text: m.text, timestamp: m.timestamp, isOfficial: m.isOfficial }));
    return official.length > 0 ? official : MOCK_MESSAGES;
  }, [selectedContact, relevantPersonalMessages, user?.uid]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessageText("");
  };

  if (user?.role === "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
        <MessageCircle className="w-16 h-16 text-primary/20" />
        <h1 className="text-2xl font-bold">Platform Management Only</h1>
        <p className="text-muted-foreground text-sm max-w-xs">Participate in chats via the Founder accounts.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3 leading-none">
            {isExecutive ? <Crown className="w-6 h-6 text-secondary" /> : <MessageCircle className="w-6 h-6 text-secondary" />}
            {isExecutive ? "Board Chat" : t("chat")}
          </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Contact List */}
        <Card className={cn("w-full md:w-80 flex flex-col border-none shadow-sm shrink-0 overflow-hidden bg-white", selectedContact && "hidden md:flex")}>
          <CardHeader className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 bg-accent/30 border-none rounded-xl text-sm h-10" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn("w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group", selectedContact?.id === contact.id ? "bg-primary text-white shadow-lg" : "hover:bg-accent/50")}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-white/20"><AvatarImage src={contact.avatar} /><AvatarFallback>{contact.name.charAt(0)}</AvatarFallback></Avatar>
                    {contact.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline"><span className="font-bold text-sm truncate">{contact.name}</span></div>
                    <p className={cn("text-[10px] truncate", selectedContact?.id === contact.id ? "text-white/70" : "text-muted-foreground")}>{contact.lastMsg}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Window */}
        <Card className={cn("flex-1 flex flex-col border-none shadow-sm relative overflow-hidden bg-white/50 rounded-[2rem]", !selectedContact && "hidden md:flex")}>
          {selectedContact ? (
            <>
              <div className="p-3 md:p-4 border-b flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedContact(null)}><ArrowLeft className="w-5 h-5" /></Button>
                  <Avatar className="h-9 w-9"><AvatarImage src={selectedContact.avatar} /><AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-primary">{selectedContact.name}</h3>
                    <p className="text-[9px] text-muted-foreground uppercase font-black">{selectedContact.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
              </div>

              <ScrollArea className="flex-1 p-4 md:p-6">
                <div className="space-y-6">
                  {activeMessages.map((msg) => (
                    <div key={msg.id} className={cn("flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2", msg.senderId === "me" ? "ml-auto items-end" : "items-start")}>
                      <div className={cn("p-3 md:p-4 rounded-2xl text-sm shadow-sm", msg.senderId === "me" ? "bg-primary text-white rounded-tr-none" : "bg-white text-foreground rounded-tl-none border border-accent")}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-3 md:p-4 bg-white border-t shrink-0">
                <div className="flex items-center gap-2">
                  <Input placeholder="Message..." className="flex-1 bg-accent/30 border-none h-11 text-sm rounded-xl" value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
                  <Button size="icon" className="h-11 w-11 rounded-xl bg-primary text-white" onClick={handleSendMessage}><Send className="w-4 h-4" /></Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center"><MessageCircle className="w-8 h-8 text-primary/20" /></div>
              <h3 className="font-black text-lg text-primary uppercase">{t("chat")}</h3>
              <p className="text-muted-foreground text-xs">{t("selectContact")}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
