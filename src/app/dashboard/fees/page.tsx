
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
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  Plus, 
  Search, 
  Receipt, 
  Download, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2,
  Filter,
  CreditCard,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Printer,
  History,
  ShieldCheck,
  QrCode,
  Loader2,
  Settings2,
  Trash2,
  AlertCircle,
  FileDown,
  Calendar,
  ChevronRight,
  BarChart3,
  ArrowRight,
  XCircle,
  Users,
  Lock,
  SearchX,
  FileText,
  UserPlus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Data
const MOCK_CLASSES_FINANCE = [
  { id: "C1", name: "6ème / Form 1", percentage: 82, collected: "4.2M", target: "5.1M", trends: "+5%", status: "medium", bursar: "Mme. Ngono" },
  { id: "C2", name: "5ème / Form 2", percentage: 94, collected: "3.8M", target: "4.0M", trends: "+2%", status: "high", bursar: "Mr. Abena" },
  { id: "C3", name: "4ème / Form 3", percentage: 65, collected: "2.5M", target: "3.8M", trends: "-12%", status: "low", bursar: "Mme. Njoh" },
  { id: "C4", name: "3ème / Form 4", percentage: 88, collected: "4.0M", target: "4.5M", trends: "+3%", status: "high", bursar: "Mr. Tabi" },
  { id: "C5", name: "2nde / Form 5", percentage: 78, collected: "3.2M", target: "4.1M", trends: "Stable", status: "medium", bursar: "Dr. Tesla" },
  { id: "C6", name: "1ère / Lower Sixth", percentage: 92, collected: "3.5M", target: "3.8M", trends: "+1%", status: "high", bursar: "Prof. Smith" },
  { id: "C7", name: "Terminale / Upper Sixth", percentage: 98, collected: "3.0M", target: "3.0M", trends: "Closed", status: "high", bursar: "Mme. Ngono" },
];

const MOCK_STUDENT_LEDGER = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", paid: 125000, left: 25000, status: "partial", isLicensePaid: true, class: "2nde / Form 5" },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", paid: 150000, left: 0, status: "cleared", isLicensePaid: true, class: "Terminale / Upper Sixth" },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", paid: 45000, left: 105000, status: "partial", isLicensePaid: false, class: "1ère / Lower Sixth" },
  { id: "S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", paid: 150000, left: 0, status: "cleared", isLicensePaid: true, class: "2nde / Form 5" },
];

const RECENT_TRANSACTIONS = [
  { id: "PAY-001", student: "Alice Thompson", type: "Tuition Fee", amount: "50,000 XAF", method: "Cash", date: "Today, 10:30 AM" },
  { id: "PAY-002", student: "Bob Richards", type: "Uniform Package", amount: "25,000 XAF", method: "MoMo", date: "Today, 09:15 AM" },
];

