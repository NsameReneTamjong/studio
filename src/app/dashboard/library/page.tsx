
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Library, 
  Search, 
  Book, 
  Clock, 
  Plus, 
  History,
  BookOpen,
  Settings2,
  Save,
  Pencil,
  Trash2,
  Eye,
  X,
  BookMarked,
  Loader2,
  ArrowLeft,
  Download,
  Upload,
  Coins,
  ShieldCheck,
  Building2,
  Gavel,
  FileText,
  AlertCircle,
  CalendarDays,
  CreditCard,
  ImageIcon,
  CheckCircle2,
  FileDown,
  Info,
  UserCheck,
  RotateCcw,
  ArrowRightLeft,
  ArrowUpRight,
  Printer,
  QrCode,
  Signature as SignatureIcon,
  User,
  GraduationCap
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const INITIAL_BOOKS = [
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/400/600", description: "In-depth study of thermodynamics and quantum mechanics.", isbn: "ISBN-922-X", borrowDuration: 7, overdueFee: 500 },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/400/600", description: "Comprehensive guide to integration and complex series.", isbn: "ISBN-102-M", borrowDuration: 5, overdueFee: 1000 },
  { id: "B003", title: "Organic Chemistry", author: "Dr. White", category: "Science", available: 0, total: 8, cover: "https://picsum.photos/seed/chem/400/600", description: "Study of carbon compounds and biological synthesis.", isbn: "ISBN-441-C", borrowDuration: 7, overdueFee: 500 },
];

const INITIAL_REQUESTS = [
  { id: "REQ-001", studentName: "Charlie Davis", studentId: "GBHS26S003", bookTitle: "Advanced Physics", bookId: "B001", date: "Today, 09:15 AM", avatar: "https://picsum.photos/seed/s3/100/100" },
  { id: "REQ-002", studentName: "Diana Prince", studentId: "GBHS26S004", bookTitle: "Calculus II", bookId: "B002", date: "Today, 10:30 AM", avatar: "https://picsum.photos/seed/s4/100/100" },
];

const INITIAL_LOANS = [
  { id: "LOAN-101", bookTitle: "Organic Chemistry", bookId: "B003", borrowerName: "Alice Thompson", borrowerId: "GBHS26S001", borrowDate: "May 15, 2024", returnDate: "May 29, 2024", status: "Active", avatar: "https://picsum.photos/seed/s1/100/100" },
  { id: "LOAN-102", bookTitle: "Advanced Physics", bookId: "B001", borrowerName: "Bob Richards", borrowerId: "GBHS26S002", borrowDate: "May 10, 2024", returnDate: "May 17, 2024", status: "Overdue", avatar: "https://picsum.photos/seed/s2/100/100" },
];

const MOCK_STUDENT_HISTORY = [
  { id: "H-101", title: "Organic Chemistry", author: "Dr. Tesla", borrowDate: "Mar 10, 2024", returnDate: "Mar 17, 2024", status: "Returned", fee: "0" },
  { id: "H-102", title: "Calculus II", author: "Prof. Smith", borrowDate: "Feb 05, 2024", returnDate: "Feb 15, 2024", status: "Returned", fee: "2,000" },
];

const MOCK_BORROWERS = [
  { id: "GBHS26S001", name: "Alice Thompson" },
  { id: "GBHS26S002", name: "Bob Richards" },
  { id: "GBHS26S003", name: "Charlie Davis" },
];

