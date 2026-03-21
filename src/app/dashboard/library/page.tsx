
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock Data for Books
const MOCK_BOOKS = [
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/200/300" },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/200/300" },
  { id: "B003", title: "Things Fall Apart", author: "Chinua Achebe", category: "Literature", available: 12, total: 15, cover: "https://picsum.photos/seed/lit1/200/300" },
  { id: "B004", title: "A Midsummer Night's Dream", author: "William Shakespeare", category: "Arts", available: 0, total: 3, cover: "https://picsum.photos/seed/art/200/300" },
  { id: "B005", title: "Modern Computing", author: "Ada Lovelace", category: "Informatique", available: 4, total: 4, cover: "https://picsum.photos/seed/comp/200/300" },
];

const MOCK_LOANS = [
  { 
    id: "LOAN-101", 
    bookTitle: "Organic Chemistry", 
    author: "Marie Curie", 
    borrowDate: "May 15, 2024", 
    returnDate: "May 29, 2024", 
    status: "Active",
    collectionCode: "IGN-882-X"
  }
];

export default function LibraryPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowingBook, setBorrowingBook] = useState<any>(null);
  const [previewReceipt, setPreviewReceipt] = useState<any>(null);
  const [loans, setLoans] = useState(MOCK_LOANS);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredBooks = MOCK_BOOKS.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBorrow = () => {
    if (!borrowingBook) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const newLoan = {
        id: `LOAN-${Math.floor(Math.random() * 1000)}`,
        bookTitle: borrowingBook.title,
        author: borrowingBook.author,
        borrowDate: new Date().toLocaleDateString(),
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: "Active",
        collectionCode: `IGN-${Math.floor(100 + Math.random() * 899)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
      };
      
      setLoans([newLoan, ...loans]);
      setIsProcessing(false);
      setBorrowingBook(null);
      setPreviewReceipt(newLoan);
      
      toast({
        title: language === 'en' ? "Borrow Request Sent" : "Demande d'emprunt envoyée",
        description: language === 'en' ? "Download your receipt to collect the book at the office." : "Téléchargez votre reçu pour retirer le livre au bureau.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
            <Library className="w-8 h-8 text-secondary" />
            {t("library")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' ? "Browse books, borrow resources, and manage your academic reading." : "Parcourez les livres, empruntez des ressources et gérez vos lectures."}
          </p>
        </div>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] bg-white shadow-sm border h-auto p-1">
          <TabsTrigger value="catalog" className="gap-2 py-2">
            <Book className="w-4 h-4" /> {language === 'en' ? 'Catalog' : 'Catalogue'}
          </TabsTrigger>
          <TabsTrigger value="borrowed" className="gap-2 py-2">
            <Clock className="w-4 h-4" /> {t("borrowed")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t("searchBooks")}
                className="pl-10 border-none bg-transparent focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col">
                <div className="aspect-[2/3] relative overflow-hidden bg-accent/20">
                   <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute top-2 right-2">
                      <Badge variant={book.available > 0 ? "default" : "destructive"} className="text-[10px]">
                        {book.available > 0 ? t("available") : "Out of Stock"}
                      </Badge>
                   </div>
                </div>
                <CardHeader className="p-4 space-y-1">
                  <Badge variant="outline" className="text-[9px] w-fit uppercase font-bold tracking-widest text-primary/60 border-primary/20">
                    {book.category}
                  </Badge>
                  <CardTitle className="text-base line-clamp-1">{book.title}</CardTitle>
                  <CardDescription className="text-xs">{book.author}</CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 mt-auto">
                  <Button 
                    className="w-full gap-2 shadow-sm" 
                    disabled={book.available === 0}
                    onClick={() => setBorrowingBook(book)}
                  >
                    <Book className="w-4 h-4" /> {t("borrow")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="borrowed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans.map((loan) => (
              <Card key={loan.id} className="border-none shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                      ID: {loan.id}
                    </Badge>
                    <Badge variant="default" className="bg-green-600 text-[10px] h-5">
                      {loan.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{loan.bookTitle}</CardTitle>
                  <CardDescription>{loan.author}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">{language === 'en' ? 'Borrowed' : 'Emprunté'}</p>
                      <p className="text-xs font-bold">{loan.borrowDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">{t("returnDate")}</p>
                      <p className="text-xs font-bold text-primary">{loan.returnDate}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-accent/20 rounded-lg flex items-center justify-between border border-accent">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-primary opacity-40" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">{t("collectionCode")}</p>
                        <p className="font-mono font-bold text-primary">{loan.collectionCode}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 text-primary"
                    onClick={() => setPreviewReceipt(loan)}
                  >
                    <Download className="w-4 h-4" /> {t("collectionReceipt")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {loans.length === 0 && (
              <div className="col-span-full py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                   <Book className="w-8 h-8 text-primary/30" />
                </div>
                <p className="text-muted-foreground text-sm">{language === 'en' ? "You haven't borrowed any books yet." : "Vous n'avez pas encore emprunté de livres."}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Borrow Confirmation Dialog */}
      <Dialog open={!!borrowingBook} onOpenChange={() => setBorrowingBook(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'en' ? 'Confirm Borrowing' : 'Confirmer l\'emprunt'}</DialogTitle>
            <DialogDescription>
              {language === 'en' ? 'You are about to borrow:' : 'Vous êtes sur le point d\'emprunter :'}
            </DialogDescription>
          </DialogHeader>
          {borrowingBook && (
            <div className="flex gap-4 p-4 bg-accent/10 rounded-xl border border-accent">
              <div className="w-16 h-24 rounded shadow-sm overflow-hidden shrink-0">
                <img src={borrowingBook.cover} alt={borrowingBook.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-primary">{borrowingBook.title}</h4>
                <p className="text-xs text-muted-foreground">{borrowingBook.author}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-secondary" />
                  <span className="text-[10px] font-bold text-secondary uppercase">14 Day Loan Period</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setBorrowingBook(null)} disabled={isProcessing}>
              {t("cancel")}
            </Button>
            <Button onClick={handleBorrow} disabled={isProcessing} className="gap-2">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Book className="w-4 h-4" />}
              {language === 'en' ? 'Confirm Request' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Collection Receipt Dialog */}
      <Dialog open={!!previewReceipt} onOpenChange={() => setPreviewReceipt(null)}>
        <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl overflow-hidden bg-muted">
          <DialogHeader className="p-6 bg-primary text-white">
            <DialogTitle className="flex items-center gap-2 text-white">
              <Download className="w-5 h-5" />
              {t("collectionReceipt")}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {language === 'en' ? 'Show this code at the office to collect your book.' : 'Présentez ce code au bureau pour retirer votre livre.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-6 bg-white mx-4 my-6 rounded-2xl shadow-sm relative border border-border">
             {/* Receipt Branding */}
             <div className="flex justify-between items-start border-b pb-4">
                <div className="flex items-center gap-2">
                   <div className="bg-primary/10 p-1.5 rounded-lg">
                      <Building2 className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                      <p className="font-black text-sm text-primary uppercase tracking-tight">EduIgnite Library</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">Official Document</p>
                   </div>
                </div>
                <div className="text-right">
                   <Badge variant="outline" className="text-[8px] h-4 font-black bg-secondary/10 text-primary border-none">
                     {previewReceipt?.id}
                   </Badge>
                </div>
             </div>

             {/* Main Info */}
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">{language === 'en' ? 'Borrower' : 'Emprunteur'}</p>
                      <p className="text-xs font-bold flex items-center gap-1.5"><User className="w-3 h-3"/> {user?.name}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">ID No.</p>
                      <p className="text-xs font-mono font-bold text-primary">{user?.id}</p>
                   </div>
                </div>

                <div className="bg-accent/10 p-3 rounded-xl border border-accent space-y-2">
                   <p className="text-[9px] uppercase font-bold text-muted-foreground">{language === 'en' ? 'Book Requested' : 'Livre Demandé'}</p>
                   <p className="font-black text-primary leading-tight">{previewReceipt?.bookTitle}</p>
                   <p className="text-xs text-muted-foreground">{previewReceipt?.author}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">{language === 'en' ? 'Request Date' : 'Date de Demande'}</p>
                      <p className="text-xs font-bold">{previewReceipt?.borrowDate}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">{t("returnDate")}</p>
                      <p className="text-xs font-bold text-secondary">{previewReceipt?.returnDate}</p>
                   </div>
                </div>
             </div>

             {/* Collection Code Section */}
             <div className="pt-6 border-t border-dashed border-primary/20 flex flex-col items-center gap-4">
                <div className="p-4 bg-primary text-white rounded-2xl w-full text-center space-y-1 shadow-lg shadow-primary/20">
                   <p className="text-[10px] uppercase font-black tracking-widest opacity-60">{t("collectionCode")}</p>
                   <p className="text-3xl font-black font-mono tracking-tighter">{previewReceipt?.collectionCode}</p>
                </div>
                <div className="flex items-center gap-1.5 opacity-50 text-[9px] italic font-medium">
                   <ShieldCheck className="w-3 h-3" />
                   {language === 'en' ? 'Temporal valid for 48 hours.' : 'Valable temporairement pour 48 heures.'}
                </div>
             </div>
             
             {/* Security Hologram Mock */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <ShieldCheck className="w-48 h-48 text-primary/[0.03] rotate-12" />
             </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="w-4 h-4" /> {language === 'en' ? 'Print' : 'Imprimer'}
            </Button>
            <Button onClick={() => setPreviewReceipt(null)} className="gap-2 shadow-lg">
              <CheckCircle2 className="w-4 h-4" /> {language === 'en' ? 'Done' : 'Terminé'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
