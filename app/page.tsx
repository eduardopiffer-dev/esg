"use client";

import { useState } from "react";

type Stage = "E1" | "E2" | "E3" | "E4" | "E5";

type Question = {
  id: string;
  axis: "ambiental" | "social" | "governanca";
  title: string;
  options: {
    code: Stage;
    label: string;
  }[];
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    axis: "ambiental",
    title: "Gestão ambiental e impactos",
    options: [
      { code: "E1", label: "A empresa não possui gestão ambiental estruturada." },
      { code: "E2", label: "Existem ações ambientais isoladas sem gestão formal." },
      { code: "E3", label: "A empresa possui práticas ambientais básicas com algum controle." },
      { code: "E4", label: "A gestão ambiental está integrada às decisões estratégicas." },
      { code: "E5", label: "A organização lidera práticas ambientais e inovação sustentável." },
    ],
  },

  {
    id: "q2",
    axis: "social",
    title: "Gestão de pessoas e impacto social",
    options: [
      { code: "E1", label: "Não há políticas estruturadas de gestão social." },
      { code: "E2", label: "Existem iniciativas pontuais de responsabilidade social." },
      { code: "E3", label: "Políticas sociais básicas e gestão de pessoas estruturada." },
      { code: "E4", label: "A organização promove impacto social consistente." },
      { code: "E5", label: "A empresa atua como referência em impacto social positivo." },
    ],
  },

  {
    id: "q3",
    axis: "governanca",
    title: "Governança corporativa",
    options: [
      { code: "E1", label: "Não há estrutura de governança formal." },
      { code: "E2", label: "Existem algumas práticas administrativas básicas." },
      { code: "E3", label: "Processos de governança parcialmente estruturados." },
      { code: "E4", label: "Governança corporativa consolidada e transparente." },
      { code: "E5", label: "Governança estratégica com alto nível de integridade e transparência." },
    ],
  },
];

function stageValue(stage: Stage) {
  if (stage === "E1") return 1;
  if (stage === "E2") return 2;
  if (stage === "E3") return 3;
  if (stage === "E4") return 4;
  if (stage === "E5") return 5;
}

export default function Page() {
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<Record<string, Stage | null>>({
    q1: null,
    q2: null,
    q3: null,
  });

  const handleAnswer = (id: string, value: Stage) => {
    setAnswers({
      ...answers,
      [id]: value,
    });
  };

  const calculateScore = () => {
    const values = Object.values(answers)
      .filter(Boolean)
      .map((v) => stageValue(v as Stage));

    if (!values.length) return 0;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    return Math.round((avg / 5) * 100);
  };

  const score = calculateScore();

  const currentQuestion = QUESTIONS[step];

  if (step >= QUESTIONS.length) {
    return (
      <main className="max-w-3xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-6">
          Resultado do Diagnóstico ESG
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">

          <p className="text-lg">
            Score ESG:
          </p>

          <p className="text-4xl font-bold mt-2 mb-4">
            {score}%
          </p>

          <p className="text-gray-600 mb-6">
            Este score representa uma leitura inicial da maturidade ESG da organização.
          </p>

          <div className="bg-green-50 p-5 rounded-lg">
            <h3 className="font-semibold mb-2">
              Quer melhorar sua maturidade ESG?
            </h3>

            <p className="text-sm mb-3">
              A Sustence pode apoiar sua empresa no desenvolvimento de estratégias ESG,
              implementação de políticas e evolução da governança.
            </p>

            <a
              href="mailto:contato@sustence.com.br"
              className="bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Falar com a Sustence
            </a>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        Diagnóstico ESG — Sustence
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          {currentQuestion.title}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Assinale apenas 1 alternativa por quesito, em ordem crescente de maturidade ESG.
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((opt) => {

            const selected = answers[currentQuestion.id] === opt.code;

            return (
              <label
                key={opt.code}
                className={`block border p-4 rounded-lg cursor-pointer ${
                  selected ? "border-green-600 bg-green-50" : ""
                }`}
              >

                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={opt.code}
                  checked={selected}
                  onChange={() => handleAnswer(currentQuestion.id, opt.code)}
                  className="mr-2"
                />

                <strong>{opt.code}</strong> — {opt.label}

              </label>
            );
          })}
        </div>

        <div className="flex justify-between mt-6">

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border rounded"
            >
              Voltar
            </button>
          )}

          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Próxima
          </button>

        </div>

      </div>

    </main>
  );
}
