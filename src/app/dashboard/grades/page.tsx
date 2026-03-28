
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { LoadingState } from "@/components/shared/loading-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  History, 
  FileText, 
  User, 
  Save,
  ArrowLeft,
  XCircle,
  FileBadge,
  Printer,
  FileDown,
  Download,
  Eye,
  CreditCard,
  QrCode,
  X,
  Building2,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology", "History", "Geography"];

const MOCK_STUDENTS_GRADES = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s1/100/100", seq1: 14.5, seq2: 16.0 },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s2/100/100", seq1: 18.0, seq2: 17.5 },
];

const MOCK_PERSONAL_GRADES = [
  { subject: "Advanced Physics", seq1: 14.5, seq2: 16.0, coeff: 4, teacher: "Dr. Tesla", status: "Passed" },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, coeff: 5, teacher: "Prof. Smith", status: "Passed" },
];

const MOCK_TRANSCRIPT_DATA = {
  "Advanced Physics": { f1: ["12.5", "13.0", "14.2"], f2: ["11.0", "12.5", "13.5"], f3: ["14.0", "15.5", "16.0"] },
  "Mathematics": { f1: ["15.0", "16.5", "17.0"], f2: ["14.5", "15.0", "16.0"], f3: ["17.5", "18.0", "17.5"] },
};

