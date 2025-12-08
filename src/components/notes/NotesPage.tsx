import { useState } from "react";
import { FileText, Plus, Trash2, Edit2, Save, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
}

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Indonesian", "General"];

export const NotesPage = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Quadratic Equations",
      content: "The quadratic formula: x = (-b ± √(b²-4ac)) / 2a\n\nUsed to solve equations in the form ax² + bx + c = 0",
      subject: "Mathematics",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Newton's Laws of Motion",
      content: "1. An object at rest stays at rest\n2. F = ma (Force = mass × acceleration)\n3. Every action has an equal and opposite reaction",
      subject: "Physics",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    subject: "General",
  });

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "all" || note.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNote = () => {
    setIsCreating(true);
    setSelectedNote(null);
    setEditForm({ title: "", content: "", subject: "General" });
  };

  const handleSaveNewNote = () => {
    if (!editForm.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your note",
        variant: "destructive",
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: editForm.title,
      content: editForm.content,
      subject: editForm.subject,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setIsCreating(false);
    setSelectedNote(newNote);
    toast({
      title: "Success",
      description: "Note created successfully!",
    });
  };

  const handleEditNote = () => {
    if (!selectedNote) return;
    setIsEditing(true);
    setEditForm({
      title: selectedNote.title,
      content: selectedNote.content,
      subject: selectedNote.subject,
    });
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id
        ? { ...note, ...editForm, updatedAt: new Date() }
        : note
    );

    setNotes(updatedNotes);
    setSelectedNote({ ...selectedNote, ...editForm, updatedAt: new Date() });
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Note updated successfully!",
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
    toast({
      title: "Deleted",
      description: "Note has been deleted",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and organise your study notes
          </p>
        </div>
        <Button onClick={handleCreateNote} className="gap-2">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search & Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="glass-card p-6 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No notes found</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                  className={`glass-card p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedNote?.id === note.id ? "border-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{note.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.subject}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {note.content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated: {note.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2">
          {isCreating ? (
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">New Note</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveNewNote}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              <Input
                placeholder="Note title..."
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="text-lg font-semibold"
              />
              
              <select
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              
              <Textarea
                placeholder="Write your note here..."
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="min-h-[400px] resize-none"
              />
            </div>
          ) : selectedNote ? (
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="text-xl font-bold"
                  />
                ) : (
                  <h3 className="font-display text-xl font-bold">{selectedNote.title}</h3>
                )}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleEditNote}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <>
                  <select
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <Textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="min-h-[400px] resize-none"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                      {selectedNote.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Updated: {selectedNote.updatedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-muted-foreground min-h-[400px]">
                    {selectedNote.content}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Select a Note</h3>
              <p className="text-muted-foreground">
                Choose a note from the list or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
