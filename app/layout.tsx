import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sustence • Diagnóstico ESG",
  description: "Sistema de diagnóstico e maturidade ESG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
