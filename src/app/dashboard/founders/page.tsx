
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Crown, 
  ShieldCheck, 
  Mail, 
  Briefcase, 
  Trash2, 
  MoreVertical, 
  Plus, 
  Settings2,
  Fingerprint,
  Activity,
  User,
  CheckCircle2,
  Loader2,
  Ban,
  Pencil,
  ShieldAlert,
  Save,
  X
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

const INITIAL_FOUNDERS = [
  { id: "FND-001", name: "EduIgnite Primary Founder", email: "ceo@eduignite.io", role: "CEO", avatar: "https://picsum.photos/seed/ceo/100/100", status: "Active", joined: "Jan 2023", isPrimary: true },
  { id: "FND-002", name: "Dr. Aris Tesla", email: "cto@eduignite.io", role: "CTO", avatar: "https://picsum.photos/seed/cto/100/100", status: "Active", joined: "Mar 2023", isPrimary: false },
];

const ROLES = ["CEO", "CTO", "COO", "CFO", "Investor", "Board Member", "Adviser"];

export default function FoundersManagementPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [founders, setFounders] = useState(INITIAL_FOUNDERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [newFounderData, setNewFounderData] = useState({
    name: "",
    email: "",
    role: "COO",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Mocking identification of the current viewer as the Primary Founder
  const isPrimaryFounder = true; 

  const handleAddFounder = () => {
    if (!newFounderData.name || !newFounderData.email) {
      toast({ variant: "destructive", title: "Missing Information", description: "Name and email are required." });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newFounder = {
        id: `FND-${Math.floor(100 + Math.random() * 900)}`,
        ...newFounderData,
        avatar: `https://picsum.photos/seed/${newFounderData.name}/100/100`,
        status: "Active",
        joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        isPrimary: false
      };

      setFounders(prev => [...prev, newFounder]);
      setIsAddModalOpen(false);
      setIsProcessing(false);
      setNewFounderData({ name: "", email: "", role: "COO" });
      toast({ title: "Founder Added", description: `${newFounderData.name} has been onboarded as ${newFounderData.role}.` });
    }, 1000);
  };

  const handleUpdateFounder = () => {
    if (!editFormData.name || !editFormData.email) {
      toast({ variant: "destructive", title: "Missing Information", description: "Name and email are required." });
      return;
    }

    if (!editingFounder) return;

    setIsProcessing(true);
    setTimeout(() => {
      setFounders(prev => prev.map(f => 
        f.id === editingFounder.id 
          ? { ...f, ...editFormData } 
          : f
      ));
      setEditingFounder(null);
      setIsProcessing(false);
      toast({ title: "Profile Updated", description: `${editFormData.name}'s designation has been synchronized.` });
    }, 800);
  };

  const handleRemoveFounder = (id: string) => {
    setFounders(prev => prev.filter(f => f.id !== id));
    toast({ variant: "destructive", title: "Founder Removed", description: "The access credentials have been revoked." });
  };

  const handleToggleStatus = (id: string) => {
    setFounders(prev => prev.map(f => {
      if (f.id === id) {
        const newStatus = f.status === "Active" ? "Suspended" : "Active";
        toast({
          title: `Status: ${newStatus}`,
          description: `Access for ${f.name} has been ${newStatus.toLowerCase()}.`
        });
        return { ...f, status: newStatus };
      }
      return f;
    }));
  };

  const openEditModal = (founder: any) => {
    setEditFormData({
      name: founder.name,
      email: founder.email,
      role: founder.role
    });
    setEditingFounder(founder);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
              <Crown className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? "Leadership & Founders" : "Équipe Dirigeante"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage core platform executive roles and strategic partners.
          </p>
        </div>
        
        {isPrimaryFounder && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
                <UserPlus className="w-5 h-5" /> Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary p-8 text-white">
                <DialogTitle className="text-2xl font-black">Onboard Founder</DialogTitle>
                <DialogDescription className="text-white/60">Initialize executive platform access for a core team member.</DialogDescription>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input 
                    placeholder="e.g. John Doe" 
                    className="h-12 bg-accent/30 border-none rounded-xl"
                    value={newFounderData.name}
                    onChange={(e) => setNewFounderData({...newFounderData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary Email</Label>
                  <Input 
                    placeholder="name@eduignite.io" 
                    className="h-12 bg-accent/30 border-none rounded-xl"
                    value={newFounderData.email}
                    onChange={(e) => setNewFounderData({...newFounderData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Executive Role</Label>
                  <Select value={newFounderData.role} onValueChange={(v) => setNewFounderData({...newFounderData, role: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
                <Button variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => setIsAddModalOpen(false)}>{t("cancel")}</Button>
                <Button className="flex-1 h-12 rounded-xl shadow-lg font-bold" onClick={handleAddFounder} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Onboard"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Edit Founder Dialog */}
      <Dialog open={!!editingFounder} onOpenChange={() => setEditingFounder(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-2xl font-black">Edit Designation</DialogTitle>
                <DialogDescription className="text-white/60">Modify profile parameters for {editingFounder?.name}.</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditingFounder(null)} className="text-white hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Legal Name</Label>
              <Input 
                className="h-12 bg-accent/30 border-none rounded-xl font-bold"
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Executive Email</Label>
              <Input 
                className="h-12 bg-accent/30 border-none rounded-xl"
                value={editFormData.email}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Strategic Role</Label>
              <Select value={editFormData.role} onValueChange={(v) => setEditFormData({...editFormData, role: v})}>
                <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
            <Button variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => setEditingFounder(null)}>Discard</Button>
            <Button className="flex-1 h-12 rounded-xl shadow-lg font-bold gap-2" onClick={handleUpdateFounder} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Commit Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase font-black opacity-60 tracking-widest leading-none">Core Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{founders.length} <span className="text-xs font-medium opacity-40">Founders</span></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">Access Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">Unrestricted</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Executive Registry
            </CardTitle>
            <CardDescription>Managed by the Primary Founder (CEO).</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-accent/10">
              <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                <TableHead className="pl-8 py-4">Founder Profile</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {founders.map((founder) => (
                <TableRow key={founder.id} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                        <AvatarImage src={founder.avatar} alt={founder.name} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">{founder.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary leading-none mb-1">{founder.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{founder.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-secondary/20 text-primary border-none font-black text-[10px] uppercase">
                      {founder.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">
                    {founder.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "text-[9px] font-black uppercase tracking-tighter border-none px-3",
                      founder.status === 'Active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {founder.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    {!founder.isPrimary ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-accent">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Administrative</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer" 
                            onSelect={(e) => { e.preventDefault(); openEditModal(founder); }}
                          >
                            <Pencil className="w-4 h-4 text-primary" /> Edit Designation
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleToggleStatus(founder.id)}>
                            {founder.status === 'Active' ? (
                              <><Ban className="w-4 h-4 text-amber-600" /> Suspend Access</>
                            ) : (
                              <><CheckCircle2 className="w-4 h-4 text-green-600" /> Reactivate Access</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:bg-destructive/5" onClick={() => handleRemoveFounder(founder.id)}>
                            <Trash2 className="w-4 h-4" /> Remove Team Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Badge variant="outline" className="text-[8px] opacity-30 border-none uppercase flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5" /> Primary Owner
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/20 p-4 border-t flex justify-between items-center">
           <div className="flex items-center gap-2 text-muted-foreground">
              <Fingerprint className="w-4 h-4 text-primary" />
              <p className="text-[10px] uppercase font-bold tracking-widest italic">All founder actions are logged in the secure platform audit trail.</p>
           </div>
           <Badge variant="outline" className="text-[10px] font-black border-primary/10 text-primary uppercase">Sept 2023 - Present</Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
