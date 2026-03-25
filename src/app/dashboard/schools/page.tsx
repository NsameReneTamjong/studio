
"use client";

import { useState, useEffect } from "react";
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

const MOCK_SCHOOLS = [
  { id: "GBHS26", name: "GBHS Deido", principal: "Dr. Fonka", domain: "gbhsdeido.cm", status: "Active", createdAt: new Date() },
  { id: "JOSS26", name: "Lycée de Joss", principal: "Mme. Njoh", domain: "lyceejoss.cm", status: "Active", createdAt: new Date() },
];

export default function SchoolsManagementPage() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<any[]>([]);
  const [managedSchool, setManagedSchool] = useState<any>(null);
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  
  const [newSchoolData, setNewSchoolData] = useState({
    name: "",
    principal: "",
    domain: "",
    address: "",
    logo: "https://picsum.photos/seed/newschool/200/200"
  });

  useEffect(() => {
    setTimeout(() => {
      setSchools(MOCK_SCHOOLS);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setSchools(schools.map(s => s.id === id ? { ...s, status: newStatus } : s));
    toast({ title: "Status Updated", description: `Institution is now ${newStatus}.` });
  };

  const handleSaveSchool = async () => {
    if (!newSchoolData.name || !newSchoolData.principal) return;
    setIsProcessing(true);
    setTimeout(() => {
      const generatedId = `EDU-${newSchoolData.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const created = {
        ...newSchoolData,
        id: generatedId,
        status: "Active",
        createdAt: new Date()
      };
      setSchools([created, ...schools]);
      setIsProcessing(false);
      setIsAddModalOpen(false);
      setOnboardingSuccess(created);
      toast({ title: "School Onboarded" });
    }, 1000);
  };

  const handleDeleteSchool = (id: string) => {
    setSchools(schools.filter(s => s.id !== id));
    setManagedSchool(null);
    toast({ variant: "destructive", title: "Institutional Node Removed" });
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
          <p className="text-muted-foreground mt-1">Onboard and monitor educational instances across the SaaS network.</p>
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
              <div className="space-y-2"><Label>Institution Name</Label><Input value={newSchoolData.name} onChange={(e) => setNewSchoolData({...newSchoolData, name: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" /></div>
              <div className="space-y-2"><Label>Principal Name</Label><Input value={newSchoolData.principal} onChange={(e) => setNewSchoolData({...newSchoolData, principal: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" /></div>
              <div className="space-y-2"><Label>Primary Domain</Label><Input value={newSchoolData.domain} onChange={(e) => setNewSchoolData({...newSchoolData, domain: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" /></div>
            </div>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
              <Button className="w-full h-12 rounded-xl shadow-lg font-bold" onClick={handleSaveSchool} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Onboard Institution"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border">
        <Search className="w-4 h-4 text-muted-foreground ml-2" />
        <Input placeholder="Search institutions..." className="border-none bg-transparent focus-visible:ring-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="w-4 h-4"/></Button></DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                     <DropdownMenuItem onClick={() => setManagedSchool(school)}><Settings2 className="w-4 h-4 mr-2" /> Manage</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleToggleStatus(school.id, school.status)}>{school.status === 'Active' ? 'Suspend' : 'Reactivate'}</DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteSchool(school.id)}><Trash2 className="w-4 h-4 mr-2" /> Decommission</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
              </div>
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl"><Building2 className="w-6 h-6 text-primary" /></div>
                <div><CardTitle className="text-lg font-black">{school.name}</CardTitle><Badge className="text-[10px] mt-1">{school.status}</Badge></div>
              </CardHeader>
              <CardContent className="py-4 border-y border-accent/50 space-y-2 bg-accent/5">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground font-bold">Principal</span><span className="font-bold">{school.principal}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground font-bold">Matricule</span><span className="font-mono font-black">{school.id}</span></div>
              </CardContent>
              <CardFooter className="pt-4"><Button variant="outline" className="w-full text-[10px] font-black uppercase" onClick={() => setManagedSchool(school)}>Configuration Suite</Button></CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Managed School Dialog */}
      <Dialog open={!!managedSchool} onOpenChange={() => setManagedSchool(null)}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className={cn("p-8 text-white", managedSchool?.status === 'Active' ? "bg-primary" : "bg-destructive")}>
            <DialogTitle className="text-3xl font-black">{managedSchool?.name}</DialogTitle>
            <p className="opacity-70">Matricule: {managedSchool?.id}</p>
          </DialogHeader>
          <div className="p-8 space-y-4">
            <Button variant="outline" className="w-full" onClick={() => handleToggleStatus(managedSchool.id, managedSchool.status)}>Toggle License Status</Button>
            <Button variant="destructive" className="w-full" onClick={() => handleDeleteSchool(managedSchool.id)}>Permanently Decommission</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Activation Receipt */}
      <Dialog open={!!onboardingSuccess} onOpenChange={() => setOnboardingSuccess(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl text-center">
          <DialogHeader className="bg-green-600 p-8 text-white">
            <DialogTitle className="text-2xl font-black">Activation Successful</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10">
              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Institutional Matricule ID</p>
              <p className="text-4xl font-mono font-black text-primary">{onboardingSuccess?.id}</p>
            </div>
            <p className="text-sm text-muted-foreground italic">Provide this unique ID to the School Administrator.</p>
            <Button onClick={() => setOnboardingSuccess(null)} className="w-full h-12 rounded-xl shadow-lg font-bold">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
