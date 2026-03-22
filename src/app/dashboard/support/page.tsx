
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Coins, 
  User, 
  Building2, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowUpRight,
  Filter,
  Download,
  Smartphone,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const INITIAL_SUPPORT_ENTRIES = [
  { 
    id: "SUP-001", 
    userName: "Prof. Sarah Smith", 
    userAvatar: "https://picsum.photos/seed/t2/100/100",
    userRole: "TEACHER",
    schoolName: "Lycée de Joss",
    schoolLogo: "https://picsum.photos/seed/joss-logo/100/100",
    amount: "15,000",
    method: "MTN MoMo",
    phone: "677 XXX XXX",
    message: "Thank you for making our grading process so much easier. This is a small token of appreciation for the dev team!",
    date: "3 hours ago",
    status: "New"
  },
  { 
    id: "SUP-002", 
    userName: "Alice Thompson", 
    userAvatar: "https://picsum.photos/seed/s1/100/100",
    userRole: "STUDENT",
    schoolName: "GBHS Yaoundé",
    schoolLogo: "https://picsum.photos/seed/gbhs-logo/100/100",
    amount: "5,000",
    method: "Orange Money",
    phone: "699 XXX XXX",
    message: "I love the new mobile interface. Great work guys!",
    date: "Yesterday",
    status: "Verified"
  },
];

export default function SupportLedgerPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [entries, setEntries] = useState(INITIAL_SUPPORT_ENTRIES);

  const handleVerify = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'Verified' } : e));
    toast({ title: "Contribution Verified", description: "The transaction has been confirmed in the ledger." });
  };

  const handleArchive = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    toast({ title: "Entry Archived", description: "The support record has been moved to archives." });
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    toast({ variant: "destructive", title: "Record Removed", description: "The support entry has been permanently deleted." });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
              <Heart className="w-6 h-6 text-secondary fill-secondary/20" />
            </div>
            {t("supportRegistry")}
          </h1>
          <p className="text-muted-foreground mt-1">Review community contributions and platform support messages.</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest">
             {entries.length} Incoming Records
           </Badge>
           <Button variant="secondary" size="icon" className="h-11 w-11 rounded-xl shadow-sm">
             <Download className="w-5 h-5" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {entries.map((entry) => (
          <Card key={entry.id} className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col md:flex-row">
              {/* Contributor Profile Sidebar */}
              <div className="w-full md:w-72 bg-accent/20 border-r p-6 flex flex-col items-center text-center space-y-4 shrink-0">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-2xl">
                    <AvatarImage src={entry.userAvatar} />
                    <AvatarFallback className="bg-primary text-white text-2xl font-bold">{entry.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-accent">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-black text-primary text-sm uppercase leading-tight">{entry.userName}</h3>
                  <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[8px] h-4 font-black uppercase px-2">{entry.userRole}</Badge>
                </div>

                <div className="pt-4 border-t border-accent/50 w-full space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white p-1 border shadow-inner">
                      <img src={entry.schoolLogo} alt="School" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground truncate max-w-[120px]">{entry.schoolName}</p>
                  </div>
                  <Badge 
                    variant={entry.status === 'Verified' ? 'secondary' : 'default'} 
                    className={cn(
                      "w-full justify-center py-1 font-black uppercase text-[9px]",
                      entry.status === 'Verified' ? "bg-green-100 text-green-700" : ""
                    )}
                  >
                    {entry.status}
                  </Badge>
                </div>
              </div>

              {/* Financial & Message Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div className="grid grid-cols-2 gap-8 flex-1">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Coins className="w-3 h-3 text-secondary" /> Contribution Amount
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-primary">{entry.amount}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase">XAF</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Smartphone className="w-3 h-3 text-secondary" /> Payment Method
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-7 px-3 bg-white border-primary/10 text-primary font-black uppercase text-[10px]">
                          {entry.method}
                        </Badge>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">{entry.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-bold">
                      <Clock className="w-3 h-3" /> {entry.date}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full hover:bg-destructive/5 text-destructive/20 hover:text-destructive h-8 w-8"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="bg-white/50 border border-accent rounded-2xl p-6 relative">
                    <div className="absolute -top-3 left-6 bg-white px-2 text-[9px] font-black uppercase text-muted-foreground">Contributor Message</div>
                    <p className="text-muted-foreground leading-relaxed italic text-sm">
                      "{entry.message || "No message provided."}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-green-600" />
                     <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Secure Transaction Log</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      className="flex-1 sm:flex-none gap-2 rounded-xl h-11 px-6 font-bold"
                      onClick={() => handleArchive(entry.id)}
                    >
                      Archive Entry
                    </Button>
                    <Button 
                      className="flex-1 sm:flex-none gap-2 rounded-xl h-11 px-8 font-black uppercase tracking-widest text-xs shadow-lg"
                      onClick={() => handleVerify(entry.id)}
                      disabled={entry.status === 'Verified'}
                    >
                      <CheckCircle2 className="w-4 h-4" /> 
                      {entry.status === 'Verified' ? 'Verified' : 'Verify Transaction'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-[2rem] border-2 border-dashed border-primary/10">
            <div className="p-6 bg-primary/5 rounded-full">
              <Heart className="w-16 h-16 text-primary/10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-primary">Registry Clear</h3>
              <p className="text-muted-foreground">No pending platform contributions to review.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
