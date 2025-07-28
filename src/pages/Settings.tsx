import React, { useState } from 'react';
import { User, Bell, Palette, Database, Info, ChevronRight, LogOut, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationSettings } from '@/components/NotificationSettings';
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
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 font-medium py-2 px-4 rounded-full border border-gray-300 bg-white shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          {/* Title Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
            <p className="text-gray-500 mt-2">Personalize sua experiência</p>
          </section>

          <div className="space-y-6">
            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
                <div className="space-y-2">
                  {group.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={itemIndex} 
                        className={cn(
                          "bg-white p-4 rounded-2xl shadow-sm transition-all duration-200",
                          item.onClick && "cursor-pointer hover:shadow-md active:scale-[0.99]"
                        )}
                        onClick={item.onClick || undefined}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{item.label}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
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
              <h3 className="text-lg font-semibold text-gray-800">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/meal-management')}
                  className="bg-white p-4 rounded-2xl shadow-sm h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                >
                  <Database className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Refeições</span>
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="bg-white p-4 rounded-2xl shadow-sm h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                >
                  <Info className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Histórico</span>
                </button>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="space-y-3 mb-24">
              <h3 className="text-lg font-semibold text-gray-800">Conta</h3>
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Usuário Logado</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={signOut}
                className="w-full bg-white p-4 rounded-2xl shadow-sm h-12 flex items-center justify-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            </div>

            {/* Notification Settings Modal */}
            {showNotificationSettings && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
                <div className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-lg overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Configurações de Notificação</h2>
                    <button
                      onClick={() => setShowNotificationSettings(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                  <div className="p-4">
                    <NotificationSettings />
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