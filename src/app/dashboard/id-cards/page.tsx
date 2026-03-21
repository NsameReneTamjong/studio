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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CreditCard, 
  Search, 
  Printer, 
  Download, 
  Building2, 
  User, 
  MapPin, 
  QrCode, 
  Layers, 
  GraduationCap, 
  ShieldCheck,
  CheckCircle2,
  X,
  Eye,
  FileCheck,
  ChevronRight,
  Plus,
  Info
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", class: "Form 5 / 2nde", avatar: "https://picsum.photos/seed/s1/200/200", status: "Active" },
  { id: "S002", name: "Bob Richards", class: "Upper Sixth / Terminale", avatar: "https://picsum.photos/seed/s2/200/200", status: "Active" },
  { id: "S003", name: "Charlie Davis", class: "Lower Sixth / 1ère", avatar: "https://picsum.photos/seed/s3/200/200", status: "Active" },
  { id: "S004", name: "Diana Prince", class: "Form 5 / 2nde", avatar: "https://picsum.photos/seed/s4/200/200", status: "Active" },
  { id: "S005", name: "Ethan Hunt", class: "Upper Sixth / Terminale", avatar: "https://picsum.photos/seed/s5/200/200", status: "Active" },
];

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

export default function IdCardsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const filtered = MOCK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || s.class.includes(classFilter.split(' / ')[0]);
    return matchesSearch && matchesClass;
  });

  const toggleSelectAll = () => {
    if (selectedStudents.length === filtered.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filtered.map(s => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (selectedStudents.length === 0) {
      toast({ variant: "destructive", title: "No Students Selected", description: "Please select at least one student to generate IDs." });
      return;
    }
    setIsPreviewing(true);
  };

  const handlePrint = () => {
    window.print();
    toast({ title: "Print Command Sent", description: "Sending batch to your institutional printer." });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
              <CreditCard className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? 'Institutional ID Cards' : 'Cartes d\'Identité'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate and manage official digital ID cards for the student body.
          </p>
        </div>
        
        <Button 
          className="gap-2 shadow-lg h-12 px-6 rounded-2xl" 
          onClick={handleGenerate}
          disabled={selectedStudents.length === 0}
        >
          <Plus className="w-5 h-5" /> {language === 'en' ? 'Generate Selected' : 'Générer la Sélection'} ({selectedStudents.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-accent/30 border border-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-primary/60 tracking-widest leading-none">Total Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">1,284 <span className="text-xs font-medium opacity-40">Students</span></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-blue-600 tracking-widest leading-none">IDs Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-700">1,120 <span className="text-xs font-medium opacity-40">Cards</span></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-green-600 tracking-widest leading-none">Validation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-700">92% <span className="text-xs font-medium opacity-40">Covered</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Find student by name or ID..." 
                  className="pl-10 h-11 bg-accent/20 border-none rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[200px] h-11 bg-accent/20 border-none rounded-xl">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-muted-foreground">{selectedStudents.length} selected</span>
               <Button variant="outline" size="sm" onClick={() => setSelectedStudents([])}>Clear</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/10 border-b border-accent/20">
                <TableHead className="w-[50px] pl-8">
                  <Checkbox 
                    checked={selectedStudents.length === filtered.length && filtered.length > 0} 
                    onCheckedChange={toggleSelectAll} 
                  />
                </TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Matricule</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Student Profile</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Academic Level</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Card Status</TableHead>
                <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className={cn("group hover:bg-accent/5 border-b border-accent/10", selectedStudents.includes(s.id) && "bg-primary/5")}>
                  <TableCell className="pl-8">
                    <Checkbox 
                      checked={selectedStudents.includes(s.id)} 
                      onCheckedChange={() => toggleSelect(s.id)} 
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                        <AvatarImage src={s.avatar} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">{s.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-sm text-primary">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-primary/20 text-primary font-bold">{s.class}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-green-100 text-green-700 border-none text-[9px] font-black">VALIDATED</Badge>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedStudents([s.id]); setIsPreviewing(true); }} className="rounded-full hover:bg-accent">
                      <Eye className="w-4 h-4 text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/20 p-4 border-t flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
             <ShieldCheck className="w-4 h-4 text-primary" />
             <p className="text-[10px] uppercase font-bold tracking-widest">Secure institutional card generation active.</p>
          </div>
          <p className="text-[10px] font-black text-primary uppercase">Total Records: {filtered.length}</p>
        </CardFooter>
      </Card>

      {/* ID CARD PREVIEW & PRINT DIALOG */}
      <Dialog open={isPreviewing} onOpenChange={setIsPreviewing}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="bg-primary p-8 text-white no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <CreditCard className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black">ID Card Preview Queue</DialogTitle>
                  <DialogDescription className="text-white/60">Review {selectedStudents.length} institutional cards before printing.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsPreviewing(false)} className="text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-8 print:p-0 print:bg-white min-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center print:grid-cols-2">
              {selectedStudents.map(id => {
                const s = MOCK_STUDENTS.find(item => item.id === id);
                if (!s) return null;
                return (
                  <div key={s.id} className="relative group card-container">
                    <Card className="w-[400px] h-[250px] border shadow-xl bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden relative break-inside-avoid">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <GraduationCap className="w-48 h-48" />
                      </div>
                      
                      <CardHeader className="border-b border-white/10 pb-3 p-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-6 h-6 text-secondary" />
                          <div>
                            <CardTitle className="text-xs font-black tracking-tight uppercase">{user?.school?.name || "Lycée de Joss"}</CardTitle>
                            <CardDescription className="text-white/60 text-[8px] uppercase font-bold tracking-[0.2em]">Institutional Student ID</CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4 p-4 space-y-4">
                        <div className="flex gap-6">
                          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg shrink-0 bg-white">
                            <img src={s.avatar} alt={s.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-3 flex-1">
                            <div>
                              <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Student Name</p>
                              <p className="font-bold text-base leading-tight uppercase">{s.name}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Matricule ID</p>
                              <p className="font-mono font-bold text-secondary text-lg">{s.id}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-white/50 uppercase font-black tracking-widest">Academic Level</p>
                              <p className="font-bold text-xs">{s.class}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-white/5 py-3 p-4 flex justify-between items-center mt-auto border-t border-white/10">
                        <div className="flex items-center gap-2">
                           <MapPin className="w-3 h-3 opacity-40" />
                           <span className="text-[8px] font-bold opacity-60 uppercase">{user?.school?.location || "Douala, Littoral"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="text-right">
                              <p className="text-[7px] uppercase font-black opacity-40">Verified</p>
                              <Badge className="bg-secondary text-primary border-none text-[8px] h-4 font-black">VALID 2023-24</Badge>
                           </div>
                           <div className="p-1 bg-white rounded shadow-sm">
                              <QrCode className="w-8 h-8 text-primary" />
                           </div>
                        </div>
                      </CardFooter>
                    </Card>
                    <div className="absolute -top-3 -right-3 no-print">
                       <Button size="icon" variant="destructive" className="h-6 w-6 rounded-full shadow-lg" onClick={() => toggleSelect(s.id)}>
                         <X className="w-3 h-3" />
                       </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t no-print flex sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 text-muted-foreground italic">
               <Info className="w-4 h-4" />
               <p className="text-[10px]">Cards are optimized for 85.6mm x 54mm standard PVC printing.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl h-12 px-8" onClick={() => setIsPreviewing(false)}>Back to List</Button>
              <Button className="rounded-xl h-12 px-8 shadow-lg font-bold gap-2" onClick={handlePrint}>
                <Printer className="w-5 h-5" /> Print Batch ({selectedStudents.length})
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
