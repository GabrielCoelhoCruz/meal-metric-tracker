import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { DailyPlan, Meal, MealFood, Food } from '@/types/diet';
import { useDietPersistence } from '@/hooks/useDietPersistence';
import { useMotivationalToast } from '@/hooks/useMotivationalToast';

interface DietState {
  currentDayPlan: DailyPlan | null;
  foods: Food[];
  isLoading: boolean;
}

interface DietContextType extends DietState {
  markMealAsCompleted: (mealId: string) => void;
  unmarkMealAsCompleted: (mealId: string) => void;
  markEntireMealAsCompleted: (mealId: string) => void;
  markMealFoodAsCompleted: (mealId: string, foodId: string) => void;
  updateMealFoodQuantity: (mealId: string, foodId: string, newQuantity: number) => void;
  substituteFoodInMeal: (mealId: string, originalFoodId: string, newFood: Food, quantity: number) => void;
  loadDayPlan: (date: string) => void;
  getMealProgress: (mealId: string) => number;
  getDailyProgress: () => number;
  getCurrentDayCalories: () => number;
  addMeal: (meal: Meal) => void;
  updateMeal: (meal: Meal) => void;
  deleteMeal: (mealId: string) => void;
}

type DietAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DAILY_PLAN'; payload: DailyPlan | null }
  | { type: 'SET_FOODS'; payload: Food[] }
  | { type: 'MARK_MEAL_COMPLETED'; payload: string }
  | { type: 'UNMARK_MEAL_COMPLETED'; payload: string }
  | { type: 'MARK_ENTIRE_MEAL_COMPLETED'; payload: string }
  | { type: 'MARK_MEAL_FOOD_COMPLETED'; payload: { mealId: string; foodId: string } }
  | { type: 'UPDATE_MEAL_FOOD_QUANTITY'; payload: { mealId: string; foodId: string; newQuantity: number } }
  | { type: 'SUBSTITUTE_FOOD'; payload: { mealId: string; originalFoodId: string; newFood: Food; quantity: number } }
  | { type: 'ADD_MEAL'; payload: Meal }
  | { type: 'UPDATE_MEAL'; payload: Meal }
  | { type: 'DELETE_MEAL'; payload: string };

const initialState: DietState = {
  currentDayPlan: null,
  foods: [],
  isLoading: false
};

const DietContext = createContext<DietContextType | undefined>(undefined);

function dietReducer(state: DietState, action: DietAction): DietState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_DAILY_PLAN':
      return { ...state, currentDayPlan: action.payload, isLoading: false };
    
    case 'SET_FOODS':
      return { ...state, foods: action.payload };
    
    case 'MARK_MEAL_COMPLETED':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: state.currentDayPlan.meals.map(meal =>
            meal.id === action.payload
              ? { ...meal, isCompleted: true, completedAt: new Date() }
              : meal
          )
        }
      };
    
    case 'UNMARK_MEAL_COMPLETED':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: state.currentDayPlan.meals.map(meal =>
            meal.id === action.payload
              ? { ...meal, isCompleted: false, completedAt: undefined }
              : meal
          )
        }
      };
    
    case 'UPDATE_MEAL_FOOD_QUANTITY':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: state.currentDayPlan.meals.map(meal =>
            meal.id === action.payload.mealId
              ? {
                  ...meal,
                  foods: meal.foods.map(food =>
                    food.id === action.payload.foodId
                      ? { ...food, quantity: action.payload.newQuantity }
                      : food
                  )
                }
              : meal
          )
        }
      };
    
    case 'MARK_ENTIRE_MEAL_COMPLETED':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: state.currentDayPlan.meals.map(meal =>
            meal.id === action.payload
              ? { 
                  ...meal, 
                  isCompleted: true, 
                  completedAt: new Date(),
                  foods: meal.foods.map(food => ({ ...food, isCompleted: true }))
                }
              : meal
          )
        }
      };
    
    case 'MARK_MEAL_FOOD_COMPLETED':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: state.currentDayPlan.meals.map(meal =>
            meal.id === action.payload.mealId
              ? {
                  ...meal,
                  foods: meal.foods.map(food =>
                    food.id === action.payload.foodId
                      ? { ...food, isCompleted: !food.isCompleted }
                      : food
                  )
                }
              : meal
          )
        }
      };
    
    case 'SUBSTITUTE_FOOD':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: state.currentDayPlan.meals.map(meal =>
            meal.id === action.payload.mealId
              ? {
                  ...meal,
                  foods: meal.foods.map(food =>
                    food.id === action.payload.originalFoodId
                       ? {
                           ...food,
                           substitutedFood: action.payload.newFood,
                           quantity: action.payload.quantity,
                           unit: action.payload.newFood.defaultUnit
                         }
                      : food
                  )
                }
              : meal
          )
        }
      };
    
    case 'ADD_MEAL':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: [...state.currentDayPlan.meals, action.payload]
        }
      };
    
    case 'UPDATE_MEAL':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: state.currentDayPlan.meals.map(meal =>
            meal.id === action.payload.id ? action.payload : meal
          )
        }
      };
    
    case 'DELETE_MEAL':
      if (!state.currentDayPlan) return state;
      return {
        ...state,
        currentDayPlan: {
          ...state.currentDayPlan,
          meals: state.currentDayPlan.meals.filter(meal => meal.id !== action.payload)
        }
      };
    
    default:
      return state;
  }
}

