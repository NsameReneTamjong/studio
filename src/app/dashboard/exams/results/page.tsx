
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Printer, 
  Download, 
  Building2, 
  User, 
  Calendar,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExamResultsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("id");

  // Mock Result Data
  const result = {
    examTitle: "Mid-Term Physics MCQ",
    subject: "Advanced Physics",
    score: 18,
    total: 20,
    percentage: 90,
    passed: true,
    date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR'),
    studentName: user?.name || "John Doe",
    studentId: user?.id || "S123",
    schoolName: "Lycée de Joss",
    certificateNo: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      <div className="flex items-center justify-between no-print">
        <Button variant="ghost" onClick={() => router.push('/dashboard/exams')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Exams
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" /> {language === 'en' ? 'Print' : 'Imprimer'}
          </Button>
          <Button className="gap-2 shadow-lg">
            <Download className="w-4 h-4" /> {t("download")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
        <Card className="lg:col-span-1 border-none shadow-sm bg-primary text-white overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
               <div className={cn(
                 "p-4 rounded-full",
                 result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
               )}>
                 {result.passed ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
               </div>
            </div>
            <CardTitle className="text-2xl font-black">{result.passed ? t("passed") : t("failed")}</CardTitle>
            <CardDescription className="text-white/60">{result.examTitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/10">
               <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest mb-1">{t("score")}</p>
               <h2 className="text-5xl font-black text-secondary">{result.score} <span className="text-xl text-white/30">/ {result.total}</span></h2>
               <div className="mt-4 flex items-center justify-center gap-2">
                  <Badge className="bg-white/20 text-white border-none">{result.percentage}%</Badge>
                  <span className="text-xs text-white/60">Passing: 50%</span>
               </div>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="opacity-60">Subject</span>
                 <span className="font-bold">{result.subject}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="opacity-60">Attempt Date</span>
                 <span className="font-bold">{result.date}</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8 border-2 border-dashed border-accent rounded-3xl bg-accent/5">
            <Award className="w-16 h-16 text-secondary opacity-30" />
            <div>
              <h3 className="text-xl font-bold text-primary">View Your Official Certificate Below</h3>
              <p className="text-muted-foreground text-sm max-w-md">This temporal certificate is valid for institutional verification until your final grades are validated.</p>
            </div>
            <Button variant="secondary" onClick={() => {
              const el = document.getElementById('certificate-print');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>Scroll to Preview</Button>
          </div>
        </div>
      </div>

      {/* CERTIFICATE PREVIEW - Printable */}
      <div id="certificate-print" className="bg-white p-4 md:p-12 border-none shadow-2xl max-w-4xl mx-auto font-serif text-black relative overflow-hidden print:shadow-none print:border-none">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
          <GraduationCap className="w-96 h-96" />
        </div>
        <div className="absolute inset-4 border-8 border-double border-primary/20 pointer-events-none" />
        <div className="absolute inset-8 border border-primary/10 pointer-events-none" />

        <div className="relative z-10 space-y-12">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <Building2 className="w-16 h-16 text-primary/40" />
            <div className="space-y-1 uppercase tracking-tighter">
              <h4 className="text-sm font-bold opacity-60">Republic of Cameroon</h4>
              <h2 className="text-2xl font-black text-primary tracking-tight">{result.schoolName}</h2>
              <div className="h-px bg-primary/20 w-32 mx-auto my-2" />
            </div>
          </div>

          {/* Body */}
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black italic text-primary uppercase tracking-tighter">Certificate of Achievement</h1>
              <p className="text-lg font-medium italic opacity-60">This temporal certificate is proudly presented to:</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-5xl font-black underline decoration-secondary decoration-4 underline-offset-8">{result.studentName}</h2>
              <p className="font-mono text-sm opacity-60 font-bold uppercase tracking-widest">Matricule: {result.studentId}</p>
            </div>

            <div className="max-w-xl mx-auto leading-relaxed text-lg">
              For successfully completing the <span className="font-bold text-primary">{result.examTitle}</span> in the subject of <span className="font-bold text-primary">{result.subject}</span> with a cumulative score of <span className="font-black text-secondary">{result.score} out of {result.total}</span>.
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-20 pt-12 items-end">
            <div className="text-center space-y-4">
              <div className="h-px bg-black/20 w-full" />
              <div>
                <p className="font-bold text-xs uppercase tracking-widest">Date Issued</p>
                <p className="font-black text-lg">{result.date}</p>
              </div>
            </div>
            <div className="text-center space-y-4 relative">
              <div className="absolute top-[-80px] left-1/2 -translate-x-1/2">
                <ShieldCheck className="w-24 h-24 text-primary opacity-[0.05] rotate-12" />
              </div>
              <div className="h-px bg-black/20 w-full" />
              <div>
                <p className="font-bold text-xs uppercase tracking-widest">Verification ID</p>
                <p className="font-mono font-black text-lg text-primary">{result.certificateNo}</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
             <p className="text-[10px] uppercase font-bold opacity-30 italic">Generated via EduNexus SaaS Platform - Official Digital Document</p>
          </div>
        </div>
      </div>
    </div>
  );
}
