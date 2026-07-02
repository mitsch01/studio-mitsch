import Footer from '@/components/Footer'
import Header from '@/components/Header'
import type { Locale } from '@/lib/locale'
import { localizedHref } from '@/lib/locale'
import { getStrings } from '@/lib/strings'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Post = {
  title: string
  excerpt: string
  publishedAt: string
  body: any[]
  coverImage: any
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = getStrings(locale as Locale)

  const post = await client.fetch<Post>(
    `*[_type == "post" && slug.current == $slug][0] {
      title, excerpt, publishedAt, body, coverImage
    }`,
    { slug }
  )

  if (!post) notFound()

  return (
    <div>
      <Header logoColor="black" burgerColor="black" />
      <main className="max-w-3xl mx-auto px-8 pt-48 py-section">
        {post.coverImage && (
          <div className="relative aspect-[17/9] w-full mb-section bg-gray-50">
            <Image
              src={urlFor(post.coverImage).url()}
              alt={post.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString(t.blog.dateLocale, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : ''}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-12 border-l-4 border-raspberry pl-6">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none">
          <PortableText value={post.body} />
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link
            href={localizedHref('/blog', locale as Locale)}
            className="text-sm uppercase tracking-widest font-bold text-black hover:text-raspberry transition-colors"
          >
            {t.blog.backToArticles}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}