export default function GradeBookPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [selectedSubject, setSelectedSubject] = useState("Advanced Physics");
  const [activeSequence, setActiveSequence] = useState<"seq1" | "seq2">("seq1");
  const [grades] = useState(MOCK_STUDENTS_GRADES);
  const [viewingDoc, setViewingDoc] = useState<any>(null);

  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (title: string) => {
    toast({ title: "Preparation Started", description: `Generating high-fidelity PDF for ${title}...` });
    setTimeout(() => {
      toast({ title: "Download Successful", description: `${title} has been saved to your device.` });
    }, 2000);
  };

  if (isLoading) return <LoadingState message="Fetching pedagogical records..." />;

  if (isStudent) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-primary font-headline uppercase">Results Registry</h1>
          </div>
          <Button onClick={() => handleDownload('Official Term Bulletin')} className="h-12 px-8 rounded-2xl shadow-xl font-black uppercase text-[10px] gap-3">
            <Printer className="w-4 h-4" /> Download Official Bulletin
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white p-6 rounded-3xl">
            <p className="text-[10px] font-black opacity-60 uppercase mb-2">Term Average</p>
            <div className="text-3xl font-black text-secondary">16.45 / 20</div>
          </Card>
          <Card className="border-none shadow-sm bg-secondary text-primary p-6 rounded-3xl">
            <p className="text-[10px] font-black opacity-60 uppercase mb-2">Status</p>
            <div className="text-xl font-black flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> ELIGIBLE
            </div>
          </Card>
          <Card className="border-none shadow-sm bg-white border p-6 rounded-3xl">
            <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Registry</p>
            <div className="text-xl font-black flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5 text-secondary" /> VERIFIED
            </div>
          </Card>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
            <TabsTrigger value="current" className="gap-2 py-3 rounded-xl font-bold">Current Term</TabsTrigger>
            <TabsTrigger value="transcript" className="gap-2 py-3 rounded-xl font-bold">Transcript</TabsTrigger>
            <TabsTrigger value="documents" className="gap-2 py-3 rounded-xl font-bold">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-8 text-white">
                <CardTitle className="text-xl font-black uppercase">Sequence Registry</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 font-black text-[9px] uppercase">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Subject</TableHead>
                      <TableHead className="text-center">Coeff</TableHead>
                      <TableHead className="text-center">Seq 1</TableHead>
                      <TableHead className="text-center">Seq 2</TableHead>
                      <TableHead className="text-right pr-8">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PERSONAL_GRADES.map((g, idx) => (
                      <TableRow key={idx} className="h-16 border-b last:border-0 hover:bg-accent/5">
                        <TableCell className="pl-8 font-black uppercase text-xs">{g.subject}</TableCell>
                        <TableCell className="text-center font-bold">{g.coeff}</TableCell>
                        <TableCell className="text-center font-bold">{g.seq1}</TableCell>
                        <TableCell className="text-center font-bold">{g.seq2}</TableCell>
                        <TableCell className="text-right pr-8"><Badge className="bg-green-100 text-green-700">PASSED</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white p-8">
              <div className="overflow-x-auto scrollbar-thin">
                <TranscriptPreview student={user} platform={platformSettings} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <Card className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all rounded-3xl">
                  <div className="h-1.5 w-full bg-blue-500" />
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><FileText className="w-6 h-6" /></div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none text-[8px] font-black uppercase tracking-widest px-2 h-5">Report Card</Badge>
                    </div>
                    <CardTitle className="text-lg font-black mt-4 uppercase text-primary">Term 1 Record</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-tight">Academic Session 2023 / 2024</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 flex gap-2 p-6">
                    <Button variant="outline" size="sm" className="flex-1 gap-2 text-[10px] font-black uppercase h-10 rounded-xl border-primary/10 hover:bg-primary/5 transition-colors" onClick={() => setViewingDoc({ title: 'Term 1 Report Card', type: 'report', term: 'First Term', avg: '15.45', rank: '08/42' })}>
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-primary/10 hover:bg-primary/5" onClick={() => handleDownload('Term 1 Report Card')}>
                      <Download className="w-3.5 h-3.5 text-primary/60" />
                    </Button>
                  </CardFooter>
               </Card>

               <Card className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all rounded-3xl">
                  <div className="h-1.5 w-full bg-amber-500" />
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><FileText className="w-6 h-6" /></div>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none text-[8px] font-black uppercase tracking-widest px-2 h-5">Report Card</Badge>
                    </div>
                    <CardTitle className="text-lg font-black mt-4 uppercase text-primary">Term 2 Record</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-tight">Academic Session 2023 / 2024</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 flex gap-2 p-6">
                    <Button variant="outline" size="sm" className="flex-1 gap-2 text-[10px] font-black uppercase h-10 rounded-xl border-primary/10 hover:bg-primary/5 transition-colors" onClick={() => setViewingDoc({ title: 'Term 2 Report Card', type: 'report', term: 'Second Term', avg: '16.12', rank: '05/42' })}>
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-primary/10 hover:bg-primary/5" onClick={() => handleDownload('Term 2 Report Card')}>
                      <Download className="w-3.5 h-3.5 text-primary/60" />
                    </Button>
                  </CardFooter>
               </Card>

               <Card className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all rounded-3xl">
                  <div className="h-1.5 w-full bg-secondary" />
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-secondary/20 rounded-2xl text-primary"><CreditCard className="w-6 h-6" /></div>
                      <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 h-5">Identification</Badge>
                    </div>
                    <CardTitle className="text-lg font-black mt-4 uppercase text-primary">Student ID Card</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-tight">Digital PVC Copy • Valid 2024</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 flex gap-2 p-6">
                    <Button variant="outline" size="sm" className="flex-1 gap-2 text-[10px] font-black uppercase h-10 rounded-xl border-primary/10 hover:bg-primary/5 transition-colors" onClick={() => setViewingDoc({ title: 'Digital ID Card', type: 'id' })}>
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-primary/10 hover:bg-primary/5" onClick={() => handleDownload('Digital ID Card')}>
                      <Download className="w-3.5 h-3.5 text-primary/60" />
                    </Button>
                  </CardFooter>
               </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* DOCUMENT PREVIEW DIALOG */}
        <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
          <DialogContent className="sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white flex flex-col max-h-[90vh]">
            <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <FileText className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight">{viewingDoc?.title}</DialogTitle>
                  <DialogDescription className="text-white/60">Verified institutional record preview.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewingDoc(null)} className="absolute top-4 right-4 text-white hover:bg-white/10">
                <X className="w-6 h-6" />
              </Button>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-muted">
              {viewingDoc?.type === 'report' ? (
                <div className="bg-white p-8 border-2 border-black/10 shadow-sm relative flex flex-col space-y-8 font-serif text-black min-w-[600px] mx-auto">
                   <div className="flex justify-between items-start border-b-2 border-black pb-4">
                      <div className="space-y-0.5 text-[8px] uppercase font-bold">
                        <p>Republic of Cameroon</p>
                        <p>Peace - Work - Fatherland</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <img src={user?.school?.logo || platformSettings.logo} alt="School" className="w-16 h-16 object-contain" />
                      </div>
                      <div className="space-y-0.5 text-[8px] uppercase font-bold text-right">
                        <p>République du Cameroun</p>
                        <p>Paix - Travail - Patrie</p>
                      </div>
                   </div>
                   <div className="text-center space-y-1">
                      <h2 className="font-black text-xl uppercase text-primary">{user?.school?.name || "GOVERNMENT HIGH SCHOOL"}</h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest underline decoration-double">{viewingDoc.term} Report Record</p>
                   </div>
                   <div className="grid grid-cols-2 gap-8 py-4">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-muted-foreground border-b pb-1">Student Identity</p>
                          <p className="font-black text-sm uppercase">{user?.name}</p>
                          <p className="text-[10px] font-mono font-bold text-primary">Matricule: {user?.id}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-muted-foreground border-b pb-1">Class Stream</p>
                          <p className="font-bold text-xs uppercase">{user?.class || "2nde / Form 5"}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-primary text-white rounded-2xl shadow-xl text-center">
                           <p className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">Term Average</p>
                           <p className="font-black text-2xl text-secondary">{viewingDoc.avg} / 20</p>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold px-2">
                           <span className="opacity-60 uppercase">Class Rank:</span>
                           <span className="font-black text-primary">{viewingDoc.rank}</span>
                        </div>
                      </div>
                   </div>
                   <div className="pt-8 border-t border-black/5 flex justify-between items-end">
                      <QrCode className="w-14 h-14 text-primary opacity-20" />
                      <div className="text-center space-y-4 w-32">
                        <div className="h-10 w-full bg-primary/5 rounded border-b-2 border-black/40 flex items-center justify-center">
                           <SignatureSVG className="w-full h-full text-primary/10 p-2" />
                        </div>
                        <p className="text-[8px] font-black uppercase text-primary">The Principal</p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex justify-center py-10">
                  <div className="w-[400px] h-[250px] bg-white rounded-2xl shadow-2xl border-2 border-primary/10 overflow-hidden relative flex flex-col">
                    <div className="bg-primary h-1.5 w-full shrink-0" />
                    <div className="p-4 border-b flex items-center gap-3 bg-accent/5 shrink-0">
                      <div className="w-10 h-10 bg-white rounded-lg p-1 border shadow-sm flex items-center justify-center shrink-0">
                        <img src={user?.school?.logo || platformSettings.logo} alt="School" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="text-[10px] font-black uppercase text-primary leading-tight truncate">{user?.school?.name || "GOVERNMENT HIGH SCHOOL"}</h3>
                        <p className="text-[7px] font-bold text-muted-foreground uppercase">Ministry of Secondary Education</p>
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex gap-4">
                      <div className="w-24 h-24 rounded-lg border-2 border-primary/10 overflow-hidden shrink-0 bg-accent/5">
                        <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center gap-2">
                        <div className="space-y-0.5">
                          <p className="text-[6px] uppercase font-black text-muted-foreground">Full Name</p>
                          <p className="text-xs font-black text-primary uppercase leading-none">{user?.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <p className="text-[6px] uppercase font-black text-muted-foreground">Matricule</p>
                            <p className="text-[10px] font-mono font-black text-secondary">{user?.id}</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[6px] uppercase font-black text-muted-foreground">Class</p>
                            <p className="text-[10px] font-black text-primary uppercase">{user?.class?.split(' / ')[0] || "Form 5"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary/5 p-2 px-4 flex justify-between items-center border-t border-accent shrink-0">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest">STUDENT ID CARD</span>
                      <Badge className="bg-secondary text-primary border-none text-[8px] font-black h-5 px-2">2023 - 2024</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex flex-col sm:flex-row gap-3 shrink-0">
              <Button variant="outline" className="flex-1 rounded-xl font-bold h-12" onClick={() => setViewingDoc(null)}>Close Preview</Button>
              <Button className="flex-1 rounded-xl font-black uppercase text-xs h-12 shadow-lg gap-2" onClick={() => handleDownload(viewingDoc.title)}>
                <Download className="w-4 h-4" /> Download Official Copy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary font-headline uppercase">Academic Gradebook</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-12 px-6 font-bold" onClick={() => toast({ title: "Registry Exported" })}><FileDown className="w-4 h-4 mr-2" /> PDF</Button>
          {isTeacher && <Button className="rounded-xl h-12 px-10 font-black uppercase tracking-widest text-[10px] shadow-lg" onClick={() => toast({ title: "Committed" })}><Save className="w-4 h-4 mr-2" /> Save Sequence</Button>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2 w-full"><Label className="text-[9px] font-black uppercase text-primary ml-1">Class Level</Label><Select value={selectedClass} onValueChange={setSelectedClass}><SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
        <div className="flex-1 space-y-2 w-full"><Label className="text-[9px] font-black uppercase text-primary ml-1">Subject</Label><Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
        <div className="flex-1 space-y-2 w-full"><Label className="text-[9px] font-black uppercase text-primary ml-1">Sequence</Label><Select value={activeSequence} onValueChange={(v: any) => setActiveSequence(v)}><SelectTrigger className="h-11 bg-secondary/20 border-none rounded-xl font-black text-primary"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="seq1">Sequence 1</SelectItem><SelectItem value="seq2">Sequence 2</SelectItem></SelectContent></Select></div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="bg-primary p-8 text-white"><CardTitle className="text-xl font-black uppercase">Gradebook: {selectedSubject}</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10 font-black text-[9px] uppercase border-b">
              <TableRow><TableHead className="pl-8 py-4">Student Identity</TableHead><TableHead className="text-center">Seq 1</TableHead><TableHead className="text-center">Seq 2</TableHead><TableHead className="text-right pr-8">Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {grades.map(s => (
                <TableRow key={s.uid} className="h-16 border-b last:border-0 hover:bg-accent/5">
                  <TableCell className="pl-8"><div className="flex items-center gap-3"><Avatar className="h-8 w-8 shrink-0"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar><span className="font-bold text-xs uppercase">{s.name}</span></div></TableCell>
                  <TableCell className="text-center"><Input className="w-16 mx-auto h-9 text-center font-black border-primary/10" defaultValue={s.seq1} disabled={!isTeacher || activeSequence !== 'seq1'} /></TableCell>
                  <TableCell className="text-center"><Input className="w-16 mx-auto h-9 text-center font-black border-primary/10" defaultValue={s.seq2} disabled={!isTeacher || activeSequence !== 'seq2'} /></TableCell>
                  <TableCell className="text-right pr-8"><Badge className="bg-green-100 text-green-700">PASS</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function TranscriptPreview({ student, platform }: { student: any, platform: any }) {
  const currentGrade = student?.class || "2nde / Form 5";
  const classIndex = CLASSES.indexOf(currentGrade);
  const visibleClasses = CLASSES.slice(0, classIndex + 1);

  return (
    <div className="bg-white p-8 md:p-12 border shadow-sm relative overflow-hidden font-serif text-black min-w-[1100px]">
      <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
        <div className="space-y-1 text-[9px] uppercase font-black text-left">
          <p>Republic of Cameroon</p><p>Peace - Work - Fatherland</p><div className="h-px bg-black w-10 mx-auto my-1" /><p>Ministry of Secondary Education</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img src={platform.logo} alt="Logo" className="w-14 h-14 object-contain" /><p className="text-[9px] font-black uppercase text-primary tracking-tighter">Verified Node Record</p>
        </div>
        <div className="space-y-1 text-[9px] uppercase font-black text-right"><p>République du Cameroun</p><p>Paix - Travail - Patrie</p></div>
      </div>
      <div className="text-center my-10 space-y-2"><h1 className="text-4xl font-black uppercase tracking-widest underline underline-offset-8 decoration-double">Academic Transcript</h1><p className="text-sm font-bold opacity-60">Session 2023 / 2024</p></div>
      <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center mb-10">
        <div className="col-span-2">
          <Avatar className="w-28 h-28 border-4 border-white rounded-[2rem] shadow-xl mx-auto"><AvatarImage src={student?.avatar} /><AvatarFallback className="text-3xl font-black">{student?.name?.charAt(0)}</AvatarFallback></Avatar>
        </div>
        <div className="col-span-10 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[9px]">Identity:</span><span className="font-black uppercase">{student?.name}</span></div>
          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[9px]">Matricule:</span><span className="font-mono font-bold text-primary">{student?.id}</span></div>
        </div>
      </div>
      <div className="border-2 border-black overflow-hidden rounded-sm">
        <Table className="border-collapse">
          <TableHeader className="bg-black/5">
            <TableRow className="border-b-2 border-black h-12">
              <TableHead rowSpan={2} className="border-r-2 border-black font-black text-black uppercase text-[10px] text-center w-48">Subject</TableHead>
              {visibleClasses.map((cls, i) => (
                <TableHead key={i} colSpan={3} className={cn("border-r-2 border-black font-black text-black uppercase text-[10px] text-center h-8", i === visibleClasses.length - 1 ? "border-r-0" : "")}>{cls.split(' / ')[1] || cls}</TableHead>
              ))}
            </TableRow>
            <TableRow className="border-b-2 border-black h-8">
              {visibleClasses.map((_, i) => (
                <React.Fragment key={i}>
                  <TableHead className="border-r border-black font-bold text-[8px] text-center">T1</TableHead>
                  <TableHead className="border-r border-black font-bold text-[8px] text-center">T2</TableHead>
                  <TableHead className={cn("border-r-2 border-black font-bold text-[8px] text-center", i === visibleClasses.length - 1 ? "border-r-0" : "")}>T3</TableHead>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(MOCK_TRANSCRIPT_DATA).map(([subject, years]: [string, any], idx) => (
              <TableRow key={idx} className="border-b border-black last:border-0 h-10">
                <TableCell className="border-r-2 border-black font-black text-[10px] uppercase py-2 pl-4">{subject}</TableCell>
                {visibleClasses.map((_, i) => { 
                  const data = years[`f${i + 1}`] || ["---", "---", "---"]; 
                  return (
                    <React.Fragment key={i}>
                      <TableCell className="border-r border-black text-center text-[10px] font-mono">{data[0]}</TableCell>
                      <TableCell className="border-r border-black text-center text-[10px] font-mono">{data[1]}</TableCell>
                      <TableCell className={cn("border-r-2 border-black text-center text-[10px] font-mono bg-accent/5", i === visibleClasses.length - 1 ? "border-r-0" : "")}>{data[2]}</TableCell>
                    </React.Fragment>
                  ); 
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
