"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Leaf,
  Landmark,
  Building2,
  Mail,
  Sparkles,
} from "lucide-react";
import {
  AXIS_META,
  ESG_QUESTIONS,
  type AxisKey,
  type StageCode,
} from "./data/esgQuestions";

type StepKey = "dados" | "ambiental" | "governanca" | "social" | "resultado";

type AnswerMap = Record<string, StageCode | null>;

const STEP_ORDER: StepKey[] = [
  "dados",
  "ambiental",
  "governanca",
  "social",
  "resultado",
];

const STEP_LABELS: Record<StepKey, string> = {
  dados: "Dados iniciais",
  ambiental: "Ambiental",
  governanca: "Governança",
  social: "Social",
  resultado: "Resultado",
};

function buildInitialAnswers(): AnswerMap {
  const initial: AnswerMap = {};
  for (const question of ESG_QUESTIONS) {
    initial[question.id] = null;
  }
  return initial;
}

function getStageNumber(code: StageCode | null): number | null {
  if (!code) return null;
  if (code === "E1") return 1;
  if (code === "E2") return 2;
  if (code === "E3") return 3;
  if (code === "E4") return 4;
  if (code === "E5") return 5;
  return null;
}

function avg(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
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
  if (value < 1.5) return "Inicial";
  if (value < 2.5) return "Em desenvolvimento";
  if (value < 3.5) return "Estruturado";
  if (value < 4.5) return "Avançado";
  return "Excelência";
}

