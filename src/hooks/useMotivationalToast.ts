import { useToast } from '@/hooks/use-toast';
import { Trophy, Star, Zap, Target, Heart } from 'lucide-react';

const motivationalMessages = [
  {
    title: "Parabéns! 🎉",
    description: "Mais uma refeição concluída com sucesso!",
    icon: Trophy
  },
  {
    title: "Excelente! ⭐",
    description: "Você está no caminho certo para seus objetivos!",
    icon: Star
  },
  {
    title: "Incrível! ⚡",
    description: "Sua consistência é admirável!",
    icon: Zap
  },
  {
    title: "Foco total! 🎯",
    description: "Cada refeição te aproxima da sua meta!",
    icon: Target
  },
  {
    title: "Que dedicação! ❤️",
    description: "Cuidar da sua saúde é um ato de amor próprio!",
    icon: Heart
  }
];

const mealCompletionMessages = [
  {
    title: "Refeição 100% completa! 🏆",
    description: "Todos os alimentos foram consumidos. Excelente trabalho!",
    icon: Trophy
  },
  {
    title: "Meta atingida! 🎯",
    description: "Você concluiu toda a refeição planejada!",
    icon: Target
  },
  {
    title: "Perfeito! ⭐",
    description: "Refeição completa significa nutrição completa!",
    icon: Star
  }
];

const streakMessages = [
  {
    title: "Sequência mantida! 🔥",
    description: "Você está construindo um hábito saudável!",
    icon: Zap
  },
  {
    title: "Consistência premiada! 🏅",
    description: "Cada dia conta para seu sucesso!",
    icon: Trophy
  }
];

export function useMotivationalToast() {
  const { toast } = useToast();

  const showFoodCompletionToast = () => {
    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    toast({
      title: message.title,
      description: message.description,
      duration: 3000,
    });
  };

  const showMealCompletionToast = () => {
    const message = mealCompletionMessages[Math.floor(Math.random() * mealCompletionMessages.length)];
    
    toast({
      title: message.title,
      description: message.description,
      duration: 4000,
    });
  };

  const showStreakToast = (days: number) => {
    const message = streakMessages[Math.floor(Math.random() * streakMessages.length)];
    
    toast({
      title: message.title,
      description: `${message.description} ${days} dias seguidos!`,
      duration: 4000,
    });
  };

  const showDailyGoalToast = () => {
    toast({
      title: "Meta diária alcançada! 🎉",
      description: "Todas as refeições do dia foram concluídas!",
      duration: 5000,
    });
  };

  const showCalorieGoalToast = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) {
      toast({
        title: "Perfeito! 🎯",
        description: "Você atingiu sua meta calórica ideal!",
        duration: 4000,
      });
    } else if (percentage > 110) {
      toast({
        title: "Atenção! ⚠️",
        description: "Você ultrapassou um pouco sua meta calórica.",
        duration: 4000,
      });
    }
  };

  const showProgressToast = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    
    if (percentage === 50) {
      toast({
        title: "Meio caminho! 🌟",
        description: "Você já completou metade das suas refeições!",
        duration: 3000,
      });
    } else if (percentage === 75) {
      toast({
        title: "Quase lá! 🚀",
        description: "Só mais uma refeição para completar o dia!",
        duration: 3000,
      });
    }
  };

  const showWeeklyStreakToast = (days: number) => {
    if (days === 7) {
      toast({
        title: "Uma semana perfeita! 🏆",
        description: "7 dias consecutivos de dedicação!",
        duration: 5000,
      });
    } else if (days === 14) {
      toast({
        title: "Duas semanas incríveis! 💪",
        description: "Sua consistência é inspiradora!",
        duration: 5000,
      });
    } else if (days === 30) {
      toast({
        title: "Um mês de sucesso! 🔥",
        description: "Você é incrível! Continue assim!",
        duration: 6000,
      });
    }
  };

  return {
    showFoodCompletionToast,
    showMealCompletionToast,
    showStreakToast,
    showDailyGoalToast,
    showCalorieGoalToast,
    showProgressToast,
    showWeeklyStreakToast
  };
}