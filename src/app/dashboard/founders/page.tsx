
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
  Plus, 
  Fingerprint,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Save,
  X,
  Globe,
  TrendingUp,
  Activity,
  Zap,
  History,
  Building2,
  Sparkles,
  Coins
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
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const MOCK_FOUNDERS = [
  { id: "EduI24CEO001", name: "EduIgnite Founder", email: "ceo@eduignite.io", role: "CEO", status: "Active", isPrimary: true, avatar: "https://picsum.photos/seed/ceo/150/150", permissions: { manageSchools: true, manageTeam: true, viewAnalytics: true, manageSupport: true } },
  { id: "EduI24CTO001", name: "Tech Director", email: "cto@eduignite.io", role: "CTO", status: "Active", isPrimary: false, avatar: "https://picsum.photos/seed/cto/150/150", permissions: { manageSchools: true, manageTeam: false, viewAnalytics: true, manageSupport: false } },
  { id: "EduI24COO001", name: "Operations Lead", email: "coo@eduignite.io", role: "COO", status: "Active", isPrimary: false, avatar: "https://picsum.photos/seed/coo/150/150", permissions: { manageSchools: true, manageTeam: false, viewAnalytics: false, manageSupport: true } },
];

const EXECUTIVE_LOGS = [
  { actor: "CEO", action: "Updated Global Pricing Policy", time: "Today, 08:45 AM", impact: "Strategic", icon: Crown, color: "text-primary" },
  { actor: "CTO", action: "Authorized High-Availability Node Sync", time: "Yesterday", impact: "System", icon: Zap, color: "text-indigo-600" },
  { actor: "COO", action: "Provisioned 4 New Institutional Nodes", time: "Yesterday", impact: "Operational", icon: Building2, color: "text-blue-600" },
  { actor: "Designer", action: "Updated Public Portfolio Media", time: "2 days ago", impact: "Marketing", icon: Sparkles, color: "text-cyan-600" },
  { actor: "Investor", action: "Accessed Quarterly Revenue Audit", time: "3 days ago", impact: "Financial", icon: Coins, color: "text-emerald-600" },
];

