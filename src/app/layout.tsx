import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vértice Carreiras — Recolocação Executiva Home Office",
  description:
    "Plataforma de recolocação profissional. Treinamento estratégico e vagas home office curadas para profissionais em transição.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-bg text-fg antialiased min-h-screen">{children}</body>
    </html>
  );
}
