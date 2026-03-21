
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
import { Textarea } from "@/components/ui/textarea";
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
  Printer,
  History,
  ShieldCheck,
  QrCode,
  Loader2,
  Settings2,
  Trash2,
  AlertCircle,
  FileDown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Initial Mock Data
const INITIAL_FEE_TYPES = [
  { id: "FT1", name: "Tuition Fee", amount: 150000, description: "Main academic fees for current term." },
  { id: "FT2", name: "Uniform Package", amount: 25000, description: "Mandatory school uniform and gym kit." },
  { id: "FT3", name: "Exam Registration", amount: 10000, description: "Sequence evaluation processing fee." },
  { id: "FT4", name: "PTA Contribution", amount: 5000, description: "Parent-Teacher Association fund." },
];

const RECENT_PAYMENTS = [
  { id: "PAY-001", student: "Alice Thompson", matricule: "S001", type: "Tuition Fee", amount: "50,000 XAF", method: "Cash", date: "Today, 10:30 AM", status: "Confirmed" },
  { id: "PAY-002", student: "Bob Richards", matricule: "S002", type: "Uniform Package", amount: "25,000 XAF", method: "Mobile Money", date: "Today, 09:15 AM", status: "Confirmed" },
  { id: "PAY-003", student: "Charlie Davis", matricule: "S003", type: "PTA Contribution", amount: "5,000 XAF", method: "Cash", date: "Yesterday", status: "Confirmed" },
];

const MOCK_STUDENTS_LIST = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", balance: 100000, status: "partial" },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", balance: 0, status: "cleared" },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", balance: 45000, status: "owing" },
];

