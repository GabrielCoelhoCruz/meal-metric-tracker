import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Search, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useDiet } from '@/contexts/DietContext';
import { Meal, MealFood, Food, FoodCategory } from '@/types/diet';
import { EditQuantityDialog } from '@/components/EditQuantityDialog';

export default function MealEditor() {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const { currentDayPlan, foods, updateMeal, addMeal } = useDiet();
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [isNewMeal, setIsNewMeal] = useState(false);
  const [isAddFoodDialogOpen, setIsAddFoodDialogOpen] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | ''>('');
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);

  const [mealForm, setMealForm] = useState({
    name: '',
    scheduledTime: ''
  });

  useEffect(() => {
    if (mealId === 'new') {
      setIsNewMeal(true);
      setMeal({
        id: `meal-${Date.now()}`,
        name: '',
        scheduledTime: '',
        foods: [],
        isCompleted: false
      });
    } else if (currentDayPlan && mealId) {
      const foundMeal = currentDayPlan.meals.find(m => m.id === mealId);
      if (foundMeal) {
        setMeal(foundMeal);
        setMealForm({
          name: foundMeal.name,
          scheduledTime: foundMeal.scheduledTime
        });
      }
    }
  }, [mealId, currentDayPlan]);

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesCategory = selectedCategory === '' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.values(FoodCategory);

  const addFoodToMeal = (food: Food) => {
    if (!meal) return;
    
    const newMealFood: MealFood = {
      id: `${meal.id}-${food.id}-${Date.now()}`,
      foodId: food.id,
      quantity: food.defaultQuantity,
      unit: food.defaultUnit,
      isCompleted: false
    };

    setMeal({
      ...meal,
      foods: [...meal.foods, newMealFood]
    });
    setIsAddFoodDialogOpen(false);
    setFoodSearch('');
  };

  const removeFoodFromMeal = (mealFoodId: string) => {
    if (!meal) return;
    setMeal({
      ...meal,
      foods: meal.foods.filter(f => f.id !== mealFoodId)
    });
  };

  const updateFoodQuantity = (mealFoodId: string, newQuantity: number) => {
    if (!meal) return;
    setMeal({
      ...meal,
      foods: meal.foods.map(f => 
        f.id === mealFoodId ? { ...f, quantity: newQuantity } : f
      )
    });
  };

  const saveMeal = () => {
    if (!meal || !mealForm.name.trim() || !mealForm.scheduledTime) return;

    const updatedMeal = {
      ...meal,
      name: mealForm.name,
      scheduledTime: mealForm.scheduledTime
    };

    if (isNewMeal) {
      addMeal?.(updatedMeal);
    } else {
      updateMeal?.(updatedMeal);
    }

    navigate('/meal-management');
  };

  const getMealCalories = (): number => {
    if (!meal) return 0;
    return meal.foods.reduce((total, mealFood) => {
      const food = foods.find(f => f.id === mealFood.foodId);
      if (!food) return total;
      
      const multiplier = mealFood.quantity / food.defaultQuantity;
      return total + (food.nutritionalInfo.calories * multiplier);
    }, 0);
  };

  const getCategoryLabel = (category: FoodCategory): string => {
    const labels = {
      [FoodCategory.PROTEIN]: 'Proteínas',
      [FoodCategory.CARBOHYDRATE]: 'Carboidratos',
      [FoodCategory.FRUIT]: 'Frutas',
      [FoodCategory.VEGETABLE]: 'Vegetais',
      [FoodCategory.DAIRY]: 'Laticínios',
      [FoodCategory.FAT]: 'Gorduras',
      [FoodCategory.SUPPLEMENT]: 'Suplementos'
    };
    return labels[category];
  };

  if (!meal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/meal-management')}
                className="h-10 w-10 p-0 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">
                  {isNewMeal ? 'Nova Refeição' : 'Editar Refeição'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {Math.round(getMealCalories())} kcal • {meal.foods.length} alimentos
                </p>
              </div>
            </div>
            
            <Button 
              onClick={saveMeal}
              disabled={!mealForm.name.trim() || !mealForm.scheduledTime}
              size="sm"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Meal Details Form */}
        <Card className="p-4 border border-border/30 rounded-3xl">
          <h3 className="font-semibold text-lg mb-4">Detalhes da Refeição</h3>
          <div className="grid gap-4">
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
          </div>
        </Card>

        {/* Foods List */}
        <Card className="p-4 border border-border/30 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Alimentos</h3>
            <Dialog open={isAddFoodDialogOpen} onOpenChange={setIsAddFoodDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full h-9 px-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Alimento</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar alimentos..."
                      value={foodSearch}
                      onChange={(e) => setFoodSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('')}
                    >
                      Todas
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {getCategoryLabel(category)}
                      </Button>
                    ))}
                  </div>

                  {/* Foods Grid */}
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {filteredFoods.map(food => (
                      <div
                        key={food.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 cursor-pointer"
                        onClick={() => addFoodToMeal(food)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{food.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryLabel(food.category)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {food.nutritionalInfo.calories} kcal por {food.defaultQuantity}{food.defaultUnit}
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {meal.foods.length > 0 ? (
            <div className="space-y-3">
              {meal.foods.map(mealFood => {
                const food = foods.find(f => f.id === mealFood.foodId);
                if (!food) return null;

                const calories = Math.round((food.nutritionalInfo.calories * mealFood.quantity) / food.defaultQuantity);

                return (
                  <div key={mealFood.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{food.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryLabel(food.category)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {mealFood.quantity}{mealFood.unit} • {calories} kcal
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFoodId(mealFood.id)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFoodFromMeal(mealFood.id)}
                        className="h-8 w-8 p-0 rounded-full text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Nenhum alimento adicionado ainda</p>
              <p className="text-xs mt-1">Clique em "Adicionar" para começar</p>
            </div>
          )}
        </Card>
      </div>

      {/* Edit Quantity Dialog */}
      {editingFoodId && (() => {
        const mealFood = meal.foods.find(f => f.id === editingFoodId);
        const food = mealFood ? foods.find(f => f.id === mealFood.foodId) : null;
        
        if (!mealFood || !food) return null;

        return (
          <EditQuantityDialog
            mealFood={mealFood}
            food={food}
            onUpdateQuantity={(newQuantity) => {
              updateFoodQuantity(mealFood.id, newQuantity);
              setEditingFoodId(null);
            }}
          >
            <div /> {/* Placeholder - Dialog is controlled via editingFoodId state */}
          </EditQuantityDialog>
        );
      })()}
    </div>
  );
}