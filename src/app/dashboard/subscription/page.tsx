
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wallet, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  User, 
  Coins, 
  Send, 
  Loader2,
  Lock,
  ArrowRight,
  History,
  QrCode
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ROLE_FEES: Record<string, string> = {
  STUDENT: "5000",
  PARENT: "2500",
  TEACHER: "10000",
  BURSAR: "10000",
  LIBRARIAN: "10000",
  SCHOOL_ADMIN: "25000",
};

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [paymentData, setPaymentData] = useState({
    method: "mtn",
    number: "",
  });

  const userFee = ROLE_FEES[user?.role || "STUDENT"] || "5000";
  const deadline = "2024-10-31";

  const handlePaySubscription = () => {
    if (!paymentData.number) {
      toast({ 
        variant: "destructive", 
        title: language === 'en' ? "Missing Number" : "Numéro manquant", 
        description: language === 'en' ? "Please enter your mobile money number." : "Veuillez entrer votre numéro mobile money." 
      });
      return;
    }

    setIsProcessing(true);
    // Simulated payment delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus('paid');
      toast({
        title: language === 'en' ? "Payment Successful" : "Paiement Réussi",
        description: language === 'en' 
          ? "Your annual institutional license has been activated." 
          : "Votre licence institutionnelle annuelle a été activée.",
      });
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Wallet className="w-6 h-6 text-secondary" />
            </div>
            {t("subscription")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your annual institutional license and dashboard access fees.
          </p>
        </div>
        <Badge 
          variant={paymentStatus === 'paid' ? 'secondary' : 'outline'} 
          className={cn(
            "h-10 px-6 rounded-xl font-black uppercase tracking-widest",
            paymentStatus === 'paid' ? "bg-green-100 text-green-700 border-none" : "border-primary/20 text-primary"
          )}
        >
          {paymentStatus === 'paid' ? t("paid") : t("unpaid")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          {/* License Status Card */}
          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-primary p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black">{t("subscriptionStatus")}</CardTitle>
                    <CardDescription className="text-white/60">Annual Platform Access Registry</CardDescription>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Valid Until</p>
                  <p className="text-lg font-bold">Oct 2024</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Your Role</p>
                  <p className="text-xl font-bold text-primary flex items-center gap-2">
                    <User className="w-5 h-5 text-secondary" />
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Annual Charge</p>
                  <p className="text-2xl font-black text-primary">
                    {parseInt(userFee).toLocaleString()} <span className="text-xs font-bold text-muted-foreground">XAF</span>
                  </p>
                </div>
              </div>

              {paymentStatus === 'pending' ? (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-900 leading-none">Action Required</p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Your annual license fee is outstanding. Please clear the balance before the **{deadline}** deadline to avoid automated dashboard locking.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex gap-4 animate-in zoom-in-95 duration-500">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-bold text-green-900 leading-none">License Activated</p>
                    <p className="text-xs text-green-800 leading-relaxed">
                      Thank you! Your institutional node is verified and active. You have full access to all pedagogical and administrative modules.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t space-y-4">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4" /> Transaction History
                </h4>
                <div className="space-y-2">
                  {paymentStatus === 'paid' ? (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-accent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Annual Renewal 2023/24</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Today, Just now</p>
                        </div>
                      </div>
                      <span className="font-black text-primary">{parseInt(userFee).toLocaleString()} XAF</span>
                    </div>
                  ) : (
                    <p className="text-xs text-center py-10 text-muted-foreground italic">No successful transactions recorded for this period.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-8">
          {/* Payment Gateway Card */}
          <Card className={cn(
            "border-none shadow-2xl overflow-hidden rounded-[2rem] transition-all duration-500",
            paymentStatus === 'paid' ? "opacity-50 grayscale pointer-events-none" : ""
          )}>
            <CardHeader className="bg-accent/50 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-primary">{t("paySubscription")}</CardTitle>
                  <CardDescription>Instant Institutional Activation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Select Provider</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant={paymentData.method === 'mtn' ? 'default' : 'outline'}
                      className={cn("h-14 rounded-2xl font-bold transition-all", paymentData.method === 'mtn' ? "border-primary" : "border-accent")}
                      onClick={() => setPaymentData({...paymentData, method: 'mtn'})}
                    >
                      MTN MoMo
                    </Button>
                    <Button 
                      variant={paymentData.method === 'orange' ? 'default' : 'outline'}
                      className={cn("h-14 rounded-2xl font-bold transition-all", paymentData.method === 'orange' ? "border-primary" : "border-accent")}
                      onClick={() => setPaymentData({...paymentData, method: 'orange'})}
                    >
                      Orange Money
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Mobile Number</Label>
                  <Input 
                    placeholder="6XX XX XX XX" 
                    className="h-14 bg-accent/30 border-none rounded-2xl font-black text-primary focus-visible:ring-primary text-lg px-6"
                    value={paymentData.number}
                    onChange={(e) => setPaymentData({...paymentData, number: e.target.value})}
                  />
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Total to Pay</p>
                      <p className="text-3xl font-black text-primary">{parseInt(userFee).toLocaleString()} XAF</p>
                   </div>
                   <div className="p-3 bg-primary rounded-2xl text-white shadow-xl">
                      <Coins className="w-8 h-8 text-secondary" />
                   </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-accent/20 p-6 border-t border-accent">
              <Button 
                className="w-full h-16 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3" 
                onClick={handlePaySubscription}
                disabled={isProcessing || paymentStatus === 'paid'}
              >
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                Process Payment
              </Button>
            </CardFooter>
          </Card>

          {/* Secure System Badge */}
          <div className="p-8 rounded-[2rem] bg-white border shadow-sm space-y-6 text-center">
             <div className="flex justify-center">
                <div className="p-4 bg-accent rounded-full">
                   <Lock className="w-10 h-10 text-primary" />
                </div>
             </div>
             <div className="space-y-2">
                <h4 className="font-black text-primary uppercase tracking-tighter">Secure SaaS Registry</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All transactions are encrypted and directly linked to your institutional matricule ID. Once verified, your node certificate is automatically updated.
                </p>
             </div>
             <div className="flex flex-col items-center gap-2 pt-2 border-t">
                <QrCode className="w-20 h-20 opacity-10" />
                <p className="text-[10px] font-bold uppercase text-muted-foreground opacity-40">Verified Infrastructure</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
