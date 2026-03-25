
"use client";

import { useAuth, type UserRole } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Menu, Building2, Heart, Youtube, MessageSquare, Send, CheckCircle2, Loader2, Info, ExternalLink, Lock, Wallet, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const EXECUTIVE_ROLES: UserRole[] = ["SUPER_ADMIN", "CEO", "CTO", "COO", "INV"];

const TUTORIAL_LINKS: Record<string, string> = {
  STUDENT: "https://youtube.com/watch?v=eduignite-student",
  TEACHER: "https://youtube.com/watch?v=eduignite-teacher",
  PARENT: "https://youtube.com/watch?v=eduignite-parent",
  SCHOOL_ADMIN: "https://youtube.com/watch?v=eduignite-admin",
  BURSAR: "https://youtube.com/watch?v=eduignite-bursar",
  LIBRARIAN: "https://youtube.com/watch?v=eduignite-librarian",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading, platformSettings, addTestimony } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);
  const [supportStep, setSupportModalStep] = useState<'form' | 'thanks'>('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const [testimonyMessage, setTestimonyMessage] = useState("");
  const [isSubmittingTestimony, setIsSubmittingTestimony] = useState(false);

  const [supportData, setSupportData] = useState({
    method: "mtn",
    number: "",
    amount: "",
    message: ""
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSupportSubmit = () => {
    if (!supportData.number || !supportData.amount) {
      toast({ variant: "destructive", title: "Incomplete Fields", description: "Please enter your number and contribution amount." });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSupportModalStep('thanks');
    }, 1500);
  };

  const handleTestimonySubmit = () => {
    if (!testimonyMessage.trim() || !user) return;
    setIsSubmittingTestimony(true);
    
    // Simple prototype delay
    setTimeout(() => {
      addTestimony({
        userId: user.id,
        name: user.name,
        profileImage: user.avatar || "",
        role: user.role,
        schoolName: user.school?.name || "EduIgnite Node",
        message: testimonyMessage,
      });
      
      setIsSubmittingTestimony(false);
      setIsTestimonyModalOpen(false);
      setTestimonyMessage("");
      toast({
        title: "Testimony Received",
        description: "Your testimony has been submitted for review.",
      });
    }, 1000);
  };

  const resetSupport = () => {
    setIsSupportModalOpen(false);
    setTimeout(() => {
      setSupportModalStep('form');
      setSupportData({ method: "mtn", number: "", amount: "", message: "" });
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-primary/40 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Syncing Prototype Session</p>
      </div>
    );
  }

  if (!user) return null;

  const isPlatformExecutive = EXECUTIVE_ROLES.includes(user.role as UserRole);
  const isLicensePaid = user.isLicensePaid;
  const isSubscriptionPage = pathname === "/dashboard/subscription";

  // Enforcement logic: If license not paid, restrict access to everything except the subscription page
  if (!isLicensePaid && !isPlatformExecutive && !isSubscriptionPage) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <aside className="hidden md:flex w-64 shrink-0 h-full">
          <DashboardSidebar />
        </aside>
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-accent/10">
          <Card className="max-w-md w-full border-none shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary p-8 text-white text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/10 rounded-full">
                  <Lock className="w-12 h-12 text-secondary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-black">Dashboard Locked</CardTitle>
              <CardDescription className="text-white/60">Annual Institutional License Required</CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your account dashboard has been locked because the annual EduIgnite license fee for the current academic session is outstanding. 
              </p>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 text-left">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 font-medium">
                  Administrative actions (Grades, Finance, Library) are suspended until the license is activated.
                </p>
              </div>
              <Button asChild className="w-full h-14 rounded-2xl shadow-lg font-black uppercase tracking-widest text-xs gap-2">
                <Link href="/dashboard/subscription">
                  <Wallet className="w-5 h-5" /> Activate License Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 h-full">
        <DashboardSidebar />
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-primary text-white shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            {!isPlatformExecutive && user?.school?.logo ? (
              <div className="w-6 h-6 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
                <img src={user.school.logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <Building2 className="w-6 h-6 text-secondary shrink-0" />
            )}
            <span className="font-bold tracking-tight text-white truncate">
              {isPlatformExecutive ? platformSettings.name : (user?.school?.name || platformSettings.name)}
            </span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-none w-64">
              <DashboardSidebar onClose={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 min-h-full flex flex-col">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full flex-1">
              {children}
            </div>

            {/* DASHBOARD FOOTER (Excluded for Executives) */}
            {!isPlatformExecutive && (
              <footer className="mt-20 border-t pt-8 pb-12 w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/5 rounded-lg border border-primary/10">
                        {user?.school?.logo ? (
                          <img src={user.school.logo} alt="School Logo" className="w-4 h-4 object-contain" />
                        ) : (
                          <Building2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="font-black text-primary uppercase tracking-tighter">
                        {user?.school?.name || "EduIgnite Academic SaaS"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                      Revolutionizing educational management through localized SaaS infrastructure. This institutional node is verified and secured by the {platformSettings.name} platform.
                    </p>
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl border-primary/20 text-primary font-bold gap-2 h-10 px-4"
                        asChild
                      >
                        <a href={TUTORIAL_LINKS[user.role] || "https://youtube.com"} target="_blank" rel="noopener noreferrer">
                          <Youtube className="w-4 h-4 text-red-600" />
                          Learn to use your Dashboard
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-4">
                    <div className="bg-secondary/10 p-6 rounded-3xl border border-secondary/20 flex flex-col md:items-end text-center md:text-right space-y-3">
                      <div>
                        <h4 className="font-black text-primary uppercase text-xs tracking-widest flex items-center md:justify-end gap-2 mb-1">
                          Support the Platform <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        </h4>
                        <p className="text-xs text-muted-foreground">Love our work? Help us keep the servers running and features coming.</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 md:justify-end">
                        <Dialog open={isTestimonyModalOpen} onOpenChange={setIsTestimonyModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl border-primary/20 text-primary h-11 px-8 font-bold gap-2 bg-white hover:bg-primary/5">
                              <Quote className="w-4 h-4" />
                              Give Testimony
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="bg-primary p-8 text-white">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                  <Quote className="w-8 h-8 text-secondary" />
                                </div>
                                <div>
                                  <DialogTitle className="text-2xl font-black">Share Your Story</DialogTitle>
                                  <DialogDescription className="text-white/60">Help others discover the power of EduIgnite.</DialogDescription>
                                </div>
                              </div>
                            </DialogHeader>
                            <div className="p-8 space-y-6">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Message</Label>
                                <Textarea 
                                  placeholder="Share your experience with EduIgnite..." 
                                  className="min-h-[150px] bg-accent/30 border-none rounded-2xl focus-visible:ring-primary p-4"
                                  value={testimonyMessage}
                                  onChange={(e) => setTestimonyMessage(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
                                <Info className="w-5 h-5 text-primary opacity-40" />
                                <p className="text-[10px] text-muted-foreground italic">Your profile details (name, role, school) will be attached to this testimony.</p>
                              </div>
                            </div>
                            <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                              <Button 
                                className="w-full h-14 rounded-2xl shadow-xl font-black uppercase text-xs gap-3 bg-primary text-white hover:bg-primary/90" 
                                onClick={handleTestimonySubmit}
                                disabled={isSubmittingTestimony || !testimonyMessage.trim()}
                              >
                                {isSubmittingTestimony ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Submit for Review
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
                          <DialogTrigger asChild>
                            <Button className="rounded-xl bg-primary text-white shadow-lg h-11 px-8 font-bold gap-2">
                              Support with a Contribution
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                            {supportStep === 'form' ? (
                              <>
                                <DialogHeader className="bg-primary p-8 text-white">
                                  <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                      <Heart className="w-8 h-8 text-secondary fill-secondary/20" />
                                    </div>
                                    <div>
                                      <DialogTitle className="text-2xl font-black">Support Platform</DialogTitle>
                                      <DialogDescription className="text-white/60">Your contribution fuels the digital transformation of education.</DialogDescription>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="p-8 space-y-6">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Method</Label>
                                        <Select value={supportData.method} onValueChange={(v) => setSupportData({...supportData, method: v})}>
                                          <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="mtn">MTN MoMo</SelectItem>
                                            <SelectItem value="orange">Orange Money</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Amount (XAF)</Label>
                                        <Input 
                                          type="number" 
                                          placeholder="5,000" 
                                          className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
                                          value={supportData.amount}
                                          onChange={(e) => setSupportData({...supportData, amount: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Phone Number</Label>
                                      <Input 
                                        placeholder="6XX XX XX XX" 
                                        className="h-12 bg-accent/30 border-none rounded-xl" 
                                        value={supportData.number}
                                        onChange={(e) => setSupportData({...supportData, number: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Personal Message (Optional)</Label>
                                      <Textarea 
                                        placeholder="Leave a word for the developers..." 
                                        className="bg-accent/30 border-none rounded-xl min-h-[80px]" 
                                        value={supportData.message}
                                        onChange={(e) => setSupportData({...supportData, message: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                                  <Button 
                                    className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-2" 
                                    onClick={handleSupportSubmit}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-5 h-5" />}
                                    Confirm Contribution
                                  </Button>
                                </DialogFooter>
                              </>
                            ) : (
                              <div className="p-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                  <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                  <h2 className="text-3xl font-black text-primary tracking-tight">Thank You!</h2>
                                  <p className="text-muted-foreground leading-relaxed">
                                    Your generous contribution of <span className="font-black text-primary">{parseInt(supportData.amount).toLocaleString()} XAF</span> has been received. 
                                    People with good hearts like yours make this journey possible.
                                  </p>
                                </div>
                                <Button variant="outline" className="w-full h-12 rounded-xl" onClick={resetSupport}>
                                  Back to Dashboard
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
                      <span>v2.4.0 High-Availability (Prototype)</span>
                      <span>•</span>
                      <span>Powered by {platformSettings.name}</span>
                    </div>
                  </div>
                </div>
              </footer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
