import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

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
    <main className="min-h-screen flex items-center justify-center bg-background">
      <article className="text-center px-6 max-w-md">
        <div aria-hidden="true" className="mb-6 flex justify-center">
          <SearchX className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-4xl font-bold mb-3 text-foreground"
        >
          Página não encontrada
        </h1>
        <p className="text-base text-muted-foreground mb-6">
          Não encontramos a página “{location.pathname}”. Verifique o endereço
          ou volte para o início.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild aria-label="Voltar para a tela inicial" className="hover-scale">
            <Link to="/">Voltar ao Início</Link>
          </Button>
          <Button
            variant="secondary"
            asChild
            aria-label="Ir para Histórico"
            className="hover-scale"
          >
            <Link to="/history">Ver Histórico</Link>
          </Button>
        </div>
      </article>
    </main>
  );
};

export default NotFound;
