import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Scale } from 'lucide-react';
import { Food, MealFood, calculateTotalNutrition } from '@/types/diet';
import { validateQuantity, sanitizeNumber } from '@/lib/validation';
import { useThrottle } from '@/hooks/useThrottle';

interface EditQuantityDialogProps {
  mealFood: MealFood;
  food: Food;
  onUpdateQuantity: (newQuantity: number) => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditQuantityDialog({ mealFood, food, onUpdateQuantity, children, open, onOpenChange }: EditQuantityDialogProps) {
  const [quantity, setQuantity] = useState(mealFood.quantity);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use controlled or uncontrolled state
  const isOpen = open !== undefined ? open : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  const displayFood = mealFood.substitutedFood || food;
  const nutrition = calculateTotalNutrition(displayFood, quantity);

  // Throttle the update function to prevent rapid consecutive calls
  const throttledUpdateQuantity = useThrottle(onUpdateQuantity, 300);

  const handleSave = () => {
    try {
      const validatedQuantity = validateQuantity(quantity);
      throttledUpdateQuantity(validatedQuantity);
      setIsOpen(false);
    } catch (error) {
      console.error('Invalid quantity:', error);
    }
  };

  const handleCancel = () => {
    setQuantity(mealFood.quantity);
    setIsOpen(false);
  };

  const adjustQuantity = (delta: number) => {
    try {
      const sanitizedDelta = sanitizeNumber(delta);
      const newQuantity = Math.max(0, quantity + sanitizedDelta);
      const validatedQuantity = validateQuantity(newQuantity);
      setQuantity(validatedQuantity);
    } catch (error) {
      console.error('Invalid quantity adjustment:', error);
    }
  };

  const commonQuantities = [
    { label: '1/2 porção', value: displayFood.defaultQuantity * 0.5 },
    { label: '1 porção', value: displayFood.defaultQuantity },
    { label: '1.5 porções', value: displayFood.defaultQuantity * 1.5 },
    { label: '2 porções', value: displayFood.defaultQuantity * 2 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Editar Quantidade
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-1">{displayFood.name}</h3>
            <p className="text-sm text-muted-foreground">
              Unidade padrão: {displayFood.defaultQuantity} {displayFood.defaultUnit}
            </p>
          </div>

          {/* Quantidade Manual */}
          <div className="space-y-3">
            <Label htmlFor="quantity">Quantidade ({mealFood.unit})</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustQuantity(-10)}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => {
                  try {
                    const value = sanitizeNumber(e.target.value);
                    const validatedValue = validateQuantity(value);
                    setQuantity(validatedValue);
                  } catch (error) {
                    // Keep current value if invalid
                    console.warn('Invalid input ignored:', error);
                  }
                }}
                className="text-center text-lg font-semibold"
                min="0"
                max="10000"
                step="5"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustQuantity(10)}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quantidades Comuns */}
          <div className="space-y-3">
            <Label>Quantidades comuns</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonQuantities.map((option) => (
                <Button
                  key={option.label}
                  variant={quantity === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    try {
                      const validatedValue = validateQuantity(option.value);
                      setQuantity(validatedValue);
                    } catch (error) {
                      console.error('Invalid preset quantity:', error);
                    }
                  }}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview Nutricional */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            <h4 className="font-medium text-sm">Informações nutricionais</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{Math.round(nutrition.calories)}</div>
                <div className="text-xs text-muted-foreground">kcal</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carboidratos:</span>
                  <span className="font-medium">{Math.round(nutrition.carbohydrates)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proteínas:</span>
                  <span className="font-medium">{Math.round(nutrition.protein)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gorduras:</span>
                  <span className="font-medium">{Math.round(nutrition.fat)}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={quantity <= 0}
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}