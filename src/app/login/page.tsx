
"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShieldCheck, GraduationCap, Presentation, Building2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>("STUDENT");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-2xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary font-headline">EduNexus</h1>
          <p className="text-muted-foreground">Sign in to your institutional portal</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Select your role and enter credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={role === "STUDENT" ? "default" : "outline"} 
                className="flex flex-col h-auto py-3 gap-2"
                onClick={() => setRole("STUDENT")}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Student</span>
              </Button>
              <Button 
                variant={role === "TEACHER" ? "default" : "outline"} 
                className="flex flex-col h-auto py-3 gap-2"
                onClick={() => setRole("TEACHER")}
              >
                <Presentation className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Teacher</span>
              </Button>
              <Button 
                variant={role === "ADMIN" ? "default" : "outline"} 
                className="flex flex-col h-auto py-3 gap-2"
                onClick={() => setRole("ADMIN")}
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Admin</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Institutional Email</Label>
                <Input id="email" type="email" placeholder="name@edunexus.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-11 text-base font-semibold shadow-lg" onClick={() => login(role)}>
              Sign In as {role.charAt(0) + role.slice(1).toLowerCase()}
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} EduNexus School Management. All rights reserved.
        </p>
      </div>
    </div>
  );
}
