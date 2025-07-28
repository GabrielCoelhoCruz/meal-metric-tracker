import React, { useState } from 'react';
import { User, Bell, Palette, Database, Info, ChevronRight, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationSettings } from '@/components/NotificationSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function Settings() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

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
          label: 'Configurar Notificações',
          description: 'Lembretes de refeições, hidratação e mais',
          component: <ChevronRight className="w-4 h-4 text-muted-foreground" />,
          onClick: () => setShowNotificationSettings(true)
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

        {/* User Info & Logout */}
        <div className="space-y-3">
          <h3 className="text-h4 px-2">Conta</h3>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="font-medium">Usuário Logado</div>
                  <div className="text-body-small">{user?.email}</div>
                </div>
              </div>
            </div>
          </Card>
          
          <Button
            variant="outline"
            onClick={signOut}
            className="w-full h-12 flex items-center justify-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </Button>
        </div>

        {/* Notification Settings Modal */}
        {showNotificationSettings && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-x-4 top-20 bottom-20 bg-background rounded-lg border shadow-lg overflow-y-auto">
              <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
                <h2 className="text-h3">Configurações de Notificação</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotificationSettings(false)}
                >
                  Fechar
                </Button>
              </div>
              <div className="p-4">
                <NotificationSettings />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}