import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Trash2, Clock, BookOpen, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "exam" | "assignment" | "study" | "other";
  subject?: string;
}

const eventTypeColors = {
  exam: "bg-red-500/20 text-red-500 border-red-500/30",
  assignment: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  study: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  other: "bg-muted text-muted-foreground border-border",
};

const eventTypeLabels = {
  exam: "Exam",
  assignment: "Assignment",
  study: "Study Session",
  other: "Other",
};

export const SchedulePage = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "09:00",
    type: "study" as ScheduleEvent["type"],
    subject: "",
  });

  // Load events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("academix-schedule");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  // Save events to localStorage
  const saveEvents = (newEvents: ScheduleEvent[]) => {
    localStorage.setItem("academix-schedule", JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the title",
        variant: "destructive",
      });
      return;
    }

    const event: ScheduleEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: newEvent.time,
      type: newEvent.type,
      subject: newEvent.subject || undefined,
    };

    saveEvents([...events, event]);
    setNewEvent({ title: "", time: "09:00", type: "study", subject: "" });
    setIsDialogOpen(false);
    toast({
      title: "Event Added",
      description: `"${event.title}" has been added to your schedule`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    saveEvents(events.filter((e) => e.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "Event has been removed from your schedule",
    });
  };

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            My Schedule
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your academic calendar and activities
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              ← Previous
            </Button>
            <h2 className="font-display text-xl font-bold">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button variant="ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              Next →
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: days[0].getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {days.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <Dialog key={day.toISOString()} open={isDialogOpen && isSelected} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setSelectedDate(day)}
                      className={`
                        aspect-square p-1 rounded-lg transition-all relative
                        ${isToday(day) ? "bg-primary/20 border border-primary" : "hover:bg-secondary"}
                        ${isSelected ? "ring-2 ring-primary" : ""}
                      `}
                    >
                      <span className={`text-sm ${isToday(day) ? "font-bold text-primary" : ""}`}>
                        {format(day, "d")}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                event.type === "exam" ? "bg-red-500" :
                                event.type === "assignment" ? "bg-orange-500" :
                                event.type === "study" ? "bg-blue-500" : "bg-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </DialogTitle>
                    </DialogHeader>
                    
                    {/* Events for selected date */}
                    {selectedDate && getEventsForDate(selectedDate).length > 0 && (
                      <div className="space-y-2 mb-4">
                        {getEventsForDate(selectedDate).map((event) => (
                          <div key={event.id} className={`flex items-center justify-between p-3 rounded-lg border ${eventTypeColors[event.type]}`}>
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-xs opacity-70">{event.time} • {eventTypeLabels[event.type]}</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Event Form */}
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          placeholder="Event title..."
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select value={newEvent.type} onValueChange={(value: ScheduleEvent["type"]) => setNewEvent({ ...newEvent, type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exam">Exam</SelectItem>
                              <SelectItem value="assignment">Assignment</SelectItem>
                              <SelectItem value="study">Study Session</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Subject (Optional)</Label>
                        <Input
                          placeholder="e.g., Mathematics"
                          value={newEvent.subject}
                          onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddEvent} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-muted-foreground">Exam</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-muted-foreground">Assignment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Study</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span className="text-sm text-muted-foreground">Other</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="glass-card p-6">
          <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Upcoming Events
          </h3>
          
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className={`p-3 rounded-lg border ${eventTypeColors[event.type]}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {format(new Date(event.date), "EEE, MMM d")} • {event.time}
                      </p>
                      {event.subject && (
                        <div className="flex items-center gap-1 mt-1">
                          <BookOpen className="w-3 h-3" />
                          <span className="text-xs">{event.subject}</span>
                        </div>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteEvent(event.id)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No upcoming events</p>
              <p className="text-xs text-muted-foreground mt-1">Click on a date to add events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
