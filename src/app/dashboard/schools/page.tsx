
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Settings2,
  Loader2,
  Globe
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

export default function SchoolsManagementPage() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const { schools, addSchool, toggleSchoolStatus, deleteSchool } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [managedSchool, setManagedSchool] = useState<any>(null);
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  
  const [newSchoolData, setNewSchoolData] = useState({
    name: "",
    principal: "",
    domain: "",
    address: "",
    motto: "Discipline - Work - Success",
    description: "New Institutional Node",
    logo: "https://picsum.photos/seed/newschool/200/200",
    banner: "https://picsum.photos/seed/school-banner/1200/400"
  });

  const filteredSchools = schools?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSaveSchool = async () => {
    if (!newSchoolData.name || !newSchoolData.principal) return;
    setIsProcessing(true);
    
    // Prototype Delay
    setTimeout(() => {
      const generatedId = `EDU-${newSchoolData.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const created = {
        ...newSchoolData,
        id: generatedId,
        location: "Douala, Littoral",
        region: "Littoral",
        division: "Wouri",
        subDivision: "Douala 1er",
        cityVillage: "Douala",
        phone: "+237 600 00 00 00",
        email: `admin@${newSchoolData.domain || 'school.edu'}`,
      };
      
      addSchool(created);
      setIsProcessing(false);
      setIsAddModalOpen(false);
      setOnboardingSuccess(created);
      toast({ title: "School Onboarded" });
    }, 1000);
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
        <Input placeholder="Search institutions by name, id or domain..." className="border-none bg-transparent focus-visible:ring-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group bg-white">
            <div className="absolute top-0 right-0 p-4">
               <DropdownMenu>
                 <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="w-4 h-4"/></Button></DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                   <DropdownMenuItem onClick={() => setManagedSchool(school)}><Settings2 className="w-4 h-4 mr-2" /> Manage</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => toggleSchoolStatus(school.id)}>{school.status === 'Active' ? 'Suspend' : 'Reactivate'}</DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem className="text-destructive" onClick={() => deleteSchool(school.id)}><Trash2 className="w-4 h-4 mr-2" /> Decommission</DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
            </div>
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl"><Building2 className="w-6 h-6 text-primary" /></div>
              <div>
                <CardTitle className="text-lg font-black">{school.name}</CardTitle>
                <Badge className={cn(
                  "text-[9px] font-black uppercase border-none px-3 mt-1",
                  school.status === 'Active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {school.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-4 border-y border-accent/50 space-y-2 bg-accent/5">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground font-bold">Principal</span><span className="font-bold">{school.principal}</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground font-bold">Matricule</span><span className="font-mono font-black">{school.id}</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground font-bold">Domain</span><span className="font-bold text-primary">{school.domain || "node.eduignite.cm"}</span></div>
            </CardContent>
            <CardFooter className="pt-4"><Button variant="outline" className="w-full text-[10px] font-black uppercase" onClick={() => setManagedSchool(school)}>Configuration Suite</Button></CardFooter>
          </Card>
        ))}
      </div>

      {/* Managed School Dialog */}
      <Dialog open={!!managedSchool} onOpenChange={() => setManagedSchool(null)}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className={cn("p-8 text-white", managedSchool?.status === 'Active' ? "bg-primary" : "bg-destructive")}>
            <DialogTitle className="text-3xl font-black">{managedSchool?.name}</DialogTitle>
            <p className="opacity-70">Matricule: {managedSchool?.id}</p>
          </DialogHeader>
          <div className="p-8 space-y-4">
            <div className="bg-accent/20 p-6 rounded-2xl border border-accent space-y-4">
               <h3 className="font-black text-primary uppercase text-xs tracking-widest">Node Quick Actions</h3>
               <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="w-full justify-between h-12" onClick={() => { toggleSchoolStatus(managedSchool.id); setManagedSchool(null); }}>
                    Toggle License Status {managedSchool?.status === 'Active' ? <Ban className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </Button>
                  <Button variant="destructive" className="w-full justify-between h-12" onClick={() => { deleteSchool(managedSchool.id); setManagedSchool(null); }}>
                    Permanently Decommission <Trash2 className="w-4 h-4" />
                  </Button>
               </div>
            </div>
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
