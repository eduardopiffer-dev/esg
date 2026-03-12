"use client"

import { useState } from "react"
import { ClipboardList, BarChart3, ShieldCheck, FileText } from "lucide-react"

type TabValue = "formulario" | "dashboard" | "diagnostico" | "relatorio"

const tabs = [
  { value: "formulario", label: "Formulário", icon: ClipboardList },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "diagnostico", label: "Diagnóstico", icon: ShieldCheck },
  { value: "relatorio", label: "Relatório", icon: FileText },
] as const

export default function Page() {
  const [tab, setTab] = useState<TabValue>("formulario")

  const [respostas, setRespostas] = useState({
    ambiental: 0,
    social: 0,
    governanca: 0,
  })

  const handleChange = (campo: string, valor: number) => {
    setRespostas((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const media =
    (respostas.ambiental + respostas.social + respostas.governanca) / 3

  const nivel =
    media < 2
      ? "Inicial"
      : media < 3
      ? "Em desenvolvimento"
      : media < 4
      ? "Estruturado"
      : "Avançado"

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">

        <h1 className="text-3xl font-bold mb-6">
          Diagnóstico ESG — Sustence
        </h1>

        {/* Tabs */}

        <div className="flex gap-3 mb-8">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={String(value)}
              onClick={() => setTab(value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
                tab === value
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* FORMULÁRIO */}

        {tab === "formulario" && (
          <div className="space-y-6">

            <h2 className="text-xl font-semibold">
              Avaliação ESG
            </h2>

            <div>
              <label>Ambiental</label>
              <input
                type="range"
                min="0"
                max="5"
                value={respostas.ambiental}
                onChange={(e) =>
                  handleChange("ambiental", Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label>Social</label>
              <input
                type="range"
                min="0"
                max="5"
                value={respostas.social}
                onChange={(e) =>
                  handleChange("social", Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label>Governança</label>
              <input
                type="range"
                min="0"
                max="5"
                value={respostas.governanca}
                onChange={(e) =>
                  handleChange("governanca", Number(e.target.value))
                }
                className="w-full"
              />
            </div>

          </div>
        )}

        {/* DASHBOARD */}

        {tab === "dashboard" && (
          <div>

            <h2 className="text-xl font-semibold mb-4">
              Dashboard ESG
            </h2>

            <div className="grid grid-cols-3 gap-4">

              <div className="p-4 border rounded-xl">
                <p className="text-sm text-gray-500">Ambiental</p>
                <p className="text-2xl font-bold">
                  {respostas.ambiental}
                </p>
              </div>

              <div className="p-4 border rounded-xl">
                <p className="text-sm text-gray-500">Social</p>
                <p className="text-2xl font-bold">
                  {respostas.social}
                </p>
              </div>

              <div className="p-4 border rounded-xl">
                <p className="text-sm text-gray-500">Governança</p>
                <p className="text-2xl font-bold">
                  {respostas.governanca}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* DIAGNÓSTICO */}

        {tab === "diagnostico" && (
          <div>

            <h2 className="text-xl font-semibold mb-4">
              Diagnóstico ESG
            </h2>

            <p className="text-lg">
              Maturidade média:{" "}
              <strong>{media.toFixed(2)}</strong>
            </p>

            <p className="text-lg mt-2">
              Nível: <strong>{nivel}</strong>
            </p>

          </div>
        )}

        {/* RELATÓRIO */}

        {tab === "relatorio" && (
          <div>

            <h2 className="text-xl font-semibold mb-4">
              Relatório Final
            </h2>

            <p>
              A avaliação ESG indica nível de maturidade{" "}
              <strong>{nivel}</strong>, com média de{" "}
              <strong>{media.toFixed(2)}</strong>.
            </p>

            <p className="mt-4 text-gray-600">
              Recomenda-se a implementação de políticas estruturadas
              nas dimensões ambiental, social e de governança,
              alinhadas às diretrizes da ABNT PE 487.
            </p>

          </div>
        )}

      </div>
    </div>
  )
}
