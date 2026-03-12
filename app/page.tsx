"use client";

import { useMemo, useState } from "react";
import {
  ClipboardList,
  BarChart3,
  ShieldCheck,
  FileText,
  Leaf,
  Building2,
  Landmark,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type TabValue = "formulario" | "dashboard" | "diagnostico" | "relatorio";

type AxisKey = "ambiental" | "social" | "governanca";

type Responses = Record<AxisKey, number>;

const tabs: ReadonlyArray<{
  value: TabValue;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}> = [
  { value: "formulario", label: "Formulário", icon: ClipboardList },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "diagnostico", label: "Diagnóstico", icon: ShieldCheck },
  { value: "relatorio", label: "Relatório", icon: FileText },
];

const axes: ReadonlyArray<{
  key: AxisKey;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  gradient: string;
  soft: string;
}> = [
  {
    key: "ambiental",
    label: "Ambiental",
    icon: Leaf,
    gradient: "from-emerald-700 via-emerald-600 to-teal-600",
    soft: "from-emerald-50 to-teal-50",
  },
  {
    key: "social",
    label: "Social",
    icon: Building2,
    gradient: "from-teal-700 via-teal-600 to-cyan-600",
    soft: "from-teal-50 to-cyan-50",
  },
  {
    key: "governanca",
    label: "Governança",
    icon: Landmark,
    gradient: "from-slate-800 via-slate-700 to-emerald-700",
    soft: "from-slate-50 to-emerald-50",
  },
];

function getLevelLabel(value: number): string {
  if (value < 1.5) return "E1 — Elementar";
  if (value < 2.5) return "E2 — Não Integrado";
  if (value < 3.5) return "E3 — Gerencial";
  if (value < 4.5) return "E4 — Estratégico";
  return "E5 — Transformador";
}

function getLevelCode(value: number): string {
  if (value < 1.5) return "E1";
  if (value < 2.5) return "E2";
  if (value < 3.5) return "E3";
  if (value < 4.5) return "E4";
  return "E5";
}

function getOverallStage(avg: number): string {
  if (avg < 1.5) return "Inicial";
  if (avg < 2.5) return "Em desenvolvimento";
  if (avg < 3.5) return "Estruturado";
  if (avg < 4.5) return "Avançado";
  return "Excelência";
}

function getDeclaration(avg: number): string {
  return avg >= 3 ? "Declaração de Conformidade" : "Declaração de Compromisso";
}

function getPriority(avg: number): string {
  if (avg < 2) return "Alta";
  if (avg < 3.5) return "Média";
  return "Baixa";
}

function scorePercent(value: number): number {
  return Math.round((value / 5) * 100);
}

function axisNarrative(axis: string, value: number): string {
  const level = getLevelCode(value);

  if (level === "E1") {
    return `O eixo ${axis} apresenta práticas ainda iniciais, com baixa formalização e necessidade de estruturação prioritária.`;
  }
  if (level === "E2") {
    return `O eixo ${axis} demonstra iniciativas relevantes, mas ainda dispersas e pouco integradas ao modelo de gestão.`;
  }
  if (level === "E3") {
    return `O eixo ${axis} já possui elementos gerenciais consistentes, com evidências de controle e organização.`;
  }
  if (level === "E4") {
    return `O eixo ${axis} revela abordagem estratégica, com maior integração à tomada de decisão e à governança do negócio.`;
  }
  return `O eixo ${axis} demonstra alto nível de maturidade, com práticas robustas, integradas e orientadas à transformação.`;
}

