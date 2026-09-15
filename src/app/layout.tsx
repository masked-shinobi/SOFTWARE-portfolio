import type { Metadata } from "next";
import { Inter, Fira_Code, Fredericka_the_Great } from "next/font/google";
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

const fredericka = Fredericka_the_Great({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fredericka",
  display: "swap",
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
    <html lang="en" className={`${inter.variable} ${firaCode.variable} ${fredericka.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Iceland&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
