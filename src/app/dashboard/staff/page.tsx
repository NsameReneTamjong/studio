
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Search, 
  MoreVertical, 
  UserPlus,
  Trash2,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Printer,
  Mail,
  Loader2,
  Pencil,
  Ban,
  User,
  Building2,
  Fingerprint,
  X,
  UserCheck,
  UserX
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section", "Cross-Sectional"];

const MOCK_STAFF = [
  { id: "GBHS26T001", uid: "T1", name: "Dr. Aris Tesla", role: "TEACHER", section: "Anglophone Section", avatar: "https://picsum.photos/seed/t1/100/100", status: "active" },
  { id: "GBHS26B001", uid: "B1", name: "Mme. Ngono Celine", role: "BURSAR", section: "Cross-Sectional", avatar: "https://picsum.photos/seed/b1/100/100", status: "active" },
];

export default function StaffManagementPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaff] = useState<any[]>([]);
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  
  // View/Edit States
  const [viewingStaff, setViewingStaff] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "TEACHER",
    section: "Anglophone Section",
  });

  useEffect(() => {
    setTimeout(() => {
      setStaff(MOCK_STAFF);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredStaff = staff.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = async () => {
    if (!formData.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      const generatedId = `GBHS26${formData.role.charAt(0)}00${staff.length + 1}`;
      const created = {
        ...formData,
        id: generatedId,
        uid: Math.random().toString(),
        avatar: `https://picsum.photos/seed/${generatedId}/100/100`,
        status: "active"
      };
      setStaff([...staff, created]);
      setIsProcessing(false);
      setIsAddModalOpen(false);
      setOnboardingSuccess(created);
      setFormData({ name: "", role: "TEACHER", section: "Anglophone Section" });
      toast({ title: "Staff Onboarded", description: `Unique ID: ${generatedId}` });
    }, 1000);
  };

  const handleEditStaff = () => {
    if (!editingStaff.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      setStaff(prev => prev.map(s => s.uid === editingStaff.uid ? editingStaff : s));
      setIsProcessing(false);
      setEditingStaff(null);
      toast({ title: "Profile Updated", description: `${editingStaff.name}'s records have been synced.` });
    }, 800);
  };

  const handleToggleStaffStatus = (uid: string) => {
    setStaff(prev => prev.map(s => {
      if (s.uid === uid) {
        const nextStatus = s.status === "active" ? "inactive" : "active";
        toast({ 
          title: nextStatus === "active" ? "Access Restored" : "Access Suspended", 
          description: `${s.name} is now ${nextStatus}.` 
        });
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TEACHER': return 'bg-purple-100 text-purple-700';
      case 'SCHOOL_ADMIN': return 'bg-blue-100 text-blue-700';
      case 'BURSAR': return 'bg-green-100 text-green-700';
      case 'LIBRARIAN': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            Institutional Staff
          </h1>
          <p className="text-muted-foreground mt-1">Manage educational professionals and administrative personnel.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
              <UserPlus className="w-5 h-5" /> Onboard Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black">Register New Staff</DialogTitle>
              <DialogDescription className="text-white/60">Complete the profile to generate appointment records.</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Full Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
                  placeholder="e.g. Dr. Jean Dupont"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="BURSAR">Bursar</SelectItem>
                      <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Section</Label>
                  <Select value={formData.section} onValueChange={(v) => setFormData({...formData, section: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
              <Button onClick={handleAddStaff} className="w-full h-12 rounded-xl shadow-lg font-bold" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Onboard & Generate Record"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, ID..." 
              className="pl-10 h-12 bg-accent/20 border-none rounded-xl" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                  <TableHead className="pl-8 py-4">Staff ID</TableHead>
                  <TableHead>Professional Profile</TableHead>
                  <TableHead className="text-center">Section</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((s) => (
                  <TableRow key={s.uid} className="group hover:bg-accent/5 border-b border-accent/10">
                    <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{s.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary leading-none mb-1">{s.name}</span>
                          <Badge variant="outline" className={cn("w-fit text-[8px] h-4 uppercase border-none tracking-tighter", getRoleColor(s.role))}>{s.role}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs font-bold text-primary">{s.section}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-3 border-none",
                        s.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5">
                            <MoreVertical className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-none">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black opacity-40 px-4 py-2">Dossier Options</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={() => setViewingStaff(s)}>
                            <Eye className="w-4 h-4 text-primary/60" /> 
                            <span className="font-bold text-xs">View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={() => setEditingStaff({...s})}>
                            <Pencil className="w-4 h-4 text-primary/60" /> 
                            <span className="font-bold text-xs">Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-accent" />
                          <DropdownMenuItem 
                            className={cn(
                              "gap-3 px-4 py-2.5 cursor-pointer",
                              s.status === "active" ? "text-destructive hover:bg-red-50" : "text-green-600 hover:bg-green-50"
                            )}
                            onClick={() => handleToggleStaffStatus(s.uid)}
                          >
                            {s.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            <span className="font-bold text-xs">{s.status === "active" ? "Deactivate" : "Activate"}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStaff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">No staff members found matching your search.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* VIEW PROFILE DIALOG */}
      <Dialog open={!!viewingStaff} onOpenChange={() => setViewingStaff(null)}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-2xl shrink-0">
                <AvatarImage src={viewingStaff?.avatar} />
                <AvatarFallback className="text-3xl text-primary bg-white font-black">{viewingStaff?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-3xl font-black">{viewingStaff?.name}</DialogTitle>
                  <Badge className="bg-secondary text-primary border-none font-black h-6">{viewingStaff?.role}</Badge>
                </div>
                <div className="flex items-center gap-4 text-white/60 font-mono text-xs">
                  <span className="flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5" /> ID: {viewingStaff?.id}</span>
                  <span className="opacity-30">|</span>
                  <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {viewingStaff?.section}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setViewingStaff(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-10 space-y-8">
            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
              <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary" /> Operational Authority
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground font-medium italic">
                "This staff member is authorized to access pedagogical modules and manage data related to the {viewingStaff?.section}. All dashboard interactions are logged under the verified digital ID system."
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Record Since</p>
                <p className="text-sm font-bold text-primary">Jan 12, 2024</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Node Status</p>
                <Badge className={cn(
                  "font-black text-[10px] px-3 border-none",
                  viewingStaff?.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {viewingStaff?.status === 'active' ? "VERIFIED" : "SUSPENDED"}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-end">
            <Button onClick={() => setViewingStaff(null)} className="rounded-xl px-10 h-12 shadow-lg font-black uppercase tracking-widest text-xs">Close Dossier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DETAILS DIALOG */}
      <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-black">Edit Staff Profile</DialogTitle>
            <DialogDescription className="text-white/60">Update institutional records for {editingStaff?.name}.</DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Update Full Name</Label>
              <Input 
                value={editingStaff?.name} 
                onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})} 
                className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Strategic Role</Label>
                <Select value={editingStaff?.role} onValueChange={(v) => setEditingStaff({...editingStaff, role: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="BURSAR">Bursar</SelectItem>
                    <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Institutional Section</Label>
                <Select value={editingStaff?.section} onValueChange={(v) => setEditingStaff({...editingStaff, section: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={handleEditStaff} className="w-full h-12 rounded-xl shadow-lg font-bold" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Commit Profile Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* APPOINTMENT RECEIPT */}
      <Dialog open={!!onboardingSuccess} onOpenChange={() => setOnboardingSuccess(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl text-center">
          <DialogHeader className="bg-green-600 p-8 text-white">
            <DialogTitle className="text-2xl font-black">Staff Appointed</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10">
              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Matricule / ID</p>
              <p className="text-4xl font-mono font-black text-primary">{onboardingSuccess?.id}</p>
            </div>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              This unique institutional ID has been generated and encrypted. Share this code with the staff member for initial portal activation.
            </p>
            <Button onClick={() => setOnboardingSuccess(null)} className="w-full h-12 rounded-xl shadow-lg font-bold">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
