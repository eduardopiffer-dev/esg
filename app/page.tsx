"use client";

import { useMemo, useState } from "react";
import {
  ClipboardList,
  BarChart3,
  ShieldCheck,
  FileText,
  Sparkles,
} from "lucide-react";
import { AXIS_META, ESG_QUESTIONS, type AxisKey, type StageCode } from "./data/esgQuestions";

type TabValue = "formulario" | "dashboard" | "diagnostico" | "relatorio";

const tabs = [
  { value: "formulario", label: "Formulário", icon: ClipboardList },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "diagnostico", label: "Diagnóstico", icon: ShieldCheck },
  { value: "relatorio", label: "Relatório", icon: FileText },
] as const;

type AnswerMap = Record<string, StageCode | null>;

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

export default function Page() {
  const [tab, setTab] = useState<TabValue>("formulario");
  const [empresa, setEmpresa] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>(buildInitialAnswers());

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

  const groupedQuestions = useMemo(() => {
    return {
      ambiental: ESG_QUESTIONS.filter((q) => q.axis === "ambiental"),
      governanca: ESG_QUESTIONS.filter((q) => q.axis === "governanca"),
      social: ESG_QUESTIONS.filter((q) => q.axis === "social"),
    };
  }, []);

  const handleAnswer = (questionId: string, code: StageCode) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  };

  const exportJson = () => {
    const payload = {
      empresa,
      responsavel,
      email,
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

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-8">
      <section className="rounded-[32px] bg-gradient-to-r from-slate-950 via-emerald-900 to-teal-700 p-8 text-white shadow-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium">
          <Sparkles className="h-4 w-4" />
          Sustence • Diagnóstico e Maturidade ESG
        </div>

        <h1 className="mt-4 text-3xl font-bold md:text-5xl">
          Diagnóstico ESG com níveis E1 a E5 detalhados
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/90 md:text-base">
          O formulário agora mostra a descrição completa de cada nível de maturidade
          para cada critério, como no diagnóstico original da Sustence.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Maturidade geral</div>
            <div className="mt-2 text-2xl font-bold">{maturityLabel(metrics.overall)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Score ESG</div>
            <div className="mt-2 text-2xl font-bold">{metrics.overallPercent}%</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Perguntas respondidas</div>
            <div className="mt-2 text-2xl font-bold">{metrics.answeredCount}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Total de critérios</div>
            <div className="mt-2 text-2xl font-bold">{ESG_QUESTIONS.length}</div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        {tabs.map(({ value, label, icon: Icon }) => (
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
            <h2 className="text-2xl font-semibold">Dados da empresa</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
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
            </div>
          </div>

          {(["ambiental", "governanca", "social"] as AxisKey[]).map((axis) => (
            <div key={axis} className="overflow-hidden rounded-[28px] bg-white shadow-xl">
              <div className={`bg-gradient-to-r ${AXIS_META[axis].color} px-6 py-5 text-white`}>
                <h3 className="text-2xl font-semibold">{AXIS_META[axis].title}</h3>
                <p className="mt-1 text-sm text-white/80">
                  Assinale apenas 1 alternativa por quesito.
                </p>
              </div>

              <div className={`bg-gradient-to-br ${AXIS_META[axis].soft} p-6`}>
                <div className="space-y-5">
                  {groupedQuestions[axis].map((question, index) => (
                    <div key={question.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-start gap-3">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">{question.title}</h4>
                          <p className="mt-1 text-sm text-slate-500">
                            Selecione a alternativa que melhor representa a maturidade atual da organização.
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
                                  onChange={() => handleAnswer(question.id, option.code)}
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
          ))}
        </section>
      )}

      {tab === "dashboard" && (
        <section className="mt-6 grid gap-6 md:grid-cols-3">
          {(["ambiental", "governanca", "social"] as AxisKey[]).map((axis) => (
            <div key={axis} className="rounded-[28px] bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold">{AXIS_META[axis].title}</h3>
              <div className="mt-3 text-4xl font-bold">{percent(metrics.axisAverages[axis])}%</div>
              <div className="mt-2 text-sm text-slate-600">
                {stageLabel(metrics.axisAverages[axis])}
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${percent(metrics.axisAverages[axis])}%` }}
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === "diagnostico" && (
        <section className="mt-6 space-y-6">
          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Diagnóstico consolidado</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Maturidade geral:</strong> {maturityLabel(metrics.overall)}
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Score ESG:</strong> {metrics.overallPercent}%
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Eixo mais forte:</strong> {metrics.strongest ? metrics.strongest[0] : "-"}
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Eixo prioritário:</strong> {metrics.weakest ? metrics.weakest[0] : "-"}
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === "relatorio" && (
        <section className="mt-6 rounded-[28px] bg-white p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold">Relatório Executivo</h2>
          <p className="mt-4 text-slate-700">
            A organização <strong>{empresa || "não informada"}</strong> apresenta maturidade ESG{" "}
            <strong>{maturityLabel(metrics.overall)}</strong>, com score consolidado de{" "}
            <strong>{metrics.overallPercent}%</strong>.
          </p>

          <div className="mt-6 space-y-4">
            {(["ambiental", "governanca", "social"] as AxisKey[]).map((axis) => (
              <div key={axis} className="rounded-2xl border border-slate-200 p-4">
                <div className="text-lg font-semibold">{AXIS_META[axis].title}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {stageLabel(metrics.axisAverages[axis])}
                </div>
                <div className="mt-2 text-slate-700">
                  Score: {percent(metrics.axisAverages[axis])}%
                </div>
              </div>
            ))}
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

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="text-lg font-semibold text-emerald-900">
              Quer melhorar sua maturidade ESG?
            </h3>
            <p className="mt-2 text-sm leading-6 text-emerald-900/85">
              A Sustence pode apoiar sua organização na evolução das práticas ambientais,
              sociais e de governança com plano de ação, implementação e acompanhamento.
            </p>
            <div className="mt-4">
              <a
                href="mailto:contato@sustence.com.br?subject=Quero melhorar minha maturidade ESG"
                className="inline-flex rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Falar com a Sustence
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
