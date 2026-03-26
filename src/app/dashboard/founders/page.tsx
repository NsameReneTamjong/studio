
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  UserPlus, 
  Crown, 
  ShieldCheck, 
  Mail, 
  Trash2, 
  MoreVertical, 
  Plus, 
  Settings2,
  Fingerprint,
  CheckCircle2,
  Loader2,
  Ban,
  Pencil,
  ShieldAlert,
  Save,
  X,
  Lock,
  Eye,
  Globe,
  TrendingUp,
  MessageSquare,
  Activity,
  Zap,
  Network,
  Users,
  History,
  Download,
  Printer,
  QrCode
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const ROLES = ["CEO", "CTO", "COO", "CFO", "INV", "DESIGNER", "Investor", "Board Member", "Adviser"];

const MOCK_FOUNDERS = [
  { id: "EduI24CEO001", name: "EduIgnite Founder", email: "ceo@eduignite.io", role: "CEO", status: "Active", isPrimary: true, avatar: "https://picsum.photos/seed/ceo/150/150", permissions: { manageSchools: true, manageTeam: true, viewAnalytics: true, manageSupport: true } },
  { id: "EduI24CTO001", name: "Tech Director", email: "cto@eduignite.io", role: "CTO", status: "Active", isPrimary: false, avatar: "https://picsum.photos/seed/cto/150/150", permissions: { manageSchools: true, manageTeam: false, viewAnalytics: true, manageSupport: false } },
  { id: "EduI24COO001", name: "Operations Lead", email: "coo@eduignite.io", role: "COO", status: "Active", isPrimary: false, avatar: "https://picsum.photos/seed/coo/150/150", permissions: { manageSchools: true, manageTeam: false, viewAnalytics: false, manageSupport: true } },
];

