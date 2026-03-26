
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Library, 
  Search, 
  Book, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Building2,
  User,
  MapPin,
  QrCode,
  Loader2,
  Bookmark,
  Info,
  BookOpen,
  Settings2,
  Coins,
  AlertCircle,
  Save,
  Users,
  Plus,
  Pencil,
  Trash2,
  Eye,
  FileText,
  FileDown,
  ArrowUpRight,
  CheckCircle,
  ArrowLeftRight,
  Gavel,
  ShieldAlert,
  CalendarClock,
  History,
  Signature,
  X,
  BookMarked,
  Filter,
  BarChart3,
  TrendingUp,
  Receipt
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

// Mock Data for Books
const INITIAL_BOOKS = [
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/400/600", description: "In-depth study of thermodynamics and classical mechanics for advanced students.", isbn: "ISBN-922-X" },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/400/600", description: "Comprehensive guide to integration, series, and multivariable calculus.", isbn: "ISBN-102-M" },
  { id: "B003", title: "Things Fall Apart", author: "Chinua Achebe", category: "Literature", available: 12, total: 15, cover: "https://picsum.photos/seed/lit1/400/600", description: "A classic of modern African literature.", isbn: "ISBN-882-L" },
  { id: "B004", title: "Organic Chemistry", author: "Marie Curie", category: "Science", available: 0, total: 8, cover: "https://picsum.photos/seed/chem/400/600", description: "Study of carbon compounds and biological molecules.", isbn: "ISBN-005-C" },
];

const INITIAL_LOANS = [
  { id: "LOAN-101", bookTitle: "Organic Chemistry", author: "Marie Curie", borrowerName: "Alice Thompson", borrowerId: "S001", borrowDate: "May 15, 2024", returnDate: "May 29, 2024", status: "Active", collectionCode: "IGN-882-X" }
];

const MOCK_STUDENT_HISTORY = [
  { id: "H1", bookTitle: "Things Fall Apart", author: "Chinua Achebe", borrowDate: "Jan 10, 2024", returnDate: "Jan 24, 2024", status: "Returned", code: "IGN-102-A" },
  { id: "H2", bookTitle: "Advanced Physics", author: "Dr. Tesla", borrowDate: "Dec 05, 2023", returnDate: "Dec 19, 2023", status: "Returned", code: "IGN-405-B" },
  { id: "H3", bookTitle: "Calculus I", author: "Prof. Smith", borrowDate: "Nov 12, 2023", returnDate: "Nov 26, 2023", status: "Returned", code: "IGN-991-Z" },
];

const MOCK_REQUESTS = [
  { id: "REQ-001", userId: "GBHS26S001", userName: "Alice Thompson", userRole: "STUDENT", userAvatar: "https://picsum.photos/seed/s1/100/100", bookTitle: "Things Fall Apart", bookAuthor: "Chinua Achebe", requestDate: "Today, 11:00 AM" }
];

const MOCK_MEMBERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", avatar: "https://picsum.photos/seed/s1/100/100", borrowed: 2, overdue: 0, returned: 12 },
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", avatar: "https://picsum.photos/seed/t1/100/100", borrowed: 5, overdue: 1, returned: 45 },
];

