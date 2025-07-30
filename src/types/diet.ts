// Tipos de dados para o app de controle de dieta

export enum FoodCategory {
  PROTEIN = "protein",
  CARBOHYDRATE = "carbohydrate", 
  FRUIT = "fruit",
  VEGETABLE = "vegetable",
  DAIRY = "dairy",
  FAT = "fat",
  SUPPLEMENT = "supplement"
}

export interface NutritionalInfo {
  calories: number;        // kcal por unidade padrão
  carbohydrates: number;   // gramas
  protein: number;         // gramas
  fat: number;            // gramas
  fiber?: number;         // gramas (opcional)
  sodium?: number;        // mg (opcional)
}

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  nutritionalInfo: NutritionalInfo;
  defaultUnit: string;
  defaultQuantity: number;
  isCustom?: boolean;
}

export interface MealFood {
  id: string;
  foodId: string;
  quantity: number;
  unit: string;
  isCompleted: boolean;
  substitutedFood?: Food;
}

export interface Meal {
  id: string;
  name: string;
  scheduledTime: string; // formato "HH:mm"
  foods: MealFood[];
  isCompleted: boolean;
  completedAt?: Date;
}

export interface DailyPlan {
  id: string;
  date: string; // formato "YYYY-MM-DD"
  meals: Meal[];
  targetCalories: number;
}

// Helper functions
export const calculateTotalNutrition = (food: Food, quantity: number): NutritionalInfo => {
  const multiplier = quantity / food.defaultQuantity;
  return {
    calories: food.nutritionalInfo.calories * multiplier,
    carbohydrates: food.nutritionalInfo.carbohydrates * multiplier,
    protein: food.nutritionalInfo.protein * multiplier,
    fat: food.nutritionalInfo.fat * multiplier,
    fiber: food.nutritionalInfo.fiber ? food.nutritionalInfo.fiber * multiplier : undefined,
    sodium: food.nutritionalInfo.sodium ? food.nutritionalInfo.sodium * multiplier : undefined,
  };
};

export const calculateEquivalentQuantity = (originalFood: Food, originalQuantity: number, targetFood: Food): number => {
  const originalCalories = calculateTotalNutrition(originalFood, originalQuantity).calories;
  // Calcular quantas unidades do targetFood são necessárias para ter as mesmas calorias
  const targetUnits = originalCalories / targetFood.nutritionalInfo.calories;
  // Retornar a quantidade equivalente baseada na quantidade padrão do targetFood
  return targetUnits * targetFood.defaultQuantity;
};