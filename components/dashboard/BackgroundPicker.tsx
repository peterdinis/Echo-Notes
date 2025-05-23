"use client"

import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {toast} from "sonner"

const predefinedColors = [
  // Dark themes
  "#1A1A26", // default dark
  "#292933", // default darker
  "#121212", // almost black
  "#0f172a", // slate dark
  "#1e1b4b", // indigo dark
  "#312e81", // indigo medium
  // Blue themes
  "#1e3a8a", // blue dark
  "#1e40af", // blue medium
  "#0369a1", // blue light
  // Teal/Green themes
  "#0f766e", // teal dark
  "#134e4a", // teal darker
  "#064e3b", // emerald dark
  "#166534", // green dark
  "#365314", // lime dark
  // Warm themes
  "#422006", // amber dark
  "#7c2d12", // orange dark
  "#431407", // red dark
  "#4c0519", // rose dark
  "#581c87", // purple dark
];

interface BackgroundPickerProps {
  onChange: (color: string) => void;
  currentColor: string;
}

const BackgroundPicker = ({ onChange, currentColor }: BackgroundPickerProps) => {
  const [color, setColor] = useState(currentColor);
  const [opacity, setOpacity] = useState(100);
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});
  // Update preview style when color changes
  useEffect(() => {
    // Calculate brightness to determine text color
    const brightness = getColorBrightness(color);
    const textColor = brightness > 128 ? "#1A1A26" : "#f8f8f2";
    
    setPreviewStyle({
      backgroundColor: applyOpacityToColor(color, opacity),
      color: textColor,
      border: `1px solid ${adjustColorBrightness(color, -20)}`,
    });
  }, [color, opacity]);

  // Helper function to get color brightness
  const getColorBrightness = (hex: string): number => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
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

  // Helper function to apply opacity to a color
  const applyOpacityToColor = (hex: string, opacityPercent: number): string => {
    const opacityHex = Math.round((opacityPercent / 100) * 255).toString(16).padStart(2, '0');
    return `${hex}${opacityHex}`;
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
  };

  const handleSaveColor = () => {
    const finalColor = applyOpacityToColor(color, opacity);
    onChange(finalColor);
    
    toast({
      title: "Theme updated",
      description: "Your dashboard theme has been updated.",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full border-2 overflow-hidden"
          style={{ backgroundColor: currentColor }}
        >
          <Palette className="h-4 w-4" style={{ color: getColorBrightness(currentColor) > 128 ? "#1A1A26" : "#f8f8f2" }} />
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side="right">
        <div className="space-y-4">
          <h4 className="font-medium">Theme Color</h4>
          <HexColorPicker color={color} onChange={handleColorChange} />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="opacity-slider" className="text-sm">Opacity: {opacity}%</Label>
            </div>
            <Slider
              id="opacity-slider"
              defaultValue={[100]}
              value={[opacity]}
              max={100}
              min={0}
              step={1}
              onValueChange={handleOpacityChange}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {predefinedColors.map((presetColor) => (
              <button
                key={presetColor}
                className={`w-6 h-6 rounded-full transition-all ${
                  color === presetColor ? "ring-2 ring-offset-2" : ""
                }`}
                style={{ backgroundColor: presetColor }}
                onClick={() => handleColorChange(presetColor)}
                aria-label={`Color ${presetColor}`}
              />
            ))}
          </div>
          
          {/* Color preview */}
          <div className="rounded-md overflow-hidden">
            <div className="p-4 transition-all" style={previewStyle}>
              <div className="font-medium mb-2">Preview</div>
              <div className="opacity-80">Theme preview sample text</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs opacity-70">Current: {color} ({opacity}%)</div>
            <Button size="sm" onClick={handleSaveColor}>
              Apply Theme
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BackgroundPicker;