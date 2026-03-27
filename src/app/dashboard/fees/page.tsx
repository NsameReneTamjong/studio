
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
  Eye
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
const ACADEMIC_YEARS = ["2023 / 2024", "2022 / 2023", "2021 / 2022"];

const INITIAL_FEE_TYPES = [
  { id: "ft1", name: "Tuition Fee", amount: 150000, description: "Primary academic registration fee.", status: "mandatory" },
  { id: "ft2", name: "Uniform Package", amount: 25000, description: "Official institutional attire.", status: "mandatory" },
  { id: "ft3", name: "PTA Contribution", amount: 10000, description: "Annual PTA contribution.", status: "mandatory" },
  { id: "ft4", name: "Examination Fee", amount: 5000, description: "Exam administration fee.", status: "mandatory" },
];

const INITIAL_STUDENTS = [
  { id: "GBHS26S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 125000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "2nde / Form 5", year: "2023 / 2024" },
  { id: "GBHS26S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "Terminale / Upper Sixth", year: "2023 / 2024" },
  { id: "GBHS26S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", section: "Francophone Section", balances: { "Tuition Fee": 45000, "Uniform Package": 0, "PTA Contribution": 5000, "Examination Fee": 0 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: false, class: "1ère / Lower Sixth", year: "2023 / 2024" },
  { id: "GBHS26S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "2nde / Form 5", year: "2023 / 2024" },
  // Extra students for Form 2 demo
  { id: "GBHS26S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "5ème / Form 2", year: "2023 / 2024" },
  { id: "GBHS26S006", name: "Frank Castle", avatar: "https://picsum.photos/seed/s6/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 75000, "Uniform Package": 0, "PTA Contribution": 0, "Examination Fee": 0 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "5ème / Form 2", year: "2023 / 2024" },
  { id: "GBHS26S007", name: "Grace Hopper", avatar: "https://picsum.photos/seed/s7/100/100", section: "Anglophone Section", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000, "Examination Fee": 5000 }, isLicensePaid: true, class: "5ème / Form 2", year: "2023 / 2024" },
];

const MOCK_CLASS_STATS = [
  { name: "6ème / Form 1", totalStudents: 45, paidCount: 38, percentage: 84, arrears: "1.2M", status: "good", revenue: "5.4M", section: "Anglophone Section" },
  { name: "5ème / Form 2", totalStudents: 40, paidCount: 22, percentage: 55, arrears: "2.8M", status: "critical", revenue: "3.2M", section: "Anglophone Section" },
  { name: "2nde / Form 5", totalStudents: 42, paidCount: 40, percentage: 95, arrears: "200k", status: "optimal", revenue: "6.8M", section: "Anglophone Section" },
  { name: "3ème / Form 4", totalStudents: 38, paidCount: 30, percentage: 78, arrears: "1.5M", status: "good", revenue: "4.5M", section: "Francophone Section" },
];

export default function FeesPage() {
  const { user, platformSettings } = useAuth();
  const { language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [feeTypes, setFeeTypes] = useState(INITIAL_FEE_TYPES);
  const [activeFeeFilter, setActiveFeeFilter] = useState(INITIAL_FEE_TYPES[0].name);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<any>(null);
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [dossierSearch, setDossierSearch] = useState("");
  const [issuedReceipt, setIssuedReceipt] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({ type: INITIAL_FEE_TYPES[0].name, amount: "" });
  
  const [reportYear, setReportYear] = useState(ACADEMIC_YEARS[0]);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<any[]>([
    { id: "PAY-001", student: "Alice Thompson", type: "Tuition Fee", amount: "50,000", method: "Cash", date: "24 May, 10:30 AM" },
  ]);

  const isBursar = user?.role === "BURSAR";
  const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
  const isSubAdmin = user?.role === "SUB_ADMIN";
  const isAdmin = isSchoolAdmin || isSubAdmin;

  // HELPER: Defined before useMemo
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
      return matchesSearch && matchesClass && matchesSection;
    });
  }, [searchTerm, classFilter, sectionFilter, students]);

  const classDossierStudents = useMemo(() => {
    if (!selectedClassDetails) return [];
    return students.filter(s => s.class === selectedClassDetails.name);
  }, [selectedClassDetails, students]);

  const dossierSummary = useMemo(() => {
    if (classDossierStudents.length === 0) return { paid: 0, pending: 0 };
    const paid = classDossierStudents.filter(s => getStatusForFee(s, activeFeeFilter) === 'cleared').length;
    return { paid, pending: classDossierStudents.length - paid };
  }, [classDossierStudents, activeFeeFilter]);

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
      
      setTransactions(prev => [{ id: receipt.id, student: receipt.studentName, type: receipt.feeType, amount: receipt.amount, method: "Desk Payment", date: "Just now" }, ...prev]);
      setIssuedReceipt(receipt);
      setIsProcessing(false);
      setSelectedStudentForPayment(null);
      setPaymentForm({ type: activeFeeFilter, amount: "" });
      toast({ title: "Payment Recorded" });
    }, 1500);
  };

  const handleViewReceipt = (student: any) => {
    setIssuedReceipt({
      id: `TX-AUDIT-${student.id.split('S')[1]}`,
      studentName: student.name,
      studentId: student.id,
      class: student.class,
      feeType: activeFeeFilter,
      amount: (student.balances[activeFeeFilter] || 0).toLocaleString(),
      date: "May 2024",
      bursar: "System Verified"
    });
  };

  return (
    <div className="space-y-8 pb-20 px-1">
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
        
        <div className="flex items-center gap-2">
          {isBursar && (
            <Button className="h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] gap-2 shadow-lg" onClick={() => toast({ title: "Report Generated" })}>
              <FileText className="w-4 h-4 text-secondary" />
              Strategic Report
            </Button>
          )}
          <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest flex items-center gap-2 bg-white">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            Node Verified
          </Badge>
        </div>
      </div>

      <Tabs defaultValue={isAdmin ? "oversight" : "pay"} className="w-full">
        <TabsList className="grid w-full mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl grid-cols-4 md:w-[800px] overflow-x-auto no-scrollbar">
          {isAdmin && <TabsTrigger value="oversight" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm whitespace-nowrap"><Building2 className="w-4 h-4"/> Oversight</TabsTrigger>}
          {isBursar && <TabsTrigger value="pay" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm whitespace-nowrap"><Wallet className="w-4 h-4"/> Collection</TabsTrigger>}
          <TabsTrigger value="ledger" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm whitespace-nowrap"><History className="w-4 h-4"/> Ledger</TabsTrigger>
          <TabsTrigger value="tracker" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm whitespace-nowrap"><FileSpreadsheet className="w-4 h-4"/> Tracker</TabsTrigger>
        </TabsList>

        {isAdmin && (
          <TabsContent value="oversight" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border shadow-sm">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Intake Analytics</h2>
                <p className="text-xs text-muted-foreground">Audit collection by class level.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="w-full md:w-[200px]">
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger className="h-12 bg-accent/20 border-none rounded-xl font-bold"><SelectValue placeholder="All Sections" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Entire School</SelectItem>
                      {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-[250px]">
                  <Select value={activeFeeFilter} onValueChange={setActiveFeeFilter}>
                    <SelectTrigger className="h-12 bg-primary/5 border-primary/20 text-primary font-bold rounded-2xl">
                      <div className="flex items-center gap-2"><Filter className="w-4 h-4" /><SelectValue /></div>
                    </SelectTrigger>
                    <SelectContent>{feeTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
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

        {isBursar && (
          <TabsContent value="pay" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-white border-b p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative col-span-1 md:col-span-1">
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
                  <TableHeader className="bg-accent/10">
                    <TableRow className="uppercase text-[9px] font-black tracking-widest border-b border-accent/20">
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
        )}

        <TabsContent value="ledger" className="mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-white border-b p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Transaction History</CardTitle>
              <Button variant="outline" size="sm" className="rounded-xl h-9 text-[10px] font-bold gap-2"><Printer className="w-3.5 h-3.5"/> Print Ledger</Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Ref Code</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead className="text-center">Amount (XAF)</TableHead>
                    <TableHead className="text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-accent/5 h-14 border-b">
                      <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{tx.id}</TableCell>
                      <TableCell className="font-bold text-xs uppercase">{tx.student}</TableCell>
                      <TableCell className="text-xs font-medium">{tx.type}</TableCell>
                      <TableCell className="text-center font-black text-sm text-primary">{tx.amount}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 font-bold text-[8px] uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Secure
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracker" className="mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary p-6 md:p-10 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-secondary"><FileSpreadsheet className="w-8 h-8" /></div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Institutional Tracker</CardTitle>
                    <CardDescription className="text-white/60 text-xs">Live financial compliance registry.</CardDescription>
                  </div>
                </div>
                <Button className="bg-secondary text-primary hover:bg-secondary/90 h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg" onClick={() => toast({ title: "Export Started" })}>
                  <FileDown className="w-4 h-4" /> Download Registry
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Student Profile</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead className="text-center">Compliance</TableHead>
                    <TableHead className="text-right pr-8">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.filter(s => s.year === reportYear).map((s) => {
                    const status = getStatusForFee(s, activeFeeFilter);
                    const paid = (s.balances as any)[activeFeeFilter] || 0;
                    const total = (s.totals as any)[activeFeeFilter] || 150000;
                    const percentage = Math.round((paid / total) * 100);
                    return (
                      <TableRow key={s.id} className="hover:bg-accent/5 h-16 border-b">
                        <TableCell className="pl-8">
                          <p className="font-bold text-xs md:text-sm text-primary uppercase">{s.name}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{s.class}</p>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold text-muted-foreground">{s.id}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn("text-[8px] font-black uppercase px-2 border-none h-5", status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>{status}</Badge>
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
      </Tabs>

      {/* ADMIN CLASS DETAILS DIALOG - STUDENT DRILL DOWN */}
      <Dialog open={!!selectedClassDetails} onOpenChange={() => setSelectedClassDetails(null)}>
        <DialogContent className="sm:max-w-4xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary"><Building2 className="w-8 h-8" /></div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight">{selectedClassDetails?.name} Financial Dossier</DialogTitle>
                  <DialogDescription className="text-white/60">Audit record for {activeFeeFilter} • {selectedClassDetails?.section}</DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md w-fit border border-white/5">
                <div className="text-center border-r border-white/20 pr-4">
                  <p className="text-[8px] font-black uppercase opacity-60">Cleared</p>
                  <p className="text-lg font-black text-green-400">{dossierSummary.paid}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black uppercase opacity-60">Pending</p>
                  <p className="text-lg font-black text-amber-400">{dossierSummary.pending}</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedClassDetails(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto scrollbar-thin bg-white">
            <div className="p-6 border-b bg-accent/10 flex flex-col md:flex-row items-center gap-4">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    placeholder="Search students in class..." 
                    className="w-full pl-10 h-11 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20" 
                    value={dossierSearch} 
                    onChange={(e) => setDossierSearch(e.target.value)} 
                  />
               </div>
               <Button variant="outline" className="rounded-xl h-11 gap-2 font-bold bg-white border-primary/10 w-full md:w-auto" onClick={() => window.print()}>
                 <Printer className="w-4 h-4" /> Print Registry
               </Button>
            </div>

            <Table>
              <TableHeader className="bg-accent/30 uppercase text-[9px] font-black tracking-widest sticky top-0 z-10 border-b">
                <TableRow>
                  <TableHead className="pl-8 py-4">Student Profile</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead className="text-right">Paid (XAF)</TableHead>
                  <TableHead className="text-right">Balance (XAF)</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classDossierStudents.filter(s => s.name.toLowerCase().includes(dossierSearch.toLowerCase())).map((s) => {
                  const paid = (s.balances as any)[activeFeeFilter] || 0;
                  const total = (s.totals as any)[activeFeeFilter] || 150000;
                  const unpaid = total - paid;
                  const status = paid >= total ? 'cleared' : 'partial';
                  
                  return (
                    <TableRow key={s.id} className="hover:bg-accent/5 h-16 border-b border-accent/10">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                            <AvatarImage src={s.avatar} />
                            <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-xs md:text-sm text-primary uppercase">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-muted-foreground">{s.id}</TableCell>
                      <TableCell className="text-right font-black text-green-600">{paid.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-black text-red-600">
                        {unpaid > 0 ? unpaid.toLocaleString() : <Badge className="bg-green-100 text-green-700 border-none text-[8px]">CLEARED</Badge>}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <Badge className={cn("text-[8px] font-black uppercase h-5 px-2 border-none", status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                            {status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5" onClick={() => handleViewReceipt(s)}>
                            <Eye className="w-4 h-4 text-primary/40 group-hover:text-primary" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {classDossierStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center text-muted-foreground italic">No student financial records found for this cohort.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-center">
             <div className="flex items-center gap-2 text-muted-foreground italic">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Administrative Revenue Audit Record</p>
             </div>
          </DialogFooter>
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
            <Button variant="ghost" size="icon" onClick={() => setSelectedStudentForPayment(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
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
                <div className="relative">
                  <Input type="number" placeholder="0" className="h-14 bg-accent/30 border-none rounded-2xl font-black text-2xl text-primary pl-6" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[10px] opacity-40 uppercase">XAF</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-14 rounded-2xl shadow-xl font-black uppercase text-xs gap-3 bg-primary text-white" onClick={handleProcessPayment} disabled={isProcessing || !paymentForm.amount}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Finalize Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RECEIPT PREVIEW DIALOG */}
      <Dialog open={!!issuedReceipt} onOpenChange={() => setIssuedReceipt(null)}>
        <DialogContent className="sm:max-w-2xl p-0 border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <DialogHeader className="bg-primary p-6 md:p-8 text-white relative no-print">
            <div className="flex items-center gap-4">
              <div className="p-2 md:p-3 bg-white/10 rounded-2xl text-secondary"><Receipt className="w-8 h-8" /></div>
              <DialogTitle className="text-xl md:text-2xl font-black">Official Receipt Issued</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIssuedReceipt(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="bg-muted p-4 md:p-10 print:p-0 print:bg-white overflow-y-auto max-h-[70vh]">
            <div id="printable-receipt" className="bg-white p-6 md:p-10 border-2 border-black shadow-sm relative flex flex-col space-y-8 font-serif text-black print:border-none print:shadow-none min-w-[350px]">
               <div className="flex justify-between items-center border-b-2 border-black pb-4">
                  <img src={user?.school?.logo || platformSettings.logo} alt="School" className="w-12 h-12 object-contain" />
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase opacity-40">Ref Code</p>
                    <p className="text-sm font-mono font-black">{issuedReceipt?.id}</p>
                  </div>
               </div>
               <div className="text-center space-y-1">
                  <h2 className="font-black text-sm uppercase text-primary leading-tight">{issuedReceipt?.schoolName || platformSettings.name}</h2>
                  <p className="text-[8px] font-bold uppercase opacity-60 tracking-widest underline decoration-double">Official Financial Receipt</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground border-b pb-1 mb-2">Student Identity</p>
                      <p className="font-black text-xs md:text-base uppercase leading-tight">{issuedReceipt?.studentName}</p>
                      <p className="text-[9px] font-mono font-bold text-primary mt-1">{issuedReceipt?.studentId} • {issuedReceipt?.class}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="p-4 bg-primary text-white rounded-2xl shadow-xl">
                      <p className="text-[8px] font-black uppercase opacity-60 tracking-widest mb-1">Amount Received</p>
                      <p className="font-black text-xl md:text-2xl text-secondary underline decoration-double">{issuedReceipt?.amount} XAF</p>
                    </div>
                  </div>
               </div>
               <div className="pt-8 border-t border-black/5 flex justify-between items-end">
                  <div className="flex flex-col items-center gap-2"><QrCode className="w-14 h-14 text-primary opacity-20" /><p className="text-[7px] font-black uppercase text-muted-foreground opacity-40">Verified Registry</p></div>
                  <div className="text-center space-y-4 w-32"><div className="h-10 w-full mx-auto bg-primary/5 rounded border-b-2 border-black/40 relative flex items-center justify-center"><SignatureSVG className="w-full h-full text-primary/20 p-2" /></div><p className="text-[8px] font-black uppercase text-primary">The Bursar</p></div>
               </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 md:p-8 border-t no-print flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 rounded-xl h-12 md:h-14 font-black uppercase tracking-widest text-xs" onClick={() => setIssuedReceipt(null)}>Close</Button>
            <Button className="flex-1 rounded-xl h-12 md:h-14 shadow-2xl font-black uppercase tracking-widest text-xs gap-2 bg-primary text-white" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print Receipt</Button>
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
