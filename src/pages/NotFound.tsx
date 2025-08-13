import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchX, Home, History, Settings } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // SEO essentials
    document.title = "404 - Página não encontrada";
    const desc = "Página não encontrada. Use o botão para voltar ao início.";
    let metaDesc = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${location.pathname}`;

    // A11y: move focus to heading
    headingRef.current?.focus();
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="text-center p-8 max-w-md w-full">
        <div aria-hidden="true" className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <SearchX className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-bold mb-3 text-foreground"
        >
          Página não encontrada
        </h1>
        <p className="text-muted-foreground mb-8">
          Não encontramos a página <code className="px-1 py-0.5 bg-muted rounded text-sm font-mono">{location.pathname}</code>. 
          Escolha uma das opções abaixo para continuar navegando.
        </p>
        
        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Ir para Início
            </Link>
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" asChild>
              <Link to="/history">
                <History className="w-4 h-4 mr-2" />
                Histórico
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default NotFound;