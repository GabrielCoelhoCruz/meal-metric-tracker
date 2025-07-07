import React from 'react';
import { User, Bell, Palette, Database, Info, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Settings() {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: 'Personalização',
      items: [
        {
          icon: Palette,
          label: 'Tema e Aparência',
          description: 'Modo escuro e cores',
          component: <ThemeToggle />,
          onClick: null
        }
      ]
    },
    {
      title: 'Notificações',
      items: [
        {
          icon: Bell,
          label: 'Lembrete de Refeições',
          description: 'Receber notificações',
          component: <Switch defaultChecked />,
          onClick: null
        }
      ]
    },
    {
      title: 'Dados',
      items: [
        {
          icon: Database,
          label: 'Gerenciar Refeições',
          description: 'Editar plano alimentar',
          component: <ChevronRight className="w-4 h-4 text-muted-foreground" />,
          onClick: () => navigate('/meal-management')
        },
        {
          icon: User,
          label: 'Perfil',
          description: 'Metas e preferências',
          component: <ChevronRight className="w-4 h-4 text-muted-foreground" />,
          onClick: () => navigate('/profile')
        }
      ]
    },
    {
      title: 'Sobre',
      items: [
        {
          icon: Info,
          label: 'Versão do App',
          description: 'v1.0.0 - Meal Tracker',
          component: null,
          onClick: null
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-h3">Configurações</h1>
          <p className="text-body-small">Personalize sua experiência</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h3 className="text-h4 px-2">{group.title}</h3>
            <div className="space-y-2">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={itemIndex} 
                    className={cn(
                      "p-4 transition-all duration-200",
                      item.onClick && "cursor-pointer hover:bg-muted/50 active:scale-[0.99]"
                    )}
                    onClick={item.onClick || undefined}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-body-small">{item.description}</div>
                        </div>
                      </div>
                      {item.component}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-h4 px-2">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/meal-management')}
              className="h-20 flex-col gap-2"
            >
              <Database className="w-5 h-5" />
              <span className="text-sm">Refeições</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/history')}
              className="h-20 flex-col gap-2"
            >
              <Info className="w-5 h-5" />
              <span className="text-sm">Histórico</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}