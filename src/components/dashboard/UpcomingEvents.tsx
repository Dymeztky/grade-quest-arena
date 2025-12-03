import { Calendar, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  type: "exam" | "quiz" | "assignment";
  daysLeft: number;
}

const events: Event[] = [
  {
    id: "1",
    title: "Ujian Tengah Semester",
    subject: "Matematika",
    date: "15 Des 2025",
    time: "08:00",
    type: "exam",
    daysLeft: 12,
  },
  {
    id: "2",
    title: "Kuis Bab 5",
    subject: "Fisika",
    date: "10 Des 2025",
    time: "10:30",
    type: "quiz",
    daysLeft: 7,
  },
  {
    id: "3",
    title: "Tugas Praktikum",
    subject: "Kimia",
    date: "8 Des 2025",
    time: "14:00",
    type: "assignment",
    daysLeft: 5,
  },
];

const typeStyles = {
  exam: "border-l-destructive bg-destructive/5",
  quiz: "border-l-gold bg-gold/5",
  assignment: "border-l-primary bg-primary/5",
};

const typeBadgeStyles = {
  exam: "bg-destructive/20 text-destructive",
  quiz: "bg-gold/20 text-gold",
  assignment: "bg-primary/20 text-primary",
};

export const UpcomingEvents = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-display text-xl font-bold">Jadwal Mendatang</h3>
        </div>
        <button className="text-sm text-primary hover:underline">Kalender</button>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={cn(
              "p-4 rounded-lg border-l-4 transition-all hover:translate-x-1",
              typeStyles[event.type]
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {event.subject}
                </p>
              </div>
              <span className={cn("px-2 py-0.5 text-xs rounded-full font-semibold", typeBadgeStyles[event.type])}>
                {event.type === "exam" ? "Ujian" : event.type === "quiz" ? "Kuis" : "Tugas"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {event.time}
                </span>
              </div>
              <span className={cn(
                "font-display font-bold",
                event.daysLeft <= 3 ? "text-destructive" : event.daysLeft <= 7 ? "text-gold" : "text-muted-foreground"
              )}>
                {event.daysLeft} hari lagi
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
