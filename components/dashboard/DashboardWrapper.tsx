import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/dashboard/Sidebar";
import NotesList from "@/components/dashboard/NotesList";
import NoteEditor from "@/components/dashboard/NoteEditor";
import GraphView from "@/components/dashboard/GraphView";
import NewNoteDialog from "@/components/dashboard/NewNoteDialog";
import { toast } from "sonner";
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { Trash2, PanelLeft, PanelRight, Maximize, Minimize } from "lucide-react";
import { useIsMobile } from "@/hooks/shared/use-mobile";

export type Note = {
  id: string;
  title: string;
  excerpt: string;
  updated: string;
  content: string;
  tags: string[];
  isInTrash?: boolean;
  folderId?: string; // Added to track which folder a note belongs to
};

// Sample notes data with folderId added
const sampleNotes: Note[] = [
  {
    id: "101",
    title: "Travel Plans 2025",
    excerpt: "Ideas for next year's vacation destinations...",
    updated: "2 days ago",
    content: "Planning my travels for next year. Considering Japan in spring for cherry blossoms, Portugal in summer, and perhaps New Zealand in the fall. Will need to check my Reading List for travel guides.",
    tags: ["travel", "planning", "2025"],
    isInTrash: false,
    folderId: "1" // Personal folder
  },
  {
    id: "102",
    title: "Reading List",
    excerpt: "Books I want to read this year...",
    updated: "1 week ago",
    content: "Books to read:\n- Dune by Frank Herbert\n- Project Hail Mary by Andy Weir\n- The Psychology of Money by Morgan Housel\n- Four Thousand Weeks by Oliver Burkeman\n- Travel guides for my Travel Plans 2025",
    tags: ["books", "reading", "personal"],
    isInTrash: false,
    folderId: "1" // Personal folder
  },
  {
    id: "201",
    title: "Project Delta Notes",
    excerpt: "Meeting notes and key decisions for Project Delta...",
    updated: "1 day ago",
    content: "Project Delta kickoff meeting notes:\n- Timeline: 6 months\n- Budget: $120,000\n- Key stakeholders: Marketing, Product, Engineering\n\nNext steps: Set up weekly sync meetings and create project plan. Refer to Weekly Goals for priorities.",
    tags: ["work", "meetings", "project-delta"],
    isInTrash: false,
    folderId: "2" // Work folder
  },
  {
    id: "202",
    title: "Weekly Goals",
    excerpt: "Setting objectives for the upcoming sprint...",
    updated: "3 days ago",
    content: "Sprint goals for next week:\n1. Finish API documentation\n2. Review pull requests for auth feature\n3. Prepare demo for stakeholders\n4. Schedule 1:1s with team members\n5. Update Project Delta Notes with progress",
    tags: ["work", "goals", "planning"],
    isInTrash: false,
    folderId: "2" // Work folder
  },
  {
    id: "203",
    title: "Interview Questions",
    excerpt: "Questions to ask candidates during interviews...",
    updated: "2 weeks ago",
    content: "Technical interview questions:\n- Explain the difference between var, let, and const\n- How does React's virtual DOM work?\n- Describe a challenging project you worked on\n- How do you handle conflicts in a team?\n\nCoding challenge ideas: implement a basic todo app",
    tags: ["work", "interviews", "hiring"],
    isInTrash: false,
    folderId: "2" // Work folder
  },
  {
    id: "301",
    title: "Graph Theory",
    excerpt: "Notes on directed acyclic graphs and applications...",
    updated: "4 days ago",
    content: "Graph theory study notes:\n\nA directed acyclic graph (DAG) is a finite directed graph with no directed cycles.\n\nApplications:\n- Data processing networks\n- Scheduling problems\n- Causal structures\n\nProperties:\n- Has at least one topological ordering\n- Can represent partial orderings",
    tags: ["research", "math", "computer-science"],
    isInTrash: false,
    folderId: "3" // Research folder
  },
  {
    id: "302",
    title: "Machine Learning Papers",
    excerpt: "Summaries of recent research papers on ML techniques...",
    updated: "1 month ago",
    content: "Recent papers to review:\n\n1. \"Attention Is All You Need\" - Transformer architecture fundamentals\n2. \"BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding\"\n3. \"Deep Residual Learning for Image Recognition\" - ResNet architecture\n\nKey concepts to explore: attention mechanisms, transfer learning, few-shot learning. Related to Graph Theory concepts.",
    tags: ["research", "machine-learning", "papers"],
    isInTrash: false,
    folderId: "3" // Research folder
  }
];

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [listCollapsed, setListCollapsed] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(sampleNotes[0]);
  const [view, setView] = useState<"editor" | "graph">("editor");
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#1A1A26");
  const [enableCustomColors, setEnableCustomColors] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  
  // Use the mobile hook to detect smaller screens
  const isMobile = useIsMobile();
  
  // Auto collapse sidebar and list on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
      setListCollapsed(true);
    }
  }, [isMobile]);

  // Use local storage for settings if available
  useEffect(() => {
    // Load color theme settings
    const savedColor = localStorage.getItem("dashboard-bg-color");
    if (savedColor) {
      setBackgroundColor(savedColor);
    }
    
    // Load custom colors enable/disable setting
    const savedEnableCustomColors = localStorage.getItem("dashboard-enable-custom-colors");
    if (savedEnableCustomColors !== null) {
      setEnableCustomColors(savedEnableCustomColors === "true");
    }
    
    // Apply the theme color if custom colors are enabled
    if (enableCustomColors && savedColor) {
      applyThemeColor(savedColor);
    } else {
      // Reset to default theme if custom colors are disabled
      applyThemeColor("#1A1A26");
    }

    // Listen for settings changes
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.key === 'enableCustomColors') {
        setEnableCustomColors(customEvent.detail.value);
      }
    };

    document.addEventListener('settings-change', handleSettingsChange);
    
    return () => {
      document.removeEventListener('settings-change', handleSettingsChange);
    };
  }, []);

  // Apply theme when enableCustomColors setting changes
  useEffect(() => {
    if (enableCustomColors) {
      applyThemeColor(backgroundColor);
    } else {
      // Reset to default theme
      applyThemeColor("#1A1A26");
    }
  }, [enableCustomColors]);

  // Enhanced function that applies the color theme to the entire dashboard
  const applyThemeColor = (color: string) => {
    // Check if color has an opacity component (8 characters instead of 7)
    const baseColor = color.length === 9 ? color.substring(0, 7) : color;
    const opacity = color.length === 9 ? parseInt(color.substring(7, 9), 16) / 255 : 1;
    
    // Calculate derived colors based on the main color
    const darkerColor = adjustColorBrightness(baseColor, -15);
    const lighterColor = adjustColorBrightness(baseColor, 10);
    const evenDarkerColor = adjustColorBrightness(baseColor, -25);
    const accentColor = adjustColorBrightness(baseColor, 30);
    const primaryButtonColor = getComplementaryColor(baseColor);
    
    // Get the color's brightness to determine if text should be light or dark
    const brightness = getColorBrightness(baseColor);
    const textColor = brightness > 128 ? "#1A1A26" : "#f8f8f2";
    const mutedTextColor = brightness > 128 ? "#292933" : "#c8c8c2";
    
    // Apply colors to CSS variables as direct values with opacity
    document.documentElement.style.setProperty('--background', addOpacity(baseColor, opacity));
    document.documentElement.style.setProperty('--foreground', textColor);
    
    document.documentElement.style.setProperty('--card', addOpacity(darkerColor, opacity));
    document.documentElement.style.setProperty('--card-foreground', textColor);
    
    document.documentElement.style.setProperty('--popover', addOpacity(darkerColor, opacity));
    document.documentElement.style.setProperty('--popover-foreground', textColor);
    
    document.documentElement.style.setProperty('--primary', primaryButtonColor);
    document.documentElement.style.setProperty('--primary-foreground', textColor);
    
    document.documentElement.style.setProperty('--secondary', addOpacity(lighterColor, opacity));
    document.documentElement.style.setProperty('--secondary-foreground', textColor);
    
    document.documentElement.style.setProperty('--muted', addOpacity(evenDarkerColor, opacity));
    document.documentElement.style.setProperty('--muted-foreground', mutedTextColor);
    
    document.documentElement.style.setProperty('--accent', accentColor); 
    document.documentElement.style.setProperty('--accent-foreground', textColor);
    
    document.documentElement.style.setProperty('--destructive', '#ff4c4c');
    document.documentElement.style.setProperty('--destructive-foreground', '#f8f8f2');
    
    document.documentElement.style.setProperty('--border', evenDarkerColor);
    document.documentElement.style.setProperty('--input', evenDarkerColor);
    document.documentElement.style.setProperty('--ring', primaryButtonColor);
    
    // Apply to sidebar variables too - ensure consistent styling
    document.documentElement.style.setProperty('--sidebar-background', addOpacity(evenDarkerColor, opacity));
    document.documentElement.style.setProperty('--sidebar-foreground', textColor);
    document.documentElement.style.setProperty('--sidebar-primary', primaryButtonColor);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', textColor);
    document.documentElement.style.setProperty('--sidebar-accent', accentColor);
    document.documentElement.style.setProperty('--sidebar-accent-foreground', textColor);
    document.documentElement.style.setProperty('--sidebar-border', darkerColor);
    document.documentElement.style.setProperty('--sidebar-ring', primaryButtonColor);
  };

  // Helper function to add opacity to a color
  const addOpacity = (color: string, opacity: number): string => {
    // If opacity is 1, return the original color
    if (opacity === 1) return color;
    
    // Convert hex to RGB
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    
    // Return rgba
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Helper function to adjust color brightness
  const adjustColorBrightness = (hex: string, percent: number): string => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Adjust brightness
    r = Math.max(0, Math.min(255, Math.round(r + (percent / 100) * 255)));
    g = Math.max(0, Math.min(255, Math.round(g + (percent / 100) * 255)));
    b = Math.max(0, Math.min(255, Math.round(b + (percent / 100) * 255)));

    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Helper function to get complementary color
  const getComplementaryColor = (hex: string): string => {
    // Convert hex to RGB
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    
    // Get complementary colors (simplified approach)
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    
    // Return hex
    return `#${((1 << 24) + (compR << 16) + (compG << 8) + compB).toString(16).slice(1)}`;
  };

  // Helper function to get color brightness
  const getColorBrightness = (hex: string): number => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Save background color to local storage when it changes
  useEffect(() => {
    localStorage.setItem("dashboard-bg-color", backgroundColor);
    // Only apply theme color if custom colors are enabled
    if (enableCustomColors) {
      applyThemeColor(backgroundColor);
    }
  }, [backgroundColor, enableCustomColors]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px of movement required before activation
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // 250ms delay before activation
      tolerance: 5, // 5px of movement allowed before cancellation
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleList = () => {
    setListCollapsed(!listCollapsed);
  };

  const toggleView = () => {
    setView(view === "editor" ? "graph" : "editor");
  };

  const toggleTrash = () => {
    setShowTrash(!showTrash);
    // If we're hiding the trash and the selected note is in trash, clear selection
    if (!showTrash && selectedNote?.isInTrash) {
      setSelectedNote(undefined);
    }
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    if (!fullscreen) {
      // If entering fullscreen, collapse both sidebar and list
      setSidebarCollapsed(true);
      setListCollapsed(true);
    }
  };

  const handleCreateNote = (noteData: Omit<Note, "id" | "updated" | "isInTrash">) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      updated: "Just now",
      isInTrash: false,
      ...noteData,
    };
    
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    toast.success("New note created");
  };
  
  const handleTrashNote = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, isInTrash: true }
        : note
    ));
    
    if (selectedNote?.id === noteId) {
      const nextActiveNote = notes.find(note => !note.isInTrash && note.id !== noteId);
      setSelectedNote(nextActiveNote);
    }
    
    toast.success("Note moved to trash");
  };
  
  const handleRestoreNote = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, isInTrash: false }
        : note
    ));
    toast.success("Note restored");
  };
  
  const handleDeletePermanently = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    
    if (selectedNote?.id === noteId) {
      const nextActiveNote = notes.find(note => note.id !== noteId);
      setSelectedNote(nextActiveNote);
    }
    
    toast.success("Note permanently deleted");
  };
  
  // Enhanced handleDragEnd to handle moving notes between folders
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // If dropped on trash
    if (over.id === "trash-area" && active.id) {
      const noteId = active.id as string;
      handleTrashNote(noteId);
      return;
    }
    
    // If dropped on a folder
    if (typeof over.id === 'string' && over.id.startsWith('folder-') && active.id) {
      const noteId = active.id as string;
      const folderId = over.data?.current?.folderId || over.id.replace('folder-', '');
      handleMoveNoteToFolder(noteId, folderId);
    }
  };

  // Handle moving notes between folders
  const handleMoveNoteToFolder = (noteId: string, folderId: string) => {
    const note = notes.find(n => n.id === noteId);
    
    // Don't do anything if the note is already in this folder
    if (note?.folderId === folderId) return;
    
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, folderId: folderId }
        : note
    ));
    
    toast.success("Note moved to folder");
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    // Theme will be applied by the useEffect that watches backgroundColor
  };

  const filteredNotes = notes.filter(note => note.isInTrash === showTrash);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={`h-screen flex overflow-hidden ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={toggleSidebar} 
          showTrash={showTrash}
          onToggleTrash={toggleTrash}
          onBackgroundColorChange={handleBackgroundColorChange}
          currentBackgroundColor={backgroundColor}
          onMoveNoteToFolder={handleMoveNoteToFolder}
          isMobile={isMobile}
        />
        <NotesList
          isCollapsed={listCollapsed}
          onToggleCollapse={toggleList}
          onSelectNote={setSelectedNote}
          selectedNoteId={selectedNote?.id}
          notes={filteredNotes}
          showTrash={showTrash}
          onTrashNote={handleTrashNote}
          onRestoreNote={handleRestoreNote}
          onDeletePermanently={handleDeletePermanently}
          isMobile={isMobile}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="h-12 flex items-center justify-between bg-[var(--card)] border-b border-[var(--border)] px-4">
            <div className="flex items-center">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                  <PanelLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-[var(--foreground)] font-semibold mr-4 truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                {selectedNote?.title || "Untitled Note"}
              </h2>
              <div className="text-[var(--muted-foreground)] text-sm hidden sm:block">
                {selectedNote?.updated || ""}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!showTrash && (
                <Button
                  variant="outline"
                  className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] hidden sm:flex"
                  onClick={() => setIsNewNoteDialogOpen(true)}
                >
                  New Note
                </Button>
              )}
              {isMobile ? (
                <Button variant="ghost" size="icon" onClick={toggleList} className="mr-2">
                  <PanelRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  {selectedNote && !showTrash && (
                    <Button
                      variant="outline"
                      className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                      onClick={() => handleTrashNote(selectedNote.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Trash
                    </Button>
                  )}
                </>
              )}
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-[var(--muted-foreground)]">
                {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              {!showTrash && !isMobile && (
                <button
                  onClick={toggleView}
                  className={`px-3 py-1.5 rounded text-sm hidden sm:block ${
                    view === "editor"
                      ? "bg-[var(--muted)] text-[var(--foreground)]"
                      : "bg-obsidian-accent/20 text-obsidian-accent"
                  }`}
                >
                  {view === "editor" ? "Editor" : "Graph View"}
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {selectedNote ? (
              view === "editor" ? (
                <NoteEditor note={selectedNote} />
              ) : (
                <GraphView notes={notes.filter(note => !note.isInTrash)} onSelectNote={setSelectedNote} />
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[var(--muted-foreground)]">
                {showTrash 
                  ? "Trash is empty" 
                  : (
                    <>
                      <p className="mb-4">Select a note or create a new one</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsNewNoteDialogOpen(true)}
                        className="sm:hidden"
                      >
                        New Note
                      </Button>
                    </>
                  )
                }
              </div>
            )}
          </div>
        </div>
        
        <NewNoteDialog
          isOpen={isNewNoteDialogOpen}
          onClose={() => setIsNewNoteDialogOpen(false)}
          onSave={handleCreateNote}
        />
      </div>
    </DndContext>
  );
};

export default Dashboard;