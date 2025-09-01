import { LoadingSpinner } from './LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';

// Full page loading screen
export function PageLoading({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">{text}</p>
          <p className="text-sm text-muted-foreground">Preparando seus dados...</p>
        </div>
      </div>
    </div>
  );
}

// Meal card skeleton loading
export function MealCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border bg-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
      <Skeleton className="h-4 w-32 mx-auto mb-2" />
      <Skeleton className="h-10 w-20 mx-auto mb-4" />
      <Skeleton className="h-2 w-full rounded-full mb-2" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// Generic list loading
export function ListLoading({ 
  count = 3, 
  itemHeight = "h-16",
  text = "Carregando itens..." 
}: { 
  count?: number; 
  itemHeight?: string;
  text?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <LoadingSpinner size="sm" text={text} />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`w-full ${itemHeight} rounded-lg`} />
      ))}
    </div>
  );
}

// Inline loading for content areas
export function InlineLoading({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="sm" text={text} />
    </div>
  );
}