import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, RefreshCw, BarChart3 } from "lucide-react";

interface OnboardingProps {
  open: boolean;
  onClose: () => void;
}

export function Onboarding({ open, onClose }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Marque suas refeições",
      desc: "Deslize para a direita para concluir ou toque em Concluir na refeição.",
      Icon: Check,
    },
    {
      title: "Substitua alimentos facilmente",
      desc: "Use Substituições para trocar por equivalentes sem perder a meta.",
      Icon: RefreshCw,
    },
    {
      title: "Acompanhe seu progresso",
      desc: "Veja calorias, macros e tendências em Analytics.",
      Icon: BarChart3,
    },
  ];

  const total = steps.length;
  const { title, desc, Icon } = steps[step];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
          setStep(0);
        }
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-h3">Bem-vindo(a)!</DialogTitle>
          <DialogDescription>
            Um rápido tour para você começar.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-center">
          <div aria-hidden className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Icon className="w-7 h-7" />
            </div>
          </div>
          <h2 className="text-h4 mb-1">{title}</h2>
          <p className="text-body-small">{desc}</p>

          <div className="mt-6 flex items-center justify-center gap-2" aria-label={`Etapa ${step + 1} de ${total}`}>
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              setStep(0);
            }}
            aria-label="Pular onboarding"
          >
            Pular
          </Button>

          {step < total - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(total - 1, s + 1))} className="interactive" aria-label="Próximo passo">
              Próximo
            </Button>
          ) : (
            <Button
              onClick={() => {
                onClose();
                setStep(0);
              }}
              className="interactive"
              aria-label="Concluir tour"
            >
              Entendi
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
