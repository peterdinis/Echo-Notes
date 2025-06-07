'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
    Search,
    ChevronRight,
    ChevronLeft,
    Tag,
    Trash2,
    RotateCcw,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { isClient } from '@/lib/client';

type Note = {
    id: string;
    title: string;
    excerpt: string;
    updated: string;
    content: string;
    tags: string[];
    isInTrash?: boolean;
    folderId?: string; // Added to track which folder a note belongs to
};

interface NotesListProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onSelectNote: (note: Note) => void;
    selectedNoteId?: string;
    notes: Note[];
    showTrash: boolean;
    onTrashNote: (noteId: string) => void;
    onRestoreNote: (noteId: string) => void;
    onDeletePermanently: (noteId: string) => void;
    isMobile?: boolean;
}

const NotesList = ({
    isCollapsed,
    onToggleCollapse,
    onSelectNote,
    selectedNoteId,
    notes,
    showTrash,
    onTrashNote,
    onRestoreNote,
    onDeletePermanently,
    isMobile = false,
}: NotesListProps) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isMobileListOpen, setIsMobileListOpen] = React.useState(false);

    // Handle mobile list opening when props change
    React.useEffect(() => {
        if (isMobile) {
            setIsMobileListOpen(!isCollapsed);
        }
    }, [isCollapsed, isMobile]);

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
    );

    // Render note item with optional drag functionality - now extracted to avoid hooks inconsistency
    const renderNoteItem = (note: Note) => {
        return (
            <NoteItem
                key={note.id}
                note={note}
                showTrash={showTrash}
                selectedNoteId={selectedNoteId}
                onSelectNote={() => {
                    onSelectNote(note);
                    if (isMobile) {
                        setIsMobileListOpen(false);
                        onToggleCollapse();
                    }
                }}
                onTrashNote={onTrashNote}
                onRestoreNote={onRestoreNote}
                onDeletePermanently={onDeletePermanently}
            />
        );
    };

    const renderListContent = () => (
        <>
            <div className='flex items-center justify-between border-b border-[var(--border)] p-4'>
                <h2 className='font-semibold text-[var(--foreground)]'>
                    {showTrash ? 'Trash' : 'Notes'}
                </h2>
                <div className='flex items-center'>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={onToggleCollapse}
                        className='h-8 w-8'
                    >
                        {isCollapsed ? (
                            <ChevronRight className='h-4 w-4' />
                        ) : (
                            <ChevronLeft className='h-4 w-4' />
                        )}
                    </Button>
                </div>
            </div>

            <div className='p-3'>
                <div className='relative'>
                    <Search className='absolute top-2 left-2 h-4 w-4 text-[var(--muted-foreground)]' />
                    <Input
                        placeholder='Search notes...'
                        className='border-[var(--border)] bg-[var(--muted)] pl-8 text-[var(--foreground)]'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredNotes.length === 0 ? (
                <div className='flex h-32 flex-col items-center justify-center p-4 text-[var(--muted-foreground)]'>
                    <Tag className='mb-2 h-8 w-8 opacity-30' />
                    <p className='text-sm'>No notes found</p>
                </div>
            ) : (
                <ScrollArea className='h-[calc(100vh-8rem)]'>
                    <div className='divide-y divide-[var(--border)]'>
                        {filteredNotes.map(renderNoteItem)}
                    </div>
                </ScrollArea>
            )}
        </>
    );

    // Mobile view
    if (isMobile) {
        return (
            <Sheet
                open={isMobileListOpen}
                onOpenChange={(open) => {
                    setIsMobileListOpen(open);
                    onToggleCollapse();
                }}
            >
                <SheetContent
                    side='left'
                    className='w-[280px] border-r border-[var(--border)] bg-[var(--background)] p-0 sm:w-[350px]'
                >
                    {renderListContent()}
                </SheetContent>
            </Sheet>
        );
    }

    // Desktop view
    return (
        <div
            className={cn(
                'border-r border-[var(--border)] bg-[var(--background)] transition-all duration-300',
                isCollapsed ? 'w-0' : 'w-72',
            )}
        >
            {!isCollapsed && renderListContent()}
        </div>
    );
};

// Separate NoteItem component to avoid hooks inconsistency
const NoteItem = ({
    note,
    showTrash,
    selectedNoteId,
    onSelectNote,
    onTrashNote,
    onRestoreNote,
    onDeletePermanently,
}: {
    note: Note;
    showTrash: boolean;
    selectedNoteId?: string;
    onSelectNote: () => void;
    onTrashNote: (noteId: string) => void;
    onRestoreNote: (noteId: string) => void;
    onDeletePermanently: (noteId: string) => void;
}) => {
    // Set up draggable functionality, but only if not in trash
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: note.id,
        disabled: showTrash || !isClient,
    });

    return (
        <div
            ref={setNodeRef}
            {...(showTrash ? {} : { ...attributes, ...listeners })}
            className={cn(
                'cursor-pointer border-l-2 p-3 transition-colors',
                selectedNoteId === note.id
                    ? 'border-l-[var(--accent)] bg-[var(--muted)]'
                    : 'border-l-transparent hover:border-l-[var(--border)] hover:bg-[var(--muted)]',
                isDragging && 'opacity-50',
            )}
            onClick={onSelectNote}
        >
            <h3 className='mb-1 truncate font-medium text-[var(--foreground)]'>
                {note.title}
            </h3>
            <p className='mb-2 line-clamp-2 text-xs text-[var(--muted-foreground)]'>
                {note.excerpt}
            </p>
            <div className='flex items-center justify-between'>
                <div className='flex flex-wrap gap-1'>
                    {note.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className='rounded bg-[var(--secondary)] px-1.5 py-0.5 text-[10px] text-[var(--secondary-foreground)]'
                        >
                            {tag}
                        </span>
                    ))}
                    {note.tags.length > 2 && (
                        <span className='rounded bg-[var(--muted)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)]'>
                            +{note.tags.length - 2}
                        </span>
                    )}
                </div>
                <span className='text-[10px] text-[var(--muted-foreground)]'>
                    {note.updated}
                </span>
            </div>

            {/* Actions for trash/restore */}
            {showTrash ? (
                <div className='mt-2 flex justify-end gap-2'>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='h-7 px-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        onClick={(e) => {
                            e.stopPropagation();
                            onRestoreNote(note.id);
                        }}
                    >
                        <RotateCcw className='mr-1 h-3 w-3' />
                        Restore
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='h-7 px-2 text-red-500 hover:bg-red-100/10 hover:text-red-600'
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeletePermanently(note.id);
                        }}
                    >
                        <X className='mr-1 h-3 w-3' />
                        Delete
                    </Button>
                </div>
            ) : (
                <Button
                    variant='ghost'
                    size='sm'
                    className='mt-2 ml-auto hidden h-7 w-7 p-0 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-[var(--foreground)] hover:opacity-100 focus:opacity-100 sm:flex'
                    onClick={(e) => {
                        e.stopPropagation();
                        onTrashNote(note.id);
                    }}
                >
                    <Trash2 className='h-3.5 w-3.5' />
                </Button>
            )}
        </div>
    );
};

export default NotesList;
