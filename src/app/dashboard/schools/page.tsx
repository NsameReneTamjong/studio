
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
  Upload
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

const INITIAL_SCHOOLS = [
  { id: "EDU-JOS-4015", name: "Lycée de Joss", domain: "joss.cm", principal: "Dr. Fonka Maurice", admins: 3, students: 1200, status: "Active", address: "Douala, Littoral", lat: 4.0435, lng: 9.7085, logo: "https://picsum.photos/seed/joss-logo/200/200", revenue: "2.4M", lastSync: "10 mins ago" },
  { id: "EDU-GBH-1105", name: "GBHS Yaoundé", domain: "gbhs.yaounde.edu", principal: "Mme. Ngono Celine", admins: 5, students: 2850, status: "Active", address: "Yaoundé, Centre", lat: 3.8480, lng: 11.5021, logo: "https://picsum.photos/seed/gbhs-logo/200/200", revenue: "4.8M", lastSync: "2 hours ago" },
];

export default function SchoolsManagementPage() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s));
    toast({ 
      title: "Status Updated", 
      description: "Institution status has been toggled successfully." 
    });
  };

  const handleSaveSchool = () => {
    if (!newSchoolData.name || !newSchoolData.principal) {
      toast({ variant: "destructive", title: "Missing Info", description: "School name and Principal name are required." });
      return;
    }

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
      lng: 10.0
    };

    setSchools(prev => [createdSchool, ...prev]);
    setIsAddModalOpen(false);
    setOnboardingSuccess(createdSchool);
    toast({ title: "School Onboarded", description: `Activation credentials generated for ${newSchoolData.name}.` });
  };

  const handleDeleteSchool = (id: string) => {
    setSchools(prev => prev.filter(s => s.id !== id));
    setManagedSchool(null);
    toast({ variant: "destructive", title: "Institutional Node Removed", description: "The school has been decommissioned from the platform." });
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
            {language === 'en' ? "Onboard and monitor educational instances across the SaaS network." : "Embarquez et surveillez les instances éducatives sur le réseau SaaS."}
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
              <DialogDescription className="text-white/60">Initialize a new institutional instance on the platform.</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Institution Name</Label>
                <Input 
                  placeholder="e.g. Lycée de Joss" 
                  className="h-12 bg-accent/30 border-none rounded-xl"
                  value={newSchoolData.name}
                  onChange={(e) => setNewSchoolData({...newSchoolData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Principal / Head Name</Label>
                <Input 
                  placeholder="e.g. Dr. Jean Dupont" 
                  className="h-12 bg-accent/30 border-none rounded-xl"
                  value={newSchoolData.principal}
                  onChange={(e) => setNewSchoolData({...newSchoolData, principal: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Institution Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-accent/30 border border-dashed border-primary/20 flex items-center justify-center overflow-hidden">
                    <img src={newSchoolData.logo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2">
                    <Upload className="w-4 h-4" /> Upload Logo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary Domain</Label>
                <Input 
                  placeholder="school.edu" 
                  className="h-12 bg-accent/30 border-none rounded-xl"
                  value={newSchoolData.domain}
                  onChange={(e) => setNewSchoolData({...newSchoolData, domain: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
              <Button variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => setIsAddModalOpen(false)}>{t("cancel")}</Button>
              <Button className="flex-1 h-12 rounded-xl shadow-lg font-bold" onClick={handleSaveSchool}>Onboard Institution</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={language === 'en' ? "Search institutions by name, domain or matricule..." : "Chercher par nom, domaine ou matricule..."}
            className="pl-10 border-none bg-transparent focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent"><MoreVertical className="w-4 h-4"/></Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-accent">
                   <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Institutional Actions</DropdownMenuLabel>
                   <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setManagedSchool(school)}>
                     <Settings2 className="w-4 h-4 text-primary" /> Configuration Suite
                   </DropdownMenuItem>
                   <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleToggleStatus(school.id)}>
                     {school.status === 'Active' ? (
                       <><Ban className="w-4 h-4 text-destructive" /> Suspend License</>
                     ) : (
                       <><CheckCircle2 className="w-4 h-4 text-green-600" /> Reactivate License</>
                     )}
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:bg-destructive/5" onClick={() => handleDeleteSchool(school.id)}>
                     <Trash2 className="w-4 h-4" /> Decommission Node
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
            </div>
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/5">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-black text-primary">{school.name}</CardTitle>
                  <Badge variant={school.status === "Active" ? "default" : "destructive"} className="text-[10px] h-4 px-2 uppercase font-black">
                    {school.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 mt-1 text-xs font-medium">
                  <Globe className="w-3 h-3" /> {school.domain}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="py-4 border-y border-accent/50 space-y-4 bg-accent/5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-tighter">
                  <User className="w-4 h-4" /> Principal
                </div>
                <span className="font-bold text-primary text-xs">{school.principal}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-tighter">
                  <ShieldCheck className="w-4 h-4" /> Matricule
                </div>
                <span className="font-mono font-black text-primary text-xs">{school.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-tighter">
                  <Users className="w-4 h-4" /> Enrolled
                </div>
                <span className="font-black text-primary">{school.students.toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 font-black uppercase text-[10px] tracking-widest bg-white"
                onClick={() => setManagedSchool(school)}
              >
                <Eye className="w-3.5 h-3.5 mr-2" /> Manage
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-1 flex-1 font-black uppercase text-[10px] tracking-widest shadow-sm"
                onClick={() => setSelectedMapSchool(school)}
              >
                <MapPin className="w-3.5 h-3.5 mr-1" /> {t("viewMap")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Institutional Command Center Dialog */}
      <Dialog open={!!managedSchool} onOpenChange={() => setManagedSchool(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className={cn(
            "p-8 text-white relative",
            managedSchool?.status === 'Active' ? "bg-primary" : "bg-destructive"
          )}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 flex items-center justify-center shrink-0 shadow-2xl">
                <img src={managedSchool?.logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                  <DialogTitle className="text-4xl font-black tracking-tight">{managedSchool?.name}</DialogTitle>
                  <Badge className="bg-secondary text-primary border-none font-black h-6">{managedSchool?.status}</Badge>
                </div>
                <DialogDescription className="text-white/70 text-lg flex items-center justify-center md:justify-start gap-4">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4"/> Principal: {managedSchool?.principal}</span>
                  <span className="opacity-30">|</span>
                  <span className="flex items-center gap-1.5 font-mono">ID: {managedSchool?.id}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-sm bg-accent/30 border border-accent">
                <CardContent className="pt-6">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Total Users</p>
                  <p className="text-2xl font-black text-primary">{managedSchool?.students + managedSchool?.admins}</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-accent/30 border border-accent">
                <CardContent className="pt-6">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">SaaS Revenue</p>
                  <p className="text-2xl font-black text-primary">{managedSchool?.revenue} XAF</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-accent/30 border border-accent">
                <CardContent className="pt-6">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Infrastructure</p>
                  <Badge className="bg-green-100 text-green-700 border-none font-black">HEALTHY</Badge>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-accent/30 border border-accent">
                <CardContent className="pt-6">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Last Sync</p>
                  <p className="text-xs font-bold text-primary flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> {managedSchool?.lastSync}</p>
                </CardContent>
              </Card>
            </div>

            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b pb-2">
                <Settings2 className="w-4 h-4" /> Administrative Control Panel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                    <h4 className="font-bold text-primary flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Licensing & Access</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Control the operational status of this institutional node. Suspending a license immediately restricts login access for all students, staff, and parents linked to this matricule.
                    </p>
                    <Button 
                      variant={managedSchool?.status === 'Active' ? 'destructive' : 'default'} 
                      className="w-full font-black uppercase tracking-widest text-xs h-11"
                      onClick={() => handleToggleStatus(managedSchool.id)}
                    >
                      {managedSchool?.status === 'Active' ? 'Suspend Operational Node' : 'Reactivate Operational Node'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                    <h4 className="font-bold text-primary flex items-center gap-2"><CreditCard className="w-4 h-4"/> SaaS Billing Registry</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Review subscription tiers and outstanding platform service fees for this institution.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 text-[10px] font-black uppercase">View Invoices</Button>
                      <Button variant="outline" className="flex-1 text-[10px] font-black uppercase">Adjust Tier</Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t flex justify-between items-center">
            <Button variant="ghost" className="text-destructive font-black uppercase tracking-widest text-[10px]" onClick={() => handleDeleteSchool(managedSchool.id)}>
              Permanently Decommission Node
            </Button>
            <Button onClick={() => setManagedSchool(null)} className="px-10 h-12 shadow-lg font-black uppercase tracking-widest text-xs rounded-2xl">Close Command Center</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* INSTITUTIONAL ACTIVATION RECEIPT DIALOG */}
      <Dialog open={!!onboardingSuccess} onOpenChange={() => setOnboardingSuccess(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="bg-green-600 p-8 text-white no-print">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">Onboarding Successful!</DialogTitle>
                <DialogDescription className="text-white/80">Institutional node activated. Provide this receipt to the Principal.</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div id="printable-receipt" className="p-12 bg-white font-serif text-black min-h-[850px] relative overflow-hidden print:p-0">
            {/* EduIgnite Platform Header */}
            <div className="flex flex-col items-center text-center space-y-4 border-b-4 border-primary pb-8 mb-10">
              <div className="p-4 bg-primary rounded-[2rem] shadow-2xl mb-2">
                <Building2 className="w-16 h-16 text-secondary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl font-black tracking-tighter text-primary font-headline">EduIgnite SaaS</h2>
                <p className="text-[10px] uppercase font-black tracking-[0.5em] text-muted-foreground">Digital Academic Infrastructure</p>
              </div>
            </div>

            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl font-black uppercase underline decoration-2 underline-offset-8">
                Institutional Activation Receipt
              </h1>
              <p className="text-lg font-medium italic opacity-70">Official Node Registration Confirmation</p>
            </div>

            <div className="grid grid-cols-12 gap-12">
              {/* Receipt Body - Left */}
              <div className="col-span-4 space-y-8">
                <div className="w-full aspect-square border-4 border-accent bg-accent/5 rounded-3xl overflow-hidden flex items-center justify-center p-4 shadow-inner">
                  <img src={onboardingSuccess?.logo} alt="School Logo" className="w-full h-full object-contain" />
                </div>
                
                <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 text-center space-y-2 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-black uppercase px-3 py-1 rounded-full">Matricule ID</div>
                  <p className="text-3xl font-mono font-black text-primary select-all pt-2">{onboardingSuccess?.id}</p>
                  <p className="text-[9px] font-bold text-muted-foreground italic">Required for first-time administrative login.</p>
                </div>

                <div className="flex flex-col items-center gap-2 pt-4">
                  <div className="p-2 border-2 border-accent rounded-2xl bg-white shadow-sm">
                    <QrCode className="w-32 h-32 opacity-20 text-primary" />
                  </div>
                  <p className="text-[8px] font-black uppercase opacity-40">Scan to Verify Infrastructure</p>
                </div>
              </div>

              {/* Receipt Body - Right */}
              <div className="col-span-8 space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-accent pb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <h3 className="font-black uppercase text-sm tracking-widest text-primary">Institution Identity</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-y-6 text-sm">
                    <div>
                      <p className="font-bold uppercase opacity-40 text-[9px] block mb-1">Official School Name</p>
                      <p className="font-black text-xl uppercase text-primary leading-tight">{onboardingSuccess?.name}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase opacity-40 text-[9px] block mb-1">Onboarded Principal</p>
                      <p className="font-black text-lg text-primary">{onboardingSuccess?.principal}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-bold uppercase opacity-40 text-[9px] block mb-1">Assigned Operational Domain</p>
                      <p className="font-bold text-base text-primary flex items-center gap-2"><Globe className="w-4 h-4 opacity-40"/> {onboardingSuccess?.domain}</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-accent pb-2">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="font-black uppercase text-sm tracking-widest text-primary">Activation Message</h3>
                  </div>
                  <div className="p-6 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 space-y-4">
                    <p className="text-sm leading-relaxed italic text-muted-foreground">
                      Welcome to the EduIgnite network. Your institutional node is now active. As the primary administrator, please use your **Institutional Matricule** to initialize the pedagogical and financial registries. Ensure that all faculty and staff are registered under their respective sections (Anglophone, Francophone, or Technical) to maintain structural integrity.
                    </p>
                    <div className="p-4 bg-white border rounded-xl flex items-center gap-4">
                       <ShieldCheck className="w-8 h-8 text-green-600" />
                       <div>
                          <p className="text-xs font-black uppercase text-primary leading-none">Security Protocol Active</p>
                          <p className="text-[10px] text-muted-foreground mt-1">This node is cryptographically linked to the SaaS core infrastructure.</p>
                       </div>
                    </div>
                  </div>
                </section>

                <div className="mt-12 grid grid-cols-2 gap-16 pt-12">
                  <div className="text-center space-y-10">
                    <div className="h-px bg-black/20 w-full" />
                    <div>
                      <p className="font-bold text-[10px] uppercase">Regional Registrar</p>
                      <p className="text-[8px] opacity-40 italic">Signature & Date</p>
                    </div>
                  </div>
                  <div className="text-center space-y-10 relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-10">
                       <Signature className="w-16 h-16 -rotate-12" />
                    </div>
                    <div className="h-px bg-black/20 w-full" />
                    <div>
                      <p className="font-bold text-[10px] uppercase">SaaS System Administrator</p>
                      <p className="text-[10px] font-black text-primary font-headline">EduIgnite Platform Seal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 inset-x-0 text-center">
               <p className="text-[9px] uppercase font-black opacity-20 tracking-[0.4em]">
                 OFFICIAL ACTIVATION RECEIPT • NODE: {onboardingSuccess?.id}
               </p>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t no-print flex sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 gap-2 rounded-xl h-12" onClick={() => setOnboardingSuccess(null)}>
              Dismiss
            </Button>
            <Button className="flex-1 gap-2 rounded-xl h-12 shadow-lg font-bold" onClick={() => window.print()}>
              <Printer className="w-5 h-5" /> Print Activation Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mock Google Maps Dialog */}
      <Dialog open={!!selectedMapSchool} onOpenChange={() => setSelectedMapSchool(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-3xl border-none">
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <div>
                <h3 className="font-bold">{selectedMapSchool?.name}</h3>
                <p className="text-xs opacity-80">{selectedMapSchool?.address}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedMapSchool(null)} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="aspect-video bg-accent/20 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
            <div className="z-10 text-center space-y-4">
              <div className="bg-white p-4 rounded-full shadow-2xl inline-block animate-bounce">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">GPS Coordinates</p>
                <p className="font-bold text-primary">{selectedMapSchool?.lat}, {selectedMapSchool?.lng}</p>
              </div>
            </div>
            <img 
              src={`https://picsum.photos/seed/${selectedMapSchool?.id}/800/450`} 
              alt="Map view"
              className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
              data-ai-hint="satellite map"
            />
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg border text-[10px] font-bold">
               Google Maps (Mock)
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
