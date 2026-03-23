
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
  Download,
  Smartphone,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function SupportLedgerPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const supportQuery = useMemoFirebase(() => {
    if (!db || !isSuperAdmin) return null;
    return query(collection(db, "support"), orderBy("createdAt", "desc"));
  }, [db, isSuperAdmin]);

  const { data: entries, isLoading } = useCollection(supportQuery);

  const handleVerify = async (id: string) => {
    try {
      await updateDoc(doc(db, "support", id), { status: "Verified" });
      toast({ title: "Contribution Verified" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "support", id));
      toast({ title: "Record Removed" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  if (!isSuperAdmin) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
              <Heart className="w-6 h-6 text-secondary fill-secondary/20" />
            </div>
            Support Ledger
          </h1>
          <p className="text-muted-foreground mt-1">Review community contributions and platform support messages.</p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest">
             {entries?.length || 0} Total Contributions
           </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {entries?.map((entry) => (
            <Card key={entry.id} className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-72 bg-accent/20 border-r p-6 flex flex-col items-center text-center space-y-4 shrink-0">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-2xl">
                    <AvatarImage src={entry.userAvatar} />
                    <AvatarFallback className="bg-primary text-white text-2xl font-bold">{entry.userName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-black text-primary text-sm uppercase leading-tight">{entry.userName}</h3>
                    <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[8px] h-4 uppercase px-2">{entry.userRole || "User"}</Badge>
                  </div>
                  <div className="pt-4 border-t border-accent/50 w-full">
                    <Badge className={cn(
                      "w-full justify-center py-1 font-black uppercase text-[9px]",
                      entry.status === 'Verified' ? "bg-green-100 text-green-700" : ""
                    )}>
                      {entry.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-8">
                    <div className="grid grid-cols-2 gap-8 flex-1">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Coins className="w-3 h-3 text-secondary" /> Contribution</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-primary">{entry.amount?.toLocaleString()}</span>
                          <span className="text-xs font-bold text-muted-foreground">XAF</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Smartphone className="w-3 h-3 text-secondary" /> Method</p>
                        <Badge variant="outline" className="h-7 px-3 bg-white text-primary font-black uppercase text-[10px]">{entry.method}</Badge>
                        <p className="text-[10px] font-mono font-bold text-muted-foreground mt-1">{entry.phone}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)} className="text-destructive/20 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>

                  <div className="bg-white/50 border border-accent rounded-2xl p-6 italic text-sm text-muted-foreground leading-relaxed flex-1">
                    "{entry.message || "No message provided."}"
                  </div>

                  <div className="mt-8 pt-6 border-t flex justify-between items-center">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" /> Secure Transaction Log
                    </span>
                    <Button className="gap-2 shadow-lg" onClick={() => handleVerify(entry.id)} disabled={entry.status === 'Verified'}>
                      <CheckCircle2 className="w-4 h-4" /> {entry.status === 'Verified' ? 'Verified' : 'Verify Contribution'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {(!entries || entries.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-[2rem] border-2 border-dashed border-primary/10">
              <Heart className="w-16 h-16 text-primary/10" />
              <p className="text-muted-foreground">No contributions found in the ledger.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
