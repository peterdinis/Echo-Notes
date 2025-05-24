'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Palette } from 'lucide-react';
import BackgroundPicker from './BackgroundPicker';

interface SettingsModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentBackgroundColor: string;
    onBackgroundColorChange: (color: string) => void;
}

const SettingsModal = ({
    isOpen,
    onOpenChange,
    currentBackgroundColor,
    onBackgroundColorChange,
}: SettingsModalProps) => {
    // Settings state
    const [enableCustomColors, setEnableCustomColors] = useState(true);
    const [enableDragDrop, setEnableDragDrop] = useState(true);
    const [enableCustomCategories, setEnableCustomCategories] = useState(true);

    // Load saved settings from localStorage
    useEffect(() => {
        const savedEnableCustomColors = localStorage.getItem(
            'dashboard-enable-custom-colors',
        );
        if (savedEnableCustomColors !== null) {
            setEnableCustomColors(savedEnableCustomColors === 'true');
        }

        const savedEnableDragDrop = localStorage.getItem(
            'dashboard-enable-drag-drop',
        );
        if (savedEnableDragDrop !== null) {
            setEnableDragDrop(savedEnableDragDrop === 'true');
        }

        const savedEnableCustomCategories = localStorage.getItem(
            'dashboard-enable-custom-categories',
        );
        if (savedEnableCustomCategories !== null) {
            setEnableCustomCategories(savedEnableCustomCategories === 'true');
        }
    }, []);

    // Save settings to localStorage when they change
    useEffect(() => {
        localStorage.setItem(
            'dashboard-enable-custom-colors',
            String(enableCustomColors),
        );
        // Let the Dashboard component know about the change
        document.dispatchEvent(
            new CustomEvent('settings-change', {
                detail: {
                    key: 'enableCustomColors',
                    value: enableCustomColors,
                },
            }),
        );
    }, [enableCustomColors]);

    useEffect(() => {
        localStorage.setItem(
            'dashboard-enable-drag-drop',
            String(enableDragDrop),
        );
        document.dispatchEvent(
            new CustomEvent('settings-change', {
                detail: { key: 'enableDragDrop', value: enableDragDrop },
            }),
        );
    }, [enableDragDrop]);

    useEffect(() => {
        localStorage.setItem(
            'dashboard-enable-custom-categories',
            String(enableCustomCategories),
        );
        document.dispatchEvent(
            new CustomEvent('settings-change', {
                detail: {
                    key: 'enableCustomCategories',
                    value: enableCustomCategories,
                },
            }),
        );
    }, [enableCustomCategories]);

    // Handle theme reset
    const handleResetTheme = () => {
        const defaultColor = '#1A1A26';
        onBackgroundColorChange(defaultColor);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='border-obsidian-darkest text-obsidian-text max-w-md bg-stone-800'>
                <DialogHeader>
                    <DialogTitle className='text-obsidian-text flex items-center gap-2'>
                        <Settings className='h-5 w-5' />
                        Dashboard Settings
                    </DialogTitle>
                    <DialogDescription className='text-obsidian-muted'>
                        Customize your dashboard experience
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-6 py-4'>
                    {/* Theme settings section */}
                    <div className='space-y-4'>
                        <h3 className='text-obsidian-text text-lg font-medium'>
                            Theme
                        </h3>

                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label
                                    htmlFor='enable-custom-colors'
                                    className='text-obsidian-text'
                                >
                                    Enable Custom Colors
                                </Label>
                                <p className='text-obsidian-muted text-sm'>
                                    Allow changing dashboard color theme
                                </p>
                            </div>
                            <Switch
                                id='enable-custom-colors'
                                checked={enableCustomColors}
                                onCheckedChange={setEnableCustomColors}
                            />
                        </div>

                        {enableCustomColors && (
                            <>
                                <Separator className='my-4' />

                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <Palette className='text-obsidian-muted h-4 w-4' />
                                            <Label className='text-obsidian-text'>
                                                Theme Color
                                            </Label>
                                        </div>
                                        <BackgroundPicker
                                            onChange={onBackgroundColorChange}
                                            currentColor={
                                                currentBackgroundColor
                                            }
                                        />
                                    </div>

                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={handleResetTheme}
                                        className='border-obsidian-dark text-obsidian-text w-full'
                                    >
                                        Reset to Default Theme
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Features settings section */}
                    <Separator />
                    <div className='space-y-4'>
                        <h3 className='text-obsidian-text text-lg font-medium'>
                            Features
                        </h3>

                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label
                                    htmlFor='enable-drag-drop'
                                    className='text-obsidian-text'
                                >
                                    Enable Drag & Drop
                                </Label>
                                <p className='text-obsidian-muted text-sm'>
                                    Allow moving notes between folders with drag
                                    and drop
                                </p>
                            </div>
                            <Switch
                                id='enable-drag-drop'
                                checked={enableDragDrop}
                                onCheckedChange={setEnableDragDrop}
                            />
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label
                                    htmlFor='enable-custom-categories'
                                    className='text-obsidian-text'
                                >
                                    Custom Categories
                                </Label>
                                <p className='text-obsidian-muted text-sm'>
                                    Allow creating and managing custom note
                                    categories
                                </p>
                            </div>
                            <Switch
                                id='enable-custom-categories'
                                checked={enableCustomCategories}
                                onCheckedChange={setEnableCustomCategories}
                            />
                        </div>
                    </div>

                    {/* Performance settings section */}
                    <Separator />
                    <div className='space-y-4'>
                        <h3 className='text-obsidian-text text-lg font-medium'>
                            Performance
                        </h3>

                        <div className='flex items-center justify-between'>
                            <div className='space-y-0.5'>
                                <Label
                                    htmlFor='enable-animations'
                                    className='text-obsidian-text'
                                >
                                    Enable Animations
                                </Label>
                                <p className='text-obsidian-muted text-sm'>
                                    Show animations in the dashboard
                                </p>
                            </div>
                            <Switch id='enable-animations' defaultChecked />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => onOpenChange(false)}
                        className='border-obsidian-dark text-obsidian-text'
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;
