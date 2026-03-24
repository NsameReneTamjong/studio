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
  CalendarClock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data for Books
const INITIAL_BOOKS = [
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/400/600", description: "In-depth study of thermodynamics and classical mechanics for advanced students." },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/400/600", description: "Comprehensive guide to integration, series, and multivariable calculus." },
];

const INITIAL_LOANS = [
  { id: "LOAN-101", bookTitle: "Organic Chemistry", author: "Marie Curie", borrowerName: "Alice Thompson", borrowerId: "S001", borrowDate: "May 15, 2024", returnDate: "May 29, 2024", status: "Active", collectionCode: "IGN-882-X" }
];

const MOCK_REQUESTS = [
  { id: "REQ-001", userName: "Alice Thompson", userRole: "STUDENT", userAvatar: "https://picsum.photos/seed/s1/100/100", bookTitle: "Things Fall Apart", bookAuthor: "Chinua Achebe", requestDate: "Today, 11:00 AM" }
];

const MOCK_MEMBERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", avatar: "https://picsum.photos/seed/s1/100/100", borrowed: 2, overdue: 0, returned: 12 },
];

export default function LibraryPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [borrowingBook, setBorrowingBook] = useState<any>(null);
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
          (isLibrarian || isAdmin) ? "grid-cols-5 md:w-[950px]" : "grid-cols-2 md:w-[400px]"
        )}>
          <TabsTrigger value="catalog" className="gap-2 py-3 rounded-xl transition-all">
            <Book className="w-4 h-4" /> Catalog
          </TabsTrigger>
          {(isLibrarian || isAdmin) && (
            <TabsTrigger value="issue" className="gap-2 py-3 rounded-xl transition-all">
              <ArrowUpRight className="w-4 h-4" /> Issue Requests
            </TabsTrigger>
          )}
          <TabsTrigger value="borrowed" className="gap-2 py-3 rounded-xl transition-all">
            <Clock className="w-4 h-4" /> {isLibrarian || isAdmin ? 'Circulation' : 'My Books'}
          </TabsTrigger>
          {(isLibrarian || isAdmin) && (
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

        <TabsContent value="catalog" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <Card key={book.id} className="border-none shadow-sm flex flex-col group overflow-hidden bg-white/50">
                <div className="aspect-[3/4] relative overflow-hidden bg-accent/20">
                   <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                   <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600 uppercase text-[10px]">{book.available > 0 ? "Available" : "Out"}</Badge>
                   </div>
                </div>
                <CardHeader className="p-5 flex-1">
                  <CardTitle className="text-lg font-bold">{book.title}</CardTitle>
                  <CardDescription className="text-xs">{book.author}</CardDescription>
                </CardHeader>
                <CardFooter className="p-5 pt-0 gap-2">
                  <Button variant="outline" className="w-full h-11 text-xs uppercase font-bold" disabled={isAdmin}>
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
                      <TableCell className="pl-6 py-4 font-bold text-sm">{req.userName}</TableCell>
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
              <CardTitle>Active Institutional Circulation</CardTitle>
              <CardDescription>Live tracking of all resources currently out of the library.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-6">Student</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead className="text-center">Due Date</TableHead>
                    <TableHead className="text-right pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="pl-6 py-4 font-bold text-sm text-primary">{loan.borrowerName}</TableCell>
                      <TableCell className="text-sm">{loan.bookTitle}</TableCell>
                      <TableCell className="text-center font-mono text-xs font-black text-secondary">{loan.returnDate}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="outline" size="sm" className="h-8 uppercase text-[10px] font-black" onClick={() => handleReturnBook(loan.id)} disabled={isAdmin}>
                          {isAdmin ? "Active Loan" : "Record Return"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
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
    </div>
  );
}