export default function BursarFeesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("collect");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feeTypes, setFeeTypes] = useState(INITIAL_FEE_TYPES);
  
  // Payment Collection State
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedFeeType, setSelectedFeeType] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [previewReceipt, setPreviewReceipt] = useState<any>(null);

  // Fee Type Management State
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);
  const [feeFormData, setFeeFormData] = useState({ name: "", amount: "", description: "" });

  const handleCollectPayment = () => {
    if (!selectedStudent || !selectedFeeType || !paymentAmount) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const receiptData = {
        id: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: selectedStudent.name,
        matricule: selectedStudent.id,
        feeType: selectedFeeType.name,
        amount: `${parseInt(paymentAmount).toLocaleString()} XAF`,
        date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        method: "Cash",
        collector: user?.name,
        schoolName: user?.school?.name || "EduNexus Institution",
        verificationCode: Math.random().toString(36).substr(2, 12).toUpperCase()
      };
      
      setPreviewReceipt(receiptData);
      setIsProcessing(false);
      
      toast({
        title: language === 'en' ? "Payment Recorded" : "Paiement Enregistré",
        description: `Successfully processed ${receiptData.amount} for ${receiptData.studentName}.`,
      });
      
      setSelectedStudent(null);
      setSelectedFeeType(null);
      setPaymentAmount("");
    }, 1500);
  };

  const openFeeModal = (fee?: any) => {
    if (fee) {
      setEditingFee(fee);
      setFeeFormData({ name: fee.name, amount: fee.amount.toString(), description: fee.description });
    } else {
      setEditingFee(null);
      setFeeFormData({ name: "", amount: "", description: "" });
    }
    setIsFeeModalOpen(true);
  };

  const handleSaveFee = () => {
    if (!feeFormData.name || !feeFormData.amount) {
      toast({ variant: "destructive", title: "Missing Data", description: "Please fill in the fee name and amount." });
      return;
    }

    if (editingFee) {
      setFeeTypes(prev => prev.map(f => f.id === editingFee.id ? { ...f, ...feeFormData, amount: parseInt(feeFormData.amount) } : f));
      toast({ title: "Structure Updated", description: `${feeFormData.name} has been modified.` });
    } else {
      const newFee = {
        id: `FT${feeTypes.length + 1}`,
        name: feeFormData.name,
        amount: parseInt(feeFormData.amount),
        description: feeFormData.description
      };
      setFeeTypes(prev => [...prev, newFee]);
      toast({ title: "New Fee Added", description: `${feeFormData.name} is now available for collection.` });
    }
    setIsFeeModalOpen(false);
  };

  const handleDeleteFee = (id: string) => {
    setFeeTypes(prev => prev.filter(f => f.id !== id));
    toast({
      variant: "destructive",
      title: language === 'en' ? "Fee Type Deleted" : "Type de Frais Supprimé",
      description: "The fee structure has been removed from the registry."
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Coins className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? "Financial Management" : "Gestion Financière"}
          </h1>
          <p className="text-muted-foreground mt-1">Collect fees, manage structures, and generate institutional receipts.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-accent flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground leading-none">Today's Revenue</p>
                <p className="text-lg font-black text-primary leading-tight">125,000 XAF</p>
              </div>
           </div>
        </div>
      </div>

      <Tabs defaultValue="collect" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="collect" className="gap-2 py-3 rounded-xl transition-all">
            <Wallet className="w-4 h-4" /> {language === 'en' ? 'Collect Fee' : 'Encaisser'}
          </TabsTrigger>
          <TabsTrigger value="ledger" className="gap-2 py-3 rounded-xl transition-all">
            <History className="w-4 h-4" /> {language === 'en' ? 'Payment Ledger' : 'Grand Livre'}
          </TabsTrigger>
          <TabsTrigger value="structure" className="gap-2 py-3 rounded-xl transition-all">
            <ShieldCheck className="w-4 h-4" /> {language === 'en' ? 'Fee Types' : 'Types de Frais'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collect" className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7 border-none shadow-xl bg-white overflow-hidden rounded-3xl">
              <CardHeader className="bg-primary text-white p-8">
                <CardTitle className="text-2xl font-black tracking-tight">Process Student Fee</CardTitle>
                <CardDescription className="text-white/60">Enter the payment details manually from the student's presentation.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Enrolled Student</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MOCK_STUDENTS_LIST.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudent(student)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left group",
                            selectedStudent?.id === student.id ? "border-primary bg-primary/5 shadow-sm" : "border-accent hover:border-primary/20 bg-accent/5"
                          )}
                        >
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                          </Avatar>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-primary truncate leading-tight">{student.name}</p>
                            <p className="text-[10px] font-mono text-muted-foreground uppercase">{student.id} • {student.balance.toLocaleString()} XAF Left</p>
                          </div>
                          {student.status === 'cleared' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          ) : (
                            selectedStudent?.id === student.id && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fee Type</Label>
                      <Select onValueChange={(val) => setSelectedFeeType(feeTypes.find(f => f.id === val))}>
                        <SelectTrigger className="h-12 rounded-xl bg-accent/30 border-none">
                          <SelectValue placeholder="Select cost center" />
                        </SelectTrigger>
                        <SelectContent>
                          {feeTypes.map(f => (
                            <SelectItem key={f.id} value={f.id}>{f.name} ({f.amount.toLocaleString()} XAF)</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payment Method</Label>
                      <Select defaultValue="cash">
                        <SelectTrigger className="h-12 rounded-xl bg-accent/30 border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash (Office)</SelectItem>
                          <SelectItem value="momo">Mobile Money</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount Received (XAF)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="e.g. 50000" 
                        className="h-14 rounded-xl bg-accent/30 border-none pl-12 text-xl font-black text-primary"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                      <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-40" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-accent/10 p-8 border-t border-accent flex sm:flex-row gap-4">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-12 rounded-xl" 
                  onClick={() => { setSelectedStudent(null); setSelectedFeeType(null); setPaymentAmount(""); }}
                >
                  Clear Form
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-xl shadow-xl font-black uppercase tracking-widest gap-2"
                  disabled={isProcessing || !selectedStudent || !selectedFeeType || !paymentAmount}
                  onClick={handleCollectPayment}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm Payment
                </Button>
              </CardFooter>
            </Card>

            <div className="lg:col-span-5 space-y-6">
              <Card className="border-none shadow-lg bg-secondary text-primary overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Collection Target
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="uppercase tracking-widest opacity-70">Tuition Recovery</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2 bg-white/20" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black opacity-60">Today's Intake</p>
                      <p className="text-xl font-black">125,000 XAF</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black opacity-60">Pending (Term)</p>
                      <p className="text-xl font-black text-red-600">1.8M XAF</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 bg-primary/5 rounded-3xl border-2 border-dashed border-accent flex flex-col items-center text-center gap-4">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Receipt className="w-8 h-8 text-primary opacity-20" />
                 </div>
                 <div>
                    <h4 className="font-bold text-primary">Secure Receipt Generation</h4>
                    <p className="text-xs text-muted-foreground max-w-[200px]">Confirm a payment to generate a unique, cryptographically signed receipt for the student.</p>
                 </div>
              </div>
              
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500" /> Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Alice Thompson", amt: "50,000", time: "10:30 AM" },
                    { name: "Bob Richards", amt: "25,000", time: "09:15 AM" },
                  ].map((act, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-accent/20">
                      <span className="font-medium">{act.name}</span>
                      <div className="text-right">
                        <p className="font-bold text-primary">{act.amt} XAF</p>
                        <p className="text-[9px] opacity-60">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ledger" className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Institutional Financial Ledger</CardTitle>
                <CardDescription>Real-time audit log of all financial transactions.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="Search records..." className="pl-8 h-9 text-xs w-[200px] bg-accent/10 border-none" />
                </div>
                <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-4 h-4" /> Filter</Button>
                <Button variant="outline" size="sm" className="gap-2 h-9"><FileDown className="w-4 h-4" /> Export CSV</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-6 py-4">Transaction ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead className="text-center">Method</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-right pr-6">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_PAYMENTS.map((pay) => (
                    <TableRow key={pay.id} className="hover:bg-accent/5 group">
                      <TableCell className="pl-6 py-4 font-mono text-[10px] font-bold text-primary">{pay.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-primary">{pay.student}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{pay.matricule}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{pay.type}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[9px] border-accent bg-accent/10">{pay.method}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-black text-primary">{pay.amount}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold">{pay.date}</span>
                          <Button variant="ghost" size="sm" className="h-6 text-[9px] gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Printer className="w-3 h-3" /> Re-print Receipt
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="border-2 border-dashed border-accent bg-accent/5 hover:bg-accent/10 transition-colors flex flex-col items-center justify-center p-8 text-center cursor-pointer group h-full"
              onClick={() => openFeeModal()}
            >
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-4">
                  <Plus className="w-6 h-6 text-primary" />
               </div>
               <h4 className="font-bold text-primary">Add New Fee Type</h4>
               <p className="text-xs text-muted-foreground mt-1">Define a new cost center for the institution.</p>
            </Card>
            
            {feeTypes.map((type) => (
              <Card key={type.id} className="border-none shadow-sm relative overflow-hidden group flex flex-col bg-white">
                <CardHeader className="bg-accent/30 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="w-fit text-[9px] font-black tracking-widest border-primary/10 text-primary/60">ID: {type.id}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{type.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 flex-1">
                  <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
                  <div className="pt-2 border-t border-accent flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Base Amount</span>
                    <span className="text-xl font-black text-primary">{type.amount.toLocaleString()} XAF</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-4 px-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-9 text-xs font-bold gap-2"
                    onClick={() => openFeeModal(type)}
                  >
                    <Settings2 className="w-3 h-3" /> Edit Structure
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => handleDeleteFee(type.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* FEE MODAL (Add/Edit) */}
      <Dialog open={isFeeModalOpen} onOpenChange={setIsFeeModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-6 text-white">
            <DialogTitle className="text-xl font-black tracking-tight">
              {editingFee ? 'Modify Fee Structure' : 'New Institutional Fee'}
            </DialogTitle>
            <DialogDescription className="text-white/60">Define parameters for this institutional cost center.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fee Name</Label>
              <Input 
                placeholder="e.g. Laboratory Package" 
                className="h-11 bg-accent/30 border-none rounded-xl"
                value={feeFormData.name}
                onChange={(e) => setFeeFormData({...feeFormData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Base Amount (XAF)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                className="h-11 bg-accent/30 border-none rounded-xl font-bold"
                value={feeFormData.amount}
                onChange={(e) => setFeeFormData({...feeFormData, amount: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea 
                placeholder="Brief purpose of this fee..." 
                className="min-h-[100px] bg-accent/30 border-none rounded-xl"
                value={feeFormData.description}
                onChange={(e) => setFeeFormData({...feeFormData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="p-6 bg-accent/30 border-t border-accent flex sm:flex-row gap-3">
            <Button variant="ghost" className="flex-1 rounded-xl h-11" onClick={() => setIsFeeModalOpen(false)}>Cancel</Button>
            <Button className="flex-1 rounded-xl h-11 shadow-lg font-bold" onClick={handleSaveFee}>Save Structure</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ENHANCED RECEIPT PREVIEW DIALOG */}
      <Dialog open={!!previewReceipt} onOpenChange={() => setPreviewReceipt(null)}>
        <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl overflow-hidden bg-[#F0F2F5]">
          <DialogHeader className="p-6 bg-primary text-white border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between w-full">
              <DialogTitle className="flex items-center gap-3 text-xl font-headline tracking-tight">
                <Receipt className="w-6 h-6 text-secondary" />
                Institutional Receipt
              </DialogTitle>
              <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60">
                Official Original
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div id="receipt-print" className="bg-white p-8 space-y-8 rounded-3xl shadow-lg relative border border-border overflow-hidden">
               {/* Watermark Logo */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
                  <Building2 className="w-64 h-64 text-primary rotate-12" />
               </div>

               {/* Receipt Branding Header */}
               <div className="flex justify-between items-start border-b-2 border-dashed border-accent pb-6">
                  <div className="flex items-center gap-3">
                     <div className="bg-primary p-2 rounded-xl shadow-lg">
                        <Building2 className="w-8 h-8 text-secondary" />
                     </div>
                     <div>
                        <p className="font-black text-lg text-primary uppercase tracking-tighter leading-none">{previewReceipt?.schoolName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Bursar & Finance Office</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <Badge variant="outline" className="text-[10px] h-6 px-3 font-black bg-secondary/10 text-primary border-none shadow-inner">
                       {previewReceipt?.id}
                     </Badge>
                  </div>
               </div>

               {/* Payer & Collector Context */}
               <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Received From</p>
                        <p className="text-sm font-black flex items-center gap-2 text-primary uppercase"><User className="w-4 h-4 text-secondary"/> {previewReceipt?.studentName}</p>
                        <p className="text-[9px] font-bold text-muted-foreground pl-6 uppercase tracking-wider">Matricule: {previewReceipt?.matricule}</p>
                     </div>
                     <div className="space-y-1 text-right">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Collector</p>
                        <p className="text-sm font-bold text-primary">{previewReceipt?.collector}</p>
                     </div>
                  </div>

                  <div className="bg-[#F8FAFC] p-5 rounded-2xl border-2 border-accent/50 space-y-3 relative shadow-inner">
                     <div className="absolute -top-3 left-4 bg-white px-3 py-0.5 border border-accent rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-sm">
                        Payment Detail
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-black text-primary text-lg leading-tight uppercase tracking-tight">{previewReceipt?.feeType}</span>
                        <span className="text-xs font-bold text-muted-foreground bg-white px-2 py-1 rounded-lg border">Via: {previewReceipt?.method}</span>
                     </div>
                  </div>
                  
                  <div className="pt-6 border-t-4 border-double border-accent flex flex-col items-center gap-6 relative z-10">
                     <div className="space-y-2 text-center w-full">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Amount Confirmed</p>
                        <div className="p-6 bg-[#1E293B] text-white rounded-3xl w-full text-center space-y-1 shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-50" />
                           <p className="text-4xl font-black tracking-widest relative z-10 text-secondary">{previewReceipt?.amount}</p>
                           <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40 mt-3 relative z-10">
                              <ShieldCheck className="w-3 h-3" />
                              Transaction Verified
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-1">
                     <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest text-left">Date of Payment</p>
                     <p className="text-xs font-black text-primary text-left">{previewReceipt?.date}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                     <div className="w-16 h-16 opacity-20">
                        <QrCode className="w-full h-full" />
                     </div>
                     <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Digital Check ID: {previewReceipt?.verificationCode}</p>
                  </div>
               </div>

               <div className="absolute bottom-4 left-0 right-0 px-8 flex items-center justify-between opacity-30 text-[8px] font-black uppercase tracking-[0.3em]">
                  <span>EduNexus Finance</span>
                  <span>Institutional Portal</span>
               </div>
            </div>
          </div>

          <div className="p-6 bg-amber-50 border-t border-amber-100 mx-6 mb-6 rounded-2xl flex gap-3">
             <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
             <p className="text-[10px] text-amber-800 leading-tight">This receipt is a temporal legal document. Final term clearance requires validation from the registrar's office after full payment.</p>
          </div>

          <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0 shrink-0">
            <Button variant="outline" onClick={() => window.print()} className="flex-1 h-12 gap-2 rounded-xl font-bold border-primary/10">
              <Printer className="w-4 h-4 text-primary" /> Print Copy
            </Button>
            <Button onClick={() => setPreviewReceipt(null)} className="flex-1 h-12 gap-2 rounded-xl font-black uppercase tracking-widest shadow-xl">
              <CheckCircle2 className="w-4 h-4 text-secondary" /> Finish Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
