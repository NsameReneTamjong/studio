
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  MessageCircle, 
  ArrowRight, 
  Quote, 
  Video, 
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  Globe,
  Users,
  Send,
  Loader2,
  MapPin,
  Briefcase,
  School,
  Phone,
  Mail,
  ShieldCheck,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

// --- DATA STRUCTURES ---

interface EventItem {
  id: string;
  type: "video" | "image";
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
}

const EVENTS: EventItem[] = [
  {
    id: "e1",
    type: "video",
    title: "Annual Pedagogical Conference 2024",
    description: "Witness the digital transformation journey of 120+ schools across the region.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
  },
  {
    id: "e2",
    type: "image",
    title: "New STEM Laboratory Launch",
    description: "Inaugurating state-of-the-art facilities at GBHS Deido to empower future engineers.",
    url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop",
  },
  {
    id: "e3",
    type: "video",
    title: "Student Leadership Summit",
    description: "Highlights from our quarterly summit where student leaders discuss the future of education.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "e4",
    type: "image",
    title: "Community Outreach Program",
    description: "Bridging the gap between technology and traditional learning in rural communities.",
    url: "https://images.unsplash.com/photo-1524178232363-1fb28f74b671?q=80&w=2070&auto=format&fit=crop",
  }
];

const FEATURED_TESTIMONIES = [
  {
    id: "demo-1",
    name: "Alice Thompson",
    role: "STUDENT",
    schoolName: "GBHS Deido",
    profileImage: "https://picsum.photos/seed/s1/150/150",
    message: "The digital report cards are so professional! My parents are very happy with the transparency and I can track my GPA in real-time.",
    stars: 5
  },
  {
    id: "demo-2",
    name: "Principal Fonka",
    role: "SCHOOL_ADMIN",
    schoolName: "Lycée de Joss",
    profileImage: "https://picsum.photos/seed/p1/150/150",
    message: "Managing a school of 2,500 students has never been easier. The Governance Logs and Fee Tracker give me total control over institutional health.",
    stars: 5
  },
  {
    id: "demo-3",
    name: "Mr. Robert Thompson",
    role: "PARENT",
    schoolName: "GBHS Deido",
    profileImage: "https://picsum.photos/seed/pa1/150/150",
    message: "No more queues at the bursary. I pay fees from my phone and get a verified receipt instantly. EduIgnite is a blessing for busy parents.",
    stars: 5
  },
  {
    id: "demo-4",
    name: "Dr. Aris Tesla",
    role: "TEACHER",
    schoolName: "GBHS Deido",
    profileImage: "https://picsum.photos/seed/t1/150/150",
    message: "The AI feedback tool saves me hours of grading. I can now provide deep, personalized academic guidance to every single one of my students.",
    stars: 5
  }
];

