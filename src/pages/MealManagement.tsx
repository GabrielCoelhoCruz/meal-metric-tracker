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
import { BottomNavigation } from '@/components/BottomNavigation';

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
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Carregando...</h2>
          <p className="text-muted-foreground">Aguarde enquanto carregamos seus dados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground font-medium py-2 px-4 rounded-full border border-border bg-card shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          {/* Title Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gerenciar Refeições</h1>
                <p className="text-muted-foreground mt-2">
                  {currentDayPlan.meals.length} refeições configuradas
                </p>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <button className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary-hover transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
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
          </section>

          {/* Meals List */}
          <section className="space-y-4 mb-24">
            {currentDayPlan.meals.map((meal) => (
              <div key={meal.id} className="bg-card p-4 rounded-2xl shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-foreground">{meal.name}</h3>
                      {meal.isCompleted && (
                        <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                          Concluída
                        </span>
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
                    <button
                      onClick={() => handleEditMeal(meal)}
                      className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="p-2 text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {meal.foods.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Alimentos:</h4>
                      <div className="grid gap-2">
                        {meal.foods.map((mealFood) => {
                          const food = foods.find(f => f.id === mealFood.foodId);
                          if (!food) return null;
                          
                          return (
                            <div key={mealFood.id} className="flex justify-between items-center p-2 bg-muted rounded-xl">
                              <div>
                                <span className="font-medium text-foreground">{food.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  {mealFood.quantity}{mealFood.unit}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-muted-foreground">
                                {Math.round((food.nutritionalInfo.calories * mealFood.quantity) / food.defaultQuantity)} kcal
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/meal-editor/${meal.id}`)}
                      className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                    >
                      {meal.foods.length > 0 ? 'Editar alimentos' : 'Adicionar alimentos'}
                    </button>
                    <button
                      onClick={() => handleEditMeal(meal)}
                      className="px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-lg text-sm hover:bg-secondary/70 transition-colors"
                    >
                      Editar refeição
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {currentDayPlan.meals.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Nenhuma refeição</h3>
                <p className="text-muted-foreground mb-6">
                  Comece criando sua primeira refeição
                </p>
                <button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary-hover transition-colors"
                >
                  Criar primeira refeição
                </button>
              </div>
            )}
          </section>
        </main>

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
      
      <BottomNavigation />
    </div>
  );
}