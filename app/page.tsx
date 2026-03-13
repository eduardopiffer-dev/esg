"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardList,
  BarChart3,
  ShieldCheck,
  FileText,
  Sparkles,
  Leaf,
  Landmark,
  Building2,
  Mail,
  Phone,
  Globe,
  Save,
  ArrowRight,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  AXIS_META,
  ESG_QUESTIONS,
  type AxisKey,
  type StageCode,
} from "./data/esgQuestions";

type TabValue = "formulario" | "dashboard" | "diagnostico" | "relatorio";
type AnswerMap = Record<string, StageCode | null>;

const SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzZCf299hp8-DsCUOJcZRUoGr5tYswPTs6M99LQuCtJbT39p3DwPraVS3l8cXUqV7s/exec";

const TABS: Array<{
  value: TabValue;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: "formulario", label: "Formulário", icon: ClipboardList },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "diagnostico", label: "Diagnóstico", icon: ShieldCheck },
  { value: "relatorio", label: "Relatório", icon: FileText },
];

const ESG_LEVEL_REFERENCE = [
  {
    code: "E1",
    title: "Elementar",
    description:
      "Estágio inicial, com práticas pontuais, baixa formalização e atuação predominantemente reativa.",
    cardClass: "border-red-200 bg-red-50 text-red-950",
    badgeClass: "bg-red-600 text-white",
  },
  {
    code: "E2",
    title: "Não Integrado",
    description:
      "Há iniciativas e controles básicos, mas ainda de forma dispersa, sem integração consistente à gestão do negócio.",
    cardClass: "border-orange-200 bg-orange-50 text-orange-950",
    badgeClass: "bg-orange-600 text-white",
  },
  {
    code: "E3",
    title: "Gerencial",
    description:
      "A organização já possui práticas estruturadas, indicadores e controles que demonstram gestão mais consistente dos temas ESG.",
    cardClass: "border-amber-200 bg-amber-50 text-amber-950",
    badgeClass: "bg-amber-600 text-white",
  },
  {
    code: "E4",
    title: "Estratégico",
    description:
      "O ESG está integrado à estratégia, com metas, monitoramento, comunicação e maior envolvimento da liderança e das partes interessadas.",
    cardClass: "border-emerald-200 bg-emerald-50 text-emerald-950",
    badgeClass: "bg-emerald-700 text-white",
  },
  {
    code: "E5",
    title: "Transformador",
    description:
      "A organização atua com protagonismo, inovação e influência positiva em sua cadeia de valor e setor, com ESG consolidado de forma avançada.",
    cardClass: "border-teal-200 bg-teal-50 text-teal-950",
    badgeClass: "bg-teal-700 text-white",
  },
] as const;

function buildInitialAnswers(): AnswerMap {
  const initial: AnswerMap = {};
  for (const question of ESG_QUESTIONS) {
    initial[question.id] = null;
  }
  return initial;
}

