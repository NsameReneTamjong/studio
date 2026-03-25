
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Loader2
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
  { id: "GBHS26T001", uid: "T1", name: "Dr. Aris Tesla", role: "TEACHER", section: "Anglophone Section", avatar: "https://picsum.photos/seed/t1/100/100" },
  { id: "GBHS26B001", uid: "B1", name: "Mme. Ngono Celine", role: "BURSAR", section: "Cross-Sectional", avatar: "https://picsum.photos/seed/b1/100/100" },
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
      };
      setStaff([...staff, created]);
      setIsProcessing(false);
      setIsAddModalOpen(false);
      setOnboardingSuccess(created);
      toast({ title: "Staff Onboarded", description: `Unique ID: ${generatedId}` });
    }, 1000);
  };

  const handleDeleteStaff = (uid: string) => {
    setStaff(staff.filter(s => s.uid !== uid));
    toast({ title: "Removed", description: "Staff record decommissioned." });
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
              <div className="space-y-2"><Label>Full Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl" /></div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="BURSAR">Bursar</SelectItem>
                    <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                  </SelectContent>
                </Select>
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
            <Input placeholder="Search by name, ID..." className="pl-10 h-12 bg-accent/20 border-none rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">{s.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary leading-none mb-1">{s.name}</span>
                          <Badge variant="outline" className={cn("w-fit text-[8px] h-4 uppercase border-none tracking-tighter", getRoleColor(s.role))}>{s.role}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs font-bold text-primary">{s.section}</TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteStaff(s.uid)} className="text-destructive/20 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
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
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl text-center">
          <DialogHeader className="bg-green-600 p-8 text-white">
            <DialogTitle className="text-2xl font-black">Staff Appointed</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10">
              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Matricule / ID</p>
              <p className="text-4xl font-mono font-black text-primary">{onboardingSuccess?.id}</p>
            </div>
            <Button onClick={() => setOnboardingSuccess(null)} className="w-full h-12 rounded-xl shadow-lg font-bold">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
