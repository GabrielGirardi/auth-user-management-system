import { getSession } from "@/lib/auth";
import { ConfirmDialogProvider } from "@/hooks/use-confirm-dialog";
import { ReactQueryProvider } from "@/app/react-query-provider";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import Header from "@/layout/header";
import Footer from "@/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerenciador de Usuários",
  description: "Sistema para controle e gerenciamento de usuários",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <Toaster />
          <ConfirmDialogProvider />
          {session && <Header user={session.user} />}
          {children}
          {session && <Footer />}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
