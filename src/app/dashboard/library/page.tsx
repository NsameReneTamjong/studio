"use client";

import { useState } from "react";
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
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data for Books
const INITIAL_BOOKS = [
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/400/600", description: "In-depth study of thermodynamics and classical mechanics for advanced students." },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/400/600", description: "Comprehensive guide to integration, series, and multivariable calculus." },
  { id: "B003", title: "Things Fall Apart", author: "Chinua Achebe", category: "Literature", available: 12, total: 15, cover: "https://picsum.photos/seed/lit1/400/600", description: "A classic of modern African literature." },
  { id: "B004", title: "Organic Chemistry", author: "Marie Curie", category: "Science", available: 0, total: 8, cover: "https://picsum.photos/seed/chem/400/600", description: "Study of carbon compounds and biological molecules." },
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
  { id: "REQ-001", userName: "Alice Thompson", userRole: "STUDENT", userAvatar: "https://picsum.photos/seed/s1/100/100", bookTitle: "Things Fall Apart", bookAuthor: "Chinua Achebe", requestDate: "Today, 11:00 AM" }
];

const MOCK_MEMBERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", avatar: "https://picsum.photos/seed/s1/100/100", borrowed: 2, overdue: 0, returned: 12 },
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", avatar: "https://picsum.photos/seed/t1/100/100", borrowed: 5, overdue: 1, returned: 45 },
];

