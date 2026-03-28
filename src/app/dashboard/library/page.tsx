
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Library, 
  Search, 
  Book, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Plus, 
  History,
  BookOpen,
  Settings2,
  Coins,
  AlertCircle,
  Save,
  Users,
  Pencil,
  Trash2,
  Eye,
  FileDown,
  ArrowUpRight,
  ArrowLeftRight,
  Gavel,
  ShieldAlert,
  CalendarClock,
  X,
  BookMarked,
  Filter,
  Receipt,
  User,
  QrCode,
  Printer,
  Loader2,
  ArrowLeft,
  Info,
  Upload,
  FileText,
  Activity,
  TrendingUp,
  ChevronRight,
  Download
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

// Mock Data
const INITIAL_BOOKS = [
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/400/600", description: "In-depth study of thermodynamics.", isbn: "ISBN-922-X" },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/400/600", description: "Comprehensive guide to integration.", isbn: "ISBN-102-M" },
];

const INITIAL_LOANS = [
  { id: "LOAN-101", bookTitle: "Organic Chemistry", borrowerName: "Alice Thompson", borrowerId: "GBHS26S001", borrowDate: "May 15, 2024", returnDate: "May 29, 2024", status: "Active", avatar: "https://picsum.photos/seed/s1/100/100" },
];

export default function LibraryPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);

  const isLibrarian = user?.role === "LIBRARIAN";
  const isAdmin = ["SCHOOL_ADMIN", "SUB_ADMIN"].includes(user?.role || "");
  const isManagement = isLibrarian || isAdmin;

  const [newBookData, setNewBookData] = useState({
    title: "",
    author: "",
    category: "Literature",
    isbn: "",
    total: 5,
    description: "",
    cover: "https://picsum.photos/seed/newbook/400/600"
  });

  const handleAddBook = () => {
    if (!newBookData.title || !newBookData.author) return;
    setIsProcessing(true);
    setTimeout(() => {
      setBooks([{ ...newBookData, id: `B-${Math.random().toString(36).substr(2, 5)}`, available: newBookData.total }, ...books]);
      setIsProcessing(false);
      setIsAddingBook(false);
      toast({ title: "Catalog Updated" });
    }, 800);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0"><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg"><Library className="w-6 h-6 text-secondary" /></div>
              {isManagement ? "Library Management Suite" : t("library")}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{isManagement ? "Monitor circulation and audit membership." : "Explore the institutional catalog."}</p>
          </div>
        </div>
        
        {isLibrarian && (
          <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
            <DialogTrigger asChild><Button className="gap-2 shadow-lg h-11 rounded-xl"><Plus className="w-4 h-4" /> Add Volume</Button></DialogTrigger>
            <DialogContent className="sm:max-w-xl w-[95vw] sm:w-full rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
              <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><BookMarked className="w-8 h-8 text-secondary" /></div>
                  <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Catalog Entry</DialogTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsAddingBook(false)} className="absolute top-4 right-4 text-white hover:bg-white/10"><X className="w-6 h-6" /></Button>
              </DialogHeader>
              <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Book Title</Label>
                    <Input value={newBookData.title} onChange={(e) => setNewBookData({...newBookData, title: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Author</Label>
                    <Input value={newBookData.author} onChange={(e) => setNewBookData({...newBookData, author: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">ISBN</Label>
                    <Input value={newBookData.isbn} onChange={(e) => setNewBookData({...newBookData, isbn: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setIsAddingBook(false)}>Cancel</Button>
                <Button onClick={handleAddBook} disabled={isProcessing || !newBookData.title} className="flex-1 h-12 rounded-xl shadow-xl font-black uppercase tracking-widest text-[10px] gap-2">
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Volume
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isManagement && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2"><p className="text-[10px] font-black uppercase text-blue-600">Total Volumes</p><Book className="w-4 h-4 text-blue-600" /></div>
              <div className="text-3xl font-black text-blue-700">{books.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2"><p className="text-[10px] font-black uppercase text-purple-600">Active Loans</p><Clock className="w-4 h-4 text-purple-600" /></div>
              <div className="text-3xl font-black text-purple-700">{loans.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className={cn(
          "grid w-full mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl",
          isManagement ? "grid-cols-4 md:w-[800px]" : "grid-cols-3 md:w-[600px]"
        )}>
          <TabsTrigger value="catalog" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><BookOpen className="w-4 h-4" /> Catalogue</TabsTrigger>
          {isManagement && <TabsTrigger value="circulation" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Clock className="w-4 h-4" /> Circulation</TabsTrigger>}
          <TabsTrigger value="history" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><History className="w-4 h-4" /> {isManagement ? "Registry" : "My History"}</TabsTrigger>
          {isLibrarian && <TabsTrigger value="policy" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Settings2 className="w-4 h-4" /> Policy</TabsTrigger>}
        </TabsList>

        <TabsContent value="catalog" className="mt-0 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search catalog..." className="pl-10 h-12 bg-white border-none rounded-2xl shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
                <div className="aspect-[3/4] bg-accent/20 overflow-hidden">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <CardHeader className="p-5 pb-2"><CardTitle className="text-lg font-black text-primary truncate leading-tight">{book.title}</CardTitle><CardDescription className="text-xs font-bold">{book.author}</CardDescription></CardHeader>
                <CardContent className="px-5 py-2">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground/60"><span>Available</span><span>{book.available} / {book.total}</span></div>
                   <Progress value={(book.available / (book.total || 1)) * 100} className="h-1 mt-1.5" />
                </CardContent>
                <CardFooter className="p-5 pt-2"><Button className="w-full h-10 text-[10px] font-black uppercase tracking-widest" disabled={book.available === 0}><BookMarked className="w-3.5 h-3.5 mr-2" /> {isManagement ? "View Stock" : "Borrow"}</Button></CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {isManagement && (
          <TabsContent value="circulation" className="mt-0">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-8 text-white"><CardTitle className="text-xl font-black uppercase">Active Circulation Ledger</CardTitle></CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 uppercase text-[9px] font-black"><TableRow><TableHead className="pl-8 py-4">Loan ID</TableHead><TableHead>Borrower</TableHead><TableHead>Book</TableHead><TableHead className="text-center">Return Date</TableHead><TableHead className="text-right pr-8">Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {loans.map(loan => (
                      <TableRow key={loan.id} className="h-16 border-b">
                        <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{loan.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border"><AvatarImage src={loan.avatar} /><AvatarFallback>{loan.borrowerName.charAt(0)}</AvatarFallback></Avatar>
                            <span className="font-bold text-xs uppercase">{loan.borrowerName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-xs uppercase text-primary">{loan.bookTitle}</TableCell>
                        <TableCell className="text-center font-mono text-[10px] font-bold">{loan.returnDate}</TableCell>
                        <TableCell className="text-right pr-8"><Badge className="text-[8px] font-black uppercase px-2.5 h-5">{loan.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