export default function LibraryPage() {
  const { user, platformSettings } = useAuth();
  const { language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);
  
  // Borrowing State
  const [selectedBookForLoan, setSelectedBookForLoan] = useState<any>(null);
  const [borrowRequestTicket, setBorrowRequestTicket] = useState<any>(null);
  const [borrowerData, setBorrowerData] = useState({ studentId: "", duration: "7" });

  const [libraryPolicy, setLibraryPolicy] = useState({
    defaultDuration: 7,
    defaultOverdueFee: 500,
    rules: "1. Books must be handled with care. 2. Identification is required for borrowing. 3. Late returns will incur daily penalties as defined per volume."
  });

  const isLibrarian = user?.role === "LIBRARIAN";
  const isManagement = ["SCHOOL_ADMIN", "SUB_ADMIN", "LIBRARIAN"].includes(user?.role || "");

  const [newBookData, setNewBookData] = useState({
    title: "",
    author: "",
    category: "Science",
    isbn: "",
    total: 5,
    description: "",
    cover: "https://picsum.photos/seed/newbook/400/600",
    borrowDuration: 7,
    overdueFee: 500
  });

  const handleAddBook = () => {
    if (!newBookData.title || !newBookData.author) return;
    setIsProcessing(true);
    setTimeout(() => {
      setBooks([{ 
        ...newBookData, 
        id: `B-${Math.random().toString(36).substr(2, 5)}`, 
        available: newBookData.total 
      }, ...books]);
      setIsProcessing(false);
      setIsAddingBook(false);
      setNewBookData({
        title: "",
        author: "",
        category: "Science",
        isbn: "",
        total: 5,
        description: "",
        cover: "https://picsum.photos/seed/newbook/400/600",
        borrowDuration: 7,
        overdueFee: 500
      });
      toast({ title: "Catalog Updated", description: "New volume has been registered to the node." });
    }, 800);
  };

  const handleIssueLoan = () => {
    if (!borrowerData.studentId) return;
    setIsProcessing(true);
    setTimeout(() => {
      const student = MOCK_BORROWERS.find(s => s.id === borrowerData.studentId);
      const newLoan = {
        id: `LOAN-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        bookTitle: selectedBookForLoan.title,
        borrowerName: student?.name || "Unknown",
        borrowerId: borrowerData.studentId,
        borrowDate: new Date().toLocaleDateString(),
        returnDate: new Date(Date.now() + 86400000 * 7).toLocaleDateString(),
        status: "Active",
        avatar: "https://picsum.photos/seed/borrower/100/100"
      };
      setLoans([newLoan, ...loans]);
      setIsProcessing(false);
      setSelectedBookForLoan(null);
      setBorrowerData({ studentId: "", duration: "7" });
      toast({ title: "Loan Recorded", description: `Issued to ${student?.name}` });
    }, 1200);
  };

  const handleStudentBorrowRequest = (book: any) => {
    if (!user) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const ticket = {
        id: `REQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        borrowerName: user.name,
        borrowerId: user.id,
        borrowerRole: user.role,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookIsbn: book.isbn,
        bookId: book.id,
        duration: book.borrowDuration || 7,
        date: new Date().toLocaleDateString(),
        schoolName: user.school?.name || "EduIgnite Academic Node"
      };
      
      setBorrowRequestTicket(ticket);
      setIsProcessing(false);
      toast({ title: "Request Certificate Generated", description: "Present this to the librarian." });
    }, 1000);
  };

  const handleIssueRequest = (request: any) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newLoan = {
        id: `LOAN-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        bookTitle: request.bookTitle,
        bookId: request.bookId,
        borrowerName: request.studentName,
        borrowerId: request.studentId,
        borrowDate: new Date().toLocaleDateString(),
        returnDate: new Date(Date.now() + 86400000 * 7).toLocaleDateString(),
        status: "Active",
        avatar: request.avatar
      };
      setLoans([newLoan, ...loans]);
      setRequests(prev => prev.filter(r => r.id !== request.id));
      setIsProcessing(false);
      toast({ title: "Volume Issued", description: `Request for ${request.bookTitle} finalized.` });
    }, 1000);
  };

  const handleReturnBook = (loan: any) => {
    setIsProcessing(true);
    setTimeout(() => {
      setLoans(prev => prev.filter(l => l.id !== loan.id));
      setIsProcessing(false);
      toast({ title: "Return Verified", description: `${loan.bookTitle} has been returned to stock.` });
    }, 1000);
  };

  const handleUpdatePolicy = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Policy Synchronized", description: "Institutional borrowing rules updated." });
    }, 1000);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
                <Library className="w-6 h-6 text-secondary" />
              </div>
              {isManagement ? "Library Management" : "Institutional Library"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Registry of digital and physical volumes for the institutional node.</p>
          </div>
        </div>
        
        {isLibrarian && (
          <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg h-11 rounded-xl font-bold">
                <Plus className="w-4 h-4" /> Register Volume
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl w-[95vw] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
              <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <BookMarked className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">New Catalog Entry</DialogTitle>
                    <DialogDescription className="text-white/60">Initialize a new volume with specific borrowing rules.</DialogDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsAddingBook(false)} className="absolute top-4 right-4 text-white hover:bg-white/10">
                  <X className="w-6 h-6" />
                </Button>
              </DialogHeader>
              <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-white">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-4 text-center">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center block">Volume Cover</Label>
                    <div className="aspect-[3/4] bg-accent/20 rounded-2xl border-2 border-dashed border-accent flex flex-col items-center justify-center overflow-hidden group relative shadow-inner">
                      {newBookData.cover ? (
                        <img src={newBookData.cover} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-primary/20" />
                      )}
                      <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center gap-2">
                        <Upload className="w-6 h-6" />
                        <span className="text-[8px] font-black uppercase">Change Cover URL Below</span>
                      </div>
                    </div>
                    <Input 
                      value={newBookData.cover} 
                      onChange={(e) => setNewBookData({...newBookData, cover: e.target.value})} 
                      placeholder="https://image-url.com" 
                      className="h-10 bg-accent/30 border-none rounded-xl text-[10px]"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Volume Title</Label>
                        <Input 
                          value={newBookData.title} 
                          onChange={(e) => setNewBookData({...newBookData, title: e.target.value})} 
                          className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
                          placeholder="e.g. Advanced Thermodynamics" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Author / Researcher</Label>
                        <Input 
                          value={newBookData.author} 
                          onChange={(e) => setNewBookData({...newBookData, author: e.target.value})} 
                          className="h-12 bg-accent/30 border-none rounded-xl font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Total Stock</Label>
                        <Input 
                          type="number" 
                          value={newBookData.total} 
                          onChange={(e) => setNewBookData({...newBookData, total: parseInt(e.target.value)})} 
                          className="h-12 bg-accent/30 border-none rounded-xl font-black" 
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6">
                      <h3 className="text-[10px] font-black uppercase text-primary tracking-widest border-b pb-2 opacity-40">Borrowing Parameters</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 flex items-center gap-2">
                            <Clock className="w-3 h-3 text-secondary" /> Duration (Days)
                          </Label>
                          <Input 
                            type="number" 
                            value={newBookData.borrowDuration} 
                            onChange={(e) => setNewBookData({...newBookData, borrowDuration: parseInt(e.target.value)})} 
                            className="h-12 bg-white border-none rounded-xl font-black text-primary" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 flex items-center gap-2">
                            <Coins className="w-3 h-3 text-secondary" /> Overdue Fee (XAF/Day)
                          </Label>
                          <Input 
                            type="number" 
                            value={newBookData.overdueFee} 
                            onChange={(e) => setNewBookData({...newBookData, overdueFee: parseInt(e.target.value)})} 
                            className="h-12 bg-white border-none rounded-xl font-black text-primary" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t flex gap-3">
                <Button onClick={handleAddBook} disabled={isProcessing || !newBookData.title} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3">
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit to Catalog
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-blue-50 p-6 rounded-3xl group hover:shadow-md transition-all">
          <p className="text-[10px] font-black uppercase text-blue-600 mb-2">Total Volumes</p>
          <div className="text-3xl font-black text-blue-700">{books.length}</div>
        </Card>
        <Card className="border-none shadow-sm bg-purple-50 p-6 rounded-3xl group hover:shadow-md transition-all">
          <p className="text-[10px] font-black uppercase text-purple-600 mb-2">Pending Issue</p>
          <div className="text-3xl font-black text-purple-700">{requests.length}</div>
        </Card>
        <Card className="border-none shadow-sm bg-amber-50 p-6 rounded-3xl group hover:shadow-md transition-all">
          <p className="text-[10px] font-black uppercase text-amber-600 mb-2">Active Loans</p>
          <div className="text-3xl font-black text-amber-700">{loans.length}</div>
        </Card>
        <Card className="border-none shadow-sm bg-emerald-50 p-6 rounded-3xl group hover:shadow-md transition-all">
          <p className="text-[10px] font-black uppercase text-emerald-600 mb-2">Node Capacity</p>
          <div className="text-3xl font-black text-emerald-700">92%</div>
        </Card>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className={cn(
          "grid w-full mb-8 bg-white shadow-sm border h-auto p-1.5 rounded-[2rem]", 
          isLibrarian ? "grid-cols-5 md:w-[1000px]" : 
          isManagement ? "grid-cols-3 md:w-[600px]" : 
          "grid-cols-3 md:w-[600px]"
        )}>
          <TabsTrigger value="catalog" className="gap-2 py-3 rounded-2xl transition-all font-bold"><BookOpen className="w-4 h-4" /> Catalog</TabsTrigger>
          {isLibrarian && (
            <>
              <TabsTrigger value="issue-queue" className="gap-2 py-3 rounded-2xl transition-all font-bold"><ArrowUpRight className="w-4 h-4" /> Issue Queue</TabsTrigger>
              <TabsTrigger value="return-desk" className="gap-2 py-3 rounded-2xl transition-all font-bold"><RotateCcw className="w-4 h-4" /> Return Desk</TabsTrigger>
            </>
          )}
          {isManagement && (
            <TabsTrigger value="history" className="gap-2 py-3 rounded-2xl transition-all font-bold"><History className="w-4 h-4" /> Registry</TabsTrigger>
          )}
          {!isManagement && (
            <>
              <TabsTrigger value="my-loans" className="gap-2 py-3 rounded-2xl transition-all font-bold"><BookMarked className="w-4 h-4" /> My Loans</TabsTrigger>
              <TabsTrigger value="history" className="gap-2 py-3 rounded-2xl transition-all font-bold"><History className="w-4 h-4" /> My History</TabsTrigger>
            </>
          )}
          {isLibrarian && <TabsTrigger value="policy" className="gap-2 py-3 rounded-2xl transition-all font-bold"><Gavel className="w-4 h-4" /> Rules & Policy</TabsTrigger>}
        </TabsList>

        <TabsContent value="catalog" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search catalog by title, author, or ISBN..." 
              className="pl-12 h-14 bg-white border-none rounded-[1.5rem] shadow-sm focus-visible:ring-primary" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="border-none shadow-sm overflow-hidden bg-white rounded-[2rem] group hover:shadow-xl transition-all duration-500">
                <div className="aspect-[3/4] bg-accent/20 overflow-hidden relative">
                  <img src={book.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={book.title} />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-md border-none text-[8px] font-black uppercase px-2 shadow-sm">
                      {book.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-lg font-black truncate text-primary">{book.title}</CardTitle>
                  <CardDescription className="text-xs font-bold text-muted-foreground">{book.author}</CardDescription>
                </CardHeader>
                <CardContent className="px-6 py-4 space-y-4">
                   <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground/60">
                        <span>Available Stock</span>
                        <span className="text-primary">{book.available} / {book.total}</span>
                      </div>
                      <Progress value={(book.available / book.total) * 100} className="h-1.5 rounded-full" />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2">
                      <div className="bg-accent/30 p-2 rounded-xl border border-accent">
                         <p className="text-[8px] font-black uppercase text-muted-foreground">Duration</p>
                         <p className="text-xs font-black text-primary">{book.borrowDuration || libraryPolicy.defaultDuration} Days</p>
                      </div>
                      <div className="bg-accent/30 p-2 rounded-xl border border-accent">
                         <p className="text-[8px] font-black uppercase text-muted-foreground">Late Fee</p>
                         <p className="text-xs font-black text-secondary">{book.overdueFee || libraryPolicy.defaultOverdueFee} XAF</p>
                      </div>
                   </div>
                </CardContent>
                <CardFooter className="p-6 pt-2">
                  <Button 
                    className="w-full h-12 text-xs font-black uppercase tracking-widest shadow-lg rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all active:scale-95" 
                    disabled={book.available === 0}
                    onClick={() => {
                      if (isLibrarian) {
                        setSelectedBookForLoan(book);
                      } else {
                        handleStudentBorrowRequest(book);
                      }
                    }}
                  >
                    <BookMarked className="w-4 h-4 mr-2" /> 
                    {isLibrarian ? "Issue Volume" : "Request Borrow"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="issue-queue" className="animate-in fade-in slide-in-from-bottom-2 mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="border-b p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tight">Pending Issue Requests</CardTitle>
                <CardDescription>Review and authorize student borrowing requests.</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-none font-black h-7 px-4">
                {requests.length} REQUESTS
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Requester Identity</TableHead>
                    <TableHead>Requested Volume</TableHead>
                    <TableHead className="text-center">Requested On</TableHead>
                    <TableHead className="text-right pr-8">Operational Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map(req => (
                    <TableRow key={req.id} className="h-16 border-b hover:bg-accent/5 transition-colors">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src={req.avatar} />
                            <AvatarFallback>{req.studentName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm text-primary uppercase leading-none mb-1">{req.studentName}</p>
                            <p className="text-[9px] font-mono text-muted-foreground uppercase">{req.studentId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-xs uppercase text-primary">{req.bookTitle}</TableCell>
                      <TableCell className="text-center text-[10px] font-bold text-muted-foreground">{req.date}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          size="sm" 
                          className="h-9 rounded-xl font-black uppercase text-[10px] shadow-md gap-2"
                          onClick={() => handleIssueRequest(req)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                          Finalize Issue
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-muted-foreground italic">No pending requests found in the queue.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="return-desk" className="animate-in fade-in slide-in-from-bottom-2 mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="border-b p-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tight">Loan Return Desk</CardTitle>
                <CardDescription>Process returns and verify volume integrity.</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none font-black h-7 px-4">
                {loans.length} ACTIVE LOANS
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Borrower Identity</TableHead>
                    <TableHead>Volume Held</TableHead>
                    <TableHead className="text-center">Due for Return</TableHead>
                    <TableHead className="text-center">Lifecycle</TableHead>
                    <TableHead className="text-right pr-8">Return Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map(loan => (
                    <TableRow key={loan.id} className="h-16 border-b group hover:bg-accent/5">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src={loan.avatar} />
                            <AvatarFallback>{loan.borrowerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-primary uppercase leading-none mb-1">{loan.borrowerName}</span>
                            <span className="text-[9px] font-mono text-muted-foreground uppercase">{loan.borrowerId}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-xs uppercase text-primary">{loan.bookTitle}</TableCell>
                      <TableCell className="text-center font-mono text-[10px] font-bold text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary/40" />
                          {loan.returnDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[8px] font-black uppercase px-2 h-5 border-none",
                          loan.status === 'Overdue' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        )}>
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="h-9 rounded-xl font-black uppercase text-[10px] shadow-sm gap-2"
                          onClick={() => handleReturnBook(loan)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                          Verify Return
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">No active loans currently in circulation.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-2">
          {isManagement ? (
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="border-b p-8 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black text-primary uppercase tracking-tight">Institutional Accession Registry</CardTitle>
                  <CardDescription>Verified chronological record of volumes in the node library.</CardDescription>
                </div>
                {isLibrarian && (
                  <Button variant="outline" className="rounded-[1.5rem] h-11 gap-2 border-primary/10 font-bold bg-white shadow-sm">
                    <Download className="w-4 h-4 text-primary" /> Export CSV
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Node Reference</TableHead>
                      <TableHead>Title & Identity</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-center">Borrow Rule</TableHead>
                      <TableHead className="text-right pr-8">Inventory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map(b => (
                      <TableRow key={b.id} className="h-16 border-b hover:bg-accent/5 transition-colors">
                        <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{b.id}</TableCell>
                        <TableCell className="font-black text-xs uppercase text-primary">{b.title}</TableCell>
                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">{b.author}</TableCell>
                        <TableCell className="text-center">
                           <div className="inline-flex items-center gap-2">
                              <Badge variant="outline" className="text-[8px] font-bold border-primary/10 text-primary">{b.borrowDuration || 7} Days</Badge>
                              <Badge variant="outline" className="text-[8px] font-bold border-secondary/20 text-secondary">{b.overdueFee || 500} XAF</Badge>
                           </div>
                        </TableCell>
                        <TableCell className="text-right pr-8 font-black text-primary">
                          <span className={cn(b.available === 0 ? "text-red-500" : "text-emerald-600")}>{b.available}</span>
                          <span className="opacity-20 mx-1">/</span>
                          <span className="opacity-40">{b.total}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="border-b p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black text-primary uppercase tracking-tight">My Borrowing Ledger</CardTitle>
                  <CardDescription>Verified record of your past transactions with the node library.</CardDescription>
                </div>
                <Button 
                  className="rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg bg-primary text-white" 
                  onClick={() => toast({ title: "PDF Generated", description: "Your library history has been downloaded." })}
                >
                  <FileDown className="w-4 h-4" /> Download History (PDF)
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Transaction ID</TableHead>
                      <TableHead>Volume Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-center">Borrow Date</TableHead>
                      <TableHead className="text-center">Return Date</TableHead>
                      <TableHead className="text-right pr-8">Status / Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENT_HISTORY.map(h => (
                      <TableRow key={h.id} className="h-16 border-b hover:bg-accent/5">
                        <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{h.id}</TableCell>
                        <TableCell className="font-black text-xs uppercase text-primary">{h.title}</TableCell>
                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">{h.author}</TableCell>
                        <TableCell className="text-center text-[10px] font-bold text-muted-foreground">{h.borrowDate}</TableCell>
                        <TableCell className="text-center text-[10px] font-bold text-muted-foreground">{h.returnDate}</TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex flex-col items-end">
                            <Badge className="text-[8px] font-black uppercase px-2 h-5 bg-green-100 text-green-700 border-none">RETURNED</Badge>
                            {h.fee !== "0" && <span className="text-[9px] font-black text-red-600 mt-1">{h.fee} XAF Paid</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {!isManagement && (
          <TabsContent value="my-loans" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Ref Code</TableHead>
                      <TableHead>Volume Title</TableHead>
                      <TableHead className="text-center">Borrow Date</TableHead>
                      <TableHead className="text-center">Due Date</TableHead>
                      <TableHead className="text-right pr-8">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.filter(l => l.borrowerId === user?.id).map(loan => (
                      <TableRow key={loan.id} className="h-16 border-b group hover:bg-accent/5">
                        <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{loan.id}</TableCell>
                        <TableCell className="font-black text-xs uppercase text-primary">{loan.bookTitle}</TableCell>
                        <TableCell className="text-center text-[10px] font-bold text-muted-foreground">{loan.borrowDate}</TableCell>
                        <TableCell className="text-center text-[10px] font-bold text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary/40" />
                            {loan.returnDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button variant="outline" size="sm" className="h-8 rounded-lg font-bold text-[10px] uppercase">Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {loans.filter(l => l.borrowerId === user?.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">No active loans found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isLibrarian && (
          <TabsContent value="policy" className="animate-in fade-in slide-in-from-bottom-2 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-8">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary p-10 text-white">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-2xl text-secondary"><Gavel className="w-8 h-8" /></div>
                      <div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tight">Institutional Borrowing Policy</CardTitle>
                        <CardDescription className="text-white/60 text-xs">Define standard node rules for book circulation.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Default Duration (Days)</Label>
                        <Input 
                          type="number" 
                          value={libraryPolicy.defaultDuration} 
                          onChange={(e) => setLibraryPolicy({...libraryPolicy, defaultDuration: parseInt(e.target.value)})}
                          className="h-12 bg-accent/30 border-none rounded-xl font-black text-primary text-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Default Overdue Fee (XAF/Day)</Label>
                        <Input 
                          type="number" 
                          value={libraryPolicy.defaultOverdueFee} 
                          onChange={(e) => setLibraryPolicy({...libraryPolicy, defaultOverdueFee: parseInt(e.target.value)})}
                          className="h-12 bg-accent/30 border-none rounded-xl font-black text-primary text-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Circulation Rules & Guidelines</Label>
                      <Textarea 
                        value={libraryPolicy.rules} 
                        onChange={(e) => setLibraryPolicy({...libraryPolicy, rules: e.target.value})}
                        className="min-h-[150px] bg-accent/30 border-none rounded-2xl p-6 leading-relaxed italic font-medium"
                        placeholder="Describe how borrowing works in this node..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-accent/20 p-8 border-t flex justify-end">
                    <Button className="h-14 px-12 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3 transition-all active:scale-95" onClick={handleUpdatePolicy} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-5 h-5 text-secondary" />}
                      Commit Policy Registry
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <Card className="border-none shadow-sm bg-primary text-white p-10 rounded-[3rem] space-y-6 text-center overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Library className="w-48 h-48" /></div>
                   <div className="flex justify-center relative z-10">
                      <div className="p-5 bg-white/10 rounded-[2.5rem] shadow-2xl border-4 border-white/5 backdrop-blur-sm">
                         <ShieldCheck className="w-16 h-16 text-secondary" />
                      </div>
                   </div>
                   <div className="space-y-2 relative z-10">
                      <h4 className="text-2xl font-black uppercase tracking-tighter">Node Integrity</h4>
                      <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
                        The rules defined here are enforced node-wide. All loan timestamps and fee calculations are automatically linked to student financial accounts.
                      </p>
                   </div>
                   <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4 relative z-10">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                         <CheckCircle2 className="w-4 h-4 text-secondary" /> 
                         Automated Penalty Sync
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                         <CheckCircle2 className="w-4 h-4 text-secondary" /> 
                         Parental Notification
                      </div>
                   </div>
                </Card>

                <Card className="border-none shadow-sm bg-blue-50 p-8 rounded-[2.5rem] space-y-4">
                   <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <h4 className="text-xs font-black uppercase text-blue-700 tracking-widest">Librarian Notice</h4>
                   </div>
                   <p className="text-[11px] text-blue-800 leading-relaxed font-medium italic">
                     "Updates to global rules will only apply to new borrowing requests. Ongoing loans will maintain the parameters set at the time of issuance to ensure pedagogical continuity."
                   </p>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* LIBRARIAN ISSUE LOAN DIALOG */}
      <Dialog open={!!selectedBookForLoan} onOpenChange={() => setSelectedBookForLoan(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <BookMarked className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase">Loan Authorization</DialogTitle>
                <DialogDescription className="text-white/60">Borrowing: {selectedBookForLoan?.title}</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedBookForLoan(null)} className="absolute top-4 right-4 text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity of Borrower</Label>
                <Select value={borrowerData.studentId} onValueChange={(v) => setBorrowerData({...borrowerData, studentId: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                    <SelectValue placeholder="Search Student Registry..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_BORROWERS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
                <Info className="w-5 h-5 text-primary opacity-40" />
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                  By clicking finalize, you acknowledge that the student is verified and eligible for library services.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white" onClick={handleIssueLoan} disabled={isProcessing || !borrowerData.studentId}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-secondary" />}
              Finalize Loan Registry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* STUDENT BORROW REQUEST CERTIFICATE */}
      <Dialog open={!!borrowRequestTicket} onOpenChange={() => setBorrowRequestTicket(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-6 md:p-8 text-white no-print relative shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-secondary"><BookMarked className="w-8 h-8" /></div>
                <div>
                  <DialogTitle className="text-xl md:text-2xl font-black uppercase">Borrow Request Generated</DialogTitle>
                  <DialogDescription className="text-white/60 text-xs">Official institutional request for volume accession.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setBorrowRequestTicket(null)} className="text-white hover:bg-white/10"><X className="w-6 h-6" /></Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto bg-muted p-4 md:p-10 print:p-0 print:bg-white no-scrollbar">
            <div className="overflow-x-auto rounded-xl border-2 border-primary/10 shadow-inner bg-white">
              <BorrowRequestCertificate ticket={borrowRequestTicket} platform={platformSettings} />
            </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center shrink-0 no-print">
             <div className="flex items-center gap-2 text-muted-foreground italic">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Institutional Node Request</p>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl h-11 px-6 font-bold" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print Ticket</Button>
                <Button className="rounded-xl px-10 h-11 font-black uppercase text-[10px] gap-2 shadow-lg" onClick={() => toast({ title: "PDF Generated" })}><Download className="w-4 h-4" /> Download</Button>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BorrowRequestCertificate({ ticket, platform }: { ticket: any, platform: any }) {
  if (!ticket) return null;
  
  return (
    <div id="borrow-request-print" className="bg-white p-12 md:p-20 border-[12px] border-double border-primary/10 shadow-2xl w-[900px] md:w-full max-w-4xl mx-auto font-serif text-black relative overflow-hidden print:border-none print:shadow-none print:w-full">
      <div className="relative z-10 space-y-10">
        {/* National Header */}
        <div className="grid grid-cols-3 gap-4 items-center text-center border-b-2 border-black pb-6">
          <div className="space-y-1 text-[8px] uppercase font-black text-left">
            <p>Republic of Cameroon</p>
            <p>Peace - Work - Fatherland</p>
            <div className="h-px bg-black w-8 my-1" />
            <p>Ministry of Secondary Education</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white flex items-center justify-center p-2 border-2 border-primary/10 mb-2">
               <img src={platform.logo} alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <p className="text-[8px] font-black uppercase text-primary tracking-widest">Library Node Record</p>
          </div>
          <div className="space-y-1 text-[8px] uppercase font-black text-right">
            <p>République du Cameroun</p>
            <p>Paix - Travail - Patrie</p>
            <div className="h-px bg-black w-8 ml-auto my-1" />
            <p>Min. des Enseignements Secondaires</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] underline underline-offset-8 decoration-double">OFFICIAL BORROW REQUEST</h1>
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{ticket.schoolName}</p>
        </div>

        <div className="grid grid-cols-12 gap-8 bg-accent/5 p-8 border border-black/10 rounded-2xl items-start shadow-inner">
          <div className="col-span-12 md:col-span-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2">
                <User className="w-3 h-3" /> Borrower Identity
              </h4>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between font-bold text-primary uppercase"><span className="opacity-40 font-black text-[9px]">Identity:</span> {ticket.borrowerName}</p>
                <p className="flex justify-between font-mono font-bold"><span className="opacity-40 font-black text-[9px] uppercase font-serif">Matricule:</span> {ticket.borrowerId}</p>
                <p className="flex justify-between font-bold"><span className="opacity-40 font-black text-[9px] uppercase font-serif">Position:</span> {ticket.borrowerRole}</p>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-6 space-y-6 md:border-l md:pl-8 border-black/10">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-primary border-b border-black/10 pb-1 flex items-center gap-2">
                <Book className="w-3 h-3" /> Material Description
              </h4>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between font-black text-primary uppercase"><span className="opacity-40 font-black text-[9px] font-serif">Title:</span> {ticket.bookTitle}</p>
                <p className="flex justify-between font-bold"><span className="opacity-40 font-black text-[9px] uppercase font-serif">Author:</span> {ticket.bookAuthor}</p>
                <p className="flex justify-between font-mono font-bold"><span className="opacity-40 font-black text-[9px] uppercase font-serif">ISBN:</span> {ticket.bookIsbn}</p>
                <p className="flex justify-between font-bold text-secondary"><span className="opacity-40 font-black text-[9px] uppercase font-serif">Loan Limit:</span> {ticket.duration} Days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
           <h4 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
             <Gavel className="w-3 h-3" /> Borrower's Commitment
           </h4>
           <p className="text-[10px] leading-relaxed italic text-muted-foreground font-medium">
             "I, the undersigned, hereby request accession to the aforementioned pedagogical material. I commit to handling the volume with professional care and returning it to the institutional node on or before the agreed deadline. I acknowledge that late returns or damages will result in penalties linked to my student/staff financial registry."
           </p>
        </div>

        <div className="grid grid-cols-3 gap-10 pt-10 border-t border-black/5">
          <div className="flex flex-col items-center gap-3 text-center">
            <QrCode className="w-16 h-16 opacity-10" />
            <p className="text-[7px] font-black uppercase text-muted-foreground opacity-40">Request ID: {ticket.id}</p>
          </div>
          <div className="text-center space-y-6">
            <div className="h-12 border-b-2 border-black/20 relative flex items-center justify-center">
               <SignatureSVG className="w-full h-full text-primary/10 p-2" />
            </div>
            <p className="text-[9px] font-black uppercase text-primary tracking-widest leading-none">Borrower</p>
          </div>
          <div className="text-center space-y-6">
            <div className="h-12 border-b-2 border-black/20 flex items-center justify-center">
               <Badge variant="outline" className="border-black/20 text-[7px] font-black uppercase px-3 py-0.5">OFFICIAL SEAL</Badge>
            </div>
            <p className="text-[9px] font-black uppercase text-primary tracking-widest leading-none">Librarian Office</p>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-black/5 flex items-center justify-between opacity-30">
           <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4" />
              <p className="text-[8px] font-black uppercase tracking-[0.2em]">Verified Node Registry • {new Date().getFullYear()}</p>
           </div>
           <p className="text-[8px] font-black uppercase tracking-widest">Date Issued: {ticket.date}</p>
        </div>
      </div>
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

function LaurelCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10 C 20 10, 10 20, 10 40 M10 10 C 10 20, 20 10, 40 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="10" r="3" />
      <path d="M15 25 L25 15 M20 35 L35 20 M25 45 L45 25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}
