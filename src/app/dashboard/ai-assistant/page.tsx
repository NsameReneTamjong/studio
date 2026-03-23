
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
import { Progress } from "@/components/ui/progress";
import { Sparkles, Send, Loader2, Bot, User, BookOpen, Calculator, BrainCircuit, Lightbulb, AlertCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  timestamp: Date;
}

const DAILY_LIMIT = 10;

export default function AiAssistantPage() {
  const { user, incrementAiRequest } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: language === 'en' 
        ? `Hello ${user?.name}! I'm your EduIgnite AI. How can I assist you in your role as a ${user?.role?.replace('_', ' ')} today?`
        : `Bonjour ${user?.name} ! Je suis votre IA EduIgnite. Comment puis-je vous aider dans votre rôle de ${user?.role?.replace('_', ' ')} aujourd'hui ?`,
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

  const requestCount = user?.aiRequestCount || 0;
  const remainingRequests = Math.max(0, DAILY_LIMIT - requestCount);
  const isLimitReached = user?.role === "STUDENT" && remainingRequests === 0;

  const onSend = async (queryText?: string) => {
    const finalQuery = queryText || input;
    if (!finalQuery.trim() || isLoading) return;

    if (isLimitReached) {
      toast({
        variant: "destructive",
        title: "Daily Limit Reached",
        description: "Students are limited to 10 AI requests per day to ensure fair usage."
      });
      return;
    }

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
      
      // Increment request count for billing/tracking
      if (user?.role === "STUDENT") {
        await incrementAiRequest();
      }
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
              ? `Your dedicated helper for everything in EduIgnite.` 
              : `Votre aide dédiée pour tout ce qui concerne EduIgnite.`}
          </p>
        </div>

        {user?.role === "STUDENT" && (
          <Card className="border-none shadow-sm bg-accent/30 py-2 px-4 flex items-center gap-4 rounded-2xl">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-8">
                <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Daily Energy</span>
                <span className="text-[10px] font-black text-primary">{remainingRequests} / {DAILY_LIMIT}</span>
              </div>
              <Progress value={(remainingRequests / DAILY_LIMIT) * 100} className="h-1.5 w-32" />
            </div>
            <div className="p-2 bg-primary rounded-lg text-secondary">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </Card>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col border-none shadow-xl overflow-hidden bg-white/50 rounded-[2rem]">
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
                    msg.role === "assistant" ? "border-primary bg-primary" : "border-white shadow-sm"
                  )}>
                    {msg.role === "assistant" ? (
                      <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    ) : (
                      <>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-accent text-primary font-bold">{user?.name?.charAt(0)}</AvatarFallback>
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
                    {msg.suggestions && msg.suggestions.length > 0 && !isLimitReached && (
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
                    <span className="text-[9px] text-muted-foreground mt-1 opacity-60 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 md:p-8 bg-white border-t space-y-4">
            {isLimitReached && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-800 text-xs animate-in slide-in-from-bottom-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p className="font-medium leading-relaxed">
                  You have used all your AI credits for today. Your daily energy will be restored at midnight.
                </p>
              </div>
            )}

            {!isLimitReached && messages.length === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl mx-auto mb-2">
                {[
                  { label: language === 'en' ? 'Study Tips' : 'Conseils d\'étude', icon: BrainCircuit, role: 'STUDENT' },
                  { label: language === 'en' ? 'Lesson Ideas' : 'Idées de cours', icon: Lightbulb, role: 'TEACHER' },
                  { label: language === 'en' ? 'Grades Help' : 'Aide aux notes', icon: BookOpen, role: 'PARENT' },
                  { label: language === 'en' ? 'System FAQ' : 'FAQ Système', icon: Calculator, role: 'ANY' },
                ].filter(p => p.role === 'ANY' || p.role === user?.role).map((p, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    className="h-auto py-4 px-4 flex-col gap-2 bg-accent/30 hover:bg-accent border-none text-primary rounded-2xl transition-all hover:scale-105 active:scale-95"
                    onClick={() => onSend(p.label)}
                    disabled={isLoading}
                  >
                    <p.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-tight">{p.label}</span>
                  </Button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <Input
                placeholder={isLimitReached ? "Credits depleted..." : (language === 'en' ? "Ask me anything about your school life..." : "Posez-moi une question sur votre vie scolaire...")}
                className="flex-1 h-12 md:h-14 bg-accent/20 border-none px-6 text-base focus-visible:ring-primary rounded-2xl font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                disabled={isLoading || isLimitReached}
              />
              <Button 
                size="icon" 
                className="h-12 w-12 md:h-14 md:w-14 rounded-2xl shadow-xl shrink-0 transition-transform active:scale-95 bg-primary hover:bg-primary/90" 
                onClick={() => onSend()}
                disabled={isLoading || !input.trim() || isLimitReached}
              >
                {isLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Send className="w-5 h-5 md:w-6 md:h-6" />}
              </Button>
            </div>
            <p className="text-[9px] text-center text-muted-foreground opacity-40 uppercase font-black tracking-widest">
              EduIgnite Flash AI • Context Aware Assistant
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
