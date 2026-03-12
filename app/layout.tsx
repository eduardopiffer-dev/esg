import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sustence • Diagnóstico ESG",
  description:
    "Sistema de diagnóstico e maturidade ESG com relatório executivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen text-slate-900 antialiased">
        <div className="border-b border-emerald-100 bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center gap-4">
              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-2 shadow-sm">
                <img
                  src="/logo-sustence.png"
                  alt="Logo Sustence"
                  className="h-12 w-auto object-contain md:h-14"
                />
              </div>

              <div>
                <div className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                  Sustence
                </div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Soluções em Sustentabilidade
                </div>
              </div>
            </div>

            <div className="hidden rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 md:block">
              Plataforma de Diagnóstico ESG
            </div>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
