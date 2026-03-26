
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, User, MessageCircle, MoreVertical, ArrowLeft, Crown, Zap, Monitor, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const BOARD_CONTACTS = [
  { id: "EDUI26CEO001", name: "EduIgnite CEO", role: "CEO", avatar: "https://picsum.photos/seed/ceo/150/150", lastMsg: "System growth is optimal.", online: true },
  { id: "EDUI26CTO001", name: "Tech Director", role: "CTO", avatar: "https://picsum.photos/seed/cto/150/150", lastMsg: "Node API patched.", online: true },
  { id: "EDUI26COO001", name: "Operations Lead", role: "COO", avatar: "https://picsum.photos/seed/coo/150/150", lastMsg: "New nodes activated.", online: false },
  { id: "EDUI26INV001", name: "Lead Investor", role: "INV", avatar: "https://picsum.photos/seed/inv/150/150", lastMsg: "Quarterly reports ready.", online: true },
];

const MOCK_SCHOOL_CONTACTS = [
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", avatar: "https://picsum.photos/seed/t1/100/100", lastMsg: "Hello, Alice is doing great!", online: true },
  { id: "T002", name: "Prof. Sarah Smith", role: "TEACHER", avatar: "https://picsum.photos/seed/t2/100/100", lastMsg: "Please check the latest assignment.", online: false },
  { id: "A001", name: "Principal Ngono", role: "SCHOOL_ADMIN", avatar: "https://picsum.photos/seed/a1/100/100", lastMsg: "The meeting is rescheduled.", online: true },
];

const MOCK_MESSAGES = [
  { id: "M1", senderId: "other", text: "Hello, I wanted to discuss the latest platform metrics.", timestamp: "10:30 AM" },
  { id: "M2", senderId: "me", text: "I have the creative reports ready for review.", timestamp: "10:32 AM" },
  { id: "M3", senderId: "other", text: "Excellent. Let's sync during the board meeting.", timestamp: "10:35 AM" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  const isExecutive = ["SUPER_ADMIN", "CEO", "CTO", "COO", "INV", "DESIGNER"].includes(user?.role || "");
  const isDesigner = user?.role === "DESIGNER";

  const contacts = useMemo(() => {
    if (isExecutive) return BOARD_CONTACTS.filter(c => c.id !== user?.id);
    return MOCK_SCHOOL_CONTACTS;
  }, [isExecutive, user?.id]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessageText("");
  };

  if (user?.role === "SUPER_ADMIN" && !isDesigner) { // Keep Super Admin restricted unless specified
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
        <MessageCircle className="w-16 h-16 text-primary/20" />
        <h1 className="text-2xl font-bold">Platform Management Only</h1>
        <p className="text-muted-foreground max-w-md">Super Admins manage feedback and announcements, but do not participate in institutional live chats.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-140px)] gap-4 md:gap-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3">
            {isExecutive ? <Crown className="w-6 h-6 text-secondary" /> : <MessageCircle className="w-6 h-6 text-secondary" />}
            {isExecutive ? "Executive Board Chat" : t("chat")}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {isExecutive ? "Secure communication with other platform founders." : "Connect with teachers and administration."}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden">
        {/* Contact List */}
        <Card className={cn(
          "w-full md:w-80 flex flex-col border-none shadow-sm shrink-0 overflow-hidden bg-white",
          selectedContact && "hidden md:flex"
        )}>
          <CardHeader className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search board..." className="pl-9 bg-accent/30 border-none rounded-xl" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                    selectedContact?.id === contact.id ? "bg-primary text-white shadow-lg" : "hover:bg-accent/50"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-white/20">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="bg-white/10 text-xs">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden text-ellipsis">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm truncate">{contact.name}</span>
                      <span className={cn(
                        "text-[10px] opacity-60 ml-2",
                        selectedContact?.id === contact.id ? "text-white" : "text-muted-foreground"
                      )}>10:35</span>
                    </div>
                    <p className={cn(
                      "text-xs truncate",
                      selectedContact?.id === contact.id ? "text-white/70" : "text-muted-foreground"
                    )}>
                      {contact.lastMsg}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Window */}
        <Card className={cn(
          "flex-1 flex flex-col border-none shadow-sm relative overflow-hidden bg-white/50 rounded-3xl",
          !selectedContact && "hidden md:flex"
        )}>
          {selectedContact ? (
            <>
              <div className="p-3 md:p-4 border-b flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden" 
                    onClick={() => setSelectedContact(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-primary/10">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-primary">{selectedContact.name}</h3>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-widest">{selectedContact.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
              </div>

              <ScrollArea className="flex-1 p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  {MOCK_MESSAGES.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[85%] md:max-w-[75%] animate-in fade-in slide-in-from-bottom-2",
                        msg.senderId === "me" ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "p-3 md:p-4 rounded-2xl text-sm shadow-sm",
                        msg.senderId === "me" 
                          ? "bg-primary text-white rounded-tr-none" 
                          : "bg-white text-foreground rounded-tl-none border border-accent"
                      )}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-3 md:p-4 bg-white border-t flex items-center gap-2 md:gap-3">
                <Input
                  placeholder="Type a message..."
                  className="flex-1 bg-accent/30 border-none h-10 md:h-12 text-sm rounded-xl focus-visible:ring-primary"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-xl shadow-lg shrink-0 bg-primary hover:bg-primary/90" onClick={handleSendMessage}>
                  <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center border border-primary/10">
                <MessageCircle className="w-10 h-10 text-primary/30" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-xl text-primary uppercase tracking-tighter">{isExecutive ? "Board Room Chat" : t("chat")}</h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">{t("selectContact")}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
