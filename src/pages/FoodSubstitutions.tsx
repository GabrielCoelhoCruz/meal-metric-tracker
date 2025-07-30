import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FoodSubstitutions = () => {
  const navigate = useNavigate();

  const substitutions = [
    {
      category: "Carboidratos - Pães e Tapioca",
      items: [
        { 
          from: "2 pães francês (100g)", 
          to: "6 fatias de pão de forma (100g)", 
          calories: "~270 kcal" 
        },
        { 
          from: "2 pães francês (100g)", 
          to: "80g de tapioca", 
          calories: "~270 kcal" 
        },
        { 
          from: "6 fatias de pão de forma (100g)", 
          to: "80g de tapioca", 
          calories: "~270 kcal" 
        },
      ]
    },
    {
      category: "Frutas - Porções Equivalentes",
      items: [
        { 
          from: "100g de banana (1 unidade média)", 
          to: "150g de maçã (1 unidade grande)", 
          calories: "~60 kcal" 
        },
        { 
          from: "100g de banana (1 unidade média)", 
          to: "250g de morango (12-15 unidades)", 
          calories: "~60 kcal" 
        },
        { 
          from: "100g de banana (1 unidade média)", 
          to: "250g de melão (2 fatias)", 
          calories: "~60 kcal" 
        },
        { 
          from: "150g de maçã (1 unidade grande)", 
          to: "250g de morango (12-15 unidades)", 
          calories: "~60 kcal" 
        },
        { 
          from: "150g de mamão (1 fatia grande)", 
          to: "120g de maçã (1 unidade média)", 
          calories: "~50 kcal" 
        },
        { 
          from: "150g de mamão (1 fatia grande)", 
          to: "200g de morango (10-12 unidades)", 
          calories: "~50 kcal" 
        },
      ]
    },
    {
      category: "Carboidratos - Cereais e Tubérculos",
      items: [
        { 
          from: "150g de arroz cozido (3 colheres de servir)", 
          to: "250g de batata cozida (2 unidades médias)", 
          calories: "~150 kcal" 
        },
        { 
          from: "150g de arroz cozido (3 colheres de servir)", 
          to: "300g de abóbora cozida (1 xícara)", 
          calories: "~150 kcal" 
        },
        { 
          from: "250g de batata cozida (2 unidades médias)", 
          to: "300g de abóbora cozida (1 xícara)", 
          calories: "~150 kcal" 
        },
      ]
    },
    {
      category: "Proteínas - Carnes",
      items: [
        { 
          from: "150g de filé de frango (1 peito pequeno)", 
          to: "130g de patinho (1 bife médio)", 
          calories: "~200 kcal" 
        },
        { 
          from: "150g de filé de frango (1 peito pequeno)", 
          to: "120g de músculo (1 porção)", 
          calories: "~200 kcal" 
        },
        { 
          from: "130g de patinho (1 bife médio)", 
          to: "120g de músculo (1 porção)", 
          calories: "~200 kcal" 
        },
        { 
          from: "4 ovos inteiros (240g)", 
          to: "150g de patinho (1 bife médio)", 
          calories: "~200 kcal" 
        },
        { 
          from: "4 ovos inteiros (240g)", 
          to: "40g de whey + 20g de pasta de amendoim", 
          calories: "~200 kcal" 
        },
      ]
    },
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

        <div className="text-center mt-8 p-4 bg-muted rounded-lg mx-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            💡 <strong>Dica:</strong> Faça substituições gradualmente para se adaptar aos novos sabores e texturas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodSubstitutions;