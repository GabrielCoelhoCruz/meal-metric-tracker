import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Droplets, Calendar, Lightbulb, Eye } from 'lucide-react';

interface NotificationInteraction {
  title: string;
  body: string;
  action: string;
  timestamp: number;
}

export const NotificationFeedback = () => {
  const [lastInteraction, setLastInteraction] = useState<NotificationInteraction | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for notification interactions from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_CLICKED') {
        const interaction = event.data.data as NotificationInteraction;
        setLastInteraction(interaction);

        // Show subtle feedback based on notification type
        const getIcon = (title: string) => {
          if (title.includes('🍽️')) return '🍽️';
          if (title.includes('💧')) return '💧';
          if (title.includes('📋')) return '📋';
          if (title.includes('💡')) return '💡';
          return '📱';
        };

        const getActionText = (action: string) => {
          switch (action) {
            case 'snooze': return 'Pausado por 10 minutos';
            case 'view': return 'App aberto';
            default: return 'Notificação vista';
          }
        };

        toast({
          title: `${getIcon(interaction.title)} ${getActionText(interaction.action)}`,
          description: interaction.title.replace(/[🍽️💧📋💡🎯😴⏰]/g, '').trim(),
          duration: 2000,
        });
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);
    
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [toast]);

  // Show recent interaction indicator
  if (!lastInteraction) return null;

  const timeSince = Date.now() - lastInteraction.timestamp;
  if (timeSince > 30000) return null; // Hide after 30 seconds

  const getIconComponent = (title: string) => {
    if (title.includes('🍽️')) return <Clock className="h-3 w-3" />;
    if (title.includes('💧')) return <Droplets className="h-3 w-3" />;
    if (title.includes('📋')) return <Calendar className="h-3 w-3" />;
    if (title.includes('💡')) return <Lightbulb className="h-3 w-3" />;
    return <Bell className="h-3 w-3" />;
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <Badge 
        variant="secondary" 
        className="flex items-center gap-2 px-3 py-2 shadow-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        {getIconComponent(lastInteraction.title)}
        <Eye className="h-3 w-3" />
        <span className="text-xs">
          {lastInteraction.action === 'snooze' ? 'Pausado' : 'Visto'}
        </span>
      </Badge>
    </div>
  );
};