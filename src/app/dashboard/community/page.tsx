
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreVertical, 
  User, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  Ban, 
  Clock, 
  CheckCircle2, 
  UsersRound,
  FileText,
  TrendingUp,
  Activity,
  UserCheck,
  ShieldAlert,
  Mail,
  Calendar,
  MapPin,
  Fingerprint
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";

// Mock Community Data
const INITIAL_USERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", email: "alice.t@school.edu", avatar: "https://picsum.photos/seed/s1/100/100", status: "active", lastLogin: "2 hours ago", dept: "Science Section A" },
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", email: "aris.tesla@school.edu", avatar: "https://picsum.photos/seed/t1/100/100", status: "active", lastLogin: "10 mins ago", dept: "Physics Department" },
  { id: "B001", name: "Mme. Ngono Celine", role: "BURSAR", email: "celine.n@school.edu", avatar: "https://picsum.photos/seed/b1/100/100", status: "active", lastLogin: "Yesterday", dept: "Finance Office" },
  { id: "L001", name: "Mr. Ebong", role: "LIBRARIAN", email: "ebong.lib@school.edu", avatar: "https://picsum.photos/seed/l1/100/100", status: "suspended", lastLogin: "3 days ago", dept: "Resource Center" },
  { id: "S002", name: "Bob Richards", role: "STUDENT", email: "bob.r@school.edu", avatar: "https://picsum.photos/seed/s2/100/100", status: "active", lastLogin: "1 hour ago", dept: "Arts Section C" },
];

const MOCK_ACTIVITIES = [
  { id: 1, action: "Assignment Submitted", module: "Pedagogy", time: "Oct 24, 10:30 AM", detail: "Physics: Thermodynamics Lab", status: "Verified" },
  { id: 2, action: "Library Book Borrowed", module: "Library", time: "Oct 23, 02:15 PM", detail: "Calculus II (Ref: IGN-102)", status: "Verified" },
  { id: 3, action: "Fee Installment Paid", module: "Finance", time: "Oct 20, 09:00 AM", detail: "Amount: 50,000 XAF", status: "Verified" },
  { id: 4, action: "Exam Attempted", module: "Exams", time: "Oct 18, 11:00 AM", detail: "Mid-Term Physics MCQ", status: "Verified" },
  { id: 5, action: "Course Material Downloaded", module: "Courses", time: "Oct 15, 04:00 PM", detail: "Kinematics PDF", status: "Verified" },
];

const MOCK_CHART_DATA = [
  { day: 'Mon', engagement: 40 },
  { day: 'Tue', engagement: 65 },
  { day: 'Wed', engagement: 45 },
  { day: 'Thu', engagement: 90 },
  { day: 'Fri', engagement: 75 },
  { day: 'Sat', engagement: 20 },
  { day: 'Sun', engagement: 10 },
];

