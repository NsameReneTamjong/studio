
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Plus, 
  Search, 
  Users, 
  ShieldCheck, 
  Globe, 
  MoreVertical, 
  MapPin, 
  X, 
  FileCheck, 
  Printer, 
  Download, 
  QrCode, 
  Signature, 
  Info,
  CheckCircle2,
  Ban,
  Activity,
  CreditCard,
  History,
  Settings2,
  Trash2,
  Eye,
  User,
  Upload,
  Loader2
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";

export default function SchoolsManagementPage() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMapSchool, setSelectedMapSchool] = useState<any>(null);
  const [managedSchool, setManagedSchool] = useState<any>(null);
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  
  const [newSchoolData, setNewSchoolData] = useState({
    name: "",
    principal: "",
    domain: "",
    address: "",
    logo: "https://picsum.photos/seed/newschool/200/200"
  });

  const schoolsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "schools"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: schools, isLoading } = useCollection(schoolsQuery);

  const filteredSchools = schools?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateDoc(doc(db, "schools", id), { status: newStatus });
      toast({ title: "Status Updated", description: `Institution is now ${newStatus}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const handleSaveSchool = async () => {
    if (!newSchoolData.name || !newSchoolData.principal) {
      toast({ variant: "destructive", title: "Missing Info", description: "School name and Principal name are required." });
      return;
    }

    setIsProcessing(true);
    try {
      const generatedId = `EDU-${newSchoolData.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const createdSchool = {
        ...newSchoolData,
        id: generatedId,
        status: "Active",
        admins: 1,
        students: 0,
        revenue: "0",
        lastSync: "Just now",
        lat: 4.0,
        lng: 10.0,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "schools"), createdSchool);
      setIsAddModalOpen(false);
      setOnboardingSuccess({ ...createdSchool, docId: docRef.id });
      toast({ title: "School Onboarded", description: `Activation credentials generated for ${newSchoolData.name}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to onboard school." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSchool = async (id: string) => {
    try {
      await deleteDoc(doc(db, "schools", id));
      setManagedSchool(null);
      toast({ variant: "destructive", title: "Institutional Node Removed", description: "The school has been decommissioned." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to remove node." });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
              <Building2 className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? "Institutional Nodes" : "Gestion des Nœuds"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Onboard and monitor educational instances across the SaaS network.
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
              <Plus className="w-5 h-5" /> {t("addSchool")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black">{t("addSchool")}</DialogTitle>
              <DialogDescription className="text-white/60">Initialize a new institutional instance.</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Institution Name</Label>
                <Input value={newSchoolData.name} onChange={(e) => setNewSchoolData({...newSchoolData, name: e.target.value})} placeholder="e.g. Lycée de Joss" className="h-12 bg-accent/30 border-none rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Principal / Head Name</Label>
                <Input value={newSchoolData.principal} onChange={(e) => setNewSchoolData({...newSchoolData, principal: e.target.value})} placeholder="e.g. Dr. Jean Dupont" className="h-12 bg-accent/30 border-none rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary Domain</Label>
                <Input value={newSchoolData.domain} onChange={(e) => setNewSchoolData({...newSchoolData, domain: e.target.value})} placeholder="school.edu" className="h-12 bg-accent/30 border-none rounded-xl" />
              </div>
            </div>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
              <Button variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => setIsAddModalOpen(false)}>{t("cancel")}</Button>
              <Button className="flex-1 h-12 rounded-xl shadow-lg font-bold" onClick={handleSaveSchool} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Onboard Institution"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={language === 'en' ? "Search institutions..." : "Chercher des institutions..."}
            className="pl-10 border-none bg-transparent focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        </div>
      ) : filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent"><MoreVertical className="w-4 h-4"/></Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-accent">
                     <DropdownMenuItem onClick={() => setManagedSchool(school)}>
                       <Settings2 className="w-4 h-4 text-primary mr-2" /> Configuration Suite
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleToggleStatus(school.id, school.status)}>
                       {school.status === 'Active' ? <Ban className="w-4 h-4 text-destructive mr-2" /> : <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />}
                       {school.status === 'Active' ? 'Suspend License' : 'Reactivate License'}
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteSchool(school.id)}>
                       <Trash2 className="w-4 h-4 mr-2" /> Decommission Node
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
              </div>
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/5">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-black text-primary">{school.name}</CardTitle>
                  <Badge variant={school.status === "Active" ? "default" : "destructive"} className="text-[10px] h-4 px-2 uppercase font-black mt-1">
                    {school.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-4 border-y border-accent/50 space-y-4 bg-accent/5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-bold text-xs uppercase tracking-tighter flex items-center gap-2"><User className="w-4 h-4"/> Principal</span>
                  <span className="font-bold text-primary text-xs">{school.principal}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-bold text-xs uppercase tracking-tighter flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Matricule</span>
                  <span className="font-mono font-black text-primary text-xs">{school.id}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-white font-black text-[10px] uppercase tracking-widest" onClick={() => setManagedSchool(school)}>Manage</Button>
                <Button variant="secondary" size="sm" className="flex-1 font-black text-[10px] uppercase tracking-widest" onClick={() => setSelectedMapSchool(school)}>Map</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-3xl border-2 border-dashed">
          <Building2 className="w-16 h-16 text-primary/10" />
          <p className="text-muted-foreground">No institutional nodes found matching your search.</p>
        </div>
      )}

      {/* Managed School Dialog */}
      <Dialog open={!!managedSchool} onOpenChange={() => setManagedSchool(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className={cn("p-8 text-white", managedSchool?.status === 'Active' ? "bg-primary" : "bg-destructive")}>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/10 p-4 border border-white/20 flex items-center justify-center shrink-0">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black">{managedSchool?.name}</DialogTitle>
                <p className="opacity-70 text-lg">Matricule: {managedSchool?.id}</p>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                <h4 className="font-bold text-primary flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Licensing Control</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Suspending a license restricts dashboard access for all associated accounts.</p>
                <Button 
                  variant={managedSchool?.status === 'Active' ? 'destructive' : 'default'} 
                  className="w-full font-black uppercase text-xs"
                  onClick={() => handleToggleStatus(managedSchool.id, managedSchool.status)}
                >
                  {managedSchool?.status === 'Active' ? 'Suspend License' : 'Reactivate License'}
                </Button>
              </div>
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                <h4 className="font-bold text-primary flex items-center gap-2"><Trash2 className="w-4 h-4"/> Decommission Node</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Irreversibly remove this school and all its data from the platform.</p>
                <Button variant="outline" className="w-full text-destructive hover:bg-destructive/5 font-black uppercase text-xs" onClick={() => handleDeleteSchool(managedSchool.id)}>Permanently Decommission</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activation Receipt */}
      <Dialog open={!!onboardingSuccess} onOpenChange={() => setOnboardingSuccess(null)}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-green-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-10 h-10" />
              <DialogTitle className="text-2xl font-black">Activation Successful</DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6 text-center">
            <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 space-y-2">
              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Institutional Matricule ID</p>
              <p className="text-4xl font-mono font-black text-primary select-all">{onboardingSuccess?.id}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">Provide this unique ID to the School Administrator. It is required for their first-time login and platform initialization.</p>
            <Button onClick={() => window.print()} className="w-full h-12 rounded-xl shadow-lg font-bold gap-2"><Printer className="w-4 h-4" /> Print Activation Receipt</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
