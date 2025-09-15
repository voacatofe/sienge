import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sienge Data Sync',
  description:
    'Aplicação containerizada para sincronização de dados da API Sienge com PostgreSQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
