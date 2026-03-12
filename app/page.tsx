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
} from "lucide-react";

type TabValue = "formulario" | "dashboard" | "diagnostico" | "relatorio";
type AxisKey = "ambiental" | "social" | "governanca";
type StageCode = "E1" | "E2" | "E3" | "E4" | "E5" | "NA";

const STAGE_LABELS: Record<StageCode, string> = {
  E1: "Elementar",
  E2: "Não Integrado",
  E3: "Gerencial",
  E4: "Estratégico",
  E5: "Transformador",
  NA: "Não Aplicável",
};

const STAGE_VALUES: Record<Exclude<StageCode, "NA">, number> = {
  E1: 1,
  E2: 2,
  E3: 3,
  E4: 4,
  E5: 5,
};

const tabs = [
  { value: "formulario", label: "Formulário", icon: ClipboardList },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "diagnostico", label: "Diagnóstico", icon: ShieldCheck },
  { value: "relatorio", label: "Relatório", icon: FileText },
] as const;

const axes = [
  {
    key: "ambiental",
    title: "Ambiental",
    icon: Leaf,
    criteria: [
      "Adaptação às mudanças climáticas",
      "Conservação e uso sustentável da biodiversidade",
      "Economia circular",
      "Eficiência energética",
      "Gestão ambiental",
      "Gestão de resíduos",
      "Gestão de efluentes",
      "Mitigação de emissão de GEE",
      "Qualidade do ar",
      "Uso da água",
    ],
  },
  {
    key: "social",
    title: "Social",
    icon: Building2,
    criteria: [
      "Cultura e promoção de inclusão",
      "Desenvolvimento profissional",
      "Diálogo e engajamento social",
      "Impacto social",
      "Política de remuneração e benefícios",
      "Diversidade e equidade",
      "Qualidade de vida",
      "Relacionamento com consumidores",
      "Relacionamento com fornecedores",
      "Saúde e segurança ocupacional",
    ],
  },
  {
    key: "governanca",
    title: "Governança",
    icon: Landmark,
    criteria: [
      "Ambiente legal e regulatório",
      "Auditorias interna e externa",
      "Compliance, integridade e anticorrupção",
      "Controles internos",
      "Estrutura e composição da governança",
      "Gestão de riscos do negócio",
      "Privacidade de dados pessoais",
      "Relatórios ESG",
      "Prestação de contas",
    ],
  },
] as const;

type ResponseMap = Record<string, StageCode>;

function buildInitialResponses(): ResponseMap {
  const initial: ResponseMap = {};
  axes.forEach((axis) => {
    axis.criteria.forEach((criterion) => {
      initial[criterion] = "NA";
    });
  });
  return initial;
}

function codeToNumber(code: StageCode): number | null {
  if (code === "NA") return null;
  return STAGE_VALUES[code];
}

