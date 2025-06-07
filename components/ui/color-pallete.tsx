'use client';

import React, { useState } from 'react';
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

  const handleSelect = (color: string) => {
    setSelectedColor(color);
    onSelect?.(color);
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap gap-2">
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

        {/* Custom color picker */}
        <label className="w-8 h-8 relative cursor-pointer border-2 rounded-full overflow-hidden">
          <input
            type="color"
            onChange={(e) => handleSelect(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Pick custom color"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: selectedColor }}
          />
        </label>
      </div>

      <p className="text-lg font-semibold" style={{ color: selectedColor }}>
        Selected text color
      </p>
    </div>
  );
};
