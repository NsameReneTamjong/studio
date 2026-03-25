
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
  CheckCircle,
  Download,
  Building2,
  BookMarked,
  Signature,
  ChevronRight,
  ArrowRight,
  PieChart,
  User,
  Users,
  Banknote,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// Constants
const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const FEE_TYPES = ["Tuition Fee", "Uniform Package", "PTA Contribution", "Examination Fee", "Library Card", "Sports Gear"];
const ACADEMIC_YEARS = ["2023 / 2024", "2022 / 2023", "2021 / 2022"];

// Initial Mock Data
const INITIAL_STUDENTS = [
  { id: "GBHS26S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", balances: { "Tuition Fee": 125000, "Uniform Package": 25000, "PTA Contribution": 10000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000 }, isLicensePaid: true, class: "2nde / Form 5", year: "2023 / 2024" },
  { id: "GBHS26S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000 }, isLicensePaid: true, class: "Terminale / Upper Sixth", year: "2023 / 2024" },
  { id: "GBHS26S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", balances: { "Tuition Fee": 45000, "Uniform Package": 0, "PTA Contribution": 5000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000 }, isLicensePaid: false, class: "1ère / Lower Sixth", year: "2023 / 2024" },
  { id: "GBHS26S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000 }, isLicensePaid: true, class: "2nde / Form 5", year: "2023 / 2024" },
  { id: "GBHS26S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100", balances: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000 }, totals: { "Tuition Fee": 150000, "Uniform Package": 25000, "PTA Contribution": 10000 }, isLicensePaid: true, class: "Terminale / Upper Sixth", year: "2023 / 2024" },
];

const MOCK_CLASS_STATS = [
  { name: "6ème / Form 1", totalStudents: 45, paidCount: 38, percentage: 84, arrears: "1.2M", status: "good" },
  { name: "5ème / Form 2", totalStudents: 40, paidCount: 22, percentage: 55, arrears: "2.8M", status: "critical" },
  { name: "4ème / Form 3", totalStudents: 38, paidCount: 35, percentage: 92, arrears: "450k", status: "optimal" },
  { name: "3ème / Form 4", totalStudents: 42, paidCount: 30, percentage: 71, arrears: "1.8M", status: "warning" },
  { name: "2nde / Form 5", totalStudents: 42, paidCount: 40, percentage: 95, arrears: "200k", status: "optimal" },
  { name: "1ère / Lower Sixth", totalStudents: 35, paidCount: 20, percentage: 57, arrears: "3.1M", status: "critical" },
  { name: "Terminale / Upper Sixth", totalStudents: 30, paidCount: 28, percentage: 93, arrears: "350k", status: "optimal" },
];

export default function FeesPage() {
  const { user, platformSettings } = useAuth();
  const { language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [activeFeeFilter, setActiveFeeFilter] = useState("Tuition Fee");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<any>(null);
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [dossierSearch, setDossierSearch] = useState("");
  const [issuedReceipt, setIssuedReceipt] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({ type: "Tuition Fee", amount: "" });
  
  const [reportYear, setReportYear] = useState(ACADEMIC_YEARS[0]);
  const [reportClass, setReportClass] = useState("all");
  const [reportStatus, setReportStatus] = useState("all");

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<any[]>([
    { id: "PAY-001", student: "Alice Thompson", type: "Tuition Fee", amount: "50,000", method: "Cash", date: "24 May, 10:30 AM" },
    { id: "PAY-002", student: "Bob Richards", type: "Uniform Package", amount: "25,000", method: "MoMo", date: "24 May, 09:15 AM" },
  ]);

  const isBursar = user?.role === "BURSAR";
  const isAdmin = user?.role === "SCHOOL_ADMIN" || user?.role === "SUB_ADMIN";

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === "all" || s.class === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [searchTerm, classFilter, students]);

  const reportingList = useMemo(() => {
    return students.filter(s => {
      const matchesYear = s.year === reportYear;
      const matchesClass = reportClass === "all" || s.class === reportClass;
      
      const paid = (s.balances as any)[activeFeeFilter] || 0;
      const total = (s.totals as any)[activeFeeFilter] || 150000;
      const status = paid >= total ? 'cleared' : 'partial';
      
      const matchesStatus = reportStatus === "all" || status === reportStatus;
      const matchesSearch = s.name.toLowerCase().includes(dossierSearch.toLowerCase()) || s.id.toLowerCase().includes(dossierSearch.toLowerCase());
      
      return matchesYear && matchesClass && matchesStatus && matchesSearch;
    });
  }, [reportYear, reportClass, reportStatus, students, activeFeeFilter, dossierSearch]);

  const handleProcessPayment = () => {
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      toast({ variant: "destructive", title: "Valid Amount Required" });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const amountNum = parseFloat(paymentForm.amount);
      const studentId = selectedStudentForPayment.id;
      
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          const currentBalances = { ...s.balances };
          const currentVal = (currentBalances as any)[paymentForm.type] || 0;
          (currentBalances as any)[paymentForm.type] = currentVal + amountNum;
          return {
            ...s,
            balances: currentBalances
          };
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
      
      setTransactions(prev => [
        {
          id: receipt.id,
          student: receipt.studentName,
          type: receipt.feeType,
          amount: receipt.amount,
          method: "Desk Payment",
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
        },
        ...prev
      ]);

      setIssuedReceipt(receipt);
      setIsProcessing(false);
      setSelectedStudentForPayment(null);
      setPaymentForm({ type: activeFeeFilter, amount: "" });
      toast({ title: "Payment Recorded", description: `${receipt.studentName}'s record updated.` });
    }, 1500);
  };

  const handleDownloadList = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Export Successful",
        description: `Institutional list for ${reportYear} generated.`,
      });
    }, 2000);
  };

  const getStatusForFee = (student: any, feeType: string) => {
    const paid = (student.balances as any)[feeType] || 0;
    const total = (student.totals as any)[feeType] || 150000;
    return paid >= total ? 'cleared' : 'partial';
  };

  const visibleTabsCount = (isAdmin ? 4 : 0) + (isBursar ? 4 : 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-20 px-1">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-xl border-2 border-white shrink-0">
            <Coins className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline tracking-tighter">
              {isAdmin ? "Institutional Revenue" : "Collection Desk"}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {isAdmin ? "Oversight of institutional intake and collection velocity." : "Manage intake, record payments, and issue receipts."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest flex items-center gap-2 bg-white">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            {isAdmin ? "Node Integrity Active" : "Official Collector"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue={isAdmin ? "oversight" : "pay"} className="w-full">
        <TabsList className={cn(
          "grid mb-6 bg-white shadow-sm border h-auto p-1 rounded-2xl",
          isAdmin ? "grid-cols-4 lg:w-[800px]" : "grid-cols-4 lg:w-[800px]"
        )}>
          {isAdmin && (
            <TabsTrigger value="oversight" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
              <Building2 className="w-4 h-4" /> <span className="hidden sm:inline">Fee</span> Oversight
            </TabsTrigger>
          )}
          {isBursar && (
            <TabsTrigger value="pay" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
              <Wallet className="w-4 h-4" /> <span className="hidden sm:inline">Collection</span> Desk
            </TabsTrigger>
          )}
          <TabsTrigger value="ledger" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
            <History className="w-4 h-4" /> <span className="hidden sm:inline">Transaction</span> Log
          </TabsTrigger>
          <TabsTrigger value="tracker" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
            <FileSpreadsheet className="w-4 h-4" /> <span className="hidden sm:inline">Fee</span> Tracker
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
            <TrendingUp className="w-4 h-4" /> <span className="hidden sm:inline">Finance</span> Metrics
          </TabsTrigger>
        </TabsList>

        {isAdmin && (
          <TabsContent value="oversight" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border shadow-sm">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Institutional Fee Tracker</h2>
                <p className="text-xs text-muted-foreground">Select a category to audit collection percentages by class level.</p>
              </div>
              <div className="w-full md:w-[300px]">
                <Label className="text-[10px] font-black uppercase text-primary ml-1 mb-1.5 block">Audit Category</Label>
                <Select value={activeFeeFilter} onValueChange={setActiveFeeFilter}>
                  <SelectTrigger className="h-12 bg-primary/5 border-primary/20 text-primary font-bold rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_CLASS_STATS.map((cls) => (
                <Card key={cls.name} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white">
                  <div className={cn(
                    "h-1.5 w-full",
                    cls.status === 'optimal' ? "bg-green-500" : cls.status === 'critical' ? "bg-red-500" : "bg-amber-500"
                  )} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-black text-primary">{cls.name}</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3" /> {cls.totalStudents} Students
                        </CardDescription>
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl flex flex-col items-center justify-center min-w-[70px] border-2",
                        cls.status === 'optimal' ? "bg-green-50 border-green-100 text-green-700" : 
                        cls.status === 'warning' ? "bg-amber-50 border-amber-100 text-amber-700" : 
                        "bg-red-50 border-red-100 text-red-700"
                      )}>
                        <span className="text-xl font-black">{cls.percentage}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                        <span>Paid ({activeFeeFilter.split(' ')[0]})</span>
                        <span>{cls.paidCount} / {cls.totalStudents}</span>
                      </div>
                      <Progress value={cls.percentage} className={cn(
                        "h-2",
                        cls.status === 'optimal' ? "[&>div]:bg-green-500" : cls.status === 'warning' ? "[&>div]:bg-amber-500" : "[&>div]:bg-red-500"
                      )} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl border border-accent">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Arrears</p>
                        <p className="text-sm font-black text-primary">{cls.arrears} XAF</p>
                      </div>
                      <div className="h-8 w-px bg-accent mx-2" />
                      <div className="space-y-0.5 text-right">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                        <p className="text-xs font-bold uppercase">{cls.status}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-accent/10 border-t p-4 pt-4">
                    <Button 
                      variant="ghost" 
                      className="flex-1 justify-between hover:bg-white text-primary font-bold text-xs w-full"
                      onClick={() => setSelectedClassDetails(cls)}
                    >
                      View Class Fee Dossier
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {isBursar && (
          <TabsContent value="pay" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
            <Card className="border-none shadow-xl overflow-hidden rounded-[1.5rem] md:rounded-3xl">
              <CardHeader className="bg-white border-b p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative col-span-1 md:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search name or ID..." 
                      className="pl-10 h-11 bg-accent/20 border-none rounded-xl text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Class Level</Label>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                      <SelectTrigger className="h-11 bg-accent/20 border-none rounded-xl text-sm">
                        <SelectValue placeholder="All Classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-primary ml-1">Fee Category Filter</Label>
                    <Select value={activeFeeFilter} onValueChange={setActiveFeeFilter}>
                      <SelectTrigger className="h-11 bg-primary/5 border-primary/20 text-primary font-bold rounded-xl text-sm">
                        <div className="flex items-center gap-2">
                          <Filter className="w-3.5 h-3.5" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {FEE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10">
                    <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                      <TableHead className="pl-6 md:pl-8 py-4">Matricule</TableHead>
                      <TableHead>Student Profile</TableHead>
                      <TableHead className="hidden md:table-cell">Academic Level</TableHead>
                      <TableHead className="text-center">Status ({activeFeeFilter})</TableHead>
                      <TableHead className="text-right pr-6 md:pr-8">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s) => {
                      const status = getStatusForFee(s, activeFeeFilter);
                      const paid = (s.balances as any)[activeFeeFilter] || 0;
                      const total = (s.totals as any)[activeFeeFilter] || 150000;
                      
                      return (
                        <TableRow key={s.id} className="group hover:bg-accent/5 transition-colors border-b last:border-0">
                          <TableCell className="pl-6 md:pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white shadow-sm ring-1 ring-accent shrink-0">
                                <AvatarImage src={s.avatar} alt={s.name} />
                                <AvatarFallback className="bg-primary/5 text-primary text-[10px]">{s.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-bold text-xs md:text-sm text-primary leading-tight">{s.name}</span>
                                <span className="text-[9px] font-bold opacity-40 uppercase">{paid.toLocaleString()} / {total.toLocaleString()} Paid</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="text-[10px] border-primary/10 text-primary font-bold">{s.class}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "text-[9px] font-black uppercase border-none px-3 h-5",
                              status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {status === 'cleared' ? 'Cleared' : 'Arrears'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6 md:pr-8">
                            <Button 
                              size="sm" 
                              className="rounded-xl h-8 md:h-9 px-3 md:px-6 font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-lg"
                              disabled={status === 'cleared'}
                              onClick={() => {
                                setSelectedStudentForPayment(s);
                                setPaymentForm({ ...paymentForm, type: activeFeeFilter });
                              }}
                            >
                              <Wallet className="w-3 h-3 md:w-3.5 md:h-3.5 md:mr-2" /> 
                              <span className="hidden sm:inline">Pay {activeFeeFilter.split(' ')[0]}</span>
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
          <Card className="border-none shadow-xl overflow-hidden rounded-[1.5rem] md:rounded-3xl">
            <CardHeader className="bg-white border-b p-4 md:p-6">
              <CardTitle className="text-sm md:text-base font-black uppercase tracking-tight text-primary">Global Transaction Log</CardTitle>
              <CardDescription className="text-xs">Verified chronological record of physical and digital intake.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/30 uppercase text-[10px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-6 md:pl-8 py-4">Ref Code</TableHead>
                    <TableHead>Student Identity</TableHead>
                    <TableHead className="hidden md:table-cell">Fee Category</TableHead>
                    <TableHead className="text-center">Amount (XAF)</TableHead>
                    <TableHead className="text-right pr-6 md:pr-8">Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-accent/5 transition-colors">
                      <TableCell className="pl-6 md:pl-8 py-4 font-mono font-bold text-primary text-[10px] md:text-xs">{tx.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs md:text-sm text-primary">{tx.student}</span>
                          <span className="md:hidden text-[9px] text-muted-foreground uppercase">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs font-medium">{tx.type}</TableCell>
                      <TableCell className="text-center font-black text-primary text-xs md:text-sm">{tx.amount}</TableCell>
                      <TableCell className="text-right pr-6 md:pr-8">
                        <div className="flex items-center justify-end gap-1.5 text-green-600 font-bold text-[9px] uppercase">
                          <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> <span className="hidden sm:inline">SECURE</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracker" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-3xl overflow-hidden">
            <CardHeader className="bg-primary p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <FileSpreadsheet className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black">Institutional Fee Tracker</CardTitle>
                    <CardDescription className="text-white/60">Live financial registry with performance auditing and collection status.</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 px-6 rounded-xl font-black uppercase text-xs gap-2"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4" /> Print Tracker
                  </Button>
                  <Button 
                    className="bg-secondary text-primary hover:bg-secondary/90 h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs gap-2 shadow-lg"
                    onClick={handleDownloadList}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                    Download Registry
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-primary" /> Session
                  </Label>
                  <Select value={reportYear} onValueChange={setReportYear}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-primary" /> Fee Type
                  </Label>
                  <Select value={activeFeeFilter} onValueChange={setActiveFeeFilter}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 lg:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-primary" /> Quick Find
                  </Label>
                  <Input 
                    placeholder="Search students in tracker..." 
                    className="h-12 bg-accent/30 border-none rounded-xl"
                    value={dossierSearch}
                    onChange={(e) => setDossierSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="rounded-2xl border border-accent overflow-hidden shadow-inner bg-white">
                  <Table>
                    <TableHeader className="bg-accent/10">
                      <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                        <TableHead className="pl-8 py-4">Student Profile</TableHead>
                        <TableHead>Matricule</TableHead>
                        <TableHead className="text-center">Collection Status</TableHead>
                        <TableHead className="text-right pr-8">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportingList.map((s) => {
                        const status = getStatusForFee(s, activeFeeFilter);
                        const paid = (s.balances as any)[activeFeeFilter] || 0;
                        const total = (s.totals as any)[activeFeeFilter] || 150000;
                        const percentage = (paid / total) * 100;
                        
                        return (
                          <TableRow key={s.id} className="group hover:bg-accent/5 transition-colors border-b last:border-0">
                            <TableCell className="pl-8 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                                  <AvatarImage src={s.avatar} alt={s.name} />
                                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">{s.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-sm text-primary leading-tight">{s.name}</p>
                                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">{s.class}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs font-bold text-muted-foreground">{s.id}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={cn(
                                "text-[9px] font-black uppercase px-3 h-5 border-none",
                                status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                              )}>
                                {status === 'cleared' ? 'Cleared' : 'Arrears'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <div className="inline-flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-primary">{paid.toLocaleString()} / {total.toLocaleString()}</span>
                                  <span className="text-[10px] font-bold text-muted-foreground">({Math.round(percentage)}%)</span>
                                </div>
                                <div className="w-32 h-1.5 bg-accent rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full transition-all duration-1000",
                                      status === 'cleared' ? "bg-green-500" : "bg-primary"
                                    )} 
                                    style={{ width: `${percentage}%` }} 
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {reportingList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">
                            No records found matching your search and filter criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-accent/10 p-6 border-t flex justify-between items-center">
               <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[10px] uppercase font-black tracking-widest italic opacity-40">Verified Institutional Financial Record</p>
               </div>
               <p className="text-[10px] font-black text-primary/60 uppercase">System Time: {new Date().toLocaleTimeString()}</p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-0 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Global Collection</p>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-blue-700">84.2%</div>
                <p className="text-[10px] text-blue-600/60 font-bold mt-1 uppercase">Across all fee categories</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Platform Licenses</p>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-green-700">1,120 / 1,284</div>
                <p className="text-[10px] text-blue-600/60 font-bold mt-1 uppercase">Active Dashboard Nodes</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Tuition Arrears</p>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-amber-700">4.6M XAF</div>
                <p className="text-[10px] text-blue-600/60 font-bold mt-1 uppercase">Sequence 2 Recovery Required</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* CLASS FEE DOSSIER DIALOG */}
      <Dialog open={!!selectedClassDetails} onOpenChange={() => setSelectedClassDetails(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className={cn(
            "p-8 text-white shrink-0",
            selectedClassDetails?.status === 'optimal' ? "bg-green-600" : selectedClassDetails?.status === 'critical' ? "bg-red-600" : "bg-primary"
          )}>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-3xl font-black">{selectedClassDetails?.name}</DialogTitle>
                <DialogDescription className="text-white/70 font-bold flex items-center gap-2 mt-1">
                  <Coins className="w-4 h-4" /> Category: {activeFeeFilter}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Collected</p>
                  <p className="text-3xl font-black">{selectedClassDetails?.percentage}%</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white/10 border-white/20 text-white rounded-2xl h-14 w-14"
                  onClick={() => toast({ title: "Class Report Generating..." })}
                >
                  <Download className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 bg-accent/30 border-b flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1">
                <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-1">
                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Net Intake</p>
                   <p className="text-xl font-black text-primary">{(parseInt(selectedClassDetails?.paidCount || "0") * 150000).toLocaleString()} XAF</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-1">
                   <p className="text-[10px] font-black uppercase text-red-600 tracking-widest leading-none">Class Arrears</p>
                   <p className="text-xl font-black text-red-700">{selectedClassDetails?.arrears} XAF</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-1 hidden md:block">
                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Clearance Status</p>
                   <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-primary">{selectedClassDetails?.paidCount}</span>
                      <span className="text-xs font-bold text-muted-foreground">/ {selectedClassDetails?.totalStudents} Paid</span>
                   </div>
                </div>
             </div>
             
             <div className="relative w-full md:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-10 h-12 bg-white border-none rounded-xl font-bold"
                  value={dossierSearch}
                  onChange={(e) => setDossierSearch(e.target.value)}
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-0">
            <Table>
              <TableHeader className="bg-accent/30 sticky top-0 z-10 uppercase text-[10px] font-black tracking-widest border-b">
                <TableRow>
                  <TableHead className="pl-8 py-4">Student Profile</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead className="text-center">Collection Status</TableHead>
                  <TableHead className="text-right pr-8">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students
                  .filter(s => s.class === selectedClassDetails?.name)
                  .filter(s => s.name.toLowerCase().includes(dossierSearch.toLowerCase()))
                  .map(s => {
                    const status = getStatusForFee(s, activeFeeFilter);
                    const paid = (s.balances as any)[activeFeeFilter] || 0;
                    const total = (s.totals as any)[activeFeeFilter] || 150000;
                    
                    return (
                      <TableRow key={s.id} className="hover:bg-accent/5 border-b border-accent/10 transition-colors">
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                              <AvatarImage src={s.avatar} />
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-sm text-primary">{s.name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Parent Verified</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold text-muted-foreground">{s.id}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase px-3 h-5 border-none",
                            status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {status === 'cleared' ? 'Cleared' : 'Arrears'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="space-y-1">
                            <div className="flex items-center justify-end gap-2">
                               <Banknote className="w-3.5 h-3.5 text-green-600" />
                               <span className="font-black text-primary text-sm">{paid.toLocaleString()}</span>
                               <span className="text-[10px] font-bold opacity-40">/ {total.toLocaleString()}</span>
                            </div>
                            <Progress value={(paid / total) * 100} className="h-1 w-24 ml-auto" />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                })}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter className="bg-accent/10 p-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
             <div className="flex items-center gap-3 text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40 leading-none">Verified Institutional Record</p>
                  <p className="text-[8px] font-bold text-primary/40 uppercase leading-none">Digital ID Synchronization Active</p>
                </div>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl px-6 h-11 font-black uppercase text-[10px]" onClick={() => setSelectedClassDetails(null)}>Close Dossier</Button>
                <Button className="rounded-xl px-8 h-11 font-black uppercase text-[10px] gap-2 shadow-lg">
                  <Printer className="w-4 h-4" /> Print Registry
                </Button>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PAYMENT MODAL (ONLY ACCESSIBLE TO BURSARS IN PROTOTYPE) */}
      <Dialog open={!!selectedStudentForPayment} onOpenChange={() => setSelectedStudentForPayment(null)}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-6 md:p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Wallet className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-xl md:text-2xl font-black">Fee Collection</DialogTitle>
                <DialogDescription className="text-white/60 text-xs md:text-sm">
                  Recording payment for <span className="text-white font-black">{selectedStudentForPayment?.name}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Charge Category</Label>
                <Select value={paymentForm.type} onValueChange={(v) => setPaymentForm({...paymentForm, type: v})}>
                  <SelectTrigger className="h-11 md:h-12 bg-accent/30 border-none rounded-xl font-bold text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount (XAF)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className="h-12 md:h-14 bg-accent/30 border-none rounded-2xl font-black text-lg md:text-xl text-primary pl-6"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[10px] opacity-40 uppercase">XAF</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
              <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                Transaction will be finalized and an official institutional receipt will be generated immediately.
              </p>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button 
              className="w-full h-12 md:h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white" 
              onClick={handleProcessPayment}
              disabled={isProcessing || !paymentForm.amount}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Finalize & Generate Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HIGH-FIDELITY OFFICIAL RECEIPT DIALOG */}
      <Dialog open={!!issuedReceipt} onOpenChange={() => setIssuedReceipt(null)}>
        <DialogContent className="sm:max-w-2xl p-0 border-none shadow-2xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
          <DialogHeader className="bg-primary p-6 md:p-8 text-white no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 md:p-3 bg-white/10 rounded-2xl">
                  <Receipt className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-xl md:text-2xl font-black">Official Receipt Issued</DialogTitle>
                  <DialogDescription className="text-white/60 text-xs">Institutional financial transaction successfully recorded.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIssuedReceipt(null)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-4 md:p-10 print:p-0 print:bg-white overflow-hidden">
            <div id="printable-receipt" className="bg-white p-6 md:p-10 border-2 border-black shadow-sm relative flex flex-col space-y-8 font-serif text-black print:border-none print:shadow-none min-w-[350px]">
               {/* National Header */}
               <div className="grid grid-cols-3 gap-2 items-start text-center border-b-2 border-black pb-4">
                  <div className="space-y-0.5 text-[7px] uppercase font-bold">
                    <p>Republic of Cameroon</p>
                    <p>Peace - Work - Fatherland</p>
                    <div className="h-px bg-black w-6 mx-auto my-0.5" />
                    <p>Min. of Secondary Education</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={user?.school?.logo} alt="School" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                  </div>
                  <div className="space-y-0.5 text-[7px] uppercase font-bold">
                    <p>République du Cameroun</p>
                    <p>Paix - Travail - Patrie</p>
                    <div className="h-px bg-black w-6 mx-auto my-0.5" />
                    <p>Min. des Enseignements Sec.</p>
                  </div>
               </div>

               <div className="text-center space-y-1">
                  <h2 className="font-black text-sm md:text-base uppercase tracking-tighter text-primary">{user?.school?.name}</h2>
                  <p className="text-[8px] md:text-[9px] font-bold uppercase opacity-60 tracking-widest underline decoration-double underline-offset-2">Official Financial Receipt</p>
               </div>

               <div className="flex justify-between items-end bg-accent/5 p-4 border border-black/10 rounded-xl">
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Receipt Reference</p>
                    <p className="text-sm md:text-base font-mono font-black text-primary">{issuedReceipt?.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Transaction Date</p>
                    <p className="font-bold text-xs md:text-sm">{issuedReceipt?.date}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground tracking-widest border-b border-black/5 pb-1 mb-2">Student Identity</p>
                      <p className="font-black text-xs md:text-base uppercase leading-tight">{issuedReceipt?.studentName}</p>
                      <p className="text-[9px] font-10px font-mono font-bold text-primary mt-1">{issuedReceipt?.studentId} • {issuedReceipt?.class}</p>
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground tracking-widest border-b border-black/5 pb-1 mb-2">Fee Particulars</p>
                      <Badge variant="outline" className="border-black/20 text-black font-black uppercase text-[10px] px-3">{issuedReceipt?.feeType}</Badge>
                    </div>
                  </div>
                  <div className="space-y-6 text-left md:text-right flex flex-col justify-end">
                    <div className="p-4 bg-primary text-white rounded-2xl shadow-xl transform md:rotate-1">
                      <p className="text-[8px] md:text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">Net Amount Received</p>
                      <p className="font-black text-xl md:text-2xl text-secondary underline underline-offset-4 decoration-double">{issuedReceipt?.amount} XAF</p>
                    </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-black/5 flex justify-between items-end">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-white border border-black/10 rounded-lg shadow-inner">
                      <QrCode className="w-14 h-14 md:w-20 md:h-20 text-primary opacity-20" />
                    </div>
                    <p className="text-[7px] font-black uppercase text-muted-foreground opacity-40">Verified Registry Node</p>
                  </div>
                  <div className="text-center space-y-6 w-32">
                    <div className="h-10 md:h-12 w-full mx-auto bg-primary/5 rounded border-b-2 border-black/40 relative">
                       <Signature className="absolute inset-0 w-full h-full text-primary/20 p-2" />
                    </div>
                    <p className="text-[8px] font-black uppercase text-primary tracking-widest leading-none">The Bursar</p>
                  </div>
               </div>

               <div className="text-center pt-6 border-t border-black/5">
                  <div className="flex items-center justify-center gap-3">
                    <img src={platformSettings.logo} alt="EduIgnite" className="w-4 h-4 object-contain opacity-20" />
                    <p className="text-[7px] md:text-[8px] font-black uppercase text-muted-foreground opacity-30 tracking-[0.4em]">
                      Powered by {platformSettings.name} Academic SaaS • Official Digital Record
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-4 md:p-8 border-t no-print flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 rounded-xl h-12 md:h-14 font-black uppercase tracking-widest text-[10px] md:text-xs" onClick={() => setIssuedReceipt(null)}>
              Close & Return
            </Button>
            <div className="flex flex-1 gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-xl h-12 md:h-14 font-black uppercase tracking-widest text-[10px] md:text-xs gap-2"
                onClick={() => toast({ title: "Download Initialized", description: "Receipt PDF is being prepared." })}
              >
                <Download className="w-4 h-4" /> Download
              </Button>
              <Button 
                className="flex-1 rounded-xl h-12 md:h-14 shadow-2xl font-black uppercase tracking-widest text-[10px] md:text-xs gap-2 bg-primary text-white" 
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
