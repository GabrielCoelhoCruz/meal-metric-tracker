import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

const colors = [
  'bg-primary',
  'bg-success', 
  'bg-accent',
  'bg-warning',
  'bg-secondary',
  'bg-destructive'
];

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      
      // Gerar peças de confetti
      const newPieces = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 500
      }));
      
      setPieces(newPieces);
      
      // Limpar após animação
      const timer = setTimeout(() => {
        setIsActive(false);
        setPieces([]);
        onComplete?.();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={cn(
            "absolute rounded-full animate-confetti",
            piece.color
          )}
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}ms`
          }}
        />
      ))}
    </div>
  );
}