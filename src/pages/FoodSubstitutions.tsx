import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FoodSubstitutions = () => {
  const navigate = useNavigate();

  const substitutions = [
    {
      category: "Carboidratos",
      items: [
        { from: "Arroz branco (1 xícara)", to: "Quinoa (1 xícara)", calories: "~220 kcal" },
        { from: "Pão branco (2 fatias)", to: "Pão integral (2 fatias)", calories: "~160 kcal" },
        { from: "Macarrão comum (100g)", to: "Macarrão integral (100g)", calories: "~350 kcal" },
        { from: "Batata frita (100g)", to: "Batata doce assada (100g)", calories: "~86 kcal" },
      ]
    },
    {
      category: "Proteínas",
      items: [
        { from: "Carne vermelha (100g)", to: "Peito de frango (100g)", calories: "~165 kcal" },
        { from: "Bacon (30g)", to: "Peito de peru (30g)", calories: "~35 kcal" },
        { from: "Ovo frito (1 unidade)", to: "Clara de ovo (2 unidades)", calories: "~34 kcal" },
        { from: "Queijo amarelo (30g)", to: "Ricota (30g)", calories: "~41 kcal" },
      ]
    },
    {
      category: "Gorduras Saudáveis",
      items: [
        { from: "Manteiga (1 colher)", to: "Abacate (2 colheres)", calories: "~50 kcal" },
        { from: "Maionese (1 colher)", to: "Azeite extra virgem (1 colher)", calories: "~40 kcal" },
        { from: "Creme de leite (2 colheres)", to: "Iogurte grego (2 colheres)", calories: "~30 kcal" },
      ]
    },
    {
      category: "Doces e Lanches",
      items: [
        { from: "Chocolate ao leite (30g)", to: "Chocolate 70% cacau (20g)", calories: "~110 kcal" },
        { from: "Biscoito recheado (3 unidades)", to: "Castanhas (10 unidades)", calories: "~60 kcal" },
        { from: "Refrigerante (350ml)", to: "Água com limão", calories: "~5 kcal" },
        { from: "Sorvete (1 bola)", to: "Frozen yogurt (1 bola)", calories: "~80 kcal" },
      ]
    },
    {
      category: "Bebidas",
      items: [
        { from: "Suco de caixinha (200ml)", to: "Fruta inteira", calories: "~60 kcal" },
        { from: "Café com açúcar", to: "Café com adoçante natural", calories: "~5 kcal" },
        { from: "Energético (350ml)", to: "Chá verde (350ml)", calories: "~5 kcal" },
      ]
    }
  ];

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full mr-3"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Substituições Inteligentes</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Veja opções mais saudáveis para seus alimentos favoritos
          </p>
        </div>

        {substitutions.map((category, index) => (
          <Card key={index} className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary">{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground flex-1">{item.from}</span>
                      <ArrowRight className="w-4 h-4 mx-2 text-primary" />
                      <span className="text-sm font-medium flex-1">{item.to}</span>
                    </div>
                    <p className="text-xs text-primary mt-1">{item.calories}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="text-center mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Faça substituições gradualmente para se adaptar aos novos sabores e texturas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodSubstitutions;