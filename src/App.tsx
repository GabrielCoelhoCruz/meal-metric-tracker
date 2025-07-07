import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DietProvider } from "@/contexts/DietContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import MealDetail from "./pages/MealDetail";
import FoodExchange from "./pages/FoodExchange";
import MealManagement from "./pages/MealManagement";
import MealEditor from "./pages/MealEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <DietProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/meal/:mealId" element={<MealDetail />} />
              <Route path="/food-exchange/:mealId/:foodId" element={<FoodExchange />} />
              <Route path="/meal-management" element={<MealManagement />} />
              <Route path="/meal-editor/:mealId" element={<MealEditor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DietProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
