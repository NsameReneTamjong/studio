
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { LoadingState, CardSkeleton } from "@/components/shared/loading-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, 
  CheckCircle2, 
  Eye, 
  Loader2, 
  Printer, 
  ShieldCheck, 
  History, 
  FileText, 
  User, 
  TrendingUp, 
  X, 
  Scale, 
  BookMarked, 
  Globe, 
  CheckCircle, 
  Info, 
  ArrowLeft, 
  Users, 
  PenTool,
  Filter,
  Signature
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOCK_STUDENTS = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s1/100/100", dob: "15/05/2008" },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s2/100/100", dob: "22/11/2006" },
];

export default function GradeBookPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    // Simulated pedagogical cycle fetch
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-accent/20 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-accent/20 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <Card className="p-8 border-none shadow-sm h-96 bg-accent/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              Grade Registry
            </h1>
            <p className="text-muted-foreground mt-1">Official term records and pedagogical achievement tracking.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Active Cycle Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">14.25 / 20</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Class Standing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">4th / 45</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white border">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Verified Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5 text-secondary" /> ALL SECURE
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="bg-primary p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <PenTool className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-black">Student Results Ledger</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10">
              <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                <TableHead className="pl-8 py-4">Matricule</TableHead>
                <TableHead>Student Identity</TableHead>
                <TableHead className="text-center">Sequence 1</TableHead>
                <TableHead className="text-center">Sequence 2</TableHead>
                <TableHead className="text-right pr-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_STUDENTS.map((s) => (
                <TableRow key={s.uid} className="hover:bg-accent/5">
                  <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                  <TableCell className="font-bold text-sm text-primary">{s.name}</TableCell>
                  <TableCell className="text-center font-black">14.50</TableCell>
                  <TableCell className="text-center font-black">16.00</TableCell>
                  <TableCell className="text-right pr-8">
                    <Badge className="bg-green-100 text-green-700 border-none">PASSED</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