export function DietProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dietReducer, initialState);
  const { showFoodCompletionToast, showMealCompletionToast, showDailyGoalToast } = useMotivationalToast();
  const { 
    loadDayPlan: loadDayPlanFromDB, 
    loadFoods, 
    updateMealCompletion, 
    updateMealFoodCompletion, 
    updateMealFoodQuantity: updateQuantityInDB, 
    substituteFoodInMeal: substituteFoodInDB,
    isLoading: persistenceLoading 
  } = useDietPersistence();

  const markMealAsCompleted = async (mealId: string) => {
    const success = await updateMealCompletion(mealId, true);
    if (success) {
      dispatch({ type: 'MARK_MEAL_COMPLETED', payload: mealId });
      showMealCompletionToast();
      
      // Check if all meals are completed for daily goal
      setTimeout(() => {
        const progress = getDailyProgress();
        if (progress === 100) {
          showDailyGoalToast();
        }
      }, 100);
    }
  };

  const unmarkMealAsCompleted = async (mealId: string) => {
    const success = await updateMealCompletion(mealId, false);
    if (success) {
      dispatch({ type: 'UNMARK_MEAL_COMPLETED', payload: mealId });
    }
  };

  const markEntireMealAsCompleted = async (mealId: string) => {
    const success = await updateMealCompletion(mealId, true);
    if (success) {
      dispatch({ type: 'MARK_ENTIRE_MEAL_COMPLETED', payload: mealId });
      showMealCompletionToast();
      
      // Check if all meals are completed for daily goal
      setTimeout(() => {
        const progress = getDailyProgress();
        if (progress === 100) {
          showDailyGoalToast();
        }
      }, 100);
    }
  };

  const markMealFoodAsCompleted = async (mealId: string, foodId: string) => {
    const wasCompleted = state.currentDayPlan?.meals
      .find(m => m.id === mealId)?.foods
      .find(f => f.id === foodId)?.isCompleted;
    
    const success = await updateMealFoodCompletion(foodId, !wasCompleted);
    if (success) {
      dispatch({ type: 'MARK_MEAL_FOOD_COMPLETED', payload: { mealId, foodId } });
      
      // Show motivational toast when completing food
      if (!wasCompleted) {
        showFoodCompletionToast();
      }
    }
  };

  const updateMealFoodQuantity = async (mealId: string, foodId: string, newQuantity: number) => {
    const success = await updateQuantityInDB(foodId, newQuantity);
    if (success) {
      dispatch({ type: 'UPDATE_MEAL_FOOD_QUANTITY', payload: { mealId, foodId, newQuantity } });
    }
  };

  const substituteFoodInMeal = async (mealId: string, originalFoodId: string, newFood: Food, quantity: number) => {
    const success = await substituteFoodInDB(originalFoodId, newFood.id, quantity);
    if (success) {
      dispatch({ type: 'SUBSTITUTE_FOOD', payload: { mealId, originalFoodId, newFood, quantity } });
    }
  };

  const loadDayPlan = async (date: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const dayPlan = await loadDayPlanFromDB(date);
      dispatch({ type: 'SET_DAILY_PLAN', payload: dayPlan });
    } catch (error) {
      console.error('Error loading day plan:', error);
      dispatch({ type: 'SET_DAILY_PLAN', payload: null });
    }
  };

  const getMealProgress = (mealId: string): number => {
    if (!state.currentDayPlan) return 0;
    const meal = state.currentDayPlan.meals.find(m => m.id === mealId);
    if (!meal || meal.foods.length === 0) return 0;
    
    const completedFoods = meal.foods.filter(f => f.isCompleted).length;
    return (completedFoods / meal.foods.length) * 100;
  };

  const getDailyProgress = (): number => {
    if (!state.currentDayPlan) return 0;
    const completedMeals = state.currentDayPlan.meals.filter(m => m.isCompleted).length;
    return (completedMeals / state.currentDayPlan.meals.length) * 100;
  };

  const getCurrentDayCalories = (): number => {
    if (!state.currentDayPlan) return 0;
    return state.currentDayPlan.meals
      .filter(meal => meal.isCompleted)
      .reduce((total, meal) => {
        return total + meal.foods.reduce((mealTotal, mealFood) => {
          // Use substituted food if available, otherwise use original food
          const food = mealFood.substitutedFood || state.foods.find(f => f.id === mealFood.foodId);
          if (!food) return mealTotal;
          
          const multiplier = mealFood.quantity / food.defaultQuantity;
          return mealTotal + (food.nutritionalInfo.calories * multiplier);
        }, 0);
      }, 0);
  };

  const addMeal = (meal: Meal) => {
    dispatch({ type: 'ADD_MEAL', payload: meal });
  };

  const updateMeal = (meal: Meal) => {
    dispatch({ type: 'UPDATE_MEAL', payload: meal });
  };

  const deleteMeal = (mealId: string) => {
    dispatch({ type: 'DELETE_MEAL', payload: mealId });
  };

  useEffect(() => {
    // Carregar alimentos e plano do dia atual
    const initializeApp = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Load foods first
        const foods = await loadFoods();
        dispatch({ type: 'SET_FOODS', payload: foods });
        
        // Then load today's plan
        const today = new Date().toISOString().split('T')[0];
        await loadDayPlan(today);
      } catch (error) {
        console.error('Error initializing app:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    initializeApp();
  }, []);

  const contextValue: DietContextType = {
    ...state,
    isLoading: state.isLoading || persistenceLoading,
    markMealAsCompleted,
    unmarkMealAsCompleted,
    markEntireMealAsCompleted,
    markMealFoodAsCompleted,
    updateMealFoodQuantity,
    substituteFoodInMeal,
    loadDayPlan,
    getMealProgress,
    getDailyProgress,
    getCurrentDayCalories,
    addMeal,
    updateMeal,
    deleteMeal
  };

  return (
    <DietContext.Provider value={contextValue}>
      {children}
    </DietContext.Provider>
  );
}

export function useDiet(): DietContextType {
  const context = useContext(DietContext);
  if (context === undefined) {
    throw new Error('useDiet must be used within a DietProvider');
  }
  return context;
}