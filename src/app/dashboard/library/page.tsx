
"use client";

import { useState, useMemo, useRef } from "react";
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
];

const INITIAL_LOANS = [
  { id: "LOAN-101", bookTitle: "Organic Chemistry", author: "Marie Curie", borrowerName: "Alice Thompson", borrowerId: "GBHS26S001", borrowDate: "May 15, 2024", returnDate: "May 29, 2024", status: "Active", collectionCode: "IGN-882-X" }
];

const MOCK_PERSONAL_HISTORY = [
  { id: "H1", bookTitle: "Things Fall Apart", author: "Chinua Achebe", borrowDate: "Jan 10, 2024", returnDate: "Jan 24, 2024", status: "Returned", code: "IGN-102-A" },
];

const MOCK_REQUESTS = [
  { id: "REQ-001", userId: "GBHS26S001", userName: "Alice Thompson", userRole: "STUDENT", userAvatar: "https://picsum.photos/seed/s1/100/100", bookTitle: "Things Fall Apart", bookAuthor: "Chinua Achebe", requestDate: "Today, 11:00 AM" }
];

const MOCK_MEMBERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", avatar: "https://picsum.photos/seed/s1/100/100", borrowed: 2, overdue: 0, returned: 12 },
];

export default function LibraryPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [borrowingBookId, setBorrowingBookId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [selectedLoanDetails, setSelectedLoanDetails] = useState<any>(null);
  const [issuedReceipt, setIssuedReceipt] = useState<any>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [previewLibraryReport, setPreviewLibraryReport] = useState<any>(null);

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
  const isPersonal = user?.role === "STUDENT" || user?.role === "TEACHER";

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
              {isManagement ? "Library Suite" : t("library")}
            </h1>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-blue-600">Total Volumes</p>
                <Book className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-blue-700">{books.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full bg-white shadow-sm border h-auto p-1 rounded-2xl grid-cols-3 md:w-[600px]">
          <TabsTrigger value="catalog" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><BookOpen className="w-4 h-4" /> Catalogue</TabsTrigger>
          <TabsTrigger value="circulation" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Clock className="w-4 h-4" /> {t("borrowed")}</TabsTrigger>
          <TabsTrigger value="history" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><History className="w-4 h-4" /> Registry</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-8 space-y-6">
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
                   <Progress value={(book.available / book.total) * 100} className="h-1 mt-1.5" />
                </CardContent>
                <CardFooter className="p-5 pt-2">
                  <Button className="w-full h-10 text-[10px] font-black uppercase tracking-widest shadow-lg rounded-xl" disabled={book.available === 0}>
                    <BookMarked className="w-3.5 h-3.5 mr-2" /> Borrow Volume
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
