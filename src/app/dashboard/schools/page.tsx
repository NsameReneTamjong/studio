
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search, Users, ShieldCheck, Globe, MoreVertical, MapPin, X } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MOCK_SCHOOLS = [
  { id: "S001", name: "Lycée de Joss", domain: "joss.cm", admins: 3, students: 1200, status: "Active", address: "Douala, Littoral", lat: 4.0435, lng: 9.7085 },
  { id: "S002", name: "GBHS Yaoundé", domain: "gbhs.yaounde.edu", admins: 5, students: 2850, status: "Active", address: "Yaoundé, Centre", lat: 3.8480, lng: 11.5021 },
  { id: "S003", name: "BUEA University", domain: "ubuea.cm", admins: 12, students: 4500, status: "Active", address: "Buea, South West", lat: 4.1550, lng: 9.2435 },
  { id: "S004", name: "Lycée de Maroua", domain: "maroua.edu", admins: 2, students: 900, status: "Suspended", address: "Maroua, Far North", lat: 10.5916, lng: 14.3155 },
];

export default function SchoolsManagementPage() {
  const { t, language } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMapSchool, setSelectedMapSchool] = useState<any>(null);

  const filteredSchools = MOCK_SCHOOLS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">
            {language === 'en' ? "SaaS School Management" : "Gestion SaaS des Écoles"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' ? "Onboard and manage educational institutions across the platform." : "Embarquez et gérez les institutions éducatives sur la plateforme."}
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg">
              <Plus className="w-4 h-4" /> {t("addSchool")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("addSchool")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{language === 'en' ? "School Name" : "Nom de l'École"}</Label>
                <Input id="name" placeholder="e.g. Lycée de Joss" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="domain">Domain</Label>
                <Input id="domain" placeholder="school.edu" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">{language === 'en' ? "Address" : "Adresse"}</Label>
                <Input id="address" placeholder="City, Region" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsAddModalOpen(false)}>{t("save")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={language === 'en' ? "Search institutions by name or domain..." : "Chercher par nom ou domaine..."}
            className="pl-10 border-none bg-transparent focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4"/></Button>
            </div>
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{school.name}</CardTitle>
                  <Badge variant={school.status === "Active" ? "default" : "destructive"} className="text-[10px] h-4">
                    {school.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                  <Globe className="w-3 h-3" /> {school.domain}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="py-4 border-y border-accent/50 space-y-4 bg-accent/5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" /> Admins
                </div>
                <span className="font-bold">{school.admins}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" /> Students
                </div>
                <span className="font-bold">{school.students.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {language === 'en' ? "Location" : "Localisation"}
                </div>
                <span className="text-xs truncate max-w-[150px]">{school.address}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 gap-2">
              <Button variant="outline" size="sm" className="flex-1">Manage</Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-1 flex-1"
                onClick={() => setSelectedMapSchool(school)}
              >
                <MapPin className="w-3 h-3" /> {t("viewMap")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Mock Google Maps Dialog */}
      <Dialog open={!!selectedMapSchool} onOpenChange={() => setSelectedMapSchool(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <div className="bg-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <div>
                <h3 className="font-bold">{selectedMapSchool?.name}</h3>
                <p className="text-xs opacity-80">{selectedMapSchool?.address}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedMapSchool(null)} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="aspect-video bg-accent/20 relative flex items-center justify-center overflow-hidden">
            {/* Real Google Maps would go here in an iframe or SDK. 
                Using a placeholder with a distinct hint for AI image substitution if needed. */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
            <div className="z-10 text-center space-y-4">
              <div className="bg-white p-4 rounded-full shadow-2xl inline-block animate-bounce">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">GPS Coordinates</p>
                <p className="font-bold text-primary">{selectedMapSchool?.lat}, {selectedMapSchool?.lng}</p>
              </div>
            </div>
            <img 
              src={`https://picsum.photos/seed/${selectedMapSchool?.id}/800/450`} 
              alt="Map view"
              className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
              data-ai-hint="satellite map"
            />
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg border text-[10px] font-bold">
               Google Maps (Mock)
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