export default function FoundersManagementPage() {
  const { user, platformSettings } = useAuth();
  const { toast } = useToast();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [founders, setFounders] = useState<any[]>([]);
  
  const [newFounderData, setNewFounderData] = useState({
    name: "",
    email: "",
    role: "COO",
    permissions: { manageSchools: false, manageTeam: false, viewAnalytics: true, manageSupport: false }
  });

  const canManage = user?.role === "CEO" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    setTimeout(() => {
      setFounders(MOCK_FOUNDERS);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleAddFounder = async () => {
    if (!canManage || !newFounderData.name || !newFounderData.email) return;
    setIsProcessing(true);
    setTimeout(() => {
      const year = new Date().getFullYear().toString().slice(-2);
      const roleCode = newFounderData.role.substring(0, 3).toUpperCase();
      const generatedId = `EduI${year}${roleCode}${Math.floor(100 + Math.random() * 899)}`;
      setFounders([...founders, { ...newFounderData, id: generatedId, status: "Active", avatar: `https://picsum.photos/seed/${generatedId}/150/150` }]);
      setIsProcessing(false);
      setIsAddModalOpen(false);
      setNewFounderData({ name: "", email: "", role: "COO", permissions: { manageSchools: false, manageTeam: false, viewAnalytics: true, manageSupport: false } });
      toast({ title: "Executive Onboarded" });
    }, 1200);
  };

  const PermissionToggle = ({ label, description, checked, onChange, icon: Icon }: any) => (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-2xl border-2 transition-all", 
      canManage ? "cursor-pointer" : "cursor-default",
      checked ? "border-primary bg-primary/5 shadow-sm" : "border-accent bg-white"
    )} onClick={() => canManage && onChange(!checked)}>
      <div className="pt-0.5"><Checkbox checked={checked} onCheckedChange={() => {}} className="pointer-events-none" /></div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2"><Icon className={cn("w-4 h-4", checked ? "text-primary" : "text-muted-foreground")} /><span className="font-black text-sm uppercase tracking-tight">{label}</span></div>
        <p className="text-[10px] text-muted-foreground leading-tight">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg text-white"><Crown className="w-6 h-6 text-secondary" /></div>
            Board Governance
          </h1>
          <p className="text-muted-foreground mt-1">Strategic oversight and global authority management.</p>
        </div>
        {canManage && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-xl h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs"><UserPlus className="w-5 h-5" /> Onboard Executive</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary p-10 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><ShieldCheck className="w-8 h-8 text-secondary" /></div>
                  <div><DialogTitle className="text-2xl font-black uppercase">Issue Authority</DialogTitle><DialogDescription className="text-white/60">Initialize new board member registry.</DialogDescription></div>
                </div>
              </DialogHeader>
              <div className="p-10 space-y-10 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Identity Name</Label>
                    <Input value={newFounderData.name} onChange={(e) => setNewFounderData({...newFounderData, name: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Email</Label>
                    <Input value={newFounderData.email} onChange={(e) => setNewFounderData({...newFounderData, email: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PermissionToggle label="Schools" description="Manage institutional nodes." icon={Globe} checked={newFounderData.permissions.manageSchools} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, manageSchools: v}})} />
                  <PermissionToggle label="Analytics" description="View financial records." icon={TrendingUp} checked={newFounderData.permissions.viewAnalytics} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, viewAnalytics: v}})} />
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-8 border-t">
                <Button className="w-full h-16 rounded-2xl shadow-xl font-black uppercase text-sm" onClick={handleAddFounder} disabled={isProcessing || !newFounderData.name}>
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Board Member"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {founders.map((founder) => (
          <Card key={founder.id} className="border-none shadow-xl bg-white overflow-hidden rounded-[2.5rem]">
            <CardHeader className="p-8 text-white text-center pb-12 relative bg-primary">
              <Avatar className="h-28 w-28 border-4 border-white/20 mx-auto shadow-2xl mb-6"><AvatarImage src={founder.avatar} /><AvatarFallback>{founder.name.charAt(0)}</AvatarFallback></Avatar>
              <CardTitle className="text-xl font-black uppercase">{founder.name}</CardTitle>
              <Badge variant="secondary" className="bg-white/10 text-white border-none mt-2 uppercase text-[8px] px-4 py-1">{founder.role}</Badge>
            </CardHeader>
            <CardContent className="p-8 -mt-8 bg-white rounded-t-[2.5rem] space-y-6">
              <div className="space-y-4">
                <div className="space-y-1"><p className="text-[10px] font-black uppercase text-muted-foreground">Identity ID</p><p className="text-sm font-bold text-primary truncate">{founder.id}</p></div>
                <div className="space-y-3"><p className="text-[10px] font-black uppercase text-muted-foreground">Permissions</p><div className="flex flex-wrap gap-1.5">{founder.permissions.manageSchools && <Badge className="bg-blue-50 text-blue-700 border-none text-[8px] font-black">SCHOOLS</Badge>}{founder.permissions.viewAnalytics && <Badge className="bg-emerald-50 text-emerald-700 border-none text-[8px] font-black">FINANCE</Badge>}</div></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="bg-white border-b p-8"><CardTitle className="text-xl font-black text-primary uppercase flex items-center gap-2"><History className="w-6 h-6 text-secondary" /> Board Activity Ledger</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {EXECUTIVE_LOGS.map((log, i) => (
                <TableRow key={i} className="hover:bg-primary/5 transition-colors border-b last:border-0">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2.5 rounded-xl shadow-sm bg-white border", log.color.replace('text', 'border'))}><log.icon className={cn("w-5 h-5", log.color)} /></div>
                      <div><p className="text-xs font-black text-primary uppercase">{log.action}</p><p className="text-[10px] text-muted-foreground font-bold">Actor: {log.actor}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[8px] font-black uppercase">{log.impact}</Badge>
                    <p className="text-[9px] text-muted-foreground mt-1 font-bold italic">{log.time}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
