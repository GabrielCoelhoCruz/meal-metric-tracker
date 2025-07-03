import { Food, FoodCategory } from "@/types/diet";

// Base de dados inicial de alimentos
export const initialFoods: Food[] = [
  // Proteínas
  {
    id: "food-1",
    name: "Ovos",
    category: FoodCategory.PROTEIN,
    nutritionalInfo: {
      calories: 73.5,
      carbohydrates: 0.3,
      protein: 6.3,
      fat: 5.0,
      fiber: 0,
      sodium: 65
    },
    defaultUnit: "unidade",
    defaultQuantity: 1
  },
  {
    id: "food-2",
    name: "Peito de Frango Grelhado",
    category: FoodCategory.PROTEIN,
    nutritionalInfo: {
      calories: 165,
      carbohydrates: 0,
      protein: 31,
      fat: 3.6,
      fiber: 0,
      sodium: 74
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  {
    id: "food-3",
    name: "Filé de Tilápia",
    category: FoodCategory.PROTEIN,
    nutritionalInfo: {
      calories: 96,
      carbohydrates: 0,
      protein: 20.1,
      fat: 1.7,
      fiber: 0,
      sodium: 52
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  // Carboidratos
  {
    id: "food-4",
    name: "Pão Francês",
    category: FoodCategory.CARBOHYDRATE,
    nutritionalInfo: {
      calories: 270,
      carbohydrates: 55,
      protein: 8,
      fat: 2,
      fiber: 2.3,
      sodium: 524
    },
    defaultUnit: "unidade",
    defaultQuantity: 1
  },
  {
    id: "food-5",
    name: "Arroz Branco Cozido",
    category: FoodCategory.CARBOHYDRATE,
    nutritionalInfo: {
      calories: 130,
      carbohydrates: 28,
      protein: 2.7,
      fat: 0.3,
      fiber: 0.4,
      sodium: 1
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  {
    id: "food-6",
    name: "Batata Doce Cozida",
    category: FoodCategory.CARBOHYDRATE,
    nutritionalInfo: {
      calories: 86,
      carbohydrates: 20,
      protein: 1.6,
      fat: 0.1,
      fiber: 3,
      sodium: 54
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  // Frutas
  {
    id: "food-7",
    name: "Banana",
    category: FoodCategory.FRUIT,
    nutritionalInfo: {
      calories: 89,
      carbohydrates: 23,
      protein: 1.1,
      fat: 0.3,
      fiber: 2.6,
      sodium: 1
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  {
    id: "food-8",
    name: "Maçã",
    category: FoodCategory.FRUIT,
    nutritionalInfo: {
      calories: 52,
      carbohydrates: 14,
      protein: 0.3,
      fat: 0.2,
      fiber: 2.4,
      sodium: 1
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  // Vegetais
  {
    id: "food-9",
    name: "Brócolis Cozido",
    category: FoodCategory.VEGETABLE,
    nutritionalInfo: {
      calories: 35,
      carbohydrates: 7,
      protein: 2.8,
      fat: 0.4,
      fiber: 2.6,
      sodium: 33
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  // Laticínios
  {
    id: "food-10",
    name: "Iogurte Natural",
    category: FoodCategory.DAIRY,
    nutritionalInfo: {
      calories: 59,
      carbohydrates: 3.6,
      protein: 10,
      fat: 0.4,
      fiber: 0,
      sodium: 36
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  // Gorduras
  {
    id: "food-11",
    name: "Azeite de Oliva",
    category: FoodCategory.FAT,
    nutritionalInfo: {
      calories: 884,
      carbohydrates: 0,
      protein: 0,
      fat: 100,
      fiber: 0,
      sodium: 2
    },
    defaultUnit: "ml",
    defaultQuantity: 100
  },
  {
    id: "food-12",
    name: "Castanha do Pará",
    category: FoodCategory.FAT,
    nutritionalInfo: {
      calories: 656,
      carbohydrates: 12,
      protein: 14,
      fat: 67,
      fiber: 7.5,
      sodium: 3
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  }
];

// Plano de refeições padrão
export const defaultMealPlan = {
  meals: [
    {
      id: "meal-1",
      name: "Café da Manhã",
      scheduledTime: "07:00",
      foods: [
        { foodId: "food-1", quantity: 2, unit: "unidade" }, // 2 ovos
        { foodId: "food-4", quantity: 1, unit: "unidade" }, // 1 pão francês
        { foodId: "food-7", quantity: 100, unit: "gramas" } // 100g banana
      ]
    },
    {
      id: "meal-2", 
      name: "Lanche da Manhã",
      scheduledTime: "10:00",
      foods: [
        { foodId: "food-10", quantity: 150, unit: "gramas" }, // 150g iogurte
        { foodId: "food-8", quantity: 100, unit: "gramas" } // 100g maçã
      ]
    },
    {
      id: "meal-3",
      name: "Almoço", 
      scheduledTime: "12:30",
      foods: [
        { foodId: "food-2", quantity: 150, unit: "gramas" }, // 150g frango
        { foodId: "food-5", quantity: 100, unit: "gramas" }, // 100g arroz
        { foodId: "food-9", quantity: 100, unit: "gramas" }, // 100g brócolis
        { foodId: "food-11", quantity: 10, unit: "ml" } // 10ml azeite
      ]
    },
    {
      id: "meal-4",
      name: "Lanche da Tarde",
      scheduledTime: "15:30",
      foods: [
        { foodId: "food-12", quantity: 30, unit: "gramas" } // 30g castanha
      ]
    },
    {
      id: "meal-5",
      name: "Jantar",
      scheduledTime: "19:00", 
      foods: [
        { foodId: "food-3", quantity: 150, unit: "gramas" }, // 150g tilápia
        { foodId: "food-6", quantity: 150, unit: "gramas" }, // 150g batata doce
        { foodId: "food-9", quantity: 100, unit: "gramas" } // 100g brócolis
      ]
    }
  ],
  targetCalories: 2243
};