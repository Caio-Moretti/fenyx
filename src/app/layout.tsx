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
      {
        url: "/images/favicon.png",
        sizes: "32x32",
        type: "image/png",
      }
    ],
    apple: [
      {
        url: "/images/logo_fenyx.png",
        sizes: "180x180",
        type: "image/png",
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