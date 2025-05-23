
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Note = {
  id: string;
  title: string;
  excerpt: string;
  updated: string;
  content: string;
  tags: string[];
};

interface NoteEditorProps {
  note?: Note;
  onSave?: (note: Note) => void;
  standalone?: boolean;
}

const NoteEditor = ({ note, onSave, standalone = false }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("edit");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setTagsInput(note.tags.join(", "));
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setTagsInput("");
    }
  }, [note]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    
    // Convert comma-separated string to array
    if (value.trim()) {
      const newTags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      setTags(newTags);
    } else {
      setTags([]);
    }
  };

  const handleSave = async () => {
    if (!title) {
      toast.error("Note title is required");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // If we have a custom onSave handler (for standalone mode)
      if (onSave && note) {
        const updatedNote = {
          ...note,
          title,
          content,
          tags,
          updated: "Just now",
        };
        
        await onSave(updatedNote);
      } else {
        // Default save behavior (for dashboard)
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        toast.success("Note saved");
        
        console.log("Saved note:", {
          title,
          content,
          tags,
        });
      }
    } catch (error) {
      toast.error("Failed to save note");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Simple markdown renderer for preview
  const renderMarkdown = (text: string) => {
    // This is a very basic renderer, in a real app use a proper markdown library
    let html = text;
    
    // Headers
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mb-3">$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>');
    
    // Lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-6 list-disc mb-1">$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-6 list-decimal mb-1">$2</li>');
    
    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Code
    html = html.replace(/`(.+?)`/g, '<code class="bg-obsidian-darkest/50 text-obsidian-accent px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-obsidian-accent hover:underline">$1</a>');
    
    // Paragraphs and line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    
    // Wrap in paragraph
    html = '<p class="mb-4">' + html + '</p>';
    
    return html;
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)] mb-2">No note selected</p>
          <Button 
            className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
          >
            Create new note
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      <div className={`p-4 border-b border-[var(--border)] flex items-center ${standalone ? 'border-t' : ''}`}>
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="border-0 focus-visible:ring-0 text-xl font-semibold px-0 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className={`bg-transparent border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] ${
              isSaving && "opacity-50 cursor-not-allowed"
            }`}
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          {!standalone && (
            <Button
              className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
            >
              Share
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4 border-b border-[var(--border)]">
        <Input
          value={tagsInput}
          onChange={handleTagsChange}
          placeholder="Add tags separated by commas"
          className="border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-[var(--accent)]/20 text-[var(--accent)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b border-[var(--border)] px-4">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger 
              value="edit" 
              className="data-[state=active]:bg-[var(--accent)]/10 data-[state=active]:text-[var(--accent)] data-[state=active]:shadow-none text-[var(--muted-foreground)]"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger 
              value="preview"
              className="data-[state=active]:bg-[var(--accent)]/10 data-[state=active]:text-[var(--accent)] data-[state=active]:shadow-none text-[var(--muted-foreground)]"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note in markdown..."
              className="w-full h-full min-h-[calc(100vh-220px)] p-4 bg-transparent border-0 focus-visible:ring-0 resize-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="preview" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div 
              className="markdown-preview p-4 text-[var(--foreground)]"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoteEditor;