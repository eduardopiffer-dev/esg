"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  ClipboardList,
  Download,
  FileText,
  Leaf,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

type Stage = "E1" | "E2" | "E3" | "E4" | "E5" | "NA";
type AxisKey = "ambiental" | "social" | "governanca";

type Axis = {
  key: AxisKey;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  criteria: string[];
};

const STAGES: Stage[] = ["E1", "E2", "E3", "E4", "E5", "NA"];
const STAGE_LABELS: Record<Stage, string> = {
  E1: "Elementar",
  E2: "Não Integrado",
  E3: "Gerencial",
  E4: "Estratégico",
  E5: "Transformador",
  NA: "Não Aplicável",
};
const STAGE_VALUES: Record<Exclude<Stage, "NA">, number> = {
  E1: 1,
  E2: 2,
  E3: 3,
  E4: 4,
  E5: 5,
};
const STAGE_BADGES: Record<Stage, string> = {
  E1: "bg-rose-50 text-rose-700 border-rose-200",
  E2: "bg-amber-50 text-amber-700 border-amber-200",
  E3: "bg-emerald-50 text-emerald-700 border-emerald-200",
  E4: "bg-teal-50 text-teal-700 border-teal-200",
  E5: "bg-cyan-50 text-cyan-700 border-cyan-200",
  NA: "bg-slate-50 text-slate-600 border-slate-200",
};
const CHART_COLORS = ["#b45309", "#f59e0b", "#10b981", "#0f766e", "#164e63"];

const AXES: Axis[] = [
  {
    key: "ambiental",
    title: "Ambiental",
    icon: Leaf,
    criteria: [
      "Adaptação às mudanças climáticas",
      "Conservação e uso sustentável da biodiversidade",
      "Economia circular",
      "Eficiência energética",
      "Gerenciamento de áreas contaminadas",
      "Gestão ambiental",
      "Gestão de efluentes",
      "Gestão de resíduos",
      "Mitigação de emissão de GEE",
      "Prevenção de poluição sonora",
      "Produtos perigosos",
      "Qualidade do ar",
      "Uso da água",
      "Uso sustentável do solo",
    ],
  },
  {
    key: "social",
    title: "Social",
    icon: Users,
    criteria: [
      "Cultura e promoção de inclusão",
      "Desenvolvimento profissional",
      "Diálogo e engajamento social",
      "Impacto social",
      "Investimento social privado",
      "Liberdade de associação",
      "Política de remuneração e benefícios",
      "Políticas e práticas de diversidade e equidade",
      "Qualidade de vida",
      "Relacionamento com consumidores e clientes",
      "Relacionamento com fornecedores",
      "Respeito aos direitos humanos",
      "Saúde e segurança ocupacional",
      "Combate ao trabalho forçado e compulsório",
      "Combate ao trabalho infantil",
    ],
  },
  {
    key: "governanca",
    title: "Governança",
    icon: ShieldCheck,
    criteria: [
      "Ambiente legal e regulatório",
      "Auditorias interna e externa",
      "Compliance, integridade e anticorrupção",
      "Controles internos",
      "Engajamento com as partes interessadas",
      "Estrutura e composição da governança",
      "Gestão da segurança da informação",
      "Gestão de riscos do negócio",
      "Práticas de combate à concorrência desleal (antitruste)",
      "Privacidade de dados pessoais",
      "Propósito e estratégia em relação à sustentabilidade",
      "Relatórios ESG / sustentabilidade / relato integrado",
      "Responsabilização (prestação de contas)",
    ],
  },
];

const ALL_CRITERIA = AXES.flatMap((axis) => axis.criteria.map((criterion) => ({ axis: axis.key, criterion })));

function buildInitialResponses(): Record<string, Stage> {
  const base: Record<string, Stage> = {};
  for (const item of ALL_CRITERIA) base[item.criterion] = "NA";
  return base;
}

