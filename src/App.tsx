import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DietProvider } from "@/contexts/DietContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import MealDetail from "./pages/MealDetail";
import FoodExchange from "./pages/FoodExchange";
import MealManagement from "./pages/MealManagement";
import MealEditor from "./pages/MealEditor";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <DietProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="relative min-h-screen">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/meal/:mealId" element={<MealDetail />} />
                  <Route path="/food-exchange/:mealId/:foodId" element={<FoodExchange />} />
                  <Route path="/meal-management" element={<MealManagement />} />
                  <Route path="/meal-editor/:mealId" element={<MealEditor />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <BottomNavigation />
              </div>
            </BrowserRouter>
          </DietProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
