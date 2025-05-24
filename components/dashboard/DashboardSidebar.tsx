'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Plus,
    Search,
    Settings,
    LogOut,
    Trash2,
    BookOpen,
    Bookmark,
    FileText,
    ChevronLeft,
} from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { toast } from 'sonner';
import Link from 'next/link';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import SettingsModal from './SettingsModal';

type NoteFolder = {
    id: string;
    name: string;
    notes: {
        id: string;
        title: string;
        excerpt: string;
        updated: string;
    }[];
};

type NoteCategory = {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    isCustom?: boolean;
};

// Sample folders data
const initialFolders: NoteFolder[] = [
    {
        id: '1',
        name: 'Personal',
        notes: [
            {
                id: '101',
                title: 'Travel Plans 2025',
                excerpt: "Ideas for next year's vacation destinations...",
                updated: '2 days ago',
            },
            {
                id: '102',
                title: 'Reading List',
                excerpt: 'Books I want to read this year...',
                updated: '1 week ago',
            },
        ],
    },
    {
        id: '2',
        name: 'Work',
        notes: [
            {
                id: '201',
                title: 'Project Delta Notes',
                excerpt: 'Meeting notes and key decisions for Project Delta...',
                updated: '1 day ago',
            },
            {
                id: '202',
                title: 'Weekly Goals',
                excerpt: 'Setting objectives for the upcoming sprint...',
                updated: '3 days ago',
            },
            {
                id: '203',
                title: 'Interview Questions',
                excerpt: 'Questions to ask candidates during interviews...',
                updated: '2 weeks ago',
            },
        ],
    },
    {
        id: '3',
        name: 'Research',
        notes: [
            {
                id: '301',
                title: 'Graph Theory',
                excerpt: 'Notes on directed acyclic graphs and applications...',
                updated: '4 days ago',
            },
            {
                id: '302',
                title: 'Machine Learning Papers',
                excerpt:
                    'Summaries of recent research papers on ML techniques...',
                updated: '1 month ago',
            },
        ],
    },
];

// Initial categories
const initialNoteCategories: NoteCategory[] = [
    {
        id: 'all',
        name: 'All Notes',
        icon: <FileText className='h-4 w-4' />,
        color: 'text-blue-400',
    },
    {
        id: 'recent',
        name: 'Recent',
        icon: <BookOpen className='h-4 w-4' />,
        color: 'text-green-400',
    },
    {
        id: 'favorites',
        name: 'Favorites',
        icon: <Bookmark className='h-4 w-4' />,
        color: 'text-yellow-400',
    },
];

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    showTrash: boolean;
    onToggleTrash: () => void;
    onBackgroundColorChange: (color: string) => void;
    currentBackgroundColor: string;
    onMoveNoteToFolder?: (noteId: string, folderId: string) => void;
    isMobile?: boolean;
}

