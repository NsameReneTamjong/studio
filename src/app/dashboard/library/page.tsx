
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
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/400/600", description: "In-depth study of thermodynamics and classical mechanics for advanced students.", isbn: "ISBN-922-X" },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/400/600", description: "Comprehensive guide to integration, series, and multivariable calculus.", isbn: "ISBN-102-M" },
  { id: "B003", title: "Things Fall Apart", author: "Chinua Achebe", category: "Literature", available: 8, total: 12, cover: "https://picsum.photos/seed/things/400/600", description: "Classic African literature exploring the clash between traditional and colonial values.", isbn: "ISBN-882-X" },
];

const INITIAL_LOANS = [
  { id: "LOAN-101", bookTitle: "Organic Chemistry", author: "Marie Curie", borrowerName: "Alice Thompson", borrowerId: "GBHS26S001", borrowDate: "May 15, 2024", returnDate: "May 29, 2024", status: "Active", collectionCode: "IGN-882-X", avatar: "https://picsum.photos/seed/s1/100/100" },
  { id: "LOAN-102", bookTitle: "Calculus II", author: "Prof. Smith", borrowerName: "Bob Richards", borrowerId: "GBHS26S002", borrowDate: "May 10, 2024", returnDate: "May 24, 2024", status: "Overdue", collectionCode: "IGN-102-M", avatar: "https://picsum.photos/seed/s2/100/100" }
];

