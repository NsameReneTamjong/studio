"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Coins, 
  Search, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  TrendingUp, 
  Printer, 
  History, 
  ShieldCheck, 
  QrCode, 
  Loader2, 
  AlertCircle, 
  X, 
  CreditCard,
  FileDown,
  Filter,
  CalendarDays,
  FileSpreadsheet,
  Download,
  Building2,
  BookMarked,
  ArrowRight,
  Users,
  Plus,
  Settings2,
  Trash2,
  Save,
  Pencil,
  Network,
  ArrowLeft,
  UserCheck,
  UserX,
  FileText,
  TrendingDown,
  Activity,
  ChevronRight,
  Eye,
  Gavel
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

// Constants
const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section"];

const INITIAL_FEE_TYPES = [
  { id: "ft1", name: "Tuition Fee", amount: 150000, description: "Primary academic registration fee.", status: "mandatory" },
  { id: "ft2", name: "Uniform Package", amount: 25000, description: "Official institutional attire.", status: "mandatory" },
  { id: "ft3", name: "PTA Contribution", amount: 10000, description: "Annual PTA contribution.", status: "mandatory" },
  { id: "ft4", name: "Examination Fee", amount: 5000, description: "Exam administration fee.", status: "mandatory" },
];

const INITIAL_STUDENTS = [
  { id: "GBHS26S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "2nde / Form 5", year: "2023 / 2024" },
  { id: "GBHS26S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 50000, "Uniform Package": 0, "PTA Contribution": 0, "Examination Fee": 0 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "Terminale / Upper Sixth", year: "2023 / 2024" },
  { id: "GBHS26S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", section: "Francophone Section", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: false, class: "1ère / Lower Sixth", year: "2023 / 2024" },
  { id: "GBHS26S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 75000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "2nde / Form 5", year: "2023 / 2024" },
];

const MOCK_CLASS_STATS = [
  { name: "6ème / Form 1", totalStudents: 45, paidCount: 38, percentage: 84, arrears: "1.2M", status: "good", revenue: "5.4M", section: "Anglophone Section" },
  { name: "5ème / Form 2", totalStudents: 40, paidCount: 22, percentage: 55, arrears: "2.8M", status: "critical", revenue: "3.2M", section: "Anglophone Section" },
  { name: "2nde / Form 5", totalStudents: 42, paidCount: 40, percentage: 95, arrears: "200k", status: "optimal", revenue: "6.8M", section: "Anglophone Section" },
];

export default function FeesPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [complianceFilter, setComplianceFilter] = useState("all"); // all, paid, unpaid
  const [feeTypes, setFeeTypes] = useState(INITIAL_FEE_TYPES);
  const [activeFeeFilter, setActiveFeeFilter] = useState(INITIAL_FEE_TYPES[0].name);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<any>(null);
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [dossierSearch, setDossierSearch] = useState("");
  const [issuedReceipt, setIssuedReceipt] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({ type: INITIAL_FEE_TYPES[0].name, amount: "" });
  
  const [isAddingFeeType, setIsAddingFeeType] = useState(false);
  const [newFeeTypeData, setNewFeeTypeData] = useState({ name: "", amount: "", description: "", status: "mandatory" });

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<any[]>([
    { 
      id: "TX-PAY-001", 
      studentName: "Alice Thompson", 
      studentId: "GBHS26S001", 
      class: "2nde / Form 5", 
      feeType: "Tuition Fee", 
      amount: "50,000", 
      method: "Cash", 
      date: "24 May, 10:30 AM",
      schoolName: INITIAL_STUDENTS[0].section,
      bursar: "Official Bursar"
    },
  ]);

  const isBursar = user?.role === "BURSAR";
  const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
  const isSubAdmin = user?.role === "SUB_ADMIN";
  const isAdmin = isSchoolAdmin || isSubAdmin;

  const getStatusForFee = (student: any, feeType: string) => {
    const paid = (student.balances as any)[feeType] || 0;
    const total = (student.totals as any)[feeType] || 150000;
    return paid >= total ? 'cleared' : 'partial';
  };

  const filteredClassStats = useMemo(() => {
    return MOCK_CLASS_STATS.filter(cls => {
      const matchesSection = sectionFilter === "all" || cls.section === sectionFilter;
      return matchesSection;
    });
  }, [sectionFilter]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === "all" || s.class === classFilter;
      const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
      
      const paidAmount = (s.balances as any)[activeFeeFilter] || 0;
      const totalAmount = (s.totals as any)[activeFeeFilter] || 150000;
      const isPaid = paidAmount >= totalAmount;
      
      const matchesCompliance = complianceFilter === 'all' || 
                                (complianceFilter === 'paid' && isPaid) || 
                                (complianceFilter === 'unpaid' && !isPaid);

      return matchesSearch && matchesClass && matchesSection && matchesCompliance;
    });
  }, [searchTerm, classFilter, sectionFilter, complianceFilter, activeFeeFilter, students]);

  const classDossierStudents = useMemo(() => {
    if (!selectedClassDetails) return [];
    return students.filter(s => s.class === selectedClassDetails.name);
  }, [students, selectedClassDetails]);

  const handleProcessPayment = () => {
    if (!paymentForm.amount) return;
    setIsProcessing(true);
    setTimeout(() => {
      const amountNum = parseFloat(paymentForm.amount);
      const studentId = selectedStudentForPayment.id;
      
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          const currentBalances = { ...s.balances };
          (currentBalances as any)[paymentForm.type] = ((currentBalances as any)[paymentForm.type] || 0) + amountNum;
          return { ...s, balances: currentBalances };
        }
        return s;
      }));

      const receipt = {
        id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        studentName: selectedStudentForPayment.name,
        studentId: selectedStudentForPayment.id,
        class: selectedStudentForPayment.class,
        feeType: paymentForm.type,
        amount: amountNum.toLocaleString(),
        date: new Date().toLocaleString(),
        bursar: user?.name || "Official Bursar"
      };
      
      setTransactions(prev => [{ 
        id: receipt.id, 
        studentName: receipt.studentName, 
        studentId: receipt.studentId,
        class: receipt.class,
        feeType: receipt.feeType, 
        amount: receipt.amount, 
        method: "Desk", 
        date: "Just now" 
      }, ...prev]);
      
      setIssuedReceipt(receipt);
      setIsProcessing(false);
      setSelectedStudentForPayment(null);
      setPaymentForm({ type: activeFeeFilter, amount: "" });
      toast({ title: "Payment Recorded" });
    }, 1500);
  };

  const handleExportPDF = () => {
    setIsProcessing(true);
    toast({ title: "Generating PDF Report", description: "Preparing the institutional registry based on your current filters..." });
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Download Ready", description: "The filtered financial report has been saved." });
    }, 2000);
  };

  const handleAddFeeType = () => {
    if (!newFeeTypeData.name || !newFeeTypeData.amount) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created = {
        id: `ft-${Math.random().toString(36).substr(2, 5)}`,
        name: newFeeTypeData.name,
        amount: parseFloat(newFeeTypeData.amount),
        description: newFeeTypeData.description || "Institutional pedagogical charge.",
        status: newFeeTypeData.status
      };
      setFeeTypes([...feeTypes, created]);
      setIsProcessing(false);
      setIsAddingFeeType(false);
      setNewFeeTypeData({ name: "", amount: "", description: "", status: "mandatory" });
      toast({ title: "Policy Updated", description: "New fee type has been registered." });
    }, 800);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-2xl shadow-xl border-2 border-white shrink-0">
              <Coins className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline tracking-tighter uppercase">
                {isAdmin ? "Revenue Oversight" : "Collection Desk"}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Manage intake and record payments.</p>
            </div>
          </div>
        </div>
        
        <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest flex items-center gap-2 bg-white">
          <ShieldCheck className="w-4 h-4 text-secondary" /> Node Verified
        </Badge>
      </div>

      <Tabs defaultValue={isAdmin ? "oversight" : "pay"} className="w-full">
        <TabsList className="grid w-full mb-8 bg-white shadow-sm border h-auto p-1.5 rounded-2xl grid-cols-5 md:w-[900px]">
          {isAdmin && <TabsTrigger value="oversight" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Building2 className="w-4 h-4"/> Oversight</TabsTrigger>}
          {isBursar && <TabsTrigger value="pay" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Wallet className="w-4 h-4"/> Collection</TabsTrigger>}
          <TabsTrigger value="ledger" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><History className="w-4 h-4"/> Ledger</TabsTrigger>
          <TabsTrigger value="tracker" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><FileSpreadsheet className="w-4 h-4"/> Tracker</TabsTrigger>
          {isBursar && <TabsTrigger value="settings" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Settings2 className="w-4 h-4"/> Fee Policy</TabsTrigger>}
        </TabsList>

        {isAdmin && (
          <TabsContent value="oversight" className="animate-in fade-in slide-in-from-bottom-2 mt-0 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border shadow-sm">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Intake Analytics</h2>
                <p className="text-xs text-muted-foreground">Audit collection by class level.</p>
              </div>
              <Select value={activeFeeFilter} onValueChange={setActiveFeeFilter}>
                <SelectTrigger className="w-full md:w-[250px] h-12 bg-primary/5 border-primary/20 text-primary font-bold rounded-2xl"><SelectValue /></SelectTrigger>
                <SelectContent>{feeTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassStats.map((cls) => (
                <Card key={cls.name} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white">
                  <div className={cn("h-1.5 w-full", cls.status === 'optimal' ? "bg-green-500" : "bg-amber-500")} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-black text-primary uppercase leading-tight">{cls.name}</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                          <Users className="w-3.5 h-3.5" /> {cls.totalStudents} Students
                        </CardDescription>
                      </div>
                      <Badge className="h-10 w-10 p-0 flex items-center justify-center rounded-xl bg-accent text-primary font-black">{cls.percentage}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground">
                        <span>Paid</span>
                        <span>{cls.paidCount} / {cls.totalStudents}</span>
                      </div>
                      <Progress value={cls.percentage} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl border border-accent">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Arrears</p>
                        <p className="text-sm font-black text-primary">{cls.arrears} XAF</p>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white" onClick={() => setSelectedClassDetails(cls)}>
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        <TabsContent value="pay" className="animate-in fade-in slide-in-from-bottom-2 mt-0 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-white border-b p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Find student..." className="pl-10 h-12 bg-accent/20 border-none rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="h-12 bg-accent/20 border-none rounded-xl font-bold"><SelectValue placeholder="All Classes" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">Entire School</SelectItem>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={activeFeeFilter} onValueChange={setActiveFeeFilter}>
                  <SelectTrigger className="h-12 bg-primary/5 border-primary/20 text-primary font-black rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{feeTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right pr-8">Collect</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => {
                    const status = getStatusForFee(s, activeFeeFilter);
                    return (
                      <TableRow key={s.id} className="hover:bg-accent/5 border-b last:border-0 h-16">
                        <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border shrink-0"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs md:text-sm text-primary uppercase">{s.name}</span>
                              <span className="text-[8px] font-black uppercase text-muted-foreground">{s.class}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn("text-[8px] font-black uppercase px-2 h-5 border-none", status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                            {status === 'cleared' ? 'Cleared' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button size="sm" className="h-9 px-6 rounded-xl font-black uppercase text-[10px] shadow-lg" disabled={status === 'cleared'} onClick={() => { setSelectedStudentForPayment(s); setPaymentForm({ ...paymentForm, type: activeFeeFilter }); }}>
                            <Wallet className="w-3.5 h-3.5 mr-2" /> Pay
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="mt-0 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-white border-b p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Transaction History Registry</CardTitle>
              <Button variant="outline" size="sm" className="rounded-xl h-9 text-[10px] font-bold gap-2"><Printer className="w-3.5 h-3.5"/> Print Full Ledger</Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Student Name</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead className="text-center">Amount (XAF)</TableHead>
                    <TableHead className="text-right pr-8">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-accent/5 h-14 border-b">
                      <TableCell className="pl-8 font-bold text-xs uppercase text-primary">{tx.studentName}</TableCell>
                      <TableCell className="font-mono text-[10px] font-bold text-muted-foreground">{tx.studentId}</TableCell>
                      <TableCell className="text-xs font-medium uppercase">{tx.class}</TableCell>
                      <TableCell className="text-xs font-medium">{tx.feeType}</TableCell>
                      <TableCell className="text-center font-black text-sm text-primary">{tx.amount}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 rounded-lg gap-2 text-[10px] font-black uppercase text-primary/60 hover:text-primary hover:bg-primary/5 transition-all"
                          onClick={() => setIssuedReceipt(tx)}
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracker" className="mt-0 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary p-6 md:p-10 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-secondary"><FileSpreadsheet className="w-8 h-8" /></div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Institutional Tracker</CardTitle>
                    <CardDescription className="text-white/60 text-xs">Generate custom PDF reports based on filtered financial criteria.</CardDescription>
                  </div>
                </div>
                <Button 
                  className="bg-secondary text-primary hover:bg-secondary/90 h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg" 
                  onClick={handleExportPDF}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                  Download Filtered PDF
                </Button>
              </div>
            </CardHeader>
            <div className="p-6 bg-accent/30 border-b border-accent grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Section (Sub-school)</Label>
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger className="h-11 bg-white border-none rounded-xl font-bold"><SelectValue placeholder="All Sections" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Entire School</SelectItem>
                      {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>
               <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Class Level</Label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="h-11 bg-white border-none rounded-xl font-bold"><SelectValue placeholder="All Classes" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>
               <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Fee Category</Label>
                  <Select value={activeFeeFilter} onValueChange={setActiveFeeFilter}>
                    <SelectTrigger className="h-11 bg-white border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{feeTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
               </div>
               <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Compliance Status</Label>
                  <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                    <SelectTrigger className="h-11 bg-white border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Records</SelectItem>
                      <SelectItem value="paid">Fully Paid</SelectItem>
                      <SelectItem value="unpaid">Outstanding (Unpaid)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Student Identity</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead className="text-center">Compliance</TableHead>
                    <TableHead className="text-right pr-8">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => {
                    const paid = (s.balances as any)[activeFeeFilter] || 0;
                    const total = (s.totals as any)[activeFeeFilter] || 150000;
                    const percentage = Math.round((paid / total) * 100);
                    return (
                      <TableRow key={s.id} className="hover:bg-accent/5 h-16 border-b">
                        <TableCell className="pl-8">
                          <p className="font-bold text-xs md:text-sm text-primary uppercase">{s.name}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{s.class} • {s.section}</p>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold text-muted-foreground">{s.id}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn("text-[8px] font-black uppercase px-2 border-none h-5", percentage === 100 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>{percentage === 100 ? 'CLEARED' : 'PENDING'}</Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="inline-flex flex-col items-end gap-1">
                            <span className="text-[10px] font-black text-primary">{percentage}%</span>
                            <div className="w-20 h-1 bg-accent rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="animate-in fade-in slide-in-from-bottom-2 mt-0 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-black text-primary uppercase tracking-tight">Institutional Fee Structure</h3>
            <Dialog open={isAddingFeeType} onOpenChange={setIsAddingFeeType}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg">
                  <Plus className="w-4 h-4" /> Define New Fee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white relative">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-secondary"><Gavel className="w-8 h-8" /></div>
                    <div>
                      <DialogTitle className="text-2xl font-black uppercase tracking-tight">New Fee Type</DialogTitle>
                      <DialogDescription className="text-white/60">Initialize a mandatory or optional institutional charge.</DialogDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsAddingFeeType(false)} className="absolute top-4 right-4 text-white hover:bg-white/10"><X className="w-6 h-6"/></Button>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Fee Label</Label>
                    <Input value={newFeeTypeData.name} onChange={(e) => setNewFeeTypeData({...newFeeTypeData, name: e.target.value})} placeholder="e.g. Laboratory Fee" className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Standard Amount (XAF)</Label>
                    <Input type="number" value={newFeeTypeData.amount} onChange={(e) => setNewFeeTypeData({...newFeeTypeData, amount: e.target.value})} placeholder="0" className="h-12 bg-accent/30 border-none rounded-xl font-black" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Requirement Status</Label>
                    <Select value={newFeeTypeData.status} onValueChange={(v) => setNewFeeTypeData({...newFeeTypeData, status: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mandatory">Mandatory (Required)</SelectItem>
                        <SelectItem value="optional">Optional / Elective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={handleAddFeeType} disabled={isProcessing || !newFeeTypeData.name} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3">
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Fee Policy
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {feeTypes.map(f => (
              <Card key={f.id} className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase">{f.status}</Badge>
                    <div className="p-2 bg-accent rounded-lg"><Coins className="w-4 h-4 text-primary" /></div>
                  </div>
                  <CardTitle className="text-lg font-black text-primary uppercase leading-tight">{f.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-black text-primary">{f.amount.toLocaleString()} <span className="text-xs font-bold opacity-40">XAF</span></div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 italic">"{f.description || 'Institutional pedagogical charge.'}"</p>
                </CardContent>
                <CardFooter className="bg-accent/10 border-t p-3 flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white text-primary/40 hover:text-primary"><Pencil className="w-3.5 h-3.5"/></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white text-destructive/40 hover:text-destructive" onClick={() => setFeeTypes(feeTypes.filter(item => item.id !== f.id))}><Trash2 className="w-3.5 h-3.5"/></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ADMIN CLASS DETAILS DIALOG */}
      <Dialog open={!!selectedClassDetails} onOpenChange={() => setSelectedClassDetails(null)}>
        <DialogContent className="sm:max-w-4xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary"><Building2 className="w-8 h-8" /></div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight">{selectedClassDetails?.name} Financial Dossier</DialogTitle>
                  <DialogDescription className="text-white/60">Audit record for {activeFeeFilter}</DialogDescription>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedClassDetails(null)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X className="w-6 h-6" /></Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-6 border-b bg-accent/10 flex flex-col md:flex-row items-center gap-4">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input placeholder="Search students..." className="w-full pl-10 h-11 bg-white border-none rounded-xl text-sm" value={dossierSearch} onChange={(e) => setDossierSearch(e.target.value)} />
               </div>
               <Button variant="outline" className="rounded-xl h-11 gap-2 font-bold bg-white border-primary/10 w-full md:w-auto" onClick={() => window.print()}>
                 <Printer className="w-4 h-4" /> Print Registry
               </Button>
            </div>

            <Table>
              <TableHeader className="bg-accent/30 uppercase text-[9px] font-black tracking-widest sticky top-0 z-10 border-b">
                <TableRow>
                  <TableHead className="pl-8 py-4">Student Identity</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead className="text-right">Paid (XAF)</TableHead>
                  <TableHead className="text-right">Balance (XAF)</TableHead>
                  <TableHead className="text-right pr-8">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classDossierStudents.filter(s => s.name.toLowerCase().includes(dossierSearch.toLowerCase())).map((s) => {
                  const paid = (s.balances as any)[activeFeeFilter] || 0;
                  const total = (s.totals as any)[activeFeeFilter] || 150000;
                  const unpaid = total - paid;
                  return (
                    <TableRow key={s.id} className="hover:bg-accent/5 h-16 border-b border-accent/10">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                          <span className="font-bold text-xs md:text-sm text-primary uppercase">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-muted-foreground">{s.id}</TableCell>
                      <TableCell className="text-right font-black text-green-600">{paid.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-black text-red-600">{unpaid.toLocaleString()}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5"><Eye className="w-4 h-4 text-primary/40" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* COLLECTION DIALOG */}
      <Dialog open={!!selectedStudentForPayment} onOpenChange={() => setSelectedStudentForPayment(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-secondary"><Wallet className="w-8 h-8" /></div>
              <div>
                <DialogTitle className="text-2xl font-black">Fee Collection</DialogTitle>
                <DialogDescription className="text-white/60">Payment for {selectedStudentForPayment?.name}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedStudentForPayment(null)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X className="w-6 h-6" /></Button>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fee Category</Label>
                <Select value={paymentForm.type} onValueChange={(v) => setPaymentForm({...paymentForm, type: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>{feeTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount (XAF)</Label>
                <Input type="number" placeholder="0" className="h-14 bg-accent/30 border-none rounded-2xl font-black text-2xl text-primary pl-6" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-14 rounded-2xl shadow-xl font-black uppercase text-xs gap-3 bg-primary text-white" onClick={handleProcessPayment} disabled={isProcessing || !paymentForm.amount}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Finalize Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RECEIPT PREVIEW */}
      <Dialog open={!!issuedReceipt} onOpenChange={() => setIssuedReceipt(null)}>
        <DialogContent className="sm:max-w-2xl p-0 border-none shadow-2xl rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="bg-primary p-8 text-white no-print relative shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary"><Receipt className="w-8 h-8" /></div>
                <DialogTitle className="text-xl md:text-2xl font-black">Official Receipt Issued</DialogTitle>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIssuedReceipt(null)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X className="w-6 h-6" /></Button>
          </DialogHeader>
          <div className="bg-muted p-10 print:p-0 print:bg-white overflow-y-auto flex-1">
            <div id="printable-receipt" className="bg-white p-10 border-2 border-black shadow-sm relative flex flex-col space-y-8 font-serif text-black print:border-none print:shadow-none min-w-[350px]">
               <div className="flex justify-between items-center border-b-2 border-black pb-4">
                  <img src={user?.school?.logo || platformSettings.logo} alt="School" className="w-12 h-12 object-contain" />
                  <p className="text-sm font-mono font-black">{issuedReceipt?.id}</p>
               </div>
               <div className="text-center space-y-1">
                  <h2 className="font-black text-sm uppercase text-primary">{issuedReceipt?.schoolName || platformSettings.name}</h2>
                  <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest underline decoration-double">Financial Receipt</p>
               </div>
               <div className="grid grid-cols-2 gap-8 py-2">
                  <div>
                    <p className="text-[9px] font-black uppercase text-muted-foreground border-b pb-1 mb-2">Student Identity</p>
                    <p className="font-black text-sm uppercase">{issuedReceipt?.studentName}</p>
                    <p className="text-[10px] font-mono font-bold text-primary mt-1">{issuedReceipt?.studentId} • {issuedReceipt?.class}</p>
                  </div>
                  <div className="text-right">
                    <div className="p-4 bg-primary text-white rounded-2xl shadow-xl">
                      <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">Amount Paid</p>
                      <p className="font-black text-xl text-secondary underline underline-offset-4 decoration-double">{issuedReceipt?.amount} XAF</p>
                    </div>
                  </div>
               </div>
               <div className="pt-8 border-t border-black/5 flex justify-between items-end">
                  <QrCode className="w-14 h-14 text-primary opacity-20" />
                  <div className="text-center space-y-4 w-32"><div className="h-10 w-full mx-auto bg-primary/5 rounded border-b-2 border-black/40 relative flex items-center justify-center"><SignatureSVG className="w-full h-full text-primary/20 p-2" /></div><p className="text-[8px] font-black uppercase text-primary">The Bursar</p></div>
               </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/10 p-8 border-t no-print flex gap-4 shrink-0">
            <Button variant="outline" className="flex-1 rounded-xl h-14 font-black uppercase tracking-widest text-xs" onClick={() => setIssuedReceipt(null)}>Close</Button>
            <div className="flex flex-1 gap-2">
              <Button variant="secondary" className="flex-1 rounded-xl h-14 font-black uppercase tracking-widest text-xs gap-2" onClick={() => toast({ title: "PDF Prepared" })}>
                <Download className="w-4 h-4" /> Download
              </Button>
              <Button className="flex-1 rounded-xl h-14 shadow-2xl font-black uppercase tracking-widest text-xs gap-2 bg-primary text-white" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SignatureSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 25C15 25 20 15 25 15C30 15 35 30 40 30C45 30 50 10 55 10C60 10 65 35 70 35C75 35 80 20 85 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