const SAMPLE_RESPONSES: Record<string, Stage> = {
  "Adaptação às mudanças climáticas": "E2",
  "Conservação e uso sustentável da biodiversidade": "E1",
  "Economia circular": "E2",
  "Eficiência energética": "E3",
  "Gerenciamento de áreas contaminadas": "E2",
  "Gestão ambiental": "E3",
  "Gestão de efluentes": "E2",
  "Gestão de resíduos": "E3",
  "Mitigação de emissão de GEE": "E2",
  "Prevenção de poluição sonora": "E3",
  "Produtos perigosos": "E2",
  "Qualidade do ar": "E2",
  "Uso da água": "E3",
  "Uso sustentável do solo": "E1",
  "Cultura e promoção de inclusão": "E2",
  "Desenvolvimento profissional": "E3",
  "Diálogo e engajamento social": "E2",
  "Impacto social": "E2",
  "Investimento social privado": "E1",
  "Liberdade de associação": "E3",
  "Política de remuneração e benefícios": "E2",
  "Políticas e práticas de diversidade e equidade": "E2",
  "Qualidade de vida": "E2",
  "Relacionamento com consumidores e clientes": "E3",
  "Relacionamento com fornecedores": "E3",
  "Respeito aos direitos humanos": "E2",
  "Saúde e segurança ocupacional": "E3",
  "Combate ao trabalho forçado e compulsório": "E3",
  "Combate ao trabalho infantil": "E3",
  "Ambiente legal e regulatório": "E3",
  "Auditorias interna e externa": "E2",
  "Compliance, integridade e anticorrupção": "E3",
  "Controles internos": "E3",
  "Engajamento com as partes interessadas": "E2",
  "Estrutura e composição da governança": "E2",
  "Gestão da segurança da informação": "E2",
  "Gestão de riscos do negócio": "E3",
  "Práticas de combate à concorrência desleal (antitruste)": "E1",
  "Privacidade de dados pessoais": "E2",
  "Propósito e estratégia em relação à sustentabilidade": "E3",
  "Relatórios ESG / sustentabilidade / relato integrado": "E1",
  "Responsabilização (prestação de contas)": "E2",
};

function getStageByAverage(avg: number): Stage {
  if (!avg) return "NA";
  if (avg < 1.5) return "E1";
  if (avg < 2.5) return "E2";
  if (avg < 3.5) return "E3";
  if (avg < 4.5) return "E4";
  return "E5";
}

function pctFromAverage(avg: number): number {
  if (!avg) return 0;
  return Math.round(((avg - 1) / 4) * 1000) / 10;
}

function summarizeDistribution(responses: Record<string, Stage>) {
  return Object.values(responses).reduce(
    (acc, stage) => {
      acc[stage] += 1;
      return acc;
    },
    { E1: 0, E2: 0, E3: 0, E4: 0, E5: 0, NA: 0 } as Record<Stage, number>,
  );
}

function narrativeForStage(stage: Stage): string {
  const map: Record<Stage, string> = {
    E1: "O eixo demonstra práticas elementares, concentradas em requisitos básicos ou atendimento legal, com baixa integração ao modelo de gestão.",
    E2: "O eixo apresenta iniciativas iniciais ou isoladas, ainda não integradas de forma satisfatória à gestão da organização.",
    E3: "O eixo já possui processos gerenciais estruturados, mecanismos de controle e evidências de integração ao sistema de gestão.",
    E4: "O eixo demonstra tratamento estratégico, com integração à tomada de decisão, metas, monitoramento e engajamento relevante das partes interessadas.",
    E5: "O eixo revela maturidade transformadora, protagonismo setorial, inovação e integração plena da agenda ESG ao negócio.",
    NA: "Não há dados suficientes para enquadramento.",
  };
  return map[stage];
}

function formatDateBR(date = new Date()) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function badgeClass(stage: Stage) {
  return `inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STAGE_BADGES[stage]}`;
}

function cardClass() {
  return "rounded-[28px] bg-white shadow-soft border border-slate-100";
}