const Sidebar = ({
    collapsed,
    setCollapsed,
    showTrash,
    onToggleTrash,
    onBackgroundColorChange,
    currentBackgroundColor,
    onMoveNoteToFolder,
    isMobile = false,
}: SidebarProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFolders, setExpandedFolders] = useState<
        Record<string, boolean>
    >({
        '1': true,
        '2': true,
        '3': true,
    });
    const [activeCategory, setActiveCategory] = useState('all');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [folders, setFolders] = useState<NoteFolder[]>(initialFolders);
    const [noteCategories, setNoteCategories] = useState<NoteCategory[]>(
        initialNoteCategories,
    );
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Load categories from localStorage on component mount
    useEffect(() => {
        const savedCategories = localStorage.getItem('custom-categories');
        if (savedCategories) {
            try {
                const parsedCategories = JSON.parse(savedCategories);
                setNoteCategories([
                    ...initialNoteCategories,
                    ...parsedCategories,
                ]);
            } catch (error) {
                console.error('Error parsing saved categories:', error);
            }
        }
    }, []);

    // Handle mobile sidebar opening when props change
    useEffect(() => {
        if (isMobile) {
            setIsMobileSidebarOpen(!collapsed);
        }
    }, [collapsed, isMobile]);

    // Save categories to localStorage when they change
    useEffect(() => {
        const customCategories = noteCategories.filter((cat) => cat.isCustom);
        localStorage.setItem(
            'custom-categories',
            JSON.stringify(customCategories),
        );
    }, [noteCategories]);

    const toggleFolder = (folderId: string) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [folderId]: !prev[folderId],
        }));
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;

        const newCategoryId = `custom-${Date.now()}`;
        const newCategory: NoteCategory = {
            id: newCategoryId,
            name: newCategoryName,
            icon: <FileText className='h-4 w-4' />,
            color: 'text-purple-400',
            isCustom: true,
        };

        setNoteCategories([...noteCategories, newCategory]);
        setNewCategoryName('');
        setIsAddingCategory(false);

        toast.success(`Category "${newCategoryName}" created`);
    };

    const filteredFolders = folders
        .map((folder) => {
            return {
                ...folder,
                notes: folder.notes.filter(
                    (note) =>
                        note.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        note.excerpt
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                ),
            };
        })
        .filter((folder) => folder.notes.length > 0 || searchQuery === '');

    // Render folder item with droppable functionality
    const renderFolderDroppable = (folder: NoteFolder) => {
        // Move useDroppable hook outside conditional rendering
        const { setNodeRef } = useDroppable({
            id: `folder-${folder.id}`,
            data: { folderId: folder.id },
        });

        return (
            <div ref={setNodeRef} className='w-full'>
                <button
                    onClick={() => toggleFolder(folder.id)}
                    className='mb-1 flex w-full items-center justify-between rounded border-2 border-transparent p-1 text-[var(--foreground)] hover:border-dashed hover:border-[var(--border)] hover:bg-[var(--muted)] hover:text-[var(--accent)]'
                >
                    <span className='font-medium'>{folder.name}</span>
                    <span className='text-xs text-[var(--muted-foreground)]'>
                        {expandedFolders[folder.id] ? '▼' : '►'}
                    </span>
                </button>

                {expandedFolders[folder.id] && (
                    <div className='space-y-1 pl-2'>
                        {folder.notes.map((note) => (
                            <Link
                                href={`/dashboard/note/${note.id}`}
                                key={note.id}
                                className='block rounded p-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--accent)]'
                            >
                                {note.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Mobile sidebar content - reused in both mobile and desktop views
    const renderSidebarContent = () => (
        <>
            <div className='flex items-center p-4'>
                {!collapsed && (
                    <Link
                        href='/dashboard'
                        className='flex flex-1 items-center space-x-2'
                    >
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sidebar-primary)]'>
                            <span className='font-bold text-[var(--sidebar-primary-foreground)]'>
                                E
                            </span>
                        </div>
                        <span className='font-bold text-[var(--sidebar-foreground)]'>
                            EchoNotes
                        </span>
                    </Link>
                )}
                {collapsed && (
                    <Link href='/dashboard' className='mx-auto'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sidebar-primary)]'>
                            <span className='font-bold text-[var(--sidebar-primary-foreground)]'>
                                E
                            </span>
                        </div>
                    </Link>
                )}
                {isMobile && !collapsed && (
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setCollapsed(true)}
                        className='ml-auto'
                    >
                        <ChevronLeft className='h-5 w-5' />
                    </Button>
                )}
            </div>

            <div className='p-2'>
                <Button
                    variant='outline'
                    className={`w-full justify-center bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] hover:bg-[var(--sidebar-accent)] ${
                        collapsed ? 'px-2' : ''
                    }`}
                >
                    <Plus className={`h-5 w-5 ${!collapsed && 'mr-2'}`} />
                    {!collapsed && 'New Note'}
                </Button>
            </div>

            {!collapsed && (
                <div className='p-2'>
                    <div className='relative'>
                        <Search className='absolute top-2.5 left-2 h-4 w-4 text-[var(--muted-foreground)]' />
                        <Input
                            placeholder='Search notes...'
                            className='border-[var(--border)] bg-[var(--muted)] pl-8 text-[var(--foreground)]'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <ScrollArea className='flex-1 px-2 py-4'>
                {!collapsed ? (
                    <>
                        {!showTrash && (
                            <div className='mb-4'>
                                <div className='mb-2 flex items-center justify-between px-2 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase'>
                                    <span>Categories</span>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-5 w-5 p-0 text-[var(--muted-foreground)]'
                                        onClick={() =>
                                            setIsAddingCategory(true)
                                        }
                                    >
                                        <Plus className='h-3 w-3' />
                                    </Button>
                                </div>

                                {isAddingCategory && (
                                    <div className='mb-2 flex items-center gap-1 px-1'>
                                        <Input
                                            className='h-7 text-xs'
                                            placeholder='Category name...'
                                            value={newCategoryName}
                                            onChange={(e) =>
                                                setNewCategoryName(
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddCategory();
                                                }
                                            }}
                                        />
                                        <Button
                                            size='sm'
                                            className='h-7'
                                            onClick={handleAddCategory}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                )}

                                {noteCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() =>
                                            setActiveCategory(category.id)
                                        }
                                        className={`my-1 flex w-full items-center space-x-2 rounded-md px-2 py-1.5 transition-colors ${
                                            activeCategory === category.id
                                                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                                                : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                                        }`}
                                    >
                                        <span className={category.color}>
                                            {category.icon}
                                        </span>
                                        <span>{category.name}</span>
                                        {category.isCustom && (
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='ml-auto h-5 w-5 p-0 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNoteCategories(
                                                        noteCategories.filter(
                                                            (c) =>
                                                                c.id !==
                                                                category.id,
                                                        ),
                                                    );
                                                    if (
                                                        activeCategory ===
                                                        category.id
                                                    ) {
                                                        setActiveCategory(
                                                            'all',
                                                        );
                                                    }
                                                    toast.success(
                                                        `Category "${category.name}" removed`,
                                                    );
                                                }}
                                            >
                                                <Trash2 className='h-3 w-3' />
                                            </Button>
                                        )}
                                    </button>
                                ))}
                                <Separator className='my-3 bg-[var(--border)]' />
                            </div>
                        )}

                        {!showTrash ? (
                            filteredFolders.map((folder) => (
                                <div key={folder.id} className='mb-4'>
                                    {renderFolderDroppable(folder)}
                                </div>
                            ))
                        ) : (
                            <div className='mt-4 flex flex-col items-center space-y-4'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                                >
                                    <Search className='h-5 w-5' />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='flex flex-col items-center space-y-4'>
                        {noteCategories.map((category) => (
                            <Button
                                key={category.id}
                                variant='ghost'
                                size='icon'
                                className={`${
                                    activeCategory === category.id
                                        ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                                        : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                                }`}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                <span className={category.color}>
                                    {category.icon}
                                </span>
                            </Button>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className='border-t border-[var(--border)] p-2'>
                {collapsed ? (
                    <div className='flex flex-col items-center space-y-4'>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <Settings className='h-5 w-5' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            className={`h-8 w-8 ${showTrash ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                            onClick={onToggleTrash}
                        >
                            <Trash2 className='h-5 w-5' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        >
                            <LogOut className='h-5 w-5' />
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col space-y-2'>
                        <Button
                            variant='ghost'
                            className='flex items-center justify-start text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <Settings className='mr-2 h-5 w-5' />
                            Settings
                        </Button>
                        <div className='flex items-center space-x-2'>
                            <Button
                                variant='ghost'
                                className={`flex-1 justify-start ${showTrash ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                                onClick={onToggleTrash}
                            >
                                <Trash2 className='mr-2 h-5 w-5' />
                                Trash
                            </Button>
                        </div>
                        <Button
                            variant='ghost'
                            className='p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        >
                            <LogOut className='mr-2 h-5 w-5' />
                            Logout
                        </Button>
                    </div>
                )}
            </div>

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                currentBackgroundColor={currentBackgroundColor}
                onBackgroundColorChange={onBackgroundColorChange}
            />
        </>
    );

    // For mobile views, use Sheet component
    if (isMobile) {
        return (
            <Sheet
                open={isMobileSidebarOpen}
                onOpenChange={(open) => {
                    setIsMobileSidebarOpen(open);
                    setCollapsed(!open);
                }}
            >
                <SheetContent
                    side='left'
                    className='w-[280px] border-r border-[var(--sidebar-border)] bg-[var(--sidebar-background)] p-0 sm:w-[350px]'
                >
                    {renderSidebarContent()}
                </SheetContent>
            </Sheet>
        );
    }

    // For desktop views, use regular sidebar
    return (
        <div
            className={`flex h-screen flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-background)] transition-all duration-300 ${
                collapsed ? 'w-16' : 'w-64'
            }`}
        >
            {renderSidebarContent()}
        </div>
    );
};

export default Sidebar;
