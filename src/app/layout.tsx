import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Sanjay Baskar — Portfolio",
  description:
    "Interactive Dual/Triple-Experience Portfolio Platform. Choose between Developer, Creative, and Story experiences.",
  openGraph: {
    title: "Sanjay Baskar — Portfolio",
    description:
      "Interactive Portfolio Platform — Developer, Creative, and Story experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body>{children}</body>
    </html>
  );
}