function stageToNumber(code: StageCode | null): number | null {
  if (code === "E1") return 1;
  if (code === "E2") return 2;
  if (code === "E3") return 3;
  if (code === "E4") return 4;
  if (code === "E5") return 5;
  return null;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function percent(value: number | null): number {
  if (value === null) return 0;
  return Math.round((value / 5) * 100);
}

function stageLabel(value: number | null): string {
  if (value === null) return "Sem dados";
  if (value < 1.5) return "E1 — Elementar";
  if (value < 2.5) return "E2 — Não Integrado";
  if (value < 3.5) return "E3 — Gerencial";
  if (value < 4.5) return "E4 — Estratégico";
  return "E5 — Transformador";
}

function maturityLabel(value: number | null): string {
  if (value === null) return "Sem dados";
  if (value < 1.5) return "E1 — Elementar";
  if (value < 2.5) return "E2 — Não Integrado";
  if (value < 3.5) return "E3 — Gerencial";
  if (value < 4.5) return "E4 — Estratégico";
  return "E5 — Transformador";
}

function maturityCode(value: number | null): string {
  if (value === null) return "—";
  if (value < 1.5) return "E1";
  if (value < 2.5) return "E2";
  if (value < 3.5) return "E3";
  if (value < 4.5) return "E4";
  return "E5";
}

function axisNarrative(axisTitle: string, value: number | null): string {
  if (value === null) {
    return `O eixo ${axisTitle.toLowerCase()} ainda não possui respostas suficientes para análise.`;
  }
  if (value < 1.5) {
    return `O eixo ${axisTitle.toLowerCase()} apresenta práticas iniciais, com necessidade de estruturação prioritária.`;
  }
  if (value < 2.5) {
    return `O eixo ${axisTitle.toLowerCase()} demonstra iniciativas relevantes, mas ainda pouco integradas à gestão.`;
  }
  if (value < 3.5) {
    return `O eixo ${axisTitle.toLowerCase()} já apresenta elementos gerenciais consistentes e evidências de controle.`;
  }
  if (value < 4.5) {
    return `O eixo ${axisTitle.toLowerCase()} revela abordagem estratégica com integração ao negócio.`;
  }
  return `O eixo ${axisTitle.toLowerCase()} demonstra alto nível de maturidade e práticas transformadoras.`;
}

function getStrongestAxis(
  axisAverages: Record<AxisKey, number | null>
): AxisKey | null {
  let bestAxis: AxisKey | null = null;
  let bestValue = -1;

  (Object.keys(axisAverages) as AxisKey[]).forEach((axis) => {
    const value = axisAverages[axis];
    if (value !== null && value > bestValue) {
      bestValue = value;
      bestAxis = axis;
    }
  });

  return bestAxis;
}

function getWeakestAxis(
  axisAverages: Record<AxisKey, number | null>
): AxisKey | null {
  let worstAxis: AxisKey | null = null;
  let worstValue = Number.POSITIVE_INFINITY;

  (Object.keys(axisAverages) as AxisKey[]).forEach((axis) => {
    const value = axisAverages[axis];
    if (value !== null && value < worstValue) {
      worstValue = value;
      worstAxis = axis;
    }
  });

  return worstAxis;
}

function getRecommendations(
  axisAverages: Record<AxisKey, number | null>
): string[] {
  const recs: string[] = [];

  if ((axisAverages.ambiental ?? 0) < 3) {
    recs.push(
      "Estruturar plano de ação ambiental com metas, indicadores e responsáveis, priorizando gestão de resíduos, água, emissões e eficiência operacional."
    );
  }

  if ((axisAverages.social ?? 0) < 3) {
    recs.push(
      "Formalizar políticas e práticas sociais, com foco em diversidade, saúde e segurança, relacionamento com partes interessadas e direitos humanos."
    );
  }

  if ((axisAverages.governanca ?? 0) < 3) {
    recs.push(
      "Fortalecer a governança por meio de controles internos, compliance, gestão de riscos, prestação de contas e integração estratégica do ESG."
    );
  }

  if (recs.length === 0) {
    recs.push(
      "Consolidar as boas práticas existentes com metas mais ambiciosas, evidências rastreáveis e comunicação estruturada dos resultados ESG."
    );
  }

  return recs;
}

export default function Page() {
  const [tab, setTab] = useState<TabValue>("formulario");

  const [empresa, setEmpresa] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [segmento, setSegmento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [answers, setAnswers] = useState<AnswerMap>(buildInitialAnswers());
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const autoSavedRef = useRef(false);
  const [savedOnce, setSavedOnce] = useState(false);

  const groupedQuestions = useMemo(() => {
    return {
      ambiental: ESG_QUESTIONS.filter((q) => q.axis === "ambiental"),
      governanca: ESG_QUESTIONS.filter((q) => q.axis === "governanca"),
      social: ESG_QUESTIONS.filter((q) => q.axis === "social"),
    };
  }, []);

  const metrics = useMemo(() => {
    const ambientalValues: number[] = [];
    const governancaValues: number[] = [];
    const socialValues: number[] = [];

    for (const question of ESG_QUESTIONS) {
      const numeric = stageToNumber(answers[question.id]);
      if (numeric === null) continue;

      if (question.axis === "ambiental") ambientalValues.push(numeric);
      if (question.axis === "governanca") governancaValues.push(numeric);
      if (question.axis === "social") socialValues.push(numeric);
    }

    const axisAverages: Record<AxisKey, number | null> = {
      ambiental: average(ambientalValues),
      governanca: average(governancaValues),
      social: average(socialValues),
    };

    const overallValues = [
      axisAverages.ambiental,
      axisAverages.governanca,
      axisAverages.social,
    ].filter((value): value is number => value !== null);

    const overall = average(overallValues);
    const answeredCount = Object.values(answers).filter(
      (value) => value !== null
    ).length;

    const strongestAxis = getStrongestAxis(axisAverages);
    const weakestAxis = getWeakestAxis(axisAverages);
    const recommendations = getRecommendations(axisAverages);

    return {
      axisAverages,
      overall,
      overallPercent: percent(overall),
      answeredCount,
      strongestAxis,
      weakestAxis,
      recommendations,
    };
  }, [answers]);

  const radarData = useMemo(
    () => [
      { eixo: "Ambiental", score: percent(metrics.axisAverages.ambiental) },
      { eixo: "Governança", score: percent(metrics.axisAverages.governanca) },
      { eixo: "Social", score: percent(metrics.axisAverages.social) },
    ],
    [metrics.axisAverages]
  );

  async function saveToGoogleSheets(isAutomatic = false) {
    if (!empresa || !responsavel || !email) {
      if (!isAutomatic) {
        setSaveMessage(
          "Preencha pelo menos empresa, responsável e e-mail antes de salvar."
        );
      }
      return;
    }

    if (savedOnce) {
      setSaveMessage("Diagnóstico já salvo na planilha.");
      return;
    }

    try {
      setSaving(true);
      setSaveMessage("");

      const payload = {
        data: new Date().toLocaleString("pt-BR"),
        empresa,
        responsavel,
        email,
        segmento,
        score: metrics.overallPercent,
        nivel: maturityLabel(metrics.overall),
        nivelCodigo: maturityCode(metrics.overall),
        ambiental: percent(metrics.axisAverages.ambiental),
        governanca: percent(metrics.axisAverages.governanca),
        social: percent(metrics.axisAverages.social),
        pontoForte: metrics.strongestAxis
          ? AXIS_META[metrics.strongestAxis].title
          : "",
        pontoCritico: metrics.weakestAxis
          ? AXIS_META[metrics.weakestAxis].title
          : "",
        recomendacoes: metrics.recommendations.join(" | "),
        observacoes,
      };

      await fetch(SHEETS_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSavedOnce(true);
      autoSavedRef.current = true;

      setSaveMessage(
        isAutomatic
          ? "Diagnóstico salvo automaticamente na planilha."
          : "Diagnóstico enviado para a planilha com sucesso."
      );
    } catch {
      setSaveMessage("Não foi possível salvar agora. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (tab !== "relatorio") return;
    if (autoSavedRef.current) return;
    if (savedOnce) return;

    const hasAnyAnswer = Object.values(answers).some((value) => value !== null);

    if (hasAnyAnswer && empresa && responsavel && email) {
      saveToGoogleSheets(true);
    }
  }, [tab, answers, empresa, responsavel, email, savedOnce]);

  function handleAnswer(questionId: string, code: StageCode) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  }

  function exportJson() {
    const payload = {
      empresa,
      responsavel,
      email,
      segmento,
      observacoes,
      respostas: answers,
      mediasPorEixo: metrics.axisAverages,
      mediaGeral: metrics.overall,
      scorePercentual: metrics.overallPercent,
      maturidade: maturityLabel(metrics.overall),
      nivelAtual: maturityCode(metrics.overall),
      pontosFortes: metrics.strongestAxis
        ? [AXIS_META[metrics.strongestAxis].title]
        : [],
      pontosCriticos: metrics.weakestAxis
        ? [AXIS_META[metrics.weakestAxis].title]
        : [],
      recomendacoes: metrics.recommendations,
      dataGeracao: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "diagnostico-esg-sustence.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function renderAxisSection(axis: AxisKey) {
    const questions = groupedQuestions[axis];
    const meta = AXIS_META[axis];

    return (
      <div
        key={axis}
        className="overflow-hidden rounded-[28px] bg-white shadow-xl"
      >
        <div className={`bg-gradient-to-r ${meta.color} px-6 py-5 text-white`}>
          <h3 className="text-2xl font-semibold">{meta.title}</h3>
          <p className="mt-1 text-sm text-white/85">
            Assinale apenas 1 alternativa por quesito, em ordem crescente de
            maturidade ESG.
          </p>
        </div>

        <div className={`bg-gradient-to-br ${meta.soft} p-6`}>
          <div className="space-y-5">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start gap-3">
                  <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {question.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Selecione a alternativa que melhor representa a organização.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {question.options.map((option) => {
                    const selected = answers[question.id] === option.code;

                    return (
                      <label
                        key={option.code}
                        className={`block cursor-pointer rounded-2xl border p-4 transition ${
                          selected
                            ? "border-emerald-600 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name={question.id}
                            value={option.code}
                            checked={selected}
                            onChange={() =>
                              handleAnswer(question.id, option.code)
                            }
                            className="mt-1 h-4 w-4"
                          />

                          <div>
                            <div className="font-semibold text-slate-900">
                              {option.code}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-slate-700">
                              {option.label}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setTab("relatorio")}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Ir para o relatório
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-8">
      <section className="rounded-[32px] bg-gradient-to-r from-slate-950 via-emerald-900 to-teal-700 p-8 text-white shadow-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium">
          <Sparkles className="h-4 w-4" />
          Sustence • Diagnóstico e Maturidade ESG
        </div>

        <h1 className="mt-4 text-3xl font-bold md:text-5xl">
          Diagnóstico ESG — Sustence
        </h1>

        <div className="mt-4 max-w-4xl space-y-4 text-sm leading-7 text-emerald-50/90 md:text-base">
          <p>
            Apresentamos aqui um diagnóstico completo e totalmente gratuito, para
            avaliação de sua organização dentro dos pilares Ambiental, Social e
            de Governança ( ESG ). Essa avaliação é formatada dentro dos
            critérios estabelecidos pela Associação Brasileira de Normas
            Técnicas (ABNT) na PE 487 (práticas específicas para o ESG).
          </p>

          <p>
            O diagnóstico deve ser respondido assinalando apenas 1 das
            alternativas de cada quesito, que esta em ordem crescente quanto ao
            grau de maturidade ESG apresentado pela sua organização (o primeiro
            quesito é sempre o mais básico e o último o mais completo).
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Maturidade geral</div>
            <div className="mt-2 text-2xl font-bold">
              {maturityLabel(metrics.overall)}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Score ESG</div>
            <div className="mt-2 text-2xl font-bold">
              {metrics.overallPercent}%
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Respondidas</div>
            <div className="mt-2 text-2xl font-bold">
              {metrics.answeredCount}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">
              Total de critérios
            </div>
            <div className="mt-2 text-2xl font-bold">
              {ESG_QUESTIONS.length}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        {TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
              tab === value
                ? "border-slate-900 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "formulario" && (
        <section className="mt-6 space-y-6">
          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Dados da avaliação</h2>
            <p className="mt-2 text-sm text-slate-500">
              Preencha os dados da organização e, em seguida, responda aos
              critérios ESG.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <input
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Responsável pelo preenchimento"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Nome da organização"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={segmento}
                onChange={(e) => setSegmento(e.target.value)}
                placeholder="Segmento"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
                placeholder="Observações"
                className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2 xl:col-span-4"
              />
            </div>
          </div>

          {renderAxisSection("ambiental")}
          {renderAxisSection("governanca")}
          {renderAxisSection("social")}
        </section>
      )}

      {tab === "dashboard" && (
        <section className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {(["ambiental", "governanca", "social"] as AxisKey[]).map(
              (axis) => {
                const Icon =
                  axis === "ambiental"
                    ? Leaf
                    : axis === "governanca"
                    ? Landmark
                    : Building2;

                return (
                  <div
                    key={axis}
                    className="rounded-[28px] bg-white p-6 shadow-xl"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <Icon className="h-5 w-5 text-emerald-700" />
                      <div>
                        <h3 className="font-semibold">
                          {AXIS_META[axis].title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {stageLabel(metrics.axisAverages[axis])}
                        </p>
                      </div>
                    </div>

                    <div className="text-4xl font-bold">
                      {percent(metrics.axisAverages[axis])}%
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{
                          width: `${percent(metrics.axisAverages[axis])}%`,
                        }}
                      />
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {axisNarrative(
                        AXIS_META[axis].title,
                        metrics.axisAverages[axis]
                      )}
                    </p>
                  </div>
                );
              }
            )}
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-emerald-700" />
              <h2 className="text-2xl font-semibold">Gráfico Radar ESG</h2>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="eixo" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#047857"
                    fill="#10b981"
                    fillOpacity={0.45}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {tab === "diagnostico" && (
        <section className="mt-6 space-y-6">
          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Diagnóstico consolidado</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Maturidade geral:</strong>{" "}
                {maturityLabel(metrics.overall)}
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Score ESG:</strong> {metrics.overallPercent}%
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Eixo mais forte:</strong>{" "}
                {metrics.strongestAxis
                  ? AXIS_META[metrics.strongestAxis].title
                  : "-"}
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Eixo prioritário:</strong>{" "}
                {metrics.weakestAxis
                  ? AXIS_META[metrics.weakestAxis].title
                  : "-"}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(["ambiental", "governanca", "social"] as AxisKey[]).map(
              (axis) => (
                <div
                  key={axis}
                  className="rounded-[28px] bg-white p-6 shadow-xl"
                >
                  <h3 className="text-lg font-semibold">
                    {AXIS_META[axis].title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {stageLabel(metrics.axisAverages[axis])}
                  </p>
                  <div className="mt-4 text-4xl font-bold">
                    {percent(metrics.axisAverages[axis])}%
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {axisNarrative(
                      AXIS_META[axis].title,
                      metrics.axisAverages[axis]
                    )}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {tab === "relatorio" && (
        <section className="mt-6 rounded-[28px] bg-white p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold">Relatório Executivo</h2>

          <div className="mt-6 space-y-8">
            <section>
              <h3 className="text-xl font-semibold">Score ESG</h3>
              <p className="mt-2 text-slate-700">
                A organização <strong>{empresa || "não informada"}</strong>{" "}
                apresenta maturidade ESG{" "}
                <strong>{maturityLabel(metrics.overall)}</strong>, com score
                consolidado de <strong>{metrics.overallPercent}%</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold">
                Níveis de maturidade ESG
              </h3>
              <p className="mt-2 text-slate-700">
                Abaixo estão apresentados todos os níveis de maturidade ESG, com
                a identificação do estágio atual da organização.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {ESG_LEVEL_REFERENCE.map((level) => {
                  const isCurrent = maturityCode(metrics.overall) === level.code;

                  return (
                    <div
                      key={level.code}
                      className={`rounded-2xl border p-4 ${level.cardClass} ${
                        isCurrent ? "ring-2 ring-slate-900 shadow-md" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-lg font-semibold">
                          {level.code}
                        </div>
                        {isCurrent && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${level.badgeClass}`}
                          >
                            Nível atual
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-sm font-medium">
                        {level.title}
                      </div>

                      <p className="mt-3 text-sm leading-6 opacity-90">
                        {level.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm leading-6 text-emerald-900">
                  <strong>Enquadramento atual da empresa:</strong>{" "}
                  {maturityCode(metrics.overall)} —{" "}
                  {maturityLabel(metrics.overall)}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold">Análise por eixo</h3>
              <div className="mt-4 space-y-4">
                {(["ambiental", "governanca", "social"] as AxisKey[]).map(
                  (axis) => (
                    <div
                      key={axis}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="text-lg font-semibold">
                        {AXIS_META[axis].title}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {stageLabel(metrics.axisAverages[axis])}
                      </div>
                      <div className="mt-2 text-slate-700">
                        Score: {percent(metrics.axisAverages[axis])}%
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {axisNarrative(
                          AXIS_META[axis].title,
                          metrics.axisAverages[axis]
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold">Pontos fortes</h3>
              <div className="mt-3 rounded-2xl border border-slate-200 p-4">
                <p className="text-slate-700">
                  {metrics.strongestAxis
                    ? `O principal destaque atual está no eixo ${AXIS_META[metrics.strongestAxis].title}, que apresenta o melhor desempenho relativo entre os pilares avaliados.`
                    : "Ainda não há respostas suficientes para identificação de pontos fortes."}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold">Pontos críticos</h3>
              <div className="mt-3 rounded-2xl border border-slate-200 p-4">
                <p className="text-slate-700">
                  {metrics.weakestAxis
                    ? `O principal ponto crítico está no eixo ${AXIS_META[metrics.weakestAxis].title}, que demanda priorização no plano de ação para evolução da maturidade ESG.`
                    : "Ainda não há respostas suficientes para identificação de pontos críticos."}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold">Recomendações</h3>
              <div className="mt-3 rounded-2xl border border-slate-200 p-4">
                <ul className="space-y-3 text-slate-700">
                  {metrics.recommendations.map((item, index) => (
                    <li key={index} className="ml-5 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold">Contato Sustence</h3>
              <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <h4 className="text-lg font-semibold text-emerald-900">
                  Quer melhorar sua maturidade ESG?
                </h4>

                <p className="mt-2 text-sm leading-6 text-emerald-900/85">
                  A Sustence pode apoiar sua organização na evolução das práticas
                  ambientais, sociais e de governança com plano de ação,
                  implementação e acompanhamento.
                </p>

                <div className="mt-4 space-y-2 text-sm text-emerald-950">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    contato@sustence.com.br
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Sustence
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Atendimento consultivo ESG
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`mailto:contato@sustence.com.br?subject=Quero melhorar minha maturidade ESG&body=Olá, finalizei o diagnóstico ESG. Empresa: ${
                      empresa || "-"
                    } | Responsável: ${responsavel || "-"} | Score ESG: ${
                      metrics.overallPercent
                    }%`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
                  >
                    <Mail className="h-4 w-4" />
                    Falar com a Sustence
                  </a>

                  <button
                    onClick={() => saveToGoogleSheets(false)}
                    disabled={saving || savedOnce}
                    className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving
                      ? "Salvando..."
                      : savedOnce
                      ? "Já salvo"
                      : "Salvar diagnóstico"}
                  </button>
                </div>

                {saveMessage ? (
                  <p className="mt-4 text-sm text-emerald-900">
                    {saveMessage}
                  </p>
                ) : null}
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Imprimir / salvar em PDF
            </button>

            <button
              onClick={exportJson}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
            >
              Exportar JSON
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
