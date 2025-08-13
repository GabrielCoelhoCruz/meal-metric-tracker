import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, AlertCircle, CheckCircle, UserPlus, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error' | null>(null);
  const { toast } = useToast();

  // Test Supabase connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Connection test:', { data, error });
      
      if (error) {
        console.error('Connection error:', error);
        setConnectionStatus('error');
      } else {
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Connection catch error:', error);
      setConnectionStatus('error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('SignIn response:', { data, error });

      if (error) {
        console.error('SignIn error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Bem-vindo!",
          description: "Login realizado com sucesso",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Auth catch error:', error);
      toast({
        title: "Erro",
        description: `Erro inesperado: ${error instanceof Error ? error.message : 'Tente novamente.'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <p className="text-muted-foreground">
              Entre na sua conta para acessar seus planos
            </p>
          </CardHeader>
          <CardContent>
            {/* Connection Status */}
            {connectionStatus && (
              <div className="mb-4">
                {connectionStatus === 'testing' && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>Testando conexão com Supabase...</AlertDescription>
                  </Alert>
                )}
                {connectionStatus === 'connected' && (
                  <Alert className="border-success/20 bg-success/10 dark:bg-success/20">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success-foreground">
                      Conexão com Supabase estabelecida!
                    </AlertDescription>
                  </Alert>
                )}
                {connectionStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro de conexão. 
                      <Button 
                        variant="link" 
                         className="h-auto p-0 ml-1 text-destructive underline"
                         onClick={testConnection}
                      >
                        Tentar novamente
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions for manual user creation */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Precisa de uma conta?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Os usuários são criados manualmente pelo administrador do sistema.
              </p>
              
              <div className="space-y-2">
                <p className="font-medium text-foreground">Para criar um usuário:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Acesse o painel do Supabase</li>
                  <li>Vá em Authentication → Users</li>
                  <li>Clique em "Add user"</li>
                  <li>Preencha email e senha</li>
                  <li>Marque "Auto Confirm User"</li>
                </ol>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => window.open('https://supabase.com/dashboard/project/hdbyrjeyralxfxqrsrws/auth/users', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Painel do Supabase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;