// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FENYX",
  description: "Track your workouts with precision",
  icons: {
    icon: [
      // SVG como ícone principal
      {
        url: "/images/logo_fenyx.svg",
        type: "image/svg+xml",
        color: "#FF3333", // Cor vermelha do tema FENYX
      },
      // Fallback para browsers que não suportam SVG
      {
        url: "/favicon.ico",
        sizes: "32x32",
      },
    ],
    // SVG para a Apple (iOS irá converter automaticamente)
    apple: [
      {
        url: "/images/logo_fenyx.svg",
        type: "image/svg+xml",
        color: "#FF3333", // Cor vermelha do tema FENYX
      }
    ],
  },
  // Configurações adicionais úteis
  other: {
    "msapplication-TileColor": "#121214", // Cor do tema dark do FENYX
    "theme-color": "#121214",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  );
}