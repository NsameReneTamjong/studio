
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
  ShieldAlert
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

// Mock Community Data
const INITIAL_USERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", email: "alice.t@school.edu", avatar: "https://picsum.photos/seed/s1/100/100", status: "active", lastLogin: "2 hours ago" },
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", email: "aris.tesla@school.edu", avatar: "https://picsum.photos/seed/t1/100/100", status: "active", lastLogin: "10 mins ago" },
  { id: "B001", name: "Mme. Ngono Celine", role: "BURSAR", email: "celine.n@school.edu", avatar: "https://picsum.photos/seed/b1/100/100", status: "active", lastLogin: "Yesterday" },
  { id: "L001", name: "Mr. Ebong", role: "LIBRARIAN", email: "ebong.lib@school.edu", avatar: "https://picsum.photos/seed/l1/100/100", status: "suspended", lastLogin: "3 days ago" },
  { id: "S002", name: "Bob Richards", role: "STUDENT", email: "bob.r@school.edu", avatar: "https://picsum.photos/seed/s2/100/100", status: "active", lastLogin: "1 hour ago" },
];

const MOCK_ACTIVITIES = [
  { id: 1, action: "Assignment Submitted", module: "Pedagogy", time: "Oct 24, 10:30 AM", detail: "Physics: Thermodynamics Lab" },
  { id: 2, action: "Library Book Borrowed", module: "Library", time: "Oct 23, 02:15 PM", detail: "Calculus II (Ref: IGN-102)" },
  { id: 3, action: "Fee Installment Paid", module: "Finance", time: "Oct 20, 09:00 AM", detail: "Amount: 50,000 XAF" },
  { id: 4, action: "Exam Attempted", module: "Exams", time: "Oct 18, 11:00 AM", detail: "Mid-Term Physics MCQ" },
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
                          <Eye className="w-4 h-4 text-primary" /> {language === 'en' ? 'View Activities' : 'Voir Activités'}
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

      {/* User Activity Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="sm:max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-white/20 shadow-lg">
                <AvatarImage src={viewingUser?.avatar} />
                <AvatarFallback className="text-2xl text-primary bg-white">{viewingUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-3xl font-black tracking-tight">{viewingUser?.name}</DialogTitle>
                <DialogDescription className="text-white/60 flex items-center gap-2 mt-1">
                  <Badge className="bg-secondary text-primary border-none font-bold">{viewingUser?.role}</Badge>
                  <span>•</span>
                  <span>ID: {viewingUser?.id}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-accent/30 p-4 rounded-2xl text-center space-y-1">
                <Activity className="w-5 h-5 mx-auto text-primary" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Session Count</p>
                <p className="text-xl font-black">124</p>
              </div>
              <div className="bg-accent/30 p-4 rounded-2xl text-center space-y-1">
                <Clock className="w-5 h-5 mx-auto text-primary" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Online Time</p>
                <p className="text-xl font-black">42h</p>
              </div>
              <div className="bg-accent/30 p-4 rounded-2xl text-center space-y-1">
                <ShieldAlert className="w-5 h-5 mx-auto text-amber-600" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Flags</p>
                <p className="text-xl font-black text-amber-600">0</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Recent Institutional footprint
              </h3>
              <div className="space-y-3">
                {MOCK_ACTIVITIES.map((act) => (
                  <div key={act.id} className="flex items-start gap-4 p-4 bg-white border border-accent rounded-2xl hover:shadow-md transition-shadow">
                    <div className="p-2 bg-primary/5 rounded-xl">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-sm text-primary">{act.action}</p>
                        <span className="text-[10px] text-muted-foreground font-medium">{act.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{act.detail}</p>
                      <Badge variant="outline" className="text-[8px] h-4 mt-2 border-primary/10 text-primary/60">{act.module}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t flex justify-between items-center">
            <p className="text-[10px] text-muted-foreground italic max-w-[200px]">Logs are cryptographically verified for institutional audits.</p>
            <Button onClick={() => setViewingUser(null)} className="rounded-xl px-8 shadow-lg font-bold">
              Close History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