const MOCK_MEMBERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", avatar: "https://picsum.photos/seed/s1/100/100", borrowed: 2, overdue: 0, returned: 12, class: "Form 5" },
  { id: "S002", name: "Bob Richards", role: "STUDENT", avatar: "https://picsum.photos/seed/s2/100/100", borrowed: 1, overdue: 1, returned: 8, class: "Upper Sixth" },
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

  const [policyData, setPolicyData] = useState({
    loanDuration: "14",
    dailyFine: "500",
    maxBooks: "3",
    gracePeriod: "2",
    lostBookPenalty: "15000"
  });

  const isLibrarian = user?.role === "LIBRARIAN";
  const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
  const isSubAdmin = user?.role === "SUB_ADMIN";
  const isManagement = isLibrarian || isSchoolAdmin || isSubAdmin;

  const [newBookData, setNewBookData] = useState({
    title: "",
    author: "",
    category: "Literature",
    isbn: "",
    total: 5,
    description: "",
    cover: "https://picsum.photos/seed/newbook/400/600"
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setNewBookData(prev => ({ ...prev, cover: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

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
            <p className="text-muted-foreground mt-1 text-sm">
              {isManagement 
                ? "Monitor circulation, manage catalog records, and audit membership."
                : "Explore the institutional catalog and track your borrowed volumes."}
            </p>
          </div>
        </div>
        
        {isLibrarian && (
          <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
            <DialogTrigger asChild><Button className="gap-2 shadow-lg h-11 rounded-xl"><Plus className="w-4 h-4" /> Add Volume</Button></DialogTrigger>
            <DialogContent className="sm:max-w-xl w-[95vw] sm:w-full rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
              <DialogHeader className="bg-primary p-6 md:p-8 text-white relative shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><BookMarked className="w-8 h-8 text-secondary" /></div>
                  <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight">Catalog Entry</DialogTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsAddingBook(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-all"><X className="w-6 h-6" /></Button>
              </DialogHeader>
              <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto scrollbar-thin bg-white">
                <div className="space-y-4">
                  <div className="group relative w-32 h-48 mx-auto bg-accent/20 rounded-xl border-2 border-dashed border-accent flex items-center justify-center cursor-pointer overflow-hidden shadow-inner transition-all hover:border-primary" onClick={() => coverInputRef.current?.click()}>
                    <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
                    {newBookData.cover ? <img src={newBookData.cover} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="w-8 h-8 text-muted-foreground" />}
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-sm">
                      <Upload className="w-5 h-5" />
                      <span className="text-[8px] font-black uppercase">Change Cover</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Book Title</Label>
                    <Input value={newBookData.title} onChange={(e) => setNewBookData({...newBookData, title: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" placeholder="e.g. Things Fall Apart" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Author</Label>
                    <Input value={newBookData.author} onChange={(e) => setNewBookData({...newBookData, author: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" placeholder="Chinua Achebe" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">ISBN Reference</Label>
                    <Input value={newBookData.isbn} onChange={(e) => setNewBookData({...newBookData, isbn: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" placeholder="ISBN-XXX-X" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Category</Label>
                    <Select value={newBookData.category} onValueChange={(v) => setNewBookData({...newBookData, category: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Literature">Literature</SelectItem>
                        <SelectItem value="Science">Science & Tech</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="History">History & Geo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Total Stock</Label>
                    <Input type="number" value={newBookData.total} onChange={(e) => setNewBookData({...newBookData, total: parseInt(e.target.value)})} className="h-12 bg-accent/30 border-none rounded-xl font-black" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Book Synopsis</Label>
                    <Textarea value={newBookData.description} onChange={(e) => setNewBookData({...newBookData, description: e.target.value})} className="min-h-[100px] bg-accent/30 border-none rounded-xl" placeholder="Brief summary of the volume..." />
                  </div>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t border-accent shrink-0 flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setIsAddingBook(false)}>Cancel</Button>
                <Button onClick={handleAddBook} disabled={isProcessing || !newBookData.title} className="flex-1 h-12 rounded-xl shadow-xl font-black uppercase tracking-widest text-[10px] gap-2">
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit to Catalog
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
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-blue-600">Total Volumes</p>
                <Book className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-700">{books.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-purple-600">Active Loans</p>
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-700">{loans.length}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-emerald-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-emerald-600">Compliance</p>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700">92%</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase opacity-60">Revenue (Fines)</p>
                <Coins className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-3xl font-black text-secondary">42,500 <span className="text-xs">XAF</span></div>
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
          {isManagement && (
            <TabsTrigger value="circulation" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Clock className="w-4 h-4" /> Circulation</TabsTrigger>
          )}
          <TabsTrigger value="history" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><History className="w-4 h-4" /> {isManagement ? "Registry" : "My History"}</TabsTrigger>
          {isLibrarian && (
            <TabsTrigger value="policy" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Settings2 className="w-4 h-4" /> Policy</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="catalog" className="mt-0 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search catalog by title or author..." className="pl-10 h-12 bg-white border-none rounded-2xl shadow-sm focus-visible:ring-primary" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all rounded-3xl">
                <div className="aspect-[3/4] bg-accent/20 relative overflow-hidden">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 backdrop-blur-md text-primary font-black text-[9px] border-none px-3">{book.category}</Badge>
                  </div>
                </div>
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-lg font-black text-primary truncate leading-tight">{book.title}</CardTitle>
                  <CardDescription className="text-xs font-bold text-muted-foreground">{book.author}</CardDescription>
                </CardHeader>
                <CardContent className="px-5 py-2">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground/60">
                      <span>Available</span>
                      <span className="text-primary">{book.available} / {book.total}</span>
                   </div>
                   <Progress value={(book.available / (book.total || 1)) * 100} className="h-1 mt-1.5" />
                </CardContent>
                <CardFooter className="p-5 pt-2">
                  <Button className="w-full h-10 text-[10px] font-black uppercase tracking-widest shadow-lg rounded-xl" disabled={book.available === 0}>
                    <BookMarked className="w-3.5 h-3.5 mr-2" /> {isManagement ? "View Stock" : "Borrow Volume"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {isManagement && (
          <TabsContent value="circulation" className="mt-0">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-6 md:p-8 text-white">
                <CardTitle className="text-xl font-black uppercase">Active Circulation Ledger</CardTitle>
                <CardDescription className="text-white/60">Real-time tracking of loaned volumes across the node.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 uppercase text-[9px] font-black">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Loan ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Volume Title</TableHead>
                      <TableHead className="text-center">Return Date</TableHead>
                      <TableHead className="text-right pr-8">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.map(loan => (
                      <TableRow key={loan.id} className="hover:bg-accent/5 h-16 border-b border-accent/10">
                        <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{loan.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border shrink-0"><AvatarImage src={loan.avatar} /><AvatarFallback>{loan.borrowerName.charAt(0)}</AvatarFallback></Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs uppercase">{loan.borrowerName}</span>
                              <span className="text-[8px] font-mono opacity-40">{loan.borrowerId}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-xs uppercase text-primary">{loan.bookTitle}</TableCell>
                        <TableCell className="text-center font-mono text-[10px] font-bold">{loan.returnDate}</TableCell>
                        <TableCell className="text-right pr-8">
                          <Badge className={cn(
                            "text-[8px] font-black uppercase px-2.5 h-5 border-none",
                            loan.status === 'Active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {loan.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="history" className="mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase">{isManagement ? "Node Accession Registry" : "My Borrowing History"}</CardTitle>
                <CardDescription>Chronological record of library interactions.</CardDescription>
              </div>
              {isManagement && (
                <Button variant="outline" className="rounded-xl h-10 gap-2 font-bold bg-white" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" /> Print Registry
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Transaction Code</TableHead>
                    <TableHead>Volume Details</TableHead>
                    {isManagement && <TableHead>Member</TableHead>}
                    <TableHead className="text-center">Timeline</TableHead>
                    <TableHead className="text-right pr-8">Final Integrity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isManagement ? (
                    MOCK_MEMBERS.map(m => (
                      <TableRow key={m.id} className="hover:bg-accent/5 h-16 border-b">
                        <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">MEM-{m.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border shrink-0"><AvatarImage src={m.avatar} /><AvatarFallback>{m.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs uppercase">{m.name}</span>
                              <span className="text-[8px] font-black text-muted-foreground uppercase">{m.class}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                           <div className="inline-flex gap-4">
                              <div className="text-center">
                                <p className="text-[8px] font-black opacity-40">LOANS</p>
                                <p className="font-black text-xs">{m.borrowed}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] font-black opacity-40">RETURNED</p>
                                <p className="font-black text-xs">{m.returned}</p>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="text-center">
                           <Badge variant="outline" className="text-[8px] font-bold border-primary/10">ACTIVE MEMBER</Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5"><Eye className="w-4 h-4 text-primary/40"/></Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center text-muted-foreground italic">No personal history found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isLibrarian && (
          <TabsContent value="policy" className="mt-0 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary p-8 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl"><Gavel className="w-8 h-8 text-secondary" /></div>
                    <div>
                      <CardTitle className="text-2xl font-black uppercase">Circulation Policy</CardTitle>
                      <CardDescription className="text-white/60">Configure global library rules and penalties.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Loan Duration (Days)</Label>
                      <Input type="number" value={policyData.loanDuration} onChange={(e) => setPolicyData({...policyData, loanDuration: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-black text-xl text-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Daily Overdue Fine (XAF)</Label>
                      <Input type="number" value={policyData.dailyFine} onChange={(e) => setPolicyData({...policyData, dailyFine: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-black text-xl text-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Max Volumes per Member</Label>
                      <Input type="number" value={policyData.maxBooks} onChange={(e) => setPolicyData({...policyData, maxBooks: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-black text-xl text-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Lost Volume Penalty (XAF)</Label>
                      <Input type="number" value={policyData.lostBookPenalty} onChange={(e) => setPolicyData({...policyData, lostBookPenalty: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-black text-xl text-primary" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/20 p-8 border-t border-accent">
                  <Button className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3" onClick={() => toast({ title: "Policy Synchronized" })}>
                    <Save className="w-5 h-5" /> Commit Node Policy
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-sm rounded-[2rem] bg-amber-50 p-8 space-y-6">
                 <div className="flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-amber-600" />
                    <h4 className="text-sm font-black text-amber-900 uppercase">Integrity Notice</h4>
                 </div>
                 <p className="text-[11px] leading-relaxed text-amber-800 font-medium italic">
                   "Changes to library policy reflect immediately across all institutional nodes. Members with active overdue loans will be recalculated based on updated fine structures."
                 </p>
                 <div className="pt-6 border-t border-amber-100 flex flex-col items-center gap-4 text-center">
                    <QrCode className="w-20 h-20 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Registry Node</p>
                 </div>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
