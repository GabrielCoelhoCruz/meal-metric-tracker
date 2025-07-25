import { Food, FoodCategory } from "@/types/diet";

// Base de dados de alimentos baseada na Tabela TACO
export const initialFoods: Food[] = [
  // Proteínas
  {
    id: "food-1",
    name: "Ovos",
    category: FoodCategory.PROTEIN,
    nutritionalInfo: {
      calories: 73.5, // Por unidade (50g)
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
    name: "Filé de Frango",
    category: FoodCategory.PROTEIN,
    nutritionalInfo: {
      calories: 159, // Por 100g (TACO)
      carbohydrates: 0,
      protein: 32.8,
      fat: 2.9,
      fiber: 0,
      sodium: 77
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  {
    id: "food-3", 
    name: "Whey Protein Concentrado DUX",
    category: FoodCategory.PROTEIN,
    nutritionalInfo: {
      calories: 122, // Por 30g (1 dosador)
      carbohydrates: 5.7, // Por 30g
      protein: 20.0, // Por 30g
      fat: 2.1, // Por 30g
      fiber: 0,
      sodium: 114 // Por 30g
    },
    defaultUnit: "gramas", 
    defaultQuantity: 30 // 1 dosador = 30g
  },
  // Carboidratos
  {
    id: "food-4",
    name: "Pão Francês",
    category: FoodCategory.CARBOHYDRATE,
    nutritionalInfo: {
      calories: 300, // Por unidade (50g) - TACO
      carbohydrates: 58.6,
      protein: 8.0,
      fat: 3.1,
      fiber: 2.3,
      sodium: 659
    },
    defaultUnit: "unidade",
    defaultQuantity: 1
  },
  {
    id: "food-5",
    name: "Arroz Branco Cozido",
    category: FoodCategory.CARBOHYDRATE, 
    nutritionalInfo: {
      calories: 128, // Por 100g - TACO
      carbohydrates: 25.8,
      protein: 2.5,
      fat: 0.2,
      fiber: 1.6,
      sodium: 1
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  // Frutas
  {
    id: "food-6",
    name: "Banana",
    category: FoodCategory.FRUIT,
    nutritionalInfo: {
      calories: 92, // Por 100g - TACO
      carbohydrates: 23.8,
      protein: 1.3,
      fat: 0.1,
      fiber: 1.9,
      sodium: 0
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  {
    id: "food-7",
    name: "Mamão",
    category: FoodCategory.FRUIT,
    nutritionalInfo: {
      calories: 40, // Por 100g - TACO
      carbohydrates: 10.4,
      protein: 0.5,
      fat: 0.1,
      fiber: 1.8,
      sodium: 3
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  },
  {
    id: "food-8",
    name: "Maçã",
    category: FoodCategory.FRUIT,
    nutritionalInfo: {
      calories: 56, // Por 100g - TACO
      carbohydrates: 15.2,
      protein: 0.2,
      fat: 0.1,
      fiber: 1.3,
      sodium: 0
    },
    defaultUnit: "gramas",
    defaultQuantity: 100
  }
];

// Plano de refeições específico baseado nas suas especificações
export const defaultMealPlan = {
  meals: [
    {
      id: "meal-1",
      name: "Refeição 1",
      scheduledTime: "07:00", 
      foods: [
        { foodId: "food-1", quantity: 4, unit: "unidade" }, // 4 ovos
        { foodId: "food-4", quantity: 1, unit: "unidade" }, // 1 pão francês (50g)
        { foodId: "food-6", quantity: 100, unit: "gramas" } // 100g banana
      ]
    },
    {
      id: "meal-2",
      name: "Refeição 2", 
      scheduledTime: "12:00",
      foods: [
        { foodId: "food-5", quantity: 100, unit: "gramas" }, // 100g arroz
        { foodId: "food-2", quantity: 150, unit: "gramas" }, // 150g filé de frango
        { foodId: "food-7", quantity: 100, unit: "gramas" } // 100g mamão
      ]
    },
    {
      id: "meal-3",
      name: "Refeição 3",
      scheduledTime: "15:00",
      foods: [
        { foodId: "food-3", quantity: 40, unit: "gramas" }, // 40g whey protein
        { foodId: "food-7", quantity: 100, unit: "gramas" }, // 100g mamão
        { foodId: "food-6", quantity: 100, unit: "gramas" }, // 100g banana
        { foodId: "food-8", quantity: 100, unit: "gramas" } // 100g maçã
      ]
    },
    {
      id: "meal-4",
      name: "Refeição 4 (Pré-treino)",
      scheduledTime: "17:00",
      foods: [
        { foodId: "food-1", quantity: 4, unit: "unidade" }, // 4 ovos
        { foodId: "food-7", quantity: 150, unit: "gramas" } // 150g mamão
      ]
    },
    {
      id: "meal-5", 
      name: "Refeição 5 (Pós-treino)",
      scheduledTime: "19:00",
      foods: [
        { foodId: "food-3", quantity: 40, unit: "gramas" }, // 40g whey protein
        { foodId: "food-6", quantity: 100, unit: "gramas" } // 100g banana
      ]
    },
    {
      id: "meal-6",
      name: "Ceia",
      scheduledTime: "21:00", 
      foods: [
        { foodId: "food-1", quantity: 4, unit: "unidade" } // 4 ovos
      ]
    }
  ],
  targetCalories: 2346 // Calculado com base nos valores nutricionais corretos
};