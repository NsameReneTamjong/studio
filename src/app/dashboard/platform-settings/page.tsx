
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings2, 
  Save, 
  Loader2, 
  Coins, 
  Calendar, 
  GraduationCap, 
  User, 
  Presentation, 
  Briefcase, 
  Library, 
  ShieldCheck, 
  Clock,
  AlertCircle,
  Building2,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function PlatformSettingsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentFee: "5000",
    parentFee: "2500",
    teacherFee: "10000",
    bursarFee: "10000",
    librarianFee: "10000",
    adminFee: "25000",
    deadline: "2024-10-31",
  });

  const handleUpdateSettings = () => {
    setLoading(true);
    // Simulated update delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t("changesSaved"),
        description: "Global annual charges and payment deadlines have been updated across the platform.",
      });
    }, 1200);
  };

  const FeeInput = ({ 
    id, 
    label, 
    value, 
    onChange, 
    icon: Icon, 
    colorClass 
  }: { 
    id: string; 
    label: string; 
    value: string; 
    onChange: (val: string) => void;
    icon: any;
    colorClass: string;
  }) => (
    <div className="space-y-3 p-4 rounded-2xl bg-accent/30 border border-accent hover:border-primary/20 transition-all group">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Icon className={cn("w-3.5 h-3.5", colorClass)} />
          {label}
        </Label>
        <Badge variant="outline" className="text-[10px] font-bold border-primary/10 text-primary">ANNUAL</Badge>
      </div>
      <div className="relative">
        <Input 
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white border-none h-12 pl-12 rounded-xl focus-visible:ring-primary font-bold text-lg shadow-sm"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">
          XAF
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Settings2 className="w-6 h-6 text-secondary" />
            </div>
            {t("platformSettings")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure global SaaS revenue models, annual user charges, and institutional deadlines.
          </p>
        </div>
        <Button 
          onClick={handleUpdateSettings} 
          disabled={loading} 
          className="h-12 px-8 shadow-xl font-black uppercase tracking-widest text-xs gap-2 rounded-2xl"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Platform Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Annual Charges Section */}
          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-primary p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Coins className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">Annual Access Charges</CardTitle>
                  <CardDescription className="text-white/60">Define the yearly subscription fee per user role across all school nodes.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeeInput 
                  id="student-fee" 
                  label="Student Platform Fee" 
                  value={formData.studentFee} 
                  onChange={(v) => setFormData({...formData, studentFee: v})}
                  icon={GraduationCap}
                  colorClass="text-blue-600"
                />
                <FeeInput 
                  id="parent-fee" 
                  label="Parent Portal Fee" 
                  value={formData.parentFee} 
                  onChange={(v) => setFormData({...formData, parentFee: v})}
                  icon={User}
                  colorClass="text-amber-600"
                />
                <FeeInput 
                  id="teacher-fee" 
                  label="Teacher Licensing Fee" 
                  value={formData.teacherFee} 
                  onChange={(v) => setFormData({...formData, teacherFee: v})}
                  icon={Presentation}
                  colorClass="text-purple-600"
                />
                <FeeInput 
                  id="bursar-fee" 
                  label="Bursar Financial Access" 
                  value={formData.bursarFee} 
                  onChange={(v) => setFormData({...formData, bursarFee: v})}
                  icon={Coins}
                  colorClass="text-green-600"
                />
                <FeeInput 
                  id="librarian-fee" 
                  label="Librarian Module Fee" 
                  value={formData.librarianFee} 
                  onChange={(v) => setFormData({...formData, librarianFee: v})}
                  icon={Library}
                  colorClass="text-orange-600"
                />
                <FeeInput 
                  id="admin-fee" 
                  label="School Administrator Fee" 
                  value={formData.adminFee} 
                  onChange={(v) => setFormData({...formData, adminFee: v})}
                  icon={ShieldCheck}
                  colorClass="text-red-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Deadline Section */}
          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-accent/50 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-primary uppercase tracking-tighter">Unified Payment Deadline</CardTitle>
                  <CardDescription>All users must clear annual charges by this date to maintain active dashboard access.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Global Deadline</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                    <Input 
                      type="date" 
                      value={formData.deadline} 
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="h-14 bg-accent/30 border-none pl-12 rounded-2xl font-black text-primary focus-visible:ring-primary text-lg"
                    />
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Once this deadline passes, accounts with outstanding "SaaS Access" balances will be automatically flagged for license suspension across all nodes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Platform Policy Summary */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-primary to-primary/90 text-white rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Building2 className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-secondary" />
                Platform Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <p className="text-sm opacity-70 leading-relaxed font-medium">
                The EduIgnite SaaS model operates on a per-user, annual subscription basis. These charges fund the core infrastructure, AI processing units, and high-availability server instances.
              </p>
              
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-60">Subscription Model</span>
                  <Badge variant="secondary" className="bg-secondary text-primary border-none font-bold">Annual Renewal</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-60">Billing Cycle</span>
                  <span className="font-bold">Oct 2023 - Oct 2024</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-60">Enforcement</span>
                  <span className="font-bold text-green-400">Automatic Locking</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                   <ShieldCheck className="w-6 h-6 text-secondary" />
                   <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Verified SaaS Policy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Button variant="outline" className="w-full h-12 rounded-2xl gap-2 font-bold bg-white text-primary">
              Download Revenue Projection
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-2xl gap-2 font-bold bg-white text-primary">
              Export Global Arrears List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