export default function Page() {
  const [tab, setTab] = useState<"formulario" | "dashboard" | "diagnostico" | "relatorio">("formulario");
  const [company, setCompany] = useState("Empresa Exemplo Ltda.");
  const [responsavel, setResponsavel] = useState("Eduardo Piffer");
  const [email, setEmail] = useState("contato@empresa.com.br");
  const [segmento, setSegmento] = useState("Indústria / Serviços / Comércio");
  const [observacoes, setObservacoes] = useState("Preencha as respostas e gere o diagnóstico automaticamente.");
  const [responses, setResponses] = useState<Record<string, Stage>>(buildInitialResponses());

  const metrics = useMemo(() => {
    const axisResults = AXES.map((axis) => {
      const stages = axis.criteria.map((criterion) => responses[criterion]).filter((stage): stage is Exclude<Stage, "NA"> => stage !== "NA");
      const applicableStages = stages.map((stage) => STAGE_VALUES[stage]);
      const average = applicableStages.length ? applicableStages.reduce((a, b) => a + b, 0) / applicableStages.length : 0;
      const stage = getStageByAverage(average);
      return {
        ...axis,
        applicableStages,
        applicableCount: applicableStages.length,
        average,
        percentage: pctFromAverage(average),
        stage,
      };
    });

    const allApplicable = Object.values(responses)
      .filter((stage): stage is Exclude<Stage, "NA"> => stage !== "NA")
      .map((stage) => STAGE_VALUES[stage]);
    const overallAvg = allApplicable.length ? allApplicable.reduce((a, b) => a + b, 0) / allApplicable.length : 0;
    const overallStage = getStageByAverage(overallAvg);
    const distribution = summarizeDistribution(responses);
    const dominantStage = (["E5", "E4", "E3", "E2", "E1"] as Stage[])
      .sort((a, b) => distribution[b] - distribution[a])[0];
    const allAtLeastE3 = axisResults.flatMap((axis) => axis.applicableStages).every((value) => value >= 3);
    const hasE4EachAxis = axisResults.every((axis) => axis.applicableStages.some((value) => value >= 4));
    const declaration = allAtLeastE3 && hasE4EachAxis
      ? {
          type: "Declaração de Conformidade",
          rationale: "Todos os critérios aplicáveis atingiram no mínimo E3 e há pelo menos um critério em nível E4 ou superior em cada eixo.",
        }
      : {
          type: "Declaração de Compromisso",
          rationale: "A organização ainda está em processo de estruturação ou evolução de parte dos critérios ESG e, por isso, o enquadramento mais adequado é a Declaração de Compromisso.",
        };

    const weakCriteria = ALL_CRITERIA.filter(({ criterion }) => responses[criterion] === "E1" || responses[criterion] === "E2").map(({ axis, criterion }) => ({ axis, criterion, stage: responses[criterion] }));
    const strengths = ALL_CRITERIA.filter(({ criterion }) => responses[criterion] === "E4" || responses[criterion] === "E5").map(({ axis, criterion }) => ({ axis, criterion, stage: responses[criterion] }));

    return {
      axisResults,
      overallStage,
      overallPct: pctFromAverage(overallAvg),
      distribution,
      dominantStage,
      declaration,
      weakCriteria,
      strengths,
      completion: Math.round((Object.values(responses).filter((v) => v !== "NA").length / ALL_CRITERIA.length) * 100),
    };
  }, [responses]);

  const radarData = metrics.axisResults.map((axis) => ({ eixo: axis.title, score: axis.percentage }));
  const barData = metrics.axisResults.map((axis) => ({ eixo: axis.title, media: Number(axis.average.toFixed(2)) }));
  const pieData = (["E1", "E2", "E3", "E4", "E5"] as Stage[]).map((stage) => ({ name: stage, value: metrics.distribution[stage] || 0 }));

  const setResponse = (criterion: string, value: Stage) => setResponses((prev) => ({ ...prev, [criterion]: value }));
  const loadSample = () => setResponses({ ...buildInitialResponses(), ...SAMPLE_RESPONSES });
  const resetForm = () => setResponses(buildInitialResponses());

  const exportJson = () => {
    const payload = {
      empresa: company,
      responsavel,
      email,
      segmento,
      observacoes,
      respostas: responses,
      resultado: {
        nivel_geral: metrics.overallStage,
        score_percentual: metrics.overallPct,
        declaracao: metrics.declaration.type,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagnostico-esg-${company.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8">
      <section className="relative overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 p-6 text-white shadow-soft md:p-8">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute left-24 top-12 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-2">
                <Image src="/logo-sustence.png" alt="Sustence" width={120} height={55} priority className="h-auto w-[110px]" />
              </div>
              <div>
                <div className="text-lg font-semibold">Sustence</div>
                <div className="text-xs uppercase tracking-[0.22em] text-emerald-100/80">Soluções em Sustentabilidade</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">ABNT PE 487</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">App pronto para Vercel</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Diagnóstico ESG com relatório executivo</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85 md:text-base">
                Sistema para inserir respostas manualmente, calcular a maturidade ESG, visualizar gráficos e emitir relatório final com identidade visual da Sustence.
              </p>
            </div>
          </div>
          <div className="grid min-w-[280px] gap-3 md:grid-cols-2 lg:w-[380px]">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="text-xs text-emerald-100/80">Nível geral</div>
              <div className="mt-2 text-3xl font-semibold">{metrics.overallStage}</div>
              <div className="text-sm text-emerald-50/80">{STAGE_LABELS[metrics.overallStage]}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="text-xs text-emerald-100/80">Score ESG</div>
              <div className="mt-2 text-3xl font-semibold">{metrics.overallPct}%</div>
              <div className="text-sm text-emerald-50/80">Índice consolidado</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md md:col-span-2">
              <div className="text-xs text-emerald-100/80">Declaração sugerida</div>
              <div className="mt-2 text-xl font-semibold">{metrics.declaration.type}</div>
              <div className="text-sm text-emerald-50/80">Enquadramento automático</div>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-6 mb-6 grid gap-3 px-2 md:grid-cols-5 md:px-6">
        {[
          { label: "Predominância", value: metrics.dominantStage, sub: "Estágio mais recorrente" },
          { label: "Preenchimento", value: `${metrics.completion}%`, sub: "Critérios respondidos" },
          ...metrics.axisResults.map((axis) => ({ label: axis.title, value: axis.stage, sub: `${axis.percentage}% de maturidade` })),
        ].map((item) => (
          <div key={item.label} className={`${cardClass()} p-4`}>
            <div className="text-xs text-slate-500">{item.label}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</div>
            <div className="text-sm text-slate-600">{item.sub}</div>
          </div>
        ))}
      </section>

      <div className="no-print mb-6 flex flex-wrap gap-2">
        <button onClick={loadSample} className="inline-flex items-center rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
          <RefreshCcw className="mr-2 h-4 w-4" /> Carregar exemplo
        </button>
        <button onClick={resetForm} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">Limpar respostas</button>
        <button onClick={exportJson} className="inline-flex items-center rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
          <Download className="mr-2 h-4 w-4" /> Exportar JSON
        </button>
      </div>

      <div className="no-print mb-6 grid grid-cols-2 gap-2 rounded-3xl bg-transparent p-0 md:grid-cols-4">
        {[
          ["formulario", ClipboardList, "Formulário"],
          ["dashboard", BarChart3, "Dashboard"],
          ["diagnostico", Target, "Diagnóstico"],
          ["relatorio", FileText, "Relatório Final"],
        ].map(([value, Icon, label]) => {
          const SelectedIcon = Icon as typeof ClipboardList;
          return (
            <button
              key={value}
              onClick={() => setTab(value as typeof tab)}
              className={`inline-flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold ${tab === value ? "border-emerald-700 bg-emerald-700 text-white" : "border-emerald-100 bg-white text-slate-700"}`}
            >
              <SelectedIcon className="mr-2 h-4 w-4" /> {label}
            </button>
          );
        })}
      </div>

      {tab === "formulario" && (
        <div className="space-y-6">
          <section className={cardClass()}>
            <div className="flex items-center justify-between gap-4 p-6 pb-0">
              <div>
                <h2 className="text-2xl font-semibold">Dados da avaliação</h2>
                <p className="mt-1 text-sm text-slate-500">Informações do cliente, responsável e observações do diagnóstico.</p>
              </div>
              <div className="hidden rounded-2xl border border-slate-200 bg-white p-2 md:block">
                <Image src="/logo-sustence.png" alt="Sustence" width={110} height={50} className="h-auto w-[100px]" />
              </div>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
              <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Nome da organização" className="rounded-2xl border border-emerald-100 px-4 py-3" />
              <input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Responsável" className="rounded-2xl border border-emerald-100 px-4 py-3" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="rounded-2xl border border-emerald-100 px-4 py-3" />
              <input value={segmento} onChange={(e) => setSegmento(e.target.value)} placeholder="Segmento" className="rounded-2xl border border-emerald-100 px-4 py-3" />
              <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} placeholder="Observações gerais" className="rounded-2xl border border-emerald-100 px-4 py-3 md:col-span-2 xl:col-span-4" />
            </div>
          </section>

          {AXES.map((axis) => {
            const Icon = axis.icon;
            return (
              <section key={axis.key} className={cardClass()}>
                <div className="rounded-t-[28px] bg-gradient-to-r from-[#2F3A32] to-[#6E7F71] px-6 py-5 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{axis.title}</h3>
                      <p className="text-sm text-white/80">Selecione o estágio de maturidade de cada critério.</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 p-5 md:p-6">
                  {axis.criteria.map((criterion) => (
                    <div key={criterion} className="grid items-center gap-3 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-[1.8fr_220px]">
                      <div>
                        <div className="font-medium text-slate-900">{criterion}</div>
                        <div className="mt-2">
                          <span className={badgeClass(responses[criterion])}>{responses[criterion]} · {STAGE_LABELS[responses[criterion]]}</span>
                        </div>
                      </div>
                      <select value={responses[criterion]} onChange={(e) => setResponse(criterion, e.target.value as Stage)} className="rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                        {STAGES.map((stage) => (
                          <option key={stage} value={stage}>{stage} — {STAGE_LABELS[stage]}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {tab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className={cardClass()}>
              <div className="p-6 pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100"><Sparkles className="h-4 w-4 text-emerald-700" /></div>
                  <div>
                    <h2 className="text-xl font-semibold">Radar por eixo</h2>
                    <p className="text-sm text-slate-500">Percentual de maturidade por eixo ESG.</p>
                  </div>
                </div>
              </div>
              <div className="h-[340px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="eixo" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar dataKey="score" fill="#10b981" stroke="#047857" fillOpacity={0.45} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className={cardClass()}>
              <div className="p-6 pb-0">
                <h2 className="text-xl font-semibold">Distribuição dos estágios</h2>
                <p className="text-sm text-slate-500">Quantidade de respostas por nível E1 a E5.</p>
              </div>
              <div className="h-[340px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                      {pieData.map((entry, index) => <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <section className={cardClass()}>
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold">Comparativo por eixo</h2>
              <p className="text-sm text-slate-500">Média de maturidade por dimensão.</p>
            </div>
            <div className="h-[360px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="eixo" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="media" radius={[12, 12, 0, 0]} fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      {tab === "diagnostico" && (
        <div className="space-y-6">
          <section className="rounded-[28px] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <Target className="mt-1 h-5 w-5 text-emerald-800" />
              <div>
                <h2 className="text-xl font-semibold text-emerald-950">{metrics.declaration.type}</h2>
                <p className="mt-1 text-sm leading-7 text-emerald-900">{metrics.declaration.rationale}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            {metrics.axisResults.map((axis) => (
              <section key={axis.key} className={cardClass()}>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{axis.title}</h3>
                  <p className="text-sm text-slate-500">{axis.applicableCount} critérios aplicáveis</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span>Maturidade do eixo</span>
                    <span className={badgeClass(axis.stage)}>{axis.stage} · {STAGE_LABELS[axis.stage]}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${axis.percentage}%` }} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{narrativeForStage(axis.stage)}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {tab === "relatorio" && (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[32px] bg-white shadow-soft">
            <div className="bg-gradient-to-r from-slate-950 via-emerald-900 to-teal-800 px-8 py-10 text-white md:px-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-2 inline-block">
                    <Image src="/logo-sustence.png" alt="Sustence" width={120} height={55} className="h-auto w-[110px]" />
                  </div>
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-emerald-100/80">Avaliação e Diagnóstico de Maturidade ESG</div>
                    <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{company}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-emerald-50/85">Norma ABNT PE 487 · Relatório executivo automatizado com layout institucional da Sustence.</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-emerald-50/90 backdrop-blur-sm">
                  <div><strong>Data:</strong> {formatDateBR()}</div>
                  <div><strong>Responsável:</strong> {responsavel}</div>
                  <div><strong>E-mail:</strong> {email}</div>
                  <div><strong>Segmento:</strong> {segmento}</div>
                </div>
              </div>
            </div>
            <div className="space-y-8 p-8 md:p-10">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["Nível geral", metrics.overallStage, STAGE_LABELS[metrics.overallStage]],
                  ["Score ESG", `${metrics.overallPct}%`, "Baseado nos critérios aplicáveis"],
                  ["Predominância", metrics.dominantStage, "Estágio mais frequente"],
                  ["Declaração sugerida", metrics.declaration.type, "Análise automática do sistema"],
                ].map(([label, value, sub]) => (
                  <div key={label} className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 text-2xl font-semibold">{value}</div>
                    <div className="text-sm text-slate-600">{sub}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold">1. Introdução</h3>
                <p className="mt-3 leading-7 text-slate-700">
                  Este relatório apresenta o diagnóstico de maturidade ESG da organização com base nas respostas inseridas no sistema e na régua evolutiva da ABNT PE 487. O resultado consolida o desempenho nos eixos Ambiental, Social e de Governança, apontando estágio predominante, nível médio de maturidade, enquadramento declaratório e prioridades de evolução.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">2. Resultado consolidado</h3>
                <p className="mt-3 leading-7 text-slate-700">
                  A leitura consolidada indica maturidade ESG predominantemente em <strong>{metrics.dominantStage}</strong>, com enquadramento geral em <strong>{metrics.overallStage} – {STAGE_LABELS[metrics.overallStage]}</strong>. O sistema recomenda <strong>{metrics.declaration.type}</strong>, pois {metrics.declaration.rationale.toLowerCase()}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">3. Análise por eixo</h3>
                <div className="mt-4 space-y-4">
                  {metrics.axisResults.map((axis) => (
                    <div key={axis.key} className="rounded-2xl border p-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-lg font-semibold">{axis.title}</div>
                          <div className="text-sm text-slate-500">{axis.stage} · {STAGE_LABELS[axis.stage]}</div>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                          <div><strong>Score:</strong> {axis.percentage}%</div>
                          <div><strong>Critérios aplicáveis:</strong> {axis.applicableCount}</div>
                        </div>
                      </div>
                      <p className="mt-3 leading-7 text-slate-700">{narrativeForStage(axis.stage)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold">4. Pontos críticos e prioridades</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {metrics.weakCriteria.length === 0 ? (
                    <p className="leading-7 text-slate-700">Não foram identificados critérios em E1 ou E2 entre os itens aplicáveis.</p>
                  ) : (
                    metrics.weakCriteria.slice(0, 10).map((item) => (
                      <div key={item.criterion} className="rounded-2xl border p-4">
                        <div className="font-medium">{item.criterion}</div>
                        <div className="mt-1 text-sm text-slate-500">Eixo {item.axis} · {item.stage}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold">5. Conclusão</h3>
                <p className="mt-3 leading-7 text-slate-700">
                  Com base nas respostas registradas, a organização apresenta um estágio de maturidade ESG enquadrado em <strong>{metrics.overallStage} – {STAGE_LABELS[metrics.overallStage]}</strong>. Recomenda-se priorizar os critérios atualmente em E1 e E2, estruturando plano de ação com responsáveis, metas, indicadores e prazos, a fim de elevar a maturidade organizacional e ampliar a aderência aos critérios da ABNT PE 487.
                </p>
                <p className="mt-3 leading-7 text-slate-700"><strong>Observações do avaliador:</strong> {observacoes}</p>
              </div>
            </div>
          </section>

          <div className="no-print flex flex-wrap gap-3">
            <button onClick={() => window.print()} className="inline-flex items-center rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              <FileText className="mr-2 h-4 w-4" /> Imprimir / salvar em PDF
            </button>
            <button onClick={exportJson} className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
              <Download className="mr-2 h-4 w-4" /> Baixar dados do relatório
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
