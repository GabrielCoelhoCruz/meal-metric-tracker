import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LoadingButton } from '@/components/LoadingButton';
import { Loader2, Mail, Lock, AlertCircle, CheckCircle, UserPlus, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await handleSignUp();
      } else {
        await handleLogin();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    console.log('Attempting login with:', { email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('SignIn response:', { data, error });

    if (error) {
      console.error('SignIn error:', error);
      
      // Handle specific error cases
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login';
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso",
        variant: "default"
      });
    }
  };

  const handleSignUp = async () => {
    console.log('Attempting signup with:', { email });
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    console.log('SignUp response:', { data, error });

    if (error) {
      console.error('SignUp error:', error);
      
      // Handle specific error cases
      let errorMessage = error.message;
      if (error.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      } else if (error.message.includes('Unable to validate email address')) {
        errorMessage = 'Email inválido';
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta",
        variant: "default"
      });
      
      // Clear form and switch to login
      setPassword('');
      setConfirmPassword('');
      setIsSignUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isSignUp ? 'Criar Conta' : 'Login'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isSignUp 
                ? 'Crie sua conta para começar a rastrear suas refeições'
                : 'Entre na sua conta para acessar seus planos'
              }
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

            <form onSubmit={handleAuth} className="space-y-4">
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

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-destructive">As senhas não coincidem</p>
                  )}
                </div>
              )}

              <LoadingButton 
                type="submit" 
                className="w-full" 
                loading={isLoading}
                loadingText={isSignUp ? "Criando conta..." : "Entrando..."}
              >
                {isSignUp ? 'Criar Conta' : 'Entrar'}
              </LoadingButton>
            </form>

            {/* Toggle between login and signup */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp 
                  ? 'Já tem uma conta? Fazer login'
                  : 'Não tem conta? Criar nova conta'
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration Help */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Configuração de Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Para que o cadastro por email funcione, é necessário configurar a URL de redirecionamento no Supabase.
              </p>
              
              <div className="space-y-2">
                <p className="font-medium text-foreground">Passos para configurar:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Acesse o painel do Supabase</li>
                  <li>Vá em Authentication → URL Configuration</li>
                  <li>Configure Site URL: <code className="bg-muted px-1 rounded text-xs">{window.location.origin}</code></li>
                  <li>Adicione Redirect URL: <code className="bg-muted px-1 rounded text-xs">{window.location.origin}/**</code></li>
                  <li>Salve as configurações</li>
                </ol>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-amber-800 dark:text-amber-200 text-xs">
                  <strong>Dica:</strong> Para testes, você pode desabilitar "Confirm email" em Authentication → Settings para acelerar o processo de login.
                </p>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => window.open('https://supabase.com/dashboard/project/hdbyrjeyralxfxqrsrws/auth/providers', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Configurar no Supabase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;