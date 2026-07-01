import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import { Metadata } from "next"
import "./globals.css"


export const metadata: Metadata = {
  title: {
    default: "Studio Mitsch",
    template: "%s | Studio Mitsch",
  },
  description: "Hamburg-based fullstack developer and designer specialising in web and app development. React, Next.js, Flutter, Dart, UI/UX.",
  keywords: ["fullstack development", "frontend development", "app development", "React", "Next.js", "Flutter", "Dart", "UI/UX", "Tailwind CSS", "Hamburg", "freelance developer"],
  authors: [{ name: "Miriam Schwartz" }],
  openGraph: {
    title: "Studio Mitsch",
    description: "Hamburg-based fullstack developer and designer specialising in web and app development.",
    url: "https://studio-mitsch.de",
    siteName: "Studio Mitsch",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Mitsch",
    description: "Hamburg-based fullstack developer and designer specialising in web and app development.",
  },
  metadataBase: new URL("https://studio-mitsch.de"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <main className="flex-1 flex flex-col">{children}</main>
          </CartProvider>
        </AuthProvider>     
         </body>
    </html>
  )
}