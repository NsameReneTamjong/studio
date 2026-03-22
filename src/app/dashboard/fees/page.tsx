"use client";

import { useState } from "react";
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
  Lock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock Data for Institutional Finance Overview
const MOCK_CLASSES_FINANCE = [
  { id: "C1", name: "6ème / Form 1", percentage: 82, collected: "4.2M", target: "5.1M", trends: "+5%", status: "medium", bursar: "Mme. Ngono" },
  { id: "C2", name: "5ème / Form 2", percentage: 94, collected: "3.8M", target: "4.0M", trends: "+2%", status: "high", bursar: "Mr. Abena" },
  { id: "C3", name: "4ème / Form 3", percentage: 65, collected: "2.5M", target: "3.8M", trends: "-12%", status: "low", bursar: "Mme. Njoh" },
  { id: "C4", name: "3ème / Form 4", percentage: 88, collected: "4.0M", target: "4.5M", trends: "+3%", status: "high", bursar: "Mr. Tabi" },
  { id: "C5", name: "2nde / Form 5", percentage: 78, collected: "3.2M", target: "4.1M", trends: "Stable", status: "medium", bursar: "Dr. Tesla" },
  { id: "C6", name: "1ère / Lower Sixth", percentage: 92, collected: "3.5M", target: "3.8M", trends: "+1%", status: "high", bursar: "Prof. Smith" },
  { id: "C7", name: "Terminale / Upper Sixth", percentage: 98, collected: "3.0M", target: "3.0M", trends: "Closed", status: "high", bursar: "Mme. Ngono" },
];

const MOCK_FEE_CATEGORY_PERFORMANCE = [
  { id: "FT1", name: "Tuition Fee", percentage: 85, collected: "2.5M", target: "3.0M", description: "Main academic enrollment fees." },
  { id: "FT2", name: "Uniform Package", percentage: 70, collected: "450k", target: "650k", description: "Mandatory school gear." },
  { id: "FT3", name: "Exam Registration", percentage: 100, collected: "300k", target: "300k", description: "Sequence evaluation fees." },
  { id: "FT4", name: "PTA Contribution", percentage: 95, collected: "150k", target: "160k", description: "Parents association fund." },
];

const MOCK_STUDENT_LEDGER = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", paid: 125000, left: 25000, status: "partial", isLicensePaid: true },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", paid: 150000, left: 0, status: "cleared", isLicensePaid: true },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", paid: 45000, left: 105000, status: "partial", isLicensePaid: false },
  { id: "S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", paid: 150000, left: 0, status: "cleared", isLicensePaid: true },
  { id: "S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100", paid: 75000, left: 75000, status: "partial", isLicensePaid: false },
];

const RECENT_TRANSACTIONS = [
  { id: "PAY-001", student: "Alice Thompson", type: "Tuition Fee", amount: "50,000 XAF", method: "Cash", date: "Today, 10:30 AM" },
  { id: "PAY-002", student: "Bob Richards", type: "Uniform Package", amount: "25,000 XAF", method: "MoMo", date: "Today, 09:15 AM" },
];