export default function BursarFeesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [selectedFeeRegistry, setSelectedFeeRegistry] = useState<any>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<any>(null);
  const [collectSearch, setCollectSearch] = useState("");

  const filteredStudentsForCollect = useMemo(() => {
    if (!collectSearch) return [];
    return MOCK_STUDENT_LEDGER.filter(s => 
      s.name.toLowerCase().includes(collectSearch.toLowerCase()) || 
      s.id.toLowerCase().includes(collectSearch.toLowerCase())
    );
  }, [collectSearch]);

  const isBursar = user?.role === "BURSAR";
  const isAdmin = user?.role === "SCHOOL_ADMIN";

  const handleDownloadReport = (scope: string) => {
    toast({
      title: "Report Generated",
      description: `${scope} financial report is ready for download.`,
    });
  };

  const handleCollectPayment = () => {
    if (!selectedStudentForPayment) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please select a student to record payment." });
      return;
    }

    if (!selectedStudentForPayment.isLicensePaid) {
      toast({ 
        variant: "destructive", 
        title: "Platform Access Suspended", 
        description: "Payments cannot be recorded for students with unpaid annual EduIgnite licenses. Redirect student to payment portal." 
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Transaction Verified", description: "Receipt has been generated and archived." });
      setSelectedStudentForPayment(null);
      setCollectSearch("");
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-xl border-2 border-white">
            <Coins className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter">Bursar Suite</h1>
            <p className="text-muted-foreground mt-1">Manage institutional collections, debt auditing, and registration revenue.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-white rounded-xl h-11 border-primary/10 font-bold" asChild>
            <Link href="/dashboard/students">
              <UserPlus className="w-4 h-4" /> New Admission
            </Link>
          </Button>
          <Button variant="secondary" className="gap-2 rounded-xl h-11 shadow-sm font-bold bg-secondary text-primary hover:bg-secondary/90" onClick={() => handleDownloadReport("School Master Ledger")}>
            <Download className="w-4 h-4" /> Export Ledger
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="overview" className="gap-2 py-3 rounded-xl transition-all">
            <TrendingUp className="w-4 h-4" /> Revenue Flow
          </TabsTrigger>
          <TabsTrigger value="ledger" className="gap-2 py-3 rounded-xl transition-all">
            <History className="w-4 h-4" /> Transaction Log
          </TabsTrigger>
          <TabsTrigger value="collect" className="gap-2 py-3 rounded-xl transition-all">
            <Wallet className="w-4 h-4" /> Record Payment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Global Collection</p>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-blue-700">84.2%</div>
                <p className="text-[10px] text-blue-600/60 font-bold mt-1 uppercase leading-none">24.5M Collected of 29.1M</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Fully Cleared</p>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-3xl font-black text-green-700">842/1284</div>
                <p className="text-[10px] text-green-600/60 font-bold mt-1 uppercase leading-none">Registered Students</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Active Arrears</p>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-amber-700">4.6M XAF</div>
                <p className="text-[10px] text-amber-600/60 font-bold mt-1 uppercase leading-none">Uncollected Revenue</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_CLASSES_FINANCE.map((cls) => (
              <Card key={cls.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className={cn(
                  "h-1.5 w-full",
                  cls.status === 'high' ? "bg-green-500" : cls.status === 'medium' ? "bg-blue-500" : "bg-red-500"
                )} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-black text-primary">{cls.name}</CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" /> Managed: {cls.bursar}
                      </CardDescription>
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl flex flex-col items-center justify-center min-w-[70px] border-2",
                      cls.status === 'high' ? "bg-green-50 border-green-100 text-green-700" : 
                      cls.status === 'medium' ? "bg-blue-50 border-blue-100 text-blue-700" : 
                      "bg-red-50 border-red-100 text-red-700"
                    )}>
                      <span className="text-xl font-black">{cls.percentage}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                      <span>Total Collected</span>
                      <span>{cls.collected} / {cls.target}</span>
                    </div>
                    <Progress value={cls.percentage} className={cn(
                      "h-2",
                      cls.status === 'high' ? "[&>div]:bg-green-500" : cls.status === 'medium' ? "[&>div]:bg-blue-500" : "[&>div]:bg-red-500"
                    )} />
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/10 border-t p-4 flex gap-2">
                  <Button 
                    variant="ghost" 
                    className="flex-1 justify-between hover:bg-white text-primary font-bold text-xs"
                    onClick={() => setSelectedClassDetails(cls)}
                  >
                    Auditing Dossier
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ledger" className="mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b flex items-center justify-between p-6">
              <div>
                <CardTitle className="font-black uppercase tracking-tight text-primary">Global Transaction Log</CardTitle>
                <CardDescription>Verified chronological record of physical and MOMO deposits.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => handleDownloadReport("Transaction Log")}>
                <FileDown className="w-4 h-4" /> Download Statement
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30 uppercase text-[10px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Ref Code</TableHead>
                    <TableHead>Student Identity</TableHead>
                    <TableHead>Charge Category</TableHead>
                    <TableHead className="text-center">Method</TableHead>
                    <TableHead className="text-center">Intake (XAF)</TableHead>
                    <TableHead className="text-right pr-8">Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_TRANSACTIONS.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-accent/5">
                      <TableCell className="pl-8 py-4 font-mono font-bold text-primary">{tx.id}</TableCell>
                      <TableCell className="font-bold text-sm text-primary">{tx.student}</TableCell>
                      <TableCell className="text-xs font-medium">{tx.type}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[9px] font-black uppercase bg-white border-primary/10">{tx.method}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-black text-primary">{tx.amount}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-1.5 text-green-600 font-bold text-[9px] uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SECURE
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collect" className="mt-0">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Search & Select Section */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="bg-primary text-white p-8">
                  <CardTitle className="text-xl font-black">Identify Student</CardTitle>
                  <CardDescription className="text-white/60">Search the institutional registry.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Name or Matricule..." 
                      className="h-14 bg-accent/30 border-none rounded-2xl pl-12 font-bold"
                      value={collectSearch}
                      onChange={(e) => setCollectSearch(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 min-h-[300px]">
                    {filteredStudentsForCollect.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStudentForPayment(s)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left",
                          selectedStudentForPayment?.id === s.id 
                            ? "border-primary bg-primary/5 shadow-inner" 
                            : "border-transparent bg-accent/30 hover:border-primary/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={s.avatar} />
                            <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-black text-sm text-primary leading-none mb-1">{s.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-white text-primary border-none text-[8px] h-4 font-bold">{s.id}</Badge>
                              {!s.isLicensePaid && (
                                <Badge variant="destructive" className="text-[8px] h-4 px-1.5 font-black uppercase">
                                  <Lock className="w-2.5 h-2.5 mr-1" /> UNPAID
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedStudentForPayment?.id === s.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                    {collectSearch && filteredStudentsForCollect.length === 0 && (
                      <div className="py-20 text-center opacity-40">
                        <SearchX className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-sm font-bold">No student found.</p>
                      </div>
                    )}
                    {!collectSearch && (
                      <div className="py-20 text-center opacity-20">
                        <User className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">Awaiting Identity Input</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collection Details Section */}
            <div className="lg:col-span-7">
              {selectedStudentForPayment ? (
                <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
                  <CardHeader className="bg-accent/50 border-b p-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl font-black text-primary">Collection Form</CardTitle>
                        <p className="text-sm font-bold text-muted-foreground uppercase">{selectedStudentForPayment.name}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedStudentForPayment(null)} className="rounded-full">
                        <XCircle className="w-6 h-6 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {!selectedStudentForPayment.isLicensePaid && (
                      <div className="p-6 bg-red-50 rounded-[2rem] border-2 border-red-100 flex gap-4">
                        <div className="p-3 bg-red-100 rounded-2xl h-fit">
                          <Lock className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-red-900 uppercase text-xs tracking-widest">Entry Suspended</h4>
                          <p className="text-sm text-red-800 leading-relaxed font-medium">
                            This student has an outstanding **Platform License Fee**. Educational records and school fee entries are locked until the platform license is cleared.
                          </p>
                          <Button variant="link" className="text-red-700 p-0 h-auto font-black uppercase text-[10px] underline underline-offset-4">
                            Direct student to subscription page
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className={cn("space-y-6 transition-opacity", !selectedStudentForPayment.isLicensePaid && "opacity-30 pointer-events-none")}>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Reason</Label>
                          <Select defaultValue="tuition">
                            <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tuition">Tuition (School Fees)</SelectItem>
                              <SelectItem value="uniform">Uniform & Gear</SelectItem>
                              <SelectItem value="pta">PTA Contribution</SelectItem>
                              <SelectItem value="exams">Sequence Exams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount (XAF)</Label>
                          <div className="relative">
                            <Input type="number" placeholder="0" className="h-12 bg-accent/30 border-none rounded-xl font-black text-lg text-primary pl-6" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[10px] opacity-40 uppercase">XAF</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Mode</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Cash', 'MoMo', 'Check'].map(m => (
                            <Button key={m} variant="outline" className="h-12 rounded-xl font-bold hover:bg-primary hover:text-white border-primary/10 transition-all">
                              {m}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold opacity-60">Current Arrears</span>
                          <span className="font-black text-red-600">{selectedStudentForPayment.left.toLocaleString()} XAF</span>
                        </div>
                        <div className="h-px bg-primary/10" />
                        <div className="flex justify-between items-center">
                          <span className="font-black uppercase text-xs tracking-widest">Remaining Balance</span>
                          <div className="p-2 bg-white rounded-xl shadow-sm border border-primary/10 font-black text-primary">
                            PENDING CALC
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-accent/20 p-8 border-t border-accent">
                    <Button 
                      className="w-full h-16 rounded-[1.5rem] shadow-xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white transition-all active:scale-95" 
                      onClick={handleCollectPayment}
                      disabled={isProcessing || !selectedStudentForPayment.isLicensePaid}
                    >
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Receipt className="w-6 h-6" />}
                      Verify & Issue Official Receipt
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 bg-accent/10 border-2 border-dashed border-accent rounded-[3rem] opacity-60">
                  <div className="p-6 bg-white rounded-[2rem] shadow-inner">
                    <Wallet className="w-16 h-16 text-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">Collection Inactive</h3>
                    <p className="text-sm text-muted-foreground max-w-[300px] font-medium leading-relaxed">
                      Select a student from the institutional registry to begin recording a transaction.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Class Auditing Dialog */}
      <Dialog open={!!selectedClassDetails} onOpenChange={() => setSelectedClassDetails(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className={cn(
            "p-8 text-white",
            selectedClassDetails?.status === 'high' ? "bg-green-600" : selectedClassDetails?.status === 'medium' ? "bg-blue-600" : "bg-red-600"
          )}>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-3xl font-black">{selectedClassDetails?.name} - Arrears Audit</DialogTitle>
                <DialogDescription className="text-white/70 font-bold">Comprehensive Class Financial Dossier</DialogDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Revenue Target</p>
                  <p className="text-3xl font-black">{selectedClassDetails?.collected} / {selectedClassDetails?.target}</p>
                </div>
                <Button className="h-full bg-white/20 hover:bg-white/30 text-white border-none rounded-2xl p-4 shadow-xl backdrop-blur-md">
                  <Download className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-8 space-y-10">
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4" /> Class Member Ledger
                </h3>
                <Badge variant="outline" className="text-[10px] font-black uppercase">Term Sequence 2</Badge>
              </div>
              <Table>
                <TableHeader className="bg-accent/30 font-black uppercase text-[10px]">
                  <TableRow>
                    <TableHead className="pl-0">Student Profile</TableHead>
                    <TableHead className="text-center">Matricule</TableHead>
                    <TableHead className="text-center text-green-600">Paid (XAF)</TableHead>
                    <TableHead className="text-center text-red-600">Balance (XAF)</TableHead>
                    <TableHead className="text-right pr-0">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_STUDENT_LEDGER.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="pl-0 font-bold text-sm text-primary">{s.name}</TableCell>
                      <TableCell className="text-center font-mono text-xs font-bold text-muted-foreground">{s.id}</TableCell>
                      <TableCell className="text-center font-black text-green-600">{s.paid.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-black text-red-600">{s.left.toLocaleString()}</TableCell>
                      <TableCell className="text-right pr-0">
                        <Badge className={cn(
                          "text-[8px] font-black uppercase border-none h-5",
                          s.status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {s.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4 h-fit">
                <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-secondary" /> Audit Integrity
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                  "This class is currently at {selectedClassDetails?.percentage}% collection efficiency. All recorded payments are digitally signed and immutable. Outstanding arrears are flagged for sequence evaluation locking."
                </p>
              </div>
              <div className="space-y-3">
                <Button className="w-full justify-between h-12 rounded-xl text-xs font-black uppercase tracking-widest border-primary/10" variant="outline" onClick={() => handleDownloadReport(`Arrears List - ${selectedClassDetails?.name}`)}>
                  Download Arrears List <FileDown className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-white shadow-lg" onClick={() => handleDownloadReport(`Official Invoices - ${selectedClassDetails?.name}`)}>
                  Generate Bulk Invoices <Receipt className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-accent/10 border-t flex justify-end">
            <Button variant="ghost" onClick={() => setSelectedClassDetails(null)} className="font-black uppercase tracking-widest text-[10px]">Close Financial Dossier</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
