
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
  FileDown,
  Calendar
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
];

const MOCK_STUDENTS_LIST = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", balance: 100000, status: "partial" },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", balance: 0, status: "cleared" },
];

export default function BursarFeesPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("ledger");
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

  const isBursar = user?.role === "BURSAR";
  const isAdmin = user?.role === "SCHOOL_ADMIN";

  const handleCollectPayment = () => {
    if (!isBursar) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Payment Recorded", description: "Successfully processed for student." });
      setSelectedStudent(null);
      setPaymentAmount("");
    }, 1000);
  };

  const handleSaveFee = () => {
    if (!isBursar) return;
    setIsFeeModalOpen(false);
    toast({ title: "Structure Updated", description: "The fee registry has been modified." });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Coins className="w-6 h-6 text-secondary" />
            </div>
            {isAdmin ? "Financial Supervision" : "Financial Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Supervisory view of institutional revenue and collection ledger." : "Collect fees and manage institutional cost structures."}
          </p>
        </div>
        <div className="flex items-center gap-3">
           {isBursar && (
             <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary hover:text-white">
               <Calendar className="w-4 h-4" /> Set Global Deadline
             </Button>
           )}
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-accent flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground leading-none">Term Intake</p>
                <p className="text-lg font-black text-primary leading-tight">4.2M XAF</p>
              </div>
           </div>
        </div>
      </div>

      <Tabs defaultValue={isBursar ? "collect" : "ledger"} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] bg-white shadow-sm border h-auto p-1 rounded-2xl">
          {isBursar && (
            <TabsTrigger value="collect" className="gap-2 py-3 rounded-xl transition-all">
              <Wallet className="w-4 h-4" /> Collect Fee
            </TabsTrigger>
          )}
          <TabsTrigger value="ledger" className="gap-2 py-3 rounded-xl transition-all">
            <History className="w-4 h-4" /> Payment Ledger
          </TabsTrigger>
          <TabsTrigger value="structure" className="gap-2 py-3 rounded-xl transition-all">
            <ShieldCheck className="w-4 h-4" /> Fee Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collect" className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          {isBursar ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <Card className="lg:col-span-7 border-none shadow-xl overflow-hidden rounded-3xl">
                <CardHeader className="bg-primary text-white p-8">
                  <CardTitle>Process Student Fee</CardTitle>
                  <CardDescription className="text-white/60">Bursar action: Record physical payment.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <p className="text-sm text-muted-foreground">Select a student and cost center to record a payment.</p>
                  <Button className="w-full h-12" onClick={handleCollectPayment} disabled={isProcessing}>Record Payment</Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-20 text-center text-muted-foreground">Oversight Role: Please use the Ledger tab to view financial reports.</div>
          )}
        </TabsContent>

        <TabsContent value="ledger" className="mt-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Institutional Financial Ledger</CardTitle>
                <CardDescription>Auditable log of all school revenue transactions.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2"><FileDown className="w-4 h-4" /> Export Audit Log</Button>
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
                    <TableRow key={pay.id}>
                      <TableCell className="pl-6 py-4 font-mono font-bold text-primary">{pay.id}</TableCell>
                      <TableCell className="font-bold text-sm">{pay.student}</TableCell>
                      <TableCell className="text-xs">{pay.type}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="text-[9px]">{pay.method}</Badge></TableCell>
                      <TableCell className="text-center font-black text-primary">{pay.amount}</TableCell>
                      <TableCell className="text-right pr-6 text-xs">{pay.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feeTypes.map((type) => (
              <Card key={type.id} className="border-none shadow-sm flex flex-col bg-white">
                <CardHeader className="bg-accent/30 pb-4">
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  <p className="text-xs text-muted-foreground mb-4">{type.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Standard Rate</span>
                    <span className="text-xl font-black text-primary">{type.amount.toLocaleString()} XAF</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/5 pt-4">
                  <Button variant="outline" className="w-full text-[10px] font-bold uppercase" disabled={isAdmin}>
                    {isAdmin ? "View Policy Only" : "Edit Structure"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
