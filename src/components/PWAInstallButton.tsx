import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/usePWA";
import { useToast } from "@/hooks/use-toast";

export const PWAInstallButton = () => {
  const { isInstallable, installPWA } = usePWA();
  const { toast } = useToast();

  const handleInstall = async () => {
    const success = await installPWA();
    
    if (success) {
      toast({
        title: "App Instalado!",
        description: "O Meal Tracker foi instalado no seu dispositivo.",
      });
    } else {
      toast({
        title: "Instalação Cancelada",
        description: "A instalação do app foi cancelada.",
        variant: "destructive",
      });
    }
  };

  if (!isInstallable) return null;

  return (
    <Button 
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Instalar App
    </Button>
  );
};