'use client';

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';

type ColorPaletteProps = {
    colors: string[];
    onSelect?: (color: string) => void;
    className?: string;
};

export const ColorPalette: React.FC<ColorPaletteProps> = ({
    colors,
    onSelect,
    className,
}) => {
    const [selectedColor, setSelectedColor] = useState<string>('#000000');
    const [showPicker, setShowPicker] = useState<boolean>(false);

    const handleSelect = (color: string) => {
        setSelectedColor(color);
        onSelect?.(color);
    };

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className='flex flex-wrap items-center gap-2'>
                {colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => handleSelect(color)}
                        className={cn(
                            'h-8 w-8 rounded-full border-2 transition-all duration-150',
                            selectedColor === color
                                ? 'ring-2 ring-black ring-offset-2'
                                : '',
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                    />
                ))}

                {/* Custom color picker button */}
                <button
                    onClick={() => setShowPicker(!showPicker)}
                    className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold',
                        showPicker ? 'ring-2 ring-black ring-offset-2' : '',
                    )}
                    style={{ backgroundColor: selectedColor }}
                >
                    +
                </button>
            </div>

            {showPicker && (
                <div className='w-48'>
                    <HexColorPicker
                        color={selectedColor}
                        onChange={(color) => handleSelect(color)}
                    />
                </div>
            )}

            <p
                className='text-lg font-semibold'
                style={{ color: selectedColor }}
            >
                Selected text color
            </p>
        </div>
    );
};