function getAxisAverage(criteria: readonly string[], responses: ResponseMap): number | null {
  const nums = criteria
    .map((criterion) => codeToNumber(responses[criterion]))
    .filter((value): value is number => value !== null);

  if (!nums.length) return null;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function getStageLabelFromAverage(avg: number | null): string {
  if (avg === null) return "Sem dados";
  if (avg < 1.5) return "E1 — Elementar";
  if (avg < 2.5) return "E2 — Não Integrado";
  if (avg < 3.5) return "E3 — Gerencial";
  if (avg < 4.5) return "E4 — Estratégico";
  return "E5 — Transformador";
}

function getOverallStage(avg: number | null): string {
  if (avg === null) return "Sem dados";
  if (avg < 1.5) return "Inicial";
  if (avg < 2.5) return "Em desenvolvimento";
  if (avg < 3.5) return "Estruturado";
  if (avg < 4.5) return "Avançado";
  return "Excelência";
}

function getPriority(avg: number | null): string {
  if (avg === null) return "Sem dados";
  if (avg < 2) return "Alta";
  if (avg < 3.5) return "Média";
  return "Baixa";
}

function getDeclaration(avg: number | null): string {
  if (avg === null) return "Sem dados";
  return avg >= 3 ? "Declaração de Conformidade" : "Declaração de Compromisso";
}

function percent(avg: number | null): number {
  if (avg === null) return 0;
  return Math.round((avg / 5) * 100);
}

export default function Page() {
  const [tab, setTab] = useState<TabValue>("formulario");
  const [empresa, setEmpresa] = useState("Empresa Exemplo Ltda.");
  const [responsavel, setResponsavel] = useState("Eduardo Piffer");
  const [email, setEmail] = useState("contato@empresa.com.br");
  const [segmento, setSegmento] = useState("Indústria / Serviços / Comércio");
  const [observacoes, setObservacoes] = useState(
    "Avaliação preliminar para diagnóstico de maturidade ESG."
  );

  const [responses, setResponses] = useState<ResponseMap>(buildInitialResponses());

  const axisAverages = useMemo(() => {
    return {
      ambiental: getAxisAverage(axes[0].criteria, responses),
      social: getAxisAverage(axes[1].criteria, responses),
      governanca: getAxisAverage(axes[2].criteria, responses),
    };
  }, [responses]);

  const overallAverage = useMemo(() => {
    const values = Object.values(axisAverages).filter(
      (value): value is number => value !== null
    );
    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }, [axisAverages]);

  const strongestAxis = useMemo(() => {
    const entries = Object.entries(axisAverages).filter(
      (entry) => entry[1] !== null
    ) as [AxisKey, number][];
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [axisAverages]);

  const weakestAxis = useMemo(() => {
    const entries = Object.entries(axisAverages).filter(
      (entry) => entry[1] !== null
    ) as [AxisKey, number][];
    if (!entries.length) return null;
    return entries.sort((a, b) => a[1] - b[1])[0];
  }, [axisAverages]);

  const setResponse = (criterion: string, code: StageCode) => {
    setResponses((prev) => ({
      ...prev,
      [criterion]: code,
    }));
  };

  const exportJson = () => {
    const payload = {
      empresa,
      responsavel,
      email,
      segmento,
      observacoes,
      respostas: responses,
      medias_por_eixo: axisAverages,
      media_geral: overallAverage,
      score_percentual: percent(overallAverage),
      estagio: getOverallStage(overallAverage),
      declaracao: getDeclaration(overallAverage),
      prioridade: getPriority(overallAverage),
      data_geracao: new Date().toISOString(),
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
      <div className="rounded-[28px] bg-gradient-to-r from-slate-950 via-emerald-900 to-teal-700 p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-bold md:text-5xl">
          Diagnóstico ESG — Sustence
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-emerald-50/90 md:text-base">
          Sistema de avaliação ESG com critérios detalhados por eixo, leitura
          consolidada e relatório executivo.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Estágio geral</div>
            <div className="mt-2 text-2xl font-bold">
              {getOverallStage(overallAverage)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Score ESG</div>
            <div className="mt-2 text-2xl font-bold">
              {percent(overallAverage)}%
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Declaração</div>
            <div className="mt-2 text-lg font-semibold">
              {getDeclaration(overallAverage)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs text-emerald-100/80">Prioridade</div>
            <div className="mt-2 text-2xl font-bold">
              {getPriority(overallAverage)}
            </div>
          </div>
        </div>
      </div>

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
        <div className="mt-6 space-y-6">
          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Dados da avaliação</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Nome da organização"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Responsável"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
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
                className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2 xl:col-span-4"
              />
            </div>
          </div>

          {axes.map(({ key, title, icon: Icon, criteria }) => (
            <div key={key} className="rounded-[28px] bg-white shadow-xl">
              <div className="rounded-t-[28px] bg-gradient-to-r from-emerald-700 to-teal-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <div>
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    <p className="text-sm text-white/80">
                      Responda cada critério deste eixo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-6">
                {criteria.map((criterion, index) => (
                  <div
                    key={criterion}
                    className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.6fr_260px]"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600 shadow-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="font-medium text-slate-900">
                            {criterion}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            Selecione E1 a E5 ou NA conforme a resposta.
                          </div>
                        </div>
                      </div>
                    </div>

                    <select
                      value={responses[criterion]}
                      onChange={(e) =>
                        setResponse(criterion, e.target.value as StageCode)
                      }
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    >
                      {(["E1", "E2", "E3", "E4", "E5", "NA"] as StageCode[]).map(
                        (code) => (
                          <option key={code} value={code}>
                            {code} — {STAGE_LABELS[code]}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                ))}

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm text-slate-500">Média do eixo</div>
                  <div className="mt-1 text-3xl font-bold">
                    {axisAverages[key] === null ? "-" : axisAverages[key]!.toFixed(2)}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {getStageLabelFromAverage(axisAverages[key])}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "dashboard" && (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {axes.map(({ key, title, icon: Icon }) => (
            <div key={key} className="rounded-[28px] bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <Icon className="h-5 w-5 text-emerald-700" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-slate-500">
                    {getStageLabelFromAverage(axisAverages[key])}
                  </p>
                </div>
              </div>
              <div className="text-4xl font-bold">{percent(axisAverages[key])}%</div>
              <div className="mt-2 text-sm text-slate-600">
                Média: {axisAverages[key] === null ? "-" : axisAverages[key]!.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "diagnostico" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Diagnóstico consolidado</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Estágio geral:</strong> {getOverallStage(overallAverage)}
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Score ESG:</strong> {percent(overallAverage)}%
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Declaração:</strong> {getDeclaration(overallAverage)}
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <strong>Prioridade:</strong> {getPriority(overallAverage)}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[28px] bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold">Maior destaque</h3>
              <p className="mt-3 text-slate-700">
                {strongestAxis
                  ? `O eixo com melhor desempenho é ${strongestAxis[0]}, com média ${strongestAxis[1].toFixed(
                      2
                    )}.`
                  : "Ainda não há dados suficientes."}
              </p>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold">Ponto prioritário</h3>
              <p className="mt-3 text-slate-700">
                {weakestAxis
                  ? `O eixo com maior necessidade de evolução é ${weakestAxis[0]}, com média ${weakestAxis[1].toFixed(
                      2
                    )}.`
                  : "Ainda não há dados suficientes."}
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "relatorio" && (
        <div className="mt-6 rounded-[28px] bg-white p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold">Relatório Executivo</h2>
          <p className="mt-4 text-slate-700">
            A organização <strong>{empresa}</strong> apresenta estágio geral{" "}
            <strong>{getOverallStage(overallAverage)}</strong>, com média ESG de{" "}
            <strong>
              {overallAverage === null ? "-" : overallAverage.toFixed(2)}
            </strong>{" "}
            e score consolidado de <strong>{percent(overallAverage)}%</strong>.
          </p>

          <div className="mt-6 space-y-4">
            {axes.map(({ key, title }) => (
              <div key={key} className="rounded-2xl border border-slate-200 p-4">
                <div className="text-lg font-semibold">{title}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {getStageLabelFromAverage(axisAverages[key])}
                </div>
                <div className="mt-2 text-slate-700">
                  Média: {axisAverages[key] === null ? "-" : axisAverages[key]!.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
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
        </div>
      )}
    </main>
  );
}
