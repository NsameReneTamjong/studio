
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search, Users, ShieldCheck, Globe, MoreVertical } from "lucide-react";

const MOCK_SCHOOLS = [
  { id: "S001", name: "Springfield High", domain: "springfield.edu", admins: 3, students: 1200, status: "Active" },
  { id: "S002", name: "Gotham Academy", domain: "gotham.edu", admins: 5, students: 850, status: "Active" },
  { id: "S003", name: "Metropolis University", domain: "metro.uni", admins: 12, students: 4500, status: "Active" },
  { id: "S004", name: "Starling Tech", domain: "starling.tech", admins: 2, students: 300, status: "Suspended" },
];

export default function SchoolsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">SaaS School Management</h1>
          <p className="text-muted-foreground mt-1">Onboard and manage educational institutions across the platform.</p>
        </div>
        <Button className="gap-2 shadow-lg">
          <Plus className="w-4 h-4" /> Onboard New School
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search institutions by name or domain..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_SCHOOLS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((school) => (
          <Card key={school.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{school.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {school.domain}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={school.status === "Active" ? "default" : "destructive"}>
                {school.status}
              </Badge>
            </CardHeader>
            <CardContent className="py-4 border-y border-accent/50 space-y-4">
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
            </CardContent>
            <CardFooter className="pt-4 justify-between">
              <Button variant="outline" size="sm">Manage Admins</Button>
              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4"/></Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
