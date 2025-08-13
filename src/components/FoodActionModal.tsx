import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, RotateCw, Scale } from 'lucide-react';
import { Food, MealFood, calculateTotalNutrition } from '@/types/diet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FoodActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealFood: MealFood;
  food: Food;
  onToggleCompleted: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onSubstitute: () => void;
}

export function FoodActionModal({
  isOpen,
  onClose,
  mealFood,
  food,
  onToggleCompleted,
  onUpdateQuantity,
  onSubstitute
}: FoodActionModalProps) {
  const [customQuantity, setCustomQuantity] = useState(mealFood.quantity.toString());
  
  const displayFood = mealFood.substitutedFood || food;
  const currentMultiplier = mealFood.quantity / displayFood.defaultQuantity;
  const nutrition = calculateTotalNutrition(displayFood, mealFood.quantity);

  const handleQuantityChange = (multiplier: number) => {
    const newQuantity = displayFood.defaultQuantity * multiplier;
    onUpdateQuantity(newQuantity);
    setCustomQuantity(newQuantity.toString());
  };

  const handleCustomQuantitySubmit = () => {
    const quantity = parseFloat(customQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      onUpdateQuantity(quantity);
    }
  };

  const handleToggleCompleted = () => {
    onToggleCompleted();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{displayFood.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Status atual</span>
            <Badge variant={mealFood.isCompleted ? "default" : "secondary"}>
              {mealFood.isCompleted ? "Concluído" : "Pendente"}
            </Badge>
          </div>

          {/* Quick Quantity Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quantidade rápida</Label>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1, 1.5, 2].map((multiplier) => (
                <Button
                  key={multiplier}
                  variant={Math.abs(currentMultiplier - multiplier) < 0.1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuantityChange(multiplier)}
                  className="text-sm"
                >
                  {multiplier}x
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Quantity */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quantidade personalizada</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(e.target.value)}
                placeholder="Ex: 150"
                className="flex-1"
                min="0"
                step="0.1"
              />
              <Button onClick={handleCustomQuantitySubmit} size="sm">
                <Scale className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Quantidade atual: {mealFood.quantity}{mealFood.unit}
            </p>
          </div>

          {/* Nutrition Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Informações nutricionais</Label>
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{Math.round(nutrition.calories)}</p>
                <p className="text-xs text-muted-foreground">Calorias</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-accent">{Math.round(nutrition.carbohydrates)}g</p>
                <p className="text-xs text-muted-foreground">Carboidratos</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-success">{Math.round(nutrition.protein)}g</p>
                <p className="text-xs text-muted-foreground">Proteínas</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-destructive">{Math.round(nutrition.fat)}g</p>
                <p className="text-xs text-muted-foreground">Gorduras</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleToggleCompleted}
              className="w-full"
              variant={mealFood.isCompleted ? "outline" : "default"}
            >
              <Check className="w-4 h-4 mr-2" />
              {mealFood.isCompleted ? "Marcar como Pendente" : "Marcar como Concluído"}
            </Button>
            
            <Button
              onClick={() => {
                onSubstitute();
                onClose();
              }}
              variant="outline"
              className="w-full"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Substituir Alimento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}