export default function CommunityPage() {
  const { language } = useI18n();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [viewingUser, setViewingUser] = useState<any>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspend = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    toast({
      title: "Status Updated",
      description: `User account status has been toggled.`,
    });
  };

  const handleDelete = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({
      variant: "destructive",
      title: "User Removed",
      description: "Member has been deleted from the institutional registry.",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-700';
      case 'TEACHER': return 'bg-purple-100 text-purple-700';
      case 'BURSAR': return 'bg-green-100 text-green-700';
      case 'LIBRARIAN': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <UsersRound className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? "Institutional Community" : "Communauté Institutionnelle"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor activity and manage all profiles within your school.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-accent flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground leading-none">Registered</p>
                <p className="text-lg font-black text-primary leading-tight">{users.length}</p>
              </div>
           </div>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, ID or role..." 
              className="pl-10 h-12 bg-accent/20 border-none rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/10 border-b border-accent/20 hover:bg-accent/10">
                <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Matricule</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">User Profile</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Role</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Last Activity</TableHead>
                <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id} className="group hover:bg-accent/5 border-b border-accent/10">
                  <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{u.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                        <AvatarImage src={u.avatar} alt={u.name} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">
                          {u.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary leading-none mb-1">{u.name}</span>
                        <span className="text-[10px] text-muted-foreground">{u.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px] border-none font-black uppercase tracking-tighter", getRoleColor(u.role))}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "text-[9px] font-black uppercase tracking-tighter border-none px-3",
                      u.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">
                    {u.lastLogin}
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-accent/50">
                        <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Management</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setViewingUser(u)}>
                          <Eye className="w-4 h-4 text-primary" /> {language === 'en' ? 'View Profile' : 'Voir Profil'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleSuspend(u.id)}>
                          {u.status === 'active' ? (
                            <><Ban className="w-4 h-4 text-amber-600" /> {language === 'en' ? 'Suspend' : 'Suspendre'}</>
                          ) : (
                            <><CheckCircle2 className="w-4 h-4 text-green-600" /> {language === 'en' ? 'Activate' : 'Réactiver'}</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:bg-destructive/5" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="w-4 h-4" /> {language === 'en' ? 'Delete User' : 'Supprimer'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Activity Insight Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="absolute top-4 right-12 flex items-center gap-2">
               <Fingerprint className="w-4 h-4 opacity-30" />
               <span className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Verified Digital ID</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="h-32 w-32 border-4 border-white shadow-2xl shrink-0">
                <AvatarImage src={viewingUser?.avatar} />
                <AvatarFallback className="text-4xl text-primary bg-white">{viewingUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <DialogTitle className="text-4xl font-black tracking-tight">{viewingUser?.name}</DialogTitle>
                    <Badge className="bg-secondary text-primary border-none font-black h-6">{viewingUser?.role}</Badge>
                  </div>
                  <DialogDescription className="text-white/60 text-lg flex items-center justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4"/> {viewingUser?.email}</span>
                    <span className="opacity-30">|</span>
                    <span className="flex items-center gap-1.5 font-mono">ID: {viewingUser?.id}</span>
                  </DialogDescription>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                   <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none gap-1.5 py-1 px-3">
                     <Building2 className="w-3.5 h-3.5" /> {viewingUser?.dept}
                   </Badge>
                   <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none gap-1.5 py-1 px-3">
                     <Calendar className="w-3.5 h-3.5" /> Joined Sept 2023
                   </Badge>
                   <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none gap-1.5 py-1 px-3">
                     <MapPin className="w-3.5 h-3.5" /> Main Campus
                   </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-8 space-y-10">
            {/* Participation Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
                <Card className="border-none bg-accent/30 p-6 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="p-2 bg-primary/10 rounded-xl w-fit text-primary">
                      <Activity className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest pt-2">Engagement</p>
                  </div>
                  <div className="pt-4">
                    <p className="text-4xl font-black text-primary">84%</p>
                    <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12% this week
                    </p>
                  </div>
                </Card>
                <Card className="border-none bg-accent/30 p-6 rounded-3xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="p-2 bg-primary/10 rounded-xl w-fit text-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest pt-2">Online Presence</p>
                  </div>
                  <div className="pt-4">
                    <p className="text-4xl font-black text-primary">42h</p>
                    <p className="text-[10px] text-muted-foreground font-bold italic">Total login duration</p>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-8">
                <Card className="border-none shadow-sm p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">Weekly Participation Intensity</h3>
                    <Badge variant="outline" className="text-[10px]">REAL-TIME TELEMETRY</Badge>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_CHART_DATA}>
                        <defs>
                          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis hide />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="engagement" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorEngagement)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>

            {/* Detailed Activity Log Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Full Institutional Footprint
                </h3>
                <Button variant="ghost" size="sm" className="text-xs gap-2">
                  <FileText className="w-3.5 h-3.5" /> Export Logs
                </Button>
              </div>
              
              <div className="border rounded-3xl overflow-hidden bg-white shadow-sm">
                <Table>
                  <TableHeader className="bg-accent/30">
                    <TableRow>
                      <TableHead className="pl-6 py-4 uppercase text-[10px] font-black">Event / Action</TableHead>
                      <TableHead className="uppercase text-[10px] font-black">Module</TableHead>
                      <TableHead className="uppercase text-[10px] font-black">Description</TableHead>
                      <TableHead className="uppercase text-[10px] font-black">Timestamp</TableHead>
                      <TableHead className="pr-6 text-right uppercase text-[10px] font-black">Integrity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_ACTIVITIES.map((act) => (
                      <TableRow key={act.id} className="hover:bg-accent/5">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                              <Activity className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-sm text-primary">{act.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter border-primary/10 text-primary/60">
                            {act.module}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground italic">
                          {act.detail}
                        </TableCell>
                        <TableCell className="text-[10px] font-mono font-bold text-muted-foreground">
                          {act.time}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <div className="inline-flex items-center gap-1 text-[10px] text-green-600 font-black">
                            <CheckCircle2 className="w-3 h-3" /> {act.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
               <ShieldCheck className="w-4 h-4 text-primary" />
               <p className="text-[10px] uppercase font-bold tracking-widest">Logs are cryptographically immutable</p>
            </div>
            <Button onClick={() => setViewingUser(null)} className="rounded-xl px-10 h-12 shadow-lg font-black uppercase tracking-widest text-xs">
              Close Dossier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
