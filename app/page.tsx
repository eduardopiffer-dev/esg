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

const AXES = [
  {
    key: "ambiental",
    title: "Ambiental",
    icon: Leaf,
    criteria: [
      "Adaptação às mudanças climáticas",
      "Conservação da biodiversidade",
      "Economia circular",
      "Eficiência energética",
      "Gestão ambiental",
      "Gestão de resíduos",
      "Gestão de efluentes",
      "Mitigação de GEE",
      "Qualidade do ar",
      "Uso da água",
    ],
  },
  {
    key: "social",
    title: "Social",
    icon: Building2,
    criteria: [
      "Diversidade e inclusão",
      "Desenvolvimento profissional",
      "Engajamento social",
      "Impacto social",
      "Remuneração e benefícios",
      "Saúde e segurança",
      "Direitos humanos",
      "Relação com consumidores",
      "Relação com fornecedores",
    ],
  },
  {
    key: "governanca",
    title: "Governança",
    icon: Landmark,
    criteria: [
      "Compliance e anticorrupção",
      "Auditoria",
      "Controles internos",
      "Gestão de riscos",
      "Estrutura de governança",
      "Privacidade de dados",
      "Relatórios ESG",
      "Prestação de contas",
    ],
  },
] as const;

type ResponseMap = Record<string, StageCode>;

function buildInitialResponses(): ResponseMap {
  const r: ResponseMap = {};
  AXES.forEach((axis) => {
    axis.criteria.forEach((c) => (r[c] = "NA"));
  });
  return r;
}

function stageValue(code: StageCode): number | null {
  if (code === "NA") return null;
  return STAGE_VALUES[code];
}

function stageFromAverage(avg: number | null): string {
  if (avg === null) return "Sem dados";
  if (avg < 1.5) return "E1 — Elementar";
  if (avg < 2.5) return "E2 — Não Integrado";
  if (avg < 3.5) return "E3 — Gerencial";
  if (avg < 4.5) return "E4 — Estratégico";
  return "E5 — Transformador";
}

function overallStage(avg: number | null): string {
  if (avg === null) return "Sem dados";
  if (avg < 1.5) return "Inicial";
  if (avg < 2.5) return "Em desenvolvimento";
  if (avg < 3.5) return "Estruturado";
  if (avg < 4.5) return "Avançado";
  return "Excelência";
}

export default function Page() {
  const [tab, setTab] = useState<TabValue>("formulario");

  const [responses, setResponses] = useState<ResponseMap>(buildInitialResponses());

  const metrics = useMemo(() => {
    const axisAverages: Record<AxisKey, number | null> = {
      ambiental: null,
      social: null,
      governanca: null,
    };

    AXES.forEach((axis) => {
      const values = axis.criteria
        .map((c) => stageValue(responses[c]))
        .filter((v): v is number => v !== null);

      axisAverages[axis.key] =
        values.length > 0 ? values.reduce((a, b) => a + b) / values.length : null;
    });

    const overallValues = Object.values(axisAverages).filter(
      (v): v is number => v !== null
    );

    const overallAverage =
      overallValues.length > 0
        ? overallValues.reduce((a, b) => a + b) / overallValues.length
        : null;

    return {
      axisAverages,
      overallAverage,
      stage: overallStage(overallAverage),
    };
  }, [responses]);

  const setResponse = (criterion: string, code: StageCode) => {
    setResponses((prev) => ({ ...prev, [criterion]: code }));
  };

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-10">

      <h1 className="text-3xl font-bold">Diagnóstico ESG — Sustence</h1>

      <div className="flex gap-4">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-4 py-2 rounded-lg ${
              tab === value ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "formulario" && (
        <div className="space-y-10">
          {AXES.map((axis) => (
            <div key={axis.key} className="border rounded-xl p-6 space-y-4">

              <h2 className="text-xl font-semibold">{axis.title}</h2>

              {axis.criteria.map((criterion) => (
                <div key={criterion} className="flex justify-between items-center">

                  <div>{criterion}</div>

                  <select
                    value={responses[criterion]}
                    onChange={(e) =>
                      setResponse(criterion, e.target.value as StageCode)
                    }
                    className="border rounded px-3 py-2"
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

              <div className="pt-4 font-semibold">
                Média do eixo:{" "}
                {metrics.axisAverages[axis.key] === null
                  ? "-"
                  : metrics.axisAverages[axis.key]?.toFixed(2)}
              </div>

            </div>
          ))}
        </div>
      )}

      {tab === "dashboard" && (
        <div className="space-y-4">

          {AXES.map((axis) => (
            <div key={axis.key} className="border p-6 rounded-xl">

              <h3 className="font-semibold">{axis.title}</h3>

              <div className="text-2xl font-bold">
                {metrics.axisAverages[axis.key] === null
                  ? "-"
                  : metrics.axisAverages[axis.key]?.toFixed(2)}
              </div>

              <div>{stageFromAverage(metrics.axisAverages[axis.key])}</div>

            </div>
          ))}

        </div>
      )}

      {tab === "diagnostico" && (
        <div className="border rounded-xl p-6">

          <h2 className="text-xl font-semibold">Diagnóstico</h2>

          <p className="mt-4">
            Estágio geral: <strong>{metrics.stage}</strong>
          </p>

          <p>
            Média ESG:{" "}
            <strong>
              {metrics.overallAverage === null
                ? "-"
                : metrics.overallAverage.toFixed(2)}
            </strong>
          </p>

        </div>
      )}

      {tab === "relatorio" && (
        <div className="border rounded-xl p-6 space-y-4">

          <h2 className="text-xl font-semibold">Relatório Executivo</h2>

          <p>
            A organização apresenta estágio geral <strong>{metrics.stage}</strong>{" "}
            com média ESG{" "}
            <strong>
              {metrics.overallAverage === null
                ? "-"
                : metrics.overallAverage.toFixed(2)}
            </strong>
          </p>

          <button
            onClick={() => window.print()}
            className="bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Exportar PDF
          </button>

        </div>
      )}
    </main>
  );
}
