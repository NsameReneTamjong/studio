
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Coins, 
  User, 
  Building2, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone,
  Loader2,
  Package,
  MapPin,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SupportLedgerPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Query for Support Contributions
  const supportQuery = useMemoFirebase(() => {
    if (!db || !isSuperAdmin) return null;
    return query(collection(db, "support"), orderBy("createdAt", "desc"));
  }, [db, isSuperAdmin]);

  // Query for Orders
  const ordersQuery = useMemoFirebase(() => {
    if (!db || !isSuperAdmin) return null;
    return query(collection(db, "orders"), orderBy("createdAt", "desc"));
  }, [db, isSuperAdmin]);

  const { data: supportEntries, isLoading: isSupportLoading } = useCollection(supportQuery);
  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  const handleVerifySupport = async (id: string) => {
    try {
      await updateDoc(doc(db, "support", id), { status: "Verified" });
      toast({ title: "Contribution Verified" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const handleDeleteSupport = async (id: string) => {
    try {
      await deleteDoc(doc(db, "support", id));
      toast({ title: "Record Removed" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const handleProcessOrder = async (id: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: "processed" });
      toast({ title: "Order Processed", description: "This order has been marked as handled." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      toast({ title: "Order Deleted" });
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
            Support & Orders
          </h1>
          <p className="text-muted-foreground mt-1">Manage platform onboarding orders and community contributions.</p>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="orders" className="gap-2 py-3 rounded-xl transition-all">
            <Package className="w-4 h-4" /> Platform Orders
          </TabsTrigger>
          <TabsTrigger value="contributions" className="gap-2 py-3 rounded-xl transition-all">
            <Coins className="w-4 h-4" /> Contributions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-0 animate-in fade-in slide-in-from-bottom-4">
          {isOrdersLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders?.map((order) => (
                <Card key={order.id} className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-72 bg-accent/20 border-r p-6 flex flex-col space-y-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-primary text-white font-bold">{order.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-black text-primary text-sm uppercase leading-tight">{order.fullName}</h3>
                          <Badge variant="outline" className="text-[8px] h-4 uppercase mt-1">{order.occupation}</Badge>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-accent/50">
                        <div className="flex items-center gap-2 text-xs text-primary font-bold">
                          <Building2 className="w-3.5 h-3.5 text-secondary" /> {order.schoolName}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {order.subDivision}, {order.division}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Globe className="w-3 h-3" /> {order.region} Region
                        </div>
                      </div>
                      <div className="pt-4 mt-auto">
                        <Badge className={cn(
                          "w-full justify-center py-1 font-black uppercase text-[9px]",
                          order.status === 'processed' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {order.status === 'processed' ? 'Processed' : 'New Order'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 p-6 md:p-8 flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Phone className="w-3 h-3 text-secondary" /> Contact Number</p>
                            <p className="text-lg font-black text-primary">{order.whatsappNumber}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Mail className="w-3 h-3 text-secondary" /> Email Info</p>
                            <p className="text-sm font-bold text-primary">{order.email}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(order.id)} className="text-destructive/20 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>

                      <div className="mt-auto pt-6 border-t flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary/40" /> Received: {order.createdAt?.toDate().toLocaleString() || '---'}
                        </span>
                        <Button className="gap-2 shadow-lg" onClick={() => handleProcessOrder(order.id)} disabled={order.status === 'processed'}>
                          <CheckCircle2 className="w-4 h-4" /> {order.status === 'processed' ? 'Record Handled' : 'Mark as Processed'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {(!orders || orders.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-[2rem] border-2 border-dashed border-primary/10">
                  <Package className="w-16 h-16 text-primary/10" />
                  <p className="text-muted-foreground">No onboarding orders found in the registry.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contributions" className="mt-0">
          {isSupportLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {supportEntries?.map((entry) => (
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
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSupport(entry.id)} className="text-destructive/20 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>

                      <div className="bg-white/50 border border-accent rounded-2xl p-6 italic text-sm text-muted-foreground leading-relaxed flex-1">
                        "{entry.message || "No message provided."}"
                      </div>

                      <div className="mt-8 pt-6 border-t flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-green-600" /> Secure Transaction Log
                        </span>
                        <Button className="gap-2 shadow-lg" onClick={() => handleVerifySupport(entry.id)} disabled={entry.status === 'Verified'}>
                          <CheckCircle2 className="w-4 h-4" /> {entry.status === 'Verified' ? 'Verified' : 'Verify Contribution'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {(!supportEntries || supportEntries.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-[2rem] border-2 border-dashed border-primary/10">
                  <Heart className="w-16 h-16 text-primary/10" />
                  <p className="text-muted-foreground">No contributions found in the ledger.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
