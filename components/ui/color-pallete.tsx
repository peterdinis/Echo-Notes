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
      <div className="flex flex-wrap gap-2 items-center">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => handleSelect(color)}
            className={cn(
              'w-8 h-8 rounded-full border-2 transition-all duration-150',
              selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : '',
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}

        {/* Custom color picker button */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={cn(
            'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold',
            showPicker ? 'ring-2 ring-offset-2 ring-black' : ''
          )}
          style={{ backgroundColor: selectedColor }}
        >
          +
        </button>
      </div>

      {showPicker && (
        <div className="w-48">
          <HexColorPicker
            color={selectedColor}
            onChange={(color) => handleSelect(color)}
          />
        </div>
      )}

      <p className="text-lg font-semibold" style={{ color: selectedColor }}>
        Selected text color
      </p>
    </div>
  );
};
