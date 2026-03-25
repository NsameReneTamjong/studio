
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
  SearchX,
  CreditCard,
  FileDown,
  Filter,
  CalendarDays,
  FileSpreadsheet
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Constants
const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const FEE_TYPES = ["Tuition Fee", "Uniform Package", "PTA Contribution", "Examination Fee", "Library Card", "Sports Gear"];
const ACADEMIC_YEARS = ["2023 / 2024", "2022 / 2023", "2021 / 2022"];

// Initial Mock Data
const INITIAL_STUDENTS = [
  { id: "GBHS26S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", totalFee: 150000, paid: 125000, status: "partial", isLicensePaid: true, class: "2nde / Form 5", year: "2023 / 2024" },
  { id: "GBHS26S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", totalFee: 150000, paid: 150000, status: "cleared", isLicensePaid: true, class: "Terminale / Upper Sixth", year: "2023 / 2024" },
  { id: "GBHS26S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", totalFee: 150000, paid: 45000, status: "partial", isLicensePaid: false, class: "1ère / Lower Sixth", year: "2023 / 2024" },
  { id: "GBHS26S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", totalFee: 150000, paid: 150000, status: "cleared", isLicensePaid: true, class: "2nde / Form 5", year: "2023 / 2024" },
];

export default function FeesPage() {
  const { user, platformSettings } = useAuth();
  const { language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<any>(null);
  const [issuedReceipt, setIssuedReceipt] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({ type: "Tuition Fee", amount: "" });
  
  // Reporting States
  const [reportYear, setReportYear] = useState(ACADEMIC_YEARS[0]);
  const [reportClass, setReportClass] = useState("all");
  const [reportFeeType, setReportFeeType] = useState("all");

  // Dynamic State for mock interaction
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<any[]>([
    { id: "PAY-001", student: "Alice Thompson", type: "Tuition Fee", amount: "50,000", method: "Cash", date: "24 May, 10:30 AM" },
    { id: "PAY-002", student: "Bob Richards", type: "Uniform Package", amount: "25,000", method: "MoMo", date: "24 May, 09:15 AM" },
  ]);

  const isBursar = user?.role === "BURSAR";

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
      // In a real app, we'd check against a sub-collection of payments for the specific fee type
      return matchesYear && matchesClass;
    });
  }, [reportYear, reportClass, students]);

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
          const newPaid = s.paid + amountNum;
          return {
            ...s,
            paid: newPaid,
            status: newPaid >= s.totalFee ? "cleared" : "partial"
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
      setPaymentForm({ type: "Tuition Fee", amount: "" });
      toast({ title: "Payment Recorded", description: `${receipt.studentName}'s record updated.` });
    }, 1500);
  };

  const handleDownloadList = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Export Successful",
        description: `Student list for ${reportYear} (${reportClass}) generated.`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20 px-1">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-xl border-2 border-white shrink-0">
            <Coins className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline tracking-tighter">
              {isBursar ? "Collection Desk" : "Institutional Finance"}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">Manage intake, record payments, and audit institutional revenue.</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pay" className="w-full">
        <TabsList className="grid grid-cols-4 w-full lg:w-[800px] mb-6 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="pay" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
            <Wallet className="w-4 h-4" /> <span className="hidden sm:inline">Collection</span> Desk
          </TabsTrigger>
          <TabsTrigger value="ledger" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
            <History className="w-4 h-4" /> <span className="hidden sm:inline">Transaction</span> Log
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
            <FileDown className="w-4 h-4" /> <span className="hidden sm:inline">Download</span> Lists
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-2 py-2 md:py-3 rounded-xl transition-all text-xs md:text-sm">
            <TrendingUp className="w-4 h-4" /> <span className="hidden sm:inline">Finance</span> Metrics
          </TabsTrigger>
        </TabsList>

        {/* COLLECTION DESK TAB */}
        <TabsContent value="pay" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-[1.5rem] md:rounded-3xl">
            <CardHeader className="bg-white border-b p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Find student by name or Matricule..." 
                    className="pl-10 h-11 md:h-12 bg-accent/20 border-none rounded-xl text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-full md:w-[200px] h-11 md:h-12 bg-accent/20 border-none rounded-xl text-sm">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                    <TableHead className="pl-6 md:pl-8 py-4">Matricule</TableHead>
                    <TableHead>Student Profile</TableHead>
                    <TableHead className="hidden md:table-cell">Class</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right pr-6 md:pr-8">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
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
                            <span className="text-[9px] md:hidden text-muted-foreground uppercase font-bold">{s.class}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-[10px] border-primary/10 text-primary font-bold">{s.class}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase border-none px-3 h-5",
                          s.status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {s.status === 'cleared' ? 'Cleared' : 'Arrears'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6 md:pr-8">
                        <Button 
                          size="sm" 
                          className="rounded-xl h-8 md:h-9 px-3 md:px-6 font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-lg"
                          disabled={!s.isLicensePaid || s.status === 'cleared'}
                          onClick={() => setSelectedStudentForPayment(s)}
                        >
                          <Wallet className="w-3 h-3 md:w-3.5 md:h-3.5 md:mr-2" /> 
                          <span className="hidden sm:inline">Pay Fee</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LEDGER TAB */}
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

        {/* REPORTS TAB */}
        <TabsContent value="reports" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-3xl overflow-hidden">
            <CardHeader className="bg-primary p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <FileSpreadsheet className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black">Export Institutional Lists</CardTitle>
                    <CardDescription className="text-white/60">Generate targeted student dossiers based on academic and financial criteria.</CardDescription>
                  </div>
                </div>
                <Button 
                  className="bg-secondary text-primary hover:bg-secondary/90 h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs gap-2 shadow-lg"
                  onClick={handleDownloadList}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download Institutional List
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-primary" /> Academic Session
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
                    <Building2 className="w-3.5 h-3.5 text-primary" /> Class Filter
                  </Label>
                  <Select value={reportClass} onValueChange={setReportClass}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-primary" /> Fee Category
                  </Label>
                  <Select value={reportFeeType} onValueChange={setReportFeeType}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {FEE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black uppercase text-primary tracking-widest">List Preview</h3>
                  <Badge variant="outline" className="text-[10px] border-primary/10 text-primary font-bold">
                    {reportingList.length} Students Selected
                  </Badge>
                </div>
                <div className="rounded-2xl border border-accent overflow-hidden">
                  <Table>
                    <TableHeader className="bg-accent/10">
                      <TableRow className="uppercase text-[9px] font-black tracking-widest">
                        <TableHead className="pl-6 py-3">Matricule</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead className="text-right pr-6">Payment Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportingList.map((s) => (
                        <TableRow key={s.id} className="text-xs">
                          <TableCell className="pl-6 py-3 font-mono font-bold text-primary">{s.id}</TableCell>
                          <TableCell className="font-bold">{s.name}</TableCell>
                          <TableCell>{s.class}</TableCell>
                          <TableCell className="text-right pr-6">
                            <Badge className={cn(
                              "text-[8px] uppercase h-4 px-2",
                              s.status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {s.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="mt-0 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Global Collection</p>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-blue-700">84.2%</div>
                <p className="text-[10px] text-blue-600/60 font-bold mt-1 uppercase">24.5M Collected of 29.1M</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Fully Cleared</p>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-green-700">842/1284</div>
                <p className="text-[10px] text-green-600/60 font-bold mt-1 uppercase">Registered Students</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Active Arrears</p>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-amber-700">4.6M XAF</div>
                <p className="text-[10px] text-amber-600/60 font-bold mt-1 uppercase">Uncollected Revenue</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* PAYMENT MODAL */}
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
              Finalize & Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RECEIPT DIALOG */}
      <Dialog open={!!issuedReceipt} onOpenChange={() => setIssuedReceipt(null)}>
        <DialogContent className="sm:max-w-xl p-0 border-none shadow-2xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
          <DialogHeader className="bg-primary p-6 md:p-8 text-white no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 md:p-3 bg-white/10 rounded-2xl">
                  <Receipt className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-xl md:text-2xl font-black">Official Receipt</DialogTitle>
                  <DialogDescription className="text-white/60 text-xs">Institutional transaction recorded.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIssuedReceipt(null)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-4 md:p-10 print:p-0 print:bg-white overflow-hidden">
            <div id="printable-receipt" className="bg-white p-6 md:p-8 border-2 border-black/10 shadow-sm relative flex flex-col space-y-6 font-serif text-black print:border-none print:shadow-none min-w-[300px]">
               {/* Receipt Header */}
               <div className="flex justify-between items-start border-b-2 border-black pb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <img src={user?.school?.logo} alt="School" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                    <div className="space-y-0.5">
                      <h2 className="font-black text-[10px] md:text-xs uppercase text-primary leading-tight">{user?.school?.name}</h2>
                      <p className="text-[7px] md:text-[8px] font-bold uppercase opacity-60">Financial Services Registry</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[8px] md:text-[10px] font-black uppercase opacity-40">Receipt No.</p>
                    <p className="text-xs md:text-sm font-mono font-black">{issuedReceipt?.id}</p>
                  </div>
               </div>

               {/* Payer Matrix */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-2 md:py-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Student Identity</p>
                      <p className="font-black text-xs md:text-sm uppercase">{issuedReceipt?.studentName}</p>
                      <p className="text-[8px] md:text-[9px] font-mono font-bold text-primary">{issuedReceipt?.studentId} • {issuedReceipt?.class}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Charge Category</p>
                      <p className="font-black text-xs md:text-sm uppercase">{issuedReceipt?.feeType}</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-left md:text-right">
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Transaction Date</p>
                      <p className="font-bold text-xs md:text-sm">{issuedReceipt?.date}</p>
                    </div>
                    <div className="p-3 bg-primary text-white rounded-xl shadow-inner">
                      <p className="text-[8px] font-black uppercase opacity-60 tracking-widest">Total Amount Received</p>
                      <p className="font-black text-base md:text-lg text-secondary underline underline-offset-4 decoration-double">{issuedReceipt?.amount} XAF</p>
                    </div>
                  </div>
               </div>

               {/* Institutional Footprint */}
               <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                  <div className="flex flex-col items-center gap-2">
                    <QrCode className="w-12 h-12 md:w-16 md:h-16 opacity-10" />
                    <p className="text-[7px] font-black uppercase text-muted-foreground opacity-40">Verified Registry</p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="h-8 w-20 md:h-10 md:w-24 mx-auto bg-primary/5 rounded border-b border-black/20" />
                    <p className="text-[8px] font-black uppercase text-primary">Bursar Signature</p>
                  </div>
               </div>

               <div className="text-center pt-4 border-t border-black/5">
                  <div className="flex items-center justify-center gap-2">
                    <img src={platformSettings.logo} alt="EduIgnite" className="w-3 h-3 object-contain opacity-20" />
                    <p className="text-[6px] md:text-[7px] font-black uppercase text-muted-foreground opacity-30 tracking-[0.3em]">
                      Powered by {platformSettings.name} • Secure Node Record
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-4 md:p-6 border-t no-print flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-11 md:h-12 font-black uppercase tracking-widest text-[10px] md:text-xs" onClick={() => setIssuedReceipt(null)}>
              Dismiss
            </Button>
            <Button className="flex-1 rounded-xl h-11 md:h-12 shadow-lg font-black uppercase tracking-widest text-[10px] md:text-xs gap-2 bg-primary text-white" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
