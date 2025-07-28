import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Clock, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useDiet } from '@/contexts/DietContext';
import { Meal, MealFood, Food } from '@/types/diet';

export default function MealManagement() {
  const navigate = useNavigate();
  const { currentDayPlan, foods, addMeal, updateMeal, deleteMeal } = useDiet();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const [mealForm, setMealForm] = useState({
    name: '',
    scheduledTime: ''
  });

  const handleCreateMeal = () => {
    if (!mealForm.name.trim() || !mealForm.scheduledTime) return;

    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: mealForm.name,
      scheduledTime: mealForm.scheduledTime,
      foods: [],
      isCompleted: false
    };

    addMeal?.(newMeal);
    setMealForm({ name: '', scheduledTime: '' });
    setIsCreateDialogOpen(false);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      scheduledTime: meal.scheduledTime
    });
  };

  const handleUpdateMeal = () => {
    if (!editingMeal || !mealForm.name.trim() || !mealForm.scheduledTime) return;

    const updatedMeal: Meal = {
      ...editingMeal,
      name: mealForm.name,
      scheduledTime: mealForm.scheduledTime
    };

    updateMeal?.(updatedMeal);
    setEditingMeal(null);
    setMealForm({ name: '', scheduledTime: '' });
  };

  const handleDeleteMeal = (mealId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta refeição?')) {
      deleteMeal?.(mealId);
    }
  };

  const resetForm = () => {
    setMealForm({ name: '', scheduledTime: '' });
    setEditingMeal(null);
  };

  const getMealCalories = (meal: Meal): number => {
    return meal.foods.reduce((total, mealFood) => {
      const food = foods.find(f => f.id === mealFood.foodId);
      if (!food) return total;
      
      const multiplier = mealFood.quantity / food.defaultQuantity;
      return total + (food.nutritionalInfo.calories * multiplier);
    }, 0);
  };

  if (!currentDayPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Carregando...</h2>
          <p className="text-muted-foreground">Aguarde enquanto carregamos seus dados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="h-10 w-10 p-0 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Gerenciar Refeições</h1>
                <p className="text-sm text-muted-foreground">
                  {currentDayPlan.meals.length} refeições configuradas
                </p>
              </div>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="rounded-full h-10 px-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Refeição
                </Button>
              </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Nova Refeição</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mealName">Nome da refeição</Label>
                    <Input
                      id="mealName"
                      placeholder="Ex: Café da manhã, Almoço..."
                      value={mealForm.name}
                      onChange={(e) => setMealForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mealTime">Horário</Label>
                    <Input
                      id="mealTime"
                      type="time"
                      value={mealForm.scheduledTime}
                      onChange={(e) => setMealForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        resetForm();
                        setIsCreateDialogOpen(false);
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleCreateMeal}
                      className="flex-1"
                      disabled={!mealForm.name.trim() || !mealForm.scheduledTime}
                    >
                      Criar
                    </Button>
                  </div>
                </div>
              </DialogContent>
              </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {currentDayPlan.meals.map((meal) => (
          <Card key={meal.id} className="p-4 border border-border/30 rounded-3xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{meal.name}</h3>
                  {meal.isCompleted && (
                    <Badge variant="secondary" className="bg-success-light text-success-foreground">
                      Concluída
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {meal.scheduledTime}
                  </div>
                  <div>
                    {Math.round(getMealCalories(meal))} kcal
                  </div>
                  <div>
                    {meal.foods.length} {meal.foods.length === 1 ? 'alimento' : 'alimentos'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditMeal(meal)}
                  className="h-9 w-9 p-0 rounded-full"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteMeal(meal.id)}
                  className="h-9 w-9 p-0 rounded-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {meal.foods.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Alimentos:</h4>
                <div className="grid gap-2">
                  {meal.foods.map((mealFood) => {
                    const food = foods.find(f => f.id === mealFood.foodId);
                    if (!food) return null;
                    
                    return (
                      <div key={mealFood.id} className="flex justify-between items-center p-2 bg-muted/30 rounded-xl">
                        <div>
                          <span className="font-medium">{food.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {mealFood.quantity}{mealFood.unit}
                          </span>
                        </div>
                        <div className="text-sm font-medium">
                          {Math.round((food.nutritionalInfo.calories * mealFood.quantity) / food.defaultQuantity)} kcal
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">Nenhum alimento adicionado ainda</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/meal-editor/${meal.id}`)}
                  className="mt-2"
                >
                  Adicionar alimentos
                </Button>
              </div>
            )}
          </Card>
        ))}

        {currentDayPlan.meals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma refeição</h3>
            <p className="text-muted-foreground mb-6">
              Comece criando sua primeira refeição
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Criar primeira refeição
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingMeal} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Editar Refeição</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editMealName">Nome da refeição</Label>
              <Input
                id="editMealName"
                placeholder="Ex: Café da manhã, Almoço..."
                value={mealForm.name}
                onChange={(e) => setMealForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editMealTime">Horário</Label>
              <Input
                id="editMealTime"
                type="time"
                value={mealForm.scheduledTime}
                onChange={(e) => setMealForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={resetForm}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateMeal}
                className="flex-1"
                disabled={!mealForm.name.trim() || !mealForm.scheduledTime}
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}