export default function BursarFeesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  // Drill-down States
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [selectedFeeRegistry, setSelectedFeeRegistry] = useState<any>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<any>(null);

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
        title: "Account Suspended", 
        description: "Institutional fees cannot be recorded for students with unpaid annual platform licenses." 
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Payment Recorded", description: "Successfully processed for student." });
      setSelectedStudentForPayment(null);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Coins className="w-6 h-6 text-secondary" />
            </div>
            {isAdmin ? "Financial Supervision" : "Financial Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Supervisory overview of institutional revenue and collection health." 
              : "Manage student collections and institutional fee structures."}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-white rounded-xl h-11 border-primary/10">
            <Calendar className="w-4 h-4 text-primary" /> Current Term: Sequence 2
          </Button>
          <Button variant="secondary" className="gap-2 rounded-xl h-11 shadow-sm" onClick={() => handleDownloadReport("School-wide Ledger")}>
            <Download className="w-4 h-4" /> Export Master Ledger
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="overview" className="gap-2 py-3 rounded-xl transition-all">
            <TrendingUp className="w-4 h-4" /> Revenue Overview
          </TabsTrigger>
          <TabsTrigger value="ledger" className="gap-2 py-3 rounded-xl transition-all">
            <History className="w-4 h-4" /> Transactions
          </TabsTrigger>
          {isBursar && (
            <TabsTrigger value="collect" className="gap-2 py-3 rounded-xl transition-all">
              <Wallet className="w-4 h-4" /> Collect Fee
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Aggregate Intake</p>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-blue-700">84.2%</div>
                <p className="text-[10px] text-blue-600/60 font-bold mt-1 uppercase">24.5M Collected of 29.1M</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Cleared Students</p>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-3xl font-black text-green-700">842/1284</div>
                <p className="text-[10px] text-green-600/60 font-bold mt-1 uppercase">Paid in full</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Outstanding Debt</p>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-amber-700">4.6M XAF</div>
                <p className="text-[10px] text-amber-600/60 font-bold mt-1 uppercase">Requires intervention</p>
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
                        <User className="w-3 h-3" /> Managed by: {cls.bursar}
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
                      <span>Collected Revenue</span>
                      <span>{cls.collected} / {cls.target}</span>
                    </div>
                    <Progress value={cls.percentage} className={cn(
                      "h-2",
                      cls.status === 'high' ? "[&>div]:bg-green-500" : cls.status === 'medium' ? "[&>div]:bg-blue-500" : "[&>div]:bg-red-500"
                    )} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl border border-accent">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Intake Trend</p>
                      <div className="flex items-center gap-1.5">
                        {cls.trends.startsWith('+') ? <TrendingUp className="w-3.5 h-3.5 text-green-600" /> : cls.trends === 'Closed' ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <TrendingDown className="w-3.5 h-3.5 text-red-600" />}
                        <span className={cn("text-sm font-black", cls.trends.startsWith('+') ? "text-green-600" : cls.trends === 'Closed' ? "text-primary" : "text-red-600")}>{cls.trends}</span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-accent mx-2" />
                    <div className="space-y-0.5 text-right">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Action</p>
                      <p className="text-xs font-bold uppercase">{cls.status === 'high' ? 'Stable' : cls.status === 'medium' ? 'Follow-up' : 'Urgent'}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/10 border-t p-4 pt-4 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="shrink-0 hover:bg-white text-primary"
                    onClick={() => handleDownloadReport(`${cls.name} Financial Dossier`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex-1 justify-between hover:bg-white text-primary font-bold text-xs"
                    onClick={() => setSelectedClassDetails(cls)}
                  >
                    View Class Records
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ledger" className="mt-0">
          <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Live log of physical and digital fee collections.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleDownloadReport("Recent Transactions Log")}>
                <FileDown className="w-4 h-4" /> Download Log
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30 uppercase text-[10px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Transaction ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Method</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-right pr-8">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_TRANSACTIONS.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="pl-8 py-4 font-mono font-bold text-primary">{tx.id}</TableCell>
                      <TableCell className="font-bold text-sm">{tx.student}</TableCell>
                      <TableCell className="text-xs">{tx.type}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[9px] font-black uppercase">{tx.method}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-black text-primary">{tx.amount}</TableCell>
                      <TableCell className="text-right pr-8 text-[10px] text-muted-foreground">{tx.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isBursar && (
          <TabsContent value="collect" className="mt-0">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden max-w-2xl mx-auto">
              <CardHeader className="bg-primary text-white p-8">
                <CardTitle>Physical Fee Collection</CardTitle>
                <CardDescription className="text-white/60">Bursar mode: Record cash or bank deposits directly into the system.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Label>Student Profile</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {MOCK_STUDENT_LEDGER.slice(0, 3).map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedStudentForPayment(s)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left group",
                          selectedStudentForPayment?.id === s.id 
                            ? "border-primary bg-primary/5" 
                            : "border-transparent bg-accent/30 hover:border-primary/20"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarImage src={s.avatar} />
                            <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm">{s.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge className="bg-white text-primary border-none text-[8px]">{s.id}</Badge>
                              {!s.isLicensePaid && (
                                <Badge variant="destructive" className="text-[8px] h-4 gap-1 px-1.5">
                                  <Lock className="w-2.5 h-2.5" /> License Unpaid
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedStudentForPayment?.id === s.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fee Category</Label>
                    <Select>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Select Fee" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tuition">Tuition Fee</SelectItem>
                        <SelectItem value="uniform">Uniform Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (XAF)</Label>
                    <Input type="number" placeholder="50,000" className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
                  </div>
                </div>

                {selectedStudentForPayment && !selectedStudentForPayment.isLicensePaid && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800 leading-relaxed font-medium">
                      This student has not paid their annual EduIgnite platform license. Financial records are suspended until the license is cleared.
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full h-12 rounded-xl shadow-lg font-bold" 
                  onClick={handleCollectPayment} 
                  disabled={isProcessing || (selectedStudentForPayment && !selectedStudentForPayment.isLicensePaid)}
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Record & Issue Receipt"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Class Financial Details Dialog (Drill-down 1) */}
      <Dialog open={!!selectedClassDetails} onOpenChange={() => setSelectedClassDetails(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className={cn(
            "p-8 text-white",
            selectedClassDetails?.status === 'high' ? "bg-green-600" : selectedClassDetails?.status === 'medium' ? "bg-blue-600" : "bg-red-600"
          )}>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-3xl font-black">{selectedClassDetails?.name} - Financial Dossier</DialogTitle>
                <DialogDescription className="text-white/70 font-bold flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4" /> Account Manager: {selectedClassDetails?.bursar}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Class Coverage</p>
                  <p className="text-3xl font-black">{selectedClassDetails?.percentage}%</p>
                </div>
                <Button 
                  className="h-full bg-white/20 hover:bg-white/30 text-white border-none rounded-2xl p-4 shadow-xl backdrop-blur-md" 
                  onClick={() => handleDownloadReport(`Financial Statement - ${selectedClassDetails?.name}`)}
                >
                  <Download className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-8 space-y-10">
            {/* Breakdown by Fee Category */}
            <section className="space-y-6">
              <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b pb-2">
                <BarChart3 className="w-4 h-4" /> Category Collection Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_FEE_CATEGORY_PERFORMANCE.map((fee) => (
                  <Card key={fee.id} className="border-none shadow-sm bg-accent/30 hover:bg-accent/50 transition-colors group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-primary">{fee.name}</span>
                          <Badge variant="outline" className="text-[9px] h-4 border-primary/20">{fee.collected} / {fee.target}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">{fee.description}</p>
                        <div className="w-3/4 mt-2">
                          <Progress value={fee.percentage} className="h-1 bg-white" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className={cn(
                          "px-3 py-1.5 rounded-xl font-black text-sm",
                          fee.percentage >= 90 ? "bg-green-100 text-green-700" : 
                          fee.percentage >= 70 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {fee.percentage}%
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] uppercase font-black gap-1 h-7 text-primary hover:bg-white"
                          onClick={() => setSelectedFeeRegistry({ ...fee, className: selectedClassDetails?.name })}
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest border-b pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Institutional Health
                </h3>
                <div className="bg-primary/5 p-6 rounded-2xl space-y-4 border border-primary/10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary rounded-lg text-white">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-relaxed text-primary">
                        "Financial compliance for this class is {selectedClassDetails?.status === 'high' ? 'above' : selectedClassDetails?.status === 'medium' ? 'meeting' : 'below'} benchmarks."
                      </p>
                      <p className="text-[9px] text-muted-foreground mt-1">Last Reconciliation: Today, 08:45 AM</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Audit Status</span>
                    <Badge className="bg-primary text-white border-none text-[9px] font-black">VALIDATED</Badge>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest border-b pb-2 flex items-center gap-2">
                  <Printer className="w-4 h-4" /> Operational Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    className="w-full gap-3 h-12 rounded-xl text-xs font-black uppercase tracking-widest" 
                    variant="outline"
                    onClick={() => handleDownloadReport(`Full Payment Logs - ${selectedClassDetails?.name}`)}
                  >
                    <History className="w-4 h-4 text-primary" /> Download Full Payment Logs
                  </Button>
                  <Button 
                    className="w-full gap-3 h-12 rounded-xl shadow-lg bg-primary text-xs font-black uppercase tracking-widest text-white"
                    onClick={() => handleDownloadReport(`Arrears List - ${selectedClassDetails?.name}`)}
                  >
                    <FileDown className="w-4 h-4 text-secondary" /> Download Arrears List
                  </Button>
                </div>
              </section>
            </div>
          </div>
          
          <div className="p-6 bg-accent/10 border-t flex justify-end">
            <Button variant="ghost" onClick={() => setSelectedClassDetails(null)} className="font-black uppercase tracking-widest text-[10px]">Close Dossier</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Granular Student Fee Registry Dialog (Drill-down 2) */}
      <Dialog open={!!selectedFeeRegistry} onOpenChange={() => setSelectedFeeRegistry(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-3xl border-none shadow-2xl">
          <DialogHeader className="p-8 bg-primary text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                  <Coins className="w-8 h-8" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black">
                    {selectedFeeRegistry?.name} - Granular Registry
                  </DialogTitle>
                  <DialogDescription className="text-white/60 font-medium">
                    {selectedFeeRegistry?.className} • Detailed student-by-student ledger
                  </DialogDescription>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="h-12 w-12 rounded-2xl shadow-xl"
                onClick={() => handleDownloadReport(`${selectedFeeRegistry?.name} Ledger - ${selectedFeeRegistry?.className}`)}
              >
                <FileDown className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <Table>
              <TableHeader className="bg-accent/30 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Student Profile</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Matricule</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest text-green-600">Paid (XAF)</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest text-red-600">Balance (XAF)</TableHead>
                  <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-y-auto">
                {MOCK_STUDENT_LEDGER.map((student) => (
                  <TableRow key={student.id} className="hover:bg-accent/5">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-bold text-sm text-primary">{student.name}</span>
                          {!student.isLicensePaid && (
                            <p className="text-[8px] text-red-600 font-black uppercase flex items-center gap-1 mt-0.5">
                              <Lock className="w-2 h-2" /> License Unpaid
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs font-bold text-muted-foreground">{student.id}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-black text-green-600 text-sm">{student.paid.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "font-black text-sm",
                        student.left > 0 ? "text-red-600" : "text-primary opacity-30"
                      )}>{student.left.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[9px] font-black uppercase gap-1"
                        onClick={() => handleDownloadReport(`Statement: ${student.name}`)}
                        disabled={!student.isLicensePaid}
                      >
                        <Download className="w-3 h-3" /> Statement
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter className="p-6 bg-accent/10 border-t flex justify-between items-center shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest italic flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Automated institutional financial tracking active.
            </p>
            <Button variant="outline" className="rounded-xl h-10 px-8" onClick={() => setSelectedFeeRegistry(null)}>
              Close Registry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