function percent(value: number | null): number {
  if (value === null) return 0;
  return Math.round((value / 5) * 100);
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

export default function Page() {
  const [step, setStep] = useState<StepKey>("dados");

  const [empresa, setEmpresa] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [segmento, setSegmento] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>(buildInitialAnswers());

  const groupedQuestions = useMemo(() => {
    return {
      ambiental: ESG_QUESTIONS.filter((q) => q.axis === "ambiental"),
      governanca: ESG_QUESTIONS.filter((q) => q.axis === "governanca"),
      social: ESG_QUESTIONS.filter((q) => q.axis === "social"),
    };
  }, []);

  const metrics = useMemo(() => {
    const byAxis = {
      ambiental: [] as number[],
      governanca: [] as number[],
      social: [] as number[],
    };

    for (const question of ESG_QUESTIONS) {
      const numeric = getStageNumber(answers[question.id]);
      if (numeric !== null) {
        byAxis[question.axis].push(numeric);
      }
    }

    const axisAverages: Record<AxisKey, number | null> = {
      ambiental: avg(byAxis.ambiental),
      governanca: avg(byAxis.governanca),
      social: avg(byAxis.social),
    };

    const overallValues = Object.values(axisAverages).filter(
      (value): value is number => value !== null
    );
    const overall = avg(overallValues);

    const answeredCount = Object.values(answers).filter(Boolean).length;

    const ranked = (Object.entries(axisAverages) as [AxisKey, number | null][])
      .filter((entry): entry is [AxisKey, number] => entry[1] !== null)
      .sort((a, b) => b[1] - a[1]);

    const strongest = ranked.length ? ranked[0] : null;
    const weakest = ranked.length ? ranked[ranked.length - 1] : null;

    return {
      axisAverages,
      overall,
      overallPercent: percent(overall),
      answeredCount,
      strongest,
      weakest,
    };
  }, [answers]);

  const currentIndex = STEP_ORDER.indexOf(step);
  const progress = Math.round(((currentIndex + 1) / STEP_ORDER.length) * 100);

  const setAnswer = (questionId: string, code: StageCode) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  };

  const nextStep = () => {
    if (currentIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      setStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  const exportJson = () => {
    const payload = {
      empresa,
      responsavel,
      email,
      segmento,
      respostas: answers,
      mediasPorEixo: metrics.axisAverages,
      mediaGeral: metrics.overall,
      scorePercentual: metrics.overallPercent,
      maturidade: maturityLabel(metrics.overall),
      dataGeracao: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagnostico-esg-sustence.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderAxisStep = (axis: AxisKey) => {
    const questions = groupedQuestions[axis];
    const meta = AXIS_META[axis];

    return (
      <section className="space-y-6">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-xl">
          <div className={`bg-gradient-to-r ${meta.color} px-6 py-5 text-white`}>
            <h2 className="text-2xl font-semibold">{meta.title}</h2>
            <p className="mt-1 text-sm text-white/85">
              Assinale apenas 1 alternativa por quesito, em ordem crescente de
              maturidade ESG. :contentReference[oaicite:1]{index=1}
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
                      <h3 className="text-lg font-semibold text-slate-900">
                        {question.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Escolha o nível que melhor representa a organização.
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
                                setAnswer(question.id, option.code)
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
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-8">
      <section className="rounded-[32px] bg-gradient-to-r from-slate-950 via-emerald-900 to-teal-700 p-8 text-white shadow-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium">
          <Sparkles className="h-4 w-4" />
          Sustence • Diagnóstico e Maturidade ESG
        </div>

        <h1 className="mt-4 text-3xl font-bold md:text-5xl">
          Diagnóstico ESG online
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/90 md:text-base">
          Responda ao diagnóstico da Sustence e receba uma leitura inicial do
          estágio de maturidade ESG da sua organização.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Etapa atual</div>
            <div className="mt-2 text-xl font-bold">{STEP_LABELS[step]}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Progresso</div>
            <div className="mt-2 text-xl font-bold">{progress}%</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Respondidas</div>
            <div className="mt-2 text-xl font-bold">{metrics.answeredCount}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Total</div>
            <div className="mt-2 text-xl font-bold">{ESG_QUESTIONS.length}</div>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {STEP_ORDER.map((item) => {
          const active = item === step;
          return (
            <button
              key={item}
              onClick={() => setStep(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              {STEP_LABELS[item]}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {step === "dados" && (
          <section className="rounded-[28px] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-emerald-700" />
              <h2 className="text-2xl font-semibold">Dados iniciais</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              As alternativas estão organizadas da mais básica à mais completa,
              exatamente na lógica do diagnóstico original. :contentReference[oaicite:2]{index=2}
            </div>
          </section>
        )}

        {step === "ambiental" && renderAxisStep("ambiental")}
        {step === "governanca" && renderAxisStep("governanca")}
        {step === "social" && renderAxisStep("social")}

        {step === "resultado" && (
          <section className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                <h2 className="text-2xl font-semibold">Resultado do diagnóstico</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">Maturidade geral</div>
                  <div className="mt-2 text-2xl font-bold">
                    {maturityLabel(metrics.overall)}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">Score ESG</div>
                  <div className="mt-2 text-2xl font-bold">
                    {metrics.overallPercent}%
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">Eixo mais forte</div>
                  <div className="mt-2 text-lg font-bold">
                    {metrics.strongest ? AXIS_META[metrics.strongest[0]].title : "-"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">Eixo prioritário</div>
                  <div className="mt-2 text-lg font-bold">
                    {metrics.weakest ? AXIS_META[metrics.weakest[0]].title : "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {(["ambiental", "governanca", "social"] as AxisKey[]).map((axis) => {
                const icon =
                  axis === "ambiental"
                    ? Leaf
                    : axis === "governanca"
                    ? Landmark
                    : Building2;

                const Icon = icon;

                return (
                  <div key={axis} className="rounded-[28px] bg-white p-6 shadow-xl">
                    <div className="mb-4 flex items-center gap-3">
                      <Icon className="h-5 w-5 text-emerald-700" />
                      <div>
                        <h3 className="font-semibold">{AXIS_META[axis].title}</h3>
                        <p className="text-sm text-slate-500">
                          {stageLabel(metrics.axisAverages[axis])}
                        </p>
                      </div>
                    </div>

                    <div className="text-4xl font-bold">
                      {percent(metrics.axisAverages[axis])}%
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {axisNarrative(AXIS_META[axis].title, metrics.axisAverages[axis])}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-emerald-900">
                Quer melhorar sua maturidade ESG?
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-emerald-900/85">
                A Sustence pode apoiar sua organização na evolução das práticas
                ambientais, sociais e de governança, com plano de ação,
                implementação e acompanhamento estratégico.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:contato@sustence.com.br?subject=Quero melhorar minha maturidade ESG&body=Olá, finalizei o diagnóstico ESG da Sustence. Empresa: ${empresa || "-"} | Responsável: ${responsavel || "-"} | Score ESG: ${metrics.overallPercent}%`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
                >
                  <Mail className="h-4 w-4" />
                  Falar com a Sustence
                </a>

                <button
                  onClick={exportJson}
                  className="rounded-2xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-800"
                >
                  Exportar JSON
                </button>

                <button
                  onClick={() => window.print()}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
                >
                  Imprimir / salvar em PDF
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          onClick={prevStep}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </button>

        <button
          onClick={nextStep}
          disabled={currentIndex === STEP_ORDER.length - 1}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
