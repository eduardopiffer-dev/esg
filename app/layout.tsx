import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Diagnóstico ESG | Sustence',
  description: 'Sistema de diagnóstico ESG com base na ABNT PE 487.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
