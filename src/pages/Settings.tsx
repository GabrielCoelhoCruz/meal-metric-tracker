import React, { useState } from 'react';
import { User, Bell, Palette, Database, Info, ChevronRight, LogOut, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EnhancedNotificationSettings } from '@/components/EnhancedNotificationSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { BottomNavigation } from '@/components/BottomNavigation';

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
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground font-medium py-2 px-4 rounded-full border border-border bg-card shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          {/* Title Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground mt-2">Personalize sua experiência</p>
          </section>

          <div className="space-y-6">
            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
                <div className="space-y-2">
                  {group.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={itemIndex} 
                        className={cn(
                          "bg-card p-4 rounded-2xl shadow-sm transition-all duration-200",
                          item.onClick && "cursor-pointer hover:shadow-md active:scale-[0.99]"
                        )}
                        onClick={item.onClick || undefined}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{item.label}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                          </div>
                          {item.component}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/meal-management')}
                  className="bg-card p-4 rounded-2xl shadow-sm h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                >
                  <Database className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">Refeições</span>
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="bg-card p-4 rounded-2xl shadow-sm h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                >
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">Histórico</span>
                </button>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="space-y-3 pb-32">
              <h3 className="text-lg font-semibold text-foreground">Conta</h3>
              <div className="bg-card p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Usuário Logado</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={signOut}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </Button>
            </div>

            {/* Notification Settings Modal */}
            {showNotificationSettings && (
              <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="fixed inset-x-4 top-20 bottom-20 bg-card rounded-lg shadow-lg overflow-y-auto">
                  <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Configurações de Notificação</h2>
                    <button
                      onClick={() => setShowNotificationSettings(false)}
                      className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted-hover transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                  <div className="p-4">
                    <EnhancedNotificationSettings />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <BottomNavigation />
    </div>
  );
}