import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({ 
  loading = false, 
  loadingText, 
  children, 
  disabled,
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button 
      disabled={disabled || loading}
      className={cn(
        loading && 'cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}