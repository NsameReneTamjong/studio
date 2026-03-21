
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, User, MessageCircle, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_CONTACTS = [
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", avatar: "https://picsum.photos/seed/t1/100/100", lastMsg: "Hello, Alice is doing great!", online: true },
  { id: "T002", name: "Prof. Sarah Smith", role: "TEACHER", avatar: "https://picsum.photos/seed/t2/100/100", lastMsg: "Please check the latest assignment.", online: false },
  { id: "A001", name: "Principal Ngono", role: "SCHOOL_ADMIN", avatar: "https://picsum.photos/seed/a1/100/100", lastMsg: "The meeting is rescheduled.", online: true },
];

const MOCK_MESSAGES = [
  { id: "M1", senderId: "T001", text: "Hello, I wanted to discuss Alice's progress in Physics.", timestamp: "10:30 AM" },
  { id: "M2", senderId: "me", text: "Hello Dr. Tesla, thank you for reaching out. How is she doing?", timestamp: "10:32 AM" },
  { id: "M3", senderId: "T001", text: "She's excelling in kinematics, but could use some more practice in thermodynamics.", timestamp: "10:35 AM" },
  { id: "M4", senderId: "me", text: "I'll make sure she reviews those chapters tonight.", timestamp: "10:38 AM" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // Logic for sending message would go here
    setMessageText("");
  };

  if (user?.role === "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <MessageCircle className="w-16 h-16 text-primary/20" />
        <h1 className="text-2xl font-bold">Platform Management Only</h1>
        <p className="text-muted-foreground max-w-md">Super Admins manage feedback and announcements, but do not participate in institutional live chats.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">{t("chat")}</h1>
          <p className="text-muted-foreground mt-1">Connect with teachers and school administration instantly.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Contact List */}
        <Card className="w-80 flex flex-col border-none shadow-sm shrink-0">
          <CardHeader className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-9 bg-accent/30 border-none" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {MOCK_CONTACTS.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left group",
                    selectedContact?.id === contact.id ? "bg-primary text-white" : "hover:bg-accent/50"
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
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm truncate">{contact.name}</span>
                      <span className={cn(
                        "text-[10px] opacity-60",
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
        <Card className="flex-1 flex flex-col border-none shadow-sm relative overflow-hidden bg-white/50">
          {selectedContact ? (
            <>
              <div className="p-4 border-b flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm">{selectedContact.name}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{selectedContact.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {MOCK_MESSAGES.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[75%]",
                        msg.senderId === "me" ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-2xl text-sm shadow-sm",
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

              <div className="p-4 bg-white border-t flex items-center gap-3">
                <Input
                  placeholder="Type a message..."
                  className="flex-1 bg-accent/30 border-none h-11"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="icon" className="h-11 w-11 rounded-full shadow-lg" onClick={handleSendMessage}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary/30" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{t("chat")}</h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">{t("selectContact")}</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
