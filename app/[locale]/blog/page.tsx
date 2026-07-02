import Footer from '@/components/Footer'
import Header from '@/components/Header'
import type { Locale } from '@/lib/locale'
import { localizedHref } from '@/lib/locale'
import { getStrings } from '@/lib/strings'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import Image from 'next/image'
import Link from 'next/link'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  isPublished: boolean
  coverImage: any
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getStrings(locale as Locale)
  return {
    title: t.blog.heading,
    description: t.meta.blogDescription,
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = getStrings(locale as Locale)

  const posts = await client.fetch<Post[]>(
  `*[_type == "post" && isPublished == true && language == $locale] | order(publishedAt desc) {
    _id, title, slug, excerpt, publishedAt, coverImage
  }`,
  { locale },
  { cache: 'no-store' }
)

  return (
    <div className="min-h-screen flex flex-col">
      <Header logoColor="black" burgerColor="black" />
      <main className="flex-1 flex flex-col justify-center px-8 pt-48 pb-section max-w-2xl mx-auto w-full h-full">
        <h1 className="text-6xl md:text-7xl font-bold uppercase tracking-tight mb-16">
          {t.blog.heading}
        </h1>

        {posts.length === 0 ? (
          <p className="text-gray-400 uppercase tracking-widest text-sm">
            {t.blog.noPosts}
          </p>
        ) : (
          <ul className="flex flex-col gap-16">
            {posts.map((post) => (
              <li key={post._id}>
                <Link href={localizedHref(`/blog/${post.slug.current}`, locale as Locale)} className="group flex gap-8 items-stretch">

                  {post.coverImage && (
                    <div className="relative w-48 h-48 flex-shrink-0 bg-gray-50">
                      <Image
                        src={urlFor(post.coverImage).width(400).height(400).url()}
                        alt={post.title}
                        fill
                        className="object-contain object-left"
                        sizes="192px"
                      />
                    </div>
                  )}

                  <div className="flex flex-col justify-between flex-1 p-4">
                    <div>
                      {post.publishedAt && (
                        <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                          {new Date(post.publishedAt).toLocaleDateString(t.blog.dateLocale, {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                      <h2 className="text-3xl font-bold uppercase tracking-tight group-hover:text-raspberry transition-colors mb-3">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-600 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <span className="inline-block text-sm uppercase tracking-widest font-bold text-black group-hover:text-raspberry transition-colors">
                      {t.blog.readMore}
                    </span>
                  </div>

                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  )
}