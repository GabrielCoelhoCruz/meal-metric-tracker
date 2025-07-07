import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Scale } from 'lucide-react';
import { Food, MealFood, calculateTotalNutrition } from '@/types/diet';

interface EditQuantityDialogProps {
  mealFood: MealFood;
  food: Food;
  onUpdateQuantity: (newQuantity: number) => void;
  children: React.ReactNode;
}

export function EditQuantityDialog({ mealFood, food, onUpdateQuantity, children }: EditQuantityDialogProps) {
  const [quantity, setQuantity] = useState(mealFood.quantity);
  const [isOpen, setIsOpen] = useState(false);

  const displayFood = mealFood.substitutedFood || food;
  const nutrition = calculateTotalNutrition(displayFood, quantity);

  const handleSave = () => {
    onUpdateQuantity(quantity);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setQuantity(mealFood.quantity);
    setIsOpen(false);
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(0, quantity + delta);
    setQuantity(newQuantity);
  };

  const commonQuantities = [
    { label: '1/2 porção', value: displayFood.defaultQuantity * 0.5 },
    { label: '1 porção', value: displayFood.defaultQuantity },
    { label: '1.5 porções', value: displayFood.defaultQuantity * 1.5 },
    { label: '2 porções', value: displayFood.defaultQuantity * 2 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="text-center text-lg font-semibold"
                min="0"
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
                  onClick={() => setQuantity(option.value)}
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