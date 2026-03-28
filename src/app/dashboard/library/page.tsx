
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
  Upload
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
import { useRouter } from "next/navigation";

const INITIAL_BOOKS = [
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/400/600", description: "In-depth study of thermodynamics.", isbn: "ISBN-922-X" },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/400/600", description: "Comprehensive guide to integration.", isbn: "ISBN-102-M" },
];

const INITIAL_LOANS = [
  { id: "LOAN-101", bookTitle: "Organic Chemistry", borrowerName: "Alice Thompson", borrowerId: "GBHS26S001", borrowDate: "May 15, 2024", returnDate: "May 29, 2024", status: "Active", avatar: "https://picsum.photos/seed/s1/100/100" },
];

export default function LibraryPage() {
  const { user } = useAuth();
  const { language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [loans] = useState(INITIAL_LOANS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);

  const isLibrarian = user?.role === "LIBRARIAN";
  const isManagement = ["SCHOOL_ADMIN", "SUB_ADMIN", "LIBRARIAN"].includes(user?.role || "");

  const [newBookData, setNewBookData] = useState({
    title: "",
    author: "",
    category: "Science",
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
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full shadow-sm shrink-0"><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg text-white"><Library className="w-6 h-6 text-secondary" /></div>
              {isManagement ? "Library Management" : "Institutional Library"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Registry of digital and physical volumes.</p>
          </div>
        </div>
        
        {isLibrarian && (
          <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
            <DialogTrigger asChild><Button className="gap-2 shadow-lg h-11 rounded-xl"><Plus className="w-4 h-4" /> Add Volume</Button></DialogTrigger>
            <DialogContent className="sm:max-w-xl w-[95vw] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
              <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><BookMarked className="w-8 h-8 text-secondary" /></div>
                  <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">New Catalog Entry</DialogTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsAddingBook(false)} className="absolute top-4 right-4 text-white hover:bg-white/10"><X className="w-6 h-6" /></Button>
              </DialogHeader>
              <div className="p-8 space-y-6 flex-1 overflow-y-auto bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Title</Label><Input value={newBookData.title} onChange={(e) => setNewBookData({...newBookData, title: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" /></div>
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Author</Label><Input value={newBookData.author} onChange={(e) => setNewBookData({...newBookData, author: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" /></div>
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Total Stock</Label><Input type="number" value={newBookData.total} onChange={(e) => setNewBookData({...newBookData, total: parseInt(e.target.value)})} className="h-12 bg-accent/30 border-none rounded-xl font-black" /></div>
                </div>
              </div>
              <DialogFooter className="bg-accent/20 p-6 border-t flex gap-3">
                <Button onClick={handleAddBook} disabled={isProcessing || !newBookData.title} className="w-full h-12 rounded-xl shadow-xl font-black uppercase tracking-widest text-[10px] gap-2">
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Volume
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-blue-50 p-6 rounded-3xl"><p className="text-[10px] font-black uppercase text-blue-600 mb-2">Volumes</p><div className="text-3xl font-black text-blue-700">{books.length}</div></Card>
        <Card className="border-none shadow-sm bg-purple-50 p-6 rounded-3xl"><p className="text-[10px] font-black uppercase text-purple-600 mb-2">Active Loans</p><div className="text-3xl font-black text-purple-700">{loans.length}</div></Card>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="catalog" className="gap-2 py-3 rounded-xl transition-all font-bold"><BookOpen className="w-4 h-4" /> Catalog</TabsTrigger>
          <TabsTrigger value="circulation" className="gap-2 py-3 rounded-xl transition-all font-bold"><Clock className="w-4 h-4" /> Circulation</TabsTrigger>
          <TabsTrigger value="history" className="gap-2 py-3 rounded-xl transition-all font-bold"><History className="w-4 h-4" /> Registry</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Filter catalog..." className="pl-10 h-12 bg-white border-none rounded-2xl shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
                <div className="aspect-[3/4] bg-accent/20 overflow-hidden"><img src={book.cover} className="w-full h-full object-cover" alt={book.title} /></div>
                <CardHeader className="p-5 pb-2"><CardTitle className="text-lg font-black truncate">{book.title}</CardTitle><CardDescription className="text-xs font-bold">{book.author}</CardDescription></CardHeader>
                <CardContent className="px-5 py-2">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground/60"><span>Availability</span><span className="text-primary">{book.available} / {book.total}</span></div>
                   <Progress value={(book.available / book.total) * 100} className="h-1 mt-1.5" />
                </CardContent>
                <CardFooter className="p-5 pt-2"><Button className="w-full h-10 text-[10px] font-black uppercase tracking-widest shadow-lg rounded-xl" disabled={book.available === 0}><BookMarked className="w-3.5 h-3.5 mr-2" /> Borrow</Button></CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="circulation">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black">
                  <TableRow><TableHead className="pl-8 py-4">Borrower</TableHead><TableHead>Book</TableHead><TableHead className="text-center">Due Date</TableHead><TableHead className="text-right pr-8">Status</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map(loan => (
                    <TableRow key={loan.id} className="h-16 border-b">
                      <TableCell className="pl-8"><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarImage src={loan.avatar} /></Avatar><span className="font-bold text-xs uppercase">{loan.borrowerName}</span></div></TableCell>
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
      </Tabs>
    </div>
  );
}