export default function CommunityTestimonyPage() {
  const [mounted, setMounted] = useState(false);
  const { testimonials, addOrder } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    occupation: "",
    schoolName: "",
    whatsappNumber: "",
    email: "",
    region: "",
    division: "",
    subDivision: ""
  });

  // Filter approved testimonials from local context and combine with featured
  const approvedFromContext = testimonials?.filter(t => t.status === "approved") || [];
  const allTestimonies = [...FEATURED_TESTIMONIES, ...approvedFromContext];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Prototype Delay
    setTimeout(() => {
      addOrder(formData);
      setIsProcessing(false);
      toast({
        title: "Order Received",
        description: "Your request has been submitted to the Super Admin.",
      });
      setFormData({
        fullName: "",
        occupation: "",
        schoolName: "",
        whatsappNumber: "",
        email: "",
        region: "",
        division: "",
        subDivision: ""
      });
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] selection:bg-secondary selection:text-primary">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-primary/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl shadow-lg transition-transform group-hover:rotate-3">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-primary font-headline tracking-tighter">
              EduIgnite Community
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <a href="#events" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Events</a>
            <a href="#testimonies" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Testimonies</a>
            <a href="#order" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Place Order</a>
            <Button asChild variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 font-bold">
              <Link href="/login">Get Access</Link>
            </Button>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Users className="w-6 h-6 text-primary" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-32">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-10 duration-1000">
          <Badge className="bg-secondary/20 text-primary border-none font-black uppercase tracking-[0.2em] px-4 py-1">
            Global Impact
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-primary font-headline tracking-tighter leading-none">
            Voices from the Future of <span className="text-secondary underline decoration-primary/10 decoration-8 underline-offset-8">Education</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
            EduIgnite is more than a platform; it's a movement. Explore how our digital nodes are empowering schools, teachers, and students across the nation.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Button size="lg" className="rounded-2xl h-14 px-8 bg-primary shadow-2xl font-black uppercase tracking-widest text-xs gap-2 group" asChild>
              <a href="#order">Join the Network <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></a>
            </Button>
          </div>
        </section>

        {/* 2. EVENT SECTION */}
        <section id="events" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-primary uppercase tracking-tighter flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-secondary" />
                Featured Institutional Events
              </h2>
              <p className="text-muted-foreground font-medium">Capturing the moments that define our academic evolution.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {EVENTS.map((event, idx) => (
              <Card key={event.id} className={cn(
                "border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white/50 backdrop-blur-sm",
                "animate-in fade-in slide-in-from-bottom-10"
              )} style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="aspect-video relative bg-slate-900">
                  {event.type === "video" ? (
                    <iframe 
                      src={event.url} 
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <img src={event.url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  )}
                </div>
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-black text-primary leading-tight group-hover:text-secondary transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-muted-foreground leading-relaxed mt-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. TESTIMONY SECTION */}
        <section id="testimonies" className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">What People Say</h2>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto">
              Real stories from the individuals powering our educational ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allTestimonies.map((test, idx) => (
              <Card 
                key={test.id} 
                className={cn(
                  "border-none shadow-lg rounded-[2rem] bg-white group hover:-translate-y-2 transition-all duration-500 animate-in zoom-in-95",
                  "fade-in slide-in-from-bottom-8"
                )}
                style={{ animationDelay: `${idx * 100}ms`, animationDuration: '800ms' }}
              >
                <CardContent className="p-8 space-y-6 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-accent rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <Quote className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm italic font-medium leading-relaxed text-primary/80 flex-1">
                    "{test.message}"
                  </p>

                  <div className="pt-6 border-t flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-1 ring-accent">
                      <AvatarImage src={test.profileImage} />
                      <AvatarFallback className="bg-primary/5 text-primary font-black uppercase text-xs">
                        {test.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-black text-primary text-sm truncate uppercase tracking-tight">{test.name}</p>
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[8px] font-black h-4 px-1.5 shrink-0">
                          {test.role}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-bold truncate">@ {test.schoolName}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. PLACE ORDER FORM SECTION */}
        <section id="order" className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-primary p-3 rounded-2xl shadow-xl">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">EduIgnite</h2>
            </div>
            <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">Place Your Order</h2>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto italic">
              "Fueling the digital transformation of education across Africa. Join the network of modern institutions."
            </p>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-white animate-in zoom-in-95 duration-1000">
            <form onSubmit={handleOrderSubmit}>
              <CardContent className="p-8 md:p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Individual Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-accent pb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-black uppercase text-primary tracking-widest">Personal Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Full Name</Label>
                        <Input required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Occupation</Label>
                        <Input required value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Email</Label>
                        <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">WhatsApp Number</Label>
                        <Input required value={formData.whatsappNumber} onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                      </div>
                    </div>
                  </div>

                  {/* Institution Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-accent pb-2">
                      <School className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-black uppercase text-primary tracking-widest">Institution</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">School Name</Label>
                        <Input required value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Region</Label>
                        <Input required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Division</Label>
                        <Input required value={formData.division} onChange={(e) => setFormData({...formData, division: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sub Division</Label>
                        <Input required value={formData.subDivision} onChange={(e) => setFormData({...formData, subDivision: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 md:p-12 bg-accent/10 border-t border-accent flex flex-col items-center gap-6">
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-16 h-16 rounded-2xl bg-primary shadow-2xl font-black uppercase tracking-widest gap-3 transition-transform active:scale-95">
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  Submit My Order
                </Button>
              </CardFooter>
            </form>
          </Card>
        </section>
      </main>

      <footer className="py-12 border-t border-primary/5 bg-white opacity-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4" />
            <span>EduIgnite SaaS Node</span>
          </div>
          <span>© 2024 EDUIGNITE SECURE INFRASTRUCTURE</span>
        </div>
      </footer>
    </div>
  );
}
