
"use client";

import { useState } from "react";
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
  MessageSquare
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
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";

const ROLES = ["CEO", "CTO", "COO", "CFO", "Investor", "Board Member", "Adviser"];

export default function FoundersManagementPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  const foundersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "platform_admins"));
  }, [db]);

  const { data: founders, isLoading } = useCollection(foundersQuery);

  const handleAddFounder = async () => {
    if (!newFounderData.name || !newFounderData.email) {
      toast({ variant: "destructive", title: "Missing Info", description: "Name and email are required." });
      return;
    }

    setIsProcessing(true);
    try {
      await addDoc(collection(db, "platform_admins"), {
        ...newFounderData,
        status: "Active",
        joined: serverTimestamp(),
        createdAt: serverTimestamp(),
        isPrimary: false,
        avatar: `https://picsum.photos/seed/${newFounderData.name}/100/100`,
      });

      setIsAddModalOpen(false);
      setNewFounderData({ name: "", email: "", role: "COO", permissions: { manageSchools: false, manageTeam: false, viewAnalytics: true, manageSupport: false } });
      toast({ title: "Founder Added", description: `${newFounderData.name} has been onboarded.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to onboard founder." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFounder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "platform_admins", id));
      toast({ variant: "destructive", title: "Founder Removed", description: "Access has been revoked." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to remove founder." });
    }
  };

  const handleToggleStatus = async (founder: any) => {
    const newStatus = founder.status === "Active" ? "Suspended" : "Active";
    try {
      await updateDoc(doc(db, "platform_admins", founder.id), { status: newStatus });
      toast({ title: `Status: ${newStatus}`, description: `Access for ${founder.name} has been ${newStatus.toLowerCase()}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const PermissionToggle = ({ id, label, description, checked, onChange, icon: Icon }: any) => (
    <div className={cn("flex items-start gap-3 p-3 rounded-xl border-2 transition-all", checked ? "border-primary bg-primary/5 shadow-sm" : "border-accent bg-white")}>
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-1" />
      <Label htmlFor={id} className="flex-1 cursor-pointer space-y-1">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-3.5 h-3.5", checked ? "text-primary" : "text-muted-foreground")} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight">{description}</p>
      </Label>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
              <Crown className="w-6 h-6 text-secondary" />
            </div>
            Leadership & Founders
          </h1>
          <p className="text-muted-foreground mt-1">Manage core platform executive roles and operational permissions.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl"><UserPlus className="w-5 h-5" /> Onboard Team Member</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black">Onboard Founder</DialogTitle>
              <DialogDescription className="text-white/60">Initialize executive platform access.</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <Label>Full Name</Label>
                  <Input value={newFounderData.name} onChange={(e) => setNewFounderData({...newFounderData, name: e.target.value})} placeholder="e.g. John Doe" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Primary Email</Label>
                  <Input value={newFounderData.email} onChange={(e) => setNewFounderData({...newFounderData, email: e.target.value})} placeholder="name@eduignite.io" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Executive Role</Label>
                  <Select value={newFounderData.role} onValueChange={(v) => setNewFounderData({...newFounderData, role: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest border-b pb-2">Operational Authority</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <PermissionToggle id="p-schools" label="Manage Schools" description="Control institutional nodes." icon={Globe} checked={newFounderData.permissions.manageSchools} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, manageSchools: v}})} />
                  <PermissionToggle id="p-team" label="Manage Team" description="Founder management." icon={UserPlus} checked={newFounderData.permissions.manageTeam} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, manageTeam: v}})} />
                  <PermissionToggle id="p-analytics" label="View Analytics" description="Platform financials." icon={TrendingUp} checked={newFounderData.permissions.viewAnalytics} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, viewAnalytics: v}})} />
                  <PermissionToggle id="p-support" label="Handle Support" description="Feedback registry." icon={MessageSquare} checked={newFounderData.permissions.manageSupport} onChange={(v: boolean) => setNewFounderData({...newFounderData, permissions: {...newFounderData.permissions, manageSupport: v}})} />
                </div>
              </div>
            </div>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
              <Button className="w-full h-12 rounded-xl shadow-lg font-bold" onClick={handleAddFounder} disabled={isProcessing}>{isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Onboard"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Executive Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest">
                  <TableHead className="pl-8 py-4">Founder Profile</TableHead>
                  <TableHead>Strategic Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {founders?.map((founder) => (
                  <TableRow key={founder.id} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={founder.avatar} alt={founder.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">{founder.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary leading-none mb-1">{founder.name}</span>
                          <span className="text-[10px] text-muted-foreground">{founder.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="bg-secondary/20 text-primary border-none font-black text-[10px] uppercase">{founder.role}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("text-[9px] font-black uppercase border-none px-3", founder.status === 'Active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{founder.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      {!founder.isPrimary && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-xl">
                            <DropdownMenuItem onClick={() => handleToggleStatus(founder)}>{founder.status === 'Active' ? 'Suspend Access' : 'Reactivate Access'}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleRemoveFounder(founder.id)}>Remove Team Member</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
