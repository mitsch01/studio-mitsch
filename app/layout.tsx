import { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Studio Mitsch",
    template: "%s | Studio Mitsch",
  },
  description: "Hamburg-based fullstack developer and designer spezialisiert auf Web- und App-Entwicklung. React, Next.js, Flutter, Dart, UI/UX.",
  keywords: [
    "Fullstack Entwicklung", "Frontend Entwicklung", "App Entwicklung",
    "React", "Next.js", "Flutter", "Dart", "UI/UX", "Tailwind CSS",
    "Hamburg", "Freelance Entwicklerin",
  ],
  authors: [{ name: "Miriam Schwartz" }],
  openGraph: {
    title: "Studio Mitsch",
    description: "Hamburg-based fullstack developer and designer spezialisiert auf Web- und App-Entwicklung.",
    url: "https://studio-mitsch.de",
    siteName: "Studio Mitsch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Mitsch",
    description: "Hamburg-based fullstack developer and designer spezialisiert auf Web- und App-Entwicklung.",
  },
  metadataBase: new URL("https://studio-mitsch.de"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const locale = headersList.get('x-locale') ?? 'de'

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}