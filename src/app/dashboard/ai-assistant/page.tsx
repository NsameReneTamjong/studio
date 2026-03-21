"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { getAiAssistantResponse, type AssistantOutput } from "@/ai/flows/general-ai-assistant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Send, Loader2, Bot, User, BookOpen, Calculator, BrainCircuit, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  timestamp: Date;
}

export default function AiAssistantPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: language === 'en' 
        ? `Hello ${user?.name}! I'm your EduNexus AI. How can I assist you in your role as a ${user?.role?.replace('_', ' ')} today?`
        : `Bonjour ${user?.name} ! Je suis votre IA EduNexus. Comment puis-je vous aider dans votre rôle de ${user?.role?.replace('_', ' ')} aujourd'hui ?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const onSend = async (queryText?: string) => {
    const finalQuery = queryText || input;
    if (!finalQuery.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: finalQuery,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await getAiAssistantResponse({
        userRole: user?.role || "USER",
        userName: user?.name || "User",
        query: finalQuery,
        context: "User is in the general AI Assistant dashboard.",
      });

      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: result.response,
        suggestions: result.suggestions,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the AI assistant. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch(user?.role) {
      case 'STUDENT': return <BrainCircuit className="w-6 h-6 text-secondary" />;
      case 'TEACHER': return <Lightbulb className="w-6 h-6 text-secondary" />;
      case 'PARENT': return <Heart className="w-6 h-6 text-secondary" />;
      default: return <Sparkles className="w-6 h-6 text-secondary" />;
    }
  };

  const Heart = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-secondary fill-secondary/20" />
            </div>
            {language === 'en' ? 'AI Assistant' : 'Assistant IA'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? `Your dedicated helper for everything in EduNexus.` 
              : `Votre aide dédiée pour tout ce qui concerne EduNexus.`}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col border-none shadow-xl overflow-hidden bg-white/50">
          <ScrollArea className="flex-1 p-4 md:p-6">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-4 animate-in fade-in slide-in-from-bottom-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className={cn(
                    "h-8 w-8 md:h-10 md:w-10 border-2 shrink-0",
                    msg.role === "assistant" ? "border-primary bg-primary" : "border-white"
                  )}>
                    {msg.role === "assistant" ? (
                      <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    ) : (
                      <>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className={cn(
                    "flex flex-col max-w-[85%] md:max-w-[75%]",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm",
                      msg.role === "user" 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white text-foreground rounded-tl-none border border-accent/50"
                    )}>
                      {msg.content}
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.suggestions.map((sug, i) => (
                          <Button 
                            key={i} 
                            variant="outline" 
                            size="sm" 
                            className="text-[10px] md:text-xs rounded-full bg-white/50 hover:bg-white border-primary/10 text-primary"
                            onClick={() => onSend(sug)}
                            disabled={isLoading}
                          >
                            {sug}
                          </Button>
                        ))}
                      </div>
                    )}
                    <span className="text-[9px] text-muted-foreground mt-1 opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 md:p-6 bg-white border-t space-y-4">
            {messages.length === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl mx-auto mb-2">
                {[
                  { label: language === 'en' ? 'Study Tips' : 'Conseils d\'étude', icon: BrainCircuit, role: 'STUDENT' },
                  { label: language === 'en' ? 'Lesson Ideas' : 'Idées de cours', icon: Lightbulb, role: 'TEACHER' },
                  { label: language === 'en' ? 'Grades Help' : 'Aide aux notes', icon: BookOpen, role: 'PARENT' },
                  { label: language === 'en' ? 'System FAQ' : 'FAQ Système', icon: Calculator, role: 'ANY' },
                ].filter(p => p.role === 'ANY' || p.role === user?.role).map((p, i) => (
                  <Button 
                    key={i} 
                    variant="accent" 
                    className="h-auto py-3 px-4 flex-col gap-2 bg-accent/30 hover:bg-accent border-none text-primary"
                    onClick={() => onSend(p.label)}
                    disabled={isLoading}
                  >
                    <p.icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">{p.label}</span>
                  </Button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <Input
                placeholder={language === 'en' ? "Ask me anything about your school life..." : "Posez-moi une question sur votre vie scolaire..."}
                className="flex-1 h-12 md:h-14 bg-accent/20 border-none px-6 text-base focus-visible:ring-primary rounded-2xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                className="h-12 w-12 md:h-14 md:w-14 rounded-2xl shadow-lg shrink-0 transition-transform active:scale-95" 
                onClick={() => onSend()}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
              </Button>
            </div>
            <p className="text-[9px] text-center text-muted-foreground opacity-60">
              EduNexus AI can make mistakes. Check important information.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