export default function FoundersManagementPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [founders, setFounders] = useState<any[]>([]);
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  
  const [newFounderData, setNewFounderData] = useState({
    name: "",
    email: "",
    role: "COO",
    permissions: {
      manageSchools: false,
      manageTeam: false,
      viewAnalytics: true,
      manageSupport: false
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setFounders(MOCK_FOUNDERS);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleAddFounder = async () => {
    if (!newFounderData.name || !newFounderData.email) return;
    setIsProcessing(true);
    
    // Prototype Delay
    setTimeout(() => {
      const year = new Date().getFullYear().toString().slice(-2);
      const roleCode = newFounderData.role.substring(0, 3).toUpperCase();
      const generatedId = `EduI${year}${roleCode}${Math.floor(100 + Math.random() * 899)}`;
      
      const created = {
        ...newFounderData,
        id: generatedId,
        status: "Active",
        isPrimary: false,
        avatar: `https://picsum.photos/seed/${generatedId}/150/150`,
      };
      
      setFounders([...founders, created]);
      setIsProcessing(false);
      setIsAddModalOpen(false);
      setOnboardingSuccess(created);
      setNewFounderData({ name: "", email: "", role: "COO", permissions: { manageSchools: false, manageTeam: false, viewAnalytics: true, manageSupport: false } });
      toast({ title: "Executive Onboarded", description: `${created.name} has been authorized.` });
    }, 1200);
  };

  const handleRemoveFounder = (id: string) => {
    setFounders(founders.filter(f => f.id !== id));
    toast({ variant: "destructive", title: "Access Revoked", description: "Founder decommissioned from the board." });
  };

  const handleToggleStatus = (founder: any) => {
    const newStatus = founder.status === "Active" ? "Suspended" : "Active";
    setFounders(founders.map(f => f.id === founder.id ? { ...f, status: newStatus } : f));
    toast({ title: `Board Status: ${newStatus}` });
  };

  const PermissionToggle = ({ id, label, description, checked, onChange, icon: Icon }: any) => (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer", 
      checked ? "border-primary bg-primary/5 shadow-sm" : "border-accent bg-white hover:border-primary/20"
    )} onClick={() => onChange(!checked)}>
      <div className="pt-0.5">
        <Checkbox id={id} checked={checked} onCheckedChange={() => {}} className="pointer-events-none" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", checked ? "text-primary" : "text-muted-foreground")} />
          <span className="font-black text-sm uppercase tracking-tight">{label}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight font-medium">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
              <Crown className="w-6 h-6 text-secondary fill-secondary/20" />
            </div>
            Executive Governance
          </h1>
          <p className="text-muted-foreground mt-1">Strategic board management and high-level platform authority controls.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-xl h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs">
              <UserPlus className="w-5 h-5" /> Onboard Executive
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-10 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <ShieldCheck className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Issue Platform Authority</DialogTitle>
                  <DialogDescription className="text-white/60">Initialize new board member with specialized operational permissions.</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="p-10 space-y-10 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity Name</Label>
                  <Input 
                    value={newFounderData.name} 
                    onChange={(e) => setNewFounderData({...newFounderData, name: e.target.value})} 
                    placeholder="e.g. Jean-Pierre Biya" 
                    className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Corporate Email</Label>
                  <Input 
                    value={newFounderData.email} 
                    onChange={(e) => setNewFounderData({...newFounderData, email: e.target.value})} 
                    placeholder="exec@eduignite.io" 
                    className="h-12 bg-accent/30 border-none rounded-xl" 
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Strategic Board Role</Label>
                  <Select value={newFounderData.role} onValueChange={(v) => setNewFounderData({...newFounderData, role: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-accent pb-2">
                  <ShieldAlert className="w-4 h-4 text-primary/40" />
                  <h3 className="text-xs font-black uppercase text-primary tracking-widest">Platform Authority Toggle</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PermissionToggle id="p-schools" label="Manage Schools" description="Provision nodes & verify institutional status." icon={Globe} checked={newFounderData.permissions.manageSchools} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, manageSchools: v}})} />
                  <PermissionToggle id="p-team" label="Manage Team" description="Executive board appointments & revocations." icon={UserPlus} checked={newFounderData.permissions.manageTeam} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, manageTeam: v}})} />
                  <PermissionToggle id="p-analytics" label="View Analytics" description="Access system-wide revenue & growth data." icon={TrendingUp} checked={newFounderData.permissions.viewAnalytics} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, viewAnalytics: v}})} />
                  <PermissionToggle id="p-support" label="Handle Support" description="Moderate feedback & resolve institutional issues." icon={MessageSquare} checked={newFounderData.permissions.manageSupport} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, manageSupport: v}})} />
                </div>
              </div>
            </div>
            <DialogFooter className="bg-accent/20 p-8 border-t border-accent">
              <Button 
                className="w-full h-16 rounded-2xl shadow-2xl font-black uppercase tracking-widest text-sm gap-3 bg-primary text-white hover:bg-primary/90 transition-all active:scale-95" 
                onClick={handleAddFounder} 
                disabled={isProcessing || !newFounderData.name}
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 text-secondary" />}
                Authorize Board Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Active Directors</p>
              <Crown className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-3xl font-black text-secondary">{founders.length}</div>
            <p className="text-[9px] font-bold opacity-40 uppercase mt-1">Platform Board Members</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">System Integrity</p>
              <ShieldCheck className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-black text-primary">100%</div>
            <p className="text-[9px] font-bold text-green-600 uppercase mt-1">All Founders Verified</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Access Control</p>
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-black text-primary">Biometric</div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Hardware MFA Active</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. FOUNDERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
            <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Syncing Board Registry</p>
          </div>
        ) : (
          founders.map((founder) => (
            <Card key={founder.id} className="border-none shadow-xl bg-white overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-[2.5rem]">
              <CardHeader className={cn(
                "p-8 text-white text-center pb-12 relative",
                founder.status === 'Active' ? "bg-primary" : "bg-destructive/80"
              )}>
                <div className="absolute top-4 right-4">
                  {!founder.isPrimary && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-white/40 hover:text-white hover:bg-white/10">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl p-2 border-none">
                        <DropdownMenuLabel className="text-[9px] uppercase font-black opacity-40 px-3">Board Options</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer" onClick={() => handleToggleStatus(founder)}>
                          {founder.status === 'Active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          <span className="font-bold text-xs">{founder.status === 'Active' ? 'Suspend Access' : 'Reactivate'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive gap-3 rounded-xl cursor-pointer" onClick={() => handleRemoveFounder(founder.id)}>
                          <Trash2 className="w-4 h-4" />
                          <span className="font-bold text-xs">Remove Board Member</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                <Avatar className="h-28 w-28 border-4 border-white/20 mx-auto shadow-2xl mb-6 group-hover:scale-105 transition-transform duration-500">
                  <AvatarImage src={founder.avatar} alt={founder.name} />
                  <AvatarFallback className="bg-secondary text-primary font-black text-3xl">{founder.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-xl font-black uppercase tracking-tight">{founder.name}</CardTitle>
                    {founder.isPrimary && <Crown className="w-4 h-4 text-secondary fill-secondary" />}
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white border-none mt-2 uppercase text-[9px] font-black tracking-widest px-4 py-1">
                    {founder.role}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-8 -mt-8 bg-white rounded-t-[2.5rem] space-y-8 shadow-inner">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                      <Mail className="w-3 h-3 text-primary/40" /> Verified Channel
                    </p>
                    <p className="text-sm font-bold text-primary truncate">{founder.email}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                      <Fingerprint className="w-3 h-3 text-primary/40" /> Active Privileges
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {founder.permissions.manageSchools && <Badge className="bg-blue-50 text-blue-700 border-none text-[8px] font-black">SCHOOLS</Badge>}
                      {founder.permissions.manageTeam && <Badge className="bg-purple-50 text-purple-700 border-none text-[8px] font-black">FOUNDERS</Badge>}
                      {founder.permissions.viewAnalytics && <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black">FINANCE</Badge>}
                      {founder.permissions.manageSupport && <Badge className="bg-amber-50 text-amber-700 border-none text-[8px] font-black">SUPPORT</Badge>}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        founder.status === 'Active' ? "bg-green-500 animate-pulse" : "bg-red-500"
                      )} />
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        {founder.status} Status
                      </span>
                   </div>
                   <Badge variant="outline" className="font-mono text-[9px] border-primary/10 text-primary/40">{founder.id}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 4. GOVERNANCE LOGS SECTION */}
      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white/50 backdrop-blur-sm border">
        <CardHeader className="bg-white border-b p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/5 rounded-2xl">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter leading-none">System Governance Feed</CardTitle>
                <CardDescription className="text-xs mt-1">Live immutable log of all executive-level platform interventions.</CardDescription>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl h-10 px-6 font-black uppercase text-[10px] gap-2 border-primary/10">
              <Activity className="w-4 h-4 text-primary" /> Real-time Audit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {[
                { actor: "CEO", action: "Updated Global Pricing Policy", time: "Today, 08:45 AM", impact: "Strategic" },
                { actor: "CTO", action: "Authorized High-Availability Node Sync", time: "Yesterday", impact: "System" },
                { actor: "COO", action: "Provisioned 4 New Institutional Nodes", time: "2 days ago", impact: "Operational" },
              ].map((log, i) => (
                <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b last:border-0">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary rounded-lg text-secondary">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-primary uppercase tracking-tight">{log.action}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">Executed by: {log.actor}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex flex-col items-end">
                      <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[8px] font-black uppercase tracking-widest">{log.impact}</Badge>
                      <span className="text-[9px] text-muted-foreground mt-1 font-bold italic">{log.time}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-accent/10 p-6 border-t border-accent flex justify-center">
           <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-40">End-to-End Encrypted Platform Governance</p>
           </div>
        </CardFooter>
      </Card>

      {/* APPOINTMENT RECEIPT DIALOG (SHOWN UPON SUCCESSFUL ONBOARDING) */}
      <Dialog open={!!onboardingSuccess} onOpenChange={() => setOnboardingSuccess(null)}>
        <DialogContent className="sm:max-w-2xl p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <DialogHeader className="bg-primary p-8 text-white no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black">Board Appointment Finalized</DialogTitle>
                  <DialogDescription className="text-white/60">New platform executive authorized successfully.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOnboardingSuccess(null)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-6 md:p-10 print:p-0 print:bg-white overflow-hidden">
            <div id="executive-welcome-receipt" className="bg-white p-8 md:p-12 border-2 border-black shadow-sm relative flex flex-col space-y-10 font-serif text-black print:border-none print:shadow-none">
               
               {/* EduIgnite Platform Header */}
               <div className="flex justify-between items-center border-b-4 border-black pb-6">
                  <div className="flex items-center gap-4">
                    <img src={platformSettings.logo} alt="EduIgnite" className="w-16 h-16 object-contain rounded-2xl bg-primary p-2" />
                    <div className="space-y-0.5">
                      <h2 className="font-black text-3xl uppercase tracking-tighter text-primary">{platformSettings.name}</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Executive Governance Node</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="border-black text-black font-black uppercase text-[10px] px-4 py-1">APPOINTMENT TICKET</Badge>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">ISSUED: {new Date().toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="space-y-8 text-center py-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight">Welcome to the Board</h3>
                    <p className="text-sm font-medium italic opacity-60">Strategic authorization for executive access granted to:</p>
                  </div>

                  <div className="p-8 bg-accent/10 border-2 border-dashed border-black/20 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Crown className="w-24 h-24" /></div>
                    <div className="flex flex-col items-center gap-4">
                       <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                          <AvatarImage src={onboardingSuccess?.avatar} />
                          <AvatarFallback className="text-2xl font-black">{onboardingSuccess?.name?.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div>
                          <h2 className="text-3xl font-black text-primary uppercase leading-none">{onboardingSuccess?.name}</h2>
                          <Badge className="bg-primary text-white border-none mt-2 font-black uppercase px-4 py-1">{onboardingSuccess?.role}</Badge>
                       </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 mt-8 pt-6 border-t border-black/5">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Corporate Platform Matricule</p>
                       <div className="bg-primary text-secondary px-10 py-4 rounded-2xl shadow-xl">
                          <p className="text-4xl font-mono font-black tracking-tighter leading-none">{onboardingSuccess?.id}</p>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-black/10 pt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="w-5 h-5 text-primary" />
                       <h4 className="text-xs font-black uppercase tracking-widest text-primary">Strategic Authorization</h4>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium text-muted-foreground italic">
                      "As an authorized board member of the EduIgnite SaaS platform, you are entrusted with the governance of institutional nodes and system-wide data integrity. Your unique matricule provides full access to the executive dashboard."
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="p-2 bg-white border-2 border-black rounded-xl shadow-inner">
                      <QrCode className="w-24 h-24 text-black" />
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Encrypted Governance Registry</p>
                  </div>
               </div>

               <div className="pt-8 border-t-2 border-black/5 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.2em]">Verified by</p>
                    <p className="font-black text-sm uppercase tracking-tighter">The Office of the CEO</p>
                    <img src={platformSettings.logo} alt="EduIgnite" className="w-6 h-6 grayscale opacity-20" />
                  </div>
                  <div className="text-center space-y-4 w-40">
                    <div className="h-12 w-full mx-auto relative flex items-center justify-center">
                       <Signature className="w-full h-full text-primary/20" />
                    </div>
                    <p className="text-[9px] font-black uppercase text-primary border-t border-black/20 pt-1">Platform Registrar</p>
                  </div>
               </div>

               <div className="text-center pt-6 opacity-30">
                  <p className="text-[8px] font-black uppercase tracking-[0.5em]">Vision • Innovation • Integrity</p>
               </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-8 border-t no-print flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs" onClick={() => setOnboardingSuccess(null)}>
              Return to Registry
            </Button>
            <div className="flex flex-1 gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs gap-2"
                onClick={() => toast({ title: "Welcome Packet Prepared", description: "Receipt PDF is being generated." })}
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button 
                className="flex-1 rounded-2xl h-14 shadow-2xl font-black uppercase tracking-widest text-xs gap-2 bg-primary text-white" 
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Signature({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 25C15 25 20 15 25 15C30 15 35 30 40 30C45 30 50 10 55 10C60 10 65 35 70 35C75 35 80 20 85 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 30L85 10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
    </svg>
  );
}
