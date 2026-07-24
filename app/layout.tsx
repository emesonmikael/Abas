import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Controle de Abastecimento NFC - Gestão de Frotas',
  description: 'Sistema de controle de abastecimento por cartão NFC com validação de hodômetro e autenticação do motorista por PIN.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="bg-[#0a0a0a] text-slate-200 min-h-screen antialiased selection:bg-amber-500 selection:text-black">{children}</body>
    </html>
  );
}
