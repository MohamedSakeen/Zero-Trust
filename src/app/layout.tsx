import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Zero Trust Exam Platform",
  description: "Secure university entrance examination system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body
        className="font-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
