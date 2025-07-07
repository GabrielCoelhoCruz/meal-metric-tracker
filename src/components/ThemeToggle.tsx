import React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, accentColor, toggleTheme, setAccentColor } = useTheme();

  const accentColors = [
    { id: 'default', name: 'Padrão', color: 'hsl(217, 91%, 60%)' },
    { id: 'blue', name: 'Azul', color: 'hsl(221, 83%, 53%)' },
    { id: 'green', name: 'Verde', color: 'hsl(142, 76%, 36%)' },
    { id: 'mono', name: 'Monocromático', color: 'hsl(0, 0%, 20%)' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Personalização</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Dark/Light Toggle */}
        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
          {theme === 'light' ? (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Modo Escuro</span>
            </>
          ) : (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Modo Claro</span>
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Cor do Tema</DropdownMenuLabel>
        
        {/* Accent Color Options */}
        {accentColors.map((color) => (
          <DropdownMenuItem
            key={color.id}
            onClick={() => setAccentColor(color.id as any)}
            className="cursor-pointer"
          >
            <div className="flex items-center w-full">
              <div
                className={cn(
                  "w-4 h-4 rounded-full mr-2 border-2",
                  accentColor === color.id ? "border-foreground" : "border-transparent"
                )}
                style={{ backgroundColor: color.color }}
              />
              <span>{color.name}</span>
              {accentColor === color.id && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}