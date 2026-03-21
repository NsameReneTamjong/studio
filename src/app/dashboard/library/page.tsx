
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
  ArrowLeftRight
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

  return (
    <div className="space-y-8">
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
          <div className="p-20 text-center border-2 border-dashed border-accent rounded-3xl">
             <ShieldCheck className="w-12 h-12 text-primary opacity-20 mx-auto mb-4" />
             <h3 className="font-bold text-primary">Library Policy Overview</h3>
             <p className="text-sm text-muted-foreground">Standard Loan: 14 Days • Penalty: 500 XAF/Day</p>
             <p className="text-[10px] mt-2 italic text-muted-foreground">Admins have read-only access to library governance.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
