import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DietProvider } from "@/contexts/DietContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MotivationalToastProvider } from "@/components/MotivationalToastProvider";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import MealDetail from "./pages/MealDetail";
import FoodExchange from "./pages/FoodExchange";
import FoodSubstitutions from "./pages/FoodSubstitutions";
import MealManagement from "./pages/MealManagement";
import MealEditor from "./pages/MealEditor";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Routes Component
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth page
  if (!user) {
    return <Auth />;
  }

  // If authenticated, show main app
  return (
    <DietProvider>
      <MotivationalToastProvider>
        <BrowserRouter>
          <div className="relative min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/meal/:mealId" element={<MealDetail />} />
              <Route path="/food-exchange/:mealId/:foodId" element={<FoodExchange />} />
              <Route path="/food-substitutions" element={<FoodSubstitutions />} />
              <Route path="/meal-management" element={<MealManagement />} />
              <Route path="/meal-editor/:mealId" element={<MealEditor />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </div>
        </BrowserRouter>
      </MotivationalToastProvider>
    </DietProvider>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
