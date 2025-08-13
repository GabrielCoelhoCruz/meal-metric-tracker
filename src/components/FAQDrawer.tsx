import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function FAQDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Floating Help Button */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            aria-label="Ajuda e FAQ"
            className="fixed bottom-24 right-4 rounded-full shadow-primary interactive touch-target"
            size="icon"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Ajuda Rápida</DrawerTitle>
              <DrawerDescription>Tire dúvidas comuns e acesse atalhos.</DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como marcar uma refeição como concluída?</AccordionTrigger>
                  <AccordionContent>
                    Você pode deslizar a refeição para a direita ou tocar em "Concluir" dentro do cartão.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Como substituir um alimento?</AccordionTrigger>
                  <AccordionContent>
                    Acesse <Link to="/food-substitutions" className="underline text-primary">Substituições</Link> e escolha um equivalente com calorias similares.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Posso usar o app offline?</AccordionTrigger>
                  <AccordionContent>
                    Sim! Planeje seu dia e o app continua funcionando offline. Os dados sincronizam ao reconectar.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Onde vejo meu progresso?</AccordionTrigger>
                  <AccordionContent>
                    Vá em <Link to="/analytics" className="underline text-primary">Analytics</Link> para estatísticas de calorias e tendências.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary" aria-label="Fechar ajuda">Fechar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
