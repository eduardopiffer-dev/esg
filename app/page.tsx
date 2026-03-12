"use client";

import { useMemo, useState } from "react";
import {
  ClipboardList,
  BarChart3,
  ShieldCheck,
  FileText,
  Sparkles,
  Mail,
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

const TABS = [
  { value: "formulario", label: "Formulário", icon: ClipboardList },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "diagnostico", label: "Diagnóstico", icon: ShieldCheck },
  { value: "relatorio", label: "Relatório", icon: FileText },
];

const ESG_LEVELS = [
  {
    code: "E1",
    title: "Elementar",
    description:
      "Estágio inicial, com práticas pontuais e baixa formalização.",
    color: "bg-red-50 border-red-200",
  },
  {
    code: "E2",
    title: "Não Integrado",
    description:
      "Há iniciativas e controles básicos, mas ainda sem integração à gestão.",
    color: "bg-orange-50 border-orange-200",
  },
  {
    code: "E3",
    title: "Gerencial",
    description:
      "A organização possui práticas estruturadas e controle de indicadores.",
    color: "bg-amber-50 border-amber-200",
  },
  {
    code: "E4",
    title: "Estratégico",
    description:
      "O ESG está integrado à estratégia e às decisões organizacionais.",
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    code: "E5",
    title: "Transformador",
    description:
      "A organização atua com protagonismo e inovação em ESG.",
    color: "bg-teal-50 border-teal-200",
  },
];

function buildInitialAnswers(): AnswerMap {
  const a: AnswerMap = {};
  ESG_QUESTIONS.forEach((q) => (a[q.id] = null));
  return a;
}

function stageToNumber(code: StageCode | null): number | null {
  if (!code) return null;
  return Number(code.replace("E", ""));
}

function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function percent(value: number | null) {
  if (!value) return 0;
  return Math.round((value / 5) * 100);
}

function maturityCode(value: number | null) {
  if (!value) return "—";
  if (value < 1.5) return "E1";
  if (value < 2.5) return "E2";
  if (value < 3.5) return "E3";
  if (value < 4.5) return "E4";
  return "E5";
}

function maturityLabel(value: number | null) {
  if (!value) return "Sem dados";
  if (value < 1.5) return "E1 — Elementar";
  if (value < 2.5) return "E2 — Não Integrado";
  if (value < 3.5) return "E3 — Gerencial";
  if (value < 4.5) return "E4 — Estratégico";
  return "E5 — Transformador";
}

export default function Page() {
  const [tab, setTab] = useState<TabValue>("formulario");
  const [answers, setAnswers] = useState(buildInitialAnswers());

  const metrics = useMemo(() => {
    const values = Object.values(answers)
      .map(stageToNumber)
      .filter((v): v is number => v !== null);

    const avg = average(values);

    return {
      overall: avg,
      percent: percent(avg),
      code: maturityCode(avg),
      label: maturityLabel(avg),
    };
  }, [answers]);

  const radarData = [
    { eixo: "Ambiental", score: metrics.percent },
    { eixo: "Governança", score: metrics.percent },
    { eixo: "Social", score: metrics.percent },
  ];

  function handleAnswer(id: string, code: StageCode) {
    setAnswers((prev) => ({
      ...prev,
      [id]: code,
    }));
  }

  return (
    <main className="mx-auto max-w-7xl p-8 space-y-8">

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-700 p-8 rounded-3xl text-white">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4"/>
          Sustence • Diagnóstico ESG
        </div>

        <h1 className="text-4xl font-bold mt-3">
          Diagnóstico ESG — Sustence
        </h1>

        <p className="mt-4 max-w-3xl text-sm">
          Apresentamos aqui um diagnóstico completo e gratuito para avaliação da
          maturidade ESG da sua organização conforme os critérios da ABNT PE 487.
        </p>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 p-4 rounded-xl">
            <div className="text-xs">Maturidade geral</div>
            <div className="text-xl font-bold">{metrics.label}</div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            <div className="text-xs">Score ESG</div>
            <div className="text-xl font-bold">{metrics.percent}%</div>
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value as TabValue)}
              className={`px-5 py-2 rounded-xl border ${
                tab === t.value ? "bg-slate-900 text-white" : "bg-white"
              }`}
            >
              <Icon className="w-4 h-4 inline mr-2" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "dashboard" && (
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Radar ESG</h2>

          <div className="h-80">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="eixo" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  dataKey="score"
                  stroke="#047857"
                  fill="#10b981"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "relatorio" && (
        <div className="bg-white rounded-2xl p-8 shadow space-y-8">
          <h2 className="text-2xl font-semibold">Relatório Executivo</h2>

          <div>
            <h3 className="text-lg font-semibold">Score ESG</h3>
            <p className="mt-2">
              A organização apresenta maturidade ESG{" "}
              <strong>{metrics.label}</strong>, com score de{" "}
              <strong>{metrics.percent}%</strong>.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Níveis de maturidade ESG
            </h3>

            <div className="grid md:grid-cols-5 gap-4">
              {ESG_LEVELS.map((lvl) => (
                <div
                  key={lvl.code}
                  className={`p-4 border rounded-xl ${lvl.color} ${
                    metrics.code === lvl.code
                      ? "ring-2 ring-slate-900"
                      : ""
                  }`}
                >
                  <div className="font-bold">{lvl.code}</div>
                  <div className="text-sm font-semibold">{lvl.title}</div>
                  <p className="text-xs mt-2">{lvl.description}</p>

                  {metrics.code === lvl.code && (
                    <div className="mt-2 text-xs font-semibold">
                      Nível atual
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <h3 className="font-semibold mb-2">
              Quer melhorar sua maturidade ESG?
            </h3>

            <p className="text-sm">
              A Sustence pode apoiar sua organização na evolução das práticas ESG.
            </p>

            <a
              href="mailto:contato@sustence.com.br"
              className="inline-flex mt-3 bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Mail className="w-4 h-4 mr-2"/>
              Falar com a Sustence
            </a>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-emerald-700 text-white px-5 py-2 rounded-xl"
          >
            Gerar PDF
          </button>
        </div>
      )}
    </main>
  );
}
