import "./globals.css"
import Footer from "components/Footer"

export const metadata = {
  title: "Mitsch 🤍 Coding",
  description: "Portfolio Miriam Schwartz",
  keywords: "fullstack-development, frontend-development, react, nextjs",
  author: "Miriam Schwartz"
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className='min-h-screen flex flex-col'>
        <main className='flex-grow'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}