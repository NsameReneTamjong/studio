
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TIMETABLE = {
  Monday: [
    { time: "09:00 AM", subject: "Advanced Physics", room: "Room 402", instructor: "Dr. Tesla" },
    { time: "02:00 PM", subject: "General Chemistry", room: "Lab C", instructor: "Dr. White" },
  ],
  Tuesday: [
    { time: "11:30 AM", subject: "Calculus II", room: "Room 201", instructor: "Prof. Smith" },
  ],
  Wednesday: [
    { time: "09:00 AM", subject: "Advanced Physics", room: "Room 402", instructor: "Dr. Tesla" },
    { time: "02:00 PM", subject: "General Chemistry", room: "Lab C", instructor: "Dr. White" },
  ],
  Thursday: [
    { time: "11:30 AM", subject: "Calculus II", room: "Room 201", instructor: "Prof. Smith" },
  ],
  Friday: [
    { time: "10:00 AM", subject: "English Literature", room: "Hall B", instructor: "Ms. Bennet" },
  ],
};

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Class Schedule</h1>
        <p className="text-muted-foreground mt-1">Your weekly academic timetable at a glance.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {DAYS.map((day) => (
          <div key={day} className="space-y-4">
            <h3 className="font-bold text-lg text-primary border-b pb-2">{day}</h3>
            <div className="space-y-3">
              {(TIMETABLE as any)[day].length > 0 ? (
                (TIMETABLE as any)[day].map((slot: any, idx: number) => (
                  <Card key={idx} className="border-none shadow-sm hover:ring-2 hover:ring-primary/20 transition-all">
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none mb-1">
                          {slot.time}
                        </Badge>
                        <h4 className="font-bold text-sm leading-tight">{slot.subject}</h4>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{slot.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{slot.instructor}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic py-4 text-center border rounded-lg border-dashed">
                  No classes scheduled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
