import AuthProvider from "@/components/ui/auth-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Bangers } from "next/font/google";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuperRetro",
  description: "An App to Retro Your Work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bangers.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bangers&display=swap"
          rel="stylesheet"
        />
      </head>
      <AuthProvider>
        <body className={`${inter.className}`}>{children}</body>
      </AuthProvider>
    </html>
  );
}
