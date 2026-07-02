import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Unsubscribed',
}

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const success = status === 'success'

  return (
   <div className="min-h-screen flex flex-col">
         <Header />
         <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-md mx-auto w-full">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-6">
          {success ? "You're unsubscribed" : 'Something went wrong'}
        </h1>
        <p className="text-gray-600 leading-relaxed mb-12">
          {success
            ? "You won't receive any more newsletter emails from Studio Mitsch. Sorry to see you go!"
            : "We couldn't process your unsubscribe request. Please try the link in your email again."}
        </p>
        <Link
          href="/"
          className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
        >
          ← Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  )
}