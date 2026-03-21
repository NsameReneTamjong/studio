
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
  Loader2,
  Bookmark,
  Info,
  BookOpen
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock Data for Books
const MOCK_BOOKS = [
  { id: "B001", title: "Advanced Physics", author: "Dr. Tesla", category: "Science", available: 5, total: 10, cover: "https://picsum.photos/seed/phys/400/600" },
  { id: "B002", title: "Calculus II", author: "Prof. Smith", category: "Mathematics", available: 2, total: 5, cover: "https://picsum.photos/seed/math/400/600" },
  { id: "B003", title: "Things Fall Apart", author: "Chinua Achebe", category: "Literature", available: 12, total: 15, cover: "https://picsum.photos/seed/lit1/400/600" },
  { id: "B004", title: "A Midsummer Night's Dream", author: "William Shakespeare", category: "Arts", available: 0, total: 3, cover: "https://picsum.photos/seed/art/400/600" },
  { id: "B005", title: "Modern Computing", author: "Ada Lovelace", category: "Informatique", available: 4, total: 4, cover: "https://picsum.photos/seed/comp/400/600" },
  { id: "B006", title: "The Old Man and the Sea", author: "Ernest Hemingway", category: "Literature", available: 8, total: 8, cover: "https://picsum.photos/seed/sea/400/600" },
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Library className="w-6 h-6 text-secondary" />
            </div>
            {t("library")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' ? "Browse books, borrow resources, and manage your academic reading." : "Parcourez les livres, empruntez des ressources et gérez vos lectures."}
          </p>
        </div>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="catalog" className="gap-2 py-3 rounded-xl transition-all">
            <Book className="w-4 h-4" /> {language === 'en' ? 'Catalog' : 'Catalogue'}
          </TabsTrigger>
          <TabsTrigger value="borrowed" className="gap-2 py-3 rounded-xl transition-all relative">
            <Clock className="w-4 h-4" /> 
            {t("borrowed")}
            {loans.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-primary text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {loans.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-2 rounded-2xl shadow-xl border border-accent/50">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder={t("searchBooks")}
                className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden sm:flex items-center gap-2 pr-2">
               <Badge variant="secondary" className="bg-accent/50 text-primary border-none py-1.5 px-3 uppercase text-[10px] font-black tracking-widest cursor-pointer hover:bg-accent">Science</Badge>
               <Badge variant="secondary" className="bg-accent/50 text-primary border-none py-1.5 px-3 uppercase text-[10px] font-black tracking-widest cursor-pointer hover:bg-accent">Literature</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="border-none shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="aspect-[3/4] relative overflow-hidden bg-accent/20">
                   <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    data-ai-hint="book cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-white text-xs font-medium line-clamp-2 italic mb-2">"Education is the most powerful weapon which you can use to change the world."</p>
                   </div>
                   <div className="absolute top-3 right-3">
                      <Badge variant={book.available > 0 ? "default" : "destructive"} className={cn(
                        "text-[10px] font-black shadow-lg uppercase",
                        book.available > 0 ? "bg-green-600" : "bg-red-600"
                      )}>
                        {book.available > 0 ? t("available") : "Out of Stock"}
                      </Badge>
                   </div>
                </div>
                <CardHeader className="p-5 space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] w-fit uppercase font-black tracking-widest text-primary/60 border-primary/10 bg-primary/5">
                      {book.category}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground">{book.available}/{book.total} left</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-1 font-bold group-hover:text-primary transition-colors">{book.title}</CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> {book.author}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-5 pt-0">
                  <Button 
                    className={cn(
                      "w-full gap-2 shadow-lg h-11 text-sm font-bold uppercase tracking-wider transition-all",
                      book.available > 0 ? "bg-primary hover:shadow-primary/20" : "opacity-50 cursor-not-allowed"
                    )} 
                    disabled={book.available === 0}
                    onClick={() => setBorrowingBook(book)}
                  >
                    <Bookmark className="w-4 h-4" /> {t("borrow")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="borrowed" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loans.map((loan) => (
              <Card key={loan.id} className="border-none shadow-xl relative overflow-hidden group bg-white">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary" />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-[10px] font-black bg-primary/5 text-primary border-primary/10 tracking-widest">
                        ID: {loan.id}
                      </Badge>
                      <CardTitle className="text-xl mt-2 leading-tight">{loan.bookTitle}</CardTitle>
                      <CardDescription className="font-medium">{loan.author}</CardDescription>
                    </div>
                    <Badge variant="default" className="bg-green-600 text-[10px] h-6 font-black uppercase tracking-tighter">
                      {loan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6 bg-accent/10 p-4 rounded-2xl border border-accent">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black tracking-widest">{language === 'en' ? 'Borrowed' : 'Emprunté'}</p>
                      <p className="text-sm font-bold text-primary">{loan.borrowDate}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] uppercase font-black tracking-widest">{t("returnDate")}</p>
                      <p className="text-sm font-bold text-secondary">{loan.returnDate}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-primary text-white rounded-2xl flex items-center justify-between shadow-lg shadow-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                        <QrCode className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest opacity-60">{t("collectionCode")}</p>
                        <p className="font-mono font-black text-xl tracking-tighter text-secondary">{loan.collectionCode}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-secondary opacity-40" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 text-primary border-primary/20 hover:bg-primary/5 h-11 font-bold"
                    onClick={() => setPreviewReceipt(loan)}
                  >
                    <Download className="w-4 h-4" /> {t("collectionReceipt")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {loans.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-6 bg-accent/10 rounded-3xl border-2 border-dashed border-accent">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                   <Book className="w-10 h-10 text-primary/20" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-primary">No Active Loans</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">{language === 'en' ? "You haven't borrowed any books yet. Explore the catalog to start reading." : "Vous n'avez pas encore emprunté de livres. Explorez le catalogue pour commencer à lire."}</p>
                </div>
                <Button variant="outline" className="rounded-full px-8" onClick={() => (document.querySelector('[value="catalog"]') as any)?.click()}>
                  Browse Catalog
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Borrow Confirmation Dialog */}
      <Dialog open={!!borrowingBook} onOpenChange={() => setBorrowingBook(null)}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <div className="p-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary">
                <Info className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold">{language === 'en' ? 'Confirm Borrowing' : 'Confirmer l\'emprunt'}</DialogTitle>
                <DialogDescription>
                  {language === 'en' ? 'Review book details before placing your request.' : 'Vérifiez les détails du livre avant de passer votre commande.'}
                </DialogDescription>
              </div>
            </div>

            {borrowingBook && (
              <div className="flex gap-6 p-5 bg-accent/20 rounded-2xl border border-accent items-center">
                <div className="w-20 h-28 rounded-lg shadow-xl overflow-hidden shrink-0 border-2 border-white">
                  <img src={borrowingBook.cover} alt={borrowingBook.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <h4 className="font-black text-primary leading-tight text-lg line-clamp-2">{borrowingBook.title}</h4>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{borrowingBook.author}</p>
                  <div className="flex items-center gap-2 mt-3 text-secondary bg-secondary/10 w-fit px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">14 Day Loan</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-primary/5 p-4 rounded-xl text-[11px] text-muted-foreground italic flex gap-3 items-start">
               <ShieldCheck className="w-4 h-4 shrink-0 text-primary mt-0.5" />
               <p>By confirming, you agree to return the resource in good condition by the specified deadline.</p>
            </div>
          </div>
          <DialogFooter className="p-6 bg-accent/30 flex sm:flex-row gap-3 pt-0">
            <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setBorrowingBook(null)} disabled={isProcessing}>
              {t("cancel")}
            </Button>
            <Button onClick={handleBorrow} disabled={isProcessing} className="flex-1 rounded-xl h-12 gap-2 shadow-lg font-bold">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Book className="w-4 h-4" />}
              {language === 'en' ? 'Confirm Request' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Collection Receipt Dialog - Enhanced Institution Design */}
      <Dialog open={!!previewReceipt} onOpenChange={() => setPreviewReceipt(null)}>
        <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl overflow-hidden bg-[#F0F2F5]">
          <DialogHeader className="p-6 bg-primary text-white border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between w-full">
              <DialogTitle className="flex items-center gap-3 text-xl font-headline tracking-tight">
                <Download className="w-6 h-6 text-secondary" />
                {t("collectionReceipt")}
              </DialogTitle>
              <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60">
                Official Copy
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="bg-white p-8 space-y-8 rounded-3xl shadow-lg relative border border-border overflow-hidden">
               {/* Watermark Logo */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
                  <Building2 className="w-64 h-64 text-primary rotate-12" />
               </div>

               {/* Receipt Branding Header */}
               <div className="flex justify-between items-start border-b-2 border-dashed border-accent pb-6">
                  <div className="flex items-center gap-3">
                     <div className="bg-primary p-2 rounded-xl shadow-lg">
                        <Building2 className="w-8 h-8 text-secondary" />
                     </div>
                     <div>
                        <p className="font-black text-lg text-primary uppercase tracking-tighter leading-none">EduIgnite Institution</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Resource & Library Office</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <Badge variant="outline" className="text-[10px] h-6 px-3 font-black bg-secondary/10 text-primary border-none shadow-inner">
                       {previewReceipt?.id}
                     </Badge>
                  </div>
               </div>

               {/* Borrower & Institution Context */}
               <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{language === 'en' ? 'Borrower' : 'Emprunteur'}</p>
                        <p className="text-sm font-black flex items-center gap-2 text-primary uppercase"><User className="w-4 h-4 text-secondary"/> {user?.name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground pl-6 uppercase tracking-wider">{user?.role}</p>
                     </div>
                     <div className="space-y-1 text-right">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Matricule / ID</p>
                        <p className="text-sm font-mono font-black text-primary bg-accent/30 px-3 py-1 rounded-lg inline-block">{user?.id}</p>
                     </div>
                  </div>

                  <div className="bg-[#F8FAFC] p-5 rounded-2xl border-2 border-accent/50 space-y-3 relative shadow-inner">
                     <div className="absolute -top-3 left-4 bg-white px-3 py-0.5 border border-accent rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-sm">
                        Item Details
                     </div>
                     <div className="space-y-1">
                        <p className="font-black text-primary text-lg leading-tight uppercase tracking-tight">{previewReceipt?.bookTitle}</p>
                        <p className="text-xs font-bold text-muted-foreground flex items-center gap-1"><BookOpen className="w-3 h-3" /> {previewReceipt?.author}</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 border-t border-accent pt-6">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{language === 'en' ? 'Request Issued' : 'Émis le'}</p>
                        <p className="text-sm font-bold text-primary">{previewReceipt?.borrowDate}</p>
                     </div>
                     <div className="space-y-1 text-right">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t("returnDate")}</p>
                        <p className="text-sm font-black text-secondary uppercase italic">{previewReceipt?.returnDate}</p>
                     </div>
                  </div>
               </div>

               {/* Collection Code Section - High Contrast */}
               <div className="pt-8 border-t-4 border-double border-accent flex flex-col items-center gap-6 relative z-10">
                  <div className="space-y-2 text-center w-full">
                     <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">Presentation Code</p>
                     <div className="p-6 bg-[#1E293B] text-white rounded-3xl w-full text-center space-y-1 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-50" />
                        <p className="text-4xl font-black font-mono tracking-widest relative z-10 text-secondary">{previewReceipt?.collectionCode}</p>
                        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40 mt-3 relative z-10">
                           <ShieldCheck className="w-3 h-3" />
                           Validated Institutional ID
                        </div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full opacity-60">
                     <div className="border-t border-muted-foreground/20 pt-2 text-center space-y-1">
                        <p className="text-[8px] font-black uppercase">Officer Sign</p>
                        <div className="h-8" />
                     </div>
                     <div className="border-t border-muted-foreground/20 pt-2 text-center space-y-1">
                        <p className="text-[8px] font-black uppercase">Official Stamp</p>
                        <div className="h-8" />
                     </div>
                  </div>
               </div>
               
               <div className="absolute bottom-4 left-0 right-0 px-8 flex items-center justify-between opacity-30 text-[8px] font-black uppercase tracking-[0.3em]">
                  <span>EduIgnite SMS</span>
                  <span>Cameroon Portal</span>
               </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0 shrink-0">
            <Button variant="outline" onClick={() => window.print()} className="flex-1 h-12 gap-2 rounded-xl font-bold border-primary/10">
              <Printer className="w-4 h-4 text-primary" /> Imprimer / Print
            </Button>
            <Button onClick={() => setPreviewReceipt(null)} className="flex-1 h-12 gap-2 rounded-xl font-black uppercase tracking-widest shadow-xl">
              <CheckCircle2 className="w-4 h-4 text-secondary" /> {language === 'en' ? 'Done' : 'Terminé'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
