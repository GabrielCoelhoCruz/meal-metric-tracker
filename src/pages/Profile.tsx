import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Plus, History, Settings2 } from "lucide-react";

// Simple helpers
const parseCsvList = (v: string) =>
  v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const joinCsvList = (arr?: string[]) => (arr && arr.length ? arr.join(", ") : "");

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  // Profile
  const [displayName, setDisplayName] = useState("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");

  // Preferences
  const [preferredCalories, setPreferredCalories] = useState<string>("");
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergiesText, setAllergiesText] = useState("");
  const [dislikesText, setDislikesText] = useState("");

  // Body metrics
  type Metric = {
    id: string;
    date: string;
    weight_kg: number | null;
    body_fat_percent: number | null;
    waist_cm: number | null;
    chest_cm: number | null;
    hip_cm: number | null;
    notes: string | null;
  };
  const [metrics, setMetrics] = useState<Metric[]>([]);

  // New metric inputs
  const [metricDate, setMetricDate] = useState<string>("" /* default to today later */);
  const [metricWeight, setMetricWeight] = useState<string>("");
  const [metricBodyFat, setMetricBodyFat] = useState<string>("");
  const [metricWaist, setMetricWaist] = useState<string>("");
  const [metricChest, setMetricChest] = useState<string>("");
  const [metricHip, setMetricHip] = useState<string>("");
  const [metricNotes, setMetricNotes] = useState<string>("");

  useEffect(() => {
    // SEO basics
    document.title = "Perfil do Usuário | 🏆 Dieta";
    const desc =
      "Perfil: peso, medidas, preferências alimentares e histórico de progresso.";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);
    const linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      l.setAttribute("href", `${window.location.origin}/profile`);
      document.head.appendChild(l);
    } else {
      linkCanonical.setAttribute("href", `${window.location.origin}/profile`);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        setLoading(true);

        // Load profile
        const { data: profile, error: pErr } = await supabase
          .from("profiles")
          .select("id, display_name, height_cm, gender, birthdate")
          .eq("id", user.id)
          .maybeSingle();
        if (pErr) throw pErr;
        if (profile) {
          setDisplayName(profile.display_name ?? "");
          setHeightCm(profile.height_cm ? String(profile.height_cm) : "");
          setGender(profile.gender ?? "");
          setBirthdate(profile.birthdate ?? "");
        }

        // Load preferences
        const { data: prefs, error: prErr } = await supabase
          .from("user_preferences")
          .select("user_id, preferred_calorie_target, dietary_preferences, allergies, dislikes")
          .eq("user_id", user.id)
          .maybeSingle();
        if (prErr) throw prErr;
        if (prefs) {
          setPreferredCalories(
            prefs.preferred_calorie_target ? String(prefs.preferred_calorie_target) : ""
          );
          setDietaryPreferences(prefs.dietary_preferences ?? []);
          setAllergiesText(joinCsvList(prefs.allergies));
          setDislikesText(joinCsvList(prefs.dislikes));
        }

        // Load last 30 metrics
        const { data: m, error: mErr } = await supabase
          .from("body_metrics")
          .select(
            "id, date, weight_kg, body_fat_percent, waist_cm, chest_cm, hip_cm, notes"
          )
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(30);
        if (mErr) throw mErr;
        setMetrics(m ?? []);

        // Defaults
        const today = new Date().toISOString().slice(0, 10);
        setMetricDate(today);
      } catch (e: any) {
        console.error(e);
        toast({
          title: "Erro ao carregar",
          description: e?.message ?? "Não foi possível carregar dados do perfil.",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, toast]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const payload = {
        id: user.id,
        display_name: displayName || null,
        height_cm: heightCm ? Number(heightCm) : null,
        gender: gender || null,
        birthdate: birthdate || null,
      };
      const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
      if (error) throw error;
      toast({ title: "Perfil salvo", description: "Dados atualizados com sucesso." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erro ao salvar perfil", description: e?.message });
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    try {
      const payload = {
        user_id: user.id,
        preferred_calorie_target: preferredCalories ? Number(preferredCalories) : null,
        dietary_preferences: dietaryPreferences,
        allergies: parseCsvList(allergiesText),
        dislikes: parseCsvList(dislikesText),
      };
      const { error } = await supabase
        .from("user_preferences")
        .upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
      toast({ title: "Preferências salvas", description: "Ajustes atualizados." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erro ao salvar preferências", description: e?.message });
    }
  };

  const handleAddMetric = async () => {
    if (!user) return;
    try {
      const payload = {
        user_id: user.id,
        date: metricDate || new Date().toISOString().slice(0, 10),
        weight_kg: metricWeight ? Number(metricWeight) : null,
        body_fat_percent: metricBodyFat ? Number(metricBodyFat) : null,
        waist_cm: metricWaist ? Number(metricWaist) : null,
        chest_cm: metricChest ? Number(metricChest) : null,
        hip_cm: metricHip ? Number(metricHip) : null,
        notes: metricNotes || null,
      };
      const { error } = await supabase.from("body_metrics").upsert(payload, {
        onConflict: "user_id,date",
      });
      if (error) throw error;
      toast({ title: "Métrica registrada", description: "Dados corporais salvos." });
      // refresh list
      const { data } = await supabase
        .from("body_metrics")
        .select(
          "id, date, weight_kg, body_fat_percent, waist_cm, chest_cm, hip_cm, notes"
        )
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(30);
      setMetrics(data ?? []);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erro ao registrar métrica", description: e?.message });
    }
  };

  const dietaryOptions = useMemo(
    () => [
      "Vegetariano",
      "Vegano",
      "Low-carb",
      "Low-fat",
      "Sem glúten",
      "Sem lactose",
    ],
    []
  );

  if (!user) return null;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-sm p-4">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 text-muted-foreground font-medium py-2 px-4 rounded-full border border-border bg-card shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </header>

        <main>
          <section className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Perfil do Usuário</h1>
            <p className="text-muted-foreground mt-2">
              Personalize seus dados e ajustes finos de dieta
            </p>
          </section>

          {/* Profile card */}
          <section className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Dados pessoais</h2>
            </div>
            <Card className="bg-card p-4 rounded-2xl space-y-3">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Nome</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Como deseja ser chamado(a)"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Altura (cm)</label>
                  <Input
                    inputMode="decimal"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="ex: 175"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Gênero</label>
                  <Input
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Data de nascimento</label>
                <Input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>
              <div className="pt-2">
                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="w-4 h-4 mr-2" /> Salvar Perfil
                </Button>
              </div>
            </Card>
          </section>

          {/* Preferences */}
          <section className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Preferências alimentares</h2>
            </div>
            <Card className="bg-card p-4 rounded-2xl space-y-3">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Meta calórica (kcal)</label>
                <Input
                  inputMode="numeric"
                  value={preferredCalories}
                  onChange={(e) => setPreferredCalories(e.target.value)}
                  placeholder="ex: 2200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Estilos/Restrições</label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((opt) => {
                    const active = dietaryPreferences.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setDietaryPreferences((prev) =>
                            prev.includes(opt)
                              ? prev.filter((o) => o !== opt)
                              : [...prev, opt]
                          )
                        }
                        className={
                          "px-3 py-1 rounded-full text-sm border transition-colors " +
                          (active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-foreground border-border")
                        }
                        aria-pressed={active}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Alergias (separadas por vírgula)</label>
                <Textarea
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="Ex: amendoim, camarão"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Alimentos que não gosta (vírgula)</label>
                <Textarea
                  value={dislikesText}
                  onChange={(e) => setDislikesText(e.target.value)}
                  placeholder="Ex: coentro, fígado"
                />
              </div>

              <div className="pt-2">
                <Button onClick={handleSavePreferences} className="w-full" variant="secondary">
                  <Save className="w-4 h-4 mr-2" /> Salvar Preferências
                </Button>
              </div>
            </Card>
          </section>

          {/* Body metrics */}
          <section className="space-y-3 mb-24">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Histórico corporal</h2>
            </div>
            <Card className="bg-card p-4 rounded-2xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Data</label>
                  <Input type="date" value={metricDate} onChange={(e) => setMetricDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Peso (kg)</label>
                  <Input inputMode="decimal" value={metricWeight} onChange={(e) => setMetricWeight(e.target.value)} placeholder="ex: 78.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Gordura (%)</label>
                  <Input inputMode="decimal" value={metricBodyFat} onChange={(e) => setMetricBodyFat(e.target.value)} placeholder="opcional" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Cintura (cm)</label>
                  <Input inputMode="decimal" value={metricWaist} onChange={(e) => setMetricWaist(e.target.value)} placeholder="opcional" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Peito (cm)</label>
                  <Input inputMode="decimal" value={metricChest} onChange={(e) => setMetricChest(e.target.value)} placeholder="opcional" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Quadril (cm)</label>
                  <Input inputMode="decimal" value={metricHip} onChange={(e) => setMetricHip(e.target.value)} placeholder="opcional" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Notas</label>
                <Textarea value={metricNotes} onChange={(e) => setMetricNotes(e.target.value)} placeholder="Como foi a semana?" />
              </div>
              <div className="pt-1">
                <Button onClick={handleAddMetric} className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Registrar métricas
                </Button>
              </div>

              {/* List */}
              <div className="mt-2 border-t border-border pt-3">
                <h3 className="text-sm font-medium mb-2 text-foreground">Últimos registros</h3>
                {metrics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum registro ainda.</p>
                ) : (
                  <ul className="space-y-2">
                    {metrics.map((m) => (
                      <li key={m.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{new Date(m.date).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.body_fat_percent ? `${m.body_fat_percent}% gordura · ` : ""}
                            {m.waist_cm ? `Cintura ${m.waist_cm}cm` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{m.weight_kg ?? "-"} kg</p>
                          {m.notes && <p className="text-xs text-muted-foreground max-w-[140px] truncate">{m.notes}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </section>

          {/* Bottom spacing for mobile nav */}
          <div className="h-20" />
        </main>
      </div>
    </div>
  );
}