export default function Page() {
  const [tab, setTab] = useState<TabValue>("formulario");
  const [company, setCompany] = useState("Empresa Exemplo Ltda.");
  const [responsavel, setResponsavel] = useState("Eduardo Piffer");
  const [segmento, setSegmento] = useState("Indústria / Serviços / Comércio");
  const [email, setEmail] = useState("contato@empresa.com.br");
  const [observacoes, setObservacoes] = useState(
    "Avaliação preliminar para diagnóstico de maturidade ESG."
  );

  const [responses, setResponses] = useState<Responses>({
    ambiental: 2,
    social: 2,
    governanca: 2,
  });

  const metrics = useMemo(() => {
    const avg =
      (responses.ambiental + responses.social + responses.governanca) / 3;

    const strongestEntry = Object.entries(responses).sort(
      (a, b) => b[1] - a[1]
    )[0] as [AxisKey, number];

    const weakestEntry = Object.entries(responses).sort(
      (a, b) => a[1] - b[1]
    )[0] as [AxisKey, number];

    return {
      average: avg,
      averagePercent: scorePercent(avg),
      stage: getOverallStage(avg),
      declaration: getDeclaration(avg),
      priority: getPriority(avg),
      strongest: strongestEntry,
      weakest: weakestEntry,
    };
  }, [responses]);

  const handleChange = (field: AxisKey, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const exportJson = () => {
    const data = {
      empresa: company,
      responsavel,
      segmento,
      email,
      observacoes,
      respostas: responses,
      resultado: {
        media: Number(metrics.average.toFixed(2)),
        score_percentual: metrics.averagePercent,
        estagio: metrics.stage,
        declaracao: metrics.declaration,
        prioridade: metrics.priority,
      },
      data_geracao: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "diagnostico-esg-sustence.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_35%),linear-gradient(180deg,#f5faf8_0%,#f8fafc_40%,#ffffff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <section className="relative overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 p-6 text-white shadow-2xl shadow-emerald-950/10 md:p-8">
          <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute left-20 top-16 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-emerald-50 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Plataforma Sustence • Diagnóstico ESG
              </div>

              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                Diagnóstico ESG com identidade visual premium
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85 md:text-base">
                Sistema visual da Sustence para avaliação de maturidade ESG,
                consolidação executiva de resultados e emissão de relatório
                estruturado com leitura rápida para clientes.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setTab("formulario")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-50"
                >
                  Iniciar avaliação
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setTab("relatorio")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Ver relatório
                </button>
              </div>
            </div>

            <div className="grid min-w-[280px] gap-3 md:grid-cols-2 lg:w-[380px]">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <div className="text-xs text-emerald-100/80">Estágio geral</div>
                <div className="mt-2 text-3xl font-semibold">
                  {metrics.stage}
                </div>
                <div className="text-sm text-emerald-50/80">
                  Score {metrics.averagePercent}%
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <div className="text-xs text-emerald-100/80">
                  Declaração sugerida
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {metrics.declaration}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md md:col-span-2">
                <div className="text-xs text-emerald-100/80">
                  Organização avaliada
                </div>
                <div className="mt-2 text-lg font-semibold">{company}</div>
                <div className="text-sm text-emerald-50/80">{segmento}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-6 mb-6 grid gap-3 px-2 md:grid-cols-5 md:px-6">
          <div className="rounded-3xl border-0 bg-white/90 p-4 shadow-lg shadow-emerald-900/5 backdrop-blur-sm">
            <div className="text-xs text-slate-500">Prioridade</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {metrics.priority}
            </div>
            <div className="text-sm text-slate-600">Plano de ação</div>
          </div>

          <div className="rounded-3xl border-0 bg-white/90 p-4 shadow-lg shadow-emerald-900/5 backdrop-blur-sm">
            <div className="text-xs text-slate-500">Média ESG</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">
              {metrics.average.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600">Escala de 0 a 5</div>
          </div>

          {axes.map(({ key, label, icon: Icon, soft }) => (
            <div
              key={key}
              className="rounded-3xl border-0 bg-white/90 p-4 shadow-lg shadow-emerald-900/5 backdrop-blur-sm"
            >
              <div className="mb-3 flex items-center gap-2 text-slate-500">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${soft}`}
                >
                  <Icon className="h-4 w-4 text-emerald-700" />
                </div>
                <div className="text-xs">{label}</div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {responses[key].toFixed(1)}
              </div>
              <div className="text-sm text-slate-600">
                {getLevelCode(responses[key])}
              </div>
            </div>
          ))}
        </section>

        <nav className="mb-6 flex flex-wrap gap-3">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setTab(value)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                tab === value
                  ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {tab === "formulario" && (
          <section className="space-y-6">
            <div className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-950/5">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Dados da avaliação</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Informações básicas do cliente e da leitura ESG.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  Sustence • Maturidade ESG
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nome da organização"
                  className="rounded-2xl border border-emerald-100 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400"
                />
                <input
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  placeholder="Responsável"
                  className="rounded-2xl border border-emerald-100 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  className="rounded-2xl border border-emerald-100 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400"
                />
                <input
                  value={segmento}
                  onChange={(e) => setSegmento(e.target.value)}
                  placeholder="Segmento"
                  className="rounded-2xl border border-emerald-100 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400"
                />

                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={4}
                  placeholder="Observações gerais"
                  className="rounded-2xl border border-emerald-100 px-4 py-3 outline-none ring-0 transition focus:border-emerald-400 md:col-span-2 xl:col-span-4"
                />
              </div>
            </div>

            {axes.map(({ key, label, icon: Icon, gradient, soft }) => (
              <div
                key={key}
                className="overflow-hidden rounded-[28px] bg-white shadow-xl shadow-emerald-950/5"
              >
                <div className={`bg-gradient-to-r ${gradient} px-6 py-5 text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{label}</h3>
                      <p className="mt-1 text-sm text-white/80">
                        Defina a nota de maturidade para este eixo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`bg-gradient-to-br ${soft} p-6`}>
                  <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-slate-500">
                          Nota atual
                        </div>
                        <div className="text-3xl font-semibold text-slate-900">
                          {responses[key].toFixed(1)}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                        {getLevelLabel(responses[key])}
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={responses[key]}
                      onChange={(e) =>
                        handleChange(key, Number(e.target.value))
                      }
                      className="w-full accent-emerald-700"
                    />

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>0.0</span>
                      <span>1.0</span>
                      <span>2.0</span>
                      <span>3.0</span>
                      <span>4.0</span>
                      <span>5.0</span>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate-600">
                      {axisNarrative(label.toLowerCase(), responses[key])}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === "dashboard" && (
          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] bg-white p-6 shadow-xl shadow-emerald-950/5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                    <BarChart3 className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Comparativo por eixo</h3>
                    <p className="text-sm text-slate-600">
                      Visão consolidada das notas ESG.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {axes.map(({ key, label, gradient }) => (
                    <div key={key}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{label}</span>
                        <span className="text-slate-500">
                          {responses[key].toFixed(1)} / 5
                        </span>
                      </div>
                      <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                          style={{ width: `${scorePercent(responses[key])}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-xl shadow-emerald-950/5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100">
                    <Sparkles className="h-4 w-4 text-teal-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Indicadores executivos</h3>
                    <p className="text-sm text-slate-600">
                      Leitura rápida para apresentação ao cliente.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4">
                    <div className="text-xs text-slate-500">Score ESG</div>
                    <div className="mt-1 text-3xl font-semibold">
                      {metrics.averagePercent}%
                    </div>
                  </div>

                  <div className="rounded-3xl border border-teal-100 bg-teal-50/70 p-4">
                    <div className="text-xs text-slate-500">Estágio</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {metrics.stage}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Eixo mais forte</div>
                    <div className="mt-1 text-lg font-semibold capitalize">
                      {metrics.strongest[0]}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                    <div className="text-xs text-slate-500">Eixo prioritário</div>
                    <div className="mt-1 text-lg font-semibold capitalize">
                      {metrics.weakest[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {axes.map(({ key, label, icon: Icon, soft }) => (
                <div
                  key={key}
                  className="rounded-[28px] bg-white p-6 shadow-xl shadow-emerald-950/5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${soft}`}
                    >
                      <Icon className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{label}</h3>
                      <p className="text-sm text-slate-500">
                        {getLevelCode(responses[key])}
                      </p>
                    </div>
                  </div>

                  <div className="text-4xl font-semibold">
                    {scorePercent(responses[key])}%
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {axisNarrative(label.toLowerCase(), responses[key])}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "diagnostico" && (
          <section className="space-y-6">
            <div className="rounded-[28px] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-xl shadow-emerald-950/5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <h2 className="text-xl font-semibold">
                    {metrics.declaration}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Com base nos dados inseridos, a organização apresenta
                    estágio geral <strong>{metrics.stage}</strong>, com score
                    consolidado de <strong>{metrics.averagePercent}%</strong> e
                    média de <strong>{metrics.average.toFixed(2)}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {axes.map(({ key, label }) => (
                <div
                  key={key}
                  className="rounded-[28px] bg-white p-6 shadow-xl shadow-emerald-950/5"
                >
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {getLevelLabel(responses[key])}
                  </p>
                  <div className="mt-4 text-3xl font-semibold">
                    {responses[key].toFixed(1)}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {axisNarrative(label.toLowerCase(), responses[key])}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] bg-white p-6 shadow-xl shadow-emerald-950/5">
                <div className="mb-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">Ponto prioritário</h3>
                </div>
                <p className="text-sm leading-7 text-slate-700">
                  O eixo com maior necessidade de evolução imediata é{" "}
                  <strong className="capitalize">{metrics.weakest[0]}</strong>,
                  recomendando-se definição de responsáveis, indicadores,
                  cronograma e plano de ação específico.
                </p>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-xl shadow-emerald-950/5">
                <div className="mb-4 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold">Maior destaque</h3>
                </div>
                <p className="text-sm leading-7 text-slate-700">
                  O eixo com melhor desempenho atualmente é{" "}
                  <strong className="capitalize">{metrics.strongest[0]}</strong>,
                  podendo servir como base para comunicação institucional e
                  consolidação de boas práticas.
                </p>
              </div>
            </div>
          </section>
        )}

        {tab === "relatorio" && (
          <section className="space-y-6">
            <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-emerald-950/10">
              <div className="bg-gradient-to-r from-slate-950 via-emerald-900 to-teal-800 px-8 py-10 text-white md:px-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-4">
                    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-emerald-50">
                      Relatório Executivo • Sustence
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-emerald-100/80">
                        Avaliação e Diagnóstico de Maturidade ESG
                      </div>
                      <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                        {company}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-emerald-50/85">
                        Documento executivo com leitura consolidada dos eixos
                        Ambiental, Social e de Governança.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-emerald-50/90 backdrop-blur-sm">
                    <div>
                      <strong>Responsável:</strong> {responsavel}
                    </div>
                    <div>
                      <strong>E-mail:</strong> {email}
                    </div>
                    <div>
                      <strong>Segmento:</strong> {segmento}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
                    <div className="text-xs text-slate-500">Estágio geral</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {metrics.stage}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4">
                    <div className="text-xs text-slate-500">Score ESG</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {metrics.averagePercent}%
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                    <div className="text-xs text-slate-500">Declaração</div>
                    <div className="mt-1 text-lg font-semibold">
                      {metrics.declaration}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4">
                    <div className="text-xs text-slate-500">Prioridade</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {metrics.priority}
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-slate-200" />

                <section className="space-y-4">
                  <h3 className="text-xl font-semibold">1. Introdução</h3>
                  <p className="leading-7 text-slate-700">
                    Este relatório apresenta a consolidação da avaliação de
                    maturidade ESG da organização, com base nas notas atribuídas
                    aos eixos Ambiental, Social e de Governança. A leitura
                    executiva abaixo apoia a priorização de ações e o
                    direcionamento da estratégia de sustentabilidade.
                  </p>
                </section>

                <section className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold">2. Resultado consolidado</h3>
                  <p className="leading-7 text-slate-700">
                    A organização apresenta estágio geral{" "}
                    <strong>{metrics.stage}</strong>, com média ESG de{" "}
                    <strong>{metrics.average.toFixed(2)}</strong> e score
                    consolidado de <strong>{metrics.averagePercent}%</strong>.
                    O enquadramento sugerido é{" "}
                    <strong>{metrics.declaration}</strong>, com prioridade{" "}
                    <strong>{metrics.priority.toLowerCase()}</strong> para
                    evolução do plano de ação.
                  </p>
                </section>

                <section className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold">3. Análise por eixo</h3>

                  <div className="space-y-4">
                    {axes.map(({ key, label }) => (
                      <div key={key} className="rounded-2xl border p-5">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="text-lg font-semibold">{label}</div>
                            <div className="text-sm text-slate-500">
                              {getLevelLabel(responses[key])}
                            </div>
                          </div>
                          <div className="text-right text-sm text-slate-600">
                            <div>
                              <strong>Nota:</strong> {responses[key].toFixed(1)}
                            </div>
                            <div>
                              <strong>Score:</strong>{" "}
                              {scorePercent(responses[key])}%
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 leading-7 text-slate-700">
                          {axisNarrative(label.toLowerCase(), responses[key])}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-8 space-y-4">
                  <h3 className="text-xl font-semibold">4. Considerações finais</h3>
                  <p className="leading-7 text-slate-700">
                    Recomenda-se priorizar o eixo{" "}
                    <strong className="capitalize">{metrics.weakest[0]}</strong>,
                    sem perder a consolidação do eixo{" "}
                    <strong className="capitalize">{metrics.strongest[0]}</strong>.
                    O avanço da maturidade ESG dependerá da formalização de
                    políticas, indicadores, responsabilidades e integração das
                    práticas à gestão organizacional.
                  </p>

                  <p className="leading-7 text-slate-700">
                    <strong>Observações do avaliador:</strong> {observacoes}
                  </p>
                </section>

                <div className="mt-10 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Imprimir / salvar em PDF
                  </button>

                  <button
                    type="button"
                    onClick={exportJson}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Exportar JSON
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