export default function LibraryPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modals
  const [selectedLoanDetails, setSelectedLoanDetails] = useState<any>(null);
  const [issuedReceipt, setIssuedReceipt] = useState<any>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

  // Policy State
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
  const isAdmin = isSchoolAdmin || isSubAdmin;
  const isManagement = isLibrarian || isAdmin;
  
  const isStudent = user?.role === "STUDENT";
  const isTeacher = user?.role === "TEACHER";
  const isPersonal = isStudent || isTeacher;

  const handleIssueBook = (req: any) => {
    // Calculate due date based on current policy
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(policyData.loanDuration));

    const receipt = {
      id: `IGN-L-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userName: req.userName,
      userId: req.userId || "S001",
      userRole: req.userRole,
      bookTitle: req.bookTitle,
      bookAuthor: req.bookAuthor,
      collectionCode: `IGN-${Math.floor(100 + Math.random() * 899)}-X`,
      issueDate: new Date().toLocaleDateString(),
      dueDate: dueDate.toLocaleDateString(),
    };

    setIssuedReceipt(receipt);
    setRequests(requests.filter(r => r.id !== req.id));
    toast({ title: "Resource Issued", description: "Collection receipt has been generated." });
  };

  const handleReturnBook = (id: string) => {
    setLoans(loans.filter(l => l.id !== id));
    toast({ title: "Book Returned", description: "Inventory stock updated." });
  };

  const handleAddBook = () => {
    if (!newBookData.title || !newBookData.author) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created = {
        ...newBookData,
        id: `B-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        available: newBookData.total
      };
      setBooks([created, ...books]);
      setIsProcessing(false);
      setIsAddingBook(false);
      setNewBookData({ title: "", author: "", category: "Literature", isbn: "", total: 5, description: "", cover: "https://picsum.photos/seed/newbook/400/600" });
      toast({ title: "Catalog Updated", description: `${created.title} added to collection.` });
    }, 800);
  };

  const handleSavePolicy = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Policy Synchronized",
        description: "Library circulation parameters updated.",
      });
    }, 1000);
  };

  const [newBookData, setNewBookData] = useState({
    title: "",
    author: "",
    category: "Literature",
    isbn: "",
    total: 5,
    description: "",
    cover: "https://picsum.photos/seed/newbook/400/600"
  });

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Library className="w-6 h-6 text-secondary" />
            </div>
            {isManagement ? "Institutional Library Suite" : t("library")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isManagement ? "Strategic oversight of school resources, circulation, and memberships." : "Manage your collection and academic resource loans."}
          </p>
        </div>
        
        {isManagement && (
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 rounded-xl h-11 border-primary/10" onClick={() => toast({ title: "Generating Report..." })}>
              <Printer className="w-4 h-4" /> Export Catalog
            </Button>
            {isLibrarian && (
              <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-lg h-11 rounded-xl bg-primary text-white">
                    <Plus className="w-4 h-4" /> Add Volume
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                  <DialogHeader className="bg-primary p-8 text-white">
                    <DialogTitle className="text-2xl font-black">Catalog Entry</DialogTitle>
                    <DialogDescription className="text-white/60">Initialize a new resource into the institutional collection.</DialogDescription>
                  </DialogHeader>
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                        <Label>Book Title</Label>
                        <Input value={newBookData.title} onChange={(e) => setNewBookData({...newBookData, title: e.target.value})} className="h-11 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Author</Label>
                        <Input value={newBookData.author} onChange={(e) => setNewBookData({...newBookData, author: e.target.value})} className="h-11 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>ISBN / Ref Code</Label>
                        <Input value={newBookData.isbn} onChange={(e) => setNewBookData({...newBookData, isbn: e.target.value})} className="h-11 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={newBookData.category} onValueChange={(v) => setNewBookData({...newBookData, category: v})}>
                          <SelectTrigger className="h-11 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Literature">Literature</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Total Volumes</Label>
                        <Input type="number" value={newBookData.total} onChange={(e) => setNewBookData({...newBookData, total: parseInt(e.target.value)})} className="h-11 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Pedagogical Description</Label>
                        <Textarea value={newBookData.description} onChange={(e) => setNewBookData({...newBookData, description: e.target.value})} className="bg-accent/30 border-none rounded-xl min-h-[100px]" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                    <Button onClick={handleAddBook} disabled={isProcessing} className="w-full h-12 shadow-lg font-bold">
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Archive Volume"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>

      {isManagement && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-blue-600">Total Volumes</p>
                <Book className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-700">{books.length * 12}</div>
              <p className="text-[9px] font-bold text-blue-600/60 uppercase mt-1">Across {books.length} titles</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-green-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-green-600">Active Loans</p>
                <ArrowLeftRight className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-3xl font-black text-green-700">{loans.length}</div>
              <p className="text-[9px] font-bold text-green-600/60 uppercase mt-1">Institutional Circulation</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-amber-600">Overdue Items</p>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-700">2</div>
              <p className="text-[9px] font-bold text-amber-600/60 uppercase mt-1">Requires follow-up</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-purple-600">Fine Revenue</p>
                <Coins className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-700">12,500 <span className="text-xs">XAF</span></div>
              <p className="text-[9px] font-bold text-purple-600/60 uppercase mt-1">Collected Term-to-date</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className={cn(
          "grid w-full bg-white shadow-sm border h-auto p-1 rounded-2xl",
          isManagement ? "grid-cols-5 md:w-[1000px]" : "grid-cols-3 md:w-[600px]"
        )}>
          <TabsTrigger value="catalog" className="gap-2 py-3 rounded-xl transition-all">
            <BookOpen className="w-4 h-4" /> {language === 'en' ? 'Catalog' : 'Catalogue'}
          </TabsTrigger>
          {isManagement && (
            <TabsTrigger value="requests" className="gap-2 py-3 rounded-xl transition-all">
              <ArrowUpRight className="w-4 h-4" /> {language === 'en' ? 'Issue Queue' : 'File d\'Attente'}
            </TabsTrigger>
          )}
          <TabsTrigger value="circulation" className="gap-2 py-3 rounded-xl transition-all">
            <Clock className="w-4 h-4" /> {isManagement ? (language === 'en' ? 'Circulation' : 'Circulation') : t("borrowed")}
          </TabsTrigger>
          {isPersonal && (
            <TabsTrigger value="history" className="gap-2 py-3 rounded-xl transition-all">
              <History className="w-4 h-4" /> {t("libraryHistory")}
            </TabsTrigger>
          )}
          {isManagement && (
            <>
              <TabsTrigger value="members" className="gap-2 py-3 rounded-xl transition-all">
                <Users className="w-4 h-4" /> Members
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 py-3 rounded-xl transition-all">
                <Settings2 className="w-4 h-4" /> Policy
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="catalog" className="mt-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search catalog by title, author, or category..." 
                className="pl-10 border-none bg-accent/20 focus-visible:ring-0 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl"><Filter className="w-4 h-4 text-primary" /></Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="border-none shadow-sm flex flex-col group overflow-hidden bg-white/50 hover:shadow-md transition-shadow">
                <div className="aspect-[3/4] relative overflow-hidden bg-accent/20">
                   <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                      <Badge className={cn("uppercase text-[9px] font-black border-none", book.available > 0 ? "bg-green-600 text-white" : "bg-red-600 text-white")}>
                        {book.available > 0 ? `${book.available} In Stock` : "Unavailable"}
                      </Badge>
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-md text-primary border-none text-[8px] font-mono">
                        {book.isbn}
                      </Badge>
                   </div>
                </div>
                <CardHeader className="p-5 flex-1">
                  <Badge variant="secondary" className="w-fit text-[8px] font-black uppercase tracking-widest bg-primary/5 text-primary border-none mb-2">{book.category}</Badge>
                  <CardTitle className="text-lg font-black text-primary leading-tight">{book.title}</CardTitle>
                  <CardDescription className="text-xs font-bold text-muted-foreground italic">By {book.author}</CardDescription>
                </CardHeader>
                <CardFooter className="p-5 pt-0 gap-2">
                  {isLibrarian ? (
                    <div className="flex w-full gap-2">
                      <Button variant="outline" className="flex-1 h-10 text-[10px] font-black uppercase" onClick={() => setEditingBook(book)}>
                        <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 text-red-400 hover:text-red-600" onClick={() => setBooks(books.filter(b => b.id !== book.id))}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full h-11 text-xs uppercase font-black tracking-widest bg-primary hover:bg-primary/90 shadow-sm" disabled={book.available === 0}>
                      {book.available > 0 ? "Borrow This Book" : "Notify When Back"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {isManagement && (
          <TabsContent value="requests" className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
              <CardHeader className="bg-white border-b p-6">
                <CardTitle className="text-lg font-black text-primary uppercase tracking-widest">Active Requests Queue</CardTitle>
                <CardDescription>Verify borrower identity and confirm physical resource issue.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-accent/30 uppercase text-[10px] font-black tracking-widest">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Requester Profile</TableHead>
                      <TableHead>Target Resource</TableHead>
                      <TableHead className="text-center">Request Date</TableHead>
                      <TableHead className="text-right pr-8">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req.id} className="hover:bg-accent/5 border-b border-accent/10">
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <AvatarImage src={req.userAvatar} />
                              <AvatarFallback className="bg-primary/5 text-primary text-xs">{req.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-primary">{req.userName}</span>
                              <Badge variant="outline" className="text-[8px] h-4 w-fit uppercase border-none bg-blue-50 text-blue-700">{req.userRole}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm font-black text-primary uppercase leading-none">{req.bookTitle}</p>
                            <p className="text-[10px] text-muted-foreground italic">By {req.bookAuthor}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-[10px] font-bold text-muted-foreground">{req.requestDate}</TableCell>
                        <TableCell className="text-right pr-8">
                          <Button className="h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg" onClick={() => handleIssueBook(req)}>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Confirm Issue
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="circulation" className="mt-8">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b flex flex-row items-center justify-between p-6">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase tracking-widest">
                  {isManagement ? 'Global Circulation Ledger' : 'My Active Loans'}
                </CardTitle>
                <CardDescription>Live tracking of institutional pedagogical assets.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest border-primary/10">
                <FileDown className="w-3.5 h-3.5 mr-2" /> Download Ledger
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30 uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                  <TableRow>
                    <TableHead className="pl-8 py-4">{isManagement ? 'Borrower' : 'Resource'}</TableHead>
                    <TableHead>{isManagement ? 'Resource' : 'Reference'}</TableHead>
                    <TableHead className="text-center">Due Date</TableHead>
                    <TableHead className="text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                      <TableCell className="pl-8 py-4">
                        <p className="font-bold text-sm text-primary">{isManagement ? loan.borrowerName : loan.bookTitle}</p>
                        {isManagement && <p className="text-[10px] font-mono text-muted-foreground uppercase">{loan.borrowerId}</p>}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs font-bold">{isManagement ? loan.bookTitle : loan.collectionCode}</p>
                          <p className="text-[10px] text-muted-foreground italic">By {loan.author}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs font-black text-secondary">{loan.returnDate}</TableCell>
                      <TableCell className="text-right pr-8">
                        {isLibrarian ? (
                          <Button size="sm" className="h-8 px-4 rounded-lg bg-green-600 text-white text-[9px] font-black uppercase shadow-sm" onClick={() => handleReturnBook(loan.id)}>
                            Mark Returned
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase" onClick={() => setSelectedLoanDetails({ ...loan, cover: INITIAL_BOOKS.find(b => b.title === loan.bookTitle)?.cover || INITIAL_BOOKS[0].cover })}>
                            View Dossier
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isPersonal && (
          <TabsContent value="history" className="mt-8">
            <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
              <CardHeader className="bg-primary p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <History className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black">{t("libraryHistory")}</CardTitle>
                    <CardDescription className="text-white/60">Digital logs of your past library interactions and verified returns.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                      <TableHead className="pl-8 py-4">Resource Portfolio</TableHead>
                      <TableHead className="text-center">{t("dateBorrowed")}</TableHead>
                      <TableHead className="text-center">{t("dateReturned")}</TableHead>
                      <TableHead className="text-center">Ref. Code</TableHead>
                      <TableHead className="text-right pr-8">Integrity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENT_HISTORY.map((hist) => (
                      <TableRow key={hist.id} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                              <BookOpen className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-primary">{hist.bookTitle}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">{hist.author}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs font-bold text-muted-foreground">{hist.borrowDate}</TableCell>
                        <TableCell className="text-center font-mono text-xs font-bold text-primary">{hist.returnDate}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono text-[9px] uppercase border-primary/10">{hist.code}</Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 font-bold text-[9px] uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {hist.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center">
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                    <p className="text-[10px] uppercase font-black tracking-widest italic opacity-40">All past transactions are digitally signed and archived.</p>
                 </div>
                 <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase">
                   <Printer className="w-3.5 h-3.5" /> Print Statement
                 </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        {isManagement && (
          <>
            <TabsContent value="members" className="mt-8">
              <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
                <CardHeader className="bg-white border-b p-6 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black text-primary uppercase tracking-widest">Institutional Member Audit</CardTitle>
                    <CardDescription>Track borrowing behavior and policy compliance.</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input placeholder="Find member..." className="pl-9 h-9 bg-accent/20 border-none rounded-lg text-xs" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-accent/30 uppercase text-[10px] font-black tracking-widest">
                      <TableRow>
                        <TableHead className="pl-8 py-4">Member Profile</TableHead>
                        <TableHead className="text-center">Active Loans</TableHead>
                        <TableHead className="text-center">Overdue</TableHead>
                        <TableHead className="text-center">Lifetime Returns</TableHead>
                        <TableHead className="text-right pr-8">Compliance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_MEMBERS.map((member) => (
                        <TableRow key={member.id} className="hover:bg-accent/5 border-b border-accent/10">
                          <TableCell className="pl-8 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-sm text-primary leading-tight">{member.name}</p>
                                <p className="text-[9px] uppercase font-black opacity-40">{member.role} • {member.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-black text-primary">{member.borrowed}</TableCell>
                          <TableCell className="text-center font-black text-red-600">{member.overdue}</TableCell>
                          <TableCell className="text-center font-bold text-muted-foreground">{member.returned}</TableCell>
                          <TableCell className="text-right pr-8">
                            <Badge className={cn(
                              "text-[8px] font-black uppercase px-2 border-none h-5",
                              member.overdue > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            )}>
                              {member.overdue > 0 ? 'Restricted' : 'In Good Standing'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
                    <CardHeader className="bg-primary p-8 text-white">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl">
                          <Gavel className="w-8 h-8 text-secondary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-black">Circulation Governance</CardTitle>
                          <CardDescription className="text-white/60">Configure institutional borrowing limits and academic timelines.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                            <CalendarClock className="w-3.5 h-3.5 text-primary" /> Standard Loan Duration (Days)
                          </Label>
                          <Input 
                            type="number" 
                            value={policyData.loanDuration}
                            onChange={(e) => setPolicyData({...policyData, loanDuration: e.target.value})}
                            className="h-12 bg-accent/30 border-none rounded-xl font-black text-primary text-lg"
                            disabled={!isLibrarian}
                          />
                          <p className="text-[9px] text-muted-foreground italic">Institutional lending window before penalty.</p>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                            <Coins className="w-3.5 h-3.5 text-amber-600" /> Daily Overdue Fine (XAF)
                          </Label>
                          <Input 
                            type="number" 
                            value={policyData.dailyFine}
                            onChange={(e) => setPolicyData({...policyData, dailyFine: e.target.value})}
                            className="h-12 bg-accent/30 border-none rounded-xl font-black text-primary text-lg"
                            disabled={!isLibrarian}
                          />
                          <p className="text-[9px] text-muted-foreground italic">Automated charge per missed day.</p>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                            <BookMarked className="w-3.5 h-3.5 text-blue-600" /> Max Concurrent Loans
                          </Label>
                          <Input 
                            type="number" 
                            value={policyData.maxBooks}
                            onChange={(e) => setPolicyData({...policyData, maxBooks: e.target.value})}
                            className="h-12 bg-accent/30 border-none rounded-xl font-black text-primary text-lg"
                            disabled={!isLibrarian}
                          />
                          <p className="text-[9px] text-muted-foreground italic">Borrowing ceiling per individual account.</p>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Loss Indemnity Charge (XAF)
                          </Label>
                          <Input 
                            type="number" 
                            value={policyData.lostBookPenalty}
                            onChange={(e) => setPolicyData({...policyData, lostBookPenalty: e.target.value})}
                            className="h-12 bg-accent/30 border-none rounded-xl font-black text-primary text-lg"
                            disabled={!isLibrarian}
                          />
                          <p className="text-[9px] text-muted-foreground italic">Replacement cost for unrecoverable items.</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-accent/20 p-6 border-t border-accent flex justify-end">
                      <Button 
                        className="h-12 px-10 rounded-xl shadow-lg font-black uppercase tracking-widest text-xs gap-2 bg-primary text-white"
                        onClick={handleSavePolicy}
                        disabled={isProcessing || !isLibrarian}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Commit Institutional Policy
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-none shadow-sm bg-blue-50 p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-100">
                        <Info className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="text-xs font-black uppercase text-blue-700 tracking-widest">Integrity Notice</h4>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium italic">
                      "Changes to borrowing parameters are recorded in the institutional audit log. Active loans retain their original terms, while new transactions will adhere to the updated policy framework."
                    </p>
                    <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-blue-600/40">Status</span>
                       <Badge className="bg-blue-600 text-white border-none text-[8px] h-4">SYNCED</Badge>
                    </div>
                  </Card>

                  <div className="p-10 rounded-[2.5rem] bg-white border border-accent shadow-inner text-center space-y-4">
                    <QrCode className="w-24 h-24 mx-auto text-primary opacity-10" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Node Policy ID</p>
                      <Badge variant="outline" className="font-mono text-primary text-[10px] border-primary/10">POL-LIB-2024-X</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* COLLECTION RECEIPT DIALOG (GEREATED UPON ISSUE) */}
      <Dialog open={!!issuedReceipt} onOpenChange={() => setIssuedReceipt(null)}>
        <DialogContent className="sm:max-w-xl p-0 border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <DialogHeader className="bg-primary p-8 text-white no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Receipt className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black">Collection Receipt</DialogTitle>
                  <DialogDescription className="text-white/60">Official institutional loan record finalized.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIssuedReceipt(null)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-6 md:p-10 print:p-0 print:bg-white overflow-hidden">
            <div id="printable-receipt" className="bg-white p-8 border-2 border-black/10 shadow-sm relative flex flex-col space-y-6 font-serif text-black print:border-none print:shadow-none">
               {/* Receipt Header */}
               <div className="flex justify-between items-start border-b-2 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <img src={user?.school?.logo} alt="School" className="w-12 h-12 object-contain" />
                    <div className="space-y-0.5">
                      <h2 className="font-black text-xs uppercase text-primary leading-tight">{user?.school?.name}</h2>
                      <p className="text-[8px] font-bold uppercase opacity-60">Library Services Registry</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase opacity-40">Receipt No.</p>
                    <p className="text-sm font-mono font-black">{issuedReceipt?.id}</p>
                  </div>
               </div>

               {/* Borrower & Book Matrix */}
               <div className="grid grid-cols-2 gap-8 py-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Borrower Identity</p>
                      <p className="font-black text-sm uppercase">{issuedReceipt?.userName}</p>
                      <p className="text-[9px] font-mono font-bold text-primary">{issuedReceipt?.userId} • {issuedReceipt?.userRole}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Collection Resource</p>
                      <p className="font-black text-sm uppercase">{issuedReceipt?.bookTitle}</p>
                      <p className="text-[9px] font-bold italic">By {issuedReceipt?.bookAuthor}</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-right">
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Issue Date</p>
                      <p className="font-bold text-sm">{issuedReceipt?.issueDate}</p>
                    </div>
                    <div className="p-3 bg-primary text-white rounded-xl shadow-inner">
                      <p className="text-[8px] font-black uppercase opacity-60 tracking-widest">Mandatory Due Date</p>
                      <p className="font-black text-lg text-secondary underline underline-offset-4 decoration-double">{issuedReceipt?.dueDate}</p>
                    </div>
                  </div>
               </div>

               {/* Institutional Footprint */}
               <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                  <div className="flex flex-col items-center gap-2">
                    <QrCode className="w-16 h-16 opacity-10" />
                    <p className="text-[7px] font-black uppercase text-muted-foreground opacity-40">Verified Registry</p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="h-10 w-24 mx-auto bg-primary/5 rounded border-b border-black/20" />
                    <p className="text-[8px] font-black uppercase text-primary">Librarian Signature</p>
                  </div>
               </div>

               {/* Notice */}
               <div className="bg-accent/30 p-3 rounded-lg text-[8px] leading-relaxed italic text-muted-foreground border border-accent">
                 "This resource is public property. Failure to return the item by the due date ({issuedReceipt?.dueDate}) will result in institutional fines of {policyData.dailyFine} XAF per day. Take care of the volume."
               </div>

               <div className="text-center pt-4 border-t border-black/5">
                  <div className="flex items-center justify-center gap-2">
                    <img src={platformSettings.logo} alt="EduIgnite" className="w-3 h-3 object-contain opacity-20" />
                    <p className="text-[7px] font-black uppercase text-muted-foreground opacity-30 tracking-[0.3em]">
                      Powered by {platformSettings.name} • Secure Node Record
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t no-print flex sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-xs" onClick={() => setIssuedReceipt(null)}>
              Dismiss
            </Button>
            <Button className="flex-1 rounded-xl h-12 shadow-lg font-black uppercase tracking-widest text-xs gap-2 bg-primary text-white" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESOURCE DOSSIER DIALOG (READ-ONLY) */}
      <Dialog open={!!selectedLoanDetails} onOpenChange={() => setSelectedLoanDetails(null)}>
        <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <BookOpen className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">Resource Dossier</DialogTitle>
                <DialogDescription className="text-white/60">Official collection tracking and pedagogical details.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedLoanDetails(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          
          <div className="p-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-accent/30 transition-transform hover:scale-105 duration-500">
               <img src={selectedLoanDetails?.cover} alt={selectedLoanDetails?.bookTitle} className="w-full h-full object-cover" />
            </div>
            
            <div className="md:col-span-8 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest">
                    {selectedLoanDetails?.category}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] border-primary/10 font-mono">{selectedLoanDetails?.isbn}</Badge>
                </div>
                <h2 className="text-3xl font-black text-primary leading-tight uppercase tracking-tight">{selectedLoanDetails?.bookTitle}</h2>
                <p className="text-sm font-bold text-muted-foreground italic flex items-center gap-2">
                  <User className="w-4 h-4" /> Authored by {selectedLoanDetails?.author}
                </p>
              </div>

              <div className="space-y-3 bg-accent/20 p-6 rounded-2xl border border-accent">
                <Label className="text-[10px] font-black uppercase text-primary/40 tracking-[0.2em] flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Pedagogical Summary
                </Label>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium italic">
                  "{selectedLoanDetails?.description || "This resource is an essential component of the institution's curriculum, specifically curated for advanced sequence study."}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-accent/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <QrCode className="w-3.5 h-3.5" /> Registry Code
                  </p>
                  <p className="text-lg font-mono font-black text-primary">{selectedLoanDetails?.collectionCode}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2 justify-end">
                    <Clock className="w-3.5 h-3.5 text-secondary" /> Due Window
                  </p>
                  <p className="text-lg font-black text-secondary">{selectedLoanDetails?.returnDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center">
             <div className="flex items-center gap-3 text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40 leading-none">Institutional Asset</p>
                  <p className="text-[8px] font-bold text-primary/40 uppercase leading-none">Verified Node Sync Active</p>
                </div>
             </div>
             <p className="text-[10px] font-black text-primary/60 uppercase tracking-tighter">Electronic Portfolio • {new Date().getFullYear()}</p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT BOOK DIALOG */}
      <Dialog open={!!editingBook} onOpenChange={() => setEditingBook(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <DialogTitle className="text-xl font-black">Edit Resource Record</DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-4">
            <div className="space-y-2">
              <Label>Update Stock (Total Volumes)</Label>
              <Input type="number" defaultValue={editingBook?.total} className="h-11 bg-accent/30 border-none rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Update Location / Shelf</Label>
              <Input placeholder="e.g. Science Wing A-4" className="h-11 bg-accent/30 border-none rounded-xl" />
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-12 rounded-xl shadow-lg font-bold" onClick={() => { setEditingBook(null); toast({ title: "Record Updated" }); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
