import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from '@/components/ui/context-menu';

const meta: Meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
};

export default meta;

const Template: StoryObj = {
  render: () => {
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    return (
      <div className="flex justify-center items-center h-screen">
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow cursor-pointer">
              Right click me
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <ContextMenuLabel inset>Editor Options</ContextMenuLabel>
            <ContextMenuCheckboxItem
              checked={showLineNumbers}
              onCheckedChange={(val) => setShowLineNumbers(Boolean(val))}
            >
              Show Line Numbers
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>Theme</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuRadioGroup
                  value={theme}
                  onValueChange={(val) => setTheme(val as 'light' | 'dark')}
                >
                  <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
                  <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem inset>
                Rename
                <ContextMenuShortcut>⌘ R</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem inset variant="destructive">
                Delete
                <ContextMenuShortcut>⌘ ⌫</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
};

export const Default = Template;
