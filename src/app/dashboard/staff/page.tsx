
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  MoreVertical, 
  UserPlus,
  Calendar,
  Trash2,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Printer,
  Mail,
  User,
  Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
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
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { generateSchoolMatricule, registerMatricule } from "@/lib/matricule";

const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section", "Cross-Sectional"];

export default function StaffManagementPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [onboardingSuccess, setOnboardingSuccess] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "",
    address: "",
    degree: "",
    institution: "",
    gradYear: "",
    expYears: "",
    prevCompany: "",
    role: "TEACHER",
    department: "",
    section: "Anglophone Section",
  });

  const staffQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId) return null;
    return query(
      collection(db, "users"), 
      where("schoolId", "==", user.schoolId),
      where("role", "in", ["TEACHER", "BURSAR", "LIBRARIAN", "SCHOOL_ADMIN"])
    );
  }, [db, user?.schoolId]);

  const { data: staff, isLoading } = useCollection(staffQuery);

  const filteredStaff = staff?.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddStaff = async () => {
    if (!formData.name || !user?.schoolId) {
      toast({ variant: "destructive", title: "Missing Info", description: "Name is required." });
      return;
    }

    setIsProcessing(true);
    try {
      const matricule = await generateSchoolMatricule(db, user.schoolId, formData.role as any);
      const tempUid = `TEMP_${matricule}`;
      
      const newStaffData = {
        id: matricule,
        uid: tempUid,
        name: formData.name,
        email: `${matricule.toLowerCase()}@eduignite.io`,
        role: formData.role,
        schoolId: user.schoolId,
        department: formData.department,
        section: formData.section,
        phone: formData.phone,
        isLicensePaid: true, // Staff licenses are usually institutional
        status: "active",
        createdAt: serverTimestamp(),
        avatar: `https://picsum.photos/seed/${matricule}/100/100`,
      };

      await setDoc(doc(db, "users", tempUid), newStaffData);
      await registerMatricule(db, matricule, tempUid);

      setIsAddModalOpen(false);
      setOnboardingSuccess(newStaffData);
      toast({ title: "Staff Onboarded", description: `Unique ID: ${matricule}` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Onboarding Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteStaff = async (uid: string) => {
    try {
      await deleteDoc(doc(db, "users", uid));
      toast({ title: "Removed", description: "Staff record decommissioned." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete staff record." });
    }
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
    <div className="space-y-8">
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
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
            <UserPlus className="w-5 h-5" /> Onboard Staff
          </Button>
          <DialogContent className="sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black">Register New Staff</DialogTitle>
              <DialogDescription className="text-white/60">Complete the professional profile to generate appointment records.</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-3 w-full rounded-none bg-accent/30 h-12">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="professional">Work Exp.</TabsTrigger>
                <TabsTrigger value="institutional">Assignment</TabsTrigger>
              </TabsList>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <TabsContent value="personal" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2"><Label>Full Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Jean Dupont" className="h-11 rounded-xl" /></div>
                    <div className="space-y-2"><Label>Gender</Label><Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Phone Number</Label><Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="h-11 rounded-xl" /></div>
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2"><Label>Highest Degree</Label><Input value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} className="h-11 rounded-xl" /></div>
                    <div className="space-y-2"><Label>Years of Experience</Label><Input type="number" value={formData.expYears} onChange={(e) => setFormData({...formData, expYears: e.target.value})} className="h-11 rounded-xl" /></div>
                  </div>
                </TabsContent>

                <TabsContent value="institutional" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Designated Role</Label>
                      <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                          <SelectItem value="BURSAR">Bursar</SelectItem>
                          <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                          <SelectItem value="SCHOOL_ADMIN">Sub-Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Section Assignment</Label>
                      <Select value={formData.section} onValueChange={(v) => setFormData({...formData, section: v})}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2"><Label>Department</Label><Input value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="h-11 rounded-xl" /></div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStaff} className="flex-1 rounded-xl h-12 shadow-lg font-bold" disabled={isProcessing}>
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
              placeholder="Search by name, ID or department..." 
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
              <TableHeader>
                <TableRow className="bg-accent/10 border-b border-accent/20">
                  <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Staff ID</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Professional Profile</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Section</TableHead>
                  <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
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
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">{s.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary leading-none mb-1">{s.name}</span>
                          <Badge variant="outline" className={cn("w-fit text-[8px] h-4 uppercase border-none tracking-tighter", getRoleColor(s.role))}>
                            {s.role}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <p className="text-xs font-bold text-primary">{s.section}</p>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl">
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => window.alert('Profile details coming soon')}><Eye className="w-4 h-4" /> Portfolio</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => handleDeleteStaff(s.uid)}><Trash2 className="w-4 h-4" /> Decommission</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* APPOINTMENT RECEIPT */}
      <Dialog open={!!onboardingSuccess} onOpenChange={() => setOnboardingSuccess(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-green-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-10 h-10" />
              <DialogTitle className="text-2xl font-black">Staff Appointed</DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6 text-center">
            <p className="text-sm text-muted-foreground">Generated official institutional identity for <b>{onboardingSuccess?.name}</b>.</p>
            <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10">
              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Matricule / ID</p>
              <p className="text-4xl font-mono font-black text-primary select-all">{onboardingSuccess?.id}</p>
            </div>
            <Button onClick={() => window.print()} className="w-full h-12 rounded-xl shadow-lg font-bold gap-2"><Printer className="w-4 h-4" /> Print Appointment Letter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