export default function LibraryPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedLoanDetails, setSelectedLoanDetails] = useState<any>(null);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [isProcessing, setIsProcessing] = useState(false);

  // Policy State
  const [policyData, setPolicyData] = useState({
    loanDuration: "14",
    dailyFine: "500",
    maxBooks: "3",
    gracePeriod: "2",
    lostBookPenalty: "15000"
  });

  const isLibrarian = user?.role === "LIBRARIAN";
  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isStudent = user?.role === "STUDENT";

  const handleIssueBook = (id: string) => {
    if (!isLibrarian) return;
    toast({ title: "Book Issued", description: "Digital receipt generated." });
  };

  const handleReturnBook = (id: string) => {
    if (!isLibrarian) return;
    toast({ title: "Book Returned", description: "Stock updated." });
  };

  const handleSavePolicy = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Policy Synchronized",
        description: "Library rules and circulation parameters updated across the node.",
      });
    }, 1000);
  };

  const openLoanDetails = (loan: any) => {
    // Find matching book in catalog to get more details
    const bookInfo = INITIAL_BOOKS.find(b => b.title === loan.bookTitle);
    setSelectedLoanDetails({ ...loan, ...bookInfo });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Library className="w-6 h-6 text-secondary" />
            </div>
            {isAdmin ? "Library Supervision" : t("library")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Oversight of library circulation, memberships, and collection reports." : "Manage school collection and borrowing workflows."}
          </p>
        </div>
        {isLibrarian && (
          <Button className="gap-2 shadow-lg h-11 rounded-xl">
            <Plus className="w-4 h-4" /> Add New Book
          </Button>
        )}
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className={cn(
          "grid w-full bg-white shadow-sm border h-auto p-1 rounded-2xl",
          (isLibrarian || isAdmin) ? "grid-cols-5 md:w-[950px]" : "grid-cols-3 md:w-[600px]"
        )}>
          <TabsTrigger value="catalog" className="gap-2 py-3 rounded-xl transition-all">
            <Book className="w-4 h-4" /> {t("catalog") || 'Catalog'}
          </TabsTrigger>
          {(isLibrarian || isAdmin) && (
            <TabsTrigger value="issue" className="gap-2 py-3 rounded-xl transition-all">
              <ArrowUpRight className="w-4 h-4" /> {language === 'en' ? 'Issue Requests' : 'Demandes'}
            </TabsTrigger>
          )}
          <TabsTrigger value="borrowed" className="gap-2 py-3 rounded-xl transition-all">
            <Clock className="w-4 h-4" /> {isLibrarian || isAdmin ? (language === 'en' ? 'Circulation' : 'Circulation') : t("borrowed")}
          </TabsTrigger>
          {isStudent && (
            <TabsTrigger value="history" className="gap-2 py-3 rounded-xl transition-all">
              <History className="w-4 h-4" /> {t("libraryHistory")}
            </TabsTrigger>
          )}
          {(isLibrarian || isAdmin) && (
            <>
              <TabsTrigger value="members" className="gap-2 py-3 rounded-xl transition-all">
                <Users className="w-4 h-4" /> {language === 'en' ? 'Members' : 'Membres'}
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 py-3 rounded-xl transition-all">
                <Settings2 className="w-4 h-4" /> {language === 'en' ? 'Policy' : 'Politique'}
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="catalog" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <Card key={book.id} className="border-none shadow-sm flex flex-col group overflow-hidden bg-white/50">
                <div className="aspect-[3/4] relative overflow-hidden bg-accent/20">
                   <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                   <div className="absolute top-3 right-3">
                      <Badge className={cn("uppercase text-[10px]", book.available > 0 ? "bg-green-600" : "bg-red-600")}>
                        {book.available > 0 ? "Available" : "Out of Stock"}
                      </Badge>
                   </div>
                </div>
                <CardHeader className="p-5 flex-1">
                  <CardTitle className="text-lg font-bold">{book.title}</CardTitle>
                  <CardDescription className="text-xs">{book.author}</CardDescription>
                </CardHeader>
                <CardFooter className="p-5 pt-0 gap-2">
                  <Button variant="outline" className="w-full h-11 text-xs uppercase font-bold" disabled={isAdmin || book.available === 0}>
                    {isAdmin ? "Oversight Only" : (isLibrarian ? "Edit Details" : "Borrow Book")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="issue" className="mt-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle>Issue Queue</CardTitle>
              <CardDescription>Students and teachers waiting for physical resource pickup.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-6 py-4">Borrower</TableHead>
                    <TableHead>Requested Resource</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={req.userAvatar} />
                            <AvatarFallback>{req.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-sm">{req.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{req.bookTitle}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button size="sm" className="h-8 uppercase text-[10px] font-black" onClick={() => handleIssueBook(req.id)} disabled={isAdmin}>
                          {isAdmin ? "View-Only" : "Confirm Issue"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="borrowed" className="mt-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle>{isLibrarian || isAdmin ? 'Active Institutional Circulation' : t("borrowed")}</CardTitle>
              <CardDescription>
                {isLibrarian || isAdmin ? 'Live tracking of all resources currently out of the library.' : 'Your active loans and return deadlines.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-6">{isLibrarian || isAdmin ? 'Student' : 'Book'}</TableHead>
                    <TableHead>{isLibrarian || isAdmin ? 'Book' : 'Author'}</TableHead>
                    <TableHead className="text-center">{t("returnDate")}</TableHead>
                    <TableHead className="text-right pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="pl-6 py-4 font-bold text-sm text-primary">{isLibrarian || isAdmin ? loan.borrowerName : loan.bookTitle}</TableCell>
                      <TableCell className="text-sm">{isLibrarian || isAdmin ? loan.bookTitle : loan.author}</TableCell>
                      <TableCell className="text-center font-mono text-xs font-black text-secondary">{loan.returnDate}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="outline" size="sm" className="h-8 uppercase text-[10px] font-black" onClick={() => isLibrarian ? handleReturnBook(loan.id) : openLoanDetails(loan)} disabled={isAdmin}>
                          {isAdmin ? "Active Loan" : (isLibrarian ? "Record Return" : "Details")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

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
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <p className="text-[10px] uppercase font-black tracking-widest italic">All past transactions are digitally signed and archived.</p>
               </div>
               <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase">
                 <Printer className="w-3.5 h-3.5" /> Print Statement
               </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle>Institutional Library Members</CardTitle>
              <CardDescription>Reports on borrowing habits and policy compliance.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                    <TableHead className="text-right pr-6">Activity Statement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MEMBERS.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="pl-6 py-4 font-bold text-sm text-primary">{member.name}</TableCell>
                      <TableCell className="text-[10px] font-black uppercase">{member.role}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{member.borrowed}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase">
                          <FileDown className="w-3.5 h-3.5" /> Download Report
                        </Button>
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
                      <CardTitle className="text-2xl font-black">Circulation Rules</CardTitle>
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
                        className="h-12 bg-accent/30 border-none rounded-xl font-bold"
                        disabled={isAdmin}
                      />
                      <p className="text-[9px] text-muted-foreground italic">Number of days a student can keep a book before penalty starts.</p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Coins className="w-3.5 h-3.5 text-amber-600" /> Overdue Fine (XAF/Day)
                      </Label>
                      <Input 
                        type="number" 
                        value={policyData.dailyFine}
                        onChange={(e) => setPolicyData({...policyData, dailyFine: e.target.value})}
                        className="h-12 bg-accent/30 border-none rounded-xl font-bold"
                        disabled={isAdmin}
                      />
                      <p className="text-[9px] text-muted-foreground italic">Daily charge accrued for every day past the return date.</p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Max Concurrent Books
                      </Label>
                      <Input 
                        type="number" 
                        value={policyData.maxBooks}
                        onChange={(e) => setPolicyData({...policyData, maxBooks: e.target.value})}
                        className="h-12 bg-accent/30 border-none rounded-xl font-bold"
                        disabled={isAdmin}
                      />
                      <p className="text-[9px] text-muted-foreground italic">Total number of resources a single user can have out at once.</p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Lost Book Penalty (XAF)
                      </Label>
                      <Input 
                        type="number" 
                        value={policyData.lostBookPenalty}
                        onChange={(e) => setPolicyData({...policyData, lostBookPenalty: e.target.value})}
                        className="h-12 bg-accent/30 border-none rounded-xl font-bold"
                        disabled={isAdmin}
                      />
                      <p className="text-[9px] text-muted-foreground italic">Flat charge for resources reported as lost or unrecoverable.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/20 p-6 border-t border-accent flex justify-end">
                  <Button 
                    className="h-12 px-10 rounded-xl shadow-lg font-black uppercase tracking-widest text-xs gap-2"
                    onClick={handleSavePolicy}
                    disabled={isProcessing || isAdmin}
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update Institutional Policy
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-sm font-black text-blue-700 uppercase flex items-center gap-2">
                    <Info className="w-4 h-4" /> Operational Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    Changes to library policies are logged and take effect for all new loans. Existing loans will maintain their original return dates but will adhere to new daily fine rates.
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-blue-100">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Secure Registry Active</span>
                  </div>
                </CardContent>

                <div className="p-8 rounded-[2rem] bg-white border border-accent shadow-inner text-center space-y-4">
                  <QrCode className="w-24 h-24 mx-auto text-primary opacity-10" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Policy Verification ID</p>
                  <Badge variant="outline" className="font-mono text-primary text-[10px]">POL-{Math.random().toString(36).substr(2, 6).toUpperCase()}</Badge>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* RESOURCE DOSSIER DIALOG (READ-ONLY) */}
      <Dialog open={!!selectedLoanDetails} onOpenChange={() => setSelectedLoanDetails(null)}>
        <DialogContent className="sm:max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
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
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-accent/30">
               <img src={selectedLoanDetails?.cover} alt={selectedLoanDetails?.bookTitle} className="w-full h-full object-cover" />
            </div>
            
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-1">
                <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[9px] font-black uppercase tracking-widest mb-2">
                  {selectedLoanDetails?.category}
                </Badge>
                <h2 className="text-2xl font-black text-primary leading-tight uppercase">{selectedLoanDetails?.bookTitle}</h2>
                <p className="text-sm font-bold text-muted-foreground italic">Authored by {selectedLoanDetails?.author}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Pedagogical Description</Label>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  {selectedLoanDetails?.description || "No description available for this institutional resource."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Collection Code</p>
                  <p className="text-sm font-mono font-black text-primary">{selectedLoanDetails?.collectionCode}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Return Due</p>
                  <p className="text-sm font-black text-secondary">{selectedLoanDetails?.returnDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center">
             <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Verified Institutional Asset</p>
             </div>
             <p className="text-[10px] font-bold text-primary/60 italic">Electronic Portfolio Record • EduIgnite SaaS</p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
