import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, History, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDiet } from '@/contexts/DietContext';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const location = useLocation();
  const { currentDayPlan } = useDiet();
  
  // Calcular refeições pendentes
  const pendingMeals = currentDayPlan?.meals.filter(meal => !meal.isCompleted).length || 0;

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Hoje',
      badge: pendingMeals > 0 ? pendingMeals : null
    },
    {
      path: '/history',
      icon: History,
      label: 'Histórico',
      badge: null
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Config',
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border backdrop-blur-md bg-card/95">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] p-1 rounded-lg transition-all duration-200",
                "touch-manipulation", // Otimização para touch
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className="relative" aria-hidden>
                <Icon size={20} aria-hidden />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-semibold"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium mt-0.5 leading-none",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}